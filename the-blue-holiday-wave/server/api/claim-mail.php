<?php
declare(strict_types=1);

// The emails for page owners: "claim received", "claim approved" and "claim denied".

const PRICE_FIRST_PERIOD = 'XCG 175,-';
const PRICE_FIRST_PERIOD_UNTIL = 'the end of January 2027';
const PRICE_MONTHLY = 'XCG 49,50';
const CONFIRM_WITHIN_HOURS = 4;

const FEE_BASE = 175.00;
const FEE_TAX_RATE = 0.06;
const PAY_WITHIN_WORKING_DAYS = 5;

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

function mail_money(float $amount): string
{
    return 'XCG ' . number_format($amount, 2, ',', '.');
}

/** The claim number shown to the owner, e.g. BHW-26-7F3A9C. Older claims get one from their id. */
function claim_number(array $claim): string
{
    return (string) ($claim['number'] ?? ('BHW-' . strtoupper(substr((string) ($claim['id'] ?? '000000'), 0, 6))));
}

function can_reply(array $config): bool
{
    return filter_var((string) ($config['ADMIN_EMAIL'] ?? ''), FILTER_VALIDATE_EMAIL) !== false;
}

function first_name(array $claim): string
{
    $parts = preg_split('/\s+/', trim((string) $claim['ownerName']));
    return (string) ($parts[0] ?? 'there');
}

function page_name(array $claim): string
{
    return (string) (($claim['partnerName'] ?? '') ?: $claim['partner']);
}

/** Public address of the website folder, for example https://www.thebluewavefans.com/holidayseason */
function site_url(array $config): string
{
    $set = rtrim((string) ($config['SITE_URL'] ?? ''), '/');
    if ($set !== '' && preg_match('~^https?://~i', $set)) {
        return $set;
    }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $host = (string) ($_SERVER['HTTP_HOST'] ?? 'localhost');
    $dir = rtrim(str_replace('\\', '/', dirname(dirname((string) ($_SERVER['SCRIPT_NAME'] ?? '/api/x.php')))), '/');
    return ($https ? 'https' : 'http') . '://' . $host . $dir;
}

/** Sends one email (plain text + HTML). With config MAIL_DEBUG_DIR set it writes an .eml file instead. */
function deliver_mail(string $to, string $subject, string $text, string $html, array $config): bool
{
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    $from = mail_from_address($config);
    $replyTo = (string) ($config['ADMIN_EMAIL'] ?? '');

    $boundary = 'bhw_' . bin2hex(random_bytes(8));
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . mail_header_text('The Holidays Blue Wave') . " <{$from}>",
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'X-Auto-Response-Suppress: OOF, AutoReply',
    ];
    if (can_reply($config)) {
        $headers[] = "Reply-To: {$replyTo}";
    }

    $body = "--{$boundary}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n"
        . quoted_printable_encode(str_replace("\n", "\r\n", $text)) . "\r\n"
        . "--{$boundary}\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n"
        . quoted_printable_encode(str_replace("\n", "\r\n", $html)) . "\r\n"
        . "--{$boundary}--\r\n";

    $encodedSubject = mail_header_text($subject);

    $debugDir = (string) ($config['MAIL_DEBUG_DIR'] ?? '');
    if ($debugDir !== '') {
        if (!is_dir($debugDir)) {
            @mkdir($debugDir, 0750, true);
        }
        $eml = "To: {$to}\r\nSubject: {$encodedSubject}\r\n" . implode("\r\n", $headers) . "\r\n\r\n" . $body;
        return @file_put_contents($debugDir . '/mail-' . date('His') . '-' . bin2hex(random_bytes(3)) . '.eml', $eml) !== false;
    }

    return @mail($to, $encodedSubject, $body, implode("\r\n", $headers), '-f' . $from);
}

