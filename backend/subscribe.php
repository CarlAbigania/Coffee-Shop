<?php
// CORS headers for legacy endpoint; delegate to API router on POST
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(204);
	exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	require_once __DIR__ . '/api/index.php';
	exit;
}

header('Content-Type: text/plain');
echo 'Use POST to subscribe via this endpoint.';
?>


