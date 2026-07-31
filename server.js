/**
 * server.js — minimal static file server for local preview only.
 *
 * This site is frontend-only: there is no backend logic, no database
 * connection, and no API here. This script simply serves index.html,
 * styles.css, script.js, and other static assets over HTTP so you can
 * view the site at http://localhost:PORT while developing.
 *
 * Run with:  node server.js
 * (No npm install required — uses only Node's built-in modules.)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Load PORT from .env if present, otherwise default to 3000
require('fs').existsSync('.env') && require('fs').readFileSync('.env', 'utf8')
  .split('\n')
  .forEach(line => {
    const match = line.match(/^\s*PORT\s*=\s*(\d+)/);
    if (match) process.env.PORT = match[1];
  });

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=UTF-8',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);

  // Prevent directory traversal outside the project root
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      return res.end('404 — Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Advanced Heart Specialist Clinic site running at http://localhost:${PORT}`);
});
