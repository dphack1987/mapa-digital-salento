import type { Language } from '../types'
import {
  FALLBACK_OVERRIDES,
  GENERAL_SUGGESTIONS_OVERRIDES,
  SMALL_TALK_OVERRIDES,
  WEATHER_SUGGESTIONS_OVERRIDES
} from './donChuchoOverrides'

export type BaseLanguage = 'es' | 'en' | 'de' | 'fr' | 'pt' | 'it'

export type KnowledgeIntent =
  | 'reservar'
  | 'comer'
  | 'dormir'
  | 'clima'
  | 'transporte'
  | 'precio'
  | 'pago'
  | 'mascota'
  | 'acampar'
  | 'familia'
  | 'romantico'
  | 'idioma'
  | 'mirador'
  | 'seguridad'
  | 'artesania'
  | 'comprar'
  | 'conectividad'
  | null

export type SmallTalkIntent =
  | 'greeting'
  | 'thanks'
  | 'goodbye'
  | 'howAreYou'
  | 'identity'
  | 'help'
  | 'compliment'
  | 'apology'
  | 'affirm'
  | 'deny'
  | null

const BASE_LANGUAGES: BaseLanguage[] = ['es', 'en', 'de', 'fr', 'pt', 'it']

export function resolveBaseLanguage(language: Language): BaseLanguage {
  if (language === 'en-gb') return 'en'
  if (BASE_LANGUAGES.includes(language as BaseLanguage)) return language as BaseLanguage
  return 'en'
}

export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const PHRASE_MAP: Array<[string, string]> = [
  // Frases multilingües frecuentes → español
  ['ca phe', 'cafe'], ['quan ca phe', 'cafe'], ['thoi tiet', 'clima'],
  ['giao thong', 'transporte'], ['thung lung', 'valle'], ['cuoi ngua', 'cabalgata'],
  ['an toan', 'seguridad'], ['mua sam', 'comprar'], ['thu cong', 'artesanias'],
  ['air terjun', 'cascada'], ['menunggang kuda', 'cabalgata'], ['beli belah', 'comprar'],
  ['أين آكل', 'donde comer'], ['أين نأكل', 'donde comer'], ['أين أنام', 'donde dormir'],
  ['أين أسكن', 'donde dormir hospedaje'], ['كم السعر', 'cuanto cuesta precio'],
  ['كم تكلفة', 'cuanto cuesta precio'], ['كيف أصل', 'como llegar transporte'],
  ['وادي كوكورا', 'valle cocora'], ['بدون tour', 'sin tour'],
  ['where can i sleep', 'donde dormir hospedaje'],
  ['where can i stay', 'donde dormir hospedaje'],
  ['where to sleep', 'donde dormir hospedaje'],
  ['where to stay', 'donde dormir hospedaje'],
  ['how do i get to', 'como llegar transporte'],
  ['how can i get to', 'como llegar transporte'],
  ['how do i get from', 'como llegar transporte'],
  ['how to get to', 'como llegar transporte'],
  ['how do i get around', 'como moverse transporte'],
  ['how much does', 'cuanto cuesta precio'],
  ['how much is', 'cuanto cuesta precio'],
  ['how much are', 'cuanto cuesta precio'],
  ['what can i do', 'que hacer turismo'],
  ['what should i do', 'que hacer turismo'],
  ['what is there to do', 'que hacer turismo'],
  ['best time to visit', 'mejor epoca visitar'],
  ['best time to go', 'mejor epoca visitar'],
  ['i want to book', 'quiero reservar tour'],
  ['i want to reserve', 'quiero reservar tour'],
  ['i would like to book', 'quiero reservar tour'],
  ['do you accept cards', 'aceptan tarjeta pago'],
  ['do you take cards', 'aceptan tarjeta pago'],
  ['do you accept credit cards', 'aceptan tarjeta pago'],
  ['is there parking', 'hay estacionamiento parqueadero'],
  ['can i bring my dog', 'puedo ir con perro mascota'],
  ['can i bring my pet', 'puedo ir con perro mascota'],
  ['is it raining', 'esta lloviendo clima'],
  ['what is the weather', 'clima tiempo'],
  ['what s the weather', 'clima tiempo'],
  ['wo kann ich schlafen', 'donde dormir hospedaje'],
  ['wo kann ich ubernachten', 'donde dormir hospedaje'],
  ['wie komme ich nach', 'como llegar transporte'],
  ['wie komme ich zum', 'como llegar transporte'],
  ['wie komme ich zur', 'como llegar transporte'],
  ['was kann ich machen', 'que hacer turismo'],
  ['was kann ich unternehmen', 'que hacer turismo'],
  ['wie viel kostet', 'cuanto cuesta precio'],
  ['regnet es', 'esta lloviendo clima'],
  ['wie ist das wetter', 'clima tiempo'],
  ['ou peut on dormir', 'donde dormir hospedaje'],
  ['ou puis je dormir', 'donde dormir hospedaje'],
  ['ou peut on loger', 'donde dormir hospedaje'],
  ['comment aller a', 'como llegar transporte'],
  ['comment aller au', 'como llegar transporte'],
  ['comment arriver a', 'como llegar transporte'],
  ['que peut on faire', 'que hacer turismo'],
  ['que puis je faire', 'que hacer turismo'],
  ['combien coute', 'cuanto cuesta precio'],
  ['est ce qu il pleut', 'esta lloviendo clima'],
  ['quel temps fait il', 'clima tiempo'],
  ['onde posso dormir', 'donde dormir hospedaje'],
  ['onde eu posso dormir', 'donde dormir hospedaje'],
  ['onde posso ficar', 'donde dormir hospedaje'],
  ['como chego a', 'como llegar transporte'],
  ['como chegar a', 'como llegar transporte'],
  ['o que posso fazer', 'que hacer turismo'],
  ['quanto custa', 'cuanto cuesta precio'],
  ['esta chovendo', 'esta lloviendo clima'],
  ['como esta o tempo', 'clima tiempo'],
  ['dove posso dormire', 'donde dormir hospedaje'],
  ['dove si puo dormire', 'donde dormir hospedaje'],
  ['come arrivo a', 'como llegar transporte'],
  ['come si arriva a', 'como llegar transporte'],
  ['cosa posso fare', 'que hacer turismo'],
  ['cosa si puo fare', 'que hacer turismo'],
  ['quanto costa', 'cuanto cuesta precio'],
  ['sta piovendo', 'esta lloviendo clima'],
  ['che tempo fa', 'clima tiempo']
]

