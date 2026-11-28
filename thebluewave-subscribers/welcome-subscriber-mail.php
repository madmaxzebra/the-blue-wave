<?php
declare(strict_types=1);

/**
 * Shared welcome email for Blue Holidays Wave signups.
 * Copy this file and send-welcome.php into public_html/thebluewave-subscribers/ on Bluehost.
 */

const HOLIDAY_SITE_URL = 'https://www.thebluewavefans.com/holidayseason';
const HOLIDAY_WAVE_LAUNCH_LABEL = '10 December 2026';

function holiday_mail_e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function holiday_mail_header_text(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function welcome_subscriber_subject(): string
{
    return 'Welcome to the Blue Holidays Wave ✨';
}

function welcome_subscriber_logo_url(): string
{
    return HOLIDAY_SITE_URL . '/holiday-media/holidays-blue-wave-logo.png';
}

function welcome_subscriber_text(string $email): string
{
    $lines = [
        'Welcome to the Blue Holidays Wave!',
        '',
        "Thank you for joining us — you're on the list with: {$email}",
        '',
        'This season we are gathering the best of Curaçao in one place: Fashion & Lifestyle, Real Estate, and Culinair.',
        '',
        'We go fully live on ' . HOLIDAY_WAVE_LAUNCH_LABEL . '.',
        '',
        'Open the Holidays Wave:',
        HOLIDAY_SITE_URL . '/',
        '',
        'Warm regards,',
        'The Holidays Blue Wave Team',
        'Curaçao',
    ];
    return implode("\n", $lines);
}

function welcome_subscriber_html(string $email): string
{
    $safeEmail = holiday_mail_e($email);
    $logo = holiday_mail_e(welcome_subscriber_logo_url());
    $home = holiday_mail_e(HOLIDAY_SITE_URL . '/');
    $launch = holiday_mail_e(HOLIDAY_WAVE_LAUNCH_LABEL);

    return <<<HTML
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#061833;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#061833;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0a2a5c;border:1px solid #6b5a2e;border-radius:18px;">
<tr><td style="padding:28px 24px 8px;text-align:center;">
<img src="{$logo}" alt="The Holidays Blue Wave" width="300" style="max-width:92%;height:auto;" />
</td></tr>
<tr><td style="padding:8px 28px 0;text-align:center;">
<h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#fff;">You're on the list for the holidays in Cura&ccedil;ao</h1>
</td></tr>
<tr><td style="padding:16px 28px 0;font-size:16px;line-height:1.65;color:#f7f3ec;">
<p style="margin:0 0 14px;">Thank you for joining the <strong style="color:#fff;">Blue Holidays Wave</strong>. We registered you with <strong style="color:#d4a84b;">{$safeEmail}</strong>.</p>
<p style="margin:0;color:#cdd6e6;">Your guide to Fashion &amp; Lifestyle, Real Estate, and Culinair this season — real partners and real photos from Cura&ccedil;ao.</p>
</td></tr>
<tr><td style="padding:22px 28px 0;text-align:center;">
<p style="margin:0 0 16px;font-size:15px;color:#cdd6e6;">We spotlight the guide on <strong style="color:#fff;">{$launch}</strong>. Explore early now; we will email you when big updates land.</p>
<a href="{$home}" style="display:inline-block;padding:16px 30px;border-radius:999px;background:linear-gradient(135deg,#f6d878,#d4a84b 55%,#a77b22);color:#2a1c00;font-weight:bold;text-decoration:none;font-size:15px;">Explore the Holidays Wave</a>
</td></tr>
<tr><td style="padding:28px 28px 24px;font-size:12px;line-height:1.5;color:#8fa0bd;border-top:1px solid #1d3f73;">
Warm regards,<br><strong style="color:#d4a84b;">The Holidays Blue Wave Team</strong> · Cura&ccedil;ao
</td></tr>
</table>
</td></tr></table>
</body>
</html>
HTML;
}

/** @param array{MAIL_FROM?:string,ADMIN_EMAIL?:string} $config */
function holiday_deliver_welcome(string $to, array $config): bool
{
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    $from = (string) ($config['MAIL_FROM'] ?? '');
    if (!filter_var($from, FILTER_VALIDATE_EMAIL)) {
        $host = preg_replace('/^www\./', '', (string) ($_SERVER['HTTP_HOST'] ?? 'thebluewavefans.com'));
        $from = 'noreply@' . $host;
    }
    $subject = welcome_subscriber_subject();
    $text = welcome_subscriber_text($to);
    $html = welcome_subscriber_html($to);
    $boundary = 'bhw_' . bin2hex(random_bytes(8));
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . holiday_mail_header_text('The Holidays Blue Wave') . " <{$from}>",
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];
    $admin = (string) ($config['ADMIN_EMAIL'] ?? '');
    if (filter_var($admin, FILTER_VALIDATE_EMAIL)) {
        $headers[] = "Reply-To: {$admin}";
    }
    $body = "--{$boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n{$text}\r\n"
        . "--{$boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n{$html}\r\n"
        . "--{$boundary}--\r\n";
    return @mail($to, holiday_mail_header_text($subject), $body, implode("\r\n", $headers), '-f' . $from);
}