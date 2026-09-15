const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'public');
const types = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};
const server = http.createServer((req,res)=>{
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/' || pathname === '/studio' || pathname === '/watch') pathname = '/index.html';
  const file = path.normalize(path.join(root, pathname));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err,data)=>{
    if (err) {
      fs.readFile(path.join(root,'index.html'), (e,fallback)=>{
        if(e){res.writeHead(404);return res.end('Not found');}
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}); res.end(fallback);
      });
      return;
    }
    res.writeHead(200, {'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control': pathname.endsWith('.html') ? 'no-store' : 'public, max-age=300'});
    res.end(data);
  });
});
server.listen(process.env.PORT || 3000, '0.0.0.0', ()=>console.log('Orbit Live listening'));