const WORD_MAP: Record<string, string> = {
  // Árabe
  'قهوة': 'cafe', 'مقهى': 'cafe', 'طعام': 'comida', 'أكل': 'comer', 'اكل': 'comer',
  'مطعم': 'restaurante', 'فندق': 'hotel', 'نوم': 'dormir', 'إقامة': 'hospedaje',
  'جولة': 'tour', 'جولات': 'tours', 'طقس': 'clima', 'مطر': 'lluvia',
  'نقل': 'transporte', 'حافلة': 'bus', 'تاكسي': 'taxi', 'سعر': 'precio',
  'أسعار': 'precio', 'وادي': 'valle', 'شلال': 'cascada', 'خيل': 'cabalgata',
  'آمن': 'seguridad', 'أمان': 'seguridad', 'واي فاي': 'wifi', 'إنترنت': 'internet',
  'تسوق': 'comprar', 'حرف': 'artesanias',
  // Japonés
  'コーヒー': 'cafe', 'カフェ': 'cafe', '食事': 'comida', '食べる': 'comer',
  'レストラン': 'restaurante', 'ホテル': 'hotel', '宿': 'hospedaje', '泊まる': 'dormir',
  'ツアー': 'tour', '天気': 'clima', '雨': 'lluvia', '交通': 'transporte',
  'バス': 'bus', 'タクシー': 'taxi', '価格': 'precio', '料金': 'precio',
  '渓谷': 'valle', '滝': 'cascada', '乗馬': 'cabalgata', '安全': 'seguridad',
  '買い物': 'comprar', '工芸': 'artesanias',
  // Coreano
  '커피': 'cafe', '카페': 'cafe', '음식': 'comida', '식사': 'comida', '먹다': 'comer',
  '식당': 'restaurante', '호텔': 'hotel', '숙소': 'hospedaje', '자다': 'dormir',
  '투어': 'tour', '날씨': 'clima', '비': 'lluvia', '교통': 'transporte',
  '버스': 'bus', '택시': 'taxi', '가격': 'precio', '계곡': 'valle', '폭포': 'cascada',
  '승마': 'cabalgata', '안전': 'seguridad', '와이파이': 'wifi', '쇼핑': 'comprar',
  '공예': 'artesanias',
  // Tailandés
  'กาแฟ': 'cafe', 'คาเฟ่': 'cafe', 'อาหาร': 'comida', 'กิน': 'comer',
  'ร้านอาหาร': 'restaurante', 'โรงแรม': 'hotel', 'ที่พัก': 'hospedaje', 'นอน': 'dormir',
  'ทัวร์': 'tour', 'อากาศ': 'clima', 'ฝน': 'lluvia', 'การเดินทาง': 'transporte',
  'รถบัส': 'bus', 'แท็กซี่': 'taxi', 'ราคา': 'precio', 'หุบเขา': 'valle',
  'น้ำตก': 'cascada', 'ขี่ม้า': 'cabalgata', 'ปลอดภัย': 'seguridad', 'ไวไฟ': 'wifi',
  'ช้อปปิ้ง': 'comprar', 'หัตถกรรม': 'artesanias',
  // Vietnamita (normalizado sin acentos)
  'ca phe': 'cafe', 'do an': 'comida', 'an': 'comer', 'nha hang': 'restaurante',
  'khach san': 'hotel', 'luu tru': 'hospedaje', 'ngu': 'dormir', 'thoi tiet': 'clima',
  'mua': 'lluvia', 'giao thong': 'transporte', 'xe bus': 'bus', 'gia': 'precio',
  'thung lung': 'valle', 'thac': 'cascada', 'cuoi ngua': 'cabalgata',
  'an toan': 'seguridad', 'mua sam': 'comprar', 'thu cong': 'artesanias',
  // Indonesio
  'kopi': 'cafe', 'kafe': 'cafe', 'makanan': 'comida', 'makan': 'comer',
  'restoran': 'restaurante', 'penginapan': 'hospedaje', 'tidur': 'dormir',
  'tur': 'tour', 'cuaca': 'clima', 'hujan': 'lluvia', 'transportasi': 'transporte',
  'taksi': 'taxi', 'harga': 'precio', 'lembah': 'valle',
  'air terjun': 'cascada', 'berkuda': 'cabalgata', 'aman': 'seguridad',
  'belanja': 'comprar', 'kerajinan': 'artesanias',
  // Malayo
  'lawatan': 'tour', 'pengangkutan': 'transporte', 'bas': 'bus', 'teksi': 'taxi',
  'menunggang kuda': 'cabalgata', 'selamat': 'seguridad', 'beli belah': 'comprar',
  'kraf': 'artesanias',
  sleep: 'dormir',
  sleeping: 'dormir',
  stay: 'hospedaje',
  lodging: 'hospedaje',
  accommodation: 'hospedaje',
  hotel: 'hotel',
  hostel: 'hostal',
  room: 'habitacion',
  eat: 'comer',
  eating: 'comer',
  food: 'comida',
  restaurant: 'restaurante',
  restaurants: 'restaurante',
  lunch: 'almuerzo',
  dinner: 'cena',
  breakfast: 'desayuno',
  coffee: 'cafe',
  cafe: 'cafe',
  trout: 'trucha',
  drink: 'bebida',
  beer: 'cerveza',
  weather: 'clima',
  rain: 'lluvia',
  raining: 'lloviendo',
  temperature: 'temperatura',
  forecast: 'pronostico',
  cold: 'frio',
  hot: 'calor',
  hike: 'caminata',
  hiking: 'caminata',
  walk: 'caminata',
  trail: 'sendero',
  tour: 'tour',
  tours: 'tours',
  guide: 'guia',
  valley: 'valle',
  palms: 'palmas',
  wax: 'cera',
  transport: 'transporte',
  bus: 'bus',
  taxi: 'taxi',
  drive: 'conducir',
  driving: 'conducir',
  road: 'carretera',
  airport: 'aeropuerto',
  money: 'dinero',
  price: 'precio',
  cost: 'precio',
  cheap: 'precio',
  expensive: 'precio',
  atm: 'cajero',
  cash: 'efectivo',
  card: 'tarjeta',
  cards: 'tarjeta',
  credit: 'credito',
  payment: 'pago',
  pay: 'pagar',
  parking: 'parqueadero',
  park: 'parqueadero',
  car: 'carro',
  pet: 'mascota',
  pets: 'mascotas',
  dog: 'perro',
  dogs: 'perros',
  kids: 'ninos',
  children: 'ninos',
  child: 'nino',
  family: 'familia',
  families: 'familias',
  romantic: 'romantico',
  couple: 'pareja',
  honeymoon: 'luna de miel',
  english: 'ingles',
  language: 'idioma',
  languages: 'idiomas',
  speak: 'hablar',
  spoken: 'hablar',
  souvenir: 'artesanias',
  souvenirs: 'artesanias',
  craft: 'artesanias',
  crafts: 'artesanias',
  shop: 'comprar',
  shopping: 'comprar',
  buy: 'comprar',
  camping: 'acampar',
  camp: 'acampar',
  tent: 'carpa',
  emergency: 'emergencia',
  doctor: 'medico',
  hospital: 'hospital',
  police: 'policia',
  help: 'ayuda',
  safe: 'seguro',
  safety: 'seguridad',
  night: 'noche',
  festival: 'festival',
  party: 'fiesta',
  history: 'historia',
  museum: 'museo',
  schlafen: 'dormir',
  ubernachten: 'dormir',
  unterkunft: 'hospedaje',
  zimmer: 'habitacion',
  essen: 'comer',
  fruhstuck: 'desayuno',
  mittagessen: 'almuerzo',
  abendessen: 'cena',
  kaffee: 'cafe',
  forelle: 'trucha',
  bier: 'cerveza',
  wetter: 'clima',
  regen: 'lluvia',
  regnet: 'lloviendo',
  temperatur: 'temperatura',
  kalt: 'frio',
  heiss: 'calor',
  wanderung: 'caminata',
  wandern: 'caminata',
  weg: 'sendero',
  fuhrer: 'guia',
  tal: 'valle',
  palmen: 'palmas',
  flughafen: 'aeropuerto',
  strasse: 'carretera',
  geld: 'dinero',
  bankomat: 'cajero',
  bargeld: 'efectivo',
  karte: 'tarjeta',
  karten: 'tarjeta',
  bezahlen: 'pagar',
  parkplatz: 'parqueadero',
  auto: 'carro',
  hund: 'perro',
  hunde: 'perros',
  haustier: 'mascota',
  kinder: 'ninos',
  familie: 'familia',
  romantisch: 'romantico',
  paar: 'pareja',
  englisch: 'ingles',
  sprache: 'idioma',
  sprechen: 'hablar',
  handwerk: 'artesanias',
  kaufen: 'comprar',
  zelt: 'carpa',
  notfall: 'emergencia',
  arzt: 'medico',
  krankenhaus: 'hospital',
  polizei: 'policia',
  hilfe: 'ayuda',
  sicher: 'seguro',
  sicherheit: 'seguridad',
  nacht: 'noche',
  fest: 'festival',
  geschichte: 'historia',
  dormir: 'dormir',
  loger: 'dormir',
  hebergement: 'hospedaje',
  chambre: 'habitacion',
  auberge: 'hostal',
  manger: 'comer',
  nourriture: 'comida',
  dejeuner: 'almuerzo',
  diner: 'cena',
  petitdejeuner: 'desayuno',
  truite: 'trucha',
  biere: 'cerveza',
  meteo: 'clima',
  pluie: 'lluvia',
  pleut: 'lloviendo',
  froid: 'frio',
  chaud: 'calor',
  randonnee: 'caminata',
  marcher: 'caminata',
  sentier: 'sendero',
  visite: 'tour',
  vallee: 'valle',
  palmiers: 'palmas',
  aeroport: 'aeropuerto',
  route: 'carretera',
  argent: 'dinero',
  distributeur: 'cajero',
  especes: 'efectivo',
  carte: 'tarjeta',
  cartes: 'tarjeta',
  payer: 'pagar',
  voiture: 'carro',
  chien: 'perro',
  chiens: 'perros',
  animal: 'mascota',
  enfants: 'ninos',
  enfant: 'nino',
  romantique: 'romantico',
  anglais: 'ingles',
  langue: 'idioma',
  parler: 'hablar',
  artisanat: 'artesanias',
  acheter: 'comprar',
  tente: 'carpa',
  urgence: 'emergencia',
  medecin: 'medico',
  hopital: 'hospital',
  aide: 'ayuda',
  sur: 'seguro',
  securite: 'seguridad',
  nuit: 'noche',
  fete: 'festival',
  histoire: 'historia',
  musee: 'museo',
  ficar: 'dormir',
  hospedagem: 'hospedaje',
  quarto: 'habitacion',
  comida: 'comida',
  restaurante: 'restaurante',
  almoco: 'almuerzo',
  jantar: 'cena',
  truta: 'trucha',
  cerveja: 'cerveza',
  tempo: 'clima',
  chuva: 'lluvia',
  chovendo: 'lloviendo',
  temperatura: 'temperatura',
  frio: 'frio',
  calor: 'calor',
  trilha: 'caminata',
  caminhada: 'caminata',
  passeio: 'tour',
  guia: 'guia',
  vale: 'valle',
  palmeiras: 'palmas',
  transporte: 'transporte',
  onibus: 'bus',
  aeroporto: 'aeropuerto',
  estrada: 'carretera',
  dinheiro: 'dinero',
  caixa: 'cajero',
  cartao: 'tarjeta',
  pagar: 'pagar',
  estacionamento: 'parqueadero',
  carro: 'carro',
  cachorro: 'perro',
  animais: 'mascotas',
  criancas: 'ninos',
  romantico: 'romantico',
  casal: 'pareja',
  ingles: 'ingles',
  idioma: 'idioma',
  falar: 'hablar',
  artesanato: 'artesanias',
  lembranca: 'artesanias',
  comprar: 'comprar',
  acampar: 'acampar',
  barraca: 'carpa',
  emergencia: 'emergencia',
  medico: 'medico',
  policia: 'policia',
  ajuda: 'ayuda',
  seguro: 'seguro',
  seguranca: 'seguridad',
  noite: 'noche',
  festa: 'festival',
  historia: 'historia',
  museu: 'museo',
  dormire: 'dormir',
  alloggiare: 'dormir',
  alloggio: 'hospedaje',
  camera: 'habitacion',
  mangiare: 'comer',
  cibo: 'comida',
  ristorante: 'restaurante',
  pranzo: 'almuerzo',
  cena: 'cena',
  colazione: 'desayuno',
  caffe: 'cafe',
  trota: 'trucha',
  birra: 'cerveza',
  pioggia: 'lluvia',
  piove: 'lloviendo',
  freddo: 'frio',
  caldo: 'calor',
  escursione: 'caminata',
  camminata: 'caminata',
  giro: 'tour',
  guida: 'guia',
  valle: 'valle',
  palme: 'palmas',
  trasporto: 'transporte',
  autobus: 'bus',
  strada: 'carretera',
  soldi: 'dinero',
  bancomat: 'cajero',
  contanti: 'efectivo',
  carta: 'tarjeta',
  pagare: 'pagar',
  parcheggio: 'parqueadero',
  cane: 'perro',
  cani: 'perros',
  animale: 'mascota',
  bambini: 'ninos',
  bambino: 'nino',
  famiglia: 'familia',
  coppia: 'pareja',
  inglese: 'ingles',
  lingua: 'idioma',
  parlare: 'hablar',
  artigianato: 'artesanias',
  ricordo: 'artesanias',
  comprare: 'comprar',
  campeggio: 'acampar',
  tenda: 'carpa',
  emergenza: 'emergencia',
  ospedale: 'hospital',
  aiuto: 'ayuda',
  sicuro: 'seguro',
  sicurezza: 'seguridad',
  notte: 'noche',
  storia: 'historia',
  museo: 'museo'
}

