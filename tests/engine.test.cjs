const test = require('node:test');
const assert = require('node:assert/strict');
const {World, cleanSave, CHARACTERS, LEVELS} = require('../src/engine.js');
const tick=(w,n,input={})=>{for(let i=0;i<n;i++)w.step(1/60,input);};

test('untrusted saves are clamped and malformed counters discarded',()=>{
  const s=cleanSave({completed:90,selected:-3,cans:'1000',power:Infinity,best:[NaN,900]});
  assert.equal(s.completed,5);assert.equal(s.selected,0);assert.equal(s.cans,0);assert.equal(s.power,0);assert.deepEqual(s.best,[0,900,0,0,0]);
});
test('player lands, jumps, and returns to the ground',()=>{
  const w=new World(0,0);tick(w,20);assert.equal(w.player.y,197);assert.equal(w.player.grounded,true);
  tick(w,1,{jump:true});assert.ok(w.player.vy<0);tick(w,65);assert.equal(w.player.y,197);assert.equal(w.player.grounded,true);
});
test('each character can reach every required flag from the adjacent step',()=>{
  for(let c=0;c<4;c++)for(let l=0;l<5;l++)for(const [x,y,target] of [[360,147,430],[980,151,1100],[1670,151,1720]]){
    const w=new World(l,c);Object.assign(w.player,{x,y,vy:0,grounded:true});
    if(target===1100){tick(w,1,{jump:true,right:true});tick(w,44,{right:true});}
    else tick(w,Math.ceil((target-x)/CHARACTERS[c].speed*60),{right:true});
    assert.ok(w.flags>=1,`${CHARACTERS[c].name} did not reach ${target} in level ${l}`);
  }
});
test('Jana gets one extra mid-air jump, Luketa does not',()=>{
  for(const c of [0,2]){const w=new World(0,c);tick(w,20);tick(w,1,{jump:true});tick(w,12);const before=w.player.vy;tick(w,1,{jump:true});if(c===2)assert.ok(w.player.vy<before);else assert.ok(w.player.vy>before);tick(w,1);const v=w.player.vy;tick(w,1,{jump:true});assert.ok(w.player.vy>v);}
});
test('damage has invulnerability and juice restores exactly a heart',()=>{
  const w=new World(0,0);w.hit();w.hit();assert.equal(w.player.hp,5);w.player.inv=0;w.hit();assert.equal(w.player.hp,4);
  Object.assign(w.player,{x:660,y:197,vy:0});tick(w,1);assert.equal(w.player.hp,6);
});
test('projectile defeats a rival and awards recyclable cans once',()=>{
  const w=new World(0,0,{power:2});Object.assign(w.player,{x:480,y:197,grounded:true});tick(w,25,{shoot:true});assert.equal(w.level.enemies[0].hp<=0,true);assert.ok(w.cans>=2);
});
test('the gate requires both all flags and the defeated boss',()=>{
  const w=new World(0,0);Object.assign(w.player,{x:2310,y:197});tick(w,1);assert.equal(w.status,'playing');w.flags=3;tick(w,1);assert.equal(w.status,'playing');w.bossDefeated=true;tick(w,1);assert.equal(w.status,'won');assert.equal(w.events.filter(e=>e.type==='win').length,1);tick(w,10);assert.equal(w.events.filter(e=>e.type==='win').length,1);
});
test('falling ends the attempt, checkpoint recovery preserves collected flags',()=>{
  const w=new World(0,0);Object.assign(w.player,{x:1200,y:120});tick(w,1);assert.equal(w.checkpoint,true);w.flags=2;w.player.y=310;tick(w,1);assert.equal(w.status,'dead');assert.equal(w.retryCheckpoint(),true);assert.equal(w.status,'playing');assert.equal(w.flags,2);assert.equal(w.player.hp,6);
});
test('upgrades add health and boss difficulty rises over five stages',()=>{
  assert.equal(new World(0,0,{armor:1}).player.maxHp,8);assert.equal(LEVELS.length,5);assert.deepEqual(LEVELS.slice(0,3).map(l=>l.rescue),[1,2,3]);assert.ok(new World(4,0).level.enemies.at(-1).hp>new World(0,0).level.enemies.at(-1).hp);
});
test('complete market route is traversable with real movement and all mandatory flags',()=>{
  const route=[[230,185],[400,174],[430,174],[600,169],[780,177],[960,178],[1080,135],[1110,135],[1250,178],[1490,174],[1710,178],[1730,178],[1850,139],[1970,179],[2100,224]];
  for(let c=0;c<4;c++){
    const w=new World(0,c);w.player.hp=w.player.maxHp=1000; // Isolate traversal from combat difficulty.
    tick(w,20);
    for(const [x,feet] of route){
      let reached=false;
      for(let f=0;f<1200;f++){
        const p=w.player,dx=x-p.x;
        if(Math.abs(dx)<4&&p.grounded&&p.y+p.h<=feet+1){reached=true;break;}
        w.step(1/60,{right:dx>3,left:dx< -3,jump:p.grounded&&Math.abs(dx)<100&&p.y+p.h>feet+1,shoot:true});
        if(w.status!=='playing')break;
      }
      assert.ok(reached,`${CHARACTERS[c].name} could not reach platform ${x}: ${w.player.x}, ${w.player.y}`);
    }
    assert.equal(w.flags,3,`${CHARACTERS[c].name} missed a flag`);
    tick(w,600,{shoot:true});assert.equal(w.bossDefeated,true);
    tick(w,100,{right:true,shoot:true});assert.equal(w.status,'won');
  }
});

