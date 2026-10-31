(()=>{
  'use strict';
  const config=window.EaiAssetConfig,images={},errors=[];
  const entries=[];
  for(const [id,source] of Object.entries(config.characters))entries.push(['character:'+id,typeof source==='string'?source:source.src]);
  for(const [id,src] of Object.entries(config.scenery||{}))entries.push(['scenery:'+id,src]);
  for(const [id,src] of Object.entries(config.ui||{}))if(typeof src==='string')entries.push(['ui:'+id,src]);
  for(const [id,src] of Object.entries(config.ui?.screens||{}))entries.push(['screen:'+id,src]);
  for(const [theme,scene] of Object.entries(config.scenes))for(const [part,src] of Object.entries(scene))if(typeof src==='string')entries.push([theme+':'+part,src]);
  for(const [id,src] of Object.entries(config.objects))entries.push([id,src]);
  for(const [id,src] of Object.entries(config.market||{}))entries.push(['market:'+id,src]);
  const ready=Promise.all(entries.map(([id,src])=>new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{images[id]=img;resolve();};
    img.onerror=()=>{errors.push(src);console.warn('Asset indisponível; usando desenho de reserva:',src);resolve();};
    img.src='assets/jogo/'+src;
  })));
  function draw(g,id,x,y,w,h){const img=images[id];if(!img)return false;g.drawImage(img,x,y,w,h);return true;}
  function sheet(g,id,column,row,columns,rows,x,y,w,h){const img=images[id];if(!img)return false;const sw=img.naturalWidth/columns,sh=img.naturalHeight/rows;g.drawImage(img,column*sw,row*sh,sw,sh,x,y,w,h);return true;}
  function character(g,id,pose,time){
    const entry=config.characters[id],layout=window.EaiCharacterAtlases?.[entry?.atlas],img=images['character:'+id];
    if(!layout||!img)return false;
    const animation=layout.animations[pose]||layout.animations.idle;
    const index=Math.max(0,Math.floor(time*animation.fps));
    const f=animation.frames[animation.loop?index%animation.frames.length:Math.min(index,animation.frames.length-1)];
    const ratio=29/layout.referenceHeight;
    g.save();
    if(f.clip){
      g.beginPath();
      f.clip.forEach(([x,y],i)=>g[i?'lineTo':'moveTo']((x-f.anchor[0])*ratio,27+(y-f.anchor[1])*ratio));
      g.closePath();g.clip();
    }
    g.drawImage(img,...f.rect,-f.anchor[0]*ratio,27-f.anchor[1]*ratio,f.rect[2]*ratio,f.rect[3]*ratio);
    g.restore();
    return true;
  }
  function tile(g,id,x,y,w,h,tileWidth){const img=images[id];if(!img)return false;for(let off=0;off<w;off+=tileWidth){const width=Math.min(tileWidth,w-off);g.drawImage(img,0,0,img.naturalWidth*width/tileWidth,img.naturalHeight,x+off,y,width,h);}return true;}
  window.EaiAssets={config,images,errors,ready,draw,sheet,tile,character};
})();