const SPANISH_SYNONYMS: Record<string, string[]> = {
  reservar: ['reservar', 'tour'],
  reserva: ['reserva', 'tour'],
  reservas: ['reserva', 'tour'],
  reservaciones: ['reserva', 'tour'],
  tour: ['tour', 'tours'],
  tours: ['tours', 'tour'],
  comer: ['comer', 'restaurante'],
  comida: ['comida', 'restaurante'],
  restaurante: ['restaurante', 'comida'],
  almorzar: ['almuerzo', 'restaurante'],
  cenar: ['cena', 'restaurante'],
  desayunar: ['desayuno', 'restaurante'],
  dormir: ['dormir', 'hospedaje', 'hotel'],
  hospedaje: ['hospedaje', 'hotel'],
  alojamiento: ['hospedaje', 'hotel'],
  hotel: ['hotel', 'hospedaje'],
  hostal: ['hostal', 'hospedaje'],
  clima: ['clima', 'tiempo'],
  tiempo: ['clima', 'tiempo'],
  lluvia: ['lluvia', 'clima'],
  llover: ['lluvia', 'clima'],
  lloviendo: ['lluvia', 'clima'],
  transporte: ['transporte', 'llegar'],
  llegar: ['llegar', 'transporte'],
  moverse: ['transporte', 'moverse'],
  bus: ['bus', 'transporte'],
  taxi: ['taxi', 'transporte'],
  precio: ['precio', 'cuanto', 'cuesta'],
  cuesta: ['precio', 'cuanto', 'cuesta'],
  cuanto: ['precio', 'cuanto'],
  valor: ['precio', 'valor'],
  tarifa: ['precio', 'tarifa'],
  artesania: ['artesanias', 'comprar'],
  artesanias: ['artesanias', 'comprar'],
  souvenir: ['artesanias', 'comprar'],
  recuerdo: ['artesanias', 'comprar'],
  recuerdos: ['artesanias', 'comprar'],
  compro: ['comprar', 'artesanias'],
  compra: ['comprar', 'artesanias'],
  pagar: ['pago', 'tarjeta'],
  pago: ['pago', 'tarjeta'],
  tarjeta: ['tarjeta', 'pago'],
  efectivo: ['efectivo', 'dinero'],
  dinero: ['dinero', 'cajero'],
  estacionamiento: ['estacionamiento', 'parqueadero'],
  parqueadero: ['parqueadero', 'estacionamiento'],
  parking: ['parqueadero', 'estacionamiento'],
  perro: ['perro', 'mascota'],
  mascota: ['mascota', 'perro'],
  mascotas: ['mascotas', 'perro'],
  acampar: ['acampar', 'camping'],
  camping: ['camping', 'acampar'],
  carpa: ['carpa', 'acampar'],
  ingles: ['ingles', 'idioma'],
  idioma: ['idioma', 'ingles'],
  idiomas: ['idiomas', 'ingles'],
  ninos: ['ninos', 'familia'],
  ninas: ['ninos', 'familia'],
  familia: ['familia', 'ninos'],
  hijos: ['ninos', 'familia'],
  romantico: ['romantico', 'pareja'],
  romantica: ['romantico', 'pareja'],
  pareja: ['pareja', 'romantico'],
  mirador: ['mirador', 'alto de la cruz'],
  miradores: ['mirador', 'alto de la cruz'],
  vista: ['mirador', 'vista'],
  seguro: ['seguro', 'seguridad'],
  seguridad: ['seguridad', 'seguro'],
  noche: ['noche', 'seguridad'],
  emergencia: ['emergencia', 'urgencia'],
  urgencia: ['emergencia', 'urgencia'],
  medico: ['medico', 'hospital'],
  hospital: ['hospital', 'medico'],
  cafe: ['cafe', 'cafetero'],
  cafetero: ['cafe', 'cafetero'],
  cafeteria: ['cafe', 'cafeteria']
}

