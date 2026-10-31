const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{const page=await browser.newPage();await page.goto(pathToFileURL(path.resolve('index.html')).href);
 const output=await page.evaluate(()=>{
  const out={};
  for(const [name,size]of Object.entries(EaiMarketArt.sceneSizes)){const c=document.createElement('canvas');c.width=size[0]*2;c.height=size[1]*2;const g=c.getContext('2d');g.scale(2,2);EaiMarketArt.backgroundRaw(g,name);out[name+'-bg']=c.toDataURL().split(',')[1];}
  for(const [name,size]of Object.entries(EaiMarketArt.objectSizes)){const c=document.createElement('canvas');c.width=size[0]*2;c.height=size[1]*2;const g=c.getContext('2d');g.scale(2,2);EaiMarketArt.objectRaw(g,name);out[name]=c.toDataURL().split(',')[1];}
  return out;
 });
 fs.mkdirSync('assets/jogo/mercado',{recursive:true});
 let count=0;for(const [name,data]of Object.entries(output)){const file='assets/jogo/mercado/'+name+'.png';if(fs.existsSync(file)){console.log('Preservado: '+file);continue;}fs.writeFileSync(file,Buffer.from(data,'base64'));count++;}
 console.log(count+' PNGs novos exportados.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
