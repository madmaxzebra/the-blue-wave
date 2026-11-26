<?php
// Copy this file to config.php on the server (same folder) and fill it in.
// config.php stays on the server only. Never put the real one in GitHub.
return [
    // Long random password for api/admin.php (at least 12 characters)
    'ADMIN_KEY' => 'change-me-to-a-long-random-password',
    // Where claim requests are emailed (leave empty to only store them)
    'ADMIN_EMAIL' => '',
    // The address the thank-you email to page owners is sent from. Use an address on your own
    // domain (for example hello@thebluewavefans.com) so it does not land in spam.
    'MAIL_FROM' => '',
];
