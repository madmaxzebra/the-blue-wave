<?php
declare(strict_types=1);

/**
 * Drop-in replacement for thebluewave-subscribers/register.php
 * Holidays signups: no old World Cup welcome (welcomeSent false — use send-welcome.php or holidayseason API).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

require_once __DIR__ . '/welcome-subscriber-mail.php';
$config = is_file(__DIR__ . '/config.php') ? (include __DIR__ . '/config.php') : [];
if (!is_array($config)) {
    $config = [];
}

$data = json_decode((string) file_get_contents('php://input'), true);
$email = strtolower(trim((string) (is_array($data) ? ($data['email'] ?? '') : '')));
$source = trim((string) (is_array($data) ? ($data['source'] ?? 'signup') : 'signup'));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_email']);
    exit;
}

$dataFile = is_file(__DIR__ . '/data/subscribers.json')
    ? __DIR__ . '/data/subscribers.json'
    : __DIR__ . '/subscribers.json';

$subscribers = [];
if (is_file($dataFile)) {
    $decoded = json_decode((string) file_get_contents($dataFile), true);
    if (is_array($decoded) && isset($decoded['subscribers']) && is_array($decoded['subscribers'])) {
        $subscribers = $decoded['subscribers'];
    } elseif (is_array($decoded) && array_is_list($decoded)) {
        $subscribers = $decoded;
    }
}

$added = true;
foreach ($subscribers as $row) {
    if (is_array($row) && strtolower(trim((string) ($row['email'] ?? ''))) === $email) {
        $added = false;
        break;
    }
}

if ($added) {
    $subscribers[] = [
        'email' => $email,
        'createdAt' => gmdate('c'),
        'source' => $source !== '' ? $source : 'signup',
    ];
    $dir = dirname($dataFile);
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    @file_put_contents(
        $dataFile,
        json_encode(['subscribers' => $subscribers, 'updatedAt' => gmdate('c')], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
        LOCK_EX,
    );
}

$countRaw = @file_get_contents('https://www.thebluewavefans.com/thebluewave-subscribers/count.php');
$count = null;
if ($countRaw !== false) {
    $countJson = json_decode($countRaw, true);
    if (is_array($countJson)) {
        $count = (int) ($countJson['count'] ?? $countJson['subscriberCount'] ?? 0);
    }
}
if ($count === null || $count < 1) {
    $count = 5155 + count($subscribers);
}

$isHoliday = stripos($source, 'holiday') !== false;
$welcomeSent = false;
if ($added && !$isHoliday) {
    $welcomeSent = holiday_deliver_welcome($email, $config);
}

echo json_encode([
    'ok' => true,
    'added' => $added,
    'welcomeSent' => $welcomeSent,
    'count' => $count,
    'subscriberCount' => $count,
], JSON_UNESCAPED_UNICODE);