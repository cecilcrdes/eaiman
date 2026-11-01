(function(root){
  'use strict';
  const CHARACTERS = [
    {id:'luketa',name:'Luketa',tag:'O CORAÇÃO DA EQUIPE',description:'Equilibrado. Deslize mais longe.',speed:136,jump:355,skin:'#8b4e32',hair:'#282326',pants:'#5d9ca9',shoes:'#dbe3d1',unlock:0},
    {id:'tuca',name:'Tuca',tag:'NINGUÉM SEGURA',description:'Mais velocidade no corre.',speed:161,jump:355,skin:'#c58750',hair:'#aa4d33',pants:'#606f83',shoes:'#443c32',unlock:1},
    {id:'jana',name:'Jana',tag:'SEMPRE UM PASSO À FRENTE',description:'Pulo duplo para explorar.',speed:136,jump:345,skin:'#99563b',hair:'#38282a',pants:'#6b8d9a',shoes:'#ac5138',unlock:2},
    {id:'lea',name:'Lea',tag:'LÁ NO ALTO',description:'Saltos mais altos nas lajes.',speed:140,jump:400,skin:'#865039',hair:'#30282c',pants:'#788caa',shoes:'#e8864c',unlock:3}
  ];
  const LEVELS = [
    {name:'O Mercado',area:'FEIRINHA DA COMUNIDADE',boss:'Seu Maneco',team:'Turma da Rua de Baixo',color:'#d66a48',sky:'#a8cbc0',light:'#f3d989',theme:'market',rescue:1,story:'Atravesse a longa rua da comunidade. Pegue o badoque na laje, explore o esgoto secreto, passe pelo Sacolão e vença Teca, Neymar e Seu Maneco para resgatar Tuca.'},
    {name:'Escola Pública',area:'PÁTIO DA ESCOLA',boss:'Chumbinho',team:'Meninos do Morro',color:'#81a16a',sky:'#e0bb9a',light:'#f5d78f',theme:'school',rescue:2,story:'Jana está escondida na Escola Pública. Atravesse os corredores, reúna as bandeiras e enfrente Chumbinho e os Meninos do Morro para libertá-la.'},
    {name:'O Campinho',area:'BOLA NO PÉ, OLHO NAS PISTAS',boss:'Talinho',team:'Os Craques',color:'#5d9cba',sky:'#9cc8cd',light:'#f6e4a8',theme:'field',rescue:3,story:'Lea está no campinho da Pocinha. Enfrente os Craques e Talinho para reunir os quatro Canários.'},
    {name:'Topo do Morro',area:'A ÚLTIMA ESTRELA',boss:'Vadinho',team:'Equipe do Topo',color:'#a38abe',sky:'#8c9cae',light:'#ecc58f',theme:'rooftop',rescue:null,story:'A Batalha das Estrelas termina lá em cima. Reúna as últimas bandeiras e conquiste o morro com a sua equipe.'}
  ];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  function cleanSave(raw){
    const n=(v,max)=>Number.isFinite(v)?clamp(Math.floor(v),0,max):0;
    const completed=n(raw?.completed,LEVELS.length),oldBest=raw?.best||[],bestOrder=raw?.campaignVersion===2?[0,1,2,3]:[0,3,2,4];
    return {campaignVersion:2,completed,selected:n(raw?.selected,3),cans:n(raw?.cans,99999),power:n(raw?.power,2),armor:n(raw?.armor,1),magnet:n(raw?.magnet,1),badogue:raw?.badogue===true||completed>0,best:Array.from({length:LEVELS.length},(_,i)=>n(oldBest[bestOrder[i]],999999)),achievements:Array.isArray(raw?.achievements)?[...new Set(raw.achievements.filter(a=>['sewer','flags','mariana','neymar','maneco'].includes(a)))]:[],marketCheckpoint:root.EaiMarket?.cleanCheckpoint(raw?.marketCheckpoint)||null};
  }
  function createLevel(index){
    const platforms=[{x:0,y:224,w:760,h:70},{x:824,y:224,w:640,h:70},{x:1536,y:224,w:864,h:70}];
    const ledges=[[185,185,75],[340,174,130],[560,169,90],[720,177,120],[920,178,100],[1040,135,100],[1200,178,100],[1410,174,170],[1665,178,100],[1795,139,90],[1940,179,80]];
    ledges.forEach(([x,y,w])=>platforms.push({x,y,w,h:12}));
    const items=[];
    [120,210,245,355,390,580,620,700,850,945,980,1070,1105,1225,1260,1370,1440,1500,1600,1690,1730,1810,1850,1970,2040].forEach((x,i)=>{
      const under=platforms.filter(p=>x>=p.x&&x<=p.x+p.w).sort((a,b)=>a.y-b.y)[0];
      items.push({type:'can',x,y:(under?.y||224)-16,w:8,h:12,id:i,taken:false});
    });
    [430,1100,1720].forEach((x,i)=>items.push({type:'flag',x,y:[146,107,150][i],w:12,h:25,taken:false}));
    [660,1320,2000].forEach(x=>items.push({type:'juice',x,y:207,w:9,h:16,taken:false}));
    const enemies=[530,930,1290,1610,1890].map((x,i)=>({x,y:198,w:16,h:26,origin:x,dir:i%2?1:-1,hp:index>2?3:2,hit:0,shoot:2+i*.4,boss:false}));
    enemies.push({x:2180,y:180,w:27,h:44,origin:2180,dir:-1,hp:8+index*2,maxHp:8+index*2,hit:0,shoot:1.5,boss:true});
    return {index,width:2400,platforms,items,enemies};
  }
  class World{
    constructor(index,character,upgrades={}){
      this.level=createLevel(index);this.character=CHARACTERS[character]||CHARACTERS[0];this.upgrades=upgrades;
      this.player={x:55,y:185,w:14,h:27,vx:0,vy:0,dir:1,grounded:false,hp:6+(upgrades.armor?2:0),maxHp:6+(upgrades.armor?2:0),inv:0,jumps:0,slide:0,slideCooldown:0,shoot:0};
      this.camera=0;this.time=0;this.flags=0;this.cans=0;this.checkpoint=false;this.particles=[];this.shots=[];this.events=[];this.status='playing';this.prev={};this.bossDefeated=false;
    }
    event(type,data={}){this.events.push({type,...data});}
    hit(amount=1){const p=this.player;if(p.inv>0||this.status!=='playing')return;p.hp-=amount;p.inv=1.4;p.vy=-155;p.vx=-p.dir*80;this.event('hurt');if(p.hp<=0){p.hp=0;this.status='dead';this.event('dead');}}
    burst(x,y,color,count=8){for(let i=0;i<count;i++)this.particles.push({x,y,vx:(Math.random()-.5)*100,vy:-Math.random()*100,life:.5+Math.random()*.3,color});}
    strike(e,damage){if(e.hit>0||e.hp<=0)return;e.hp-=damage;e.hit=.22;this.burst(e.x+e.w/2,e.y+10,e.boss?'#f8ce54':'#e5a36e');this.event('enemyHit');if(e.hp<=0){this.cans+=e.boss?10:2;this.event('enemyDown');if(e.boss){this.bossDefeated=true;this.event('bossDown');}}}
    step(dt,input={}){
      if(this.status!=='playing')return;dt=Math.min(dt,1/30);this.time+=dt;
      const p=this.player,c=this.character;const press=k=>input[k]&&!this.prev[k];this.aim=input.aim||null;
      p.inv=Math.max(0,p.inv-dt);p.shoot-=dt;p.slide-=dt;p.slideCooldown-=dt;
      const axis=(input.right?1:0)-(input.left?1:0);
      if(axis)p.dir=axis;
      if(press('jump')&&(p.grounded||(c.id==='jana'&&p.jumps<2))){p.vy=-c.jump;p.grounded=false;p.jumps++;this.event('jump');}
      if(press('slide')&&p.grounded&&p.slideCooldown<=0){p.slide=c.id==='luketa'?.36:.25;p.slideCooldown=.8;this.event('slide');}
      p.vx=p.slide>0?p.dir*265:axis*c.speed;
      if(input.shoot&&p.shoot<=0){
        const sling=!!this.upgrades.badogue,aim=sling&&input.aim?input.aim:null,x=p.x+p.w/2,y=p.y+12;
        let dx=p.dir,dy=0;if(aim){dx=aim.x-x;dy=aim.y-y;const length=Math.hypot(dx,dy)||1;dx/=length;dy/=length;if(Math.abs(dx)>.05)p.dir=dx>0?1:-1;}
        p.shoot=(sling?0.34:0.36)-(this.upgrades.power||0)*.055;
        this.shots.push({x:x+dx*10,y:y+dy*10,w:sling?5:7,h:sling?5:6,vx:dx*(sling?340:270),vy:dy*(sling?340:0),life:sling?2:1.15,enemy:false,damage:1+(this.upgrades.power||0),sling});this.event('shoot');
      }
      p.x=clamp(p.x+p.vx*dt,0,this.level.width-p.w);const oldBottom=p.y+p.h;
      p.vy+=980*dt;p.y+=p.vy*dt;p.grounded=false;
      for(const s of this.level.platforms){if(p.vy>=0&&oldBottom<=s.y+1&&p.y+p.h>=s.y&&p.x+p.w>s.x&&p.x<s.x+s.w){p.y=s.y-p.h;p.vy=0;p.grounded=true;p.jumps=0;}}
      if(p.y>290){p.hp=0;this.status='dead';this.event('dead');}
      if(p.x>1180&&!this.checkpoint){this.checkpoint=true;this.event('checkpoint');}
      for(const item of this.level.items){if(item.taken)continue;let range=item.type==='can'&&this.upgrades.magnet?36:5;
        if(overlap({x:p.x-range,y:p.y-range,w:p.w+range*2,h:p.h+range*2},item)){
          item.taken=true;if(item.type==='can'){this.cans++;this.event('can');}if(item.type==='flag'){this.flags++;this.event('flag');}if(item.type==='juice'){p.hp=Math.min(p.maxHp,p.hp+2);this.event('juice');}this.burst(item.x,item.y,item.type==='flag'?'#ed754e':'#e7d683');
        }
      }
      for(const e of this.level.enemies){if(e.hp<=0)continue;e.hit=Math.max(0,e.hit-dt);
        if(Math.abs(e.x-p.x)<340){const speed=e.boss?29:24+this.level.index*4;e.x+=e.dir*speed*dt;if(e.x<e.origin-(e.boss?70:45))e.dir=1;if(e.x>e.origin+(e.boss?60:45))e.dir=-1;
          e.shoot-=dt;if(e.shoot<=0&&Math.abs(e.x-p.x)<(e.boss?245:170)){e.shoot=(e.boss?1.3:2.5)-this.level.index*.1;const dir=p.x<e.x?-1:1;this.shots.push({x:e.x+e.w/2,y:e.y+12,w:7,h:7,vx:dir*(e.boss?145:105),vy:e.boss?-55:0,life:2.4,enemy:true,damage:1});}
        }
        if(overlap(p,e)){
          if(p.vy>0&&oldBottom<e.y+12){this.strike(e,1);p.vy=-270;}
          else if(p.slide>0&&!e.boss){this.strike(e,2);}
          else this.hit();
        }
      }
      for(const shot of this.shots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;if(shot.enemy&&shot.vy!==0)shot.vy+=70*dt;shot.life-=dt;
        if(shot.enemy){if(overlap(shot,p)&&!(p.slide>0&&shot.y<p.y+17)){this.hit();shot.life=0;}}
        else for(const e of this.level.enemies){if(e.hp>0&&overlap(shot,e)){this.strike(e,shot.damage);shot.life=0;break;}}
      }
      this.shots=this.shots.filter(s=>s.life>0);
      for(const f of this.particles){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=220*dt;f.life-=dt;}this.particles=this.particles.filter(f=>f.life>0);
      this.camera=clamp(p.x-175,0,this.level.width-480);
      if(p.x>2290&&this.status==='playing'){
        if(this.flags===3&&this.bossDefeated){this.status='won';this.event('win');}
        else if(!this.gateNotice||this.time-this.gateNotice>3){this.gateNotice=this.time;this.event('gate',{text:this.flags<3?'Ainda faltam bandeiras! Explore as plataformas.':'Vença o chefe para abrir a passagem!'});}
      }
      this.prev={...input};
    }
    retryCheckpoint(){if(!this.checkpoint)return false;const p=this.player;Object.assign(p,{x:1190,y:140,vx:0,vy:0,hp:p.maxHp,inv:2,jumps:0,slide:0});this.shots=[];this.prev={};this.status='playing';return true;}
  }
  const api={CHARACTERS,LEVELS,World,createLevel,cleanSave,clamp,overlap};
  if(typeof module!=='undefined')module.exports=api;root.EaiEngine=api;
})(typeof window!=='undefined'?window:globalThis);