const INTENT_WORDS: Record<Exclude<KnowledgeIntent, null>, string[]> = {
  conectividad: ['wifi', 'internet', 'senal', 'celular', 'sim', 'conexion', 'roaming', 'cobertura', 'network', 'signal', 'netz', 'reseau', 'rede', 'rete'],
  reservar: ['reservar', 'reserva', 'booking', 'book', 'reservieren', 'reserver', 'prenotare', 'reservar'],
  comer: ['comer', 'comida', 'restaurante', 'almorzar', 'cenar', 'desayunar', 'eat', 'food', 'restaurant', 'essen', 'manger', 'mangiare'],
  dormir: ['dormir', 'hospedaje', 'alojamiento', 'hotel', 'hostal', 'sleep', 'stay', 'lodging', 'schlafen', 'ubernachten', 'loger', 'dormire'],
  clima: ['clima', 'tiempo', 'lluvia', 'llover', 'lloviendo', 'weather', 'rain', 'wetter', 'regen', 'meteo', 'pluie', 'tempo', 'chuva', 'pioggia'],
  transporte: ['transporte', 'llegar', 'moverse', 'bus', 'taxi', 'willys', 'transport', 'get around', 'flughafen', 'aeroport', 'aeroporto'],
  precio: ['precio', 'cuanto', 'cuesta', 'tarifa', 'valor', 'how much', 'cost', 'price', 'kostet', 'coute', 'custa', 'costa'],
  pago: ['pago', 'pagar', 'tarjeta', 'efectivo', 'dinero', 'cajero', 'card', 'cash', 'atm', 'payment', 'karte', 'bargeld', 'carte', 'cartao', 'carta'],
  mascota: ['mascota', 'perro', 'gato', 'pet', 'dog', 'hund', 'haustier', 'chien', 'cachorro', 'cane'],
  acampar: ['acampar', 'camping', 'campamento', 'carpa', 'camp', 'tent', 'zelt', 'tente', 'barraca', 'tenda'],
  familia: ['ninos', 'ninas', 'familia', 'hijos', 'kids', 'children', 'family', 'kinder', 'enfants', 'criancas', 'bambini'],
  romantico: ['romantico', 'romantica', 'pareja', 'luna de miel', 'aniversario', 'romantic', 'couple', 'honeymoon', 'romantisch', 'romantique', 'casal', 'coppia'],
  idioma: ['ingles', 'idioma', 'idiomas', 'english', 'language', 'englisch', 'anglais', 'inglese'],
  mirador: ['mirador', 'miradores', 'vista', 'paisaje', 'viewpoint', 'lookout', 'view', 'aussicht', 'belvedere', 'mirante'],
  seguridad: ['seguro', 'seguridad', 'peligroso', 'robar', 'safe', 'safety', 'sicher', 'securite', 'seguranca', 'sicurezza'],
  artesania: ['artesania', 'artesanias', 'souvenir', 'recuerdo', 'craft', 'handwerk', 'artisanat', 'artesanato', 'artigianato'],
  comprar: ['comprar', 'compra', 'tienda', 'buy', 'shop', 'kaufen', 'acheter', 'comprar', 'comprare']
}

export const INTENT_CATEGORIES: Record<Exclude<KnowledgeIntent, null>, string[]> = {
  reservar: ['experiencias', 'hospedaje'],
  comer: ['comida', 'gastronomia'],
  dormir: ['hospedaje'],
  clima: ['general', 'consejos'],
  transporte: ['transporte'],
  precio: ['consejos'],
  pago: ['consejos'],
  mascota: ['consejos'],
  acampar: ['turismo', 'hospedaje'],
  familia: ['experiencias', 'turismo'],
  romantico: ['experiencias'],
  idioma: ['experiencias'],
  mirador: ['turismo'],
  seguridad: ['consejos', 'emergencias'],
  artesania: ['artesanias'],
  comprar: ['artesanias'],
  conectividad: ['consejos']
}

export function detectKnowledgeIntent(query: string): KnowledgeIntent {
  const norm = expandQuery(query)
  if (!norm) return null
  const tokens = new Set(norm.split(' '))
  const padded = ` ${norm} `
  for (const intent of Object.keys(INTENT_WORDS) as Array<Exclude<KnowledgeIntent, null>>) {
    const found = INTENT_WORDS[intent].some(word => {
      const normalizedWord = normalizeText(word)
      if (!normalizedWord) return false
      if (normalizedWord.includes(' ')) return padded.includes(` ${normalizedWord} `)
      return tokens.has(normalizedWord)
    })
    if (found) return intent
  }
  return null
}

export function expandQuery(query: string): string {
  const norm = normalizeText(query)
  if (!norm) return ''
  const padded = ` ${norm} `
  const extras: string[] = []

  for (const [phrase, replacement] of PHRASE_MAP) {
    if (padded.includes(` ${phrase} `)) extras.push(replacement)
  }

  const CJK_OR_THAI = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\u0e00-\u0e7f]/
  for (const token of norm.split(' ')) {
    const mapped = WORD_MAP[token]
    if (mapped) extras.push(mapped)
    const synonyms = SPANISH_SYNONYMS[token]
    if (synonyms) extras.push(...synonyms)
    // Japonés, coreano, chino y tailandés suelen escribirse sin espacios:
    // buscamos palabras conocidas dentro del token.
    if (CJK_OR_THAI.test(token)) {
      for (const [key, value] of Object.entries(WORD_MAP)) {
        if (key.length >= 2 && CJK_OR_THAI.test(key) && token.includes(key)) {
          extras.push(value)
        }
      }
    }
  }

  return normalizeText(`${norm} ${extras.join(' ')}`)
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  if (Math.abs(a.length - b.length) > 2) return 3
  const previous = new Array(b.length + 1)
  for (let j = 0; j <= b.length; j++) previous[j] = j
  for (let i = 1; i <= a.length; i++) {
    let last = previous[0]
    previous[0] = i
    for (let j = 1; j <= b.length; j++) {
      const temp = previous[j]
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        last + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
      last = temp
    }
  }
  return previous[b.length]
}

