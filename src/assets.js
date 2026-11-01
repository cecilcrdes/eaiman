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
  const layoutMarkers={platforms:[],items:[],enemies:[]};
  function prepareMarketLayout(img){
    const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
    const g=canvas.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);const frame=g.getImageData(0,0,canvas.width,canvas.height),pixels=frame.data,total=canvas.width*canvas.height,seen=new Uint8Array(total),queue=new Int32Array(total);
    const category=i=>{const p=i*4,r=pixels[p],v=pixels[p+1],b=pixels[p+2];return v>245&&r<24&&b<48?1:b>240&&r<85&&v<30?2:r>240&&v<35&&b<35?3:0;};
    for(let i=0;i<total;i++){const kind=category(i);if(!kind)continue;pixels[i*4+3]=0;if(seen[i])continue;
      let head=0,tail=0,minX=canvas.width,maxX=0,minY=canvas.height,maxY=0,area=0;queue[tail++]=i;seen[i]=1;
      while(head<tail){const n=queue[head++],x=n%canvas.width,y=(n-x)/canvas.width;area++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
        const add=m=>{if(m<0||m>=total||seen[m]||category(m)!==kind)return;seen[m]=1;pixels[m*4+3]=0;queue[tail++]=m;};
        if(x)add(n-1);if(x+1<canvas.width)add(n+1);if(y)add(n-canvas.width);if(y+1<canvas.height)add(n+canvas.width);
      }
      const box={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1,area};
      if(kind===1&&area>220&&box.w>24)layoutMarkers.platforms.push(box);
      else if(kind===2&&area>60)layoutMarkers.items.push(box);
      else if(kind===3&&area>160&&box.h>14)layoutMarkers.enemies.push(box);
    }
    g.putImageData(frame,0,0);return canvas;
  }
  const ready=Promise.all(entries.map(([id,src])=>new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{images[id]=id==='scenery:marketLayout'?prepareMarketLayout(img):img;resolve();};
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
  window.EaiAssets={config,images,errors,ready,layoutMarkers,draw,sheet,tile,character};
})();
