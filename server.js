const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT) || 4173;
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  if (pathname === '/') pathname = '/Kudo-fixed.html';
  const filePath = path.resolve(root, `.${pathname}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    const rangeHeader = request.headers.range;
    const range = rangeHeader && /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
    if (rangeHeader && !range) {
      response.writeHead(416, { 'Content-Range': `bytes */${stats.size}` }).end();
      return;
    }

    if (range) {
      const requestedStart = range[1] ? Number(range[1]) : null;
      const requestedEnd = range[2] ? Number(range[2]) : null;
      const suffixLength = requestedStart === null ? requestedEnd : null;
      const start = requestedStart === null ? stats.size - suffixLength : requestedStart;
      const end = requestedEnd === null || requestedStart === null
        ? stats.size - 1
        : Math.min(requestedEnd, stats.size - 1);

      if (
        !Number.isSafeInteger(start)
        || !Number.isSafeInteger(end)
        || start < 0
        || start >= stats.size
        || end < start
      ) {
        response.writeHead(416, { 'Content-Range': `bytes */${stats.size}` }).end();
        return;
      }

      response.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
      });
      if (request.method === 'HEAD') response.end();
      else fs.createReadStream(filePath, { start, end }).pipe(response);
      return;
    }

    response.writeHead(200, {
      'Accept-Ranges': 'bytes',
      'Content-Length': stats.size,
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(filePath).pipe(response);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Kudo is running at http://127.0.0.1:${port}`);
});
