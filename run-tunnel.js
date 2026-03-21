/**
 * Runs cloudflared tunnel and prints the URL prominently when it's ready.
 */
const { spawn } = require('child_process');
const path = require('path');

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

function run() {
  const cloudflaredBin = path.join(__dirname, 'node_modules', '.bin', 'cloudflared' + (process.platform === 'win32' ? '.cmd' : ''));
  const cloudflared = spawn(cloudflaredBin, ['tunnel', '--url', 'http://localhost:3081'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    cwd: __dirname,
  });

  let urlPrinted = false;

  const capture = (data) => {
    const text = data.toString();
    process.stdout.write(text);

    // Look for trycloudflare.com URL
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match && !urlPrinted) {
      urlPrinted = true;
      const url = match[0];
      console.log('');
      console.log(`${GREEN}${BOLD}`);
      console.log('╔══════════════════════════════════════════════════════════════╗');
      console.log('║  TUNNEL READY – Open this URL in your browser:               ║');
      console.log('║');
      console.log(`║  ${url.padEnd(52)}║`);
      console.log('║');
      console.log('╚══════════════════════════════════════════════════════════════╝');
      console.log(RESET);
      console.log('');
    }
  };

  cloudflared.stdout.on('data', capture);
  cloudflared.stderr.on('data', capture);

  cloudflared.on('close', (code) => process.exit(code || 0));
}

run();
