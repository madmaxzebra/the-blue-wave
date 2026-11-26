<?php
// Copy this file to config.php on the server (same folder) and fill it in.
// config.php stays on the server only. Never put the real one in GitHub.
return [
    // Optional: absolute path for claims/reviews/owners JSON (outside public_html).
    // On Bluehost this is set automatically above public_html when left empty.
    'DATA_DIR' => '',
    // Your own long password for the owner page (api/admin.php), at least 12 characters.
    // Leave it empty and the owner page stays switched off.
    'ADMIN_KEY' => '',
    // Where claim requests are emailed to you (leave empty to only store them)
    'ADMIN_EMAIL' => '',
    // The address the thank-you email to page owners is sent from. Use an address on your own
    // domain (for example hello@thebluewavefans.com) so it does not land in spam.
    'MAIL_FROM' => '',
    // Public address of the website folder, used in the activation link in the approved email.
    // Leave empty to work it out automatically.
    'SITE_URL' => 'https://www.thebluewavefans.com/holidayseason',
    // How owners pay the subscription. Shown in the approved email (bank name, account number).
    // Use {claim} where the claim number should appear, for example: "Reference: {claim}".
    // If empty, the email asks them to reply for the payment details.
    'PAYMENT_DETAILS' => '',
    // Other websites or apps allowed to send reviews and claims (normally none; this site always works).
    // For the mobile app, for example: ['https://localhost', 'capacitor://localhost']
    'ALLOWED_ORIGINS' => [],
];
