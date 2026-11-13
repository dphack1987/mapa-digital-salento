// Base de conocimiento local para Don Chucho
// Contiene información específica sobre Salento y el Quindío

import type { Language } from '../types'
import {
  detectKnowledgeIntent,
  expandQuery,
  fallbackReply,
  fuzzyWordMatch,
  INTENT_CATEGORIES,
  localizedSuggestions,
  normalizeText
} from './donChuchoNlu'

export type KnowledgeCategory = 'cafe' | 'comida' | 'artesanias' | 'hospedaje' | 'turismo' | 'transporte' | 'emergencias' | 'general' | 'defensivo' | 'historia' | 'municipios' | 'gastronomia' | 'consejos' | 'experiencias' | 'festivales'

export interface KnowledgeItem {
  keywords: string[]
  category: KnowledgeCategory
  answer: {
    es: string
    en: string
    de: string
    fr: string
    pt: string
    it: string
    zh?: string  // chino simplificado opcional
    // Locales adicionales (opcionales): si no hay traducción se hace fallback a `es`
    ja?: string
    ko?: string
    th?: string
    vi?: string
    id?: string
    ms?: string
    'en-gb'?: string
    ar?: string
  }
  followUp?: string[]
  relatedPlaces?: number[]
  isDefensive?: boolean
  defensiveActions?: string[]
  urgency?: 'low' | 'medium' | 'high'
  sources?: string[]
}

const GENERIC_KEYWORDS = new Set([
  'precio', 'precios', 'cuanto', 'cuanta', 'cuantos', 'cuantas', 'cuesta',
  'cuestan', 'presupuesto', 'dinero', 'gastar', 'economico', 'barato',
  'tarifa', 'valor', 'coste', 'cost', 'price', 'how much', 'cuanto cuesta',
  'cuanto vale', 'cuanto sale'
])

const QUERY_STOPWORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
  'que', 'y', 'o', 'en', 'por', 'para', 'con', 'sin', 'mi', 'me', 'te', 'se',
  'su', 'sus', 'es', 'esta', 'estan', 'son', 'hay', 'como', 'the', 'a', 'an',
  'of', 'to', 'in', 'on', 'at', 'is', 'are', 'do', 'does', 'i', 'my', 'we',
  'you', 'it', 'for', 'with', 'what', 'where', 'how', 'much', 'can', 'want',
  'would', 'like', 'please', 'por', 'favor'
])

