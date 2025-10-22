<?php
// Centralized MySQLi connection for the application
// XAMPP defaults: root user, no password, localhost

declare(strict_types=1);

function get_mysqli_connection(): mysqli {
	// Use environment variables for production, fallback to local for development
	$dbHost = $_ENV['DB_HOST'] ?? '127.0.0.1';
	$dbUser = $_ENV['DB_USER'] ?? 'root';
	$dbPass = $_ENV['DB_PASS'] ?? '';
	$dbName = $_ENV['DB_NAME'] ?? 'coffeeshop_db';

	$mysqli = @new mysqli($dbHost, $dbUser, $dbPass, $dbName);
	if ($mysqli->connect_errno) {
		http_response_code(500);
		echo json_encode(['success' => false, 'message' => 'Database connection failed']);
		exit;
	}

	// Use utf8mb4 for full Unicode support
	$mysqli->set_charset('utf8mb4');

return $mysqli;
}