export function fuzzyWordMatch(word: string, candidates: Iterable<string>): boolean {
  if (word.length < 5) return false
  const tolerance = word.length >= 8 ? 2 : 1
  for (const candidate of candidates) {
    if (Math.abs(candidate.length - word.length) > tolerance) continue
    if (levenshtein(word, candidate) <= tolerance) return true
  }
  return false
}

const GREETINGS = [
  'مرحبا', 'أهلا', 'السلام عليكم', 'こんにちは', '안녕하세요', 'สวัสดี', 'xin chao', 'halo', 'hai',
  'hola', 'hi', 'hello', 'hey', 'hallo', 'bonjour', 'salut', 'ciao', 'ola', 'oi',
  'buenos dias', 'buenas tardes', 'buenas noches', 'buenas', 'good morning',
  'good afternoon', 'good evening', 'guten morgen', 'guten tag', 'bonsoir',
  'bom dia', 'boa tarde', 'buongiorno', 'buonasera', 'que tal', 'que hubo', 'quiubo'
]

const THANKS = [
  'شكرا', 'ありがとう', '감사합니다', 'ขอบคุณ', 'cam on', 'terima kasih',
  'gracias', 'muchas gracias', 'mil gracias', 'thanks', 'thank you', 'thx',
  'danke', 'vielen dank', 'merci', 'merci beaucoup', 'obrigado', 'obrigada',
  'valeu', 'grazie', 'mille grazie'
]

const GOODBYES = [
  'مع السلامة', 'さようなら', '안녕히 가세요', 'ลาก่อน', 'tam biet', 'selamat tinggal',
  'adios', 'chao', 'chau', 'bye', 'goodbye', 'see you', 'hasta luego',
  'nos vemos', 'hasta pronto', 'tschuss', 'auf wiedersehen', 'au revoir',
  'a bientot', 'adeus', 'ate logo', 'arrivederci', 'ciao ciao'
]

const HOW_ARE_YOU = [
  'كيف حالك', 'お元気ですか', '어떻게 지내세요', 'สบายดีไหม', 'ban khoe khong', 'apa kabar',
  'como estas', 'como esta', 'como te va', 'how are you', 'how is it going',
  'wie geht es dir', 'wie gehts', 'comment vas tu', 'comment allez vous',
  'como vai', 'como voce esta', 'come stai', 'come va'
]

const IDENTITY = [
  'من أنت', 'あなたは誰', '누구세요', 'คุณคือใคร', 'ban la ai', 'siapa kamu',
  'quien eres', 'quien es usted', 'como te llamas', 'que eres', 'que sabes',
  'que sabes hacer', 'hablame', 'hablame de ti', 'who are you', 'what is your name',
  'what can you do', 'wer bist du', 'qui es tu', 'que sais tu faire', 'chi sei',
  'quem e voce', 'o que voce faz', 'que puedes hacer', 'en que me puedes ayudar'
]

const HELP = [
  'مساعدة', '助けて', '도와줘', 'ช่วยด้วย', 'giup', 'bantuan',
  'ayuda', 'help', 'hilfe', 'aide', 'ajuda', 'aiuto', 'necesito ayuda',
  'i need help', 'informacion', 'info'
]

const COMPLIMENTS = [
  'ممتاز', '素晴らしい', '훌륭해요', 'เยี่ยม', 'tuyet', 'bagus',
  'eres genial', 'muy bien', 'excelente', 'great', 'awesome', 'perfect',
  'genial', 'super', 'muy util', 'very helpful', 'danke schon', 'bravo'
]

const APOLOGIES = [
  'آسف', 'ごめんなさい', '죄송합니다', 'ขอโทษ', 'xin loi', 'maaf',
  'perdon', 'disculpa', 'lo siento', 'sorry', 'entschuldigung', 'pardon',
  'desculpe', 'scusa'
]

const AFFIRM = ['si', 'yes', 'ja', 'oui', 'sim', 'ok', 'okay', 'claro', 'dale', 'listo', 'va bene', 'نعم', 'はい', '네', 'ใช่', 'dung', 'ya']
const DENY = ['no', 'nope', 'nein', 'non', 'nao', 'no gracias', 'no thanks', 'لا', 'いいえ', '아니요', 'ไม่', 'khong', 'tidak']

const FILLERS = new Set([
  'por', 'favor', 'please', 'bitte', 'ok', 'okay', 'bueno', 'buenas', 'amigo',
  'hermano', 'don', 'chucho', 'senor', 'senora', 'muy', 'muchas', 'mucho',
  'very', 'so', 'a', 'lot', 'the', 'you', 'tu', 'usted', 'pues', 'entonces',
  'y', 'and', 'und', 'et', 'e', 'ma', 'mon', 'mein', 'friend', 'de', 'la',
  'el', 'los', 'las', 'un', 'una', 'del', 'al', 'mi', 'my', 'me', 'te', 'le',
  'les', 'nos', 'con', 'sin', 'para', 'que', 'there', 'info', 'informacion',
  'necesito', 'need', 'aqui', 'here', 'ahora', 'now', 'solo', 'just'
])

function stripPhrases(text: string, phrases: string[]): string {
  let rest = ` ${text} `
  for (const phrase of phrases) {
    rest = rest.split(` ${phrase} `).join(' ')
  }
  return rest.replace(/\s+/g, ' ').trim()
}

function isPure(text: string, phrases: string[]): boolean {
  const rest = stripPhrases(text, phrases)
  if (!rest) return true
  return rest.split(' ').every(token => FILLERS.has(token))
}

function containsPhrase(text: string, phrases: string[]): boolean {
  const padded = ` ${text} `
  return phrases.some(phrase => padded.includes(` ${phrase} `))
}

export function detectSmallTalk(query: string): SmallTalkIntent {
  const norm = normalizeText(query)
  if (!norm) return null
  const words = norm.split(' ')

  if (isPure(norm, HOW_ARE_YOU) || (containsPhrase(norm, HOW_ARE_YOU) && words.length <= 6)) {
    return 'howAreYou'
  }
  if (isPure(norm, THANKS)) return 'thanks'
  if (isPure(norm, GOODBYES)) return 'goodbye'
  if (isPure(norm, APOLOGIES)) return 'apology'
  if (isPure(norm, COMPLIMENTS)) return 'compliment'
  if (isPure(norm, GREETINGS)) return 'greeting'
  if (containsPhrase(norm, IDENTITY) && words.length <= 8) return 'identity'
  if (containsPhrase(norm, HELP) && words.length <= 5) return 'help'
  if (isPure(norm, AFFIRM) && words.length <= 2) return 'affirm'
  if (isPure(norm, DENY) && words.length <= 2) return 'deny'
  return null
}

type SmallTalkTable = Record<Exclude<SmallTalkIntent, null>, Record<BaseLanguage, string>>

