(function(){
  'use strict';
  const {CHARACTERS,LEVELS}=EaiEngine;
  const palettes=[['#b6ac82','#cf986c','#a9b2a1','#daa77c','#98afa7','#c2a56f'],['#d2a682','#ae9f88','#b0a895','#c28569'],['#a5bba2','#ccb68d','#a9b8b4','#cf9f7b'],['#9e94a1','#bb9690','#91a4a5','#b5ac98']];
  const fract=v=>v-Math.floor(v),rand=n=>fract(Math.sin(n*127.1+311.7)*43758.5453);
  function rect(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
  function text(g,s,x,y,size=7,color='#f6e6b4',align='left'){g.fillStyle=color;g.font=`bold ${size}px monospace`;g.textAlign=align;g.fillText(s,Math.round(x),Math.round(y));}
  function building(g,x,y,w,h,col,seed,detail=true){
    rect(g,x,y,w,h,col);rect(g,x+w-5,y,5,h,'#263c3b28');rect(g,x-2,y-3,w+4,4,'#58665c');rect(g,x,y+2,w,2,'#eee1b359');
    if(detail){for(let by=y+9;by<y+h;by+=10){rect(g,x,by,w,1,'#6b59472b');for(let bx=x+(Math.floor(by/10)%2)*9;bx<x+w;bx+=18)rect(g,bx,by-9,1,9,'#685c4229');}}
    for(let wy=y+12;wy<y+h-12;wy+=25)for(let wx=x+7;wx<x+w-10;wx+=21){rect(g,wx-1,wy-1,12,15,'#e4d5ac');rect(g,wx,wy,10,12,'#435a57');rect(g,wx+2,wy+1,3,9,rand(seed+wx+wy)>.6?'#e4b566':'#7a9690');rect(g,wx,wy+6,10,1,'#273e38');rect(g,wx-2,wy+12,14,2,'#586759');}
    if(detail&&w>40){rect(g,x+9,y-11,18,8,'#647a78');rect(g,x+8,y-12,20,2,'#b0c2ad');rect(g,x+11,y-9,14,1,'#849a90');rect(g,x+w-12,y-20,1,18,'#4a5b51');rect(g,x+w-18,y-17,13,1,'#4a5b51');}
  }
  function sky(g,index,camera,t){
    if(window.EaiAssets?.draw(g,LEVELS[index].theme+':sky',0,0,480,270))return;
    const l=LEVELS[index];rect(g,0,0,480,270,l.sky);rect(g,347,23,39,35,l.light);rect(g,352,18,29,45,l.light);rect(g,342,28,49,25,l.light);
    for(let i=0;i<5;i++){let x=((i*116+35-camera*.08)%570+570)%570-50;rect(g,x,32+i%3*15,40,5,'#eaf0d780');rect(g,x+9,27+i%3*15,22,5,'#eaf0d780');}
    const pal=palettes[index];
    for(let layer=0;layer<3;layer++){
      const par=.12+layer*.16,step=layer===0?27:43;
      for(let i=-3;i<30;i++){
        let wx=i*step,xx=wx-camera*par;while(xx< -step*2)xx+=step*30;while(xx>510)xx-=step*30;
        const hill=28*Math.sin((i+layer*5)*.23),h=35+rand(i+layer*21)*65+layer*17,y=182+layer*14-h+hill;
        building(g,xx,y,step-2,h,pal[Math.floor(rand(i*3+layer)*pal.length)],i,layer===2);
        if(layer===0)rect(g,xx,y,step-2,h,l.sky+'55');
      }
    }
    rect(g,0,199,480,32,'#8b9877');
  }
  function wire(g,x,y,endX,endY,color='#435449'){
    g.strokeStyle=color;g.lineWidth=1;g.beginPath();g.moveTo(Math.round(x),y);g.quadraticCurveTo((x+endX)/2,Math.max(y,endY)+18,endX,endY);g.stroke();
  }
  function stall(g,x,y,color,kind=0){
    rect(g,x+2,y+12,3,45,'#6c6549');rect(g,x+67,y+12,3,45,'#6c6549');rect(g,x-3,y,78,7,'#eee0b3');
    for(let i=0;i<8;i++){rect(g,x-3+i*10,y,10,8,i%2?color:'#f1ddae');rect(g,x-3+i*10,y+8,10,5,i%2?color:'#e9cf9b');}
    rect(g,x,y+38,73,18,'#8f7250');rect(g,x+3,y+42,67,1,'#c8a56b');rect(g,x+22,y+38,2,18,'#665b42');rect(g,x+49,y+38,2,18,'#665b42');
    for(let i=0;i<12;i++){let fx=x+5+i*5,fy=y+32+(i%2)*3;rect(g,fx,fy,5,5,kind?'#c7bd5d':i<4?'#d97a49':i<8?'#b1ba69':'#ddbe62');rect(g,fx+2,fy-1,1,2,'#4e7251');}
    text(g,kind?'DOCES DA VÓ':'FRUTAS FRESCAS',x+36,y+25,5,'#fff0c6','center');
  }
  function crate(g,x,y,w=26,h=25){if(window.EaiAssets?.draw(g,'crate',x,y,w,h))return;rect(g,x,y,w,h,'#ac8051');rect(g,x+2,y+2,w-4,h-4,'#7e6545');for(let i=0;i<3;i++)rect(g,x+3,y+3+i*7,w-6,5,'#bd925d');rect(g,x+3,y+2,3,h-4,'#d0aa6f');rect(g,x+w-6,y+2,3,h-4,'#d0aa6f');}
  function foreground(g,index,camera,t){
    if(index===1){
      const sheet=window.EaiAssets?.images['scenery:schoolInterior'];
      if(sheet){
        const rows=[[0,0],[178,110]],tileWidth=1024,tileHeight=110,offset=Math.floor(camera/tileWidth)*tileWidth;
        for(const [sourceY,destY] of rows)for(let x=offset-tileWidth;x<camera+480;x+=tileWidth)g.drawImage(sheet,0,sourceY,1536,165,x,destY,tileWidth,tileHeight);
        return;
      }
    }
    if(window.EaiAssets?.draw(g,LEVELS[index].theme+':street',-camera,0,2400,270))return;
    const l=LEVELS[index],pal=palettes[index];
    for(let i=-1;i<13;i++){
      const wx=i*206+65,x=wx-camera;if(x>530||x< -210)continue;
      const h=95+rand(i+10)*35,y=224-h;
      building(g,x,y,117,h,pal[(i+pal.length)%pal.length],i+90,true);
      rect(g,x+19,186,32,38,'#374e43');rect(g,x+22,188,26,35,'#5d6b55');for(let k=0;k<7;k++)rect(g,x+22,190+k*5,26,1,'#83907a');
      rect(g,x+68,194,26,30,'#466250');rect(g,x+89,209,2,2,'#d3bc70');
      if(index===0){rect(g,x+10,156,99,15,'#6e8c63');text(g,i%3===0?'SACOLÃO':i%3===1?'MERCEARIA':'FEIRINHA',x+60,166,9,'#f5e2a1','center');stall(g,x+23,168,i%2?'#bb7450':'#708a59',i%3===1);}
      else if(index===1){rect(g,x+8,159,102,17,'#b06580');text(g,i%2?'GRANDE BELEZA':'SOM NO BECO',x+58,170,8,'#f8e4be','center');rect(g,x+75,198,18,26,'#293c39');rect(g,x+79,204,10,10,'#57655b');}
      else if(index===2){rect(g,x+5,175,106,28,'#597c66');text(g,'POCINHA F.C.',x+58,190,9,'#e5e1b2','center');}
      else if(index===3){rect(g,x+5,155,106,22,'#cbb77e');text(g,'ESCOLA PÚBLICA',x+58,169,8,'#3c5e54','center');}
      else{text(g,'OS CANÁRIOS',x+59,182,9,'#ebd66a','center');text(g,'A NOSSA VOZ!',x+59,195,6,'#e9d9c0','center');}
      if(i%2===0){wire(g,x+100,y+25,x+216,y+15);for(let k=0;k<5;k++){rect(g,x+125+k*15,y+33+(k%3),9,12,['#d7c899','#bf795e','#6e9592'][k%3]);rect(g,x+123+k*15,y+33+(k%3),13,4,['#d7c899','#bf795e','#6e9592'][k%3]);}}
    }
    for(let i=0;i<8;i++){let x=i*340+25-camera;if(x< -100||x>580)continue;rect(g,x,68,4,156,'#5b6351');rect(g,x-8,85,20,3,'#455a4d');rect(g,x-5,80,3,7,'#d6c28b');rect(g,x+7,80,3,7,'#d6c28b');wire(g,x-330,77,x+1,83);wire(g,x-330,86,x+1,89);}
    if(index===2){for(let x=1640;x<2010;x+=12){rect(g,x-camera,165,1,59,'#7eaa8b');}rect(g,1640-camera,164,370,2,'#b7c7a4');rect(g,1670-camera,188,43,3,'#ece2ba');rect(g,1670-camera,188,3,36,'#ece2ba');rect(g,1710-camera,188,3,36,'#ece2ba');}
    const gx=2280-camera;rect(g,gx,161,5,63,'#5d684f');rect(g,gx+65,161,5,63,'#5d684f');rect(g,gx-3,153,77,14,l.color);text(g,'CHEGADA',gx+35,163,8,'#fff1be','center');
    for(let i=0;i<9;i++)rect(g,gx+4+i*7,170+(i%2)*5,7,5,i%2?'#f4e6bc':'#465b4b');
  }
  function sprite(g,x,y,char=0,frame=0,dir=1,pose='idle',scale=1){
    const c=typeof char==='number'?CHARACTERS[char]:char;
    if(window.EaiAssets?.images['character:'+c.id]){
      const row=Math.max(0,['idle','run','shoot','slide','jump'].indexOf(pose==='sling'?'shoot':pose));
      const col=Math.floor(frame*(pose==='run'?16:6))%8;
      g.save();g.imageSmoothingEnabled=EaiAssets.config.smooth;g.translate(Math.round(x+7*scale),Math.round(y));g.scale(dir*scale,scale);
      if(!EaiAssets.character(g,c.id,pose,frame))EaiAssets.sheet(g,'character:'+c.id,col,row,8,5,-16,-5,32,40);g.restore();return;
    }
    g.save();g.translate(Math.round(x+7*scale),Math.round(y));g.scale(dir*scale,scale);
    if(pose==='slide'){g.translate(0,15);g.rotate(-.5*dir);}
    const walking=pose==='run',s=walking?Math.sin(frame*13)*3:0,bob=walking?Math.abs(Math.sin(frame*13)):0;
    g.translate(0,-bob);
    const R=(x,y,w,h,col)=>rect(g,x,y,w,h,col);
    if(c.id==='jana'){R(-9,1,17,11,c.hair);R(-11,4,3,8,c.hair);R(7,2,4,11,c.hair);R(-7,-2,13,4,c.hair);}
    if(c.id==='lea'){R(-9,2,14,10,c.hair);R(-12,5,7,13,c.hair);R(-13,8,4,7,'#47312e');}
    R(-5,1,10,10,c.skin);R(-5,0,10,c.id==='tuca'?4:3,c.hair);if(c.id==='tuca'){R(-4,-2,8,3,c.hair);R(-2,-3,5,2,c.hair);}R(-6,5,2,4,c.skin);R(4,5,2,3,c.skin);R(1,4,3,2,'#f3e6bd');R(2,4,1,2,'#242a27');R(2,8,3,1,'#4b352b');R(-2,10,5,3,c.skin);
    R(-5,12,11,9,'#e8bb40');R(-4,12,8,3,'#f7db5b');R(-1,16,4,2,'#fae477');R(-5,19,11,2,'#ab873e');
    R(-8,12,3,7,c.skin);R(6,12,3,7,c.skin);if(pose==='shoot'){R(6,13,8,3,c.skin);R(12,11,2,5,'#ac794d');}else{R(-8,17+s/2,3,3,c.skin);R(6,17-s/2,3,3,c.skin);}
    R(-5,21,5,4,c.pants);R(1,21,5,4,c.pants);R(-5,24+s,4,3,c.skin);R(2,24-s,4,3,c.skin);R(-6,26+s,6,2,c.shoes);R(1,26-s,7,2,c.shoes);R(-6,28+s,6,1,'#343c36');R(1,28-s,7,1,'#343c36');
    g.restore();
  }
  function enemy(g,e,index,t){
    const l=LEVELS[index];if(e.hit>0&&Math.floor(t*30)%2)return;
    const asset=l.theme+(e.boss?':boss':':rival');
    const sheet=window.EaiAssets?.images[asset];
    if(sheet){const detailed=sheet.naturalWidth===1536&&sheet.naturalHeight===1024,columns=detailed?16:8,rows=detailed?4:1;g.save();g.translate(e.x+e.w/2,e.y+e.h);g.scale(e.dir,1);EaiAssets.sheet(g,asset,Math.floor(t*10)%columns,detailed?1:0,columns,rows,-e.w/2,-e.h,e.w,e.h);g.restore();return;}
    if(!e.boss){sprite(g,e.x,e.y,{...CHARACTERS[1],id:'enemy',hair:'#594639',pants:'#636f65',skin:'#b17c50'},t,e.dir,'run');rect(g,e.x+2,e.y+12,11,9,l.color);rect(g,e.x,e.y,16,3,l.color);return;}
    const x=e.x,y=e.y;rect(g,x+4,y,19,15,'#bd895e');rect(g,x+4,y,19,4,'#5f493a');rect(g,x+2,y+6,3,6,'#bd895e');rect(g,x+21,y+6,3,6,'#bd895e');rect(g,x+7,y+6,3,2,'#2a3b32');rect(g,x+17,y+6,3,2,'#2a3b32');rect(g,x+8,y+10,12,3,'#594133');rect(g,x+2,y+15,24,19,l.color);rect(g,x,y+17,4,16,'#bd895e');rect(g,x+26,y+17,4,16,'#bd895e');rect(g,x+7,y+17,14,17,index===0?'#e8dab0':'#dec778');rect(g,x+5,y+34,9,7,'#57635d');rect(g,x+16,y+34,9,7,'#57635d');rect(g,x+3,y+41,11,3,'#37443c');rect(g,x+16,y+41,11,3,'#37443c');
  }
  function schoolArena(g,world,t){
    const d=world.dance,transition=world.schoolStage==='transition',theater=world.schoolStage==='juju';
    rect(g,0,0,480,270,theater||transition?'#241f36':'#d8c49c');
    if(theater||transition){
      rect(g,0,0,480,192,'#563248');for(let x=0;x<480;x+=18)rect(g,x,0,8,185,x%36?'#71384c':'#843d4c');rect(g,0,176,480,17,'#d5a75c');
      // Stage slides in from the right during the entrance beat.
      const slide=transition?Math.max(0,Math.min(1,(2.4-world.transitionTimer)/1.3)):1,off=(1-slide)*360;
      rect(g,75+off,156,480,84,'#714d46');rect(g,75+off,153,480,7,'#e3b55d');rect(g,107+off,210,438,30,'#4c3a3e');
      for(const x of [90,130,378,418]){rect(g,x+off,102,28,56,'#252936');rect(g,x+off+4,106,20,48,'#49515c');rect(g,x+off+8,119,12,19,'#222631');rect(g,x+off+10,124,8,8,'#bb83c6');}
      if(!transition){const x=270,y=128;rect(g,x-10,y,20,11,'#81503e');rect(g,x-10,y+11,20,20,'#db6c98');rect(g,x-9,y+2,18,8,'#e0ae72');rect(g,x-15,y+30,12,12,'#674e72');rect(g,x+3,y+30,12,12,'#674e72');rect(g,x+16,y+4,2,24,'#d7c6ae');rect(g,x+14,y+2,8,3,'#eee5ce');
        for(const w of world.sonicWaves||[]){g.strokeStyle='#f7d5fa';g.lineWidth=3;g.beginPath();g.arc(w.x,w.y,9+Math.sin(t*12)*2,-1.1,1.1);g.stroke();g.beginPath();g.arc(w.x,w.y,15+Math.sin(t*12)*2,-1.1,1.1);g.stroke();}
      }
    }else{
      rect(g,0,0,480,160,'#d7c7a1');rect(g,22,26,436,82,'#788b8a');rect(g,29,32,422,70,'#435b5b');
      rect(g,36,42,100,4,'#d6d1b0');text(g,'SALA DE AULA',86,60,9,'#f2e3b7','center');
      for(const x of [18,424]){rect(g,x,116,38,48,'#29363a');rect(g,x+5,121,28,37,'#566871');rect(g,x+10,130,18,15,'#8c7392');}
      rect(g,0,171,480,11,'#806044');rect(g,0,182,480,88,'#80664a');rect(g,0,187,480,4,'#c8a46e');
      // Students form a loose dance circle around Luketa and Michelly.
      for(let i=0;i<8;i++){const a=i*Math.PI/4,x=240+Math.cos(a)*82,y=174+Math.sin(a)*10;rect(g,x-6,y-19,12,9,'#754b3c');rect(g,x-7,y-10,14,14,i%2?'#db7297':'#678f92');rect(g,x-6,y+4,5,8,'#42434a');rect(g,x+1,y+4,5,8,'#42434a');}
      rect(g,227,142,25,15,'#5b3e37');rect(g,229,135,21,10,'#d9a879');rect(g,226,153,27,19,'#e574a0');rect(g,228,171,9,10,'#343844');rect(g,242,171,9,10,'#343844');
      text(g,'MICHELLY',240,129,7,'#fff1bd','center');
    }
    if(world.player){const p=world.player;sprite(g,theater?Math.max(44,Math.min(135,p.x)):p.x,p.y,world.character,t,p.dir,'idle',1.3);}
    if(transition){rect(g,130,88,220,54,'#263d39');text(g,'O TEATRO DA ESCOLA',240,108,12,'#f5d986','center');text(g,'O PALCO ESTÁ CHEGANDO…',240,126,7,'#fff0d0','center');return;}
    if(!d)return;
    rect(g,8,8,176,37,'#203632dd');text(g,theater?'JUJU • BATALHA NO TEATRO':'MICHELLY • BATALHA DE DANÇA',16,21,7,'#fff0c4');text(g,`ACERTOS ${d.hits}/${d.keys.length} • ${Math.floor(d.hits/d.keys.length*100)}%`,16,36,7,'#f4d481');
    rect(g,192,18,96,42,'#263d39dd');const symbol={left:'←',right:'→',up:'↑',down:'↓'};text(g,symbol[d.keys[d.index]]||'♪',240,48,25,'#ffe18a','center');rect(g,196,63,88,4,'#283834');rect(g,196,63,88*Math.max(0,d.timer/d.noteTime),4,'#ee8b74');
    text(g,'ACERTE PELO MENOS 50% DA MÚSICA',240,256,7,'#fff0c4','center');if(theater)text(g,'A/D DESVIA • ESPAÇO PULA • Z ABAIXA • X DISTRAI',240,245,6,'#f8d49b','center');
  }
  function render(g,world,t=0,menu=false,index=0){
    g.imageSmoothingEnabled=!!window.EaiAssets?.config.smooth;const cam=world?world.camera:menu?260:0;index=world?world.level.index:index;
    if(world&&index===1&&world.schoolStage!=='yard'){schoolArena(g,world,t);return;}
    sky(g,index,cam,t);foreground(g,index,cam,t);
    g.save();g.translate(-Math.floor(cam),0);
    const plats=world?world.level.platforms:EaiEngine.createLevel(index).platforms;
    for(const p of plats){if(p.x+p.w<cam||p.x>cam+480)continue;if(window.EaiAssets?.tile(g,p.h>20?'ground':'platform',p.x,p.y,p.w,p.h,p.h>20?24:20)){if(p.h<=20&&p.y>160&&p.w<100)crate(g,p.x+4,p.y+12,Math.min(p.w-8,40),224-p.y-12);continue;}if(p.h>20){rect(g,p.x,p.y,p.w,p.h,'#6e7058');rect(g,p.x,p.y,p.w,4,'#c6bb91');rect(g,p.x,p.y+4,p.w,3,'#9d9a74');for(let i=Math.floor(p.x/24)*24;i<p.x+p.w;i+=24){rect(g,Math.max(i,p.x),p.y+14,Math.min(22,p.x+p.w-Math.max(i,p.x)),1,'#8c8a67');rect(g,i+11,p.y+8,1,7,'#92916c');rect(g,i+7,p.y+30,14,2,'#5e6750');}}
      else{rect(g,p.x,p.y,p.w,p.h,'#8b714e');rect(g,p.x-2,p.y,p.w+4,3,'#cfb077');rect(g,p.x+3,p.y+5,p.w-6,2,'#b4925c');for(let i=p.x+8;i<p.x+p.w;i+=20)rect(g,i,p.y+3,2,9,'#625941');if(p.y>160&&p.w<100){crate(g,p.x+4,p.y+12,Math.min(p.w-8,40),224-p.y-12);}}
    }
    if(world){
      for(const item of world.level.items){if(item.taken)continue;const y=item.y+Math.sin(t*3+item.x)*2;if(window.EaiAssets?.draw(g,item.type==='flag'?LEVELS[index].theme+':flag':item.type,item.x,y,item.type==='flag'?16:item.w,item.type==='flag'?28:item.h))continue;if(item.type==='can'){rect(g,item.x,y,7,11,'#92ba8b');rect(g,item.x,y,7,2,'#f4e7be');rect(g,item.x+2,y+3,3,5,'#d7e2b0');rect(g,item.x,y+10,7,1,'#dae2ba');}else if(item.type==='flag'){rect(g,item.x,y,2,25,'#ebe1b2');rect(g,item.x+2,y+1,13,10,LEVELS[index].color);rect(g,item.x+4,y+3,4,4,'#f9dc7b');}else{rect(g,item.x+2,y,5,3,'#d8dcaf');rect(g,item.x,y+3,9,12,'#dba452');rect(g,item.x+2,y+5,5,5,'#f8d97b');}}
      if(world.checkpoint){rect(g,1180,199,2,25,'#e7dabc');rect(g,1182,199,13,9,'#b8d383');}
      for(const e of world.level.enemies)if(e.hp>0)enemy(g,e,index,t);
      for(const s of world.shots){if(s.sling){rect(g,s.x,s.y,5,5,'#d3caac');rect(g,s.x+1,s.y,3,2,'#fff0c6');}else if(window.EaiAssets?.draw(g,s.enemy?'fruit':'bread',s.x,s.y,8,8))continue;else{rect(g,s.x,s.y,s.w,s.h,s.enemy?'#e68249':'#e8c586');rect(g,s.x+2,s.y+1,3,2,'#fff1bb');}}
      const p=world.player;if(p.inv<=0||Math.floor(t*13)%2){sprite(g,p.x,p.y,world.character,p.slide>0?(world.character.id==='luketa'?.36:.25)-p.slide:p.shoot>.03?.36-(world.upgrades.power||0)*.055-p.shoot:t,p.dir,p.slide>0?'slide':p.shoot>.03?'shoot':!p.grounded?'jump':Math.abs(p.vx)>0?'run':'idle');if(world.upgrades.badogue&&p.shoot>.08)window.EaiAssets?.draw(g,'market:slingshot',p.x+(p.dir>0?9:-10),p.y+7,13,14);}
      for(const f of world.particles)rect(g,f.x,f.y,2,2,f.color);
    }else{sprite(g,cam+350,194,0,t,1,'idle',1);sprite(g,cam+398,194,1,t,-1,'idle',1);}
    g.restore();
    if(world?.upgrades.badogue&&world.aim){const x=world.aim.x-world.camera,y=world.aim.y;g.strokeStyle='#fff1bc';g.lineWidth=1;g.beginPath();g.arc(x,y,5,0,Math.PI*2);g.moveTo(x-9,y);g.lineTo(x-3,y);g.moveTo(x+3,y);g.lineTo(x+9,y);g.moveTo(x,y-9);g.lineTo(x,y-3);g.moveTo(x,y+3);g.lineTo(x,y+9);g.stroke();}
    // Juca watches the market from the wall.
    if(index===0&&!window.EaiAssets?.draw(g,'cat',621-cam,148,24,24)){const x=625-cam;rect(g,x,156,14,8,'#e9ebd1');rect(g,x+10,150,7,9,'#e9ebd1');rect(g,x+10,148,2,4,'#e9ebd1');rect(g,x+15,148,2,4,'#e9ebd1');rect(g,x+15,153,1,1,'#557866');rect(g,x+2,162,2,6,'#e9ebd1');rect(g,x+10,162,2,6,'#e9ebd1');rect(g,x-4,153,3,8,'#e9ebd1');}
  }
  window.EaiArt={render,sprite,sky,foreground,enemy,crate,rect,text};
})();
