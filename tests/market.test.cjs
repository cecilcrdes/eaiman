const test=require('node:test'),assert=require('node:assert/strict');
const {MarketWorld,cleanCheckpoint}=require('../src/market.js');
const {cleanSave}=require('../src/engine.js');
const tick=(w,n,input={})=>{for(let i=0;i<n;i++)w.step(1/60,input);};
function winMariana(w){w.slingshot=true;w.enter('mariana');const boss=w.boss;boss.visible=true;boss.hit=0;w.strike(boss,9);tick(w,90);}

test('Sacolão rejects missing badogue and allows backtracking to the street',()=>{
 const w=new MarketWorld();w.player.x=4400;tick(w,1,{interact:true});assert.equal(w.scene,'street');assert.ok(w.events.some(e=>e.type==='hint'&&e.text.includes('badogue')));
 tick(w,20,{left:true});assert.ok(w.player.x<4400);w.slingshot=true;w.player.x=4400;tick(w,1,{interact:true});assert.equal(w.scene,'cart');assert.equal(w.cartMode,'boarding');
});
test('Luketa can climb the real street route and collect the roof slingshot',()=>{
 const w=new MarketWorld();tick(w,20);
 for(const [x,feet]of [[200,184],[340,144],[480,104],[625,76]]){
  let reached=false;
  for(let i=0;i<900;i++){const p=w.player,dx=x-p.x;if(Math.abs(dx)<4&&p.grounded&&p.y+p.h<=feet+1){reached=true;break;}w.step(1/60,{right:dx>3,left:dx< -3,jump:p.grounded&&Math.abs(dx)<100&&p.y+p.h>feet+1});}
  assert.ok(reached,'Could not reach roof step '+x);
 }
 assert.equal(w.slingshot,true);assert.equal(w.flags,1);
});
test('sewer is reversible and collected items cannot be farmed by re-entering',()=>{
 const w=new MarketWorld();w.player.x=880;tick(w,1,{interact:true});assert.equal(w.scene,'sewer');assert.ok(w.achievements.has('sewer'));
 const it=w.level.items.find(i=>i.type==='can');Object.assign(w.player,{x:it.x,y:it.y,vy:0});tick(w,1);const cans=w.cans;assert.ok(cans>0);
 Object.assign(w.player,{x:115,y:138,vy:0});tick(w,1);tick(w,1,{interact:true});assert.equal(w.scene,'street');tick(w,1);w.player.x=880;tick(w,1,{interact:true});assert.equal(w.scene,'sewer');assert.equal(w.cans,cans);assert.equal(w.level.items.find(i=>i.id===it.id).taken,true);
});
test('every sewer platform supports an ascent back to the street hatch',()=>{
 const w=new MarketWorld();w.enter('sewer');Object.assign(w.player,{x:140,y:543,vy:0});tick(w,2);
 for(const platform of w.level.platforms.slice(1,10)){
  const x=platform.x+60,feet=platform.y;let reached=false;
  for(let i=0;i<1200;i++){const p=w.player,dx=x-p.x;if(Math.abs(dx)<4&&p.grounded&&p.y+p.h<=feet+1){reached=true;break;}w.step(1/60,{right:dx>3,left:dx< -3,jump:p.grounded&&Math.abs(dx)<120&&p.y+p.h>feet+1});}
  assert.ok(reached,'Sewer step '+platform.y);
 }
 assert.ok(w.player.y<175);tick(w,1,{interact:true});assert.equal(w.scene,'street');
});
test('mouse aim creates an upward slingshot projectile while dreams stay horizontal',()=>{
 const w=new MarketWorld();w.fire({aim:{x:100,y:0}});assert.equal(w.shots[0].vy,0);w.shots=[];w.player.shoot=0;w.slingshot=true;w.fire({aim:{x:80,y:0}});assert.ok(w.shots[0].vy< -300);assert.ok(w.shots[0].sling);
});
test('garbage explodes once and damages a nearby rival',()=>{
 const w=new MarketWorld(),bag=w.bags[0],enemy=w.level.enemies[0];w.explode(bag);assert.equal(bag.exploded,true);assert.ok(enemy.hp<=0);const cans=w.cans;w.explode(bag);assert.equal(w.cans,cans);assert.equal(w.explosions.length,1);
});
test('cart boards, changes lanes, takes obstacle damage and dismounts before Mariana',()=>{
 const w=new MarketWorld();w.slingshot=true;w.enter('cart');tick(w,80);assert.equal(w.cartMode,'riding');tick(w,1,{jump:true});assert.equal(w.cartLane,0);tick(w,1);tick(w,1,{down:true});assert.equal(w.cartLane,1);
 const o=w.cartObstacles[0];w.cartLane=o.lane;w.cartX=o.x-2;w.player.x=w.cartX;w.player.y=[105,155,205][o.lane];w.player.inv=0;tick(w,1);assert.equal(w.player.hp,5);
 w.cartX=1841;tick(w,1);assert.equal(w.cartMode,'leaving');tick(w,80);assert.equal(w.scene,'mariana');assert.equal(w.checkpointData.scene,'mariana');
});
test('Mariana is vulnerable only above the counter and changes random slots',()=>{
 const w=new MarketWorld(0,{},null,()=>.99);w.enter('mariana');const e=w.boss;w.strike(e,3);assert.equal(e.hp,9);tick(w,1);assert.equal(e.visible,true);assert.equal(e.x,355);w.strike(e,1);assert.equal(e.hp,8);tick(w,140);assert.equal(e.visible,false);e.hit=0;w.strike(e,5);assert.equal(e.hp,8);
});
test('winning Mariana awards achievement and produces a validated persistent checkpoint',()=>{
 const w=new MarketWorld();w.cans=7;winMariana(w);assert.equal(w.scene,'warehouse');assert.ok(w.achievements.has('mariana'));const cp=w.events.find(e=>e.type==='marketCheckpoint').checkpoint;assert.ok(cleanCheckpoint(cp));
 const restored=new MarketWorld(0,{},cp);assert.equal(restored.scene,'warehouse');assert.equal(restored.cans,7);assert.equal(restored.slingshot,true);assert.equal(restored.player.hp,6);
 const save=cleanSave({achievements:['mariana','mariana','fake'],marketCheckpoint:cp});assert.deepEqual(save.achievements,['mariana']);assert.equal(save.marketCheckpoint.scene,'warehouse');
});
test('Neymar is immune to direct fire; destroying supports makes him fall',()=>{
 const w=new MarketWorld();w.slingshot=true;w.enter('warehouse');w.player.hp=w.player.maxHp=1000;const e=w.boss;w.strike(e,99);assert.equal(e.hp,9);
 for(const support of w.supports){for(let n=0;n<400&&support.hp>0;n++)w.step(1/60,{shoot:true,aim:{x:support.x+7,y:support.y+26}});assert.equal(support.hp,0);}
 tick(w,110);assert.equal(w.scene,'unloading');assert.ok(w.achievements.has('neymar'));assert.equal(w.checkpointData.scene,'unloading');
});
test('trucks warn first, then move vertically and damage the player',()=>{
 const w=new MarketWorld();w.enter('unloading');w.spawnTruck(220,.5);const h=w.hazards[0];Object.assign(w.player,{x:225,y:150,inv:0});w.updateHazards(.3);assert.equal(w.player.hp,6);assert.equal(h.y,-95);w.updateHazards(.3);w.updateHazards(1.2);assert.ok(h.y>100);assert.equal(w.player.hp,4);
});
test('unloading starts with trucks, then sliding piles, then opens the garage',()=>{
 const w=new MarketWorld();w.slingshot=true;w.enter('unloading');w.player.hp=w.player.maxHp=1000;tick(w,180);assert.ok(w.hazards.some(h=>h.kind==='truck'));tick(w,600);assert.ok(w.hazards.some(h=>h.kind==='pile'));tick(w,600);assert.ok(w.stageTime>=22);w.player.x=420;tick(w,1,{interact:true});assert.equal(w.scene,'garage');assert.equal(w.checkpointData.scene,'garage');
});
test('Maneco needs explosions to be exposed, grants exactly 20 cans and delays unlock until rescue',()=>{
 const w=new MarketWorld();w.slingshot=true;w.enter('garage');w.player.hp=w.player.maxHp=1000;const e=w.boss;w.strike(e,5);assert.equal(e.hp,24);w.explode(w.bags[0]);assert.ok(e.exposed>0);assert.equal(e.hp,20);e.hit=0;w.strike(e,20);assert.equal(w.cans,20);assert.equal(w.redFlag,true);assert.equal(w.status,'playing');assert.ok(w.achievements.has('maneco'));tick(w,90);assert.equal(w.scene,'rescue');assert.equal(w.status,'playing');
 const cp=cleanCheckpoint(w.snapshot());const restored=new MarketWorld(0,{},cp);assert.equal(restored.cans,20);assert.equal(restored.redFlag,true);tick(restored,550);assert.equal(restored.status,'won');assert.equal(restored.cans,20);assert.equal(restored.events.filter(e=>e.type==='win').length,1);
});
test('garage trucks cross the yard laterally after warning and can be dodged in depth',()=>{
 const w=new MarketWorld(0,{},null,()=>0);w.enter('garage');w.spawnYardTruck();const h=w.hazards[0];
 assert.equal(h.sideways,true);assert.ok(h.y>=130);assert.equal(h.vy,0);
 const start=h.x;w.updateHazards(.5);assert.equal(h.x,start);
 const initial=w.player.y;tick(w,30,{up:true});assert.ok(w.player.y<initial-30);
 w.player.inv=0;const hp=w.player.hp;h.warning=0;h.x=w.player.x;w.updateHazards(.01);assert.equal(w.player.hp,hp);
 w.player.y=h.y;w.updateHazards(.01);assert.equal(w.player.hp,hp-2);
 assert.ok(h.x>start);assert.equal(h.y,200);
});

test('garage movement stays on the yard and checkpoint restores the new arena',()=>{
 const w=new MarketWorld();w.slingshot=true;w.enter('garage');w.player.hp=1000;
 tick(w,120,{up:true});assert.equal(w.player.y,123);tick(w,120,{down:true});assert.equal(w.player.y,232);
 const restored=new MarketWorld(0,{},w.snapshot());assert.equal(restored.player.y,214);assert.equal(restored.boss.y,86);
 assert.ok(restored.bags.every(b=>b.y===110));
});

test('corrupt checkpoints are rejected and duplicate flags are sanitized',()=>{
 assert.equal(cleanCheckpoint({version:2,scene:'street',slingshot:true}),null);assert.equal(cleanCheckpoint({version:2,scene:'garage'}),null);
 const c=cleanCheckpoint({version:2,scene:'garage',slingshot:true,cans:NaN,collected:['street-flag-1','street-flag-1',{}],redFlag:true});assert.equal(c.cans,0);assert.deepEqual(c.collected,['street-flag-1']);assert.equal(c.redFlag,false);
});

