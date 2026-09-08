import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/user/Documents/mapa-salento-2026/salento-mapa-turistico/dist';
const PORT = 8791;
const SHOTS = 'C:/Users/user/Documents/mapa-salento-2026/salento-mapa-turistico/.mobshots';

const MIME = {'.html':'text/html','.json':'application/json','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.jfif':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};

const server = http.createServer((req,res)=>{
  let p = decodeURIComponent(new URL(req.url,'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  if (p === '/') p = '/index.html';
  const fp = path.join(ROOT, p);
  fs.readFile(fp,(err,data)=>{
    if (err){ res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, {'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream'});
    res.end(data);
  });
});

const pages = [
  '/',
  '/categorias/index.html',
  '/categorias/alojamientos.html',
  '/categorias/atractivos-turisticos.html',
  '/pautantes/moto-aventura-110.html',
  '/pautantes/cabalgatas-cocora-magica.html',
  '/pautantes/boki-mall-hotel-el-mirador-de-boquia.html',
  '/paginas-pautantes/moto-aventura-110/',
  '/paginas-pautantes/fonda-boquia/',
  '/paginas-pautantes/coffee-tour-finca-don-eduardo/',
  '/paginas-pautantes/reserva-natural-cascadas-de-santa-rita/',
  '/paginas-pautantes/cabalgatas-cocora-magica/',
];

await new Promise(r=>server.listen(PORT,r));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args:['--no-sandbox'] });
const viewports = [
  {name:'m-375x812', w:375, h:812},
  {name:'m-320x700', w:320, h:700},
];
const results = [];
const errors = [];
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  for (const u of pages) {
    const page = await ctx.newPage();
    try {
      page.on('pageerror', e=>errors.push(`[${vp.name}][${u}] pageerror: ${e.message}`));
      await page.goto(`http://localhost:${PORT}${u}`, { waitUntil:'networkidle', timeout:25000 });
      await page.waitForTimeout(700);
      const info = await page.evaluate(()=>{
        const de = document.documentElement;
        const overflowX = de.scrollWidth - de.clientWidth;
        const bigElems = [];
        document.querySelectorAll('body *').forEach(el=>{
          const r = el.getBoundingClientRect();
          if (r.width > de.clientWidth + 2 && r.right > de.clientWidth + 2) {
            const cs = getComputedStyle(el);
            if (cs.position !== 'fixed' && !/hidden/.test(cs.overflowX) && !cs.textContent) bigElems.push(`${el.tagName}.${(el.className||'').toString().split(' ')[0]} w=${Math.round(r.width)} right=${Math.round(r.right)}`);
          }
        });
        return { overflowX, bigElems: bigElems.slice(0,10), sw: de.scrollWidth, cw: de.clientWidth };
      });
      results.push({ viewport:vp.name, url:u, ...info });
      await page.screenshot({ path:`${SHOTS}/${vp.name}/${encodeURIComponent(u.replace(/\//g,'_'))}.png`, fullPage:false });
    } catch(e) {
      errors.push(`[${vp.name}][${u}] ${e.message}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
server.close();
console.log(JSON.stringify({ results, errors }, null, 1));
