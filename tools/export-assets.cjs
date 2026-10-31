// Exportação inicial da arte por código. Não execute novamente sobre desenhos editados.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..');
 if(fs.existsSync(path.join(root,'assets/jogo/personagens/luketa.png')))throw Error('Exportação cancelada: assets já existem. Seus desenhos não serão sobrescritos.');
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage();await page.goto(pathToFileURL(path.join(root,'index.html')).href);
 const output=await page.evaluate(()=>{
  const out={};
  function png(name,w,h,draw){const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const g=c.getContext('2d');g.scale(2,2);g.imageSmoothingEnabled=false;draw(g);out[name]=c.toDataURL('image/png').split(',')[1];}
  EaiEngine.CHARACTERS.forEach((char,i)=>png('personagens/'+char.id+'.png',32*8,40*5,g=>{
   ['idle','run','shoot','slide','jump'].forEach((pose,row)=>{for(let f=0;f<8;f++){g.save();g.beginPath();g.rect(f*32,row*40,32,40);g.clip();EaiArt.sprite(g,f*32+9,row*40+(pose==='slide'?0:5),i,f/8*Math.PI*2/13,1,pose==='jump'?'idle':pose);g.restore();}});
  }));
  EaiEngine.LEVELS.forEach((l,i)=>{
   png('cenarios/'+l.theme+'-ceu.png',480,270,g=>EaiArt.sky(g,i,0,0));
   png('cenarios/'+l.theme+'-rua.png',2400,270,g=>{for(let x=0;x<2400;x+=480){g.save();g.beginPath();g.rect(x,0,480,270);g.clip();g.translate(x,0);EaiArt.foreground(g,i,x,0);g.restore();}});
   for(const boss of [false,true])png('inimigos/'+l.theme+(boss?'-chefe':'-rival')+'.png',40*8,48,g=>{for(let f=0;f<8;f++)EaiArt.enemy(g,{x:f*40+5,y:3,dir:1,boss,hit:0},i,f/8*Math.PI*2/13);});
   png('objetos/bandeira-'+l.theme+'.png',16,28,g=>{EaiArt.rect(g,0,0,2,25,'#ebe1b2');EaiArt.rect(g,2,1,13,10,l.color);EaiArt.rect(g,4,3,4,4,'#f9dc7b');});
  });
  const R=EaiArt.rect;
  png('objetos/chao.png',24,70,g=>{R(g,0,0,24,70,'#6e7058');R(g,0,0,24,4,'#c6bb91');R(g,0,4,24,3,'#9d9a74');R(g,0,14,22,1,'#8c8a67');R(g,11,8,1,7,'#92916c');R(g,7,30,14,2,'#5e6750');});
  png('objetos/plataforma.png',20,12,g=>{R(g,0,0,20,12,'#8b714e');R(g,0,0,20,3,'#cfb077');R(g,0,5,20,2,'#b4925c');R(g,8,3,2,9,'#625941');});
  png('objetos/caixa.png',32,32,g=>EaiArt.crate(g,0,0,32,32));
  png('objetos/latinha.png',8,12,g=>{R(g,0,0,7,11,'#92ba8b');R(g,0,0,7,2,'#f4e7be');R(g,2,3,3,5,'#d7e2b0');R(g,0,10,7,1,'#dae2ba');});
  png('objetos/suco.png',9,16,g=>{R(g,2,0,5,3,'#d8dcaf');R(g,0,3,9,12,'#dba452');R(g,2,5,5,5,'#f8d97b');});
  for(const enemy of [false,true])png('objetos/'+(enemy?'fruta':'sonho')+'.png',8,8,g=>{R(g,0,0,7,enemy?7:6,enemy?'#e68249':'#e8c586');R(g,2,1,3,2,'#fff1bb');});
  png('objetos/juca.png',24,24,g=>{R(g,4,8,14,8,'#e9ebd1');R(g,14,2,7,9,'#e9ebd1');R(g,14,0,2,4,'#e9ebd1');R(g,19,0,2,4,'#e9ebd1');R(g,19,5,1,1,'#557866');R(g,6,14,2,6,'#e9ebd1');R(g,14,14,2,6,'#e9ebd1');R(g,0,5,3,8,'#e9ebd1');});
  return out;
 });
 for(const [name,data]of Object.entries(output)){const file=path.join(root,'assets/jogo',name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,Buffer.from(data,'base64'));}
 console.log(Object.keys(output).length+' PNGs exportados.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
