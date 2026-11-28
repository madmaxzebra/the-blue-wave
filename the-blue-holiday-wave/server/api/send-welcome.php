<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
require_once __DIR__ . '/claim-mail.php';
require_once __DIR__ . '/welcome-subscriber-mail.php';

$config = api_boot();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'Use POST with a JSON body: {"email":"you@example.com"}');
}

$data = body();
$email = strtolower(trim((string) ($data['email'] ?? '')));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(400, 'Please enter a valid email address.');
}

$site = site_url($config);
$subject = welcome_subscriber_subject();
$text = welcome_subscriber_text($email, $site);
$html = welcome_subscriber_html($email, $site);
$sent = deliver_mail($email, $subject, $text, $html, $config);

echo json_encode([
    'ok' => true,
    'welcomeSent' => $sent,
], JSON_UNESCAPED_UNICODE);