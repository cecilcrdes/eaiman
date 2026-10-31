// Optional UI QA: requires Playwright and an installed Chromium browser.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const gameUrl=process.env.GAME_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;
(async()=>{
  const executablePath=process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser=await chromium.launch({executablePath,headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(gameUrl);await page.evaluate(()=>EaiAssets.ready);assert.deepEqual(await page.evaluate(()=>EaiAssets.errors),[]);assert.equal(await page.evaluate(()=>Object.keys(EaiAssets.images).length),60);await page.waitForTimeout(300);
  await page.screenshot({path:'tmp/home.png',fullPage:true});
  await page.getByRole('button',{name:'Iniciar jogo'}).click();
  await page.getByRole('button',{name:'PARTIU!'}).click();
  await page.keyboard.down('KeyD');await page.waitForTimeout(700);await page.keyboard.up('KeyD');
  await page.keyboard.press('Space');await page.waitForTimeout(200);
  await page.screenshot({path:'tmp/gameplay.png',fullPage:true});
  await page.keyboard.press('Escape');await page.getByRole('button',{name:'VOLTAR PRO JOGO'}).click();
  // Fixture moves to a valid victory condition; real collisions are tested in engine.test.cjs.
  const finish=async(market=false)=>{
    await page.evaluate(market=>{const prototype=market?EaiMarket.MarketWorld.prototype:EaiEngine.World.prototype;const original=prototype.step;prototype.step=function(dt,input){if(market){this.slingshot=true;this.enter("rescue");this.stageTime=8.999;this.cans=32;prototype.step=original;return original.call(this,dt,input);}this.flags=3;this.bossDefeated=true;this.level.enemies.forEach(e=>e.hp=0);this.player.x=2310;this.player.y=197;this.player.vy=0;this.cans=32;prototype.step=original;return original.call(this,dt,input);};},market);
    await page.getByRole('button',{name:'ESCOLHER PERSONAGEM'}).waitFor();
    await page.getByRole('button',{name:'ESCOLHER PERSONAGEM'}).click();
  };
  for(let i=1;i<=3;i++){
    await finish(i===1);
    const cards=page.locator('[data-action="select-character"]');
    assert.equal(await cards.count(),4);
    for(let j=0;j<4;j++)assert.equal(await cards.nth(j).isDisabled(),j>i);
    await cards.nth(i).click();
    if(i===3)await page.screenshot({path:'tmp/characters.png',fullPage:true});
    await page.getByRole('button',{name:'PRÓXIMA FASE'}).click();
    await page.getByRole('button',{name:'PARTIU!'}).click();
  }
  await page.reload();await page.getByRole('button',{name:'MAPA DO MORRO',exact:true}).click();
  assert.equal(await page.locator('.level-card:enabled').count(),4);
  await page.screenshot({path:'tmp/map.png',fullPage:true});
  await page.getByRole('button',{name:'FERRO-VELHO',exact:true}).click();
  await page.locator('[data-product="armor"]').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('eaiman-canarios-v1')).armor),1);
  await page.getByRole('button',{name:'← MAPA',exact:true}).click();
  await page.getByRole('button',{name:'← INÍCIO',exact:true}).click();
  await page.getByRole('button',{name:'Créditos',exact:true}).click();
  await page.getByRole('button',{name:'APAGAR PROGRESSO',exact:true}).click();
  await page.getByRole('button',{name:'MANTER MEU PROGRESSO'}).click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('eaiman-canarios-v1')).completed),3);
  await page.getByRole('button',{name:'VOLTAR AO INÍCIO'}).click();
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(gameUrl);
  await mobile.screenshot({path:'tmp/mobile-home.png',fullPage:true});
  await mobile.getByRole('button',{name:'Iniciar jogo'}).click();await mobile.getByRole('button',{name:'PARTIU!'}).click();
  await mobile.waitForTimeout(200); assert.equal(await mobile.locator('#touch-controls').isVisible(),true);
  await mobile.screenshot({path:'tmp/mobile-game.png',fullPage:true});
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);
  await browser.close();console.log('Browser QA passed: menus, movement, pause, three sequential unlocks, selection, saved progress, shop, reset cancellation, mobile controls; no JS errors.');
})().catch(e=>{console.error(e);process.exit(1);});




