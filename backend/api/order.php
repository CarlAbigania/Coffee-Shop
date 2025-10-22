<?php
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
	exit;
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

// Support form-encoded fallback
if (!is_array($data)) {
	$data = [
		'items' => isset($_POST['items']) ? $_POST['items'] : [],
		'customerName' => isset($_POST['customerName']) ? $_POST['customerName'] : null,
		'customerEmail' => isset($_POST['customerEmail']) ? $_POST['customerEmail'] : null,
	];
}

$items = isset($data['items']) && is_array($data['items']) ? $data['items'] : [];
$customerName = isset($data['customerName']) ? trim($data['customerName']) : null;
$customerEmail = isset($data['customerEmail']) ? trim($data['customerEmail']) : null;

if (count($items) === 0) {
	http_response_code(422);
	echo json_encode(['success' => false, 'message' => 'Order items are required']);
	exit;
}

// Compute totals safely server-side
$orderTotal = 0.0;
$normalizedItems = [];
foreach ($items as $i) {
	$name = isset($i['name']) ? trim($i['name']) : '';
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
	exit;
}

require_once __DIR__ . '/../includes/db.php';
$mysqli = get_mysqli_connection();

// Insert order
$stmtOrder = $mysqli->prepare('INSERT INTO `orders` (`customer_name`, `customer_email`, `total_amount`) VALUES (?, ?, ?)');
if (!$stmtOrder) {
	http_response_code(500);
	echo json_encode(['success' => false, 'message' => 'Failed to prepare order statement']);
	$mysqli->close();
	exit;
}

$stmtOrder->bind_param('ssd', $customerName, $customerEmail, $orderTotal);
if (!$stmtOrder->execute()) {
	http_response_code(500);
	echo json_encode(['success' => false, 'message' => 'Failed to save order']);
	$stmtOrder->close();
	$mysqli->close();
	exit;
}

$orderId = $stmtOrder->insert_id;
$stmtOrder->close();

// Insert items
$stmtItem = $mysqli->prepare('INSERT INTO `order_items` (`order_id`, `item_name`, `unit_price`, `quantity`, `line_total`) VALUES (?, ?, ?, ?, ?)');
if (!$stmtItem) {
	http_response_code(500);
	echo json_encode(['success' => false, 'message' => 'Failed to prepare item statement']);
	$mysqli->close();
	exit;
}

foreach ($normalizedItems as $it) {
	$stmtItem->bind_param('isdid', $orderId, $it['name'], $it['price'], $it['quantity'], $it['line_total']);
	if (!$stmtItem->execute()) {
		http_response_code(500);
		echo json_encode(['success' => false, 'message' => 'Failed to save order items']);
		$stmtItem->close();
		$mysqli->close();
		exit;
	}
}

$stmtItem->close();
$mysqli->close();

echo json_encode(['success' => true, 'message' => 'Order placed successfully', 'orderId' => $orderId, 'total' => $orderTotal]);
exit;
?>


