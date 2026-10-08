import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const server = spawn('python3', ['-m', 'http.server', '5198', '--bind', '127.0.0.1', '--directory', 'dist/public'], {stdio:'ignore'});
let browser;
try {
  let ready = false;
  for (let i=0;i<40;i++) {
    try { const r=await fetch('http://127.0.0.1:5198/'); if(r.ok){ready=true;break;} } catch {}
    await new Promise(r=>setTimeout(r,100));
  }
  assert(ready,'server ready');
  browser = await chromium.launch({headless:true});
  for (const width of [1440,390]) {
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:5198/',{waitUntil:'networkidle'});
    await page.locator('#planos').scrollIntoViewIfNeeded();
    const text=await page.locator('#planos').innerText();
    for (const expected of ['Start','Pro','Corporate','147','297','597','a partir de','Antes do pagamento','critérios de parada']) assert(text.includes(expected),expected);
    for (const forbidden of ['Tudo do Pro','até o fechamento','cancelados a qualquer momento']) assert(!text.includes(forbidden),forbidden);
    const links=await page.locator('#planos a').evaluateAll(es=>es.map(e=>e.href));
    assert.equal(links.length,3);
    for(const [i,name] of ['Start','Pro','Corporate'].entries()) assert.equal(decodeURIComponent(links[i]),`https://wa.me/5564993259857?text=Olá! Tenho interesse no plano ${name} do Atendente IA.`);
    assert.equal(errors.length,0,JSON.stringify(errors));
    console.log(JSON.stringify({width,plans:3,links:'preserved',pageErrors:errors,copy:'passed'}));
    await page.close();
  }
} finally { await browser?.close(); server.kill(); }
