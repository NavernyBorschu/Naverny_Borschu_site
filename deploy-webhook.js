#!/usr/bin/env node
const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');

const PORT = 9012;
const SECRET = process.env.WEBHOOK_SECRET || 'a69bca7228050b82e2971a97fe1d89d77cf00b48';
const REPO_DIR = '/home/admin/projects/navernyborshchu-frontend';
const BRANCH = 'main';

function verifySignature(payload, signature) {
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(payload);
  const expected = 'sha256=' + hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

function deploy() {
  try {
    console.log(`[${new Date().toISOString()}] Deploying frontend...`);
    execSync(`
      cd ${REPO_DIR} &&
      git fetch origin &&
      git reset --hard origin/${BRANCH} &&
      npm ci --silent &&
      npm run build
    `, { stdio: 'inherit', timeout: 180000, env: { ...process.env, REACT_APP_API_URL: 'https://navernyborshchu.com/api' } });
    console.log(`[${new Date().toISOString()}] Frontend deploy complete.`);
    return true;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Deploy failed:`, err.message);
    return false;
  }
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    const signature = req.headers['x-hub-signature-256'];
    if (!verifySignature(body, signature)) {
      console.error(`[${new Date().toISOString()}] Invalid signature`);
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    let payload;
    try { payload = JSON.parse(body); } catch {
      res.writeHead(400); res.end('Bad request'); return;
    }

    if (payload.ref !== `refs/heads/${BRANCH}`) {
      res.writeHead(200); res.end('Ignored (not main)'); return;
    }

    const ok = deploy();
    res.writeHead(ok ? 200 : 500);
    res.end(ok ? 'Deployed' : 'Deploy failed');
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[${new Date().toISOString()}] Frontend webhook listener on port ${PORT}`);
});
