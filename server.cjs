const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
  let url;try{url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
  const file=path.resolve(root,'.'+(url==='/'?'/index.html':url));
  if(!file.startsWith(root+path.sep)||url.split('/').some(p=>p.startsWith('.'))){res.writeHead(403);return res.end();}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Arquivo não encontrado');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);});
});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('E Aí Man! http://127.0.0.1:'+server.address().port));
