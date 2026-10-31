const fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const videos=[
 'F:/Downloads/E ai Man (Construct 2 preview) 02_12_2016 14_47_09 (1).mp4',
 'F:/Downloads/E ai Man (Construct 2 preview) 03_12_2016 12_54_09.mp4',
 'F:/Downloads/E ai Man (Construct 2 preview) 02_12_2016 22_15_19.mp4'
];
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage();
 for(let i=0;i<videos.length;i++){
  const src='data:video/mp4;base64,'+fs.readFileSync(videos[i]).toString('base64');
  const result=await page.evaluate(async src=>{
   const v=document.createElement('video');v.muted=true;v.src=src;
   await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=j;});
   const c=document.createElement('canvas');c.width=1280;c.height=1200;const g=c.getContext('2d');g.fillStyle='#171d21';g.fillRect(0,0,c.width,c.height);
   for(let n=0;n<24;n++){let t=.15+(v.duration-.3)*n/23;await new Promise(r=>{v.onseeked=r;v.currentTime=t;});const x=n%4*320,y=Math.floor(n/4)*200;g.drawImage(v,x,y,320,180);g.fillStyle='white';g.font='13px monospace';g.fillText(t.toFixed(1)+'s',x+8,y+195);}
   return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,png:c.toDataURL().split(',')[1]};
  },src);
  fs.writeFileSync('tmp/video-'+(i+1)+'.png',Buffer.from(result.png,'base64'));delete result.png;console.log(JSON.stringify({video:videos[i],...result}));
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
