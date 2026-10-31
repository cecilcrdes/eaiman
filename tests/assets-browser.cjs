const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {pathToFileURL}=require('node:url'),path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('index.html')).href);await page.evaluate(()=>EaiAssets.ready);
  assert.deepEqual(await page.evaluate(()=>EaiAssets.errors),[]);
  const result=await page.evaluate(()=>{
   const sheets=[],invalid=[];const gallery=document.createElement('div');gallery.id='asset-preview';document.body.append(gallery);
   for(const [id,atlas] of Object.entries(EaiCharacterAtlases)){
    const img=EaiAssets.images['character:'+id];const c=document.createElement('canvas');c.width=960;c.height=660;const g=c.getContext('2d');g.fillStyle='#263b32';g.fillRect(0,0,c.width,c.height);
    Object.entries(atlas.animations).forEach(([pose,animation],row)=>animation.frames.forEach((f,col)=>{
     const [x,y,w,h]=f.rect;if(x<0||y<0||x+w>img.naturalWidth||y+h>img.naturalHeight)invalid.push(id+':'+pose+':'+col);
     g.fillStyle='#cdd7b5';g.font='10px monospace';g.fillText(pose+' '+col,col*120+5,row*110+15);
     g.save();g.translate(col*120+43,row*110+28);EaiArt.sprite(g,0,0,EaiEngine.CHARACTERS.find(ch=>ch.id===id)||{id},(col+.01)/animation.fps,1,pose,2);g.restore();
    }));
    c.id='preview-'+id;gallery.append(c);sheets.push(id);
   }
   return {sheets,invalid};
  });
  assert.deepEqual(result.invalid,[]);for(const id of result.sheets)await page.locator('#preview-'+id).screenshot({path:'tmp/animation-'+id+'.png'});await page.evaluate(()=>document.getElementById('asset-preview').remove());
  await page.getByRole('button',{name:'Sair',exact:true}).click();await page.getByRole('heading',{name:'Valeu, man!'}).waitFor();await page.getByRole('button',{name:'VOLTAR AO JOGO'}).click();
  await page.getByRole('button',{name:'Créditos',exact:true}).click();await page.getByRole('heading',{name:'Quem faz esse corre'}).waitFor();assert.deepEqual(errors,[]);
  console.log('Asset QA passed: sheets, all frame bounds, transparent render, new menu buttons and exit/return flow.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