/** Branded wrapper used by every email. $inner is trusted, already escaped HTML. */
function mail_shell(string $title, string $preheader, string $inner, string $footer): string
{
    $t = mail_e($title);
    $pre = mail_e($preheader);
    return <<<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>{$t}</title>
</head>
<body style="margin:0;padding:0;background:#061833;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{$pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#061833;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0a2a5c;border:1px solid #6b5a2e;border-radius:18px;font-family:Helvetica,Arial,sans-serif;">
<tr><td align="center" style="padding:30px 24px 6px;">
<div style="font-size:12px;letter-spacing:3px;color:#d4a84b;">CURA&Ccedil;AO &middot; HOLIDAYS SEASON 2026</div>
<div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#ffffff;margin-top:8px;">The <span style="color:#d4a84b;">Holidays</span> Blue Wave</div>
</td></tr>
{$inner}
<tr><td style="padding:22px 28px 26px;">
<p style="margin:0;font-size:12px;line-height:1.5;color:#8fa0bd;border-top:1px solid #1d3f73;padding-top:14px;">{$footer}<br>The Holidays Blue Wave is an independent guide and is not affiliated with the brands it lists.</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>
HTML;
}

function mail_button(string $url, string $label): string
{
    $u = mail_e($url);
    $l = mail_e($label);
    return '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td align="center" style="border-radius:999px;background:#d4a84b;background-image:linear-gradient(135deg,#f6d878,#d4a84b 55%,#a77b22);">'
        . '<a href="' . $u . '" style="display:inline-block;padding:16px 30px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;letter-spacing:1.5px;color:#2a1c00;text-decoration:none;border-radius:999px;">' . $l . '</a>'
        . '</td></tr></table>';
}

function mail_row(string $html, string $pad = '0 28px 0'): string
{
    return '<tr><td style="padding:' . $pad . ';">' . $html . '</td></tr>';
}

function mail_box(string $label, string $html, string $border = '#d4a84b'): string
{
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e284f;border:1px solid ' . $border . ';border-radius:14px;"><tr><td style="padding:16px 18px;">'
        . '<div style="font-size:12px;letter-spacing:2px;color:#d4a84b;margin-bottom:6px;">' . mail_e($label) . '</div>'
        . '<div style="font-size:16px;line-height:1.55;color:#ffffff;">' . $html . '</div></td></tr></table>';
}

/** @param list<array{0:string,1:string}> $items */
function mail_benefits(array $items): string
{
    $rows = '';
    foreach ($items as [$title, $text]) {
        $rows .= '<tr><td style="width:28px;vertical-align:top;padding:8px 0;color:#d4a84b;font-size:18px;">&#10022;</td>'
            . '<td style="padding:8px 0;font-size:15px;line-height:1.5;color:#f7f3ec;"><strong style="color:#ffffff;">'
            . mail_e($title) . '</strong><br><span style="color:#cdd6e6;">' . mail_e($text) . '</span></td></tr>';
    }
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $rows . '</table>';
}

/* ---------------------------------------------------------------- 1. claim received */

function claim_mail_subject(string $pageName): string
{
    return "Thank you! Your claim for {$pageName} is in \u{2726}";
}

function claim_mail_text(string $firstName, string $pageName, string $email, bool $canReply, string $number): string
{
    $hours = CONFIRM_WITHIN_HOURS;
    $price1 = PRICE_FIRST_PERIOD;
    $until = PRICE_FIRST_PERIOD_UNTIL;
    $price2 = PRICE_MONTHLY;
    $reply = $canReply ? "\nQuestions? Just reply to this email and we will help you.\n" : '';

    return <<<TXT
Thank you, {$firstName}!

We received your request to claim "{$pageName}" on The Holidays Blue Wave.
Your claim number: {$number}

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
The Holidays Blue Wave team

--
You are receiving this because someone asked to claim "{$pageName}" with this email address. If that was not you, you can ignore this email.
The Holidays Blue Wave is an independent guide and is not affiliated with the brands it lists.
TXT;
}

