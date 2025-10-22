<?php
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
// CORS: allow frontend (e.g., Vite on 5173) to call this API
// Adjust the allowed origin if you want to restrict it
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Vary: Origin');
header('Access-Control-Allow-Credentials: false');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Handle CORS preflight quickly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Ensure PHP warnings/notices are converted to JSON errors (avoid HTML output)
ini_set('display_errors', '0');
error_reporting(E_ALL);

set_error_handler(function ($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return false; // respect @ operator
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
    exit;
});

set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server exception']);
    exit;
});

require_once __DIR__ . '/../includes/db.php';

// Resolve route: prefer ?route=..., otherwise infer from script name (e.g., subscribe.php)
$route = isset($_GET['route']) ? strtolower(trim($_GET['route'])) : '';
if ($route === '') {
	$scriptName = basename($_SERVER['SCRIPT_NAME']);
	$route = strtolower(pathinfo($scriptName, PATHINFO_FILENAME));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
	exit;
}

// Read JSON body with form fallback
$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);
if (!is_array($data)) {
	$data = $_POST; // fallback for form-encoded
}

function handle_subscribe(array $data): void {
	$email = isset($data['email']) ? trim((string)$data['email']) : '';
	if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
		http_response_code(422);
		echo json_encode(['success' => false, 'message' => 'Valid email is required']);
		return;
	}
	$mysqli = get_mysqli_connection();

	// Prevent duplicates even if DB index is missing
	$check = $mysqli->prepare('SELECT 1 FROM `subscribe` WHERE `email` = ? LIMIT 1');
	if ($check) {
		$check->bind_param('s', $email);
		if ($check->execute()) {
			$check->store_result();
			if ($check->num_rows > 0) {
				$check->close();
				$mysqli->close();
				http_response_code(409);
				echo json_encode(['success' => false, 'message' => 'This email is already subscribed.']);
				return;
			}
		}
		$check->close();
	}
	$stmt = $mysqli->prepare('INSERT INTO `subscribe` (`email`) VALUES (?)');
	if (!$stmt) {
		http_response_code(500);
		echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
		$mysqli->close();
		return;
	}
	$stmt->bind_param('s', $email);
	if (!$stmt->execute()) {
		if ($mysqli->errno === 1062) {
			// Duplicate email
			http_response_code(409);
			echo json_encode(['success' => false, 'message' => 'This email is already subscribed.']);
		} else {
			http_response_code(500);
			echo json_encode(['success' => false, 'message' => 'Failed to save subscription']);
		}
		$stmt->close();
		$mysqli->close();
		return;
	}
	$stmt->close();
	$mysqli->close();
	echo json_encode(['success' => true, 'message' => 'Subscription successful']);
}

function handle_contact(array $data): void {
	$name = isset($data['name']) ? trim((string)$data['name']) : '';
	$email = isset($data['email']) ? trim((string)$data['email']) : '';
	$message = isset($data['message']) ? trim((string)$data['message']) : '';
	if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
		http_response_code(422);
		echo json_encode(['success' => false, 'message' => 'Name, valid email, and message are required']);
		return;
	}
	$mysqli = get_mysqli_connection();
	// Match existing schema: table `contact` with columns (name, email, message)
	$stmt = $mysqli->prepare('INSERT INTO `contact` (`name`, `email`, `message`) VALUES (?, ?, ?)');
	if (!$stmt) {
		// Likely table missing or SQL error
		error_log('CONTACT PREPARE ERROR: ' . $mysqli->error . ' (errno ' . $mysqli->errno . ')');
		http_response_code(500);
		$messageOut = ($mysqli->errno === 1146) ? 'Server misconfigured: `contact_messages` table is missing.' : 'Failed to prepare contact insert.';
		echo json_encode(['success' => false, 'message' => $messageOut, 'code' => $mysqli->errno]);
		$mysqli->close();
		return;
	}
	$stmt->bind_param('sss', $name, $email, $message);
	if (!$stmt->execute()) {
		error_log('CONTACT EXECUTE ERROR: ' . $stmt->error . ' (errno ' . $stmt->errno . ')');
		http_response_code(500);
		$messageOut = ($stmt->errno === 1146) ? 'Server misconfigured: `contact_messages` table is missing.' : 'Failed to save message';
		echo json_encode(['success' => false, 'message' => $messageOut, 'code' => $stmt->errno]);
		$stmt->close();
		$mysqli->close();
		return;
	}
	$stmt->close();
	$mysqli->close();
	echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
}

// feedback feature removed

function handle_order(array $data): void {
    $items = isset($data['items']) && is_array($data['items']) ? $data['items'] : [];
    $customerName = isset($data['customerName']) ? trim((string)$data['customerName']) : 'Guest';
    if (count($items) === 0) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'Order items are required']);
        return;
    }

    $orderTotal = 0.0;
    $normalizedItems = [];
    foreach ($items as $i) {
        $name = isset($i['name']) ? trim((string)$i['name']) : '';
        $price = isset($i['price']) ? floatval($i['price']) : 0.0;
        $qty = isset($i['quantity']) ? intval($i['quantity']) : 0;
        if ($name === '' || $price < 0 || $qty <= 0) {
            continue;
        }
        $lineTotal = $price * $qty;
        $orderTotal += $lineTotal;
        $normalizedItems[] = [
            'name' => $name,
            'price' => $price,
            'quantity' => $qty,
            'line_total' => $lineTotal,
        ];
    }
    if (count($normalizedItems) === 0) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'No valid items found']);
        return;
    }

    // Match existing schema but save ONE row per user order with summarized line
    $productList = [];
    $totalQuantity = 0;
    foreach ($normalizedItems as $it) {
        $productList[] = $it['name'] . ' x' . $it['quantity'];
        $totalQuantity += $it['quantity'];
    }
    $productSummary = implode(', ', $productList);

    $mysqli = get_mysqli_connection();
    $stmt = $mysqli->prepare('INSERT INTO `orders` (`customer_name`, `product`, `quantity`, `total`) VALUES (?, ?, ?, ?)');
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to prepare order statement']);
        $mysqli->close();
        return;
    }
    $stmt->bind_param('ssid', $customerName, $productSummary, $totalQuantity, $orderTotal);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save order']);
        $stmt->close();
        $mysqli->close();
        return;
    }
    $stmt->close();
    $mysqli->close();
    echo json_encode(['success' => true, 'message' => 'Order placed successfully', 'total' => $orderTotal, 'items' => count($normalizedItems), 'summary' => $productSummary]);
}

switch ($route) {
	case 'subscribe':
		handle_subscribe($data);
		break;
	case 'contact':
		handle_contact($data);
		break;
	case 'order':
		handle_order($data);
		break;
	default:
		http_response_code(404);
		echo json_encode(['success' => false, 'message' => 'Unknown route']);
		break;
}

exit;