const SMALL_TALK: SmallTalkTable = {
  greeting: {
    es: '¡Hola, hermano! Soy Don Chucho, su guía de Salento. Pregúnteme por comida, café, hospedaje, tours, clima o cómo moverse. ¿Qué necesita?',
    en: 'Hi, friend! I am Don Chucho, your Salento guide. Ask me about food, coffee, lodging, tours, weather or getting around. What do you need?',
    de: 'Hallo, Freund! Ich bin Don Chucho, Ihr Salento-Führer. Fragen Sie mich nach Essen, Kaffee, Unterkunft, Touren, Wetter oder Fortbewegung. Was brauchen Sie?',
    fr: 'Bonjour, ami ! Je suis Don Chucho, votre guide à Salento. Demandez-moi pour la nourriture, le café, l\'hébergement, les visites, la météo ou les déplacements. De quoi avez-vous besoin ?',
    pt: 'Olá, amigo! Sou Don Chucho, seu guia em Salento. Pergunte sobre comida, café, hospedagem, tours, clima ou como se locomover. Do que você precisa?',
    it: 'Ciao, amico! Sono Don Chucho, la tua guida a Salento. Chiedimi di cibo, caffè, alloggio, tour, meteo o come muoverti. Di cosa hai bisogno?'
  },
  thanks: {
    es: '¡Con gusto, hermano! Aquí estoy para lo que necesite.',
    en: 'You are welcome, friend! I am here whenever you need me.',
    de: 'Gern geschehen, Freund! Ich bin da, wenn Sie mich brauchen.',
    fr: 'Avec plaisir, ami ! Je suis là quand vous avez besoin.',
    pt: 'De nada, amigo! Estou aqui quando precisar.',
    it: 'Di niente, amico! Sono qui quando hai bisogno.'
  },
  goodbye: {
    es: '¡Que tenga un viaje lindo por Salento! Aquí estaré cuando quiera.',
    en: 'Have a wonderful trip in Salento! I will be here whenever you need me.',
    de: 'Eine wunderbare Reise in Salento! Ich bin hier, wenn Sie mich brauchen.',
    fr: 'Je vous souhaite un beau voyage à Salento ! Je serai là si besoin.',
    pt: 'Tenha uma ótima viagem por Salento! Estarei aqui quando precisar.',
    it: 'Buon viaggio a Salento! Sarò qui quando hai bisogno.'
  },
  howAreYou: {
    es: '¡Muy bien, gracias por preguntar! Listo para mostrarle Salento. ¿Qué le gustaría saber?',
    en: 'Very well, thanks for asking! Ready to show you Salento. What would you like to know?',
    de: 'Sehr gut, danke der Nachfrage! Bereit, Ihnen Salento zu zeigen. Was möchten Sie wissen?',
    fr: 'Très bien, merci de demander ! Prêt à vous faire découvrir Salento. Que voulez-vous savoir ?',
    pt: 'Muito bem, obrigado por perguntar! Pronto para mostrar Salento. O que você quer saber?',
    it: 'Molto bene, grazie per avermelo chiesto! Pronto a mostrarti Salento. Cosa vuoi sapere?'
  },
  identity: {
    es: 'Soy Don Chucho, el guía local de Salento a la Mano. Conozco comida, café, tours, hospedaje, transporte y consejos prácticos. ¿En qué le ayudo?',
    en: 'I am Don Chucho, the local guide of Salento a la Mano. I know food, coffee, tours, lodging, transport and practical tips. How can I help?',
    de: 'Ich bin Don Chucho, der lokale Führer von Salento a la Mano. Ich kenne Essen, Kaffee, Touren, Unterkunft, Transport und praktische Tipps. Wie kann ich helfen?',
    fr: 'Je suis Don Chucho, le guide local de Salento a la Mano. Je connais la nourriture, le café, les visites, l\'hébergement, le transport et les conseils pratiques. Comment puis-je aider ?',
    pt: 'Sou Don Chucho, o guia local do Salento a la Mano. Conheço comida, café, tours, hospedagem, transporte e dicas práticas. Como posso ajudar?',
    it: 'Sono Don Chucho, la guida locale di Salento a la Mano. Conosco cibo, caffè, tour, alloggio, trasporti e consigli pratici. Come posso aiutare?'
  },
  help: {
    es: 'Puedo ayudarle con comida típica, café, tours, hospedaje, transporte, clima, historia, artesanías, pagos y consejos de seguridad. ¿Qué necesita?',
    en: 'I can help with local food, coffee, tours, lodging, transport, weather, history, crafts, payments and safety tips. What do you need?',
    de: 'Ich helfe bei lokalem Essen, Kaffee, Touren, Unterkunft, Transport, Wetter, Geschichte, Handwerk, Zahlung und Sicherheitstipps. Was brauchen Sie?',
    fr: 'Je peux aider pour la nourriture locale, le café, les visites, l\'hébergement, le transport, la météo, l\'histoire, l\'artisanat, les paiements et la sécurité. De quoi avez-vous besoin ?',
    pt: 'Posso ajudar com comida típica, café, tours, hospedagem, transporte, clima, história, artesanato, pagamentos e dicas de segurança. Do que você precisa?',
    it: 'Posso aiutare con cibo locale, caffè, tour, alloggio, trasporti, meteo, storia, artigianato, pagamenti e consigli di sicurezza. Di cosa hai bisogno?'
  },
  compliment: {
    es: '¡Gracias, hermano! Me alegra servirle. ¿Seguimos con algo más de Salento?',
    en: 'Thank you, friend! Glad to help. Shall we continue with something else about Salento?',
    de: 'Danke, Freund! Freut mich zu helfen. Machen wir mit etwas anderem über Salento weiter?',
    fr: 'Merci, ami ! Ravi de vous aider. On continue avec autre chose sur Salento ?',
    pt: 'Obrigado, amigo! Fico feliz em ajudar. Continuamos com algo mais sobre Salento?',
    it: 'Grazie, amico! Felice di aiutarti. Continuiamo con qualcos\'altro su Salento?'
  },
  apology: {
    es: 'No se preocupe. Estoy aquí para ayudarle. ¿Qué necesita?',
    en: 'No worries. I am here to help. What do you need?',
    de: 'Kein Problem. Ich bin hier, um zu helfen. Was brauchen Sie?',
    fr: 'Pas de souci. Je suis là pour aider. De quoi avez-vous besoin ?',
    pt: 'Sem problema. Estou aqui para ajudar. Do que você precisa?',
    it: 'Nessun problema. Sono qui per aiutarti. Di cosa hai bisogno?'
  },
  affirm: {
    es: '¡Perfecto! Dígame qué más quiere saber de Salento.',
    en: 'Perfect! Tell me what else you want to know about Salento.',
    de: 'Perfekt! Sagen Sie mir, was Sie noch über Salento wissen möchten.',
    fr: 'Parfait ! Dites-moi ce que vous voulez savoir d\'autre sur Salento.',
    pt: 'Perfeito! Me diga o que mais você quer saber sobre Salento.',
    it: 'Perfetto! Dimmi cos\'altro vuoi sapere su Salento.'
  },
  deny: {
    es: 'Entendido. Si cambia de idea, aquí estaré. ¿Qué más le gustaría saber?',
    en: 'Understood. If you change your mind, I will be here. What else would you like to know?',
    de: 'Verstanden. Wenn Sie Ihre Meinung ändern, bin ich hier. Was möchten Sie noch wissen?',
    fr: 'Compris. Si vous changez d\'avis, je serai là. Que voulez-vous savoir d\'autre ?',
    pt: 'Entendido. Se mudar de ideia, estarei aqui. O que mais você gostaria de saber?',
    it: 'Capito. Se cambi idea, sarò qui. Cos\'altro vorresti sapere?'
  }
}

