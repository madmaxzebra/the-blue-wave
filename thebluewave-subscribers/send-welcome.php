<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/welcome-subscriber-mail.php';

$config = is_file(__DIR__ . '/config.php') ? (include __DIR__ . '/config.php') : [];
if (!is_array($config)) {
    $config = [];
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
$email = strtolower(trim((string) (is_array($data) ? ($data['email'] ?? '') : '')));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_email']);
    exit;
}

$sent = holiday_deliver_welcome($email, $config);
echo json_encode(['ok' => true, 'welcomeSent' => $sent], JSON_UNESCAPED_UNICODE);