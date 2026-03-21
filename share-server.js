/**
 * Share server: single URL for frontend + backend.
 * TUNNEL: uses built frontend (works through Cloudflare) - run "npm run tunnel"
 * DEV: proxies to Vite - run "npm run share" while "npm run dev" is running
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const BACKEND_PORT = 4001;
const BACKEND_DIR = path.join(__dirname, 'backend');
const BACKEND_SCRIPT = path.join(BACKEND_DIR, 'dist', 'server.js');
const BACKEND_ENV = path.join(BACKEND_DIR, '.env');

// Load backend .env and pass to child (ensures RESEND_API_KEY is available)
const backendEnv = { ...process.env };
if (fs.existsSync(BACKEND_ENV)) {
  fs.readFileSync(BACKEND_ENV, 'utf8').split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) return;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key) backendEnv[key] = val;
  });
}

// Spawn backend so it stays alive (avoids npm/concurrently exit issues on Windows)
// Backend must listen on BACKEND_PORT; share-server proxies to it
if (fs.existsSync(BACKEND_SCRIPT)) {
  backendEnv.PORT = String(BACKEND_PORT);
  const child = spawn('node', ['dist/server.js'], {
    cwd: BACKEND_DIR,
    stdio: 'inherit',
    env: backendEnv,
  });
  child.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error('[Share] Backend exited with code', code);
    }
  });
}
const SHARE_PORT = parseInt(process.env.PORT || '3081', 10);
const STATIC_DIR = path.join(__dirname, 'frontend', 'dist');
const USE_STATIC = fs.existsSync(STATIC_DIR);

function proxy(req, res, targetPort, targetPath) {
  const opts = {
    hostname: '127.0.0.1',
    port: targetPort,
    path: targetPath,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${targetPort}` },
  };
  delete opts.headers['proxy-connection'];
  delete opts.headers['proxy-authorization'];

  const proxyReq = http.request(opts, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', (e) => {
    console.error('[Share] Proxy error to :' + targetPort, e.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Service unavailable.' }));
  });
  req.pipe(proxyReq);
}

function serveStatic(req, res) {
  let filePath = path.join(STATIC_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!filePath.startsWith(STATIC_DIR)) filePath = path.join(STATIC_DIR, 'index.html');
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    filePath = path.join(STATIC_DIR, 'index.html'); // SPA fallback
  }
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  res.end(fs.readFileSync(filePath));
}

const server = http.createServer(async (req, res) => {
  const pathOnly = (req.url || '').split('?')[0];
  if (pathOnly === '/mail-check' && req.method === 'GET') {
    if (USE_STATIC) console.log('[Share] Mail check requested');
    const opts = { hostname: '127.0.0.1', port: BACKEND_PORT, path: '/api/mail-check', method: 'GET' };
    const proxyReq = http.request(opts, (proxyRes) => {
      let body = '';
      proxyRes.on('data', (chunk) => { body += chunk; });
      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(body);
      });
    });
    proxyReq.on('error', (e) => {
      console.error('[Share] Mail check backend error:', e.message);
      res.writeHead(502, { 'Content-Type': 'text/html' });
      res.end('<h1>Backend unreachable</h1><p>Is the backend running on port ' + BACKEND_PORT + '?</p>');
    });
    proxyReq.end();
    return;
  }
  if (pathOnly === '/api/health' && req.method === 'GET') {
    const mailConfigured = !!(backendEnv.RESEND_API_KEY || (backendEnv.SMTP_USER && backendEnv.SMTP_PASS) || backendEnv.MANUS_API_URL);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, resendConfigured: mailConfigured }));
    return;
  }
  const isApi = req.url.startsWith('/api');
  if (isApi) {
    if (USE_STATIC) console.log('[Share] API', req.method, req.url);
    proxy(req, res, BACKEND_PORT, req.url);
    return;
  }
  if (USE_STATIC) {
    serveStatic(req, res);
  } else {
    const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT || '5174', 10);
    proxy(req, res, FRONTEND_PORT, req.url);
  }
});

// Wait for backend to be ready before accepting requests (avoids "Failed to fetch" on first POST)
function waitForBackend(cb, retries = 20) {
  const req = http.request({ hostname: '127.0.0.1', port: BACKEND_PORT, path: '/api/health', method: 'GET' }, () => {
    cb();
  });
  req.on('error', () => {
    if (retries > 0) setTimeout(() => waitForBackend(cb, retries - 1), 500);
    else cb(); // give up after 10s, start anyway
  });
  req.end();
}

waitForBackend(() => {
  server.listen(SHARE_PORT, () => {
    if (USE_STATIC) {
      console.log(`[Share] http://localhost:${SHARE_PORT} (static build + api:${BACKEND_PORT}) - ready for tunnel`);
    } else {
      console.log(`[Share] http://localhost:${SHARE_PORT} (dev frontend:5174, api:${BACKEND_PORT})`);
    }
    console.log(`[Share] Tunnel: npx cloudflared tunnel --url http://localhost:${SHARE_PORT}`);
  });
});
