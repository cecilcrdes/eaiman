(function(root){
  'use strict';
  const E=typeof module!=='undefined'?require('./engine.js'):root.EaiEngine;
  const {World,CHARACTERS,clamp,overlap}=E;
  const ACHIEVEMENTS={sewer:'Por baixo da quebrada',flags:'Bandeiras da Rua de Baixo',mariana:'Aprendiz Teca',neymar:'Estoque em queda',maneco:'Fim do expediente'};
  const SCENES={street:'Rua da Feirinha',sewer:'Esgoto secreto',cart:'Corredores do Sacolão',mariana:'Banca de Teca',warehouse:'Almoxarifado • Neymar',unloading:'Pátio de descarga',garage:'Garagem • Seu Maneco',rescue:'Ninguém fica pra trás'};
  const flagIds=['street-flag-1','street-flag-2','sewer-flag'];
  function cleanCheckpoint(raw){
    if(!raw||raw.version!==2||!['warehouse','unloading','garage','rescue'].includes(raw.scene)||raw.slingshot!==true)return null;
    return {version:2,scene:raw.scene,slingshot:true,cans:Number.isFinite(raw.cans)?clamp(Math.floor(raw.cans),0,1000):0,
      collected:Array.isArray(raw.collected)?[...new Set(raw.collected.filter(v=>typeof v==='string'&&/^(street|sewer|cart)-[a-z0-9-]+$/.test(v)))].slice(0,100):[],
      redFlag:raw.scene==='rescue',time:Number.isFinite(raw.time)?clamp(raw.time,0,99999):0};
  }
  function item(id,type,x,y){return {id,type,x,y,w:type==='flag'?14:12,h:type==='flag'?25:15,taken:false};}
  function rival(x){return {kind:'rival',x,y:198,w:16,h:26,origin:x,dir:-1,hp:2,maxHp:2,hit:0,shoot:1.8,boss:false};}
  function trash(x,y=204){return {x,y,w:20,h:20,exploded:false};}
  class MarketWorld extends World{
    constructor(character=0,upgrades={},checkpoint=null,random=Math.random){
      super(0,character,upgrades);this.market=true;this.random=random;this.collected=new Set();this.achievements=new Set(upgrades.achievements||[]);
      this.slingshot=!!upgrades.badogue;this.redFlag=false;this.sceneCache={};this.scene='street';this.cameraY=0;this.stageTime=0;this.lastHint=-10;this.aim=null;
      this.checkpointData=null;this.checkpoint=false;this.enter('street');this.setCheckpoint(false);
      const saved=cleanCheckpoint(checkpoint);if(saved){this.restore(saved);this.checkpointData=this.snapshot();this.checkpoint=true;}
    }
    get sceneName(){return SCENES[this.scene];}
    get boss(){return this.level.enemies.find(e=>e.boss&&e.hp>0);}
    get goal(){
      if(this.scene==='street')return this.slingshot?'ATRAVESSE A FAVELA ATÉ O SACOLÃO →':'PEGUE O BADOQUE NA LAJE';
      if(this.scene==='sewer')return 'EXPLORE • E NA ESCADA PARA VOLTAR';
      if(this.scene==='cart')return this.cartMode==='riding'?'↑ / ↓: DESVIE NOS CORREDORES':'ENTRANDO / SAINDO DO CARRINHO';
      if(this.scene==='mariana')return 'MIRE QUANDO TECA APARECER';
      if(this.scene==='warehouse')return this.supports.every(s=>s.hp<=0)?'NEYMAR PERDEU O EQUILÍBRIO!':'ACERTE OS 3 SUPORTES DA ESTANTE';
      if(this.scene==='unloading')return this.stageTime<22?'DESVIE DAS FAIXAS E DAS CAIXAS':'E: ENTRAR NA GARAGEM →';
      if(this.scene==='garage')return this.boss?.exposed>0?'MANECO EXPOSTO! USE O BADOQUE':'↑↓: DESVIE • EXPLODA O LIXO';
      return 'LUKETA E TUCA • JUNTOS DE NOVO';
    }
    hint(text){if(this.time-this.lastHint>2){this.lastHint=this.time;this.event('hint',{text});}}
    award(id){if(!this.achievements.has(id)){this.achievements.add(id);this.event('achievement',{id,title:ACHIEVEMENTS[id]});}}
    snapshot(){return {version:2,scene:this.scene,slingshot:this.slingshot,cans:this.cans,collected:[...this.collected],redFlag:this.redFlag,time:this.time};}
    setCheckpoint(persist=true){this.checkpointData=this.snapshot();this.checkpoint=true;if(persist)this.event('marketCheckpoint',{checkpoint:this.checkpointData});}
    restore(data){this.slingshot=data.slingshot;this.collected=new Set(data.collected);this.flags=flagIds.filter(id=>this.collected.has(id)).length;this.cans=data.cans;this.redFlag=data.redFlag;this.time=data.time;this.sceneCache={};this.status='playing';this.enter(data.scene);this.player.hp=this.player.maxHp;this.player.inv=1.5;}
    retryCheckpoint(){if(!this.checkpointData)return false;this.restore(this.checkpointData);return true;}
    enter(scene,returning=false){
      const previous=this.scene;
      if(this.level&&['street','sewer'].includes(previous))this.sceneCache[previous]={level:this.level,bags:this.bags};
      this.scene=scene;this.stageTime=0;this.camera=0;this.cameraY=0;this.shots=[];this.particles=[];this.hazards=[];this.explosions=[];this.supports=[];this.prev={};this.transitionTimer=0;this.nextHazard=1.4;this.lastHint=-10;this.bossDefeated=false;
      this.level={index:0,width:480,height:270,platforms:[{x:0,y:224,w:480,h:70}],items:[],enemies:[]};this.bags=[];
      Object.assign(this.player,{x:45,y:197,vx:0,vy:0,grounded:false,slide:0,jumps:0,shoot:0,inv:1});
      if(scene==='street'){
        this.level.width=4600;const ledges=[];for(let block=0;block<10;block++){const x=block*420;ledges.push([x+3,168,107],[x+110,170,158],[x+110,123,158],[x+270,151,132]);}this.level.platforms=[{x:0,y:224,w:this.level.width,h:70},...ledges.map(([x,y,w])=>({x,y,w,h:8}))];
        this.level.items=[...(!this.slingshot?[item('street-sling','slingshot',315,123)]:[]),item('street-flag-1','flag',207,137),item('street-flag-2','flag',2440,73),item('street-flag-far','flag',3900,60),item('street-juice','juice',1010,207),item('street-juice-middle','juice',2360,207),item('street-juice-last','juice',3670,207)];
        for(const [i,x]of [100,185,230,320,465,590,670,940,1080,1230,1390,1620,1810,2030,2220,2470,2670,2880,3060,3330,3540,3780,3970,4150].entries())this.level.items.push(item('street-can-'+i,'can',x,x<700?(x<150?207:x<300?168:x<465?137:x<625?112:84):x>4150?107:x%2?142:198));
        this.level.enemies=[rival(770),rival(1120),rival(1530),rival(1910),rival(2290),rival(2670),rival(3030),rival(3530),rival(4000)];this.bags=[trash(735),trash(1090),trash(1495),trash(1850),trash(2385),trash(2970),trash(3540),trash(4110)];
        if(returning&&this.sceneCache.street){this.level=this.sceneCache.street.level;this.bags=this.sceneCache.street.bags;}
        if(returning){this.player.x=520;this.player.y=197;}
      }else if(scene==='sewer'){
        this.level.height=620;this.level.platforms=[{x:0,y:570,w:480,h:70}];
        for(let i=0;i<10;i++)this.level.platforms.push({x:i%2?250:80,y:525-i*45,w:130,h:10});
        this.player.x=115;this.player.y=138;
        this.level.items=[item('sewer-flag','flag',310,452),item('sewer-juice','juice',230,552)];
        for(let i=0;i<12;i++)this.level.items.push(item('sewer-can-'+i,'can',150+i%6*30,Math.floor(i/6)?552:324));
        if(this.sceneCache.sewer){this.level=this.sceneCache.sewer.level;this.bags=this.sceneCache.sewer.bags;}
        this.award('sewer');
      }else if(scene==='cart'){
        this.level.width=1950;this.cartMode='boarding';this.cartLane=1;this.cartX=35;this.player.x=35;this.player.y=150;
        this.cartObstacles=[];
        for(let i=0;i<12;i++)this.cartObstacles.push({x:360+i*118,lane:(i*2+1)%3,w:28,h:25,hit:false});
        for(let i=0;i<15;i++)this.level.items.push(item('cart-can-'+i,'can',250+i*100,[100,150,200][i%3]));
      }else if(scene==='mariana'){
        this.level.enemies=[{kind:'teca',name:'Teca • Jovem Aprendiz',x:116,y:105,w:29,h:78,hp:9,maxHp:9,hit:0,boss:true,visible:false,cycle:0,shoot:.7,dir:-1}];
        this.player.x=65;
      }else if(scene==='warehouse'){
        this.level.enemies=[{kind:'neymar',name:'Neymar',x:250,y:32,w:18,h:30,hp:9,maxHp:9,hit:0,boss:true,dir:1,shoot:1.1,fall:0}];
        this.supports=[110,240,370].map(x=>({x,y:137,w:14,h:52,hp:3,maxHp:3,hit:0}));
      }else if(scene==='unloading'){
        this.player.x=225;this.player.y=225;this.nextHazard=1;
      }else if(scene==='garage'){
        this.player.x=95;this.player.y=214;this.player.grounded=true;
        this.level.enemies=[{kind:'maneco',name:'Seu Maneco',x:225,y:86,w:30,h:44,hp:24,maxHp:24,hit:0,boss:true,dir:-1,shoot:1.5,truck:4.5,exposed:0}];
        this.bags=[trash(170,110),trash(280,110)];this.bagTimer=0;
      }else if(scene==='rescue'){
        this.redFlag=true;this.player.x=70;this.player.y=197;
      }
      for(const it of this.level.items)it.taken=this.collected.has(it.id);
      this.flags=flagIds.filter(id=>this.collected.has(id)).length;
      this.event('scene',{name:SCENES[scene],scene});
    }
    fire(input){
      const p=this.player;if(p.shoot>0)return;
      let target=input.aim;
      if(this.slingshot&&!target){
        const candidates=this.scene==='warehouse'?this.supports.filter(s=>s.hp>0):this.scene==='garage'&&this.boss?.exposed<=0?this.bags.filter(b=>!b.exploded):this.level.enemies.filter(e=>e.hp>0&&e.visible!==false);
        const nearest=candidates.sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
        if(nearest&&Math.abs(nearest.x-p.x)<440)target={x:nearest.x+nearest.w/2,y:nearest.y+nearest.h/2};
      }
      let dx=p.dir,dy=0;const x=p.x+p.w/2,y=p.y+12;
      if(this.slingshot&&target){dx=target.x-x;dy=target.y-y;const length=Math.hypot(dx,dy)||1;dx/=length;dy/=length;if(Math.abs(dx)>.05)p.dir=dx>0?1:-1;}
      p.shoot=.34-(this.upgrades.power||0)*.04;
      this.shots.push({x:x+dx*10,y:y+dy*10,w:5,h:5,vx:dx*(this.slingshot?340:255),vy:dy*(this.slingshot?340:255),life:this.slingshot?2:1,enemy:false,damage:1+(this.upgrades.power||0),sling:this.slingshot});this.event('shoot');
    }
    enemyShot(e,kind='expired',speed=110){
      const p=this.player,dx=p.x-e.x,dy=p.y-e.y,len=Math.hypot(dx,dy)||1;
      this.shots.push({x:e.x+e.w/2,y:e.y+12,w:kind==='box'?18:9,h:kind==='box'?18:9,vx:dx/len*speed,vy:dy/len*speed,gravity:kind==='box'?55:0,life:5,enemy:true,kind});
    }
    strike(e,damage,source='sling'){
      if(e.hp<=0||e.hit>0)return;
      if(e.kind==='teca'&&!e.visible)return;
      if(e.kind==='neymar'){this.hint('As caixas protegem Neymar. Acerte os suportes amarelos!');return;}
      if(e.kind==='maneco'&&source!=='explosion'&&e.exposed<=0){this.hint('Maneco está protegido! Exploda o saco de lixo perto dele.');return;}
      if(e.kind==='maneco'&&source==='explosion')e.exposed=6;
      e.hp=Math.max(0,e.hp-damage);e.hit=.18;this.burst(e.x+e.w/2,e.y+12,'#efc16c');this.event('enemyHit');
      if(e.hp>0)return;
      if(!e.boss){this.cans+=2;this.event('enemyDown');return;}
      this.transitionTimer=1.4;
      if(e.kind==='teca')this.award('mariana');
      if(e.kind==='maneco'){this.award('maneco');this.cans+=20;this.redFlag=true;this.bossDefeated=true;this.event('hint',{text:'Grande bandeira vermelha conquistada! +20 latinhas. A garagem está abrindo…'});}
    }
    explode(bag){
      if(bag.exploded)return;bag.exploded=true;const x=bag.x+10,y=bag.y+10;
      this.explosions.push({x,y,life:.45,radius:82});this.burst(x,y,'#ffba63',24);this.event('explosion');
      for(const e of this.level.enemies)if(e.hp>0&&Math.hypot(e.x+e.w/2-x,e.y+e.h/2-y)<88)this.strike(e,4,'explosion');
      if(Math.hypot(this.player.x+7-x,this.player.y+15-y)<53)this.hit();
      for(const other of this.bags)if(!other.exploded&&Math.hypot(other.x-bag.x,other.y-bag.y)<70)this.explode(other);
    }
    updateShots(dt){
      for(const s of this.shots){s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=(s.gravity||0)*dt;s.life-=dt;if(s.life<=0)continue;
        if(s.enemy){if(overlap(s,this.player)){this.hit();s.life=0;}continue;}
        let spent=false;
        for(const b of this.bags)if(!b.exploded&&overlap(s,b)){this.explode(b);s.life=0;spent=true;break;}
        if(spent)continue;
        if(this.scene==='warehouse'&&s.sling){for(const support of this.supports){if(support.hp>0&&overlap(s,support)){if(support.hit<=0){support.hp=Math.max(0,support.hp-s.damage);support.hit=.18;this.burst(support.x,support.y+20,'#d9ac62');}s.life=0;spent=true;break;}}}
        if(spent)continue;
        for(const e of this.level.enemies)if(e.hp>0&&e.visible!==false&&overlap(s,e)){if(!e.boss||s.sling)this.strike(e,s.damage);s.life=0;break;}
      }
      this.shots=this.shots.filter(s=>s.life>0);
    }
    collect(){
      const p=this.player;
      for(const it of this.level.items){if(it.taken)continue;const range=it.type==='can'&&this.upgrades.magnet?32:4;
        if(!overlap({x:p.x-range,y:p.y-range,w:p.w+range*2,h:p.h+range*2},it))continue;
        it.taken=true;this.collected.add(it.id);
        if(it.type==='slingshot'){this.slingshot=true;this.event('hint',{text:'Badogue encontrado! Mire com o mouse e clique para disparar. Leve-o até o Sacolão.'});}
        if(it.type==='flag'){this.flags=flagIds.filter(id=>this.collected.has(id)).length;this.event('flag');if(this.flags===3)this.award('flags');}
        if(it.type==='can'){this.cans++;this.event('can');}
        if(it.type==='juice'){p.hp=Math.min(p.maxHp,p.hp+2);this.event('juice');}
        this.burst(it.x,it.y,'#e9ce76');
      }
    }
    movement(dt,input){
      const p=this.player,c=this.character,axis=(input.right?1:0)-(input.left?1:0),press=k=>input[k]&&!this.prev[k];
      if(this.scene==='garage'){
        const vertical=(input.down?1:0)-(input.up||input.jump?1:0),length=Math.hypot(axis,vertical)||1;
        p.vx=axis*c.speed/length;p.vy=0;p.grounded=true;p.slide=0;p.yardMoving=!!(axis||vertical);
        if(axis)p.dir=axis;
        p.x=clamp(p.x+p.vx*dt,12,454);p.y=clamp(p.y+vertical*c.speed/length*dt,123,232);
        return;
      }
      if(axis)p.dir=axis;
      if(press('jump')&&(p.grounded||(c.id==='jana'&&p.jumps<2))){p.vy=-c.jump;p.grounded=false;p.jumps++;this.event('jump');}
      if(press('slide')&&p.grounded&&p.slideCooldown<=0){p.slide=c.id==='luketa'?.36:.25;p.slideCooldown=.8;}
      p.vx=p.slide>0?p.dir*265:axis*c.speed;p.x=clamp(p.x+p.vx*dt,0,this.level.width-p.w);
      const oldBottom=p.y+p.h;p.vy+=980*dt;p.y+=p.vy*dt;p.grounded=false;
      for(const s of this.level.platforms)if(p.vy>=0&&oldBottom<=s.y+1&&p.y+p.h>=s.y&&p.x+p.w>s.x&&p.x<s.x+s.w){p.y=s.y-p.h;p.vy=0;p.grounded=true;p.jumps=0;}
      if(p.y>this.level.height+40){this.player.hp=0;this.status='dead';this.event('dead');}
      if(this.scene==='sewer'&&p.y>535&&(p.x<55||p.x>405)){this.hit();}
      for(const e of this.level.enemies){if(e.hp<=0||e.visible===false)continue;
        if(overlap(p,e)){if(!e.boss&&p.vy>0&&oldBottom<e.y+12){this.strike(e,2,'stomp');p.vy=-270;}else if(!e.boss&&p.slide>0)this.strike(e,2,'slide');else this.hit();}
      }
    }
    spawnTruck(x,warning=1.35){this.hazards.push({kind:'truck',x,y:-95,w:48,h:86,warning,vy:210,life:5});}
    spawnYardTruck(){
      const right=this.random()<.5,y=this.player.y+this.player.h/2<190?145:200;
      this.hazards.push({kind:'truck',sideways:true,x:right?-100:490,y,w:90,h:38,warning:1.5,vx:right?205:-205,vy:0,life:4});
    }
    updateHazards(dt){
      for(const h of this.hazards){if(h.warning>0){h.warning-=dt;continue;}h.life-=dt;h.y+=h.vy*dt;h.x+=(h.vx||0)*dt;
        if(overlap(this.player,h))this.hit(h.kind==='truck'?2:1);
      }
      this.hazards=this.hazards.filter(h=>h.life>0&&h.y<360&&h.x>-120&&h.x<570);
    }
    updateEnemies(dt){
      const p=this.player;
      for(const e of this.level.enemies){e.hit=Math.max(0,e.hit-dt);if(e.hp<=0)continue;
        if(e.kind==='rival'){e.x+=e.dir*27*dt;if(e.x<e.origin-38)e.dir=1;if(e.x>e.origin+38)e.dir=-1;e.shoot-=dt;if(e.shoot<=0&&Math.abs(p.x-e.x)<190){e.shoot=2.5;this.enemyShot(e);}}
        if(e.kind==='teca'){
          e.cycle-=dt;
          if(e.cycle<=0){e.visible=!e.visible;e.cycle=e.visible?2.2:1.05;if(e.visible){const slots=[105,230,355];let slot=Math.floor(this.random()*3);if(slots[slot]===e.x)slot=(slot+1)%3;e.x=slots[slot];e.shoot=.7;}}
          if(e.visible){e.shoot-=dt;if(e.shoot<=0){e.shoot=.85;this.enemyShot(e,'fruit',120);}}
        }
        if(e.kind==='neymar'){
          for(const s of this.supports)s.hit=Math.max(0,s.hit-dt);
          e.hp=this.supports.reduce((sum,s)=>sum+s.hp,0);
          if(e.hp<=0){e.fall=1;this.award('neymar');this.transitionTimer=1.6;continue;}
          e.x+=e.dir*70*dt;if(e.x>405)e.dir=-1;if(e.x<65)e.dir=1;e.shoot-=dt;
          if(e.shoot<=0){e.shoot=.85+this.random()*.45;const size=[14,22,32][Math.floor(this.random()*3)];this.shots.push({x:e.x,y:65,w:size,h:size,vx:(p.x-e.x)*.32,vy:25,gravity:180,life:5,enemy:true,kind:'box'});}
        }
        if(e.kind==='maneco'){
          e.exposed=Math.max(0,e.exposed-dt);e.x+=e.dir*24*dt;if(e.x<205)e.dir=1;if(e.x>255)e.dir=-1;
          e.shoot-=dt;e.truck-=dt;
          if(e.shoot<=0){e.shoot=1.2;this.enemyShot(e,this.random()>.5?'box':'expired',125);}
          if(e.truck<=0){e.truck=4.2;this.spawnYardTruck();this.event('hint',{text:'Buzina! Use ↑ / ↓ para sair da faixa. Os caminhões cruzam pelas laterais!'});}
          if(this.bags.every(b=>b.exploded)){this.bagTimer+=dt;if(this.bagTimer>5.5){this.bags=[trash(170,110),trash(280,110)];this.bagTimer=0;this.event('hint',{text:'Novos sacos de lixo caíram das pilhas.'});}}
        }
      }
    }
    updateCart(dt,input){
      const p=this.player;
      if(this.cartMode==='boarding'){
        p.x=35+Math.min(1,this.stageTime/1.2)*65;p.y=155-Math.sin(Math.min(1,this.stageTime/1.2)*Math.PI)*30;
        if(this.stageTime>=1.2){this.cartMode='riding';this.cartX=100;this.setCheckpoint(false);this.event('hint',{text:'Dentro do carrinho! ↑ / ↓ ou W / S para mudar de corredor.'});}
      }else if(this.cartMode==='riding'){
        if((input.up||input.jump)&&!(this.prev.up||this.prev.jump))this.cartLane=Math.max(0,this.cartLane-1);
        if(input.down&&!this.prev.down)this.cartLane=Math.min(2,this.cartLane+1);
        this.cartX+=dt*(input.left?76:input.right?125:100);p.x=this.cartX;p.y+=( [105,155,205][this.cartLane]-p.y)*Math.min(1,dt*12);
        for(const o of this.cartObstacles){const box={x:o.x,y:[112,162,212][o.lane],w:o.w,h:o.h};if(!o.hit&&overlap({x:p.x-6,y:p.y,w:32,h:28},box)){o.hit=true;this.hit();p.vy=0;this.burst(o.x,box.y,'#bb8c50');}}
        this.collect();
        if(this.cartX>1840){this.cartMode='leaving';this.exitTime=0;this.event('hint',{text:'Fim do corredor. Luketa sai do carrinho para enfrentar Teca.'});}
      }else{this.exitTime+=dt;p.x+=dt*35;p.y=197-Math.sin(Math.min(this.exitTime,1)*Math.PI)*36;if(this.exitTime>1.2){this.enter('mariana');this.setCheckpoint(false);}}
      this.camera=clamp(p.x-145,0,this.level.width-480);
    }
    interact(input){
      const p=this.player;if(!input.interact||this.prev.interact)return;
      if(this.scene==='street'){
        if(Math.abs(p.x-880)<50&&p.y>165){this.enter('sewer');return;}
        if(p.x>this.level.width-330){if(!this.slingshot){this.hint('O Sacolão está fechado! Volte à laje e pegue o badogue.');return;}this.enter('cart');this.setCheckpoint(false);return;}
      }
      if(this.scene==='sewer'&&p.x>60&&p.x<220&&p.y<175){this.enter('street',true);return;}
      if(this.scene==='unloading'&&this.stageTime>=22&&p.x>390){this.enter('garage');this.setCheckpoint(true);}
    }
    step(dt,input={}){
      if(this.status!=='playing')return;dt=Math.min(dt,1/30);this.time+=dt;this.stageTime+=dt;
      const p=this.player;p.inv=Math.max(0,p.inv-dt);p.shoot=Math.max(0,p.shoot-dt);p.slide-=dt;p.slideCooldown-=dt;this.aim=input.aim||null;
      if(this.scene==='rescue'){
        const t=this.stageTime;p.x=t<2?70:t<4?70+(t-2)*115:t<6?300:300+(t-6)*105;
        if(t>=9){this.status='won';this.event('win');}return;
      }
      if(this.scene==='cart')this.updateCart(dt,input);
      else if(this.scene==='unloading'){
        p.vx=((input.right?1:0)-(input.left?1:0))*145;if(p.vx)p.dir=p.vx>0?1:-1;
        p.x=clamp(p.x+p.vx*dt,12,450);p.y=clamp(p.y+((input.down?1:0)-(input.up||input.jump?1:0))*115*dt,95,230);p.vy=0;
        this.nextHazard-=dt;
        if(this.stageTime<11&&this.nextHazard<=0){this.nextHazard=1.8;this.spawnTruck([52,152,252,352][Math.floor(this.stageTime/1.8)%4]);}
        else if(this.stageTime>=11&&this.stageTime<20&&this.nextHazard<=0){this.nextHazard=1.4;const left=Math.floor(this.stageTime)%2===0;this.hazards.push({kind:'pile',x:left?-45:475,y:115+this.random()*90,w:55,h:37,vx:left?115:-115,vy:15,warning:1.1,life:5});}
        if(this.stageTime>=22)this.hazards=[];this.updateHazards(dt);this.interact(input);
      }else{
        this.movement(dt,input);
        if(this.status!=='playing')return;
        if(input.shoot)this.fire(input);
        this.collect();this.updateEnemies(dt);this.updateShots(dt);this.updateHazards(dt);
        if(this.status!=='playing')return;
        if(this.transitionTimer>0){this.transitionTimer-=dt;if(this.transitionTimer<=0){
          if(this.scene==='mariana'){this.enter('warehouse');this.player.hp=this.player.maxHp;this.setCheckpoint(true);}
          else if(this.scene==='warehouse'){this.enter('unloading');this.player.hp=this.player.maxHp;this.setCheckpoint(true);}
          else if(this.scene==='garage'){this.enter('rescue');this.setCheckpoint(true);}
        }}
        if(this.status==='playing')this.interact(input);
        this.camera=clamp(p.x-175,0,Math.max(0,this.level.width-480));this.cameraY=clamp(p.y-125,0,Math.max(0,this.level.height-270));
      }
      for(const f of this.particles){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=220*dt;f.life-=dt;}this.particles=this.particles.filter(f=>f.life>0);
      for(const x of this.explosions)x.life-=dt;this.explosions=this.explosions.filter(x=>x.life>0);
      this.prev={...input};
    }
  }
  const api={MarketWorld,ACHIEVEMENTS,SCENES,cleanCheckpoint};if(typeof module!=='undefined')module.exports=api;root.EaiMarket=api;
})(typeof window!=='undefined'?window:globalThis);
