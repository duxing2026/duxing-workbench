/**
 * 独行工作台 - 本地服务器
 * 使用方法: node server.js
 * 然后在浏览器中访问 http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // 去掉查询串/锚点，使 app.js?v=xxx 这类带版本号的请求能正确定位到文件
  // （Python http.server / GitHub Pages 默认会剥离查询串；Node 原生需手动处理，否则 404）
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  urlPath = urlPath.split('?')[0].split('#')[0];
  const filePath = path.join(ROOT, urlPath);

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>文件未找到</p>');
      return;
    }
    // 缓存策略：
    //   HTML / JS / CSS / JSON —— no-cache，每次都向服务端重新校验，确保发版后新文件能到达（解决 PWA 缓存陈旧）
    //   图片 / 图标等静态资源 —— 允许缓存一天（这些文件极少变动）
    const noCacheExts = ['.html', '.js', '.css', '.json'];
    const headers = { 'Content-Type': contentType };
    if (noCacheExts.includes(ext)) {
      headers['Cache-Control'] = 'no-cache';
    } else {
      headers['Cache-Control'] = 'max-age=86400';
    }
    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  🌸 独行工作台已启动 🌸');
  console.log('');
  console.log(`  ➜  访问地址: http://localhost:${PORT}`);
  console.log(`  ➜  按 Ctrl+C 停止服务器`);
  console.log('');
});