export function smallTalkReply(intent: Exclude<SmallTalkIntent, null>, language: Language): string {
  return SMALL_TALK_OVERRIDES[language]?.[intent] || SMALL_TALK[intent][resolveBaseLanguage(language)]
}

type SuggestionTable = Record<string, Record<BaseLanguage, string[]>>

const SUGGESTIONS: SuggestionTable = {
  cafe: {
    es: ['¿Dónde tomar el mejor café?', '¿Hay tours cafeteros?', '¿Puedo comprar café para llevar?'],
    en: ['Where to get the best coffee?', 'Coffee farm tours?', 'Can I buy coffee to go?'],
    de: ['Wo gibt es den besten Kaffee?', 'Kaffeetouren?', 'Kann ich Kaffee kaufen?'],
    fr: ['Où boire le meilleur café ?', 'Visites de caféiers ?', 'Acheter du café ?'],
    pt: ['Onde tomar o melhor café?', 'Tours de café?', 'Posso comprar café?'],
    it: ['Dove bere il miglior caffè?', 'Tour del caffè?', 'Posso comprare caffè?']
  },
  comida: {
    es: ['¿Dónde comer trucha?', '¿Opciones vegetarianas?', '¿Comida típica cerca?'],
    en: ['Where to eat trout?', 'Vegetarian options?', 'Local food nearby?'],
    de: ['Wo gibt es Forelle?', 'Vegetarische Optionen?', 'Lokales Essen in der Nähe?'],
    fr: ['Où manger de la truite ?', 'Options végétariennes ?', 'Plats locaux près d\'ici ?'],
    pt: ['Onde comer truta?', 'Opções vegetarianas?', 'Comida típica perto?'],
    it: ['Dove mangiare la trota?', 'Opzioni vegetariane?', 'Cibo locale qui vicino?']
  },
  gastronomia: {
    es: ['¿Dónde comer trucha?', '¿Opciones vegetarianas?', '¿Comida típica cerca?'],
    en: ['Where to eat trout?', 'Vegetarian options?', 'Local food nearby?'],
    de: ['Wo gibt es Forelle?', 'Vegetarische Optionen?', 'Lokales Essen in der Nähe?'],
    fr: ['Où manger de la truite ?', 'Options végétariennes ?', 'Plats locaux près d\'ici ?'],
    pt: ['Onde comer truta?', 'Opções vegetarianas?', 'Comida típica perto?'],
    it: ['Dove mangiare la trota?', 'Opzioni vegetariane?', 'Cibo locale qui vicino?']
  },
  artesanias: {
    es: ['¿Dónde comprar artesanías?', '¿Qué llevar de recuerdo?', '¿Precios de artesanías?'],
    en: ['Where to buy crafts?', 'What souvenir to take?', 'Craft prices?'],
    de: ['Wo Handwerk kaufen?', 'Welches Souvenir?', 'Preise für Handwerk?'],
    fr: ['Où acheter de l\'artisanat ?', 'Quel souvenir ?', 'Prix de l\'artisanat ?'],
    pt: ['Onde comprar artesanato?', 'Que lembrança levar?', 'Preços de artesanato?'],
    it: ['Dove comprare artigianato?', 'Quale ricordo?', 'Prezzi dell\'artigianato?']
  },
  hospedaje: {
    es: ['¿Dónde dormir barato?', '¿Hoteles con desayuno?', '¿Fincas cerca de Salento?'],
    en: ['Where to stay cheap?', 'Hotels with breakfast?', 'Farms near Salento?'],
    de: ['Günstig übernachten?', 'Hotels mit Frühstück?', 'Fincas bei Salento?'],
    fr: ['Où dormir pas cher ?', 'Hôtels avec petit-déjeuner ?', 'Fincas près de Salento ?'],
    pt: ['Onde dormir barato?', 'Hotéis com café da manhã?', 'Fincas perto de Salento?'],
    it: ['Dove dormire economico?', 'Hotel con colazione?', 'Fincas vicino a Salento?']
  },
  turismo: {
    es: ['¿Qué hacer en un día?', '¿Cómo llegar al Valle de Cocora?', '¿Mejor época para visitar?'],
    en: ['What to do in one day?', 'How to get to Cocora Valley?', 'Best time to visit?'],
    de: ['Was an einem Tag tun?', 'Wie zum Cocora-Tal?', 'Beste Reisezeit?'],
    fr: ['Que faire en un jour ?', 'Comment aller au Valle de Cocora ?', 'Meilleure période ?'],
    pt: ['O que fazer em um dia?', 'Como chegar ao Vale de Cocora?', 'Melhor época para visitar?'],
    it: ['Cosa fare in un giorno?', 'Come arrivare alla Valle de Cocora?', 'Periodo migliore per visitare?']
  },
  transporte: {
    es: ['¿Cómo llegar desde Armenia?', '¿Hay bus a Salento?', '¿Cuánto cuesta un taxi?'],
    en: ['How to get from Armenia?', 'Is there a bus to Salento?', 'Taxi fare?'],
    de: ['Wie von Armenia?', 'Gibt es einen Bus nach Salento?', 'Taxipreis?'],
    fr: ['Comment venir d\'Armenia ?', 'Bus pour Salento ?', 'Prix du taxi ?'],
    pt: ['Como chegar de Armenia?', 'Tem ônibus para Salento?', 'Preço do táxi?'],
    it: ['Come arrivare da Armenia?', 'C\'è un bus per Salento?', 'Prezzo del taxi?']
  },
  emergencias: {
    es: ['¿Número de emergencias?', '¿Hospital más cercano?', '¿Es seguro de noche?'],
    en: ['Emergency number?', 'Nearest hospital?', 'Is it safe at night?'],
    de: ['Notrufnummer?', 'Nächstes Krankenhaus?', 'Nachts sicher?'],
    fr: ['Numéro d\'urgence ?', 'Hôpital le plus proche ?', 'Sûr la nuit ?'],
    pt: ['Número de emergência?', 'Hospital mais próximo?', 'Seguro à noite?'],
    it: ['Numero di emergenza?', 'Ospedale più vicino?', 'Sicuro di notte?']
  },
  general: {
    es: ['¿Qué puedo hacer?', '¿Dónde comer?', '¿Cómo llego?'],
    en: ['What can I do?', 'Where to eat?', 'How do I get there?'],
    de: ['Was kann ich tun?', 'Wo essen?', 'Wie komme ich hin?'],
    fr: ['Que puis-je faire ?', 'Où manger ?', 'Comment y aller ?'],
    pt: ['O que posso fazer?', 'Onde comer?', 'Como chegar?'],
    it: ['Cosa posso fare?', 'Dove mangiare?', 'Come arrivo?']
  },
  defensivo: {
    es: ['¿Es seguro el Valle de Cocora?', '¿Qué llevar a la caminata?', '¿Hay señal de celular?'],
    en: ['Is Cocora Valley safe?', 'What to bring on the hike?', 'Cell signal?'],
    de: ['Ist das Cocora-Tal sicher?', 'Was mitnehmen?', 'Handysignal?'],
    fr: ['Le Valle de Cocora est-il sûr ?', 'Quoi emporter ?', 'Réseau mobile ?'],
    pt: ['O Vale de Cocora é seguro?', 'O que levar?', 'Tem sinal de celular?'],
    it: ['La Valle di Cocora è sicura?', 'Cosa portare?', 'C\'è segnale?']
  },
  historia: {
    es: ['¿Por qué Salento es patrimonio?', '¿Historia del café?', '¿Qué es el Yipao?'],
    en: ['Why is Salento a heritage town?', 'Coffee history?', 'What is Yipao?'],
    de: ['Warum ist Salento Kulturerbe?', 'Kaffeegeschichte?', 'Was ist Yipao?'],
    fr: ['Pourquoi Salento est patrimoine ?', 'Histoire du café ?', 'Qu\'est-ce que le Yipao ?'],
    pt: ['Por que Salento é patrimônio?', 'História do café?', 'O que é o Yipao?'],
    it: ['Perché Salento è patrimonio?', 'Storia del caffè?', 'Cos\'è lo Yipao?']
  },
  municipios: {
    es: ['¿Qué hacer en Filandia?', '¿Vale la pena Armenia?', '¿Pueblos cerca de Salento?'],
    en: ['What to do in Filandia?', 'Is Armenia worth it?', 'Towns near Salento?'],
    de: ['Was in Filandia tun?', 'Lohnt sich Armenia?', 'Orte bei Salento?'],
    fr: ['Que faire à Filandia ?', 'Armenia vaut le détour ?', 'Villages près de Salento ?'],
    pt: ['O que fazer em Filandia?', 'Vale a pena Armenia?', 'Povoados perto de Salento?'],
    it: ['Cosa fare a Filandia?', 'Vale la pena Armenia?', 'Paesi vicino a Salento?']
  },
  consejos: {
    es: ['¿Qué llevar?', '¿Cómo es el clima?', '¿Hay wifi?'],
    en: ['What to pack?', 'What is the weather like?', 'Is there wifi?'],
    de: ['Was einpacken?', 'Wie ist das Wetter?', 'Gibt es WLAN?'],
    fr: ['Quoi emporter ?', 'Quel temps fait-il ?', 'Y a-t-il du wifi ?'],
    pt: ['O que levar?', 'Como é o clima?', 'Tem wifi?'],
    it: ['Cosa portare?', 'Com\'è il tempo?', 'C\'è il wifi?']
  },
  experiencias: {
    es: ['¿Tours en inglés?', '¿Cabalgatas?', '¿Tour del café?'],
    en: ['Tours in English?', 'Horseback riding?', 'Coffee tour?'],
    de: ['Touren auf Englisch?', 'Ausritte?', 'Kaffeetour?'],
    fr: ['Visites en anglais ?', 'Balades à cheval ?', 'Visite du café ?'],
    pt: ['Tours em inglês?', 'Cavalgadas?', 'Tour do café?'],
    it: ['Tour in inglese?', 'Cavalcate?', 'Tour del caffè?']
  },
  festivales: {
    es: ['¿Cuándo es el Yipao?', '¿Hay fiestas este mes?', '¿Qué es el Yipao?'],
    en: ['When is Yipao?', 'Festivals this month?', 'What is Yipao?'],
    de: ['Wann ist Yipao?', 'Feste diesen Monat?', 'Was ist Yipao?'],
    fr: ['Quand est le Yipao ?', 'Fêtes ce mois-ci ?', 'Qu\'est-ce que le Yipao ?'],
    pt: ['Quando é o Yipao?', 'Festas este mês?', 'O que é o Yipao?'],
    it: ['Quando è lo Yipao?', 'Feste questo mese?', 'Cos\'è lo Yipao?']
  }
}