const knowledgeBase: KnowledgeItem[] = [
  // ═══════════════════════════════════════════════════════════
  // GASTRONOMÍA
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['trucha', 'trucha arcoiris', 'trucha al ajillo', 'trucha frita', 'trucha horno'],
    category: 'gastronomia',
    answer: {
      es: '¡La trucha arcoíris es el plato estrella de Salento! Te la preparan al ajillo, frita con patacones, al horno con hierbas, o en salsa de frutos rojos. La más famosa es en Restaurante La Casona. También en Brunch de Salento. ¿Cómo la prefieres?',
      en: 'Rainbow trout is the star dish of Salento! They prepare it garlic-style, fried with patacones, baked with herbs, or in red fruit sauce. The most famous is at Restaurante La Casona. Also at Brunch de Salento. How do you prefer it?',
      de: 'Die Regenbogenforelle ist das Star-Gericht von Salento! Sie wird in Knoblauchsoße, gebraten mit Patacones, im Ofen mit Kräutern oder in Fruchtsoße zubereitet. Das berühmteste gibt es bei Restaurante La Casona, auch bei Brunch de Salento. Wie möchten Sie sie haben?',
      fr: 'La truite arc-en-ciel est le plat phare de Salento ! On la prépare à l\'ail, frite avec des patacones, au four aux herbes, ou en sauce de fruits rouges. La plus connue est au Restaurante La Casona. Aussi au Brunch de Salento. Comment la préférez-vous ?',
      pt: 'A truta arco-íris é o prato estrela de Salento! Ela é preparada ao alho, frita com patacones, assada com ervas, ou em molho de frutas vermelhas. A mais famosa é no Restaurante La Casona. Também no Brunch de Salento. Como você prefere?',
      it: 'La trota iridea è il piatto stella di Salento! La preparano all\'aglio, fritta con patacones, al forno con erbe, o in salsa di frutti di bosco. La più famosa è al Restaurante La Casona. Anche al Brunch de Salento. Come la preferite?'
    },
    followUp: ['¿Al ajillo o frita?', '¿Con patacones?', '¿Dónde probarla mejor?'],
    relatedPlaces: [45, 21]
  },
  {
    keywords: ['sancocho', 'sancocho gallina', 'sopa', 'caldo'],
    category: 'gastronomia',
    answer: {
      es: 'El sancocho de gallina es el plato que abraza el alma. Gallina criolla, yuca, papa, plátano verde, mazorca y cilantro, servido con arroz, aguacate y ají. Perfecto para días fríos. Las fondas de la plaza lo preparan como en casa.',
      en: 'Hen sancocho is the dish that hugs the soul. Creole hen, yuca, potato, green plantain, corn and cilantro, served with rice, avocado and ají. Perfect for cold days. The square diners prepare it homemade style.',
      de: 'Der Sancocho de gallina ist das Gericht, das die Seele umarmt. Creole-Hähnchen, Yucca, Kartoffel, grüne Banane, Mais und Koriander, serviert mit Reis, Avocado und Ají. Perfekt für kalte Tage. Die Restaurants am Platz bereiten ihn wie zu Hause zu.',
      fr: 'Le sancocho de gallina est le plat qui réchauffe l\'âme. Poule créole, manioc, pomme de terre, banane verte, maïs et coriandre, servi avec du riz, de l\'avocat et de l\'ají. Parfait pour les jours froids. Les cantines de la place le préparent comme à la maison.',
      pt: 'O sancocho de galinha é o prato que abraça a alma. Galinha crioula, mandioca, batata, banana verde, milho e coentro, servido com arroz, abacate e ají. Perfeito para dias frios. As fondas da praia preparam como em casa.',
      it: 'Il sancocho di gallina è il piatto che abbraccia l\'anima. Gallina creola, manioca, patata, banana verde, mais e coriandolo, servito con riso, avocado e ají. Perfetto per i giorni freddi. I ristoranti della piazza lo preparano come a casa.'
    },
    followUp: ['¿Dónde probarlo?', '¿Con aguacate?', '¿Qué otra sopa hay?']
  },
  {
    keywords: ['arepa', 'arepa chócolo', 'arepa quindiana', 'chócolo'],
    category: 'gastronomia',
    answer: {
      es: '¡Las arepas de chócolo son un pecado delicioso! Maíz tierno molido a la parrilla con queso fresco, doradas por fuera y suaves por dentro. Perfectas para el desayuno con chocolate caliente. En la plaza las encuentras con mantequilla y arequipe.',
      en: 'Chócolo arepas are a delicious sin! Fresh ground corn grilled with fresh cheese, golden outside and soft inside. Perfect for breakfast with hot chocolate. At the square you find them with butter and arequipe.',
      de: 'Die Chócolo-Arepas sind eine köstliche Sünde! Frisch gemahlener Mais gegrillt mit frischem Käse, außen golden und innen weich. Perfekt zum Frühstück mit heißer Schokolade. Am Platz gibt es sie mit Butter und Arequipe.',
      fr: 'Les arepas de chócolo sont un péché délicieux ! Maïs frais broyé grillé avec du fromage frais, doré à l\'extérieur et tendre à l\'intérieur. Parfait pour le petit-déjeuner avec du chocolat chaud. Sur la place, on les trouve avec du beurre et de l\'arequipe.',
      pt: 'As arepas de chócolo são um pecado delicioso! Milho fresco moído grelhado com queijo fresco, douradas por fora e macias por dentro. Perfeitas para o café da manhã com chocolate quente. Na praça você encontra com manteiga e arequipe.',
      it: 'Le arepas di chócolo sono un peccato delizioso! Mais fresco macinato grigliato con formaggio fresco, dorate fuori e morbide dentro. Perfette per la colazione con cioccolata calda. In piazza le trovi con burro e arequipe.'
    },
    followUp: ['¿Dónde comprar?', '¿Solo desayuno?', '¿Con qué las sirven?']
  },
  {
    keywords: ['empanada', 'empanada quindiana', 'empanada papa', 'pasabocas'],
    category: 'gastronomia',
    answer: {
      es: 'Las empanadas quindianas son el pasabocas perfecto. Masa de maíz amarillo, relleno de papa y carne guisada con hogao, fritas hasta quedar doradas. Con ají y limón, son adicción pura. En cada esquina del pueblo las consigues.',
      en: 'Quindian empanadas are the perfect snack. Yellow corn dough, potato and meat filling with hogao, fried until golden. With ají and limón, pure addiction. You find them at every corner of town.',
      de: 'Die Quindianischen Empanadas sind der perfekte Snack. Gelber Maisteig, gefüllt mit Kartoffel und gedünstetem Fleisch mit Hogao, goldgebraten. Mit Ají und Limette, reine Sucht. In jeder Ecke des Dorfes gibt es sie.',
      fr: 'Les empanadas quindiennes sont le snack parfait. Pâte de maïs jaune, farci de pomme de terre et de viande mijotée avec hogao, frites jusqu\'à ce qu\'elles soient dorées. Avec de l\'ají et du citron vert, une addiction pure. On les trouve à chaque coin de rue.',
      pt: 'As empanadas quindianas são o lanche perfeito. Massa de milho amarelo, recheio de batata e carne cozida com hogao, fritas até dourar. Com ají e limão, pura dependência. Você encontra em cada esquina da cidade.',
      it: 'Le empanadas quindiane sono lo snack perfetto. Pasta di mais giallo, ripieno di patata e carne stufata con hogao, fritte fino a doratura. Con ají e lime, pura dipendenza. Le trovi in ogni angolo del villaggio.'
    },
    followUp: ['¿Con ají?', '¿Solo de papa?', '¿Cuánto cuestan?']
  },
  {
    keywords: ['café', 'café especial', 'café origen', 'tinto', 'cafetería', 'coffee tour', 'coffee tours'],
    category: 'cafe',
    answer: {
      es: '¡El café del Quindío es patrimonio! Se cultiva entre 1.200 y 2.000 metros. Notas de chocolate, caramelo y frutas. Para vivir la experiencia del café reserva un coffee tour: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour o Finca Hotel El Ocaso. Para café de especialidad ve a Café Jesús Martín o Brunch de Salento. El tinto de la plaza es ritual sagrado.',
      en: 'Quindío coffee is heritage! Grown between 1,200 and 2,000 meters. Notes of chocolate, caramel and fruits. To live the coffee experience, book a coffee tour: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour or Finca Hotel El Ocaso. For specialty coffee go to Café Jesús Martín or Brunch de Salento. The square tinto is a sacred ritual.',
      de: 'Der Kaffee des Quindío ist Kulturgut! Er wird zwischen 1.200 und 2.000 Metern angebaut. Schokoladen-, Karamell- und Fruchtnoten. Um das Kaffee-Erlebnis zu genießen, buche eine Kaffeetour: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour oder Finca Hotel El Ocaso. Für Spezialitätenkaffee gehen Sie zu Café Jesús Martín oder Brunch de Salento. Der Tinto am Platz ist ein heiliges Ritual.',
      fr: 'Le café du Quindío est un patrimoine ! Il est cultivé entre 1 200 et 2 000 mètres. Notes de chocolat, caramel et fruits. Pour vivre l\'expérience du café, réservez un coffee tour : Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour ou Finca Hotel El Ocaso. Pour un café de spécialité, allez au Café Jesús Martín ou au Brunch de Salento. Le tinto de la place est un rituel sacré.',
      pt: 'O café do Quindío é patrimônio! É cultivado entre 1.200 e 2.000 metros. Notas de chocolate, caramelo e frutas. Para viver a experiência do café, reserve um coffee tour: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour ou Finca Hotel El Ocaso. Para café especialista vá ao Café Jesús Martín ou Brunch de Salento. O tinto da praça é um ritual sagrado.',
      it: 'Il caffè del Quindío è patrimonio! Viene coltivato tra 1.200 e 2.000 metri. Note di cioccolato, caramello e frutta. Per vivere l\'esperienza del caffè, prenota un coffee tour: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour o Finca Hotel El Ocaso. Per un caffè specialità andate al Café Jesús Martín o al Brunch de Salento. Il tinto della piazza è un rituale sacro.'
    },
    followUp: ['¿Dónde hacer un coffee tour?', '¿Método de preparación?', '¿Café de especialidad?', '¿Dónde comprar grano?'],
    relatedPlaces: [17, 23, 34, 9]
  },
  {
    keywords: ['sudado', 'sudado montañero', 'cocido', 'guiso'],
    category: 'gastronomia',
    answer: {
      es: 'El sudado montañero es puro amor campesino. Papa, yuca, plátano y carne en caldo aromático con hogao. Se acompaña con arroz, ensalada y abundante aguacate. Es el almuerzo de las fincas cafeteras.',
      en: 'Mountain sudado is pure peasant love. Potato, yuca, plantain and meat in aromatic broth with hogao. Accompanied with rice, salad and plenty of avocado. It\'s the lunch of coffee farms.',
      de: 'Der Bergsudado ist reine Bauernliebe. Kartoffel, Yucca, Banane und Fleisch in aromatischer Brühe mit Hogao. Serviert mit Reis, Salat und reichlich Avocado. Das ist das Mittagessen der Kaffeebauernhöfe.',
      fr: 'Le sudado montañero est un pur amour paysan. Pomme de terre, manioc, banane et viande dans un bouillon aromatique avec hogao. Accompagné de riz, salade et beaucoup d\'avocat. C\'est le déjeuner des plantations de café.',
      pt: 'O sudado montanheiro é puro amor caipira. Batata, mandioca, banana e carne em caldo aromático com hogao. Acompanhado de arroz, salada e muito abacate. É o almoço das fazendas de café.',
      it: 'Il sudado montañero è puro amore contadino. Patata, manioca, banana e carne in brodo aromatico con hogao. Accompagnato da riso, insalata e abbondante avocado. È il pranzo delle fattorie di caffè.'
    },
    followUp: ['¿Dónde probarlo?', '¿En fincas?', '¿Con aguacate?']
  },
  {
    keywords: ['buñuelo', 'buñuelos', 'natilla', 'postre', 'dulce'],
    category: 'gastronomia',
    answer: {
      es: 'Los buñuelos y natilla son tradición. Bolitas de maíz con queso, fritas hasta quedar doradas, acompañadas de natilla cremosa. Con chocolate caliente son pecado perfecto. Aunque son navideños, todo el año los encuentras.',
      en: 'Buñuelos and natilla are tradition. Corn balls with cheese, fried until golden, with creamy natilla. With hot chocolate, perfect sin. Although Christmas treats, you find them all year.',
      de: 'Buñuelos und Natilla sind Tradition. Maiskugeln mit Käse, goldbraun gebraten, mit cremiger Natilla. Mit heißer Schokolade ein perfektes Sündenleben. Obwohl Weihnachtsgebäck, findet man sie das ganze Jahr.',
      fr: 'Les buñuelos et la natilla sont une tradition. Boulettes de maïs au fromage, frites jusqu\'à ce qu\'elles soient dorées, accompagnées de natilla crémeuse. Avec du chocolat chaud, un péché parfait. Bien que des gâteaux de Noël, on les trouve toute l\'année.',
      pt: 'Os buñuelos e a natilla são tradição. Bolinhas de milho com queijo, fritas até dourar, acompanhadas de natilla cremosa. Com chocolate quente são um pecado perfeito. Embora sejam típicos de Natal, você encontra o ano todo.',
      it: 'I buñuelos e la natilla sono tradizione. Palline di mais con formaggio, fritte fino a doratura, accompagnate da natilla cremosa. Con cioccolata calda sono un peccato perfetto. Anche se sono dolci natalizi, li trovi tutto l\'anno.'
    },
    followUp: ['¿Solo en Navidad?', '¿Con chocolate?', '¿Otros postres?']
  },
  {
    keywords: ['aguapanela', 'panela', 'bebida', 'chocolate caliente'],
    category: 'gastronomia',
    answer: {
      es: 'La aguapanela es la bebida que nos mantiene vivos. Panela disuelta en agua caliente, con limón y queso, o fría como refresco. Los campesinos la toman diario para energizarse. Con queso es combinación perfecta.',
      en: 'Aguapanela is the drink that keeps us alive. Panela dissolved in hot water, with lemon and cheese, or cold as refreshment. Peasants drink it daily. With cheese, perfect combination.',
      de: 'Aguapanela ist das Getränk, das uns am Leben hält. In heißem Wasser aufgelöste Panela, mit Zitrone und Käse, oder kalt als Erfrischung. Die Bauern trinken es täglich zur Stärkung. Mit Käse eine perfekte Kombination.',
      fr: 'L\'aguapanela est la boisson qui nous maintient en vie. Panela dissoute dans l\'eau chaude, avec citron et fromage, ou froide comme rafraîchissement. Les paysans la boivent quotidiennement. Avec du fromage, combinaison parfaite.',
      pt: 'A aguapanela é a bebida que nos mantém vivos. Panela dissolvida em água quente, com limão e queijo, ou fria como refrigerante. Os camponeses bebem todos os dias para se energizarem. Com queijo é combinação perfeita.',
      it: 'L\'aguapanela è la bevanda che ci mantiene in vita. Panela sciolta in acqua calda, con limone e formaggio, o fredda come rinfrescante. I contadini la bevono ogni giorno per rinvigorirsi. Con formaggio è una combinazione perfetta.'
    },
    followUp: ['¿Con limón?', '¿Fría o caliente?', '¿Con queso?']
  },
  {
    keywords: ['breva', 'brevas arequipe', 'postre tradicional'],
    category: 'gastronomia',
    answer: {
      es: 'Las brevas con arequipe son postre de abuela. Brevas cocidas en almíbar de panela con arequipe cremoso. Contraste perfecto entre dulce y cremoso. En restaurantes tradicionales las preparan como antes.',
      en: 'Brevas with arequipe are grandmother\'s dessert. Figs cooked in panela syrup with creamy arequipe. Perfect contrast. Traditional restaurants prepare them like before.',
      de: 'Brevas mit Arequipe sind ein Oma-Dessert. Feigen in Panela-Sirup gekocht mit cremigem Arequipe. Perfekter Kontrast zwischen süß und cremig. Traditionelle Restaurants bereiten sie wie früher zu.',
      fr: 'Les brevas avec de l\'arequipe sont le dessert de grand-mère. Ficus cuits dans un sirop de panela avec de l\'arequipe crémeux. Contraste parfait entre doux et crémeux. Les restaurants traditionnels les préparent comme avant.',
      pt: 'As brevas com arequipe são a sobremesa da vovó. Figo cozido em calda de panela com arequipe cremoso. Contraste perfeito entre doce e cremoso. Restaurantes tradicionais preparam como antigamente.',
      it: 'Le brevas con arequipe sono il dolce della nonna. Fichi cotti nello sciroppo di panela con arequipe cremoso. Contrasto perfetto tra dolce e cremoso. I ristoranti tradizionali le preparano come un tempo.'
    },
    followUp: ['¿Dónde probarlas?', '¿Solo en restaurantes?', '¿Con café?']
  },
  {
    keywords: ['masamorra', 'mazamorra', 'maíz', 'desayuno', 'desayuno tradicional'],
    category: 'gastronomia',
    answer: {
      es: 'La mazamorra es desayuno o postre. Maíz pelado cocido con panela derretida, servido caliente. Es cocina ancestral antioqueña, reconfortante en días fríos. Algunas la prefieren con bocadillo de guayaba.',
      en: 'Mazamorra is breakfast or dessert. Peeled cooked corn with melted panela, served hot. Ancestral Antioquean cuisine, comforting on cold days. Some prefer it with guava paste.',
      de: 'Mazamorra ist Frühstück oder Dessert. Geschälter gekochter Mais mit geschmolzener Panela, heiß serviert. Ahnentruhe antioqueanische Küche, tröstlich an kalten Tagen. Manche bevorzugen es mit Guavenpastetchen.',
      fr: 'La mazamorra est le petit-déjeuner ou le dessert. Maïs pelé cuit avec de la panela fondue, servi chaud. Cuisine ancestrale antioqueña, réconfortante les jours froids. Certains la préfèrent avec de la pâte de goyave.',
      pt: 'A mazamorra é café da manhã ou sobremesa. Milho descascado cozido com panela derretida, servido quente. Cozinha ancestral antioqueana, reconfortante nos dias frios. Alguns preferem com goiabada.',
      it: 'La mazamorra è colazione o dessert. Mais sbucciato cotto con panela fuso, servito caldo. Cucina ancestrale antioqueña, confortante nei giorni freddi. Alcuni la preferiscono con pasta di guaiava.'
    },
    followUp: ['¿Desayuno o postre?', '¿Con leche?', '¿Dónde probarla?']
  },
  {
    keywords: ['historia', 'fundación', 'origen', 'cuándo fundaron', 'fundó', 'fundaron', 'cuándo se fundó'],
    category: 'historia',
    answer: {
      es: '¡Salento tiene historia pa\' rato! Fundado en 1842, es el municipio más antiguo del Quindío. Sus casas de bahareque con tejados altos y colores vivos cuentan historias de cafeteros que construyeron este paraíso.',
      en: 'Salento has history for days! Founded in 1842, it\'s the oldest municipality in Quindío. Its bahareque houses tell stories of coffee growers who built this paradise.',
      de: 'Salento hat eine bewegte Geschichte! Gegründet 1842, ist es die älteste Gemeinde des Quindío. Seine Bahareque-Häuser erzählen die Geschichten der Kaffeebauern, die dieses Paradies aufbauten.',
      fr: 'Salento a une longue histoire ! Fondé en 1842, c\'est la municipalité la plus ancienne du Quindío. Ses maisons bahareque racontent l\'histoire des caféiculteurs qui ont construit ce paradis.',
      pt: 'Salento tem história pra tudo! Fundado em 1842, é o município mais antigo do Quindío. Suas casas de bahareque contam histórias dos cafeicultores que construíram este paraíso.',
      it: 'Salento ha una storia lunga! Fondato nel 1842, è il comune più antico del Quindío. Le sue case di bahareque raccontano le storie dei coltivatori di caffè che hanno costruito questo paradiso.'
    },
    followUp: ['¿Colonización antioqueña?', '¿Terremoto 1999?', '¿Patrimonio UNESCO?']
  },
  {
    keywords: ['unesco', 'patrimonio', 'patrimonio humanidad', 'paisaje cultural'],
    category: 'historia',
    answer: {
      es: '¡En 2011 la UNESCO declaró el Paisaje Cultural Cafetero como Patrimonio de la Humanidad! El Quindío aporta 11 de sus 12 municipios. El café no es solo cultivo, es estilo de vida. Las palmas de cera y la arquitectura bahareque son elementos vivos.',
      en: 'In 2011 UNESCO declared the Coffee Cultural Landscape as World Heritage! Quindío contributes 11 of 12 municipalities. Coffee isn\'t just a crop, it\'s a lifestyle. Wax palms and bahareque architecture are living elements.',
      de: '2011 erklärte die UNESCO die Kulturlandschaft des Kaffees zum Weltkulturerbe! Das Quindío bringt 11 seiner 12 Gemeinden ein. Kaffee ist nicht nur eine Kultur, er ist ein Lebensstil. Palmenwachsbäume und Bahareque-Architektur sind lebendige Elemente.',
      fr: 'En 2011, l\'UNESCO a déclaré le Paysage Culturel du Café Patrimoine Mondial ! Le Quindío contribue avec 11 de ses 12 municipalités. Le café n\'est pas seulement une culture, c\'est un style de vie. Les palmiers à cire et l\'architecture bahareque sont des éléments vivants.',
      pt: 'Em 2011 a UNESCO declarou a Paisagem Cultural do Café como Patrimônio da Humanidade! O Quindío contribui com 11 dos seus 12 municípios. O café não é apenas uma cultura, é um estilo de vida. As palmeiras de cera e a arquitetura bahareque são elementos vivos.',
      it: 'Nel 2011 l\'UNESCO ha dichiarato il Paesaggio Culturale del Caffè Patrimonio dell\'Umanità! Il Quindío contribuisce con 11 dei suoi 12 comuni. Il caffè non è solo una coltura, è uno stile di vita. Le palme di cera e l\'architettura bahareque sono elementi vivi.'
    },
    followUp: ['¿Qué municipios?', '¿Qué significa?', '¿Cómo se vive?']
  },
  {
    keywords: ['quimbaya', 'orfebrería', 'oro', 'precolombino', 'cultura ancestral'],
    category: 'historia',
    answer: {
      es: 'Los Quimbayas fueron una civilización increíble. Entre 500 a.C. y 600 d.C. desarrollaron orfebrería extraordinaria. El Tesoro Quimbaya tiene 121 piezas de oro en Madrid. En Armenia está el Museo del Oro Quimbaya con más de 400 piezas.',
      en: 'The Quimbayas were incredible. Between 500 BC and 600 AD they developed extraordinary goldwork. The Quimbaya Treasure has 121 gold pieces in Madrid. In Armenia is the Quimbaya Gold Museum with over 400 pieces.',
      de: 'Die Quimayas waren eine unglaubliche Zivilisation. Zwischen 500 v. Chr. und 600 n. Chr. entwickelten sie außergewöhnliche Goldschmiedekunst. Der Quimbaya-Schatz hat 121 Goldstücke in Madrid. In Armenia gibt es das Quimbaya-Goldmuseum mit über 400 Stücken.',
      fr: 'Les Quimayas étaient une civilisation incroyable. Entre 500 av. J.-C. et 600 apr. J.-C., ils ont développé un art de l\'orfèvrerie extraordinaire. Le Trésor Quimbaya possède 121 pièces d\'or à Madrid. À Armenia se trouve le Musée de l\'Or Quimbaya avec plus de 400 pièces.',
      pt: 'Os Quimayas foram uma civilização incrível. Entre 500 a.C. e 600 d.C. desenvolveram ourivesaria extraordinária. O Tesouro Quimbaya tem 121 peças de ouro em Madrid. Em Armenia está o Museu do Ouro Quimbaya com mais de 400 peças.',
      it: 'I Quimbaya furono una civiltà incredibile. Tra 500 a.C. e 600 d.C. svilupparono un arte orafa straordinaria. Il Tesoro Quimbaya ha 121 pezzi d\'oro a Madrid. Ad Armenia si trova il Museo dell\'Oro Quimbaya con oltre 400 pezzi.'
    },
    followUp: ['¿Dónde ver el oro?', '¿Museo en Armenia?', '¿Más de la cultura?']
  },
  {
    keywords: ['terremoto', '1999', 'sismo', 'ciudad milagro', 'reconstrucción'],
    category: 'historia',
    answer: {
      es: 'El 25 de enero de 1999 un terremoto de 6.2 destruyó Armenia. Pero el Quindío se levantó como un milagro - por eso llaman a Armenia "Ciudad Milagro". Hoy está completamente reconstruida, más moderna y fuerte.',
      en: 'On January 25, 1999 a 6.2 earthquake destroyed Armenia. But Quindío rose like a miracle - that\'s why they call Armenia "Miracle City". Today completely rebuilt, more modern and stronger.',
      de: 'Am 25. Januar 1999 zerstörte ein Erdbeben der Stärke 6,2 Armenia. Aber das Quindío erhob sich wie ein Wunder - deshalb nennen sie Armenia "Wunderstadt". Heute vollständig wiederaufgebaut, moderner und stärker.',
      fr: 'Le 25 janvier 1999, un séisme de 6,2 a détruit Armenia. Mais le Quindío s\'est relevé comme par un miracle - c\'est pourquoi on appelle Armenia "Ville Miracle". Aujourd\'hui complètement reconstruite, plus moderne et plus forte.',
      pt: 'Em 25 de janeiro de 1999 um terremoto de 6,2 destruiu Armenia. Mas o Quindío se levantou como um milagro - por isso chamam Armenia de "Cidade Milagro". Hoje completamente reconstruída, mais moderna e forte.',
      it: 'Il 25 gennaio 1999 un terremoto di 6,2 distrusse Armenia. Ma il Quindío si rialzò come per miracolo - per questo chiamano Armenia "Città Miracolo". Oggi completamente ricostruita, più moderna e forte.'
    },
    followUp: ['¿Cómo se reconstruyó?', '¿Qué quedó dañado?', '¿Hoy está seguro?']
  },
  {
    keywords: ['bahareque', 'arquitectura', 'casa tradicional', 'balcones', 'fachadas'],
    category: 'historia',
    answer: {
      es: 'La arquitectura bahareque es el alma de Salento. Casas con estructura de guadua y barro, tejados de palma, balcones de madera con flores. Cada casa es una obra de arte. La Calle Real es museo viviente.',
      en: 'Bahareque architecture is the soul of Salento. Houses with guadua and mud structure, palm roofs, wooden balconies with flowers. Each house is art. Calle Real is a living museum.',
      de: 'Die Bahareque-Architektur ist die Seele von Salento. Häuser mit Guadua- und Lehmstruktur, Palmdächer, Holzbalkone mit Blumen. Jedes Haus ist ein Kunstwerk. Die Calle Real ist ein lebendiges Museum.',
      fr: 'L\'architecture bahareque est l\'âme de Salento. Maisons avec structure en guadua et en boue, toits de palmiers, balcons en bois avec des fleurs. Chaque maison est une œuvre d\'art. La Calle Real est un musée vivant.',
      pt: 'A arquitetura bahareque é a alma de Salento. Casas com estrutura de guadua e barro, telhados de palmeira, varandas de madeira com flores. Cada casa é uma obra de arte. A Calle Real é um museu vivo.',
      it: 'L\'architettura bahareque è l\'anima di Salento. Case con strutura di guadua e fango, tetti di palme, balconi di legno con fiori. Ogni casa è un\'opera d\'arte. La Calle Real è un museo vivente.'
    },
    followUp: ['¿Calle Real?', '¿Guadua?', '¿Dónde ver las más bonitas?'],
    relatedPlaces: [100]
  },
  {
    keywords: ['armenia', 'ciudad milagro', 'capital', 'quindío'],
    category: 'municipios',
    answer: {
      es: 'Armenia es la capital y "Ciudad Milagro". Fundada en 1889, tiene más de 300.000 habitantes. Museo del Oro Quindío, centros comerciales, vida nocturna y el Aeropuerto El Edén. Es la puerta de entrada al departamento.',
      en: 'Armenia is the capital and "Miracle City". Founded in 1889, over 300,000 inhabitants. Quimbaya Gold Museum, shopping centers, nightlife and El Edén Airport. Gateway to the department.',
      de: 'Armenia ist die Hauptstadt und "Wunderstadt". Gegründet 1889, über 300.000 Einwohner. Quimbaya-Goldmuseum, Einkaufszentren, Nachtleben und Flughafen El Edén. Tor zum Departement.',
      fr: 'Armenia est la capitale et la "Ville Miracle". Fondée en 1889, plus de 300 000 habitants. Musée de l\'Or Quimbaya, centres commerciaux, vie nocturne et aéroport El Edén. Porte d\'entrée du département.',
      pt: 'Armenia é a capital e "Cidade Milagro". Fundada em 1889, com mais de 300.000 habitantes. Museu do Ouro Quimbaya, centros comerciais, vida noturna e Aeroporto El Edén. Porta de entrada do departamento.',
      it: 'Armenia è la capitale e la "Città Miracolo". Fondata nel 1889, con oltre 300.000 abitanti. Museo dell\'Oro Quimbaya, centri commerciali, vita notturna e Aeroporto El Edén. Porta d\'ingresso al dipartimento.'
    },
    followUp: ['¿Cómo llegar desde allá?', '¿Qué ver en Armenia?', '¿Aeropuerto?']
  },
  {
    keywords: ['filandia', 'torre mirador filandia', 'mirador de filandia', 'hija de los andes'],
    category: 'municipios',
    answer: {
      es: 'Filandia es "Hija de los Andes". Su Torre Mirador ofrece vistas de 360 grados de tres departamentos. Arquitectura original, artesanías en guadua, café especial y ambiente bohemio. A 26 km de Armenia.',
      en: 'Filandia is "Daughter of the Andes". Its Lookout Tower offers 360° views of three departments. Original architecture, guadua crafts, specialty coffee and bohemian atmosphere. 26 km from Armenia.',
      de: 'Filandia ist die "Tochter der Anden". Ihr Aussichtsturm bietet 360°-Blick auf drei Departemente. Originale Architektur, Guadua-Kunsthandwerk, Spezialitätenkaffee und bohème Atmosphäre. 26 km von Armenia.',
      fr: 'Filandia est la "Fille des Andes". Sa Tour d\'observation offre une vue à 360° sur trois départements. Architecture originale, artisanat en guadua, café de spécialité et atmosphère bohème. À 26 km d\'Armenia.',
      pt: 'Filandia é a "Filha dos Andes". Sua Torre Mirador oferece vistas de 360 graus de três departamentos. Arquitetura original, artesanato em guadua, café especial e ambiente boêmio. A 26 km de Armenia.',
      it: 'Filandia è la "Figlia delle Ande". La sua Torre di Osservazione offre viste a 360° su tre dipartimenti. Architettura originale, artigianato in guadua, caffè specialità e atmosfera bohémien. A 26 km da Armenia.'
    },
    followUp: ['¿Cómo llegar?', '¿Qué ver allá?', '¿Es mejor que Salento?']
  },
  {
    keywords: ['montenegro', 'parque café', 'parque nacional café'],
    category: 'municipios',
    answer: {
      es: 'Montenegro es la "Capital del Café" porque alberga el Parque Nacional del Café. Más de 25 atracciones, shows culturales, museo del café y teleférico. Recibe más de 600.000 visitantes al año.',
      en: 'Montenegro is the "Coffee Capital" because it houses the National Coffee Park. Over 25 attractions, cultural shows, coffee museum and cable car. Over 600,000 visitors yearly.',
      de: 'Montenegro ist die "Kaffeehauptstadt", weil dort der Nationale Kaffee-Park liegt. Über 25 Attraktionen, kulturelle Shows, Kaffeemuseum und Seilbahn. Über 600.000 Besucher pro Jahr.',
      fr: 'Montenegro est la "Capitale du Café" car il abrite le Parc National du Café. Plus de 25 attractions, spectacles culturels, musée du café et téléphérique. Plus de 600 000 visiteurs par an.',
      pt: 'Montenegro é a "Capital do Café" porque abriga o Parque Nacional do Café. Mais de 25 atrações, shows culturais, museu do café e teleférico. Recebe mais de 600.000 visitantes por ano.',
      it: 'Montenegro è la "Capitale del Caffè" perché ospita il Parco Nazionale del Caffè. Oltre 25 attrazioni, spettacoli culturali, museo del caffè e funivia. Oltre 600.000 visitatori all\'anno.'
    },
    followUp: ['¿Parque del Café?', '¿Fincas?', '¿Cuánto cuesta?']
  },
  {
    keywords: ['circasia', 'tierra hombres libres', 'pueblo'],
    category: 'municipios',
    answer: {
      es: 'Circasia significa "tierra de hombres libres". A 1.777 metros, pueblo tranquilo con tradición cafetera. Tiene diferentes pisos térmicos, café de altura y paisajes montañosos. Fundada en 1884.',
      en: 'Circasia means "land of free men". At 1,777m, quiet town with coffee tradition. Different thermal floors, high-altitude coffee and mountain landscapes. Founded in 1884.',
      de: 'Circasia bedeutet "Land der freien Männer". Auf 1.777 m, ein ruhiges Dorf mit Kaffee-Tradition. Verschiedene Höhenstufen, Hochlandkaffee und Berglandschaften. Gegründet 1884.',
      fr: 'Circasia signifie "terre des hommes libres". À 1 777 m, village tranquille avec tradition caféière. Différents niveaux thermiques, café de haute altitude et paysages montagneux. Fondée en 1884.',
      pt: 'Circasia significa "terra de homens livres". A 1.777 metros, cidade tranquila com tradição cafeeira. Diferentes pisos térmicos, café de altitude e paisagens montanhosas. Fundada em 1884.',
      it: 'Circasia significa "terra di uomini liberi". A 1.777 metri, città tranquilla con tradizione caffettiera. Diversi piani termici, caffè d\'altitudine e paesaggi montuosi. Fondata nel 1884.'
    },
    followUp: ['¿Cómo llegar?', '¿Qué hacer allá?', '¿Es lejos?']
  },
  {
    keywords: ['quimbaya', 'panaca', 'parque cultivo'],
    category: 'municipios',
    answer: {
      es: 'Quimbaya honra a la cultura precolombina. Tiene el Parque de la Cultura Agropecuaria (Panaca) donde interactúas con animales y aprendes de agricultura. Conserva tradiciones campesinas y arquitectura cafetera.',
      en: 'Quimbaya honors pre-Columbian culture. It has the Agricultural Culture Park (Panaca) where you interact with animals and learn about agriculture. Preserves peasant traditions.',
      de: 'Quimbaya ehrt die vorkolumbianische Kultur. Es gibt den Park der Landwirtschaftlichen Kultur (Panaca), wo Sie mit Tieren interagieren und etwas über Landwirtschaft lernen. Bewahrt Bauerntraditionen.',
      fr: 'Quimbaya honore la culture précolombienne. Il y a le Parc de la Culture Agricole (Panaca) où vous interagissez avec les animaux et apprenez l\'agriculture. Préserve les traditions paysannes.',
      pt: 'Quimbaya honra a cultura pré-colombiana. Tem o Parque da Cultura Agropecuária (Panaca) onde você interage com animais e aprende sobre agricultura. Preserva tradições camponesas.',
      it: 'Quimbaya onora la cultura precolombiana. Ha il Parco della Cultura Agricola (Panaca) dove interagite con gli animali e imparate l\'agricoltura. Conserva le tradizioni contadine.'
    },
    followUp: ['¿Panaca?', '¿Familiar?', '¿Qué actividades hay?']
  },
  {
    keywords: ['pijao', 'ciudad sin prisa', 'tranquilo', 'pueblo pequeño'],
    category: 'municipios',
    answer: {
      es: 'Pijao es "La Ciudad sin Prisa". Pueblo sereno donde la vida va lento. Nombrado en honor a la tribu indígena Pijao. A 32 km de Armenia, ofrece paisajes cafeteros, senderos ecológicos y desconexión total.',
      en: 'Pijao is "The City Without Rush". Serene town where life goes slow. Named after the Pijao indigenous tribe. 32 km from Armenia, coffee landscapes, ecological trails and total disconnection.',
      de: 'Pijao ist die "Stadt ohne Eile". Eine ruhige Stadt, in der das Leben langsam vergeht. Benannt nach dem indigenen Stamm Pijao. 32 km von Armenia, Kaffeelandschaften, ökologische Wege und totales Entkommen.',
      fr: 'Pijao est la "Ville sans Précipitation". Ville sereine où la vie va lentement. Nommée en hommage à la tribu indigène Pijao. À 32 km d\'Armenia, paysages caféiers, sentiers écologiques et déconnexion totale.',
      pt: 'Pijao é a "Cidade sem Pressa". Cidade serena onde a vida vai devagar. Nomeada em homenagem à tribo indígena Pijao. A 32 km de Armenia, oferece paisagens cafeeiras, trilhas ecológicas e desconexão total.',
      it: 'Pijao è la "Città senza Fretta". Città serena dove la vita scorre lenta. Intitolata in onore della tribù indigena Pijao. A 32 km da Armenia, offre paesaggi caffettieri, sentieri ecologici e disconnessione totale.'
    },
    followUp: ['¿Cómo llegar?', '¿Qué hacer?', '¿Dónde dormir?']
  },
  {
    keywords: ['canopy', 'tirolesa', 'rapel', 'aventura extrema', 'adrenalina'],
    category: 'experiencias',
    answer: {
      es: '¡Para adrenalina tenemos de todo! Canopy sobre el bosque de niebla, rappel en cascadas naturales, tirolesas con vista al Valle de Cocora. Los operadores certificados garantizan seguridad.',
      en: 'For adrenaline we have everything! Canopy over cloud forest, rappel in natural waterfalls, zip lines overlooking Cocora Valley. Certified operators guarantee safety.',
      de: 'Für Adrenalin haben wir alles! Canopy über dem Nebelwald, Abseilen an natürlichen Wasserseilen, Zipline mit Blick auf das Cocora-Tal. Zertifizierte Betreiber garantieren Sicherheit.',
      fr: 'Pour l\'adrénaline, nous avons tout ! Canopée au-dessus de la forêt de nuages, rappel dans des cascades naturelles, tyroliennes avec vue sur la vallée de Cocora. Les opérateurs certifiés garantissent la sécurité.',
      pt: 'Para adrenalina temos tudo! Canopy sobre a floresta de nevoeiro, rapel em cachoeiras naturais, tirolesas com vista para o Vale de Cocora. Operadores certificados garantem segurança.',
      it: 'Per l\'adrenalina abbiamo tutto! Canopy sulla foresta di nebbia, rapel in cascate naturali, zipline con vista sulla Valle di Cocora. Operatori certificati garantiscono la sicurezza.'
    },
    followUp: ['¿Canopy?', '¿Rappel?', '¿Precios?']
  },
  {
    keywords: ['rafting', 'raudeo', 'río vieja', 'aguas bravas'],
    category: 'experiencias',
    answer: {
      es: 'El rafting en el Río La Vieja es pura emoción. Aguas bravas rodeadas de montañas verdes. Perfecto para principiantes y expertos. Incluye instrucciones y equipo de seguridad.',
      en: 'Rafting on La Vieja River is pure excitement. Rough waters surrounded by green mountains. Perfect for beginners and experts. Includes instructions and safety equipment.',
      de: 'Rafting auf dem Río La Vieja ist reine Aufregung. Wilde Gewässer umgeben von grünen Bergen. Perfekt für Anfänger und Profis. Inklusive Anweisungen und Sicherheitsausrüstung.',
      fr: 'Le rafting sur le Río La Vieja est une pure émotion. Eaux vives entourées de montagnes vertes. Parfait pour les débutants et les experts. Inclut des instructions et l\'équipement de sécurité.',
      pt: 'O rafting no Río La Vieja é pura emoção. Águas bravas cercadas por montanhas verdes. Perfeito para iniciantes e especialistas. Inclui instruções e equipamento de segurança.',
      it: 'Il rafting sul Río La Vieja è pura emozione. Acque torbide circondate da montagne verdi. Perfetto per principianti e esperti. Include istruzioni e attrezzatura di sicurezza.'
    },
    followUp: ['¿Es difícil?', '¿Para principiantes?', '¿Cuánto cuesta?']
  },
  {
    keywords: ['parapente', 'volar', 'vuelo libre', 'panorámico'],
    category: 'experiencias',
    answer: {
      es: '¡Volar sobre el Valle de Cocora en parapente es experiencia de vida! Ves las palmas de cera desde el aire, el río y las montañas. Pilotos certificados. Vuelos de 15-30 minutos.',
      en: 'Flying over Cocora Valley by paragliding is a life experience! See wax palms from the air, the river and mountains. Certified pilots. Flights of 15-30 minutes.',
      de: 'Über das Cocora-Tal mit dem Gleitschirm zu fliegen ist ein Erlebnis! Sehen Sie die Palmenwachsbäume aus der Luft, den Fluss und die Berge. Zertifizierte Piloten. Flüge von 15-30 Minuten.',
      fr: 'Voler au-dessus de la vallée de Cocora en parapente est une expérience de vie ! Voir les palmiers à cire depuis les airs, la rivière et les montagnes. Pilotes certifiés. Vols de 15 à 30 minutes.',
      pt: 'Voar sobre o Vale de Cocora de parapente é uma experiência de vida! Veja as palmeiras de cera do ar, o rio e as montanhas. Pilotos certificados. Voos de 15 a 30 minutos.',
      it: 'Volare sopra la Valle di Cocora in parapendio è un\'esperienza di vita! Vedete le palme di cera dall\'aria, il fiume e le montagne. Piloti certificati. Voli di 15-30 minuti.'
    },
    followUp: ['¿Es seguro?', '¿Cuánto dura?', '¿Reservar?']
  },
  {
    keywords: ['tour fotográfico', 'fotografía', 'paisajes', 'amanecer', 'atardecer'],
    category: 'experiencias',
    answer: {
      es: 'Los tours fotográficos son imperdibles. Amanecer en Cocora, arquitectura colonial, cafetales en pendiente, willys coloridos. Los guías conocen los spots secretos. Incluyen transporte.',
      en: 'Photography tours are a must. Sunrise in Cocora, colonial architecture, hillside coffee plantations, colorful Willys. Guides know secret spots. Include transportation.',
      de: 'Fototouren sind ein Muss. Sonnenaufgang in Cocora, Kolonialarchitektur, Hang-Kaffeeplantagen, bunte Willys. Die Guides kennen die geheimen Orte. Inklusive Transport.',
      fr: 'Les tours photographiques sont incontournables. Lever de soleil à Cocora, architecture coloniale, plantations de café en pente, Willys colorés. Les guides connaissent les spots secrets. Incluent le transport.',
      pt: 'Os tours fotográficos são imperdíveis. Nascer do sol em Cocora, arquitetura colonial, plantações de café em declive, Willys coloridos. Os guias conhecem os pontos secretos. Incluem transporte.',
      it: 'I tour fotografici sono imperdibili. Alba a Cocora, architettura coloniale, piantagioni di caffè sui pendii, Willys colorati. Le guide conoscono i punti segreti. Includono trasporti.'
    },
    followUp: ['¿Mejor hora?', '¿Equipo necesario?', '¿Cuánto cuesta?']
  },
  {
    keywords: ['folclor', 'música', 'bambuco', 'pasillo', 'tiple', 'guitarra'],
    category: 'experiencias',
    answer: {
      es: 'El folclor quindiano es música que enamora. Bambucos, pasillos y música andina con tiple, guitarra y carraca. En plazas de pueblos y el Parque del Café se presentan grupos folclóricos.',
      en: 'Quindian folklore is music that captivates. Bambucos, pasillos and Andean music with tiple, guitar and carraca. In town squares and the Coffee Park, folk groups perform.',
      de: 'Die Quindianische Folklore ist bezaubernde Musik. Bambucos, Pasillos und Andenmusik mit Tiple, Gitarre und Carraca. Auf Dorfplätzen und im Kaffee-Polk treten Folkloregruppen auf.',
      fr: 'Le folklore quindiano est une musique qui captive. Bambucos, pasillos et musique andine avec tiple, guitare et carraca. Sur les places de village et au Parc du Café, des groupes folkloriques se produisent.',
      pt: 'O folclore quindiano é música que encanta. Bambucos, pasillos e música andina com tiple, guitarra e carraca. Nas praças dos municípios e no Parque do Café, grupos folclóricos se apresentam.',
      it: 'Il folklore quindiano è musica che affascina. Bambucos, pasillos e musica andina con tiple, chitarra e carraca. Nelle piazze dei paesi e nel Parco del Caffè, si esibiscono gruppi folkloristici.'
    },
    followUp: ['¿Dónde escuchar?', '¿Festival?', '¿Instrumentos típicos?']
  },
  {
    keywords: ['festival', 'festival café', 'festival nacional café', 'junio'],
    category: 'festivales',
    answer: {
      es: '¡El Festival Nacional del Café es en junio! Es la celebración más grande del Quindío. Desfiles, música, gastronomía, concursos cafeteros. También está el Yipao en octubre con los jeeps cargados.',
      en: 'The National Coffee Festival is in June! It\'s the biggest celebration in Quindío. Parades, music, gastronomy, coffee contests. Also the Yipao in October with loaded jeeps.',
      de: 'Das Nationale Kaffee-Festival ist im Juni! Es ist die größte Feier des Quindío. Umzüge, Musik, Gastronomie, Kaffeewettbewerbe. Auch der Yipao im Oktober mit beladenen Jeeps.',
      fr: 'Le Festival National du Café est en juin ! C\'est la plus grande célébration du Quindío. Défilés, musique, gastronomie, concours de café. Aussi le Yipao en octobre avec les jeeps chargées.',
      pt: 'O Festival Nacional do Café é em junho! É a maior celebração do Quindío. Desfiles, música, gastronomia, concursos cafeeiros. Também tem o Yipao em outubro com os jeeps carregados.',
      it: 'Il Festival Nazionale del Caffè è a giugno! È la celebrazione più grande del Quindío. Sfilate, musica, gastronomia, concorsi di caffè. Anche lo Yipao a ottobre con i jeeps carichi.'
    },
    followUp: ['¿Cuándo es?', '¿Qué actividades?', '¿Cómo llegar?']
  },
  {
    keywords: ['yipao', 'jeep', 'desfile', 'octubre', 'jeep willys'],
    category: 'festivales',
    answer: {
      es: 'El Yipao es en octubre! Desfile de Jeeps Willys cargados con café, plátano, muebles y hasta cocinas. Es tradición viva del Quindío. Los jeeps se decoran con flores y colores. ¡Espectáculo único!',
      en: 'The Yipao is in October! Parade of Willys Jeeps loaded with coffee, plantains, furniture and even kitchens. It\'s living tradition of Quindío. Jeeps decorated with flowers and colors. Unique spectacle!',
      de: 'Der Yipao ist im Oktober! Umzug von Willys-Jeeps beladen mit Kaffee, Bananen, Möbeln und sogar Küchen. Lebendige Tradition des Quindío. Die Jeeps sind mit Blumen und Farben geschmückt. Einzigartiges Spektakel!',
      fr: 'Le Yipao est en octobre ! Défilé de Jeeps Willys chargées de café, bananes, meubles et même cuisines. C\'est une tradition vivante du Quindío. Les jeeps décorées de fleurs et de couleurs. Spectacle unique !',
      pt: 'O Yipao é em outubro! Desfile de Jeeps Willys carregados com café, banana, móveis e até cozinha. É tradição viva do Quindío. Os jeeps são decorados com flores e cores. Espetáculo único!',
      it: 'Lo Yipao è a ottobre! Sfilata di Jeeps Willys carichi di caffè, banane, mobili e persino cucine. È una tradizione viva del Quindío. I jeeps sono decorati con fiori e colori. Spettacolo unico!'
    },
    followUp: ['¿Dónde se ve?', '¿Cómo participar?', '¿Qué llevan los jeeps?']
  },
  {
    keywords: ['navidad', 'navideño', 'navideña', 'navideños', 'nochebuena', 'posada', 'posadas', 'villancico', 'villancicos', 'mercado navideño', 'diciembre', 'christmas', 'christmas market'],
    category: 'festivales',
    answer: {
      es: '¡La Navidad en Salento es de lo mejor! En diciembre la Plaza de Bolívar se llena de luces y suenan los villancicos. No te pierdas el Mercado Navideño Artesanal en el Parque Municipal, los buñuelos con natilla y el chocolate caliente en los cafés de la Calle Real. El 24 y 25 muchos negocios cierran temprano: confirma horarios antes de salir. ¿Te armo el plan?',
      en: "Christmas in Salento is special! In December Plaza de Bolívar lights up and carols fill the air. Don't miss the Artisan Christmas Market at Parque Municipal, buñuelos with natilla and hot chocolate at Calle Real cafés. On Dec 24–25 many places close early: confirm hours before you go. Shall I build your plan?",
      de: 'Das Weihnachten in Salento ist etwas Besonderes! Im Dezember leuchtet die Plaza de Bolívar und überall erklingen Villancicos. Verpasse nicht den Weihnachtsmarkt am Parque Municipal, Buñuelos mit Natilla und heiße Schokolade in den Cafés der Calle Real. Am 24. und 25. schließen viele Geschäfte früh: vorher Öffnungszeiten prüfen. Soll ich den Plan zusammenstellen?',
      fr: 'Noël à Salento, c\'est unique ! En décembre la Plaza de Bolívar s\'illumine et les villancicos remplissent les rues. Ne manquez pas l\'artisanal marché de Noël au Parque Municipal, les buñuelos à la natilla et le chocolat chaud des cafés de la Calle Real. Les 24 et 25, beaucoup ferment tôt : confirmez les horaires. Je vous prépare le programme ?',
      pt: 'O Natal em Salento é especial! Em dezembro a Plaza de Bolívar se ilumina e os villancicos tocam pelas ruas. Não perca o Mercado de Natal Artesanal no Parque Municipal, buñuelos com natilla e chocolate quente nos cafés da Calle Real. Em 24 e 25 muitos fecham cedo: confirme os horários. Monto o plano?',
      it: 'Il Natale a Salento è speciale! A dicembre la Plaza de Bolívar si illumina e i villancicos riempiono le strade. Non perderti il mercatino artigianale di Natale al Parque Municipal, i buñuelos con natilla e la cioccolata calda dei cafè di Calle Real. Il 24 e 25 molti chiudono presto: conferma gli orari. Ti preparo il piano?'
    },
    followUp: ['¿Mercado navideño?', '¿Qué comer en Navidad?', '¿Horarios del 24 y 25?']
  },
  {
    keywords: ['fiestas', 'celebración', 'feria', 'evento cultural', 'evento', 'eventos'],
    category: 'festivales',
    answer: {
      es: 'El Quindío tiene eventos todo el año. Festival del Café (junio), Yipao (octubre), Fiestas de Armenia (octubre), fiestas patronales municipales. Cada pueblo celebra sus tradiciones con música y gastronomía.',
      en: 'Quindío has events all year. Coffee Festival (June), Yipao (October), Armenia Festivals (October), municipal patron saint feasts. Each town celebrates its traditions with music and gastronomy.',
      de: 'Das Quindío hat das ganze Jahr über Veranstaltungen. Kaffee-Festival (Juni), Yipao (Oktober), Armenia-Fest (Oktober), kommunale Feste. Jedes Dorf feiert seine Traditionen mit Musik und Gastronomie.',
      fr: 'Le Quindío a des événements toute l\'année. Festival du Café (juin), Yipao (octobre), Fêtes d\'Armenia (octobre), fêtes patronales municipales. Chaque ville célèbre ses traditions avec musique et gastronomie.',
      pt: 'O Quindío tem eventos o ano todo. Festival do Café (junho), Yipao (outubro), Festas de Armenia (outubro), festas patronais municipais. Cada município celebra suas tradições com música e gastronomia.',
      it: 'Il Quindío ha eventi tutto l\'anno. Festival del Caffè (giugno), Yipao (ottobre), Feste di Armenia (ottobre), feste patronali comunali. Ogni paese celebra le sue tradizioni con musica e gastronomia.'
    },
    followUp: ['¿Próximo evento?', '¿En qué pueblo?', '¿Qué incluyen?']
  },
  {
    keywords: ['qué llevar', 'equipaje', 'ropa', 'mochila', 'preparar', 'llevo', 'llevar', 'qué llevo', 'maleta', 'maletas'],
    category: 'consejos',
    answer: {
      es: 'Para Salento lleva: ropa ligera en capas (18-24°C), zapatos de senderismo impermeables, protector solar, repelente, cámara, cargador portátil, chaqueta impermeable y botella reutilizable. Gorra para el sol.',
      en: 'For Salento pack: light layered clothing (18-24°C), waterproof hiking shoes, sunscreen, repellent, camera, portable charger, waterproof jacket and reusable bottle. Cap for sun.',
      de: 'Für Salento einpacken: leichte Schichtkleidung (18-24°C), wasserdichte Wanderschuhe, Sonnenschutz, Insektenschutz, Kamera, tragbarer Ladegerät, wasserdichte Jacke und wiederverwendbare Flasche. Mütze für die Sonne.',
      fr: 'Pour Salento, emportez : vêtements légers en couches (18-24°C), chaussures de randonnée imperméables, crème solaire, répulsif, appareil photo, chargeur portable, veste imperméable et bouteille réutilisable. Casquette pour le soleil.',
      pt: 'Para Salento leve: roupas leves em camadas (18-24°C), sapatos de caminhada impermeáveis, protetor solar, repelente, câmera, carregador portátil, jaqueta impermeável e garrafa reutilizável. Boné para o sol.',
      it: 'Per Salento portate: vestiti leggeri a strati (18-24°C), scarpe da trekking impermeabili, crema solare, repellente, fotocamera, caricatore portatile, giacca impermeabile e bottiglia riutilizzabile. Cappello per il sole.'
    },
    followUp: ['¿Para el Valle de Cocora?', '¿Qué meses?', '¿Presupuesto?']
  },
  {
    keywords: ['presupuesto', 'cuánto cuesta', 'dinero', 'gastar', 'económico'],
    category: 'consejos',
    answer: {
      es: 'Un viaje de 3-4 días: $800.000-$2.500.000 COP por persona. Incluye: alojamiento en finca ($150.000/noche), tours ($80.000-$200.000), comidas ($30.000-$80.000). Hostales desde $40.000. Presupuesto mochilero: $500.000-$800.000.',
      en: 'A 3-4 day trip: $800,000-$2,500,000 COP per person. Includes: farm lodging ($150,000/night), tours ($80,000-$200,000), meals ($30,000-$80,000). Hostels from $40,000. Backpacker budget: $500,000-$800,000.',
      de: 'Eine 3-4-Tage-Reise: $800.000-$2.500.000 COP pro Person. Inklusive: Unterkunft auf Farm ($150.000/Nacht), Touren ($80.000-$200.000), Mahlzeiten ($30.000-$80.000). Hostels ab $40.000. Rucksackbudget: $500.000-$800.000.',
      fr: 'Un voyage de 3-4 jours : 800 000 à 2 500 000 COP par personne. Inclut : hébergement en ferme (150 000/nuit), excursions (80 000-200 000), repas (30 000-80 000). Auberges à partir de 40 000. Budget sac à dos : 500 000-800 000.',
      pt: 'Uma viagem de 3-4 dias: $800.000-$2.500.000 COP por pessoa. Inclui: hospedagem em fazenda ($150.000/noite), tours ($80.000-$200.000), refeições ($30.000-$80.000). Hostels a partir de $40.000. Orçamento mochileiro: $500.000-$800.000.',
      it: 'Un viaggio di 3-4 giorni: $800.000-$2.500.000 COP a persona. Include: alloggio in fattoria ($150.000/notte), tour ($80.000-$200.000), pasti ($30.000-$80.000). Ostelli da $40.000. Budget zaino in spalla: $500.000-$800.000.'
    },
    followUp: ['¿Dónde ahorrar?', '¿Qué incluye?', '¿Tarjetas aceptan?']
  },
  {
    keywords: ['mejor época', 'cuándo ir', 'temporada', 'lluvia', 'seca',
      'clima en', 'weather in', 'météo en', 'wetter im', 'clima em', 'meteo a',
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
      'january', 'february', 'march', 'april', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
      'januar', 'februar', 'märz', 'juni', 'juli', 'oktober', 'dezember',
      'janvier', 'février', 'avril', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
      'janeiro', 'fevereiro', 'março', 'maio', 'junho', 'julho', 'setembro', 'outubro', 'dezembro',
      'gennaio', 'febbraio', 'aprile', 'maggio', 'giugno', 'luglio', 'settembre', 'ottobre', 'dicembre'],
    category: 'consejos',
    answer: {
      es: 'Diciembre a marzo y julio a agosto son temporada seca, ideales para senderismo. Temporada de lluvias (abril-mayo, octubre-noviembre): paisajes más verdes, cascadas con más caudal, menos turistas y tarifas más económicas.',
      en: 'December to March and July to August are dry season, ideal for hiking. Rainy season (April-May, October-November): greener landscapes, fuller waterfalls, fewer tourists and cheaper rates.',
      de: 'Dezember bis März und Juli bis August sind die Trockenzeit, ideal zum Wandern. Regenzeit (April-Mai, Oktober-November): grünere Landschaften, wasserführendere Wasserfälle, weniger Touristen und günstigere Preise.',
      fr: 'Décembre à mars et juillet à août sont la saison sèche, idéale pour la randonnée. Saison des pluies (avril-mai, octobre-novembre) : paysages plus verdoyants, cascades plus pleines, moins de touristes et tarifs plus bas.',
      pt: 'Dezembro a março e julho a agosto são a estação seca, ideal para caminhadas. Estação das chuvas (abril-maio, outubro-novembro): paisagens mais verdes, cachoeiras mais cheias, menos turistas e tarifas mais baratas.',
      it: 'Da dicembre a marzo e da luglio a agosto è la stagione seca, ideale per il trekking. Stagione delle piogge (aprile-maggio, ottobre-novembre): paesaggi più verdi, cascate più piene, meno turisti e tariffe più convenienti.'
    },
    followUp: ['¿Temporada baja?', '¿Precio mejor?', '¿Lloverá?']
  },
  {
    keywords: ['conectividad', 'wifi', 'señal', 'internet', 'celular'],
    category: 'consejos',
    answer: {
      es: 'Armenia y pueblos principales tienen buena cobertura 4G. Las fincas rurales pueden tener señal limitada (¡perfecto para desconectar!). WiFi gratuito en hoteles y restaurantes. Descarga mapas offline antes de ir.',
      en: 'Armenia and main towns have good 4G coverage. Rural farms may have limited signal (perfect to disconnect!). Free WiFi in hotels and restaurants. Download offline maps before going.',
      de: 'Armenia und die Hauptdörfer haben gute 4G-Abdeckung. Ländliche Farmen haben möglicherweise begrenzten Empfang (perfekt zum Disconnecten!). Kostenloses WLAN in Hotels und Restaurants. Laden Sie Offline-Karten herunter, bevor Sie gehen.',
      fr: 'Armenia et les principales villes ont une bonne couverture 4G. Les fermes rurales peuvent avoir un signal limité (parfait pour se déconnecter !). WiFi gratuit dans les hôtels et restaurants. Téléchargez les cartes hors ligne avant de partir.',
      pt: 'Armenia e as principais cidades têm boa cobertura 4G. As fazendas rurais podem ter sinal limitado (perfeito para desconectar!). WiFi gratuito em hotéis e restaurantes. Baixe mapas offline antes de ir.',
      it: 'Armenia e le città principali hanno una buona copertura 4G. Le fattorie rurali possono avere segnale limitato (perfetto per disconnettersi!). WiFi gratuito in hotel e ristoranti. Scaricate le mappe offline prima di partire.'
    },
    followUp: ['¿Dónde hay wifi?', '¿Señal en Cocora?', '¿Apps útiles?']
  },
  {
    keywords: ['cómo llegar', 'ruta', 'camino', 'dirección', 'transporte'],
    category: 'transporte',
    answer: {
      es: 'Desde Armenia: bus intermunicipal 45 min. Desde Pereira: bus hacia Armenia y conexión, 1 hora. En avión: Aeropuerto El Edén con vuelos desde Bogotá. Los Jeeps Willys conectan pueblos y son parte de la experiencia.',
      en: 'From Armenia: intermunicipal bus 45 min. From Pereira: bus to Armenia and connection, 1 hour. By plane: El Edén Airport with flights from Bogotá. Willys Jeeps connect towns and are part of the experience.',
      de: 'Von Armenia: Gemeinschaftsbus 45 Min. Von Pereira: Bus nach Armenia und Anschluss, 1 Std. Per Flugzeug: Flughafen El Edén mit Flügen aus Bogotá. Willys-Jeeps verbinden Dörfer und sind Teil des Erlebnisses.',
      fr: 'D\'Armenia : bus intermunicipal 45 min. De Pereira : bus vers Armenia et connexion, 1 h. En avion : aéroport El Edén avec des vols depuis Bogotá. Les Jeeps Willys relient les villages et font partie de l\'expérience.',
      pt: 'De Armenia: ônibus intermunicipal 45 min. De Pereira: ônibus para Armenia e conexão, 1 hora. De avião: Aeroporto El Edén com voos de Bogotá. Os Jeeps Willys conectam cidades e fazem parte da experiência.',
      it: 'Da Armenia: autobus intercomunale 45 min. Da Pereira: autobus per Armenia e collegamento, 1 ora. In aereo: Aeroporto El Edén con voli da Bogotá. I Jeep Willys collegano i paesi e fanno parte dell\'esperienza.'
    },
    followUp: ['¿Desde Bogotá?', '¿En carro?', '¿Aeropuerto?']
  },
  {
    keywords: ['hotel la floresta', 'la floresta salento', 'floresta salento'],
    category: 'hospedaje',
    answer: {
      es: 'Hotel La Floresta es buena opción para descansar en Salento con ambiente tranquilo y cercanía al centro. ¿Te interesa saber si está cerca del pueblo o si tienen wifi y parking?',
      en: 'Hotel La Floresta is a good option for a quiet stay in Salento close to the center. Do you want to know if it\'s near town or if it has Wi-Fi and parking?',
      de: 'Hotel La Floresta ist eine gute Option für einen ruhigen Aufenthalt in Salento in der Nähe des Zentrums. Möchten Sie wissen, ob es in der Nähe des Dorfes ist oder ob es WLAN und Parkplatz hat?',
      fr: 'L\'hôtel La Floresta est une bonne option pour un séjour tranquille à Salento près du centre. Voulez-vous savoir s\'il est près du village ou s\'il a du WiFi et un parking ?',
      pt: 'O Hotel La Floresta é uma boa opção para descansar em Salento com ambiente tranquilo e pertinho do centro. Você quer saber se fica perto da cidade ou se tem wifi e estacionamento?',
      it: 'L\'Hotel La Floresta è una buona opzione per un soggiorno tranquillo a Salento vicino al centro. Volete sapere se è vicino al villaggio o se ha Wi-Fi e parcheggio?'
    },
    followUp: ['¿Ubicación exacta?', '¿Tienen desayuno?', '¿Cerca del centro?'],
    relatedPlaces: [16]
  },
  {
    keywords: ['mirador las manos de dios', 'las manos de dios', 'manos de dios'],
    category: 'turismo',
    answer: {
      es: 'El Mirador Las Manos de Dios es muy visitado por su valor fotográfico y la vista del paisaje. Está en el Ecoparque Tu País, a 300 metros del cementerio. Entrada $12.000 COP, abierto 8am-6pm. Manos gigantes, cóndor, poporo, jeep cafetero.',
      en: 'Mirador Las Manos de Dios is very popular for its photo value and landscape view. In Ecoparque Tu País, 300m from the cemetery. Entry $12,000 COP, open 8am-6pm. Giant hands, condor, poporo, coffee jeep.',
      de: 'Der Aussichtspunkt Las Manos de Dios ist sehr beliebt wegen seines Fotowerts und der Landschaftsaussicht. Im Ecoparque Tu País, 300 m vom Friedhof entfernt. Eintritt $12.000 COP, geöffnet 8-18 Uhr. Riesenhände, Kondor, Poporo, Kaffee-Jeep.',
      fr: 'Le Mirador Las Manos de Dios est très fréquenté pour sa valeur photographique et sa vue sur le paysage. Dans l\'Ecoparque Tu País, à 300 m du cimetière. Entrée 12 000 $ COP, ouvert de 8h à 18h. Mains géantes, condor, poporo, jeep de café.',
      pt: 'O Mirador Las Manos de Dios é muito visitado por seu valor fotográfico e vista da paisagem. Fica no Ecoparque Tu País, a 300 metros do cemitério. Entrada $12.000 COP, aberto das 8h às 18h. Mãos gigantes, condor, poporo, jeep cafeiro.',
      it: 'Il Mirador Las Manos de Dios è molto visitato per il suo valore fotografico e la vista panoramica. Nell\'Ecoparque Tu País, a 300 metri dal cimitero. Ingresso $12.000 COP, aperto dalle 8 alle 18. Mani giganti, condor, poporo, jeep del caffè.'
    },
    followUp: ['¿Cómo llegar?', '¿Combina con otros planes?', '¿Mejor hora para fotos?'],
    relatedPlaces: [14]
  },
  {
    keywords: ['cascadas santa rita', 'santa rita salento', 'cascada santa rita', 'santa rita'],
    category: 'turismo',
    answer: {
      es: 'Las Cascadas Santa Rita son una joyita en Boquía. 4.8 km de caminata por bosque, montes, valle, antigua vía de tren, túnel y puente colgante. Entrada $5.000 COP. Hay segunda cascada por cavernas y zonas de camping.',
      en: 'Santa Rita Waterfalls are a hidden gem in Boquía. 4.8 km hike through forest, mountains, valley, old train track, tunnel and suspension bridge. Entry $5,000 COP. Second waterfall through caves and camping areas.',
      de: 'Die Santa Rita-Wasserfälle sind ein versteckter Schatz in Boquía. 4,8 km Wanderung durch Wald, Berge, Tal, alte Eisenbahnstrecke, Tunnel und Hängebrücke. Eintritt $5.000 COP. Zweiter Wasserfall durch Höhlen und Zeltplätze.',
      fr: 'Les Cascadas Santa Rita sont un joyau caché à Boquía. Randonnée de 4,8 km à travers la forêt, les montagnes, la vallée, l\'ancienne voie ferrée, un tunnel et un pont suspendu. Entrée 5 000 $ COP. Deuxième cascade à travers les grottes et les zones de camping.',
      pt: 'As Cascadas Santa Rita são uma joiazinha em Boquía. Trilha de 4,8 km por floresta, montanhas, vale, antiga via de trem, túnel e ponte pênsil. Entrada $5.000 COP. Tem uma segunda cachoeira por cavernas e áreas de camping.',
      it: 'Le Cascate Santa Rita sono un gioiello nascosto a Boquía. Percorso di 4,8 km attraverso foresta, montagne, valle, vecchia ferrovia, tunnel e ponte sospeso. Ingresso $5.000 COP. Seconda cascata attraverso caverne e aree campeggio.'
    },
    followUp: ['¿Cómo llegar a Boquía?', '¿Dificultad del sendero?', '¿Qué llevar?'],
    relatedPlaces: [15]
  },
  {
    keywords: ['finca cafetera don elias', 'finca don elias', 'don elias salento', 'coffee tour don elias'],
    category: 'turismo',
    answer: {
      es: 'La Finca Cafetera Don Elías es ideal para entender el café de verdad, desde la plantación hasta la taza. Experiencia auténtica y educativa. Ubicada en Vereda Palestina Km 4 de Salento. Tours 90 min, salidas cada hora 09:00-16:00. En venta: Café Premium (molido o grano) $50.000 COP con fermentación láctica controlada, Café Natural Premium $75.000 COP (pre-orden) y Taza Colombia $18.000 COP. Café orgánico, despachos dentro de Colombia. Idiomas: español, inglés y francés de muy buen nivel. Reserva vía página web en www.fincafedonelias.com, ¡se llena rápido!',
      en: 'Don Elías Coffee Farm is ideal to understand coffee from plant to cup. Authentic and educational experience. Located at Vereda Palestina Km 4, Salento. 90 min tours, hourly departures 09:00-16:00. For sale: Premium Coffee (ground or beans) $50,000 COP with controlled lactic fermentation, Natural Premium Coffee $75,000 COP (pre-order) and Colombia Mug $18,000 COP. Organic coffee, shipping within Colombia. Languages: Spanish, English, and French at excellent level. Book via our website www.fincafedonelias.com, fills up fast!',
      de: 'Die Kaffee-Farm Don Elías ist ideal, um Kaffee von der Pflanze bis zur Tasse zu verstehen. Authentisches und lehrreiches Erlebnis. Vereda Palestina Km 4, Salento. 90 Min. Touren, stündliche Abfahrten 09:00-16:00. Im Verkauf: Premium-Kaffee (gemahlen oder Bohnen) 50.000 COP mit kontrollierter Milchsäuregärung, Natural Premium-Kaffee 75.000 COP (Vorbestellung) und Kolumbien-Tasse 18.000 COP. Biologischer Kaffee, Versand innerhalb Kolumbiens. Sprachen: Spanisch, Englisch und Französisch auf hohem Niveau. Reservierung über unsere Website www.fincafedonelias.com, füllt sich schnell!',
      fr: 'La Finca Cafetera Don Elías est idéale pour comprendre le café de la plante à la tasse. Expérience authentique et éducative. Située à Vereda Palestina Km 4, Salento. Tours de 90 min, départs toutes les heures 09:00-16:00. En vente : Café Premium (moulu ou grains) 50 000 COP avec fermentation lactique contrôlée, Café Natural Premium 75 000 COP (précommande) et Tasse Colombie 18 000 COP. Café biologique, expéditions en Colombie. Langues : espagnol, anglais et français de très bon niveau. Réservation via notre site www.fincafedonelias.com, se remplit vite !',
      pt: 'A Finca Cafetera Don Elías é ideal para entender o café de verdade, da plantação até a xícara. Experiência autêntica e educativa. Localizada em Vereda Palestina Km 4, Salento. Tours de 90 min, saídas a cada hora 09:00-16:00. À venda: Café Premium (moído ou grãos) 50.000 COP com fermentação láctica controlada, Café Natural Premium 75.000 COP (pré-encomenda) e Caneca Colômbia 18.000 COP. Café orgânico, envios dentro da Colômbia. Idiomas: espanhol, inglês e francês de muito bom nível. Reserva via site www.fincafedonelias.com, enche rápido!',
      it: 'La Finca Cafetera Don Elías è ideale per capire il caffè dalla pianta alla tazza. Esperienza autentica e formativa. Situata a Vereda Palestina Km 4, Salento. Tour di 90 min, partenze orarie 09:00-16:00. In vendita: Caffè Premium (macinato o chicchi) 50.000 COP con fermentazione lattica controllata, Caffè Natural Premium 75.000 COP (pre-ordine) e Tazza Colombia 18.000 COP. Caffè biologico, spedizioni in Colombia. Lingue: spagnolo, inglese e francese di ottimo livello. Prenotazione via sito www.fincafedonelias.com, si riempie in fretta!'
    },
    followUp: ['¿Es recomendable reservar?', '¿Qué incluye?', '¿Cuánto dura?'],
    relatedPlaces: [17]
  },
  {
    keywords: ['al sabor de la leña', 'al sabor de la lena', 'sabor de la leña', 'comida de campo al sabor de la leña'],
    category: 'comida',
    answer: {
      es: 'Al Sabor de la Leña, en la Finca Cafetera Don Elías (Vereda Palestina Km 4), sirve comida de campo colombiana: desayunos hasta las 10:30 a.m. y almuerzos hasta las 2:30 p.m., con opciones vegetarianas. Abierto todos los días de 8:00 a.m. a 3:00 p.m., desde $20.000 COP. Reservas por WhatsApp al +57 311 773 7987. ¿Almuerzo, desayuno o vegetariano?',
      en: 'Al Sabor de la Leña, at Finca Cafetera Don Elías (Vereda Palestina Km 4), serves Colombian country cooking: breakfast until 10:30 a.m. and lunch until 2:30 p.m., with vegetarian options. Open daily 8:00 a.m. – 3:00 p.m., from COP 20,000. Reservations by WhatsApp +57 311 773 7987. Lunch, breakfast or vegetarian?',
      de: 'Al Sabor de la Leña, in der Finca Cafetera Don Elías (Vereda Palestina Km 4), serviert kolumbianische Landküche: Frühstück bis 10:30 Uhr und Mittagessen bis 14:30 Uhr, mit vegetarischen Optionen. Täglich geöffnet 8:00–15:00 Uhr, ab 20.000 COP. Reservierung per WhatsApp +57 311 773 7987. Mittagessen, Frühstück oder vegetarisch?',
      fr: 'Al Sabor de la Leña, à la Finca Cafetera Don Elías (Vereda Palestina Km 4), sert une cuisine de campagne colombienne : petit-déjeuner jusqu\'à 10h30 et déjeuner jusqu\'à 14h30, avec options végétariennes. Ouvert tous les jours de 8h00 à 15h00, à partir de 20 000 COP. Réservation par WhatsApp +57 311 773 7987. Déjeuner, petit-déjeuner ou végétarien ?',
      pt: 'Al Sabor de la Leña, na Finca Cafetera Don Elías (Vereda Palestina Km 4), serve cozinha de campo colombiana: café da manhã até 10h30 e almoço até 14h30, com opções vegetarianas. Aberto todos os dias das 8h00 às 15h00, a partir de COP 20.000. Reservas por WhatsApp +57 311 773 7987. Almoço, café da manhã ou vegetariano?',
      it: 'Al Sabor de la Leña, nella Finca Cafetera Don Elías (Vereda Palestina Km 4), propone cucina di campagna colombiana: colazione fino alle 10:30 e pranzo fino alle 14:30, con opzioni vegetariane. Aperto tutti i giorni dalle 8:00 alle 15:00, da 20.000 COP. Prenotazioni via WhatsApp +57 311 773 7987. Pranzo, colazione o vegetariano?'
    },
    followUp: ['¿Tienen opciones vegetarianas?', '¿Cómo reservar?', '¿Precio aproximado?'],
    relatedPlaces: [22]
  },
  {
    keywords: ['moto aventura 110', 'aventura 110', 'moto aventura'],
    category: 'experiencias',
    answer: {
      es: 'Moto Aventura 110 es una pista de minimotocross en Salento: los recorridos son únicamente dentro de la pista, en minimotos de 110 cc. Cada moto lleva 1 persona (casco, protecciones y póliza incluidos). ¿Tiempos, tarifas o cómo reservar?',
      en: 'Moto Aventura 110 is a minimotocross track in Salento: rides take place only on the track, on 110 cc minimotos. Each bike carries 1 person (helmet, protections and insurance included). Times, rates, or how to book?',
      de: 'Moto Aventura 110 ist eine Minimoto-Crosspiste in Salento: Die Fahrten finden ausschließlich auf der Strecke statt, mit 110-cc-Minimotos. Pro Motorrad fährt 1 Person (Helm, Protektionen und Versicherung inklusive). Zeiten, Preise oder Reservierung?',
      fr: 'Moto Aventura 110 est un circuit de minimotocross à Salento : les balades se font uniquement sur la piste, en minimotos de 110 cc. Chaque moto porte 1 personne (casque, protections et assurance inclus). Durées, tarifs ou réservation ?',
      pt: 'Moto Aventura 110 é uma pista de minimotocross em Salento: os percursos são apenas dentro da pista, em minimotos de 110 cc. Cada moto leva 1 pessoa (capacete, proteções e apólice incluídos). Tempos, preços ou como reservar?',
      it: 'Moto Aventura 110 è un circuito di minimotocross a Salento: i giri si svolgono solo sulla pista, con minimoto da 110 cc. Ogni moto porta 1 persona (casco, protezioni e polizza inclusi). Tempi, prezzi o come prenotare?'
    },
    followUp: ['¿Tiempos y tarifas?', '¿Cómo reservar?', '¿Qué se incluye?'],
    relatedPlaces: [19]
  },
  {
    keywords: ['cabalgatas cocora magic', 'cocora magic', 'cabalgatas salento', 'cabalgatas', 'caballo'],
    category: 'turismo',
    answer: {
      es: 'Cabalgatas Cocora Magic es opción para vivir el Valle de Cocora de forma distinta. Experiencia, paisaje y propuesta tradicional. Incluye recorrido con caballos entrenados. ¿Horario o recomendado para familias?',
      en: 'Cabalgatas Cocora Magic is an option to experience Cocora Valley differently. Experience, landscape and traditional proposal. Includes ride with trained horses. Schedule or family-friendly?',
      de: 'Cabalgatas Cocora Magic ist eine Option, das Cocora-Tal anders zu erleben. Erlebnis, Landschaft und traditionelles Angebot. Inklusive Ride mit trainierten Pferden. Zeitplan oder familienfreundlich?',
      fr: 'Cabalgatas Cocora Magic est une option pour vivre la vallée de Cocora différemment. Expérience, paysage et proposition traditionnelle. Inclut une promenade à cheval entraînés. Horaire ou adapté aux familles ?',
      pt: 'Cabalgatas Cocora Magic é uma opção para viver o Vale de Cocora de forma diferente. Experiência, paisagem e proposta tradicional. Inclui passeio com cavalos treinados. Horário ou recomendado para famílias?',
      it: 'Cabalgatas Cocora Magic è un\'opzione per vivere la Valle di Cocora in modo diverso. Esperienza, paesaggio e proposta tradizionale. Include cavalcata con cavalli addestrati. Orario o adatto alle famiglie?'
    },
    followUp: ['¿Incluye transporte?', '¿Es buena para familias?', '¿Cuánto dura?'],
    relatedPlaces: [20]
  },
  {
    keywords: ['fonda boquía', 'boquía restaurante', 'fonda salento'],
    category: 'comida',
    answer: {
      es: 'Fonda Boquía es útil si quieres comer bien en la zona rural de Salento. Sabor casero y local que buscan quienes vienen a Boquía. ¿Almuerzo, platos típicos o cerca de la cascada?',
      en: 'Fonda Boquía is useful for good food in Salento\'s rural area. Homemade and local flavor. Lunch, typical dishes, or near the waterfall?',
      de: 'Fonda Boquía ist nützlich für gutes Essen im ländlichen Bereich von Salento. Hausmacher- und lokaler Geschmack. Mittagessen, traditionelle Gerichte oder in der Nähe des Wasserfalls?',
      fr: 'La Fonda Boquía est utile pour une bonne nourriture dans la zone rurale de Salento. Saveur maison et locale. Déjeuner, plats typiques ou près de la cascade ?',
      pt: 'A Fonda Boquía é útil se você quer comer bem na zona rural de Salento. Sabor caseiro e local. Almoço, pratos típicos ou perto da cachoeira?',
      it: 'La Fonda Boquía è utile per mangiare bene nella zona rurale di Salento. Sapore casalingo e locale. Pranzo, piatti tipici o vicino alla cascata?'
    },
    followUp: ['¿Platos típicos?', '¿Buena para almuerzo?', '¿Cerca de la cascada?'],
    relatedPlaces: [21]
  },
  {
    keywords: ['cocora', 'valle', 'palmas', 'caballo', 'senderismo', 'hike'],
    category: 'turismo',
    answer: {
      es: '¡El Valle de Cocora es pura magia! Ve con Guías del Cocora - conocen cada sendero. Pueden conseguir Willys o caballos. Sal temprano (8am), lleva agua. La caminata es de 3-4 horas de pura belleza con palmas de cera de hasta 60 metros.',
      en: 'Cocora Valley is pure magic! Go with Guías del Cocora - they know every path. They can get Willys or horses. Leave early (8am), bring water. The hike is 3-4 hours of pure beauty with wax palms up to 60 meters.',
      de: 'Das Cocora-Tal ist reiner Zauber! Gehen Sie mit Guías del Cocora - sie kennen jeden Weg. Sie können Willys oder Pferde organisieren. Früh los (8 Uhr), Wasser mitnehmen. Die Wanderung dauert 3-4 Stunden reine Schönheit mit Palmenwachsbäumen bis 60 Meter.',
      fr: 'La vallée de Cocora est de la pure magie ! Allez avec Guías del Cocora - ils connaissent chaque sentier. Ils peuvent vous procurer un Willys ou des chevaux. Partez tôt (8h), emportez de l\'eau. La randonnée dure 3-4 heures de pure beauté avec des palmiers à cire jusqu\'à 60 mètres.',
      pt: 'O Vale de Cocora é pura magia! Vá com Guías del Cocora - eles conhecem cada trilha. Eles conseguem Willys ou cavalos. Saia cedo (8h), leve água. A caminhada é de 3-4 horas de pura beleza com palmeiras de cera de até 60 metros.',
      it: 'La Valle di Cocora è pura magia! Andate con Guías del Cocora - conoscono ogni sentiero. Possono procurarvi Willys o cavalli. Partite presto (ore 8), portate acqua. La passeggiata è di 3-4 ore di pura bellezza con palme di cera alte fino a 60 metri.'
    },
    followUp: ['¿Willys o caballo?', '¿Necesitas guía?', '¿Grupo grande?'],
    relatedPlaces: [104, 113]
  },
  {
    keywords: ['alto de la cruz', 'mirador alto de la cruz', 'mirador de salento', 'el mirador', 'mirador', 'cruz de salento'],
    category: 'turismo',
    answer: {
      es: 'El Alto de la Cruz te deja sin palabras - ahí se ve todo Salento y el valle como un cuadro. Son 15 minutos caminando desde el pueblo, pero las vistas valen cada paso. Ideal para fotos al atardecer.',
      en: 'Alto de la Cruz leaves you speechless - all of Salento and the valley like a painting. 15 minutes walking from town, views worth every step. Perfect for sunset photos.',
      de: 'Der Alto de la Cruz lässt Sie sprachlos zurück - von dort sehen Sie ganz Salento und das Tal wie ein Gemälde. 15 Minuten zu Fuß vom Dorf entfernt, der Ausblick ist jeden Schritt wert. Perfekt für Sonnenuntergangsfotos.',
      fr: 'L\'Alto de la Cruz vous laisse sans voix - on y voit tout Salento et la vallée comme un tableau. 15 minutes à pied du village, les vues valent chaque pas. Parfait pour les photos au coucher du soleil.',
      pt: 'O Alto de la Cruz te deixa sem palavras - de lá se vê todo Salento e o vale como um quadro. São 15 minutos caminhando da cidade, mas as vistas valem cada passo. Ideal para fotos ao pôr do sol.',
      it: 'L\'Alto de la Cruz vi lascia senza parole - da lì si vede tutto Salento e la valle come un dipinto. 15 minuti a piedi dal villaggio, le viste valgono ogni passo. Ideale per foto al tramonto.'
    },
    followUp: ['¿Cómo llegar?', '¿Mejor hora?', '¿Difícil el acceso?']
  },
  {
    keywords: ['transporte', 'bus', 'willys', 'jeep', 'jeeps', 'taxi', 'armenia', 'muevo', 'movilidad', 'por el pueblo', 'desplazarme'],
    category: 'transporte',
    answer: {
      es: 'Para moverte: buses al terminal de Armenia (45 min). Para el Valle de Cocora, los Willys salen del parque cada 30 min. Taxis y mototaxis en el centro para algo más rápido. ¿Para dónde vas?',
      en: 'To get around: buses to Armenia terminal (45 min). For Cocora, Willys leave from the park every 30 min. Taxis and mototaxis downtown for faster transport. Where are you going?',
      de: 'Zum Fortbewegen: Busse zum Terminal von Armenia (45 Min.). Für Cocora fahren die Willys alle 30 Min. vom Platz ab. Taxis und Mototaxis im Zentrum für etwas Schnelleres. Wohin wollen Sie?',
      fr: 'Pour se déplacer : bus vers la gare d\'Armenia (45 min). Pour Cocora, les Willys partent de la place toutes les 30 min. Taxis et mototaxis dans le centre pour plus de rapidité. Où allez-vous ?',
      pt: 'Para se locomover: ônibus para o terminal de Armenia (45 min). Para Cocora, os Willys saem da praça a cada 30 min. Táxis e mototáxis no centro para algo mais rápido. Onde você vai?',
      it: 'Per muoversi: autobus per il terminal di Armenia (45 min). Per Cocora, i Willys partono dalla piazza ogni 30 min. Taxi e mototaxi in centro per qualcosa di più veloce. Dove state andando?'
    },
    followUp: ['¿A dónde vas?', '¿Cuántas personas?', '¿Presupuesto?']
  },
  {
    keywords: ['emergencia', 'help', 'ayuda', 'médico', 'policía', 'cruz roja', 'enfermo', 'enfermedad', 'me siento mal', 'doctor', 'hospital', 'hospitales', 'clínica'],
    category: 'emergencias',
    answer: {
      es: 'Emergencias: marca 123 (Policía, Bomberos, Ambulancia). Cruz Roja: 132. Hospital más cercano en Armenia (39 km). Farmacias en el centro para cosas menores. ¿Qué tipo de emergencia?',
      en: 'Emergencies: call 123 (Police, Fire, Ambulance). Red Cross: 132. Nearest hospital in Armenia (39 km). Pharmacies downtown for minor things. What type of emergency?',
      de: 'Notfälle: rufen Sie 123 an (Polizei, Feuerwehr, Rettungsdienst). Rotes Kreuz: 132. Nächstes Krankenhaus in Armenia (39 km). Apotheken im Zentrum für Kleinigkeiten. Welche Art von Notfall?',
      fr: 'Urgences : appelez le 123 (Police, Pompiers, Ambulance). Croix-Rouge : 132. Hôpital le plus proche à Armenia (39 km). Pharmacies au centre pour les petites choses. Quel type d\'urgence ?',
      pt: 'Emergências: ligue 123 (Polícia, Bombeiros, Ambulância). Cruz Vermelha: 132. Hospital mais próximo em Armenia (39 km). Farmácias no centro para coisas menores. Que tipo de emergência?',
      it: 'Emergenze: chiamate il 123 (Polizia, Vigili del Fuoco, Ambulanza). Croce Rossa: 132. Ospedale più vicino ad Armenia (39 km). Farmacie in centro per le cose minori. Che tipo di emergenza?'
    },
    followUp: ['¿Tipo de emergencia?', '¿Dirección específica?']
  },
  {
    keywords: ['dinero', 'cambio', 'atm', 'banco', 'efectivo', 'cajero', 'cajeros', 'sacar dinero', 'retiro', 'plata'],
    category: 'general',
    answer: {
      es: 'Hay cajeros en el centro pero a veces se quedan sin efectivo. Trae suficiente dinero. Algunos hoteles como Camino Nacional pueden hacer cambio de divisas. ¿Necesitas cambio específico?',
      en: 'There are ATMs downtown but sometimes they run out of cash. Bring enough money. Some hotels like Camino Nacional can exchange currency. Do you need specific change?',
      de: 'Es gibt Automaten im Zentrum, aber manchmal haben sie kein Bargeld. Bringen Sie genug Geld mit. Einige Hotels wie Camino Nacional können Geld wechseln. Benötigen Sie eine bestimmte Währung?',
      fr: 'Il y a des distributeurs au centre mais parfois ils sont à court d\'argent. Apportez suffisamment d\'argent. Certains hôtels comme Camino Nacional peuvent faire du change. Avez-vous besoin d\'une monnaie spécifique ?',
      pt: 'Tem caixas no centro mas às vezes ficam sem dinheiro. Traga dinheiro suficiente. Alguns hotéis como Camino Nacional podem fazer câmbio. Você precisa de alguma moeda específica?',
      it: 'Ci sono bancomat in centro ma a volte restano senza contanti. Portate abbastanza denaro. Alcuni hotel come Camino Nacional possono cambiare valuta. Avete bisogno di una valuta specifica?'
    },
    followUp: ['¿Cambio específico?', '¿Dólares/Euros?'],
    relatedPlaces: [5]
  },
  {
    keywords: ['clima', 'tiempo', 'lluvia', 'frío', 'ropa'],
    category: 'general',
    answer: {
      es: 'El clima tiene dos caras - días calurosos (20-25°C) y noches que refrescan (10-15°C). En tardes y noches suele llover, especialmente en temporada de lluvia. Trae ropa ligera pero no olvides una chaqueta.',
      en: 'The weather has two faces - warm days (20-25°C) and cool nights (10-15°C). Afternoons and evenings usually rain, especially in rainy season. Bring light clothes but don\'t forget a jacket.',
      de: 'Das Wetter hat zwei Gesichter - warme Tage (20-25°C) und kühle Nächte (10-15°C). Nachmittags und abends regnet es oft, besonders in der Regenzeit. Bringen Sie leichte Kleidung mit, vergessen Sie aber nicht eine Jacke.',
      fr: 'Le temps a deux visages - jours chauds (20-25°C) et nuits fraîches (10-15°C). Les après-midi et soirées sont généralement pluvieux, surtout en saison des pluies. Apportez des vêtements légers mais n\'oubliez pas une veste.',
      pt: 'O clima tem duas caras - dias quentes (20-25°C) e noites que refrescam (10-15°C). Às tardes e noites costuma chover, especialmente na estação chuvosa. Traga roupas lemas mas não esqueça uma jaqueta.',
      it: 'Il clima ha due volti - giorni caldi (20-25°C) e notti fresche (10-15°C). Piove spesso di pomeriggio e sera, specialmente nella stagione delle piogge. Portate vestiti leggeri ma non dimenticate una giacca.'
    },
    followUp: ['¿Qué época visitás?', '¿Para el valle?']
  },
  {
    keywords: ['foto', 'selfie', 'instagram', 'postales'],
    category: 'turismo',
    answer: {
      es: '¡Para fotos, Salento es un estudio natural! Valle de Cocora con palmas gigantes, calles coloridas, Alto de la Cruz al atardecer. Ve temprano o tarde para evitar multitudes y tener mejor luz.',
      en: 'For photos, Salento is a natural studio! Cocora Valley with giant palms, colorful streets, Alto de la Cruz at sunset. Go early or late to avoid crowds and have better light.',
      de: 'Für Fotos ist Salento ein natürliches Studio! Cocora-Tal mit riesigen Palmen, bunte Straßen, Alto de la Cruz bei Sonnenuntergang. Gehen Sie früh oder spät, um Menschenmassen zu vermeiden und besseres Licht zu haben.',
      fr: 'Pour les photos, Salento est un studio naturel ! Vallée de Cocora avec des palmiers géants, rues colorées, Alto de la Cruz au coucher du soleil. Allez tôt ou tard pour éviter les foules et avoir une meilleure lumière.',
      pt: 'Para fotos, Salento é um estúdio natural! Vale de Cocora com palmeiras gigantes, ruas coloridas, Alto de la Cruz ao pôr do sol. Vá cedo ou tarde para evitar multidões e ter melhor luz.',
      it: 'Per le foto, Salento è uno studio naturale! Valle di Cocora con palme giganti, strade colorate, Alto de la Cruz al tramonto. Andate presto o tardi per evitare folle e avere una luce migliore.'
    },
    followUp: ['¿Mejores spots?', '¿Golden hour?', '¿Fotos con palmas?']
  },
  {
    keywords: ['senderismo', 'caminata', 'trekking', 'bosque'],
    category: 'turismo',
    answer: {
      es: '¡Senderismo para todos! Santa Rita en Boquía (4.8 km, moderado), Valle de Cocora (fácil), caminatas por fincas cafeteras. Todas con guías disponibles. ¿Qué nivel de dificultad prefieres?',
      en: 'Hiking for everyone! Santa Rita in Boquía (4.8 km, moderate), Cocora Valley (easy), walks through coffee farms. All with guides available. What difficulty level do you prefer?',
      de: 'Wandern für alle! Santa Rita in Boquía (4,8 km, moderat), Cocora-Tal (leicht), Wanderungen durch Kaffeebauernhöfe. Alle mit verfügbaren Guides. Welches Schwierigkeitsniveau bevorzugen Sie?',
      fr: 'Randonnée pour tous ! Santa Rita à Boquía (4,8 km, modéré), vallée de Cocora (facile), promenades à travers les plantations de café. Toutes avec guides disponibles. Quel niveau de difficulté préférez-vous ?',
      pt: 'Caminhada para todos! Santa Rita em Boquía (4,8 km, moderado), Vale de Cocora (fácil), caminhadas por fazendas de café. Todas com guias disponíveis. Que nível de dificuldade você prefere?',
      it: 'Trekking per tutti! Santa Rita a Boquía (4,8 km, moderato), Valle di Cocora (facile), passeggiate attraverso le fattorie di caffè. Tutte con guide disponibili. Che livello di difficoltà preferite?'
    },
    followUp: ['¿Fácil o moderado?', '¿Con guía o solo?', '¿Duración preferida?'],
    relatedPlaces: [15, 104]
  },
  {
    keywords: ['boquía', 'vereda', 'zona rural', 'campos', 'finca'],
    category: 'turismo',
    answer: {
      es: 'Boquía es la vereda rural de Salento, a 5 minutos del pueblo. Cascada Santa Rita y fincas cafeteras. Donde se vive la verdadera cultura rural del Quindío.',
      en: 'Boquía is Salento\'s rural vereda, 5 minutes from town. Santa Rita Waterfall and coffee farms. Where you experience the true rural culture of Quindío.',
      de: 'Boquía ist die ländliche Vereda von Salento, 5 Minuten vom Dorf entfernt. Santa-Rita-Wasserfall und Kaffeebauernhöfe. Wo man die wahre ländliche Kultur des Quindío erlebt.',
      fr: 'Boquía est la vereda rurale de Salento, à 5 minutes du village. Cascade Santa Rita et plantations de café. Là où l\'on vit la véritable culture rurale du Quindío.',
      pt: 'Boquía é a vereda rural de Salento, a 5 minutos da cidade. Cachoeira Santa Rita e fazendas de café. Onde se vive a verdadeira cultura rural do Quindío.',
      it: 'Boquía è la vereda rurale di Salento, a 5 minuti dal villaggio. Cascata Santa Rita e fattorie di caffè. Dove si vive la vera cultura rurale del Quindío.'
    },
    followUp: ['¿Cascada Santa Rita?', '¿Fincas cafeteras?', '¿Cómo llegar?'],
    relatedPlaces: [15]
  },
  // ═══════════════════════════════════════════════════════════
  // DEFENSIVOS
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['peligro', 'inseguro', 'no vengas', 'alarmante', 'cierre', 'riesgo', 'seguro', 'es seguro', 'tranquilo'],
    category: 'defensivo',
    answer: {
      es: '¡Tranquilo, hermano! Por ahí corren rumores falsos, pero acá en el pueblo todo está en marcha. Salento está seguro y operativo al 100% - los Jeeps van, los restaurantes abren, y los hostales tienen disponibilidad. ¡Ven con tranquilidad!',
      en: 'Relax, friend! False rumors out there, but here everything is running. Salento is safe and 100% operational - Jeeps run, restaurants open, hostels available. Come with peace of mind!',
      de: 'Keine Sorge, Freund! Dort draußen kursieren falsche Gerüchte, aber hier läuft alles. Salento ist sicher und zu 100% betriebsbereit - die Jeeps fahren, die Restaurants öffnen, die Hostels sind verfügbar. Kommen Sie mit ruhigem Gewissen!',
      fr: 'Pas de souci, ami ! Des rumeurs fausses circulent là-dehors, mais ici tout fonctionne. Salento est sûr et opérationnel à 100% - les Jeeps roulent, les restaurants ouvrent, les auberges sont disponibles. Venez l\'esprit tranquille !',
      pt: 'Tranquilo, amigo! Por aí circulam falsos rumores, mas aqui tudo está funcionando. Salento está seguro e operacional 100% - os Jeeps andam, os restaurantes abrem, os hostais têm disponibilidade. Venha tranquilo!',
      it: 'Tranquillo, amico! Girano voci false là fuori, ma qui tutto funziona. Salento è sicuro e al 100% operativo - i Jeeps circolano, i ristoranti aprono, gli ostelli sono disponibili. Venite tranquillo!'
    },
    followUp: ['¿Qué puedo hacer hoy?', '¿Necesito reservar?', '¿Cómo llegar seguro?'],
    relatedPlaces: [5],
    isDefensive: true,
    urgency: 'high',
    defensiveActions: ['Ver estado oficial', 'Contactar hostales', 'Planificar itinerario'],
    sources: ['Red de Prestadores', 'Alcaldía de Salento', 'Policía Turística']
  },
  {
    keywords: ['vías cerradas', 'carreteras bloqueadas', 'no puedo llegar', 'acceso bloqueado'],
    category: 'defensivo',
    answer: {
      es: '¡Eso no es cierto! Las vías a Salento están completamente operativas. La ruta desde Armenia (45 min) y Pereira (1 hora) está en buen estado. Los Jeeps salen cada 30 minutos al Valle de Cocora.',
      en: 'That\'s not true! Roads to Salento are completely operational. Route from Armenia (45 min) and Pereira (1 hour) in good condition. Jeeps leave every 30 minutes to Cocora Valley.',
      de: 'Das stimmt nicht! Die Straßen nach Salento sind vollständig betriebsbereit. Die Route von Armenia (45 Min.) und Pereira (1 Std.) ist in gutem Zustand. Die Jeeps fahren alle 30 Minuten zum Cocora-Tal ab.',
      fr: 'Ce n\'est pas vrai ! Les routes vers Salento sont complètement opérationnelles. L\'itinéraire depuis Armenia (45 min) et Pereira (1 h) est en bon état. Les Jeeps partent toutes les 30 minutes pour la vallée de Cocora.',
      pt: 'Isso não é verdade! As estradas para Salento estão completamente operacionais. A rota de Armenia (45 min) e Pereira (1 hora) está em bom estado. Os Jeeps saem a cada 30 minutos para o Vale de Cocora.',
      it: 'Non è vero! Le strade per Salento sono completamente operative. Il percorso da Armenia (45 min) e Pereira (1 ora) è in buone condizioni. I Jeeps partono ogni 30 minuti per la Valle di Cocora.'
    },
    followUp: ['¿Cómo llegar desde Armenia?', '¿Ruta desde Pereira?', '¿Transporte disponible?'],
    relatedPlaces: [113],
    isDefensive: true,
    urgency: 'high',
    defensiveActions: ['Ver reporte de vías', 'Consultar carreteras', 'Planificar ruta'],
    sources: ['INVÍAS Quindío', 'Policía de Tránsito', 'Transportadores']
  },
  {
    keywords: ['todo cerrado', 'no hay servicios', 'sin turistas', 'pueblo fantasma'],
    category: 'defensivo',
    answer: {
      es: '¡Nada más lejos de la realidad! Salento está vibrante con vida y turismo. Restaurantes llenos, cafeterías sirviendo, artesanías abiertas, calles llenas de visitantes. ¡El pueblo está más vivo que nunca!',
      en: 'Nothing further from truth! Salento is vibrant with life and tourism. Full restaurants, coffee shops serving, crafts open, streets full of visitors. The town is more alive than ever!',
      de: 'Dem ist nicht so! Salento lebt und pulsiert voller Tourismus. Restaurants voll, Cafés geöffnet, Kunsthandwerk geöffnet, Straßen voller Besucher. Das Dorf ist lebendiger als je zuvor!',
      fr: 'Rien de plus faux ! Salento est vibrante de vie et de tourisme. Restaurants pleins, cafés ouverts, artisanat ouvert, rues pleines de visiteurs. Le village est plus vivant que jamais !',
      pt: 'Nada mais longe da realidade! Salento está vibrante com vida e turismo. Restaurantes lotados, cafés servindo, artesanatos abertos, ruas cheias de visitantes. A cidade está mais viva do que nunca!',
      it: 'Niente di più lontano dalla realtà! Salento è vibrante di vita e turismo. Ristoranti pieni, caffè aperti, artigianato aperto, strade piene di visitatori. Il villaggio è più vivo che mai!'
    },
    followUp: ['¿Restaurantes disponibles?', '¿Actividades hoy?', '¿Hoteles disponibles?'],
    relatedPlaces: [5, 32, 45],
    isDefensive: true,
    urgency: 'medium',
    defensiveActions: ['Ver directorio', 'Contactar comercios', 'Revisar disponibilidad'],
    sources: ['Cámara de Comercio', 'Asociación de Comerciantes', 'Observatorio Turístico']
  },
  {
    keywords: ['valle peligroso', 'no ir al cocora', 'cascada insegura', 'senderismo riesgoso'],
    category: 'defensivo',
    answer: {
      es: '¡El Valle de Cocora es seguro y mágico! Miles lo visitan diariamente sin problemas. Senderos señalizados, guías certificados, servicios de emergencia. ¡Uno de los destinos más seguros de Colombia!',
      en: 'Cocora Valley is safe and magical! Thousands visit daily without issues. Marked trails, certified guides, emergency services. One of Colombia\'s safest destinations!',
      de: 'Das Cocora-Tal ist sicher und magisch! Tausende besuchen es täglich ohne Probleme. Markierte Wege, zertifizierte Guides, Notdienste. Eines der sichersten Reiseziele Kolumbiens!',
      fr: 'La vallée de Cocora est sûre et magique ! Des milliers la visitent quotidiennement sans problème. Sentiers balisés, guides certifiés, services d\'urgence. L\'un des destinations les plus sûres de Colombie !',
      pt: 'O Vale de Cocora é seguro e mágico! Milhares o visitam diariamente sem problemas. Trilhas sinalizadas, guias certificados, serviços de emergência. Um dos destinos mais seguros da Colômbia!',
      it: 'La Valle di Cocora è sicura e magica! Migliaia la visitano quotidianamente senza problemi. Sentieri segnalati, guide certificate, servizi di emergenza. Una delle destinazioni più sicure della Colombia!'
    },
    followUp: ['¿Cabalgatas disponibles?', '¿Mejor hora?', '¿Guías recomendados?'],
    relatedPlaces: [104, 20],
    isDefensive: true,
    urgency: 'high',
    defensiveActions: ['Ver estado oficial', 'Reservar con guías', 'Revisar clima'],
    sources: ['Parques Nacionales', 'Corporación Autónoma', 'Guías certificados']
  },
  {
    keywords: ['crisis', 'emergencia', 'desastre', 'evacuación', 'abandono'],
    category: 'defensivo',
    answer: {
      es: '¡Absolutamente no! No hay ninguna crisis, emergencia o desastre en Salento. Es un destino turístico normal y pacífico. La comunidad está tranquila, los negocios operativos. ¡Estamos aquí para recibirte!',
      en: 'Absolutely not! No crisis, emergency or disaster in Salento. It\'s a normal and peaceful tourist destination. Community calm, businesses operational. We\'re here to welcome you!',
      de: 'Auf keinen Fall! Es gibt keine Krise, keinen Notfall und keine Katastrophe in Salento. Es ist ein normales und friedliches Touristenziel. Die Gemeinde ist ruhig, die Geschäfte betriebsbereit. Wir sind hier, Sie willkommen zu heißen!',
      fr: 'Absolument pas ! Il n\'y a ni crise, ni urgence, ni catastrophe à Salento. C\'est une destination touristique normale et paisible. Communauté calme, commerces opérationnels. Nous sommes là pour vous accueillir !',
      pt: 'Absolutamente não! Não há nenhuma crise, emergência ou desastre em Salento. É um destino turístico normal e pacífico. A comunidade está tranquila, os negócios operacionais. Estamos aqui para recebê-lo!',
      it: 'Assolutamente no! Non c\'è nessuna crisi, emergenza o disastro a Salento. È una destinazione turistica normale e pacifica. La comunità è calma, le attività operative. Siamo qui per accogliervi!'
    },
    followUp: ['¿Planes disponibles?', '¿Restaurantes abiertos?', '¿Hoteles disponibles?'],
    relatedPlaces: [5, 111],
    isDefensive: true,
    urgency: 'high',
    defensiveActions: ['Ver reporte oficial', 'Contactar autoridades', 'Consultar boletines'],
    sources: ['Gobernación del Quindío', 'Alcaldía de Salento', 'Defensa Civil']
  },
  // ═══════════════════════════════════════════════════════════
  // HOSPEDAJE
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['hospedaje', 'hostal', 'hostales', 'hotel', 'hoteles', 'dónde dormir', 'dormir', 'duermo', 'duerme', 'airbnb', 'camping', 'posada', 'alojamiento', 'dónde me hospedo', 'dormitorio'],
    category: 'hospedaje',
    answer: {
      es: 'Para dormir en Salento tienes de todo: hostales y hoteles boutique en el centro del pueblo, fincas hoteleras con vista al valle (¡la experiencia más mágica!), y el Camping en las Cascadas de Santa Rita para los más aventureros. Te recomiendo reservar con anticipación, sobre todo en temporada alta (diciembre-marzo). ¿Quieres que te ayude con opciones según tu presupuesto?',
      en: 'For sleeping in Salento you have everything: hostels and boutique hotels in the town center, farm hotels with valley views (the most magical experience!), and the Camping at Santa Rita Waterfalls for the adventurous. I recommend booking in advance, especially in high season (December-March). Want help with options for your budget?',
      de: 'Zum Übernachten in Salento gibt es alles: Hostels und Boutique-Hotels im Stadtzentrum, Bauernhöfe mit Talblick (das magischste Erlebnis!) und der Campingplatz an den Santa-Rita-Wasserfällen für Abenteurer. Ich empfehle, im Voraus zu buchen, besonders in der Hochsaison (Dezember-März). Brauchen Sie Hilfe nach Budget?',
      fr: 'Pour dormir à Salento, il y en a pour tous les goûts : auberges et hôtels boutiques au centre, fermes-hôtels avec vue sur la vallée (l\'expérience la plus magique !) et le camping aux Cascades de Santa Rita pour les aventuriers. Je recommande de réserver à l\'avance, surtout en haute saison (décembre-mars). Besoin d\'aide selon votre budget ?',
      pt: 'Para dormir em Salento tem de tudo: hostels e hotéis boutique no centro da cidade, fazendas-hotel com vista para o vale (a experiência mais mágica!) e o Camping nas Cachoeiras de Santa Rita para os mais aventureiros. Recomendo reservar com antecedência, especialmente na alta temporada (dezembro-março). Quer ajuda com opções para o seu orçamento?',
      it: 'Per dormire a Salento c\'è di tutto: ostelli e hotel boutique nel centro, agriturismi con vista sulla valle (l\'esperienza più magica!) e il campeggio alle Cascate di Santa Rita per gli più avventurosi. Consiglio di prenotare in anticipo, soprattutto in alta stagione (dicembre-marzo). Serve aiuto con opzioni per il tuo budget?'
    },
    followUp: ['¿Hoteles con vista?', '¿Fincas cafeteras?', '¿Cómo reservar?'],
    relatedPlaces: [5, 15]
  },
  // ═══════════════════════════════════════════════════════════
  // CÓMO LLEGAR / UBICACIÓN
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['cómo llego', 'como llego', 'llego a salento', 'llegar a salento', 'ubicación', 'dónde queda', 'donde queda', 'lejos de bogotá', 'distancia', 'kilómetros', 'cuánto está'],
    category: 'transporte',
    answer: {
      es: 'Salento queda en las montañas del Quindío, a 1.895 metros de altura. Desde Armenia son 45 minutos por carretera pavimentada (buses cada hora desde el terminal), desde Pereira una hora y media, y desde Bogotá unas 9-10 horas por la vía al Llano o en avión hasta Armenia/Pereira. ¡El camino ya es parte de la aventura con esas vistas de montaña!',
      en: 'Salento sits in the mountains of Quindío, at 1,895 meters. From Armenia it\'s 45 minutes on paved road (hourly buses from the terminal), from Pereira an hour and a half, and from Bogotá about 9-10 hours via the Llano road or by plane to Armenia/Pereira. The journey is part of the adventure with those mountain views!',
      de: 'Salento liegt in den Bergen des Quindío, auf 1.895 Metern Höhe. Von Armenia sind es 45 Minuten auf gepflasterter Straße (stündliche Busse vom Terminal), von Pereira anderthalb Stunden und von Bogotá etwa 9-10 Stunden über die Llano-Straße oder per Flugzeug nach Armenia/Pereira. Der Weg ist mit diesen Bergblicken schon Teil des Abenteuers!',
      fr: 'Salento se trouve dans les montagnes du Quindío, à 1 895 mètres d\'altitude. Depuis Armenia, 45 minutes par route pavée (bus toutes les heures depuis le terminal), depuis Pereira une heure et demie, et depuis Bogotá environ 9-10 heures par la route du Llano ou en avion vers Armenia/Pereira. Le trajet fait déjà partie de l\'aventure avec ces vues de montagne !',
      pt: 'Salento fica nas montanhas do Quindío, a 1.895 metros de altitude. De Armenia são 45 minutos por estrada pavimentada (ônibus a cada hora do terminal), de Pereira uma hora e meia, e de Bogotá cerca de 9-10 horas pela estrada do Llano ou de avião para Armenia/Pereira. O caminho já faz parte da aventura com essas vistas de montanha!',
      it: 'Salento si trova nelle montagne del Quindío, a 1.895 metri di altitudine. Da Armenia sono 45 minuti su strada asfaltata (bus ogni ora dal terminal), da Pereira un\'ora e mezza, e da Bogotá circa 9-10 ore via la strada del Llano o in aereo per Armenia/Pereira. Il viaggio è già parte dell\'avventura con quelle viste di montagna!'
    },
    followUp: ['¿Cómo llego desde Armenia?', '¿Hay buses?', '¿Cuál es la mejor ruta?'],
    relatedPlaces: [113]
  },
  // ═══════════════════════════════════════════════════════════
  // QUÉ HACER / VISITAR
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['qué hacer', 'que hacer', 'qué puedo hacer', 'que puedo hacer', 'visitar', 'actividades', 'planes', 'cosas que hacer', 'qué recomiendas', 'recomiendas hacer'],
    category: 'turismo',
    answer: {
      es: 'En Salento no te aburres ni un segundo: cabalgatas entre palmas de cera en el Valle de Cocora, caminatas a las Cascadas de Santa Rita, tours cafeteros por las fincas, miradores con vistas de postal como el Alto de la Cruz, canopy y rafting para los aventureros, y el pueblo lleno de cafés, arte y sonrisas. ¿Tienes 1 día o una semana? ¡Te armo el plan perfecto!',
      en: 'In Salento you will never be bored: horseback rides among wax palms in the Valle de Cocora, hikes to Santa Rita Waterfalls, coffee tours through the farms, postcard viewpoints like Alto de la Cruz, canopy and rafting for adventurers, and a town full of coffee, art and smiles. One day or a week? I\'ll build the perfect plan!',
      de: 'In Salento wird Ihnen nie langweilig: Reitausflüge zwischen Wachspalmen im Valle de Cocora, Wanderungen zu den Santa-Rita-Wasserfällen, Kaffeetouren durch die Farmen, Postkarten-Aussichtspunkte wie der Alto de la Cruz, Canopy und Rafting für Abenteurer, und ein Dorf voller Kaffee, Kunst und Lächeln. Ein Tag oder eine Woche? Ich baue Ihnen den perfekten Plan!',
      fr: 'À Salento, on ne s\'ennuie jamais : balades à cheval parmi les palmiers à cire dans la Vallée de Cocora, randonnées aux Cascades de Santa Rita, tours du café dans les fermes, belvédères carte postale comme l\'Alto de la Cruz, tyrolienne et rafting pour les aventuriers, et un village plein de café, d\'art et de sourires. Un jour ou une semaine ? Je vous construis le plan parfait !',
      pt: 'Em Salento você nunca vai se entediar: cavalgadas entre palmeiras de cera no Vale de Cocora, trilhas para as Cachoeiras de Santa Rita, tours de café pelas fazendas, mirantes de postal como o Alto de la Cruz, tirolesa e rafting para os aventureiros, e a cidade cheia de café, arte e sorrisos. Um dia ou uma semana? Monto o plano perfeito!',
      it: 'A Salento non ci si annoia mai: escursioni a cavallo tra palme da cera nella Valle de Cocora, trekking alle Cascate di Santa Rita, tour del caffè nelle fattorie, belvedere da cartolina come l\'Alto de la Cruz, tirolesa e rafting per gli avventurosi, e un paese pieno di caffè, arte e sorrisi. Un giorno o una settimana? Ti preparo il piano perfetto!'
    },
    followUp: ['¿Cabalgatas?', '¿Cascadas?', '¿Coffee tours?', '¿Qué hago hoy?'],
    relatedPlaces: [104, 15, 20]
  },
  // ═══════════════════════════════════════════════════════════
  // RESTAURANTES / COMIDA GENERAL
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['restaurante', 'restaurantes', 'dónde como', 'donde puedo almorzar', 'almorzar', 'comida', 'comer', 'menú', 'almuerzo', 'cena', 'desayuno', 'vegano', 'vegetariano', 'opciones vegetarianas'],
    category: 'gastronomia',
    answer: {
      es: 'En Salento comes como un rey: la trucha arcoíris es la reina indiscutible, pero también están el sancocho de gallina, las arepas de chócolo, el sudado montañero y los buñuelos con natilla. Hay restaurantes en la plaza principal, fondas de barrio con comida casera y los mesones de las fincas cafeteras con vista al valle. ¡Pregunta por el menú del día, sale buenísimo!',
      en: 'In Salento you eat like royalty: rainbow trout is the undisputed queen, but there\'s also hen sancocho, chócolo arepas, mountain sudado and buñuelos with natilla. There are restaurants on the main square, neighborhood diners with home cooking and farm restaurants with valley views. Ask for the daily menu, it\'s great value!',
      de: 'In Salento isst man wie ein König: Die Regenbogenforelle ist die unangefochtene Königin, aber es gibt auch Hähnchensancocho, Chócolo-Arepas, Bergsudado und Buñuelos mit Natilla. Es gibt Restaurants am Hauptplatz,Neighborhood-Lokale mit Hausmannskost und Bauernhof-Restaurants mit Talblick. Fragen Sie nach dem Tagesmenü, es lohnt sich!',
      fr: 'À Salento, on mange comme un roi : la truite arc-en-ciel est la reine incontestée, mais il y a aussi le sancocho de poule, les arepas de chócolo, le sudado montañero et les buñuelos avec natilla. Il y a des restaurants sur la place principale, des gargotes de quartier à la cuisine maison et des restaurants de fermes avec vue sur la vallée. Demandez le menu du jour, c\'est très avantageux !',
      pt: 'Em Salento você come como um rei: a truta arco-íris é a rainha incontestável, mas também tem sancocho de galinha, arepas de chócolo, sudado montanheiro e buñuelos com natilla. Há restaurantes na praça principal, fondas de bairro com comida caseira e restaurantes de fazendas com vista para o vale. Pergunte pelo cardápio do dia, vale muito a pena!',
      it: 'A Salento si mangia come un re: la trota iridea è la regina indiscussa, ma ci sono anche il sancocho di gallina, le arepas di chócolo, il sudado montañero e i buñuelos con natilla. Ci sono ristoranti sulla piazza principale, trattorie di quartiere con cibo casalingo e ristoranti di fattoria con vista sulla valle. Chiedi il menù del giorno, conviene molto!'
    },
    followUp: ['¿Dónde como trucha?', '¿Comida típica?', '¿Desayuno?'],
    relatedPlaces: [45, 21]
  },
  // ═══════════════════════════════════════════════════════════
  // MUSEOS
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['museo', 'museos'],
    category: 'turismo',
    answer: {
      es: 'Si te gusta la cultura, Salento tiene sorpresas: el Museo de la Historia de Salento cuenta la historia del pueblo y del café, y en Armenia (a 45 min) está el famoso Museo del Oro Quimbaya con piezas precolombinas espectaculares. También hay galerías de arte y tiendas de artesanías por todo el centro. ¡La cultura cafetera se vive en cada rincón!',
      en: 'If you love culture, Salento has surprises: the Salento History Museum tells the story of the town and coffee, and in Armenia (45 min away) there\'s the famous Quimbaya Gold Museum with spectacular pre-Columbian pieces. There are also art galleries and craft shops all over downtown. Coffee culture is lived in every corner!',
      de: 'Wenn Sie Kultur mögen, hat Salento Überraschungen: Das Museum der Geschichte von Salento erzählt die Geschichte der Stadt und des Kaffees, und in Armenia (45 Min. entfernt) gibt es das berühmte Quimbaya-Goldmuseum mit spektakulären prähistorischen Stücken. Es gibt auch Kunstgalerien und Kunsthandwerksläden im ganzen Zentrum. Kaffeekultur erlebt man in jeder Ecke!',
      fr: 'Si vous aimez la culture, Salento a des surprises : le Musée de l\'Histoire de Salento raconte l\'histoire de la ville et du café, et à Armenia (à 45 min) se trouve le célèbre Musée de l\'Or Quimbaya avec des pièces précolombiennes spectaculaires. Il y a aussi des galeries d\'art et des boutiques d\'artisanat dans tout le centre. La culture du café se vit à chaque coin !',
      pt: 'Se você gosta de cultura, Salento tem surpresas: o Museu da História de Salento conta a história da cidade e do café, e em Armenia (a 45 min) está o famoso Museu do Ouro Quimbaya com peças pré-colombianas espetaculares. Também há galerias de arte e lojas de artesanato por todo o centro. A cultura do café se vive em cada canto!',
      it: 'Se ami la cultura, Salento ha sorprese: il Museo della Storia di Salento racconta la storia della città e del caffè, e ad Armenia (a 45 min) c\'è il famoso Museo dell\'Oro Quimbaya con pezzi precolombiani spettacolari. Ci sono anche gallerie d\'arte e negozi di artigianato in tutto il centro. La cultura del caffè si vive in ogni angolo!'
    },
    followUp: ['¿Museo del Oro?', '¿Armenia?', '¿Arte local?'],
    relatedPlaces: []
  },
  // ═══════════════════════════════════════════════════════════
  // SALUDO / IDENTIDAD / UBICACIÓN GENERAL
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['hola', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches', 'gracias', 'quién eres', 'que eres', 'qué eres', 'cómo te llamas', 'qué sabes', 'háblame', 'háblame de', 'info', 'información'],
    category: 'general',
    answer: {
      es: '¡Bienvenido a Salento, hermano! Soy Don Chucho, arriero quindiano y tu guía local. Este pueblo de montaña es una joya del Eje Cafetero: café de especialidad, el Valle de Cocora con sus palmas de cera, cascadas, calidez de gente paisa y paisajes que parecen pintados. ¿En qué te ayudo hoy: hospedaje, comida, tours o rutas?',
      en: 'Welcome to Salento, friend! I\'m Don Chucho, a Quindío muleteer and your local guide. This mountain town is a jewel of the Coffee Axis: specialty coffee, the Valle de Cocora with its wax palms, waterfalls, warm paisa people and landscapes that look painted. How can I help today: lodging, food, tours or routes?',
      de: 'Willkommen in Salento, Freund! Ich bin Don Chucho, ein Quindío-Lastträger und Ihr lokaler Führer. Diese Bergstadt ist ein Juwel der Kaffeeachse: Spezialitätenkaffee, das Valle de Cocora mit seinen Wachspalmen, Wasserfälle, herzliche Paisa-Menschen und Landschaften wie gemalt. Wobei kann ich heute helfen: Unterkunft, Essen, Touren oder Routen?',
      fr: 'Bienvenue à Salento, ami ! Je suis Don Chucho, un muletier du Quindío et votre guide local. Cette ville de montagne est un joyau de l\'Axe du Café : café de spécialité, la Vallée de Cocora avec ses palmiers à cire, des cascades, des gens chaleureux et des paysages peints. Comment puis-je aider aujourd\'hui : hébergement, nourriture, tours ou itinéraires ?',
      pt: 'Bem-vindo a Salento, amigo! Sou Don Chucho, um tropeiro do Quindío e seu guia local. Esta cidade de montanha é uma joia do Eixo Cafeeiro: café de especialidade, o Vale de Cocora com suas palmeiras de cera, cachoeiras, gente acolhedora e paisagens que parecem pintadas. Em que posso ajudar hoje: hospedagem, comida, tours ou rotas?',
      it: 'Benvenuto a Salento, amico! Sono Don Chucho, un mulattiere del Quindío e la tua guida locale. Questa città di montagna è una gemma dell\'Asse del Caffè: caffè di specialità, la Valle de Cocora con le sue palme da cera, cascate, gente calorosa e paesaggi dipinti. Come posso aiutarti oggi: alloggio, cibo, tour o percorsi?'
    },
    followUp: ['¿Qué puedo hacer?', '¿Dónde como?', '¿Cómo llego?'],
    relatedPlaces: []
  },
  {
    keywords: ['dónde queda salento', 'salento queda', 'en qué departamento', 'qué es salento', 'pueblo salento', 'cuánto está de', 'a cuántos km'],
    category: 'general',
    answer: {
      es: 'Salento es un pueblo del departamento del Quindío, en el corazón del Eje Cafetero colombiano. Queda a 45 minutos de Armenia (la capital), a 1 hora de Pereira y a unas 9-10 horas de Bogotá por carretera. Está a 1.895 metros de altura entre montañas verdes — de ahí su clima fresco y sus vistas increíbles.',
      en: 'Salento is a town in the Quindío department, in the heart of Colombia\'s Coffee Axis. It\'s 45 minutes from Armenia (the capital), 1 hour from Pereira and about 9-10 hours from Bogotá by road. It sits at 1,895 meters among green mountains — hence its cool climate and incredible views.',
      de: 'Salento ist eine Stadt im Departamento Quindío, im Herzen der kolumbianischen Kaffeeachse. Sie liegt 45 Minuten von Armenia (der Hauptstadt), 1 Stunde von Pereira und etwa 9-10 Stunden von Bogotá entfernt. Auf 1.895 Metern zwischen grünen Bergen — daher das kühle Klima und die unglaublichen Ausblicke.',
      fr: 'Salento est une ville du département du Quindío, au cœur de l\'Axe du Café colombien. Elle se trouve à 45 minutes d\'Armenia (la capitale), 1 heure de Pereira et environ 9-10 heures de Bogotá par la route. À 1 895 mètres d\'altitude entre montagnes vertes — d\'où son climat frais et ses vues incroyables.',
      pt: 'Salento é uma cidade do departamento do Quindío, no coração do Eixo Cafeeiro colombiano. Fica a 45 minutos de Armenia (a capital), 1 hora de Pereira e cerca de 9-10 horas de Bogotá de carro. Está a 1.895 metros de altitude entre montanhas verdes — daí seu clima fresco e suas vistas incríveis.',
      it: 'Salento è una città del dipartimento del Quindío, nel cuore dell\'Asse del Caffè colombiano. Si trova a 45 minuti da Armenia (la capitale), 1 ora da Pereira e circa 9-10 ore da Bogotá in auto. È a 1.895 metri tra montagne verdi — da qui il clima fresco e le viste incredibili.'
    },
    followUp: ['¿Cómo llego?', '¿Qué es el Quindío?', '¿Clima?'],
    relatedPlaces: []
  },
  // ═══════════════════════════════════════════════════════════
  // SERVICIOS DEL SITIO (domicilios, transporte, reservas, pautantes)
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['domicilio', 'domicilios', 'pedido a domicilio', 'pedir desde el hotel', 'pedido desde el hotel', 'entrega a domicilio', 'delivery', 'llevar comida', 'comida a domicilio', 'pedir comida'],
    category: 'comida',
    answer: {
      es: '¿Se te antoja algo y estás en el hotel? En salentoalamano.com tienes Pedidos a Domicilio: los mejores restaurantes de Salento en un solo pedido. Pide desde la comodidad de tu habitación, directamente con los restaurantes y sin intermediarios; te lo llevan hasta el hotel. Entra a la sección de Pedidos a Domicilio (servicios/pedidos-domicilio.html), arma tu pedido de trucha, sancocho o tinto, y relájate.',
      en: 'Craving something while at your hotel? On salentoalamano.com you have Home Delivery: Salento\'s best restaurants in a single order. Order from the comfort of your room, straight to the restaurants with no middlemen; they bring it to your hotel. Open the Home Delivery section (servicios/pedidos-domicilio.html), build your trout, sancocho or tinto order, and relax.',
      de: 'Du hast Hunger und bist im Hotel? Auf salentoalamano.com gibt es Essenslieferung: die besten Restaurants von Salento in einer einzigen Bestellung. Bestelle bequem aus deinem Zimmer, direkt beim Restaurant und ohne Zwischenhändler; sie bringen es bis zu deinem Hotel. Öffne den Bereich Essenslieferung (servicios/pedidos-domicilio.html), stelle deine Bestellung zusammen und entspanne.',
      fr: 'Vous avez faim et vous êtes à l\'hôtel ? Sur salentoalamano.com, vous avez la livraison à domicile : les meilleurs restaurants de Salento en une seule commande. Commandez depuis la confort de votre chambre, directement auprès des restaurants et sans intermédiaires ; on vous l\'apporte à l\'hôtel. Ouvrez la section Livraison à domicile (servicios/pedidos-domicilio.html), composez votre commande et détendez-vous.',
      pt: 'Com fome e no hotel? No salentoalamano.com você tem Delivery: os melhores restaurantes de Salento em um só pedido. Peça do conforto do seu quarto, direto com os restaurantes e sem intermediários; eles levam até o hotel. Abra a seção de Delivery (servicios/pedidos-domicilio.html), monte seu pedido de truta, sancocho ou tinto e relaxe.',
      it: 'Hai fame e sei in hotel? Su salentoalamano.com c\'è il servizio di consegna a domicilio: i migliori ristoranti di Salento in un unico ordine. Ordina dalla comodità della tua camera, direttamente ristoranti e senza intermediari; te lo portano in hotel. Apri la sezione Consegna a domicilio (servicios/pedidos-domicilio.html), componi il tuo ordine e rilassati.'
    },
    followUp: ['¿Qué restaurantes entregan en hoteles?', '¿Cuánto tarda?', '¿Cómo pago?'],
    relatedPlaces: []
  },
  {
    keywords: ['reservar hotel', 'reserva de hotel', 'reservas de hoteles', 'reservar habitación', 'reserva alojamiento', 'hotel online', 'disponibilidad hotel', 'reservar en línea'],
    category: 'hospedaje',
    answer: {
      es: 'Para reservar tu hospedaje directo con los hoteles de Salento, sin comisiones ni intermediarios, usa la sección Reservas de Hoteles en salentoalamano.com (servicios/reservas-hoteles.html). Ahí comparas habitaciones, precios y contactos directos de Hotel La Floresta, Green House, Camino Nacional, Mahalo Hostel y más. Toca el botón de reserva y escribes al hotel por WhatsApp.',
      en: 'To book your stay directly with Salento hotels, with no fees or middlemen, use the Hotel Bookings section on salentoalamano.com (servicios/reservas-hoteles.html). There you compare rooms, prices and direct contacts of Hotel La Floresta, Green House, Camino Nacional, Mahalo Hostel and more. Tap the booking button and message the hotel on WhatsApp.',
      de: 'Um deine Unterkunft direkt bei den Hotels von Salento zu buchen, ohne Gebühren oder Zwischenhändler, nutze den Bereich Hotelbuchungen auf salentoalamano.com (servicios/reservas-hoteles.html). Dort vergleichst du Zimmer, Preise und direkte Kontakte von Hotel La Floresta, Green House, Camino Nacional, Mahalo Hostel und mehr. Tippe auf die Buchungsschaltfläche und schreibe dem Hotel über WhatsApp.',
      fr: 'Pour réserver votre hébergement directement auprès des hôtels de Salento, sans commissions ni intermédiaires, utilisez la section Réservations d\'hôtels sur salentoalamano.com (servicios/reservas-hoteles.html). Vous y comparez chambres, prix et contacts directs de l\'Hotel La Floresta, Green House, Camino Nacional, Mahalo Hostel et plus. Touchez le bouton de réservation et écrivez à l\'hôtel sur WhatsApp.',
      pt: 'Para reservar sua hospedagem diretamente com os hotéis de Salento, sem comissões nem intermediários, use a seção Reservas de Hotéis em salentoalamano.com (servicios/reservas-hoteles.html). Lá você compara quartos, preços e contatos diretos do Hotel La Floresta, Green House, Camino Nacional, Mahalo Hostel e mais. Toque no botão de reserva e fale com o hotel pelo WhatsApp.',
      it: 'Per prenotare il tuo soggiorno direttamente negli hotel di Salento, senza commissioni né intermediari, usa la sezione Prenotazioni hotel su salentoalamano.com (servicios/reservas-hoteles.html). Qui confronti camere, prezzi e contatti diretti di Hotel La Floresta, Green House, Camino Nacional, Mahalo Hostel e altri. Tocca il pulsante di prenotazione e scrivi all\'hotel su WhatsApp.'
    },
    followUp: ['¿Qué hoteles hay?', '¿Tienen precio por noche?', '¿Cómo escribo al hotel?'],
    relatedPlaces: [1, 2]
  },
  {
    keywords: ['servicio de transporte', 'transporte privado', 'traslado aeropuerto', 'contratar transporte', 'transporte salento', 'llevar al aeropuerto', 'traslado'],
    category: 'transporte',
    answer: {
      es: 'Si necesitas moverte, la sección Transporte de salentoalamano.com (servicios/transporte-salento.html) te muestra todo: jeeps Willys a la entrada del Valle de Cocora, taxis, transporte privado Armenia–Salento y traslados a tu hotel. Todo con contactos directos y tarifas de referencia, sin intermediarios.',
      en: 'If you need to get around, the Transport section on salentoalamano.com (servicios/transporte-salento.html) shows you everything: Willys jeeps at the Cocora Valley entrance, taxis, private Armenia–Salento transport and transfers to your hotel. All with direct contacts and reference fares, no middlemen.',
      de: 'Wenn du dich fortbewegen musst, zeigt dir der Transportbereich auf salentoalamano.com (servicios/transporte-salento.html) alles: Willys-Jeeps am Eingang des Cocora-Tals, Taxis, privaten Transport Armenia–Salento und Transfers zu deinem Hotel. Alles mit direkten Kontakten und Referenzpreisen, ohne Zwischenhändler.',
      fr: 'Si vous devez vous déplacer, la section Transport sur salentoalamano.com (servicios/transporte-salento.html) vous montre tout : jeeps Willys à l\'entrée de la Vallée de Cocora, taxis, transport privé Armenia–Salento et transferts vers votre hôtel. Avec contacts directs et tarifs de référence, sans intermédiaires.',
      pt: 'Se você precisa se locomover, a seção Transporte em salentoalamano.com (servicios/transporte-salento.html) mostra tudo: jeeps Willys na entrada do Vale do Cocora, táxis, transporte privado Armenia–Salento e transfers para o seu hotel. Tudo com contatos diretos e tarifas de referência, sem intermediários.',
      it: 'Se ti devi muovere, la sezione Trasporti su salentoalamano.com (servicios/transporte-salento.html) ti mostra tutto: jeeps Willys all\'ingresso della Valle di Cocora, taxi, trasporto privato Armenia–Salento e transfer per il tuo hotel. Tutto con contatti diretti e tariffe di riferimento, senza intermediari.'
    },
    followUp: ['¿Cómo llego al Valle de Cocora?', '¿Cuánto cuesta un taxi?', '¿Hay transporte de Armenia?'],
    relatedPlaces: []
  },
  {
    keywords: ['página verificada', 'páginas verificadas', 'pautante', 'pautantes', 'categorías', 'directorio local', 'dónde ver los servicios', 'verificado'],
    category: 'general',
    answer: {
      es: 'Todo en salentoalamano.com está organizado por categorías: alojamientos, restaurantes, coffee tours, experiencias y servicios. Los que llevan la insignia ★ Pautante tienen página propia con fotos, planes y reserva directa por WhatsApp, y aparecen primero en cada categoría. Empieza en la sección Categorías y filtra lo que buscas.',
      en: 'Everything on salentoalamano.com is organized by categories: accommodations, restaurants, coffee tours, experiences and services. Those with the ★ Pautante badge have their own page with photos, plans and direct WhatsApp booking, and appear first in each category. Start at the Categories section and filter what you\'re looking for.',
      de: 'Alles auf salentoalamano.com ist nach Kategorien organisiert: Unterkünfte, Restaurants, Coffee Tours, Erlebnisse und Dienstleistungen. Die mit dem ★-Pautante-Abzeichen haben eine eigene Seite mit Fotos, Plänen und direkter WhatsApp-Buchung und erscheinen zuerst in jeder Kategorie. Starte im Bereich Kategorien und filtere, was du suchst.',
      fr: 'Tout sur salentoalamano.com est organisé par catégories : hébergements, restaurants, coffee tours, expériences et services. Ceux qui portent le badge ★ Pautante ont leur propre page avec photos, plans et réservation directe sur WhatsApp, et apparaissent en premier dans chaque catégorie. Commencez par la section Catégories et filtrez ce que vous cherchez.',
      pt: 'Tudo em salentoalamano.com é organizado por categorias: hospedagem, restaurantes, coffee tours, experiências e serviços. Os que têm o selo ★ Pautante têm página própria com fotos, planos e reserva direta pelo WhatsApp, e aparecem primeiro em cada categoria. Comece na seção Categorias e filtre o que procura.',
      it: 'Tutto su salentoalamano.com è organizzato per categorie: alloggi, ristoranti, coffee tour, esperienze e servizi. Quelli con il badge ★ Pautante hanno una pagina propria con foto, piani e prenotazione diretta su WhatsApp e compaiono per primi in ogni categoria. Inizia dalla sezione Categorie e filtra quello che cerchi.'
    },
    followUp: ['¿Qué categorías hay?', '¿Qué es un pautante?', '¿Dónde veo los tours?'],
    relatedPlaces: []
  },
  {
    keywords: ['cocoratrek', 'cocora trek', 'trek cocora', 'caminata cocora con operador', 'tours cocoratrek'],
    category: 'experiencias',
    answer: {
      es: 'CocoraTrek es operador local de caminatas y tours: Bosque de Palmas, Acaime, Morrogacho, Carbonera, paseo en bicicleta, inmersión cafetera, mono aullador y pueblos del Quindío. Incluye guía, transporte, entradas y seguro. Reserva directo por WhatsApp +57 315 214 6468 y mira los planes en la página CocoraTrek del sitio.',
      en: 'CocoraTrek is a local operator of hikes and tours: Palm Forest, Acaime, Morrogacho, Carbonera, bike ride, coffee immersion, howler monkey and Quindío towns. Guide, transport, tickets and insurance included. Book directly on WhatsApp +57 315 214 6468 and see the plans on the site\'s CocoraTrek page.',
      de: 'CocoraTrek ist ein lokaler Betreiber von Wanderungen und Touren: Palmenwald, Acaime, Morrogacho, Carbonera, Fahrradtour, Kaffee-Immersion, Brüllaffe und Orte des Quindío. Guide, Transport, Eintritte und Versicherung inklusive. Direkt buchen per WhatsApp +57 315 214 6468 und die Pläne auf der CocoraTrek-Seite ansehen.',
      fr: 'CocoraTrek est un opérateur local de randonnées et de tours : Forêt des palmiers, Acaime, Morrogacho, Carbonera, vélo, immersion café, singe hurleur et villages du Quindío. Guide, transport, entrées et assurance inclus. Réservez directement sur WhatsApp +57 315 214 6468 et voyez les formules sur la page CocoraTrek du site.',
      pt: 'CocoraTrek é um operador local de caminhadas e tours: Bosque das Palmeiras, Acaime, Morrogacho, Carbonera, passeio de bicicleta, imersão cafetera, macaco-alugado e povos do Quindío. Guia, transporte, entradas e seguro incluídos. Reserve direto pelo WhatsApp +57 315 214 6468 e veja os planos na página CocoraTrek do site.',
      it: 'CocoraTrek è un operatore locale di camminate e tour: Bosco delle palme, Acaime, Morrogacho, Carbonera, giro in bicicetta, immersione caffè, scimmia urlante e paesi del Quindío. Guida, trasporto, ingressi e assicurazione inclusi. Prenota direttamente su WhatsApp +57 315 214 6468 e guarda i piani nella pagina CocoraTrek del sito.'
    },
    followUp: ['¿Qué tours tienen?', '¿Cuánto cuesta?', '¿Cómo reservo?'],
    relatedPlaces: [122]
  },
  {
    keywords: ['realidad aumentada', 'realidad', 'filtro ar', 'cámara aumentada'],
    category: 'general',
    answer: {
      es: 'Salento a la Mano tiene una sección de Realidad Aumentada: abre servicios/realidad-aumentada.html con la cámara de tu celular y apunta a los puntos señalizados del pueblo para ver contenido aumentado sobre Salento. Es gratis y no necesitas instalar nada.',
      en: 'Salento a la Mano has an Augmented Reality section: open servicios/realidad-aumentada.html with your phone camera and point at the marked spots in town to see augmented content about Salento. It\'s free and you don\'t need to install anything.',
      de: 'Salento a la Mano hat einen Bereich für Erweiterte Realität: Öffne servicios/realidad-aumentada.html mit der Kamera deines Handys und richte sie auf die markierten Stellen im Ort, um erweiterten Inhalt über Salento zu sehen. Es ist kostenlos und du musst nichts installieren.',
      fr: 'Salento a la Mano dispose d\'une section Réalité augmentée : ouvrez servicios/realidad-aumentada.html avec l\'appareil photo de votre téléphone et pointez vers les points signalés du village pour voir du contenu augmenté sur Salento. C\'est gratuit et rien à installer.',
      pt: 'Salento a la Mano tem uma seção de Realidade Aumentada: abra servicios/realidad-aumentada.html com a câmera do seu celular e aponte para os pontos sinalizados da cidade para ver conteúdo aumentado sobre Salento. É grátis e você não precisa instalar nada.',
      it: 'Salento a la Mano ha una sezione di Realtà aumentata: apri servicios/realidad-aumentada.html con la fotocamera del telefono e punta verso i punti segnalati del paese per vedere contenuti aumentati su Salento. È gratuito e non devi installare nulla.'
    },
    followUp: ['¿Dónde están los puntos?', '¿Es gratis?', '¿Necesito app?'],
    relatedPlaces: []
  },
  {
    keywords: ['tour cafetero', 'tour del cafe', 'tour de cafe', 'tour cafe', 'coffee tour', 'coffee tours', 'cuanto cuesta el tour', 'precio tour cafetero', 'experiencia cafetera', 'finca cafetera tour'],
    category: 'cafe',
    answer: {
      es: 'Los coffee tours en Salento duran entre 1 y 3 horas y cuestan aproximadamente $80.000-$200.000 COP por persona, según la finca y lo que incluyan. Opciones reconocidas: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour y Finca Hotel El Ocaso. Reserva con anticipación, sobre todo en temporada alta. ¿Quiere uno educativo, familiar o con cata?',
      en: 'Coffee tours in Salento last 1-3 hours and cost about COP 80,000-200,000 per person, depending on the farm and inclusions. Well-known options: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour and Finca Hotel El Ocaso. Book ahead, especially in high season. Do you want an educational, family-friendly or tasting tour?',
      de: 'Kaffeetouren in Salento dauern 1-3 Stunden und kosten etwa 80.000-200.000 COP pro Person, je nach Farm und Leistungen. Bekannte Optionen: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour und Finca Hotel El Ocaso. Buchen Sie frühzeitig, besonders in der Hochsaison. Möchten Sie eine lehrreiche, familienfreundliche oder Verkostungs-Tour?',
      fr: 'Les coffee tours à Salento durent 1 à 3 heures et coûtent environ 80 000 à 200 000 COP par personne, selon la ferme et les inclusions. Options connues : Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour et Finca Hotel El Ocaso. Réservez à l\'avance, surtout en haute saison. Vous préférez une visite éducative, familiale ou avec dégustation ?',
      pt: 'Os coffee tours em Salento duram de 1 a 3 horas e custam cerca de COP 80.000-200.000 por pessoa, dependendo da fazenda e do que incluem. Opções conhecidas: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour e Finca Hotel El Ocaso. Reserve com antecedência, especialmente na alta temporada. Você quer um tour educativo, para famílias ou com degustação?',
      it: 'I coffee tour a Salento durano 1-3 ore e costano circa 80.000-200.000 COP a persona, a seconda della fattoria e di ciò che includono. Opzioni note: Finca Don Eduardo, Finca Cafetera Don Elías, El Recuerdo Coffee Tour e Finca Hotel El Ocaso. Prenota in anticipo, soprattutto in alta stagione. Preferisci un tour educativo, per famiglie o con degustazione?'
    },
    followUp: ['¿Cuál es el mejor?', '¿Incluye cata?', '¿Hay en inglés?']
  },
  {
    keywords: ['artesanias', 'artesania', 'comprar artesanias', 'donde comprar artesanias', 'souvenir', 'souvenirs', 'recuerdos', 'recuerdo', 'guadua', 'mochilas', 'cesteria', 'tejidos'],
    category: 'artesanias',
    answer: {
      es: 'Las artesanías de Salento son memoria viva: mochilas, tejidos en lana, cestería en guadua, tallas en madera, café y chocolate local. La Calle Real y la Plaza de Bolívar concentran talleres y tiendas; también hay ferias artesanales algunos fines de semana. Lleva efectivo y compra directo al artesano. ¿Busca algo en especial?',
      en: 'Salento crafts are living memory: bags, wool textiles, guadua basketry, wood carvings, local coffee and chocolate. Calle Real and Plaza de Bolívar concentrate workshops and shops; there are also craft fairs some weekends. Bring cash and buy directly from the artisan. Are you looking for something specific?',
      de: 'Das Kunsthandwerk von Salento ist lebendige Erinnerung: Taschen, Wolltextilien, Guadua-Korbflechtkunst, Holzschnitzereien, lokaler Kaffee und Schokolade. Calle Real und Plaza de Bolívar konzentrieren Werkstätten und Geschäfte; an manchen Wochenenden gibt es auch Kunsthandwerksmärkte. Bringen Sie Bargeld mit und kaufen Sie direkt beim Handwerker. Suchen Sie etwas Bestimmtes?',
      fr: 'L\'artisanat de Salento est une mémoire vivante : sacs, textiles en laine, vannerie en guadua, sculptures sur bois, café et chocolat locaux. La Calle Real et la Plaza de Bolívar concentrent ateliers et boutiques ; il y a aussi des foires artisanales certains week-ends. Emportez des espèces et achetez directement à l\'artisan. Vous cherchez quelque chose en particulier ?',
      pt: 'O artesanato de Salento é memória viva: bolsas, tecidos de lã, cestaria em guadua, entalhes em madeira, café e chocolate local. A Calle Real e a Plaza de Bolívar concentram oficinas e lojas; também há feiras artesanais em alguns fins de semana. Leve dinheiro e compre direto do artesão. Procura algo específico?',
      it: 'L\'artigianato di Salento è memoria viva: borse, tessuti in lana, cesteria in guadua, intagli in legno, caffè e cioccolato locali. La Calle Real e la Plaza de Bolívar concentrano laboratori e negozi; ci sono anche fiere artigianali in alcuni fine settimana. Porta contanti e compra direttamente dall\'artigiano. Cerchi qualcosa in particolare?'
    },
    followUp: ['¿Dónde comprar?', '¿Qué es típico?', '¿Aceptan tarjeta?']
  },
  {
    keywords: ['aceptan tarjeta', 'pagar con tarjeta', 'tarjeta de credito', 'tarjeta debito', 'efectivo', 'cajero', 'atm', 'dinero', 'pago', 'pagar'],
    category: 'consejos',
    answer: {
      es: 'En Salento muchos restaurantes, cafés y tiendas aceptan tarjeta, pero los puestos de la plaza, artesanos y algunos transportes prefieren efectivo. Hay cajeros en el pueblo y más opciones en Armenia. Lleva algo de efectivo para propinas, artesanías y buses. ¿Necesita un cajero cerca?',
      en: 'In Salento many restaurants, cafés and shops accept cards, but square stalls, artisans and some transport prefer cash. There are ATMs in town and more options in Armenia. Bring some cash for tips, crafts and buses. Do you need a nearby ATM?',
      de: 'In Salento akzeptieren viele Restaurants, Cafés und Geschäfte Karten, aber Marktstände, Handwerker und manche Transporte bevorzugen Bargeld. Es gibt Geldautomaten im Ort und mehr Optionen in Armenia. Nehmen Sie etwas Bargeld für Trinkgelder, Handwerk und Busse mit. Brauchen Sie einen Geldautomaten in der Nähe?',
      fr: 'À Salento, beaucoup de restaurants, cafés et boutiques acceptent la carte, mais les étals de la place, les artisans et certains transports préfèrent les espèces. Il y a des distributeurs dans le village et plus d\'options à Armenia. Emportez un peu d\'espèces pour les pourboires, l\'artisanat et les bus. Besoin d\'un distributeur proche ?',
      pt: 'Em Salento, muitos restaurantes, cafés e lojas aceitam cartão, mas as barracas da praça, artesãos e alguns transportes preferem dinheiro. Há caixas eletrônicos na cidade e mais opções em Armenia. Leve algum dinheiro para gorjetas, artesanato e ônibus. Precisa de um caixa eletrônico perto?',
      it: 'A Salento molti ristoranti, caffè e negozi accettano carte, ma le bancarelle della piazza, gli artigiani e alcuni trasporti preferiscono contanti. Ci sono bancomat in paese e più opzioni ad Armenia. Porta un po\' di contanti per mance, artigianato e autobus. Ti serve un bancomat vicino?'
    },
    followUp: ['¿Dónde hay cajero?', '¿Aceptan tarjeta en el valle?', '¿Puedo pagar con dólares?']
  },
  {
    keywords: ['estacionamiento', 'parqueadero', 'parking', 'donde parquear', 'parquear', 'carro', 'auto'],
    category: 'transporte',
    answer: {
      es: 'Salento es pequeño y las calles se congestionan; hay parqueaderos privados cerca de la plaza y en la entrada del pueblo, cobran por hora. Para el Valle de Cocora hay parqueadero en la entrada y desde allí salen los jeeps. Los fines de semana llega temprano. ¿Va en carro propio?',
      en: 'Salento is small and streets get congested; there are private parking lots near the square and at the town entrance, charged by the hour. For Cocora Valley there is parking at the entrance and jeeps leave from there. On weekends arrive early. Are you driving your own car?',
      de: 'Salento ist klein und die Straßen sind oft voll; es gibt private Parkplätze nahe dem Platz und am Ortseingang, stundenweise bezahlt. Für das Cocora-Tal gibt es Parkplätze am Eingang, von dort fahren die Jeeps. Am Wochenende früh kommen. Reisen Sie mit eigenem Auto?',
      fr: 'Salento est petit et les rues sont souvent encombrées ; il y a des parkings privés près de la place et à l\'entrée du village, payés à l\'heure. Pour le Valle de Cocora, il y a un parking à l\'entrée et les jeeps partent de là. Le week-end, arrivez tôt. Vous venez en voiture ?',
      pt: 'Salento é pequeno e as ruas ficam congestionadas; há estacionamentos privados perto da praça e na entrada da cidade, cobrados por hora. Para o Vale de Cocora há estacionamento na entrada e os jipes saem de lá. Nos fins de semana, chegue cedo. Você vem de carro próprio?',
      it: 'Salento è piccolo e le strade si congestionano; ci sono parcheggi privati vicino alla piazza e all\'ingresso del paese, a pagamento orario. Per la Valle di Cocora c\'è parcheggio all\'ingresso e da lì partono le jeep. Nei fine settimana arriva presto. Vieni con la tua auto?'
    },
    followUp: ['¿Cuánto cuesta?', '¿Hay cerca de la plaza?', '¿Y para el valle?']
  },
  {
    keywords: ['mascota', 'mascotas', 'perro', 'perros', 'gato', 'gatos', 'pet', 'viajar con perro', 'llevar perro'],
    category: 'consejos',
    answer: {
      es: 'Salento es amable con las mascotas, pero no todos los hoteles, restaurantes ni tours las aceptan. En el Valle de Cocora y áreas naturales hay restricciones por fauna y cultivos; confirma siempre antes de reservar. Lleva correa, agua y bolsas. ¿Quiere que le sugiera lugares pet-friendly?',
      en: 'Salento is pet-friendly, but not every hotel, restaurant or tour accepts pets. In Cocora Valley and natural areas there are restrictions due to wildlife and crops; always confirm before booking. Bring a leash, water and bags. Want pet-friendly suggestions?',
      de: 'Salento ist haustierfreundlich, aber nicht jedes Hotel, Restaurant oder jede Tour akzeptiert Haustiere. Im Cocora-Tal und in Naturschutzgebieten gibt es Einschränkungen wegen Fauna und Anbau; bestätigen Sie immer vor der Buchung. Bringen Sie Leine, Wasser und Beutel mit. Möchten Sie haustierfreundliche Tipps?',
      fr: 'Salento est favorable aux animaux, mais tous les hôtels, restaurants et visites ne les acceptent pas. Dans le Valle de Cocora et les zones naturelles, il y a des restrictions pour la faune et les cultures ; confirmez toujours avant de réserver. Emportez laisse, eau et sacs. Vous voulez des suggestions pet-friendly ?',
      pt: 'Salento é amigável para pets, mas nem todos os hotéis, restaurantes ou tours aceitam animais. No Vale de Cocora e áreas naturais há restrições por fauna e cultivos; confirme sempre antes de reservar. Leve coleira, água e sacolas. Quer sugestões pet-friendly?',
      it: 'Salento è pet-friendly, ma non tutti gli hotel, ristoranti o tour accettano animali. Nella Valle di Cocora e nelle aree naturali ci sono restrizioni per fauna e coltivazioni; conferma sempre prima di prenotare. Porta guinzaglio, acqua e sacchetti. Vuoi suggerimenti pet-friendly?'
    },
    followUp: ['¿Hoteles pet-friendly?', '¿Puedo ir al valle?', '¿Restaurantes con patio?']
  },
  {
    keywords: ['acampar', 'camping', 'campamento', 'carpa', 'dormir en carpa'],
    category: 'turismo',
    answer: {
      es: 'Acampar dentro del Valle de Cocora no está permitido en la mayor parte del área protegida; hay fincas y hostales cercanos con zonas de camping y glamping. Para acampar legalmente, reserva en un establecimiento autorizado y confirma las normas de la reserva natural. ¿Prefiere camping o glamping?',
      en: 'Camping inside Cocora Valley is not allowed in most of the protected area; nearby farms and hostels offer camping and glamping areas. To camp legally, book at an authorized place and confirm the natural reserve rules. Do you prefer camping or glamping?',
      de: 'Camping im Cocora-Tal ist im Großteil des Schutzgebiets nicht erlaubt; nahe Farmen und Hostels bieten Camping- und Glamping-Bereiche. Um legal zu campen, buchen Sie an einem autorisierten Ort und bestätigen Sie die Regeln des Naturschutzgebiets. Camping oder Glamping?',
      fr: 'Le camping dans le Valle de Cocora n\'est pas autorisé dans la majeure partie de l\'aire protégée ; des fermes et auberges proches proposent camping et glamping. Pour camper légalement, réservez dans un établissement autorisé et confirmez les règles de la réserve. Camping ou glamping ?',
      pt: 'Acampar dentro do Vale de Cocora não é permitido na maior parte da área protegida; fazendas e hostels próximos oferecem áreas de camping e glamping. Para acampar legalmente, reserve em um local autorizado e confirme as regras da reserva natural. Prefere camping ou glamping?',
      it: 'Il campeggio nella Valle di Cocora non è consentito nella maggior parte dell\'area protetta; fattorie e ostelli vicini offrono aree camping e glamping. Per campeggiare legalmente, prenota in una struttura autorizzata e conferma le regole della riserva naturale. Preferisci camping o glamping?'
    },
    followUp: ['¿Dónde acampar?', '¿Hay glamping?', '¿Qué llevar?']
  },
  {
    keywords: ['tours en ingles', 'tour en ingles', 'guia en ingles', 'hablan ingles', 'english tour', 'tours ingles'],
    category: 'experiencias',
    answer: {
      es: 'Sí, hay operadores con guías en inglés: CocoraTrek, Cabalgatas Cocora Magic y varias fincas cafeteras ofrecen tours bilingües; algunos también en francés y portugués. Confirma el idioma al reservar y pide guía certificado. ¿Qué tour le interesa?',
      en: 'Yes, there are operators with English-speaking guides: CocoraTrek, Cabalgatas Cocora Magic and several coffee farms offer bilingual tours; some also in French and Portuguese. Confirm the language when booking and ask for a certified guide. Which tour interests you?',
      de: 'Ja, es gibt Anbieter mit englischsprachigen Guides: CocoraTrek, Cabalgatas Cocora Magic und mehrere Kaffeefarmen bieten zweisprachige Touren an; einige auch auf Französisch und Portugiesisch. Bestätigen Sie die Sprache bei der Buchung und fragen Sie nach einem zertifizierten Guide. Welche Tour interessiert Sie?',
      fr: 'Oui, des opérateurs proposent des guides anglophones : CocoraTrek, Cabalgatas Cocora Magic et plusieurs fermes de café offrent des visites bilingues ; certaines aussi en français et portugais. Confirmez la langue à la réservation et demandez un guide certifié. Quelle visite vous intéresse ?',
      pt: 'Sim, há operadores com guias em inglês: CocoraTrek, Cabalgatas Cocora Magic e várias fazendas de café oferecem tours bilíngues; alguns também em francês e português. Confirme o idioma ao reservar e peça guia certificado. Qual tour te interessa?',
      it: 'Sì, ci sono operatori con guide in inglese: CocoraTrek, Cabalgatas Cocora Magic e diverse fattorie del caffè offrono tour bilingue; alcuni anche in francese e portoghese. Conferma la lingua alla prenotazione e chiedi una guida certificata. Quale tour ti interessa?'
    },
    followUp: ['¿Cuánto cuesta?', '¿Cómo reservo?', '¿Hay en francés?']
  },
  {
    keywords: ['reservar tour', 'reservar un tour', 'reservar tours', 'reservar caminata', 'reservar cabalgata', 'reservar coffee tour', 'como reservo', 'como reservar', 'booking'],
    category: 'experiencias',
    answer: {
      es: 'Para reservar un tour en Salento, lo más rápido es escribir por WhatsApp al operador: CocoraTrek (+57 315 214 6468) para caminatas y tours, o Cabalgatas Cocora Magic para cabalgatas. También puedes reservar directo en las fincas cafeteras. Confirma hora, punto de encuentro e idioma. ¿Qué plan quieres reservar?',
      en: 'To book a tour in Salento, the fastest way is WhatsApp: CocoraTrek (+57 315 214 6468) for hikes and tours, or Cabalgatas Cocora Magic for horseback rides. You can also book directly at coffee farms. Confirm time, meeting point and language. Which plan do you want to book?',
      de: 'Um eine Tour in Salento zu buchen, geht es am schnellsten per WhatsApp: CocoraTrek (+57 315 214 6468) für Wanderungen und Touren oder Cabalgatas Cocora Magic für Ausritte. Sie können auch direkt auf den Kaffeefarmen buchen. Bestätigen Sie Uhrzeit, Treffpunkt und Sprache. Welchen Plan möchten Sie buchen?',
      fr: 'Pour réserver une visite à Salento, le plus rapide est WhatsApp : CocoraTrek (+57 315 214 6468) pour les randonnées et visites, ou Cabalgatas Cocora Magic pour les balades à cheval. Vous pouvez aussi réserver directement dans les fermes de café. Confirmez l\'heure, le point de rencontre et la langue. Quel programme voulez-vous réserver ?',
      pt: 'Para reservar um tour em Salento, o mais rápido é WhatsApp: CocoraTrek (+57 315 214 6468) para caminhadas e tours, ou Cabalgatas Cocora Magic para cavalgadas. Você também pode reservar direto nas fazendas de café. Confirme horário, ponto de encontro e idioma. Qual plano quer reservar?',
      it: 'Per prenotare un tour a Salento, il modo più rapido è WhatsApp: CocoraTrek (+57 315 214 6468) per trekking e tour, oppure Cabalgatas Cocora Magic per le cavalcate. Puoi anche prenotare direttamente nelle fattorie del caffè. Conferma orario, punto d\'incontro e lingua. Quale programma vuoi prenotare?'
    },
    followUp: ['¿Qué tours hay?', '¿Cuánto cuesta?', '¿Hay guía en inglés?'],
    relatedPlaces: [122]
  },
  {
    keywords: ['plan romantico', 'romantico', 'romantica', 'pareja', 'luna de miel', 'aniversario', 'cita romantica'],
    category: 'experiencias',
    answer: {
      es: 'Para un plan romántico en Salento: atardecer en el Alto de la Cruz, cena con vista en la plaza, cabalgata al amanecer entre palmas y una noche en finca con chimenea. Reserva con anticipación y pide mesa junto a la ventana. ¿Cuántos días tienen?',
      en: 'For a romantic plan in Salento: sunset at Alto de la Cruz, dinner with a view at the square, a sunrise horseback ride among palms and a night at a farm with a fireplace. Book ahead and ask for a window table. How many days do you have?',
      de: 'Für einen romantischen Plan in Salento: Sonnenuntergang am Alto de la Cruz, Abendessen mit Aussicht am Platz, ein Ausritt im Morgengrauen zwischen Palmen und eine Nacht auf einer Finca mit Kamin. Frühzeitig buchen und um einen Fenstertisch bitten. Wie viele Tage haben Sie?',
      fr: 'Pour un programme romantique à Salento : coucher de soleil à l\'Alto de la Cruz, dîner avec vue sur la place, balade à cheval à l\'aube parmi les palmiers et une nuit dans une finca avec cheminée. Réservez à l\'avance et demandez une table près de la fenêtre. Combien de jours avez-vous ?',
      pt: 'Para um plano romântico em Salento: pôr do sol no Alto de la Cruz, jantar com vista na praça, cavalgada ao amanhecer entre palmeiras e uma noite em fazenda com lareira. Reserve com antecedência e peça mesa perto da janela. Quantos dias vocês têm?',
      it: 'Per un programma romantico a Salento: tramonto all\'Alto de la Cruz, cena con vista sulla piazza, cavalcata all\'alba tra le palme e una notte in fattoria con camino. Prenota in anticipo e chiedi un tavolo vicino alla finestra. Quanti giorni avete?'
    },
    followUp: ['¿Hotel romántico?', '¿Cena con vista?', '¿Cabalgata al amanecer?']
  },
  {
    keywords: ['con ninos', 'con ninas', 'familia con ninos', 'plan familiar', 'ninos', 'kids', 'familia'],
    category: 'experiencias',
    answer: {
      es: 'Salento es ideal en familia: caminatas cortas al Alto de la Cruz, cabalgatas tranquilas, fincas cafeteras educativas, cascadas de fácil acceso y la plaza para correr. Evita caminatas largas al Valle de Cocora con niños pequeños y lleva impermeable. ¿Qué edades tienen los niños?',
      en: 'Salento is great for families: short walks to Alto de la Cruz, gentle horseback rides, educational coffee farms, easy-access waterfalls and the square to run around. Avoid long Cocora Valley hikes with small children and bring rain gear. How old are the kids?',
      de: 'Salento ist ideal für Familien: kurze Wege zum Alto de la Cruz, ruhige Ausritte, lehrreiche Kaffeefarmen, leicht erreichbare Wasserfälle und der Platz zum Toben. Vermeiden Sie lange Wanderungen im Cocora-Tal mit kleinen Kindern und nehmen Sie Regenschutz mit. Wie alt sind die Kinder?',
      fr: 'Salento est idéal en famille : courtes marches à l\'Alto de la Cruz, balades à cheval tranquilles, fermes de café éducatives, cascades faciles d\'accès et la place pour courir. Évitez les longues randonnées au Valle de Cocora avec de jeunes enfants et emportez un imperméable. Quel âge ont les enfants ?',
      pt: 'Salento é ideal em família: caminhadas curtas ao Alto de la Cruz, cavalgadas tranquilas, fazendas de café educativas, cachoeiras de fácil acesso e a praça para correr. Evite caminhadas longas no Vale de Cocora com crianças pequenas e leve capa de chuva. Qual a idade das crianças?',
      it: 'Salento è ideale in famiglia: brevi passeggiate all\'Alto de la Cruz, cavalcate tranquille, fattorie del caffè educative, cascate di facile accesso e la piazza per correre. Evita lunghe escursioni nella Valle di Cocora con bambini piccoli e porta l\'impermeabile. Quanti anni hanno i bambini?'
    },
    followUp: ['¿Tours para niños?', '¿Cabalgatas seguras?', '¿Qué evitar?']
  },
  {
    keywords: ['seguro de noche', 'seguridad', 'es seguro', 'peligroso', 'robar', 'delito', 'noche'],
    category: 'consejos',
    answer: {
      es: 'Salento es un pueblo tranquilo y seguro para turistas, incluso de noche en el centro. Como en cualquier destino, usa sentido común: no exhibas objetos de valor, camina por calles iluminadas y usa taxis de confianza para trayectos largos. En el Valle de Cocora no te quedes después del atardecer sin guía. ¿Tiene alguna preocupación concreta?',
      en: 'Salento is a quiet, safe town for tourists, even at night downtown. As anywhere, use common sense: do not display valuables, walk on lit streets and use trusted taxis for long rides. In Cocora Valley do not stay after sunset without a guide. Any specific concern?',
      de: 'Salento ist ein ruhiger und sicherer Ort für Touristen, auch nachts im Zentrum. Wie überall: Wertsachen nicht zeigen, beleuchtete Straßen nutzen und für lange Fahrten vertrauenswürdige Taxis nehmen. Im Cocora-Tal nach Sonnenuntergang nicht ohne Guide bleiben. Haben Sie eine konkrete Sorge?',
      fr: 'Salento est une ville calme et sûre pour les touristes, même le soir dans le centre. Comme partout, usez de bon sens : n\'exhibez pas d\'objets de valeur, marchez dans les rues éclairées et prenez des taxis de confiance pour les longs trajets. Dans le Valle de Cocora, ne restez pas après le coucher du soleil sans guide. Une inquiétude précise ?',
      pt: 'Salento é uma cidade tranquila e segura para turistas, mesmo à noite no centro. Como em qualquer lugar, use bom senso: não exiba objetos de valor, caminhe por ruas iluminadas e use táxis de confiança para trajetos longos. No Vale de Cocora, não fique após o pôr do sol sem guia. Alguma preocupação específica?',
      it: 'Salento è un paese tranquillo e sicuro per i turisti, anche di sera in centro. Come ovunque, usa buon senso: non mostrare oggetti di valore, cammina su strade illuminate e usa taxi affidabili per i tragitti lunghi. Nella Valle di Cocora non restare dopo il tramonto senza guida. Hai una preoccupazione specifica?'
    },
    followUp: ['¿Taxi de confianza?', '¿Es seguro el valle?', '¿Número de policía?']
  }
]

