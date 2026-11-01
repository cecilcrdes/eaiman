(()=>{
  'use strict';
  const {rect:R,text:T,sprite}=EaiArt;
  const sceneSizes={sewer:[480,620],cart:[1950,270],mariana:[480,270],warehouse:[480,270],unloading:[480,270],garage:[480,270],'garage-yard':[480,270]};
  function bricks(g,w,h,color='#6b7468'){
    R(g,0,0,w,h,color);for(let y=0;y<h;y+=18){R(g,0,y,w,1,'#172b2730');for(let x=(y/18%2)*22;x<w;x+=44)R(g,x,y,1,18,'#172b2725');}
  }
  function lamp(g,x,y){R(g,x,y,68,5,'#b9c3a7');R(g,x+5,y+2,58,2,'#f8efb8');g.fillStyle='#fff0b50b';g.beginPath();g.moveTo(x,y+5);g.lineTo(x-35,y+125);g.lineTo(x+110,y+125);g.lineTo(x+68,y+5);g.fill();}
  function box(g,x,y,w=26,h=24){R(g,x,y,w,h,'#ad7e4e');R(g,x+1,y+1,w-2,h-2,'#bb925f');R(g,x+w*.42,y,w*.16,h,'#ddba7a');R(g,x,y+h-2,w,2,'#775c3f');R(g,x+4,y+4,6,5,'#6c5c43');}
  function fruit(g,x,y,color){R(g,x,y,7,6,color);R(g,x+1,y-1,5,8,color);R(g,x+3,y-3,1,3,'#596648');R(g,x+1,y+1,2,1,'#fff5ce80');}
  function backgroundRaw(g,scene){
    if(scene==='sewer'){
      bricks(g,480,620,'#777d74');R(g,45,80,390,510,'#354a3e');R(g,50,86,380,499,'#3f5141');R(g,82,0,125,85,'#60725c');
      g.fillStyle='#bed19d20';g.beginPath();g.moveTo(93,75);g.lineTo(192,75);g.lineTo(390,570);g.lineTo(60,570);g.fill();
      R(g,28,60,12,500,'#526b5e');R(g,28,550,85,12,'#526b5e');R(g,94,540,12,22,'#34483c');
      for(let y=80;y<560;y+=55){R(g,25,y,18,6,'#a8b09a');R(g,428,y,15,2,'#939e87');}
      for(let y=36;y<164;y+=13){R(g,98,y,4,5,'#c9ae72');R(g,98,y,38,3,'#c9ae72');R(g,133,y,4,5,'#c9ae72');}
      R(g,0,570,480,50,'#5d684e');R(g,0,565,55,7,'#8a9c60');R(g,405,565,75,7,'#8a9c60');
      T(g,'RUA ↑',116,48,8,'#e6dab4','center');T(g,'GALERIA DA POCINHA',240,608,8,'#c4c8a0','center');
    }else if(scene==='cart'){
      bricks(g,1950,270,'#d1c8a4');R(g,0,70,1950,200,'#a9b6a0');
      for(let x=0;x<1950;x+=56)R(g,x,74,1,196,'#7f94837a');for(let y=82;y<270;y+=48)R(g,0,y,1950,1,'#dae0bd');
      for(let x=30;x<1950;x+=180){R(g,x,35,130,40,'#667963');R(g,x-3,60,136,6,'#c3ad70');for(let n=0;n<10;n++)R(g,x+6+n*12,43,8,17,['#ad6650','#b5b176','#728f80'][n%3]);lamp(g,x+20,12);}
      for(let y=128;y<240;y+=50)for(let x=0;x<1950;x+=36)R(g,x,y,19,2,'#f4e4a36a');
      for(let x=190;x<1950;x+=310){T(g,'→',x,183,24,'#6e8d72');T(g,'SACOLÃO',x,33,8,'#e9e2b3');}
    }else if(scene==='mariana'){
      bricks(g,480,270,'#adbd9f');R(g,0,195,480,75,'#798e76');
      R(g,35,36,410,36,'#ac5449');T(g,'SACOLÃO DO MANECO',240,52,14,'#fff0bb','center');T(g,'HORTIFRÚTI • PREÇO BAIXO, CONFUSÃO ALTA',240,65,6,'#f2d19f','center');
      lamp(g,45,12);lamp(g,350,12);
      for(let i=0;i<3;i++){const x=72+i*125;R(g,x,101,93,71,'#4e654c');R(g,x-4,93,101,9,'#b69b63');for(let n=0;n<6;n++)fruit(g,x+12+n*12,115,['#d59f49','#b6b65b','#c97150'][i]);}
      T(g,'TECA • JOVEM APRENDIZ DA TURMA VERMELHA',240,88,7,'#3a5943','center');
    }else if(scene==='warehouse'){
      bricks(g,480,270,'#9da995');R(g,0,224,480,46,'#657568');T(g,'ALMOXARIFADO',240,19,13,'#314b3e','center');
      lamp(g,30,24);lamp(g,382,24);
      for(let floor=0;floor<3;floor++){const y=62+floor*43;R(g,58,y,365,6,'#50695e');R(g,56,y+5,369,3,'#d4b666');for(let x=66;x<420;x+=52){if(floor===0&&x>210&&x<320)continue;box(g,x,y-25,35,24);}}
      R(g,48,58,6,160,'#485f55');R(g,427,58,6,160,'#485f55');
      T(g,'SUPORTES DE SEGURANÇA',240,207,7,'#f2d577','center');
    }else if(scene==='unloading'){
      R(g,0,0,480,270,'#7c8479');bricks(g,480,65,'#a8b29a');
      for(let i=0;i<4;i++){const x=42+i*100;R(g,x,13,75,45,'#53645b');for(let y=16;y<58;y+=6)R(g,x,y,75,1,'#8c9983');T(g,String(i+1),x+36,42,18,'#d5c98f','center');}
      R(g,0,67,480,5,'#cfb66f');for(let x=30;x<480;x+=100)for(let y=80;y<270;y+=24)R(g,x,y,3,12,'#d1bd7a');
      for(let x=18;x<470;x+=24)R(g,x,249,14,5,'#ded2a0');T(g,'DESCARGA • ATENÇÃO À BUZINA',240,88,8,'#f4e3ae','center');
    }else if(scene==='garage-yard'){
      bricks(g,480,125,'#7e8b78');
      R(g,118,29,244,96,'#344b42');R(g,125,35,230,88,'#81907e');
      for(let y=38;y<123;y+=7)R(g,125,y,230,2,'#586f62');
      R(g,113,25,254,6,'#c9ad69');T(g,'SACOLÃO • RECEBIMENTO',240,20,8,'#f1e1ae','center');
      for(const x of [25,395]){R(g,x,40,60,40,'#344b42');R(g,x+4,44,52,32,'#546e62');R(g,x+28,44,3,32,'#9ca588');}
      R(g,0,125,480,145,'#777e70');R(g,0,125,480,5,'#b2a67f');
      for(const y of [143,198,244])for(let x=12;x<480;x+=38)R(g,x,y,21,2,'#c6b57c');
      for(const y of [173,228])for(const x of [40,420])T(g,'↔',x,y,15,'#b6b28b','center');
      box(g,129,103,22,22);box(g,320,104,24,21);
      T(g,'PÁTIO • CIRCULAÇÃO DE CAMINHÕES',240,262,6,'#d8d4ac','center');
    }else{
      bricks(g,480,270,'#7e8b78');R(g,210,42,228,183,'#344b42');R(g,215,48,218,177,'#81907e');for(let y=50;y<224;y+=9)R(g,215,y,218,2,'#586f62');
      R(g,204,35,240,9,'#c9ad69');T(g,'RECEBIMENTO • SACOLÃO',325,28,9,'#f1e1ae','center');lamp(g,70,31);
      for(let i=0;i<3;i++)for(let j=0;j<3-i;j++)box(g,22+j*30+i*15,201-i*25,29,24);
      R(g,0,224,480,46,'#637465');for(let x=0;x<480;x+=34)R(g,x,227,18,3,'#d3bd78');
      T(g,'LIXO INFLAMÁVEL',110,190,6,'#edc980','center');
    }
  }
  function objectRaw(g,id){
    if(id==='trash'){
      g.fillStyle='#2c493d';g.beginPath();g.moveTo(10,5);g.lineTo(7,2);g.lineTo(18,2);g.lineTo(16,6);g.lineTo(23,14);g.lineTo(24,25);g.lineTo(20,29);g.lineTo(3,29);g.lineTo(1,23);g.lineTo(3,13);g.closePath();g.fill();R(g,7,7,10,2,'#809176');R(g,7,13,2,9,'#68806b');R(g,13,16,7,6,'#b4b071');T(g,'!',16,21,7,'#293e32','center');
    }else if(id==='slingshot'){
      g.strokeStyle='#785532';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(14,27);g.lineTo(13,14);g.lineTo(5,5);g.moveTo(13,14);g.lineTo(23,4);g.stroke();g.strokeStyle='#d8ba7d';g.lineWidth=2;g.beginPath();g.moveTo(5,5);g.lineTo(14,9);g.lineTo(23,4);g.stroke();
    }else if(id==='cart'){
      R(g,9,7,35,21,'#6b8f8b');R(g,11,9,31,16,'#bdc9ad');for(let x=14;x<43;x+=7)R(g,x,8,2,19,'#6b8f8b');R(g,8,14,36,2,'#6b8f8b');R(g,5,5,6,2,'#d1b77c');R(g,5,2,2,6,'#577970');R(g,14,29,29,3,'#506f62');R(g,14,32,6,6,'#30493f');R(g,35,32,6,6,'#30493f');R(g,16,33,2,2,'#c6cdb1');R(g,37,33,2,2,'#c6cdb1');
    }else if(id==='truck'){
      R(g,4,0,39,61,'#adbaa8');R(g,8,4,31,52,'#d2d3b9');for(let y=8;y<55;y+=7)R(g,9,y,29,1,'#a4b29f');R(g,3,62,41,25,'#b75540');R(g,7,64,32,12,'#42685c');R(g,7,64,32,2,'#94ad9b');R(g,2,83,44,5,'#647465');R(g,5,82,7,3,'#f1d290');R(g,34,82,7,3,'#f1d290');R(g,0,66,4,14,'#293e35');R(g,44,66,4,14,'#293e35');
    }else if(id==='truck-side'){
      R(g,3,2,59,27,'#a7b29f');R(g,5,4,55,23,'#d2d3b9');
      for(let x=10;x<60;x+=8)R(g,x,5,1,21,'#a4b29f');
      R(g,62,12,20,19,'#b75540');R(g,78,21,10,10,'#b75540');
      R(g,65,14,13,9,'#42685c');R(g,66,15,10,2,'#94ad9b');
      R(g,2,29,86,4,'#43574b');R(g,85,25,4,4,'#f1d290');
      for(const x of [14,66]){R(g,x,29,12,9,'#263c33');R(g,x+3,31,6,5,'#a7b19c');}
    }else if(id==='expired'){
      R(g,1,1,10,13,'#d4b884');R(g,0,0,12,3,'#b05e4d');R(g,3,5,6,5,'#7e965c');T(g,'×',6,10,8,'#5c4532','center');
    }else if(id==='mariana'){
      R(g,8,3,16,16,'#72432f');R(g,5,2,21,8,'#332b2c');R(g,3,1,5,7,'#332b2c');R(g,22,1,6,8,'#332b2c');R(g,7,5,17,3,'#c95a4b');R(g,10,10,3,2,'#fff1c4');R(g,19,10,3,2,'#fff1c4');R(g,12,16,8,1,'#dd9e74');R(g,6,19,20,20,'#b95748');R(g,11,21,11,18,'#d1c59a');R(g,2,20,5,15,'#925c3d');R(g,26,20,5,15,'#925c3d');
    }else if(id==='neymar'){
      R(g,6,1,15,13,'#b77d52');R(g,4,0,19,5,'#af5744');R(g,19,3,8,3,'#af5744');R(g,15,7,3,2,'#263d32');R(g,4,15,19,13,'#bd5a48');R(g,1,15,4,12,'#b77d52');R(g,23,15,4,12,'#b77d52');R(g,6,28,7,9,'#536e72');R(g,16,28,7,9,'#536e72');R(g,4,36,10,3,'#3d493a');R(g,16,36,10,3,'#3d493a');
    }else if(id==='red-banner'){
      R(g,1,0,3,44,'#e5d6a7');R(g,4,2,29,25,'#b94d43');R(g,8,6,20,16,'#cb6250');T(g,'★',18,19,13,'#f7d883','center');
    }
  }
  const objectSizes={trash:[26,32],slingshot:[28,30],cart:[48,40],truck:[48,88],'truck-side':[90,38],expired:[12,15],mariana:[32,40],neymar:[28,40],'red-banner':[36,46]};
  function obj(g,id,x,y,w,h){if(EaiAssets.draw(g,'market:'+id,x,y,w,h))return;g.save();g.translate(x,y);g.scale(w/objectSizes[id][0],h/objectSizes[id][1]);objectRaw(g,id);g.restore();}
  function background(g,scene){if(EaiAssets.draw(g,'market:'+scene+'-bg',0,0,...sceneSizes[scene]))return;backgroundRaw(g,scene);}
  function streetLandmarks(g){
    const draw=(id,box,x,y,w,h)=>{const im=EaiAssets.images['scenery:'+id];if(im)g.drawImage(im,...box,x,y,w,h);};
    // Fachadas recortadas dos assets originais, organizadas sem usar o pack de referência.
    for(let block=0;block<10;block++){
      const x=block*420;
      draw('favelaSheet',[14,244,275,326],x,94,110,130);
      draw('favelaSheet',[299,245,396,442],x+110,46,158,178);
      draw('favelaSheet',[750,24,330,190],x+270,148,132,76);
    }
    draw('marketSheet',[1080,42,348,505],3320,4,150,220);
    draw('marketSheet',[1430,18,350,525],3500,4,147,220);
    draw('marketSheet',[1785,24,370,520],3685,4,156,220);
    // A fachada completa mantém a entrada do Sacolão visível no fim da rua.
    draw('marketSheet',[25,0,1005,515],4150,2,430,222);
  }
  function parallax(g,camera){
    const im=EaiAssets.images['scenery:marketParallax'];if(!im)return;
    const width=480,height=270,offset=-((camera*.12)%width);
    for(let x=offset-width;x<width*2;x+=width)g.drawImage(im,x,0,width,height);
  }
  function streetGround(g,w){
    const im=EaiAssets.images['scenery:marketGround'];if(!im)return;
    const start=Math.floor(w.camera/480)*480-480;
    for(let x=start;x<w.camera+960;x+=480)g.drawImage(im,x,6,480,270);
  }
  function portal(g,x,y,label,color='#f3d170'){R(g,x-5,y-9,56,37,'#273f35c0');R(g,x-3,y-7,52,33,'#acb49030');T(g,'E',x+21,y+4,10,color,'center');T(g,label,x+21,y+15,5,'#f1e4be','center');}
  function hazards(g,w,behind=false){
    for(const h of w.hazards){
      if(w.scene==='garage'&&(h.warning>0||h.y+h.h<=w.player.y+w.player.h)!==behind)continue;
      if(w.scene!=='garage'&&behind)continue;
      if(h.sideways){
        if(h.warning>0){
          R(g,0,h.y,480,h.h,'#e7a15c45');
          T(g,h.vx>0?'BUZINA! →':'← BUZINA!',240,h.y+23,9,'#ffe4a8','center');
        }else{
          g.save();g.translate(h.x+(h.vx<0?h.w:0),h.y);g.scale(h.vx<0?-1:1,1);obj(g,'truck-side',0,0,h.w,h.h);g.restore();
        }
        continue;
      }
      if(h.warning>0){
        const a=.2+.12*Math.sin(w.time*18);g.fillStyle=`rgba(246,157,85,${a})`;g.fillRect(h.kind==='truck'?h.x:0,h.kind==='truck'?85:h.y,h.kind==='truck'?h.w:480,h.kind==='truck'?185:h.h);
        T(g,h.kind==='truck'?'↓ BUZINA!':'CAIXAS →',h.kind==='truck'?h.x+h.w/2:240,h.kind==='truck'?110:h.y+20,7,'#ffe4a8','center');
      }else if(h.kind==='truck')obj(g,'truck',h.x,h.y,h.w,h.h);
      else{box(g,h.x,h.y,30,30);box(g,h.x+24,h.y+10,31,27);box(g,h.x+12,h.y-10,22,23);}
    }
  }
  function render(g,w,t){
    g.imageSmoothingEnabled=!!EaiAssets.config.smooth;
    if(w.scene==='street'){
      EaiArt.sky(g,0,w.camera,t);
      parallax(g,w.camera);
    }
    else R(g,0,0,480,270,'#243c32');
    g.save();g.translate(-Math.floor(w.camera),-Math.floor(w.cameraY));
    if(w.scene!=='street')background(g,w.scene==='rescue'?'garage':w.scene==='garage'?'garage-yard':w.scene);
    if(w.scene==='street'){streetPosts(g,w);streetLandmarks(g);streetGround(g,w);}
    if(!['cart','unloading','rescue','garage'].includes(w.scene))for(const p of w.level.platforms){if(p.x+p.w<w.camera||p.x>w.camera+480)continue;if(w.scene==='street')continue;EaiAssets.tile(g,p.h>20?'ground':'platform',p.x,p.y,p.w,p.h,p.h>20?24:20);}
    if(w.scene==='street'){
      R(g,858,222,46,4,'#273f36');for(let x=860;x<902;x+=6)R(g,x,223,2,3,'#90a58b');T(g,'↓ ACESSO AO ESGOTO',880,211,6,'#e7dcac','center');
      T(g,'BADOQUE ↑',345,106,7,'#ffe6a0','center');
      if(Math.abs(w.player.x-880)<70)portal(g,859,181,'ESGOTO');
      if(w.player.x>w.level.width-330)portal(g,w.level.width-285,178,w.slingshot?'E • SACOLÃO':'BADOQUE',w.slingshot?'#c6e098':'#ef9674');
    }
    if(w.scene==='sewer'){portal(g,98,110,'VOLTAR À RUA');obj(g,'trash',18,540,24,28);}
    for(const it of w.level.items){if(it.taken)continue;const y=it.y+Math.sin(t*3+it.x)*2;
      if(it.type==='slingshot'){g.fillStyle='#f6d87930';g.beginPath();g.arc(it.x+8,y+7,20,0,Math.PI*2);g.fill();obj(g,'slingshot',it.x-4,y-8,24,26);}
      else EaiAssets.draw(g,it.type==='flag'?'market:flag':it.type,it.x,y,it.type==='flag'?16:it.w,it.type==='flag'?28:it.h);
    }
    for(const b of w.bags)if(!b.exploded)obj(g,'trash',b.x-2,b.y-8,25,28);
    if(w.scene==='cart'){
      for(const o of w.cartObstacles)if(!o.hit)box(g,o.x,[112,162,212][o.lane],o.w,o.h);
      if(w.cartMode!=='riding')obj(g,'cart',w.cartMode==='boarding'?100:1840,171,42,35);
    }
    for(const e of w.level.enemies){
      if(e.hp<=0){if(e.kind==='neymar'&&w.transitionTimer>0){g.save();g.translate(e.x,e.y+(1.6-w.transitionTimer)*100);g.rotate((1.6-w.transitionTimer)*2);obj(g,'neymar',-10,0,24,34);g.restore();}continue;}
      if(e.hit>0&&Math.floor(t*25)%2)continue;
      if(e.kind==='teca'){if(e.visible)sprite(g,e.x-5,e.y,{id:'teca'},t,1,'idle',2);else{R(g,e.x+3,174,22,3,'#ae6552');}}
      else if(e.kind==='neymar')obj(g,'neymar',e.x-4,e.y-4,25,35);
      else if(e.kind==='maneco'){
        EaiArt.enemy(g,e,0,t);if(e.exposed>0){T(g,'EXPOSTO!',e.x+15,e.y-8,6,'#f8dc84','center');}else{R(g,e.x+9,e.y+15,14,18,'#8a9e88');T(g,'◆',e.x+16,e.y+28,10,'#d8ddbb','center');}
      }else EaiArt.enemy(g,e,0,t);
    }
    if(w.scene==='mariana'){
      R(g,69,153,348,29,'#8a6e49');R(g,66,150,354,5,'#d3ad72');
      for(let i=0;i<30;i++)fruit(g,76+i*11,145,['#d7a84b','#b7b35e','#bd7050'][Math.floor(i/10)]);
      for(let i=0;i<3;i++){R(g,72+i*120,174,107,2,'#c09a63');T(g,'OFERTA',125+i*120,170,6,'#f0d99f','center');}
    }
    if(w.scene==='warehouse')for(const s of w.supports){
      if(s.hp>0){R(g,s.x,s.y,s.w,s.h,s.hit>0?'#f6d57a':'#c1a263');R(g,s.x+5,s.y,3,s.h,'#725f40');T(g,'↓',s.x+7,s.y-6,10,'#f7d675','center');for(let k=0;k<s.hp;k++)R(g,s.x+k*5,s.y+s.h+4,3,2,'#f2d176');}
      else{R(g,s.x-4,214,22,4,'#a38451');R(g,s.x+3,210,17,3,'#a38451');}
    }
    const p=w.player;
    hazards(g,w,true);
    if(w.scene==='rescue'){
      obj(g,'red-banner',175,164,36,46);
      const st=w.stageTime,opening=Math.min(st/2,1);R(g,215,48+177*(1-opening),218,177*opening,'#203a30');
      if(st<2)T(g,'A GARAGEM ESTÁ ABRINDO…',240,88,8,'#f3d387','center');
      const tx=st<6?343:343+(st-6)*105;sprite(g,tx,197,1,t,1,st>6?'run':'idle');
      if(st<4.5){R(g,tx-1,211,17,3,'#dac18b');R(g,tx+1,216,13,3,'#dac18b');}
      sprite(g,p.x,197,0,t,1,st>2&&st<4||st>6?'run':'idle');
    }else if(p.inv<=0||Math.floor(t*14)%2){
      sprite(g,p.x,p.y,w.character,p.slide>0?(w.character.id==='luketa'?.36:.25)-p.slide:p.shoot>.03?.34-(w.upgrades.power||0)*.04-p.shoot:t,p.dir,w.scene==='cart'&&w.cartMode==='riding'?'idle':p.slide>0?'slide':p.shoot>.03?(w.slingshot?'sling':'shoot'):!p.grounded&&w.scene!=='unloading'?'jump':(Math.abs(p.vx)>0||w.scene==='garage'&&p.yardMoving)?'run':'idle');
      if(w.slingshot&&p.shoot>.16&&w.scene!=='cart'&&!EaiAssets.config.characters[w.character.id]?.atlas)obj(g,'slingshot',p.x+(p.dir>0?10:-10),p.y+6,13,14);
    }
    if(w.scene==='cart'&&w.cartMode==='riding')obj(g,'cart',p.x-9,p.y+11,42,35);
    for(const s of w.shots){if(s.kind==='box')box(g,s.x,s.y,s.w,s.h);else if(s.kind==='expired')obj(g,'expired',s.x,s.y,s.w,s.h);else if(s.kind==='fruit')EaiAssets.draw(g,'market:fruit-shot',s.x,s.y,8,8)||EaiAssets.draw(g,'fruit',s.x,s.y,8,8);else if(s.sling){R(g,s.x,s.y,4,4,'#e4dfb9');R(g,s.x+1,s.y,2,1,'#fff9dd');}else EaiAssets.draw(g,'bread',s.x,s.y,8,8);}
    hazards(g,w);
    for(const ex of w.explosions){const radius=(1-ex.life/.45)*ex.radius;g.strokeStyle='#ffd17e';g.lineWidth=3;g.beginPath();g.arc(ex.x,ex.y,radius,0,Math.PI*2);g.stroke();g.fillStyle='#f6b65a25';g.fill();}
    for(const f of w.particles)R(g,f.x,f.y,2,2,f.color);
    if(w.scene==='unloading'&&w.stageTime>=22){R(g,424,130,47,75,'#334c3c');portal(g,422,158,'GARAGEM');}
    g.restore();
    if(w.scene==='cart'){
      R(g,140,45,200,3,'#233c32');R(g,140,45,200*Math.min(1,w.cartX/1840),3,'#e6c565');
    }
    if(w.scene==='unloading'&&w.stageTime<22)T(g,(w.stageTime<11?'CAMINHÕES':'PILHAS DE CAIXAS')+' • '+Math.ceil(22-w.stageTime)+'s',240,51,8,'#fae4a8','center');
    if(w.scene==='rescue'){
      const caption=w.stageTime<2?'Luketa: Tuca! Eu sabia que você estava aqui.':w.stageTime<4.5?'Tuca: Man, ainda bem! Me tira daqui!':w.stageTime<6?'Luketa solta as cordas.':'Luketa: Bora! Ninguém fica pra trás.';
      R(g,45,234,390,26,'#17352de8');T(g,caption,240,250,8,'#f6e7ba','center');
    }
    if(w.aim&&w.slingshot&&!['cart','rescue','unloading'].includes(w.scene)){
      const x=w.aim.x-w.camera,y=w.aim.y-w.cameraY;g.strokeStyle='#fff1bc';g.lineWidth=1;g.beginPath();g.arc(x,y,5,0,Math.PI*2);g.moveTo(x-9,y);g.lineTo(x-3,y);g.moveTo(x+3,y);g.lineTo(x+9,y);g.moveTo(x,y-9);g.lineTo(x,y-3);g.moveTo(x,y+3);g.lineTo(x,y+9);g.stroke();
    }
  }
  window.EaiMarketArt={render,backgroundRaw,objectRaw,sceneSizes,objectSizes};
})();
