const fs = require('fs');
const path = require('path');

// Pages whose hero is a logo (white box) -> replace with a real photo
const heroLogoFixes = {
  'boki-mall-barcinales-cafe-bar': '/pautas/boki_mall/imagenes/314270821.webp',
  'boki-mall-eventos': '/pautas/boki_mall/imagenes/premio-mejor-hotel-rural-2024.webp',
  'boki-mall-restaurante-terra': '/pautas/boki_mall/imagenes/Hotel_Mirador_de_Boquia_1747081077351.webp',
  'parque-mirador-la-vida-es-bella': '/pautas/parque-mirador-la-vida-bella/imagenes/IMG_0769.webp',
  'boki-mall-hotel-el-mirador-de-boquia': null, // already a photo
};

// Extra gallery photos per page dir (from pautas imagenes/ or imagenes-salento)
// Goal: at least 4 imgs (prefer 6 when available)
const galleryPicks = {
  'boki-mall-barcinales-cafe-bar': [
    '/pautas/boki_mall/imagenes/images%20(1).webp',
    '/pautas/boki_mall/imagenes/314270821.webp',
    '/pautas/boki_mall/imagenes/Hotel_Mirador_de_Boquia_1747081077351.webp',
    '/pautas/boki_mall/imagenes/terra-restaurante-logo-512.webp',
    '/pautas/boki_mall/imagenes/barcinales-cafe-bar-logo-512.webp',
    '/pautas/boki_mall/imagenes/premio-mejor-hotel-rural-2024.webp',
  ],
  'boki-mall-eventos': [
    '/pautas/boki_mall/imagenes/images%20(1).webp',
    '/pautas/boki_mall/imagenes/314270821.webp',
    '/pautas/boki_mall/imagenes/Hotel_Mirador_de_Boquia_1747081077351.webp',
    '/pautas/boki_mall/imagenes/premio-mejor-hotel-rural-2024.webp',
    '/pautas/boki_mall/imagenes/boki_mall_logo-512.webp',
    '/pautas/boki_mall/imagenes/terra-restaurante-logo-512.webp',
  ],
  'boki-mall-hotel-el-mirador-de-boquia': [
    '/pautas/boki_mall/imagenes/images%20(1).webp',
    '/pautas/boki_mall/imagenes/314270821.webp',
    '/pautas/boki_mall/imagenes/logo-hotel-mirador-de-boquia-512.webp',
    '/pautas/boki_mall/imagenes/premio-mejor-hotel-rural-2024.webp',
    '/pautas/boki_mall/imagenes/boki_mall_logo-512.webp',
    '/pautas/boki_mall/imagenes/terra-restaurante-logo-512.webp',
  ],
  'boki-mall-restaurante-terra': [
    '/pautas/boki_mall/imagenes/images%20(1).webp',
    '/pautas/boki_mall/imagenes/Hotel_Mirador_de_Boquia_1747081077351.webp',
    '/pautas/boki_mall/imagenes/314270821.webp',
    '/pautas/boki_mall/imagenes/premio-mejor-hotel-rural-2024.webp',
    '/pautas/boki_mall/imagenes/terra-restaurante-logo-512.webp',
    '/pautas/boki_mall/imagenes/boki_mall_logo-512.webp',
  ],
  'cabalgatas-cocora-magica': [
    '/pautas/cabalgatas_cocora_magica/imagenes/cabalgatas-en-el-valle-de-cocora-6.webp',
    '/pautas/cabalgatas_cocora_magica/imagenes/cabalgatas-valle-del-cocora-2.webp',
    '/pautas/cabalgatas_cocora_magica/imagenes/logo-cocora-magica-512.webp',
  ],
  'calle-real-de-salento': [
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/1326163759.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'el-recuerdo-coffee-tour': [
    '/pautas/el_recuerdo_coffee_tour/imagenes/recuerdocafetal2.webp',
    '/pautas/el_recuerdo_coffee_tour/imagenes/recuerdopaisaje1.webp',
    '/pautas/el_recuerdo_coffee_tour/imagenes/10.webp',
    '/pautas/el_recuerdo_coffee_tour/imagenes/11.webp',
    '/pautas/el_recuerdo_coffee_tour/imagenes/12.webp',
    '/pautas/el_recuerdo_coffee_tour/imagenes/13.webp',
  ],
  'finca-cafetera-don-elias': [
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/724493520_18074799854670095_3547519742275705982_n.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/692728292_18069951644670095_2829106976592801887_n.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/681426934_18068473622670095_8170870217327481165_n.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/658126044_18063985268670095_3075015024937128905_n.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/logo-coffe-tour-don-elias-512.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/cafe-don-elias.webp',
  ],
  'finca-don-eduardo-coffee-tour': [
    '/pautas/coffee-tour-finca-don-eduardo/imagenes/IMG_9320.webp',
    '/pautas/coffee-tour-finca-don-eduardo/imagenes/IMG_9326.webp',
    '/pautas/coffee-tour-finca-don-eduardo/imagenes/IMG_9360_1.webp',
    '/pautas/coffee-tour-finca-don-eduardo/imagenes/IMG_9629.webp',
    '/pautas/coffee-tour-finca-don-eduardo/imagenes/IMG_9770.webp',
    '/pautas/coffee-tour-finca-don-eduardo/imagenes/finca-don-eduardo-1.webp',
  ],
  'finca-hotel-el-ocaso': [
    '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/foto_casa_ocaso.webp',
    '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/logo_ocaso-512.webp',
    '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/96288317_1807509322731820_3758941573434310656_n.webp',
    '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/760633265_1547164820758229_5175423816618056235_n.webp',
    '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/70767370_1531879373628151_6694873185667514368_n.webp',
    '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/494003217_1143514637789918_206663534016497371_n.webp',
  ],
  'fonda-boquia': [
    '/pautas/restaurante_bar_fonda_boquia/imagenes/30411747_1017613001720886_1046791999434260480_n.webp',
    '/pautas/restaurante_bar_fonda_boquia/imagenes/480508481_1169835038167384_4932382570318530100_n.webp',
    '/pautas/restaurante_bar_fonda_boquia/imagenes/481917729_1182180286932859_1362131829553801165_n.webp',
    '/pautas/restaurante_bar_fonda_boquia/imagenes/481961056_1182180233599531_8927232009685756092_n.webp',
    '/pautas/restaurante_bar_fonda_boquia/imagenes/65375183_1331615080320675_8125305373516103680_n.webp',
    '/pautas/restaurante_bar_fonda_boquia/imagenes/482003557_1182180256932862_8419771631759090824_n.webp',
  ],
  'hotel-camino-nacional-salento': [
    '/pautas/hotel_camino_nacional/imagenes/1669032660.webp',
    '/pautas/hotel_camino_nacional/imagenes/1669032671.webp',
    '/pautas/hotel_camino_nacional/imagenes/1669032675.webp',
    '/pautas/hotel_camino_nacional/imagenes/1669032677.webp',
    '/pautas/hotel_camino_nacional/imagenes/1669032704.webp',
    '/pautas/hotel_camino_nacional/imagenes/631033284.webp',
  ],
  'hotel-la-floresta-salento': [
    '/pautas/hotel_la_floresta_salento/imagenes/floresta1.webp',
    '/pautas/hotel_la_floresta_salento/imagenes/floresta2.webp',
    '/pautas/hotel_la_floresta_salento/imagenes/floresta3.webp',
    '/pautas/hotel_la_floresta_salento/imagenes/floresta-habitacion.webp',
    '/pautas/hotel_la_floresta_salento/imagenes/floresta-mirador.webp',
    '/pautas/hotel_la_floresta_salento/imagenes/floresta-bar.webp',
  ],
  'hotel-la-tia-emiss': [
    '/pautas/hotel_tia_emiss/imagenes/1662261168.webp',
    '/pautas/hotel_tia_emiss/imagenes/emmis1.jpg',
    '/pautas/hotel_tia_emiss/imagenes/1625429615.webp',
    '/pautas/hotel_tia_emiss/imagenes/1625429949.webp',
    '/pautas/hotel_tia_emiss/imagenes/1625430062.webp',
    '/pautas/hotel_tia_emiss/imagenes/1625430071.webp',
  ],
  'iglesia-de-nuestra-senora-del-carmen-de-salento': [
    '/imagenes-salento/iglesia.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/1326163759.webp',
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'mahalo-hostel-salento': [
    '/pautas/mahalo_hostel/imagenes/151829511_115398783872298_53747583158063699_n.webp',
    '/pautas/mahalo_hostel/imagenes/logo-mahalo-512.webp',
    '/pautas/mahalo_hostel/imagenes/gal-1.webp',
    '/pautas/mahalo_hostel/imagenes/gal-2.webp',
    '/pautas/mahalo_hostel/imagenes/gal-4-768x1024.webp',
    '/pautas/mahalo_hostel/imagenes/gal-6-768x1024.webp',
  ],
  'mirador-alto-de-la-cruz': [
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/1326163759.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'mirador-del-condor-salento': [
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/1326163759.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'mirador-las-manos-de-dios': [
    '/pautas/mirador_mano_de_dios/imagenes/dios2.webp',
    '/pautas/mirador_mano_de_dios/imagenes/dios5.webp',
    '/pautas/mirador_mano_de_dios/imagenes/images.webp',
    '/pautas/mirador_mano_de_dios/imagenes/logo-mirador-dios.webp',
    '/pautas/mirador_mano_de_dios/imagenes/caption.webp',
    '/pautas/mirador_mano_de_dios/imagenes/caption (1).webp',
  ],
  'moto-aventura-110': [
    '/pautas/moto_aventura_110/imagenes/2.webp',
    '/pautas/moto_aventura_110/imagenes/3.webp',
    '/pautas/moto_aventura_110/imagenes/4.webp',
    '/pautas/moto_aventura_110/imagenes/5.webp',
    '/pautas/moto_aventura_110/imagenes/logo-moto-aventura-110-512.webp',
    '/pautas/moto_aventura_110/imagenes/1.webp',
  ],
  'oficina-de-informacion-turistica-de-salento': [
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/1326163759.webp',
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'parque-mirador-la-vida-es-bella': [
    '/pautas/parque-mirador-la-vida-bella/imagenes/IMG_0777.webp',
    '/pautas/parque-mirador-la-vida-bella/imagenes/IMG_0769.webp',
    '/pautas/parque-mirador-la-vida-bella/imagenes/IMG_0791.webp',
    '/pautas/parque-mirador-la-vida-bella/imagenes/IMG_0880.webp',
    '/pautas/parque-mirador-la-vida-bella/imagenes/IMG_0888.webp',
    '/pautas/parque-mirador-la-vida-bella/imagenes/Logolavidabella-512.webp',
  ],
  'plaza-de-bolivar-de-salento': [
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/1326163759.webp',
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'puente-de-boquia-sendero-cercano': [
    '/imagenes-salento/destinos-75.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'punto-de-encuentro-jeeps-willys-plaza': [
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/1326163759.webp',
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'recorrido-cultural-casco-historico': [
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/1326163759.webp',
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'reserva-natural-cascadas-de-santa-rita': [
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-1.webp',
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-2.webp',
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-3.webp',
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-4.webp',
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/santa-rita-5.webp',
    '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/cascada2.webp',
  ],
  'restaurante-don-elias': [
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/724493520_18074799854670095_3547519742275705982_n.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/692728292_18069951644670095_2829106976592801887_n.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/681426934_18068473622670095_8170870217327481165_n.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/658126044_18063985268670095_3075015024937128905_n.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/logo-coffe-tour-don-elias-512.webp',
    '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/cafe-don-elias.webp',
  ],
  'sendero-de-las-palmas-entrada-libre-valle': [
    '/imagenes-salento/colombia-palms.webp',
    '/imagenes-salento/valle-cocora-palmas-2.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'terminal-de-transporte-de-salento-acceso-peatonal': [
    '/imagenes-salento/destinos-75.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/631026720.webp',
    '/imagenes-salento/salento-landscape.webp',
    '/imagenes-salento/653410779.webp',
  ],
  'valle-de-cocora-sendero-de-entrada-libre': [
    '/imagenes-salento/valle-cocora-palmas-2.webp',
    '/imagenes-salento/colombia-palms.webp',
    '/imagenes-salento/653410779.webp',
    '/imagenes-salento/pueblo.webp',
    '/imagenes-salento/calle.webp',
    '/imagenes-salento/salento-landscape.webp',
  ],
};

function diskPath(url) {
  if (url.startsWith('/')) {
    return path.join('public', decodeURI(url.slice(1)));
  }
  return null;
}

function altFor(url, name) {
  const base = path.basename(decodeURI(url));
  return `${name} ${base}`;
}

let heroFixed = 0;
let galleriesExpanded = 0;
const missingRefs = [];

for (const [dir, picks] of Object.entries(galleryPicks)) {
  const file = path.join('public/paginas-pautantes', dir, 'index.html');
  if (!fs.existsSync(file)) {
    console.log('NO_PAGE', dir);
    continue;
  }
  let t = fs.readFileSync(file, 'utf8');
  const nameMatch = t.match(/<h1>([^<]+)<\/h1>/);
  const name = nameMatch ? nameMatch[1] : dir;

  // Filter picks that exist on disk and are unique
  const validPicks = [];
  const seen = new Set();
  for (const p of picks) {
    if (seen.has(p)) continue;
    const d = diskPath(p);
    if (d && fs.existsSync(d)) {
      validPicks.push(p);
      seen.add(p);
    } else {
      missingRefs.push(p + ' <- ' + dir);
    }
  }

  // Hero fix: replace logo url in .hero-image background
  const heroFix = heroLogoFixes[dir];
  if (heroFix) {
    const d = diskPath(heroFix);
    if (d && fs.existsSync(d)) {
      const re = /(\.hero-image\s*\{[^}]*url\(['"]?)([^)'"]+)(['"]?\))/;
      if (re.test(t)) {
        t = t.replace(re, (m, a, old, c) => {
          if (/logo/i.test(old)) {
            return a + heroFix + c;
          }
          return m;
        });
      }
    } else {
      missingRefs.push('HERO ' + heroFix + ' <- ' + dir);
    }
  }

  // Also fix reserva relative hero if needed - leave as is if exists

  // Rebuild gallery with up to 6 unique images (prefer existing gallery first, then picks)
  const galRe = /(<div class="gallery">)([\s\S]*?)(<\/div>)/;
  const galMatch = t.match(galRe);
  if (!galMatch) {
    console.log('NO_GALLERY', dir);
    fs.writeFileSync(file, t);
    continue;
  }

  const existing = [];
  const imgRe = /src="([^"]+)"/g;
  let m;
  while ((m = imgRe.exec(galMatch[2]))) {
    existing.push(m[1]);
  }

  const final = [];
  const finalSeen = new Set();
  for (const u of existing.concat(validPicks)) {
    if (finalSeen.has(u)) continue;
    // verify exists
    const d = diskPath(u);
    if (!d || !fs.existsSync(d)) continue;
    finalSeen.add(u);
    final.push(u);
    if (final.length >= 6) break;
  }

  // ensure at least 4 if possible
  if (final.length < 4) {
    // dump more from same folder as first pick
    const first = validPicks[0] || existing[0];
    if (first) {
      const folder = path.dirname(diskPath(first));
      if (fs.existsSync(folder)) {
        for (const f of fs.readdirSync(folder).sort()) {
          if (!/\.(webp|jpg|jpeg|png)$/i.test(f)) continue;
          const u = path.posix.join(path.posix.dirname(decodeURI(first).replace(/\\/g, '/')), f).replace(/ /g, '%20');
          // better construct from known root
          const rootUrl = decodeURI(first).replace(/\/[^/]+$/, '/');
          const enc = rootUrl + f.replace(/ /g, '%20');
          if (finalSeen.has(enc)) continue;
          const dd = diskPath(enc);
          if (dd && fs.existsSync(dd)) {
            finalSeen.add(enc);
            final.push(enc);
            if (final.length >= 6) break;
          }
        }
      }
    }
  }

  const imgsHtml = final.map((u, i) => `<img src="${u}" alt="${name.replace(/"/g, '')} foto ${i + 1}" loading="lazy"/>`).join('');
  const newT = t.replace(galRe, `$1${imgsHtml}$3`);

  if (newT !== t || final.length !== existing.length) {
    const before = existing.length;
    fs.writeFileSync(file, newT);
    if (final.length > before) {
      galleriesExpanded++;
      console.log('GALLERY', dir, before, '->', final.length);
    }
  }
}

console.log('HERO_FIXED_LOGOS', heroFixed);
console.log('GALLERIES_EXPANDED', galleriesExpanded);
console.log('MISSING_PICKS', missingRefs.length);
for (const x of missingRefs) console.log('  MISS', x);

// Final audit
const dirs = fs.readdirSync('public/paginas-pautantes', { withFileTypes: true }).filter(e => e.isDirectory());
let stillThin = 0;
let brokenHero = 0;
for (const d of dirs) {
  const p = path.join('public/paginas-pautantes', d.name, 'index.html');
  if (!fs.existsSync(p)) continue;
  const t = fs.readFileSync(p, 'utf8');
  if (/noindex/i.test(t)) continue;
  const heroMatch = t.match(/\.hero-image\s*\{[^}]*url\((['"]?)([^)'"]+)\1\)/);
  if (heroMatch) {
    const u = heroMatch[2];
    let ok = false;
    if (u.startsWith('data:')) ok = true;
    else if (u.startsWith('/')) ok = fs.existsSync(path.join('public', decodeURI(u.slice(1))));
    else ok = fs.existsSync(path.join('public/paginas-pautantes', d.name, decodeURI(u)));
    if (!ok) {
      brokenHero++;
      console.log('BROKEN_HERO', d.name, u);
    }
  }
  const gal = (t.match(/<div class="gallery">([\s\S]*?)<\/div>/) || [])[1] || '';
  const n = (gal.match(/<img /g) || []).length;
  if (n < 4) {
    stillThin++;
    console.log('STILL_THIN', d.name, n);
  }
}
console.log('BROKEN_HEROES', brokenHero, 'STILL_THIN', stillThin);