export function localizedSuggestions(category: string | null | undefined, language: Language): string[] {
  const override = GENERAL_SUGGESTIONS_OVERRIDES[language]
  if (override) return [...override]
  const base = resolveBaseLanguage(language)
  const table = category ? SUGGESTIONS[category] : undefined
  const fallback = SUGGESTIONS.general
  return [...((table || fallback)[base] || fallback.es)]
}

export function weatherSuggestions(language: Language): string[] {
  const override = WEATHER_SUGGESTIONS_OVERRIDES[language]
  if (override) return [...override]
  const base = resolveBaseLanguage(language)
  const table: Record<BaseLanguage, string[]> = {
    es: ['¿Qué ropa llevar?', '¿Mejor hora para el valle?', '¿Hay tours con lluvia?'],
    en: ['What clothes to bring?', 'Best time for the valley?', 'Tours when it rains?'],
    de: ['Welche Kleidung mitnehmen?', 'Beste Zeit für das Tal?', 'Touren bei Regen?'],
    fr: ['Quels vêtements emporter ?', 'Meilleure heure pour la vallée ?', 'Visites sous la pluie ?'],
    pt: ['Que roupas levar?', 'Melhor hora para o vale?', 'Tours com chuva?'],
    it: ['Quali vestiti portare?', 'Ora migliore per la valle?', 'Tour con la pioggia?']
  }
  return [...table[base]]
}

export function christmasSuggestions(language: Language): string[] {
  const base = resolveBaseLanguage(language)
  const table: Record<BaseLanguage, string[]> = {
    es: ['¿Qué hacer en Navidad?', 'Mercados navideños', 'Horarios del 24 y 25'],
    en: ['What to do at Christmas?', 'Christmas markets', 'Dec 24–25 opening hours'],
    de: ['Was tun an Weihnachten?', 'Weihnachtsmärkte', 'Öffnungszeiten 24.–25.12.'],
    fr: ['Que faire à Noël ?', 'Marchés de Noël', 'Horaires des 24 et 25'],
    pt: ['O que fazer no Natal?', 'Mercados de Natal', 'Horários de 24 e 25'],
    it: ['Cosa fare a Natale?', 'Mercatini di Natale', 'Orari del 24 e 25']
  }
  return [...table[base]]
}

export function fallbackReply(language: Language): string {
  const override = FALLBACK_OVERRIDES[language]
  if (override) return override
  const base = resolveBaseLanguage(language)
  const table: Record<BaseLanguage, string> = {
    es: 'No encontré una respuesta exacta para eso, hermano. Puedo ayudarle con comida típica, café, tours, hospedaje, transporte, clima, artesanías, pagos o consejos de viaje. ¿Me lo pregunta de otra forma o elige un tema?',
    en: 'I could not find an exact answer for that, friend. I can help with local food, coffee, tours, lodging, transport, weather, crafts, payments or travel tips. Could you rephrase it or pick a topic?',
    de: 'Dazu habe ich keine genaue Antwort gefunden, Freund. Ich helfe bei lokalem Essen, Kaffee, Touren, Unterkunft, Transport, Wetter, Handwerk, Zahlung oder Reisetipps. Können Sie es anders formulieren oder ein Thema wählen?',
    fr: 'Je n\'ai pas trouvé de réponse exacte, ami. Je peux aider pour la nourriture locale, le café, les visites, l\'hébergement, le transport, la météo, l\'artisanat, les paiements ou les conseils de voyage. Pouvez-vous reformuler ou choisir un thème ?',
    pt: 'Não encontrei uma resposta exata, amigo. Posso ajudar com comida típica, café, tours, hospedagem, transporte, clima, artesanato, pagamentos ou dicas de viagem. Pode reformular ou escolher um tema?',
    it: 'Non ho trovato una risposta esatta, amico. Posso aiutare con cibo locale, caffè, tour, alloggio, trasporti, meteo, artigianato, pagamenti o consigli di viaggio. Può riformulare o scegliere un tema?'
  }
  return table[base]
}