function claim_mail_html(string $firstName, string $pageName, string $email, bool $canReply, string $number): string
{
    $first = mail_e($firstName);
    $page = mail_e($pageName);
    $addr = mail_e($email);
    $hours = CONFIRM_WITHIN_HOURS;
    $price1 = mail_e(PRICE_FIRST_PERIOD);
    $until = mail_e(PRICE_FIRST_PERIOD_UNTIL);
    $price2 = mail_e(PRICE_MONTHLY);

    $benefits = mail_benefits([
        ['Full control', 'You manage your page yourself, whenever you like.'],
        ['Fresh photos', 'Change your photos and add new ones.'],
        ['Your words', 'Update your text and tell your story your way.'],
        ['Be seen', "Your page sits next to the island's best-known names, in the app visitors open all season long."],
        ['Real reviews', 'Visitors can leave star ratings and reviews on your page.'],
    ]);
    $reply = $canReply
        ? '<p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#cdd6e6;">Questions? Just reply to this email and we will help you.</p>'
        : '';

    $inner = mail_row(
        '<h1 style="margin:0 0 10px;font-family:Georgia,\'Times New Roman\',serif;font-size:28px;line-height:1.25;color:#ffffff;">Thank you, ' . $first . '! &#10022;</h1>'
        . '<p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#f7f3ec;">We received your request to claim <strong style="color:#d4a84b;">' . $page . '</strong> on The Holidays Blue Wave. Great to have you on board.</p>'
        . '<p style="margin:10px 0 0;font-size:14px;color:#cdd6e6;">Your claim number: <strong style="color:#d4a84b;letter-spacing:1px;">' . mail_e($number) . '</strong></p>',
        '18px 28px 0'
    )
    . mail_row(mail_box('WHAT HAPPENS NOW', "Your request is being processed. We will confirm it within a <strong>maximum of {$hours} hours</strong>, and we will email you at <span style=\"color:#d4a84b;\">{$addr}</span> as soon as it is done."), '0 28px 6px')
    . mail_row('<h2 style="margin:0 0 6px;font-family:Georgia,\'Times New Roman\',serif;font-size:21px;color:#ffffff;">Make your page shine for the holidays</h2>' . $benefits, '22px 28px 0')
    . mail_row(
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f6d878,#d4a84b 55%,#a77b22);background-color:#d4a84b;border-radius:14px;"><tr><td style="padding:18px 20px;color:#2a1c00;">'
        . '<div style="font-size:12px;letter-spacing:2px;font-weight:bold;">SIMPLE, HONEST PRICING</div>'
        . '<div style="font-family:Georgia,\'Times New Roman\',serif;font-size:30px;font-weight:bold;margin:6px 0 2px;">' . $price1 . '</div>'
        . '<div style="font-size:15px;line-height:1.5;">for the whole period until ' . $until . '.</div>'
        . '<div style="font-size:15px;line-height:1.5;margin-top:8px;">After that just <strong>' . $price2 . ' per month</strong>.</div>'
        . '<div style="font-size:14px;line-height:1.5;margin-top:10px;font-weight:bold;">This subscription can be canceled anytime.</div>'
        . '</td></tr></table>',
        '20px 28px 0'
    )
    . mail_row($reply . '<p style="margin:0 0 6px;font-size:15px;color:#f7f3ec;">Warm regards,<br><strong>The Holidays Blue Wave team</strong></p>', '22px 28px 0');

    return mail_shell(
        "Your claim for {$pageName} is in",
        "We are processing your request. Confirmation within {$hours} hours.",
        $inner,
        'You are receiving this because someone asked to claim &ldquo;' . $page . '&rdquo; with this email address. If that was not you, you can ignore this email.'
    );
}

/** Confirmation right after the claim form is sent. */
function send_claim_confirmation(array $claim, array $config): bool
{
    $email = (string) $claim['email'];
    $page = page_name($claim);
    $first = first_name($claim);
    $reply = can_reply($config);
    return deliver_mail(
        $email,
        claim_mail_subject($page),
        claim_mail_text($first, $page, $email, $reply, claim_number($claim)),
        claim_mail_html($first, $page, $email, $reply, claim_number($claim)),
        $config
    );
}

/* ---------------------------------------------------------------- 2. claim approved */