class DonChuchoKnowledge {
  findAnswer(query: string, language: Language = 'es'): KnowledgeItem | null {
    const scoredResults = this.searchWithScore(query, language)
    if (scoredResults.length === 0) return null
    if (scoredResults[0].score < 8) return null
    return scoredResults[0].item
  }

  getAnswer(query: string, language: Language = 'es'): string {
    const knowledgeItem = this.findAnswer(query, language)
    if (knowledgeItem) {
      return knowledgeItem.answer[language] || knowledgeItem.answer.en || knowledgeItem.answer.es
    }
    return fallbackReply(language)
  }

  isDefensiveResponse(query: string): boolean {
    const knowledgeItem = this.findAnswer(query)
    return knowledgeItem?.isDefensive || false
  }

  getDefensiveActions(query: string): string[] {
    const knowledgeItem = this.findAnswer(query)
    return knowledgeItem?.defensiveActions || []
  }

  getFollowUpSuggestions(query: string, language: Language = 'es'): string[] {
    const knowledgeItem = this.findAnswer(query, language)
    if (knowledgeItem?.followUp?.length && language === 'es') {
      return [...knowledgeItem.followUp]
    }
    return localizedSuggestions(knowledgeItem?.category, language)
  }

  getAllItems(): KnowledgeItem[] {
    return [...knowledgeBase]
  }

