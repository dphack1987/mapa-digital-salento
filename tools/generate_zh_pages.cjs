/**
 * Genera las páginas estáticas /zh/ (index + 6 guías + conservación) a partir
 * de las plantillas /es/, agrega hreflang zh-CN + enlace ZH al nav en las 48
 * páginas de idiomas existentes, y actualiza el sitemap con las URLs zh y el
 * alternate zh-CN en todos los bloques con set completo de idiomas.
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.salentoalamano.com';
const ROOT = path.resolve(__dirname, '..');

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function write(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}
function exists(rel) { return fs.existsSync(path.join(ROOT, rel)); }

let errors = [];
function assert(cond, msg) { if (!cond) errors.push(msg); }

// ---------- utilidades comunes ----------

function insertHreflangZh(html, zhUrl, label) {
  if (html.includes('hreflang="zh-CN"')) return html;
  const anchor = '<link rel="alternate" hreflang="x-default"';
  assert(html.includes(anchor), label + ': falta x-default');
  return html.replace(anchor,
    `<link rel="alternate" hreflang="zh-CN" href="${zhUrl}" />\n    ` + anchor);
}

function insertNavZh(html, label) {
  if (/>ZH</.test(html) || /">ZH<\/a>/.test(html)) return html;
  const m = html.match(/<a href="(\/[^"]*)">IT<\/a>/);
  assert(m, label + ': falta enlace IT en nav');
  if (!m) return html;
  const zhHref = m[1].replace(/^\/(es|en|de|fr|pt|it)\//, '/zh/').replace(/^\/$/, '/zh/');
  // raíz: /it/ -> /zh/ ; guías: /it/guias/x -> /zh/guias/x ; conservación similar
  let zh = m[1];
  if (zh === '/it/') zh = '/zh/';
  else zh = zh.replace(/^\/it\//, '/zh/');
  return html.replace(m[0], m[0] + `<a href="${zh}">ZH</a>`);
}

function zhUrlFor(relFile) {
  // relFile: ruta relativa bajo public/
  if (relFile === 'conservacion-salento.html') return BASE + '/zh/conservacion-salento.html';
  if (relFile === 'zh/index.html') return BASE + '/zh/';
  if (relFile.startsWith('zh/')) return BASE + '/' + relFile;
  const m = relFile.match(/^(?:es|en|de|fr|pt|it)\/(.*)$/);
  if (!m) throw new Error('zhUrlFor: ruta inesperada ' + relFile);
  const rest = m[1];
  if (rest === 'index.html') return BASE + '/zh/';
  return BASE + '/zh/' + rest;
}

// ---------- A. traducciones para generar /zh/ ----------

function applyReplacements(html, pairs, label) {
  for (const [find, replace] of pairs) {
    if (typeof find === 'string') {
      if (!html.includes(find)) { errors.push(label + ': no se encontró "' + find.slice(0, 70) + '"'); continue; }
      html = html.split(find).join(replace);
    } else {
      if (!find.test(html)) { errors.push(label + ': regex no matchió ' + find); continue; }
      html = html.replace(find, replace);
    }
  }
  return html;
}

function commonGuidePairs() {
  return [
    ['Guía local', '本地指南'],
    ['Explora negocios locales', '探索本地商户'],
    ['Consulta el directorio y contacta directamente a los establecimientos registrados.', '查看目录，直接联系已登记的商户。'],
    ['Explorar el mapa', '浏览地图'],
  ];
}

const DESC_COCORA = 'Planifica una visita responsable al Valle del Cocora con información de acceso, transporte, clima y experiencias locales.';
const DESC_COCORA_ZH = '获取交通、气候与本地体验信息，规划一次负责任的科科拉山谷之旅。';
const DESC_TOURS = 'Una guía para comparar experiencias cafeteras, duración, punto de encuentro, servicios y contacto directo.';
const DESC_TOURS_ZH = '比较咖啡体验、时长、集合点、服务与直接联系方式的指南。';
const DESC_3DIAS = 'Una base flexible para combinar pueblo, café, naturaleza, gastronomía y compras locales.';
const DESC_3DIAS_ZH = '灵活组合小镇、咖啡、自然、美食与本地购物的基础行程。';
const DESC_COMPARA = 'Comparamos las fincas cafeteras verificadas de Salento con datos reales: duración, idiomas, precios de referencia y contacto directo sin intermediarios.';
const DESC_COMPARA_ZH = '用真实数据对比萨兰托已验证的咖啡庄园：时长、语言、参考价格与无中介的直接联系。';
const DESC_LLEGADA = 'Del terminal a la despedida: cómo vivir Salento con transporte, hospedaje, Cocora, café y gastronomía verificados, en trato directo.';
const DESC_LLEGADA_ZH = '从车站到告别：用已验证的交通、住宿、科科拉、咖啡与美食，直接交易体验萨兰托。';
const DESC_SINTOUR = 'Llega al Valle de Cocora por tu cuenta en jeep Willys compartido desde la plaza de Salento, con tarifa de referencia, horarios y punto de encuentro verificados.';
const DESC_SINTOUR_ZH = '从萨兰托广场乘坐共享威利斯吉普车自行前往科科拉山谷，参考票价、时刻与集合点均已验证。';

const ZH_PAGES = [
  {
    src: 'public/es/index.html',
    dst: 'public/zh/index.html',
    title: 'Salento a la Mano | 哥伦比亚金迪奥省萨兰托旅游指南',
    desc: '萨兰托本地指南：住宿、餐厅、咖啡馆、体验与服务，直接联系当地商户。',
    pairs: [
      ['Salento, Quindío, Colombia', '哥伦比亚 · 金迪奥省 · 萨兰托'],
      ['Encuentra alojamientos, sabores, experiencias y servicios locales en Salento, Quindío.', '在萨兰托找到住宿、美食、体验与本地服务。'],
      ['Guías para planificar tu visita', '规划行程的实用指南'],
      ['Guía para visitar el Valle del Cocora', '科科拉山谷游览指南'],
      [DESC_COCORA, DESC_COCORA_ZH],
      ['Tours de café en Salento: cómo elegir', '萨兰托咖啡之旅：如何选择'],
      [DESC_TOURS, DESC_TOURS_ZH],
      ['Qué hacer en Salento: itinerario de 3 días', '萨兰托玩什么：3 天行程'],
      [DESC_3DIAS, DESC_3DIAS_ZH],
      ['Los mejores coffee tours en Salento: comparativa honesta', '萨兰托最佳咖啡之旅：真实对比'],
      [DESC_COMPARA, DESC_COMPARA_ZH],
      ['Salento de llegada a salida: tu experiencia completa', '萨兰托从抵达到离开：完整体验'],
      [DESC_LLEGADA, DESC_LLEGADA_ZH],
      ['Cómo llegar al Valle de Cocora sin tour: guía por tu cuenta', '如何不跟团前往科科拉山谷：自助指南'],
      [DESC_SINTOUR, DESC_SINTOUR_ZH],
      ['Búsquedas útiles', '实用搜索'],
      ['mejores fincas cafeteras con trato directo en Salento', '萨兰托可直接联系的最佳咖啡庄园'],
      ['hotel familiar cerca de la plaza de Salento', '萨兰托广场附近的家庭酒店'],
      ['restaurantes con comida local en Salento Quindío', '金迪奥省萨兰托的本地美食餐厅'],
      ['transporte al Valle de Cocora desde Salento', '从萨兰托前往科科拉山谷的交通'],
      ['qué hacer en Salento en tres días', '萨兰托三天可以做什么'],
      ['mejores coffee tours en Salento con reserva directa', '萨兰托可直接预订的最佳咖啡之旅'],
      ['cómo llegar al Valle de Cocora sin tour desde Salento', '从萨兰托如何不跟团前往科科拉山谷'],
      ['Explorar el mapa', '浏览地图'],
    ],
  },
  {
    src: 'public/es/guias/guia-valle-del-cocora.html',
    dst: 'public/zh/guias/guia-valle-del-cocora.html',
    title: '科科拉山谷游览指南 | ZH',
    desc: DESC_COCORA_ZH,
    pairs: [
      ['Guía para visitar el Valle del Cocora', '科科拉山谷游览指南'],
      [DESC_COCORA, DESC_COCORA_ZH],
      ...commonGuidePairs(),
      ['Antes de salir', '出发前'],
      ['Consulta el clima, confirma horarios y lleva ropa cómoda, impermeable, agua y calzado apropiado.', '查看天气，确认时间安排，穿舒适衣物，带雨具、饮用水和合适的鞋子。'],
      ['Cómo organizar el día', '如何安排行程'],
      ['Define primero el transporte y el tiempo disponible. Contacta directamente al operador de la experiencia antes de reservar.', '先确定交通和可用时间。预订前请直接联系体验运营方。'],
      ['Conexión local', '本地连接'],
      ['Consulta las fichas de transporte, guías, restaurantes y alojamientos de Salento para organizar el recorrido.', '查看萨兰托的交通、向导、餐厅和住宿信息来安排行程。'],
    ],
  },
  {
    src: 'public/es/guias/10-tours-cafe-salento.html',
    dst: 'public/zh/guias/10-tours-cafe-salento.html',
    title: '萨兰托咖啡之旅：如何选择 | ZH',
    desc: DESC_TOURS_ZH,
    pairs: [
      ['Tours de café en Salento: cómo elegir', '萨兰托咖啡之旅：如何选择'],
      [DESC_TOURS, DESC_TOURS_ZH],
      ...commonGuidePairs(),
      ['Busca una experiencia clara', '寻找清晰的体验'],
      ['Revisa qué incluye el recorrido, cuánto dura y dónde comienza.', '查看行程包含什么、持续多久、从哪里开始。'],
      ['Pregunta antes de reservar', '预订前先询问'],
      ['Confirma disponibilidad, tarifa, idioma, transporte y condiciones de cancelación con el operador.', '与运营方确认名额、价格、语言、交通和取消政策。'],
      ['Conoce el origen', '了解源头'],
      ['Las fichas locales ayudan a descubrir fincas cafeteras y negocios que explican el proceso del café.', '本地资料帮助你发现讲解咖啡制作过程的咖啡庄园和商户。'],
    ],
  },
  {
    src: 'public/es/guias/que-hacer-en-salento-3-dias.html',
    dst: 'public/zh/guias/que-hacer-en-salento-3-dias.html',
    title: '萨兰托玩什么：3 天行程 | ZH',
    desc: DESC_3DIAS_ZH,
    pairs: [
      ['Qué hacer en Salento: itinerario de 3 días', '萨兰托玩什么：3 天行程'],
      [DESC_3DIAS, DESC_3DIAS_ZH],
      ...commonGuidePairs(),
      ['Día 1: pueblo y gastronomía', '第 1 天：小镇与美食'],
      ['Recorre el centro, consulta restaurantes y cafés, y reserva tiempo para conocer productos locales.', '逛市中心，看看餐厅和咖啡馆，留出时间了解本地产品。'],
      ['Día 2: naturaleza', '第 2 天：自然'],
      ['Organiza una salida al Valle de Cocora o una experiencia cercana según clima, tiempo y dificultad.', '根据天气、时间和难度，安排前往科科拉山谷或附近的体验。'],
      ['Día 3: café y compras', '第 3 天：咖啡与购物'],
      ['Visita una finca cafetera, conoce artesanías y contacta directamente los negocios que quieras visitar.', '参观咖啡庄园，了解手工艺品，并直接联系你想去的商户。'],
    ],
  },
  {
    src: 'public/es/guias/mejores-coffee-tours-salento.html',
    dst: 'public/zh/guias/mejores-coffee-tours-salento.html',
    title: '萨兰托最佳咖啡之旅：真实对比 | ZH',
    desc: DESC_COMPARA_ZH,
    pairs: [
      ['Los mejores coffee tours en Salento: comparativa honesta', '萨兰托最佳咖啡之旅：真实对比'],
      [DESC_COMPARA, DESC_COMPARA_ZH],
      ...commonGuidePairs(),
      ['Cómo comparar un coffee tour', '如何比较咖啡之旅'],
      ['Revisa duración, idiomas, punto de encuentro, qué incluye y si el precio es por persona. Todas las fincas verificadas permiten contacto directo por WhatsApp, sin intermediarios ni comisiones.', '查看时长、语言、集合点、包含内容以及价格是否按人计算。所有已验证庄园均支持 WhatsApp 直接联系，无中介、无佣金。'],
      ['Fincas verificadas en Salento', '萨兰托已验证的庄园'],
      [/Finca Don Eduardo \(3 horas[\s\S]*?El Recuerdo Coffee Tour \(rango \$\$, reserva previa por WhatsApp\)\./,
        '已验证庄园：Don Eduardo 庄园（3 小时，英语发团 9:30 与 14:30，或西班牙语 10:40 需提前预订；距主广场步行 4 公里；每人 100,000 哥伦比亚比索）· Don Elías 咖啡庄园（$$ 级别，价格请咨询）· El Recuerdo 咖啡之旅（$$ 级别，需通过 WhatsApp 提前预订）。'],
      ['Antes de reservar', '预订前'],
      ['Confirma disponibilidad, tarifa vigente, idioma del tour, punto de encuentro y política de cancelación directamente con la finca.', '直接与庄园确认名额、现行价格、行程语言、集合点和取消政策。'],
    ],
  },
  {
    src: 'public/es/guias/como-llegar-valle-cocora-sin-tour.html',
    dst: 'public/zh/guias/como-llegar-valle-cocora-sin-tour.html',
    title: '如何不跟团前往科科拉山谷：自助指南 | ZH',
    desc: DESC_SINTOUR_ZH,
    pairs: [
      ['Cómo llegar al Valle de Cocora sin tour: guía por tu cuenta', '如何不跟团前往科科拉山谷：自助指南'],
      [DESC_SINTOUR, DESC_SINTOUR_ZH],
      ...commonGuidePairs(),
      ['El transporte público al Cocora', '前往科科拉的公共交通'],
      [/La cooperativa Cootracocora opera[\s\S]*?confirma la tarifa vigente por WhatsApp\./,
        'Cootracocora 合作社运营传统的萨兰托—科科拉山谷威利斯吉普车，每天 6:00 至 21:00 从主广场发车。参考票价每程 3,600 哥伦比亚比索；请通过 WhatsApp 确认现行票价。'],
      ['Cómo funciona el cupo', '座位如何安排'],
      ['Las salidas son al completar cupo desde el Terminal de Transporte Público Jeep Willys en la plaza principal. Llega con anticipación en temporada alta.', '车辆在主广场的威利斯吉普公共交通总站坐满即发。旺季请提前到达。'],
      ['El regreso', '返程'],
      ['Los jeeps regresan del Valle a Salento en la misma modalidad. Coordina el horario de vuelta directamente con la cooperativa, sin intermediarios.', '吉普车以同样方式从山谷返回萨兰托。直接与合作社协调返程时间，无需中介。'],
    ],
  },
  {
    src: 'public/es/guias/experiencia-salento-llegada-a-salida.html',
    dst: 'public/zh/guias/experiencia-salento-llegada-a-salida.html',
    title: '萨兰托从抵达到离开：完整体验 | ZH',
    desc: DESC_LLEGADA_ZH,
    pairs: [
      ['Salento de llegada a salida: tu experiencia completa', '萨兰托从抵达到离开：完整体验'],
      [DESC_LLEGADA, DESC_LLEGADA_ZH],
      ...commonGuidePairs(),
      ['La llegada', '抵达'],
      ['Llega al Terminal de Transporte de Salento y ubica la plaza principal: allí está el Terminal de Transporte Público Jeep Willys, punto de partida al Valle de Cocora.', '抵达萨兰托客运站后前往主广场：那里是威利斯吉普公共交通总站，也是前往科科拉山谷的出发点。'],
      ['El check-in', '入住'],
      ['Hoteles verificados como Hotel Camino Nacional y Hotel La Floresta (desde $124.000 COP/noche) reciben con contacto directo por WhatsApp.', '已验证的酒店如 Hotel Camino Nacional 和 Hotel La Floresta（每晚 124,000 哥伦比亚比索起）支持 WhatsApp 直接联系入住。'],
      ['Los días: Cocora y café', '行程：科科拉与咖啡'],
      [/Dedica un día al Valle de Cocora[\s\S]*?\$28\.000[–—-]\$46\.000\)\./,
        '用一天随 Cootracocora 游览科科拉山谷（每天 6:00–21:00 发车，参考票价 3,600 哥伦比亚比索起），另一天参加已验证的咖啡之旅，如 Finca Don Eduardo（3 小时，英语和西班牙语）。最后到 Fonda Boquía 品尝鳟鱼（11 种做法，28,000–46,000 比索）。'],
      ['La despedida', '告别'],
      ['Coordina tu regreso desde la plaza con la cooperativa y confirma horarios de salida directamente por WhatsApp. Tu dinero se queda en Salento.', '从广场与合作社协调返程，并通过 WhatsApp 直接确认发车时间。你的消费留在萨兰托。'],
    ],
  },
  {
    src: 'public/conservacion-salento.html',
    dst: 'public/zh/conservacion-salento.html',
    title: '萨兰托保护行动 | 你的旅游守护科科拉山谷',
    desc: '为科科拉山谷、殖民教堂和玻利瓦尔广场的保护做出贡献。直接捐助，无中介。',
    pairs: [
      ['🌿 Conservación', '🌿 保护行动'],
      ['Tu turismo conserva Salento', '你的旅游守护萨兰托'],
      ['Salento es un territorio que depende del turismo responsable. Tu contribución directa financia la conservación del Valle de Cocora, el mantenimiento de la plaza principal y la preservación de la iglesia colonial. Sin intermediarios, sin comisiones.', '萨兰托是一个依赖负责任旅游的地区。你的直接捐助将用于科科拉山谷的保护、主广场的维护和殖民教堂的修缮。无中介，无佣金。'],
      ['¿Dónde va tu contribución?', '你的捐助用在哪里？'],
      ['Impacto real', '实际影响'],
      ['Palmas de cera protegidas', '受保护的蜡棕榈'],
      ['Senderos mantenidos', '维护中的步道'],
      ['Días operativo el valle', '山谷全年开放天数'],
      ['Va directo a conservación', '全额用于保护'],
      ['Lo que dicen los visitantes', '游客怎么说'],
      ['"Donamos durante nuestra visita al Valle de Cocora. Es increíble ver que el dinero queda directamente en la comunidad."', '"我们在游览科科拉山谷时捐了款。看到钱直接留在社区，感觉真好。"'],
      ['— María, Colombia', '— María，哥伦比亚'],
      ['Valle de Cocora', '科科拉山谷'],
      ['Protección de las palmas de cera, mantenimiento de senderos y preservación del ecosistema del valle.', '保护蜡棕榈、维护步道并守护山谷生态系统。'],
      ['Iglesia Colonial', '殖民教堂'],
      ['Restauración y mantenimiento de la Iglesia Nuestra Señora del Carmen, patrimonio histórico de Salento.', '修复和维护萨兰托历史遗产——卡门圣母教堂。'],
      ['Plaza de Bolívar', '玻利瓦尔广场'],
      ['Conservación de los espacios públicos, mobiliario urbano y áreas verdes de la plaza principal.', '维护主广场的公共空间、城市设施和绿地。'],
      ['Senderos Naturales', '自然步道'],
      ['Señalización, limpieza y conservación de los senderos que conectan el pueblo con el valle.', '标识、清洁和维护连接小镇与山谷的步道。'],
      ['Contribuye ahora', '立即参与'],
      ['Tu donación llega directamente a los proyectos de conservación. Sin intermediarios, sin comisiones.', '你的捐款直接到达保护项目。无中介，无佣金。'],
      ['💬 Contribuir por WhatsApp', '💬 通过 WhatsApp 参与'],
      ['Volver al mapa', '返回地图'],
      ['100% de tu contribución va directo a la conservación. Salento a la Mano no recibe comisión por donaciones.<br>Al contribuir, aceptas que tu donación será destinada a los proyectos de conservación activos en Salento.', '你的捐助 100% 用于保护事业。Salento a la Mano 不收取任何捐款佣金。<br>参与即表示你的捐款将用于萨兰托正在进行的保护项目。'],
    ],
  },
];

console.log('=== A. Generando páginas /zh/ ===');
for (const page of ZH_PAGES) {
  if (!exists(page.src)) { errors.push('Falta plantilla ' + page.src); continue; }
  let html = read(page.src);

  // lang
  html = html.replace('<html lang="es">', '<html lang="zh">');
  // title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);
  // description si existe
  const descMatch = html.match(/<meta name="description" content="[^"]*"\/?>/);
  if (descMatch) {
    if (page.desc) html = html.replace(descMatch[0], `<meta name="description" content="${page.desc}">`);
    else errors.push(page.dst + ': tiene meta description pero no definí traducción');
  }
  // canonical -> zh
  const zhUrl = zhUrlFor(page.dst.replace(/^public\//, ''));
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${zhUrl}"`);
  // hreflang zh-CN
  html = insertHreflangZh(html, zhUrl, page.dst);
  // nav ZH
  html = insertNavZh(html, page.dst);
  // textos
  html = applyReplacements(html, page.pairs, page.dst);

  // verificación: no debe quedar español obvio en textos visibles
  const leftover = html.match(/>[^<>]*(Guía |consulta |Cómo |Explora |Búsquedas |itinerario)[^<>]*</i);
  if (leftover) errors.push(page.dst + ': posible texto español restante: ' + leftover[0].slice(0, 90));

  write(page.dst, html);
  console.log('  OK ' + page.dst);
}

// ---------- B. patch hreflang zh-CN + nav ZH en páginas existentes ----------

console.log('=== B. Patcheando páginas de idiomas existentes ===');
const langFiles = [];
for (const lang of ['es', 'en', 'de', 'fr', 'pt', 'it']) {
  const dir = path.join(ROOT, 'public', lang);
  if (!exists('public/' + lang)) continue;
  const walk = (d, rel) => {
    for (const f of fs.readdirSync(d)) {
      const full = path.join(d, f);
      const relPath = rel + f;
      if (fs.statSync(full).isDirectory()) walk(full, relPath + '/');
      else if (f.endsWith('.html')) langFiles.push('public/' + lang + '/' + relPath);
    }
  };
  walk(dir, '');
}
langFiles.push('public/conservacion-salento.html');

for (const rel of langFiles) {
  let html = read(rel);
  const zhUrl = zhUrlFor(rel.replace(/^public\//, ''));
  const before = html;
  html = insertHreflangZh(html, zhUrl, rel);
  html = insertNavZh(html, rel);
  if (html !== before) {
    write(rel, html);
    console.log('  OK ' + rel);
  } else {
    console.log('  SKIP (ya tenía zh) ' + rel);
  }
}

// ---------- C. sitemap ----------

console.log('=== C. Actualizando sitemap.xml ===');
let sm = read('public/sitemap.xml');

function locToZh(loc) {
  const p = loc.replace(BASE, '');
  if (p === '/') return BASE + '/zh/';
  if (p === '/conservacion-salento.html') return BASE + '/zh/conservacion-salento.html';
  const m = p.match(/^\/(es|en|de|fr|pt|it)\/(.*)$/);
  if (m) return BASE + '/zh/' + m[2].replace(/^index\.html$/, '');
  return null;
}

// dividir en bloques url
const blocks = [];
const re = /<url>[\s\S]*?<\/url>/g;
let m2;
while ((m2 = re.exec(sm)) !== null) blocks.push(m2[0]);

let patched = 0;
const zhBlocks = [];
const seenZh = new Set();
// idempotencia: excluir bloques zh ya presentes en el sitemap
for (const b of blocks) {
  const lm = b.match(/<loc>([^<]+)<\/loc>/);
  if (lm && lm[1].startsWith(BASE + '/zh/')) seenZh.add(lm[1]);
}

for (let i = 0; i < blocks.length; i++) {
  const b = blocks[i];
  const locM = b.match(/<loc>([^<]+)<\/loc>/);
  if (!locM) continue;
  const loc = locM[1];
  const hasFullSet = b.includes('hreflang="it"');
  if (!hasFullSet) continue;

  const zhUrl = locToZh(loc);
  if (!zhUrl) continue;

  let nb = b;
  if (!b.includes('hreflang="zh-CN"')) {
    const idx = b.indexOf('<xhtml:link rel="alternate" hreflang="x-default"');
    if (idx < 0) { errors.push('sitemap: sin x-default en ' + loc); continue; }
    nb = b.slice(0, idx) +
      `<xhtml:link rel="alternate" hreflang="zh-CN" href="${zhUrl}" />\n    ` +
      b.slice(idx);
    blocks[i] = nb;
    patched++;
  }

  // clonar como bloque zh solo desde el counterpart es (raíz, /es/*, conservación raíz)
  const isEsCounterpart = loc === BASE + '/' ||
    loc === BASE + '/conservacion-salento.html' ||
    /^https:\/\/www\.salentoalamano\.com\/es\//.test(loc);
  if (isEsCounterpart && !seenZh.has(zhUrl)) {
    seenZh.add(zhUrl);
    let clone = nb.includes('hreflang="zh-CN"') ? nb : nb; // ya tiene zh-CN si se parchó arriba
    clone = clone.replace(/<loc>[^<]+<\/loc>/, `<loc>${zhUrl}</loc>`);
    zhBlocks.push(clone);
  }
}

// reconstruir sitemap: bloques originales (parcheados) + bloques zh nuevos
const head = sm.slice(0, sm.indexOf('<url>'));
const tail = sm.slice(sm.indexOf('</urlset>'));
sm = head + blocks.join('\n    ') + '\n    ' + zhBlocks.join('\n    ') + '\n  ' + tail;
write('public/sitemap.xml', sm);
console.log('  alternates zh-CN agregados: ' + patched + '; URLs zh nuevas: ' + zhBlocks.length);
const zhTotal = (sm.match(/<loc>[^<]*\/zh\//g) || []).length;
if (zhTotal !== 8) errors.push('sitemap: se esperaban 8 URLs zh, hay ' + zhTotal);
if (!sm.includes('hreflang="zh-CN"')) errors.push('sitemap: no se agregó zh-CN');

// ---------- resumen ----------
console.log('');
if (errors.length) {
  console.log('ERRORES (' + errors.length + '):');
  for (const e of errors) console.log('  - ' + e);
  process.exit(1);
} else {
  console.log('TODO OK');
}