function approved_fee(): array
{
    $tax = round(FEE_BASE * FEE_TAX_RATE, 2);
    return ['base' => FEE_BASE, 'tax' => $tax, 'total' => FEE_BASE + $tax];
}

function approved_mail_text(string $first, string $page, string $url, string $paymentDetails, bool $canReply, string $number): string
{
    $fee = approved_fee();
    $base = PRICE_FIRST_PERIOD;
    $tax = mail_money($fee['tax']);
    $total = mail_money($fee['total']);
    $days = PAY_WITHIN_WORKING_DAYS;
    $pay = trim($paymentDetails) !== ''
        ? "HOW TO PAY\n" . trim($paymentDetails) . "\n"
        : ($canReply ? "HOW TO PAY\nReply to this email and we will send you the payment details.\n" : '');

    return <<<TXT
Congratulations, {$first}! Your claim is approved.
Welcome to the Blue Wave Family.

"{$page}" is now yours to shape on The Holidays Blue Wave.

The holiday season is the island's brightest time. Visitors are planning dinners, gifts, stays and outfits right now, and your page is where they meet you. Make it sparkle: fresh photos, a warm welcome, and the details that make you, you.

Your manage functionality is active as of now, so you can start adjusting your page right away.

CHECK OUT YOUR EDITING ADMIN PAGE
{$url}
Choose your own username and password. Then you can change your text, change your logo and photos, and add new photos.

YOUR SUBSCRIPTION
The Blue Wave Holidays Season subscription: {$base} + 6% tax ({$tax}) = {$total}.
Please pay this amount within {$days} working days.
Claim number (use it as your payment reference): {$number}
This subscription can be canceled anytime.

{$pay}
YOU STAY IN CONTROL
 * Your page, your say: you decide what visitors see and you can change it whenever you like.
 * A personal link: it was made for you and works once. Do not forward it.
 * Your password stays yours: we never see it.

Welcome to the family,
The Holidays Blue Wave team

--
You are receiving this because you asked to claim "{$page}" and we approved it. The Holidays Blue Wave is an independent guide and is not affiliated with the brands it lists.
TXT;
}