  getRelatedPlaces(query: string): number[] {
    const knowledgeItem = this.findAnswer(query)
    return knowledgeItem?.relatedPlaces || []
  }

  getCategories(): string[] {
    return [...new Set(knowledgeBase.map(item => item.category))]
  }

  getByCategory(category: string): KnowledgeItem[] {
    return knowledgeBase.filter(item => item.category === category)
  }

  searchWithScore(query: string, language: Language = 'es'): Array<{ item: KnowledgeItem; score: number }> {
    const original = normalizeText(query)
    if (!original) return []
    const expanded = expandQuery(query)
    const combined = `${original} ${expanded}`
    const queryWords = new Set(combined.split(' ').filter(Boolean))
    const queryWordList = [...queryWords]
    const intent = detectKnowledgeIntent(original)
    const intentCategories = intent ? INTENT_CATEGORIES[intent] : []
    // Temporada navideña: si la pregunta menciona Navidad, prioriza el plan navideño
    // por encima de entradas genéricas como "qué hacer".
    const christmasQuery = ['navidad', 'navide', 'nochebuena', 'christmas', 'xmas', 'weihnachten', 'noel', 'natal']
      .some(term => original.includes(term))
    const results: Array<{ item: KnowledgeItem; score: number }> = []

    for (const item of knowledgeBase) {
      let score = 0
      let matchedKeywords = 0
      const matchedKeywordNames: string[] = []

      for (const keyword of item.keywords) {
        const normalizedKeyword = normalizeText(keyword)
        if (!normalizedKeyword) continue
        const keywordWords = normalizedKeyword.split(' ')
        let keywordScore = 0

        if (keywordWords.length === 1) {
          if (queryWords.has(normalizedKeyword)) {
            keywordScore = 12
          } else if (fuzzyWordMatch(normalizedKeyword, queryWordList)) {
            keywordScore = 7
          }
        } else if (combined.includes(normalizedKeyword)) {
          keywordScore = 18 + Math.min(normalizedKeyword.length, 16)
        } else {
          const allWordsPresent = keywordWords.every(word =>
            queryWords.has(word) || fuzzyWordMatch(word, queryWordList)
          )
          if (allWordsPresent) keywordScore = 10
        }

        if (keywordScore > 0) {
          score += keywordScore
          matchedKeywords++
          matchedKeywordNames.push(normalizedKeyword)
        }
      }

      if (score === 0) continue

      const hasSpecificQueryToken = queryWordList.some(token =>
        token.length >= 3 && !GENERIC_KEYWORDS.has(token) && !QUERY_STOPWORDS.has(token)
      )
      if (
        hasSpecificQueryToken &&
        matchedKeywordNames.length > 0 &&
        matchedKeywordNames.every(keyword => GENERIC_KEYWORDS.has(keyword))
      ) {
        score -= 15
      }

      const primaryKeyword = normalizeText(item.keywords[0])
      if (primaryKeyword && combined.includes(primaryKeyword)) score += 8
      if (matchedKeywords > 1) score += Math.min(matchedKeywords * 2, 10)
      if (intentCategories.includes(item.category)) score += 5
      if (christmasQuery && primaryKeyword === 'navidad') score += 50

      results.push({ item, score })
    }

    return results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      const aPrimary = normalizeText(a.item.keywords[0]).length
      const bPrimary = normalizeText(b.item.keywords[0]).length
      return bPrimary - aPrimary
    })
  }
}

// Función de búsqueda simple para uso directo en componentes
export function searchLocalKnowledge(query: string, language: Language = 'es'): KnowledgeItem | null {
  return donChuchoKnowledge.findAnswer(query, language)
}

export const donChuchoKnowledge = new DonChuchoKnowledge()
export default donChuchoKnowledge
