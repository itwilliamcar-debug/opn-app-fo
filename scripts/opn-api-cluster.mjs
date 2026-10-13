/**
 * Cluster API OPN — N workers PHP + proxy round-robin.
 * Worker 0 réservé aux routes /auth/* (login démo prioritaire).
 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND = path.resolve(__dirname, '..', 'opn-backend');
const WORKERS = Number(process.env.OPN_API_WORKERS || 5);
const BASE_PORT = Number(process.env.OPN_API_BASE_PORT || 8011);
const PUBLIC_PORT = Number(process.env.OPN_API_PORT || 8002);
const PHP = process.env.PHP_BINARY || 'php';
const PROXY_TIMEOUT_MS = Number(process.env.OPN_API_PROXY_TIMEOUT || 25000);

const workers = [];
let rr = 0;

function startWorker(index) {
  const port = BASE_PORT + index;
  const child = spawn(
    PHP,
    ['artisan', 'serve', `--host=127.0.0.1`, `--port=${port}`],
    {
      cwd: BACKEND,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    }
  );
  child.stdout.on('data', (d) => process.stdout.write(`[w${port}] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`[w${port}] ${d}`));
  child.on('exit', (code) => {
    console.error(`[opn-api] worker ${port} exited (${code}) — restart in 1s`);
    setTimeout(() => {
      workers[index] = { port, child: startWorker(index) };
    }, 1000);
  });
  return child;
}

for (let i = 0; i < WORKERS; i += 1) {
  workers.push({ port: BASE_PORT + i, child: startWorker(i) });
}

function isAuthPath(url = '') {
  return /\/api\/v1\/auth\//i.test(url);
}

function pickWorker(url) {
  if (workers.length === 0) return null;
  // Worker 0 = file dédiée auth (évite la file Connect/polling)
  if (isAuthPath(url) && workers[0]) {
    return { worker: workers[0], index: 0 };
  }
  if (workers.length === 1) {
    return { worker: workers[0], index: 0 };
  }
  // Trafic métier : workers 1..N-1 uniquement
  const poolStart = 1;
  const poolSize = workers.length - poolStart;
  const idx = poolStart + (rr % poolSize);
  rr += 1;
  return { worker: workers[idx], index: idx };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function forward(req, res, worker, body, onFail) {
  const headers = { ...req.headers, host: `127.0.0.1:${worker.port}` };
  if (body && body.length) {
    headers['content-length'] = String(body.length);
  }

  const proxyReq = http.request(
    {
      hostname: '127.0.0.1',
      port: worker.port,
      path: req.url,
      method: req.method,
      headers,
      timeout: PROXY_TIMEOUT_MS,
    },
    (proxyRes) => {
      if (res.headersSent) return;
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('timeout', () => proxyReq.destroy(new Error('proxy timeout')));
  proxyReq.on('error', (err) => {
    if (res.headersSent) return;
    onFail(err);
  });

  if (body && body.length) {
    proxyReq.end(body);
  } else {
    proxyReq.end();
  }
}

const server = http.createServer(async (req, res) => {
  let body = Buffer.alloc(0);
  try {
    body = await readBody(req);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: err.message }));
    return;
  }

  const auth = isAuthPath(req.url || '');
  const maxAttempts = auth ? Math.min(workers.length, 5) : Math.min(workers.length, 3);
  let attempt = 0;
  const first = pickWorker(req.url);

  const tryNext = (err) => {
    attempt += 1;
    if (attempt >= maxAttempts) {
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: `API workers indisponibles: ${err?.message || 'erreur'}`,
        }));
      }
      return;
    }
    // Auth : essayer les autres workers en secours
    const idx = auth
      ? attempt % workers.length
      : 1 + ((rr + attempt) % Math.max(1, workers.length - 1));
    forward(req, res, workers[idx], body, tryNext);
  };

  if (!first?.worker) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Aucun worker API.' }));
    return;
  }

  forward(req, res, first.worker, body, tryNext);
});

server.listen(PUBLIC_PORT, '127.0.0.1', () => {
  console.log(`[opn-api] Proxy http://127.0.0.1:${PUBLIC_PORT} — workers ${workers.map((w) => w.port).join(', ')} (auth→${BASE_PORT})`);
});

function shutdown() {
  workers.forEach((w) => {
    try { w.child.kill(); } catch { /* ignore */ }
  });
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