function approved_mail_html(string $first, string $page, string $url, string $paymentDetails, bool $canReply, string $number): string
{
    $f = mail_e($first);
    $p = mail_e($page);
    $fee = approved_fee();
    $base = mail_e(PRICE_FIRST_PERIOD);
    $tax = mail_e(mail_money($fee['tax']));
    $total = mail_e(mail_money($fee['total']));
    $days = PAY_WITHIN_WORKING_DAYS;

    $payHtml = '';
    if (trim($paymentDetails) !== '') {
        $payHtml = '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #8a6414;font-size:15px;line-height:1.6;color:#2a1c00;"><strong style="color:#2a1c00;letter-spacing:1px;">HOW TO PAY</strong><br>'
            . nl2br(mail_e(trim($paymentDetails))) . '</div>';
    } elseif ($canReply) {
        $payHtml = '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #8a6414;font-size:15px;line-height:1.6;color:#2a1c00;"><strong style="color:#2a1c00;letter-spacing:1px;">HOW TO PAY</strong><br>Reply to this email and we will send you the payment details.</div>';
    }

    $trust = mail_benefits([
        ['Your page, your say', 'You decide what visitors see, and you can change it whenever you like.'],
        ['A personal link', 'The button above was made for you and works once. Please do not forward it.'],
        ['Your password stays yours', 'You choose it yourself and we never see it.'],
    ]);

    $inner = mail_row(
        '<div style="font-size:12px;letter-spacing:2px;color:#d4a84b;margin-bottom:6px;">CLAIM APPROVED &#10022;</div>'
        . '<h1 style="margin:0 0 10px;font-family:Georgia,\'Times New Roman\',serif;font-size:28px;line-height:1.25;color:#ffffff;">Congratulations, ' . $f . '!<br>Your claim is approved.</h1>'
        . '<p style="margin:0 0 6px;font-size:18px;line-height:1.5;color:#d4a84b;font-family:Georgia,\'Times New Roman\',serif;">Welcome to the Blue Wave Family.</p>'
        . '<p style="margin:12px 0 0;font-size:16px;line-height:1.6;color:#f7f3ec;"><strong style="color:#ffffff;">' . $p . '</strong> is now yours to shape on The Holidays Blue Wave.</p>'
        . '<p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#cdd6e6;">The holiday season is the island&rsquo;s brightest time. Visitors are planning dinners, gifts, stays and outfits right now, and your page is where they meet you. Make it sparkle: fresh photos, a warm welcome, and the details that make you, you.</p>',
        '18px 28px 0'
    )
    . mail_row(mail_box('ACTIVE AS OF NOW', 'Your manage functionality is <strong>active as of now</strong>, so you can start adjusting your page right away.'), '18px 28px 0')
    . mail_row(
        mail_button($url, 'CHECK OUT YOUR EDITING ADMIN PAGE')
        . '<p style="margin:12px 0 0;text-align:center;font-size:13px;line-height:1.5;color:#cdd6e6;">Choose your own username and password. Then you can change your text, change your logo and photos, and add new photos.</p>',
        '22px 28px 0'
    )
    . mail_row(
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f6d878,#d4a84b 55%,#a77b22);background-color:#d4a84b;border-radius:14px;"><tr><td style="padding:18px 20px;color:#2a1c00;">'
        . '<div style="font-size:12px;letter-spacing:2px;font-weight:bold;">YOUR SUBSCRIPTION</div>'
        . '<div style="font-size:15px;line-height:1.5;margin-top:6px;">The Blue Wave Holidays Season subscription</div>'
        . '<div style="font-family:Georgia,\'Times New Roman\',serif;font-size:26px;font-weight:bold;margin:4px 0 2px;">' . $base . ' + 6% tax</div>'
        . '<div style="font-size:15px;line-height:1.5;">' . $base . ' + ' . $tax . ' tax = <strong>' . $total . '</strong></div>'
        . '<div style="font-size:15px;line-height:1.5;margin-top:8px;"><strong>Please pay this amount within ' . $days . ' working days.</strong></div>'
        . '<div style="font-size:15px;line-height:1.5;margin-top:6px;">Claim number (use it as your payment reference): <strong style="letter-spacing:1px;white-space:nowrap;">' . mail_e($number) . '</strong></div>'
        . '<div style="font-size:14px;line-height:1.5;margin-top:10px;">This subscription can be canceled anytime.</div>'
        . $payHtml
        . '</td></tr></table>',
        '22px 28px 0'
    )
    . mail_row('<h2 style="margin:0 0 6px;font-family:Georgia,\'Times New Roman\',serif;font-size:21px;color:#ffffff;">You stay in control</h2>' . $trust, '22px 28px 0')
    . mail_row('<p style="margin:0 0 6px;font-size:15px;color:#f7f3ec;">Welcome to the family,<br><strong>The Holidays Blue Wave team</strong></p>', '20px 28px 0');

    return mail_shell(
        "Your claim for {$page} is approved",
        'Welcome to the Blue Wave Family. Your page is ready for you.',
        $inner,
        'You are receiving this because you asked to claim &ldquo;' . $p . '&rdquo; and we approved it.'
    );
}

function send_approved_email(array $claim, array $config, string $activationUrl): bool
{
    $page = page_name($claim);
    $first = first_name($claim);
    $reply = can_reply($config);
    $pay = str_replace(['\\r\\n', '\\n'], "\n", (string) ($config['PAYMENT_DETAILS'] ?? ''));
    return deliver_mail(
        (string) $claim['email'],
        "Congratulations! Your claim for {$page} is approved \u{2726}",
        approved_mail_text($first, $page, $activationUrl, str_replace('{claim}', claim_number($claim), $pay), $reply, claim_number($claim)),
        approved_mail_html($first, $page, $activationUrl, str_replace('{claim}', claim_number($claim), $pay), $reply, claim_number($claim)),
        $config
    );
}

/* ---------------------------------------------------------------- 3. claim denied */

