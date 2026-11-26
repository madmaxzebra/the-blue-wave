<?php
declare(strict_types=1);

// The "thank you, we received your claim" email that goes to the page owner
// the moment they send the claim form.

const PRICE_FIRST_PERIOD = 'XCG 175,-';
const PRICE_FIRST_PERIOD_UNTIL = 'the end of January 2027';
const PRICE_MONTHLY = 'XCG 49,50';
const CONFIRM_WITHIN_HOURS = 4;

function mail_e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function mail_header_text(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function mail_from_address(array $config): string
{
    $from = (string) ($config['MAIL_FROM'] ?? '');
    if (filter_var($from, FILTER_VALIDATE_EMAIL)) {
        return $from;
    }
    $host = preg_replace('/^www\./', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost'));
    $host = preg_replace('/:\d+$/', '', $host) ?? 'localhost';
    return 'noreply@' . (preg_match('/^[a-z0-9.-]+$/i', $host) ? $host : 'localhost');
}

function claim_mail_subject(string $pageName): string
{
    return "Thank you! Your claim for {$pageName} is in \u{2726}";
}

function claim_mail_text(string $firstName, string $pageName, string $email, bool $canReply): string
{
    $hours = CONFIRM_WITHIN_HOURS;
    $price1 = PRICE_FIRST_PERIOD;
    $until = PRICE_FIRST_PERIOD_UNTIL;
    $price2 = PRICE_MONTHLY;
    $reply = $canReply ? "\nQuestions? Just reply to this email and we will help you.\n" : '';

    return <<<TXT
Thank you, {$firstName}!

We received your request to claim "{$pageName}" on The Blue Holiday Wave.

WHAT HAPPENS NOW
Your request is being processed. We will confirm it within a maximum of {$hours} hours, and we will email you at {$email} as soon as it is done.

MAKE YOUR PAGE SHINE THIS HOLIDAY SEASON
 * Full control - you manage your page yourself, whenever you like.
 * Fresh photos - change your photos and add new ones.
 * Your words - update your text and tell your story your way.
 * Be seen - your page sits next to the island's best-known names, in the app visitors open all season long.
 * Real reviews - visitors can leave star ratings and reviews on your page.

SIMPLE, HONEST PRICING
 * {$price1} for the whole period until {$until}.
 * After that {$price2} per month.
 * This subscription can be canceled anytime.
{$reply}
Warm regards,
The Blue Holiday Wave team

--
You are receiving this because someone asked to claim "{$pageName}" with this email address. If that was not you, you can ignore this email.
The Blue Holiday Wave is an independent guide and is not affiliated with the brands it lists.
TXT;
}

function claim_mail_html(string $firstName, string $pageName, string $email, bool $canReply): string
{
    $first = mail_e($firstName);
    $page = mail_e($pageName);
    $addr = mail_e($email);
    $hours = CONFIRM_WITHIN_HOURS;
    $price1 = mail_e(PRICE_FIRST_PERIOD);
    $until = mail_e(PRICE_FIRST_PERIOD_UNTIL);
    $price2 = mail_e(PRICE_MONTHLY);

    $benefits = [
        ['Full control', 'You manage your page yourself, whenever you like.'],
        ['Fresh photos', 'Change your photos and add new ones.'],
        ['Your words', 'Update your text and tell your story your way.'],
        ['Be seen', "Your page sits next to the island's best-known names, in the app visitors open all season long."],
        ['Real reviews', 'Visitors can leave star ratings and reviews on your page.'],
    ];
    $rows = '';
    foreach ($benefits as [$title, $text]) {
        $rows .= '<tr><td style="width:28px;vertical-align:top;padding:8px 0;color:#d4a84b;font-size:18px;">&#10022;</td>'
            . '<td style="padding:8px 0;font-size:15px;line-height:1.5;color:#f7f3ec;"><strong style="color:#ffffff;">'
            . mail_e($title) . '</strong><br><span style="color:#cdd6e6;">' . mail_e($text) . '</span></td></tr>';
    }
    $reply = $canReply
        ? '<p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#cdd6e6;">Questions? Just reply to this email and we will help you.</p>'
        : '';

    return <<<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Your claim for {$page} is in</title>
</head>
<body style="margin:0;padding:0;background:#061833;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">We are processing your request. Confirmation within {$hours} hours.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#061833;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0a2a5c;border:1px solid #6b5a2e;border-radius:18px;font-family:Helvetica,Arial,sans-serif;">
<tr><td align="center" style="padding:30px 24px 6px;">
<div style="font-size:12px;letter-spacing:3px;color:#d4a84b;">CURA&Ccedil;AO &middot; HOLIDAY SEASON 2026</div>
<div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#ffffff;margin-top:8px;">The Blue <span style="color:#d4a84b;">Holiday</span> Wave</div>
</td></tr>
<tr><td style="padding:18px 28px 0;">
<h1 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#ffffff;">Thank you, {$first}! &#10022;</h1>
<p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#f7f3ec;">We received your request to claim <strong style="color:#d4a84b;">{$page}</strong> on The Blue Holiday Wave. Great to have you on board.</p>
</td></tr>
<tr><td style="padding:0 28px 6px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e284f;border:1px solid #d4a84b;border-radius:14px;">
<tr><td style="padding:16px 18px;">
<div style="font-size:12px;letter-spacing:2px;color:#d4a84b;margin-bottom:6px;">WHAT HAPPENS NOW</div>
<div style="font-size:16px;line-height:1.55;color:#ffffff;">Your request is being processed. We will confirm it within a <strong>maximum of {$hours} hours</strong>, and we will email you at <span style="color:#d4a84b;">{$addr}</span> as soon as it is done.</div>
</td></tr></table>
</td></tr>
<tr><td style="padding:22px 28px 0;">
<h2 style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:21px;color:#ffffff;">Make your page shine this holiday season</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">{$rows}</table>
</td></tr>
<tr><td style="padding:20px 28px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f6d878,#d4a84b 55%,#a77b22);background-color:#d4a84b;border-radius:14px;">
<tr><td style="padding:18px 20px;color:#2a1c00;">
<div style="font-size:12px;letter-spacing:2px;font-weight:bold;">SIMPLE, HONEST PRICING</div>
<div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:bold;margin:6px 0 2px;">{$price1}</div>
<div style="font-size:15px;line-height:1.5;">for the whole period until {$until}.</div>
<div style="font-size:15px;line-height:1.5;margin-top:8px;">After that just <strong>{$price2} per month</strong>.</div>
<div style="font-size:14px;line-height:1.5;margin-top:10px;font-weight:bold;">This subscription can be canceled anytime.</div>
</td></tr></table>
</td></tr>
<tr><td style="padding:22px 28px 0;">{$reply}
<p style="margin:0 0 6px;font-size:15px;color:#f7f3ec;">Warm regards,<br><strong>The Blue Holiday Wave team</strong></p>
</td></tr>
<tr><td style="padding:22px 28px 26px;">
<p style="margin:0;font-size:12px;line-height:1.5;color:#8fa0bd;border-top:1px solid #1d3f73;padding-top:14px;">You are receiving this because someone asked to claim &ldquo;{$page}&rdquo; with this email address. If that was not you, you can ignore this email.<br>The Blue Holiday Wave is an independent guide and is not affiliated with the brands it lists.</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>
HTML;
}

/**
 * Sends the confirmation. Returns true when the mail was handed to the mail system.
 * If config MAIL_DEBUG_DIR is set, the email is written there as an .eml file instead (for testing).
 */
function send_claim_confirmation(array $claim, array $config): bool
{
    $email = (string) $claim['email'];
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    $pageName = (string) ($claim['partnerName'] ?: $claim['partner']);
    $parts = preg_split('/\s+/', trim((string) $claim['ownerName']));
    $firstName = (string) ($parts[0] ?? 'there');

    $replyTo = (string) ($config['ADMIN_EMAIL'] ?? '');
    $canReply = filter_var($replyTo, FILTER_VALIDATE_EMAIL) !== false;
    $from = mail_from_address($config);

    $boundary = 'bhw_' . bin2hex(random_bytes(8));
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . mail_header_text('The Blue Holiday Wave') . " <{$from}>",
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'X-Auto-Response-Suppress: OOF, AutoReply',
    ];
    if ($canReply) {
        $headers[] = "Reply-To: {$replyTo}";
    }

    $body = "--{$boundary}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n"
        . quoted_printable_encode(str_replace("\n", "\r\n", claim_mail_text($firstName, $pageName, $email, $canReply))) . "\r\n"
        . "--{$boundary}\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n"
        . quoted_printable_encode(str_replace("\n", "\r\n", claim_mail_html($firstName, $pageName, $email, $canReply))) . "\r\n"
        . "--{$boundary}--\r\n";

    $subject = mail_header_text(claim_mail_subject($pageName));

    $debugDir = (string) ($config['MAIL_DEBUG_DIR'] ?? '');
    if ($debugDir !== '') {
        if (!is_dir($debugDir)) {
            @mkdir($debugDir, 0750, true);
        }
        $eml = "To: {$email}\r\nSubject: {$subject}\r\n" . implode("\r\n", $headers) . "\r\n\r\n" . $body;
        return @file_put_contents($debugDir . '/claim-' . date('His') . '-' . bin2hex(random_bytes(3)) . '.eml', $eml) !== false;
    }

    return @mail($email, $subject, $body, implode("\r\n", $headers), '-f' . $from);
}