function denied_mail_text(string $first, string $page, bool $canReply, string $number): string
{
    $ask = $canReply
        ? 'Simply reply to this email with something that helps us confirm it (for example your business email or phone number, your chamber of commerce number, or a photo of your shop front or sign) and we will look again right away.'
        : 'Please contact us through thebluewavefans.com with something that helps us confirm it (for example your business email or phone number, your chamber of commerce number, or a photo of your shop front or sign) and we will look again right away.';

    return <<<TXT
Hello {$first},

Thank you for your interest in claiming "{$page}" on The Holidays Blue Wave.
Your claim number: {$number}

We checked your request carefully, and we were not able to approve it at this time, because we could not confirm that you are connected to this business.

THIS IS NOT NECESSARILY THE END
If you are the owner or a manager, we would love to get this right. {$ask}

GOOD TO KNOW
 * Nothing has been charged and nothing is due.
 * Your page stays online for visitors to read and review.

Thank you for being part of the holidays in Cura\u{e7}ao.

Warm regards,
The Holidays Blue Wave team

--
You are receiving this because you asked to claim "{$page}". The Holidays Blue Wave is an independent guide and is not affiliated with the brands it lists.
TXT;
}

function denied_mail_html(string $first, string $page, bool $canReply, string $number): string
{
    $f = mail_e($first);
    $p = mail_e($page);
    $ask = $canReply
        ? 'Simply <strong>reply to this email</strong> with something that helps us confirm it (for example your business email or phone number, your chamber of commerce number, or a photo of your shop front or sign) and we will look again right away.'
        : 'Please contact us through thebluewavefans.com with something that helps us confirm it (for example your business email or phone number, your chamber of commerce number, or a photo of your shop front or sign) and we will look again right away.';

    $inner = mail_row(
        '<h1 style="margin:0 0 10px;font-family:Georgia,\'Times New Roman\',serif;font-size:26px;line-height:1.25;color:#ffffff;">Hello ' . $f . ',</h1>'
        . '<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#f7f3ec;">Thank you for your interest in claiming <strong style="color:#d4a84b;">' . $p . '</strong> on The Holidays Blue Wave.</p>'
        . '<p style="margin:0 0 14px;font-size:14px;color:#cdd6e6;">Your claim number: <strong style="color:#d4a84b;letter-spacing:1px;">' . mail_e($number) . '</strong></p>'
        . '<p style="margin:0 0 6px;font-size:16px;line-height:1.6;color:#f7f3ec;">We checked your request carefully, and we were not able to approve it at this time, because we could not confirm that you are connected to this business.</p>',
        '18px 28px 0'
    )
    . mail_row(mail_box('THIS IS NOT NECESSARILY THE END', 'If you are the owner or a manager, we would love to get this right. ' . $ask), '14px 28px 0')
    . mail_row(
        '<h2 style="margin:0 0 6px;font-family:Georgia,\'Times New Roman\',serif;font-size:21px;color:#ffffff;">Good to know</h2>'
        . mail_benefits([
            ['Nothing is due', 'Nothing has been charged.'],
            ['Your page stays online', 'Visitors can still read it and leave reviews.'],
        ]),
        '22px 28px 0'
    )
    . mail_row('<p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#cdd6e6;">Thank you for being part of the holidays in Cura&ccedil;ao.</p><p style="margin:12px 0 6px;font-size:15px;color:#f7f3ec;">Warm regards,<br><strong>The Holidays Blue Wave team</strong></p>', '16px 28px 0');

    return mail_shell(
        "About your claim for {$page}",
        'We could not approve your claim yet. Here is how to get it looked at again.',
        $inner,
        'You are receiving this because you asked to claim &ldquo;' . $p . '&rdquo;.'
    );
}

function send_denied_email(array $claim, array $config): bool
{
    $page = page_name($claim);
    $first = first_name($claim);
    $reply = can_reply($config);
    return deliver_mail(
        (string) $claim['email'],
        "About your claim for {$page}",
        denied_mail_text($first, $page, $reply, claim_number($claim)),
        denied_mail_html($first, $page, $reply, claim_number($claim)),
        $config
    );
}
