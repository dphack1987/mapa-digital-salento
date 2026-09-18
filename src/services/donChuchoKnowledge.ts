// Base de conocimiento local para Don Chucho
// Contiene información específica sobre Salento y el Quindío

interface KnowledgeItem {
  keywords: string[]
  category: 'cafe' | 'comida' | 'artesanias' | 'hospedaje' | 'turismo' | 'transporte' | 'emergencias' | 'general' | 'defensivo' | 'historia' | 'municipios' | 'gastronomia' | 'consejos' | 'experiencias' | 'festivales'
  answer: {
    es: string
    en: string
    de: string
    fr: string
    pt: string
    it: string
  }
  followUp?: string[]
  relatedPlaces?: number[]
  isDefensive?: boolean
  defensiveActions?: string[]
  urgency?: 'low' | 'medium' | 'high'
  sources?: string[]
}

const knowledgeBase: KnowledgeItem[] = [
  // ═══════════════════════════════════════════════════════════
  // GASTRONOMÍA
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['trucha', 'trucha arcoiris', 'trucha al ajillo', 'trucha frita', 'trucha horno'],
    category: 'gastronomia',
    answer: {
      es: '¡La trucha arcoíris es el plato estrella de Salento! Te la preparan al ajillo, frita con patacones, al horno con hierbas, o en salsa de frutos rojos. La más famosa es en La Fogata. También en Brunch de la Plaza y Don Elías. ¿Cómo la prefieres?',
      en: 'Rainbow trout is the star dish of Salento! They prepare it garlic-style, fried with patacones, baked with herbs, or in red fruit sauce. The most famous is at La Fogata. Also at Brunch de la Plaza and Don Elías. How do you prefer it?',
      de: 'Die Regenbogenforelle ist das Star-Gericht von Salento! Sie wird in Knoblauchsoße, gebraten mit Patacones, im Ofen mit Kräutern oder in Fruchtsoße zubereitet. Das berühmteste gibt es bei La Fogata, auch bei Brunch de la Plaza und Don Elías. Wie möchten Sie sie haben?',
      fr: 'La truite arc-en-ciel est le plat phare de Salento ! On la prépare à l\'ail, frite avec des patacones, au four aux herbes, ou en sauce de fruits rouges. La plus connue est à La Fogata. Aussi au Brunch de la Plaza et chez Don Elías. Comment la préférez-vous ?',
      pt: 'A truta arco-íris é o prato estrela de Salento! Ela é preparada ao alho, frita com patacones, assada com ervas, ou em molho de frutas vermelhas. A mais famosa é na La Fogata. Também no Brunch de la Plaza e no Don Elías. Como você prefere?',
      it: 'La trota iridea è il piatto stella di Salento! La preparano all\'aglio, fritta con patacones, al forno con erbe, o in salsa di frutti di bosco. La più famosa è da La Fogata. Anche al Brunch de la Plaza e da Don Elías. Come la preferite?'
    },
    followUp: ['¿Al ajillo o frita?', '¿Con patacones?', '¿Dónde probarla mejor?'],
    relatedPlaces: [1, 4, 9]
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
    keywords: ['café', 'café especial', 'café origen', 'tinto', 'cafetería'],
    category: 'cafe',
    answer: {
      es: '¡El café del Quindío es patrimonio! Se cultiva entre 1.200 y 2.000 metros. Notas de chocolate, caramelo y frutas. Para café de especialidad ve a Café de Altura o Brunch de la Plaza. El tinto de la plaza es ritual sagrado.',
      en: 'Quindío coffee is heritage! Grown between 1,200 and 2,000 meters. Notes of chocolate, caramel and fruits. For specialty coffee go to Café de Altura or Brunch de la Plaza. The square tinto is a sacred ritual.',
      de: 'Der Kaffee des Quindío ist Kulturgut! Er wird zwischen 1.200 und 2.000 Metern angebaut. Schokoladen-, Karamell- und Fruchtnoten. Für Spezialitätenkaffee gehen Sie zu Café de Altura oder Brunch de la Plaza. Der Tinto am Platz ist ein heiliges Ritual.',
      fr: 'Le café du Quindío est un patrimoine ! Il est cultivé entre 1 200 et 2 000 mètres. Notes de chocolat, caramel et fruits. Pour un café de spécialité, allez au Café de Altura ou au Brunch de la Plaza. Le tinto de la place est un rituel sacré.',
      pt: 'O café do Quindío é patrimônio! É cultivado entre 1.200 e 2.000 metros. Notas de chocolate, caramelo e frutas. Para café especialista vá ao Café de Altura ou Brunch de la Plaza. O tinto da praia é um ritual sagrado.',
      it: 'Il caffè del Quindío è patrimonio! Viene coltivato tra 1.200 e 2.000 metri. Note di cioccolato, caramello e frutta. Per un caffè specialità andate al Café de Altura o al Brunch de la Plaza. Il tinto della piazza è un rituale sacro.'
    },
    followUp: ['¿Método de preparación?', '¿Café de altura?', '¿Dónde comprar grano?'],
    relatedPlaces: [1, 6]
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
    keywords: ['masamorra', 'mazamorra', 'maíz', 'desayuno tradicional'],
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
    keywords: ['historia', 'fundación', 'origen', 'cuándo fundaron'],
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
    relatedPlaces: [2]
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
    keywords: ['filandia', 'mirador', 'torre mirador', 'hija de los andes'],
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
    keywords: ['fiestas', 'celebración', 'feria', 'evento cultural'],
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
    keywords: ['qué llevar', 'equipaje', 'ropa', 'mochila', 'preparar'],
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
    keywords: ['mejor época', 'cuándo ir', 'temporada', 'lluvia', 'seca'],
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
    relatedPlaces: [5]
  },
  {
    keywords: ['boki mall', 'boki mall boquía', 'hotel boki', 'boki'],
    category: 'hospedaje',
    answer: {
      es: 'Boki Mall en Boquía es de lo más completo: hotel, restaurante, café bar y vistas. Ideal si quieres combinar descanso con buena comida y ambiente más exclusivo. ¿Reservar, cómo llegar o comparar?',
      en: 'Boki Mall in Boquía is one of the most complete: hotel, restaurant, coffee bar and views. Ideal to combine rest with good food. Do you want to book, directions, or compare?',
      de: 'Boki Mall in Boquía ist eines der umfassendsten: Hotel, Restaurant, Café-Bar und Aussichten. Ideal, um Erholung mit gutem Essen und exklusiverem Ambiente zu verbinden. Reservieren, Anreise oder vergleichen?',
      fr: 'Boki Mall à Boquía est l\'un des plus complets : hôtel, restaurant, café-bar et vues. Idéal pour combiner repos et bonne nourriture dans une ambiance plus exclusive. Réserver, s\'y rendre ou comparer ?',
      pt: 'Boki Mall em Boquía é dos mais completos: hotel, restaurante, café bar e vistas. Ideal se você quer combinar descanso com boa comida e ambiente mais exclusivo. Reservar, como chegar ou comparar?',
      it: 'Boki Mall a Boquía è uno dei più completi: hotel, ristorante, café-bar e viste. Ideale per combinare riposo con buon cibo e atmosfera più esclusiva. Prenotare, come arrivare o confrontare?'
    },
    followUp: ['¿Ver disponibilidad?', '¿Ubicación en Boquía?', '¿Hotel o restaurante?'],
    relatedPlaces: [13]
  },
  {
    keywords: ['mirador las manos de dios', 'las manos de dios', 'manos de dios'],
    category: 'turismo',
    answer: {
      es: 'El Mirador Las Manos de Dios es muy visitado por su valor fotográfico y la vista del paisaje. Está en el Ecoparque Tu País, a 300 metros del cementerio. Entrada $12.000, abierto 8am-6pm. Manos gigantes, cóndor, poporo, jeep cafetero.',
      en: 'Mirador Las Manos de Dios is very popular for its photo value and landscape view. In Ecoparque Tu País, 300m from the cemetery. Entry $12,000, open 8am-6pm. Giant hands, condor, poporo, coffee jeep.',
      de: 'Der Aussichtspunkt Las Manos de Dios ist sehr beliebt wegen seines Fotowerts und der Landschaftsaussicht. Im Ecoparque Tu País, 300 m vom Friedhof entfernt. Eintritt $12.000, geöffnet 8-18 Uhr. Riesenhände, Kondor, Poporo, Kaffee-Jeep.',
      fr: 'Le Mirador Las Manos de Dios est très fréquenté pour sa valeur photographique et sa vue sur le paysage. Dans l\'Ecoparque Tu País, à 300 m du cimetière. Entrée 12 000 $, ouvert de 8h à 18h. Mains géantes, condor, poporo, jeep de café.',
      pt: 'O Mirador Las Manos de Dios é muito visitado por seu valor fotográfico e vista da paisagem. Fica no Ecoparque Tu País, a 300 metros do cemitério. Entrada $12.000, aberto das 8h às 18h. Mãos gigantes, condor, poporo, jeep cafeiro.',
      it: 'Il Mirador Las Manos de Dios è molto visitato per il suo valore fotografico e la vista panoramica. Nell\'Ecoparque Tu País, a 300 metri dal cimitero. Ingresso $12.000, aperto dalle 8 alle 18. Mani giganti, condor, poporo, jeep del caffè.'
    },
    followUp: ['¿Cómo llegar?', '¿Combina con otros planes?', '¿Mejor hora para fotos?'],
    relatedPlaces: [14]
  },
  {
    keywords: ['cascadas santa rita', 'santa rita salento', 'cascada santa rita', 'santa rita'],
    category: 'turismo',
    answer: {
      es: 'Las Cascadas Santa Rita son una joyita en Boquía. 4.8 km de caminata por bosque, montes, valle, antigua vía de tren, túnel y puente colgante. Entrada $5.000. Hay segunda cascada por cavernas y zonas de camping.',
      en: 'Santa Rita Waterfalls are a hidden gem in Boquía. 4.8 km hike through forest, mountains, valley, old train track, tunnel and suspension bridge. Entry $5,000. Second waterfall through caves and camping areas.',
      de: 'Die Santa Rita-Wasserfälle sind ein versteckter Schatz in Boquía. 4,8 km Wanderung durch Wald, Berge, Tal, alte Eisenbahnstrecke, Tunnel und Hängebrücke. Eintritt $5.000. Zweiter Wasserfall durch Höhlen und Zeltplätze.',
      fr: 'Les Cascadas Santa Rita sont un joyau caché à Boquía. Randonnée de 4,8 km à travers la forêt, les montagnes, la vallée, l\'ancienne voie ferrée, un tunnel et un pont suspendu. Entrée 5 000 $. Deuxième cascade à travers les grottes et les zones de camping.',
      pt: 'As Cascadas Santa Rita são uma joiazinha em Boquía. Trilha de 4,8 km por floresta, montanhas, vale, antiga via de trem, túnel e ponte pênsil. Entrada $5.000. Tem uma segunda cachoeira por cavernas e áreas de camping.',
      it: 'Le Cascate Santa Rita sono un gioiello nascosto a Boquía. Percorso di 4,8 km attraverso foresta, montagne, valle, vecchia ferrovia, tunnel e ponte sospeso. Ingresso $5.000. Seconda cascata attraverso caverne e aree campeggio.'
    },
    followUp: ['¿Cómo llegar a Boquía?', '¿Dificultad del sendero?', '¿Qué llevar?'],
    relatedPlaces: [15]
  },
  {
    keywords: ['finca cafetera don elias', 'finca don elias', 'don elias salento'],
    category: 'turismo',
    answer: {
      es: 'La Finca Cafetera Don Elías es ideal para entender el café de verdad, desde la plantación hasta la taza. Experiencia auténtica y educativa. Está a 10 min en carro del pueblo. Reserva recomendada, ¡se llena rápido!',
      en: 'Don Elías Coffee Farm is ideal to understand coffee from plant to cup. Authentic and educational experience. 10 min by car from town. Reservation recommended, fills up fast!',
      de: 'Die Kaffee-Farm Don Elías ist ideal, um Kaffee von der Pflanze bis zur Tasse zu verstehen. Authentisches und lehrreiches Erlebnis. 10 Min. mit dem Auto vom Dorf entfernt. Reservierung empfohlen, füllt sich schnell!',
      fr: 'La Finca Cafetera Don Elías est idéale pour comprendre le café de la plante à la tasse. Expérience authentique et éducative. À 10 min en voiture du village. Réservation recommandée, se remplit vite !',
      pt: 'A Finca Cafetera Don Elías é ideal para entender o café de verdade, da plantação até a xícara. Experiência autêntica e educativa. Fica a 10 min de carro da cidade. Reserva recomendada, enche rápido!',
      it: 'La Finca Cafetera Don Elías è ideale per capire il caffè dalla pianta alla tazza. Esperienza autentica e formativa. A 10 min in auto dal villaggio. Prenotazione consigliata, si riempie in fretta!'
    },
    followUp: ['¿Es recomendable reservar?', '¿Qué incluye?', '¿Cuánto dura?'],
    relatedPlaces: [8]
  },
  {
    keywords: ['restaurante don elias', 'don elias restaurante'],
    category: 'comida',
    answer: {
      es: 'Restaurante Don Elías se destaca por su propuesta local y experiencia gastronómica. Si buscas comer bien sin perder la esencia del pueblo, es una gran referencia. ¿Cocina típica, menú para parejas o reservar?',
      en: 'Restaurant Don Elías stands out for its local proposal and gastronomic experience. A great reference for good food without losing the town\'s essence. Typical cuisine, couple menu, or reservation?',
      de: 'Das Restaurant Don Elías zeichnet sich durch sein lokales Angebot und sein gastronomisches Erlebnis aus. Eine großartige Referenz für gutes Essen, ohne die Essenz des Dorfes zu verlieren. Traditionelle Küche, Paarmenü oder Reservierung?',
      fr: 'Le restaurant Don Elías se distingue par sa proposition locale et son expérience gastronomique. Une excellente référence pour bien manger sans perdre l\'essence du village. Cuisine typique, menu couple ou réservation ?',
      pt: 'O Restaurante Don Elías se destaca por sua proposta local e experiência gastronômica. Se você quer comer bem sem perder a essência da cidade, é uma ótima referência. Cozinha típica, menu para casais ou reservar?',
      it: 'Il Ristorante Don Elías si distingue per la proposta locale e l\'esperienza gastronomica. Un ottimo riferimento per mangiare bene senza perdere l\'essenza del villaggio. Cucina tipica, menu per coppie o prenotare?'
    },
    followUp: ['¿Cocina típica?', '¿Reservar?', '¿Precio aproximado?'],
    relatedPlaces: [9]
  },
  {
    keywords: ['moto aventura 110', 'aventura 110', 'moto aventura'],
    category: 'transporte',
    answer: {
      es: 'Moto Aventura 110 es buena referencia para movilidad local en Salento y rutas más flexibles. Útil para explorar zonas cercanas sin depender de rutas fijas. ¿Recorridos, traslado o recomendaciones de ruta?',
      en: 'Moto Aventura 110 is good for local mobility in Salento and flexible routes. Useful to explore nearby areas without fixed routes. Rides, transfers, or route recommendations?',
      de: 'Moto Aventura 110 ist gut für lokale Mobilität in Salento und flexiblen Routen. Nützlich, um nahegelegene Gebiete ohne feste Routen zu erkunden. Fahrten, Transfers oder Routenempfehlungen?',
      fr: 'Moto Aventura 110 est bon pour la mobilité locale à Salento et les itinéraires flexibles. Utile pour explorer les zones à proximité sans itinéraires fixes. Balades, transferts ou recommandations d\'itinéraires ?',
      pt: 'Moto Aventura 110 é uma boa referência para mobilidade local em Salento e rotas mais flexíveis. Útil para explorar áreas próximas sem depender de rotas fixas. Percursos, transfer ou recomendações de rota?',
      it: 'Moto Aventura 110 è un buon riferimento per la mobilità locale a Salento e percorsi più flessibili. Utile per esplorare zone vicine senza rotte fisse. Viaggi, transfer o raccomandazioni di percorso?'
    },
    followUp: ['¿Ofrecen traslados?', '¿Cómo contactar?', '¿Qué rutas manejan?'],
    relatedPlaces: [11]
  },
  {
    keywords: ['cabalgatas cocora magica', 'cocora magica', 'cabalgatas salento'],
    category: 'turismo',
    answer: {
      es: 'Cabalgatas Cocora Mágica es opción para vivir el Valle de Cocora de forma distinta. Experiencia, paisaje y propuesta tradicional. Incluye recorrido con caballos entrenados. ¿Horario o recomendado para familias?',
      en: 'Cabalgatas Cocora Mágica is an option to experience Cocora Valley differently. Experience, landscape and traditional proposal. Includes ride with trained horses. Schedule or family-friendly?',
      de: 'Cabalgatas Cocora Mágica ist eine Option, das Cocora-Tal anders zu erleben. Erlebnis, Landschaft und traditionelles Angebot. Inklusive Ride mit trainierten Pferden. Zeitplan oder familienfreundlich?',
      fr: 'Cabalgatas Cocora Mágica est une option pour vivre la vallée de Cocora différemment. Expérience, paysage et proposition traditionnelle. Inclut une promenade à cheval entraînés. Horaire ou adapté aux familles ?',
      pt: 'Cabalgatas Cocora Mágica é uma opção para viver o Vale de Cocora de forma diferente. Experiência, paisagem e proposta tradicional. Inclui passeio com cavalos treinados. Horário ou recomendado para famílias?',
      it: 'Cabalgatas Cocora Mágica è un\'opzione per vivere la Valle di Cocora in modo diverso. Esperienza, paesaggio e proposta tradizionale. Include cavalcata con cavalli addestrati. Orario o adatto alle famiglie?'
    },
    followUp: ['¿Incluye transporte?', '¿Es buena para familias?', '¿Cuánto dura?'],
    relatedPlaces: [10]
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
    relatedPlaces: [12]
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
    relatedPlaces: [3, 8]
  },
  {
    keywords: ['mirador', 'cruz', 'vista', 'paisaje', 'alto de la cruz'],
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
    keywords: ['transporte', 'bus', 'willys', 'jeep', 'taxi', 'armenia'],
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
    keywords: ['emergencia', 'help', 'ayuda', 'médico', 'policía', 'cruz roja'],
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
    keywords: ['dinero', 'cambio', 'atm', 'banco', 'efectivo'],
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
    relatedPlaces: [11, 15]
  },
  {
    keywords: ['boquía', 'vereda', 'zona rural', 'campos', 'finca'],
    category: 'turismo',
    answer: {
      es: 'Boquía es la vereda rural de Salento, a 5 minutos del pueblo. Boki Mall, Cascada Santa Rita y fincas cafeteras. Donde se vive la verdadera cultura rural del Quindío.',
      en: 'Boquía is Salento\'s rural vereda, 5 minutes from town. Boki Mall, Santa Rita Waterfall and coffee farms. Where you experience the true rural culture of Quindío.',
      de: 'Boquía ist die ländliche Vereda von Salento, 5 Minuten vom Dorf entfernt. Boki Mall, Santa-Rita-Wasserfall und Kaffeebauernhöfe. Wo man die wahre ländliche Kultur des Quindío erlebt.',
      fr: 'Boquía est la vereda rurale de Salento, à 5 minutes du village. Boki Mall, cascade Santa Rita et plantations de café. Là où l\'on vit la véritable culture rurale du Quindío.',
      pt: 'Boquía é a vereda rural de Salento, a 5 minutos da cidade. Boki Mall, Cachoeira Santa Rita e fazendas de café. Onde se vive a verdadeira cultura rural do Quindío.',
      it: 'Boquía è la vereda rurale di Salento, a 5 minuti dal villaggio. Boki Mall, Cascata Santa Rita e fattorie di caffè. Dove si vive la vera cultura rurale del Quindío.'
    },
    followUp: ['¿Boki Mall?', '¿Cascada Santa Rita?', '¿Fincas cafeteras?'],
    relatedPlaces: [13, 15]
  },
  // ═══════════════════════════════════════════════════════════
  // DEFENSIVOS
  // ═══════════════════════════════════════════════════════════
  {
    keywords: ['peligro', 'inseguro', 'no vengas', 'alarmante', 'cierre', 'riesgo'],
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
    relatedPlaces: [5, 13],
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
    relatedPlaces: [10],
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
    relatedPlaces: [1, 2, 5],
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
    relatedPlaces: [11, 15],
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
    relatedPlaces: [1, 4, 5],
    isDefensive: true,
    urgency: 'high',
    defensiveActions: ['Ver reporte oficial', 'Contactar autoridades', 'Consultar boletines'],
    sources: ['Gobernación del Quindío', 'Alcaldía de Salento', 'Defensa Civil']
  }
]

class DonChuchoKnowledge {
  findAnswer(query: string, language: 'es' | 'en' | 'de' | 'fr' | 'pt' | 'it' = 'es'): KnowledgeItem | null {
    const normalizedQuery = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const scoredResults = this.searchWithScore(normalizedQuery, language)
    if (scoredResults.length > 0) {
      return scoredResults[0].item
    }
    return null
  }

  getAnswer(query: string, language: 'es' | 'en' | 'de' | 'fr' | 'pt' | 'it' = 'es'): string {
    const knowledgeItem = this.findAnswer(query, language)
    if (knowledgeItem) {
      return knowledgeItem.answer[language]
    }
    switch (language) {
      case 'de':
        return 'Ich kann Ihnen bei lokalem Essen, Kunsthandwerk, Kaffee, Aussichtspunkten und Hotellieferungen helfen. Was brauchen Sie genau?'
      case 'fr':
        return 'Je peux vous guider vers la nourriture locale, l\'artisanat, le café, les points de vue et les livraisons à l\'hôtel. Qu\'avez-vous besoin exactement ?'
      case 'pt':
        return 'Posso te guiar para comida local, artesanato, café, mirantes e entregas no hotel. O que você precisa especificamente?'
      case 'it':
        return 'Posso guidarvi verso cibo locale, artigianato, caffè, punti panoramici e consegne in hotel. Di cosa avete bisogno nello specifico?'
      default:
        return 'Puedo guiarte hacia comida local, artesanías, café, miradores y domicilios al hotel. ¿Qué necesitas específicamente?'
    }
  }

  isDefensiveResponse(query: string): boolean {
    const knowledgeItem = this.findAnswer(query)
    return knowledgeItem?.isDefensive || false
  }

  getDefensiveActions(query: string): string[] {
    const knowledgeItem = this.findAnswer(query)
    return knowledgeItem?.defensiveActions || []
  }

  getFollowUpSuggestions(query: string, language: 'es' | 'en' | 'de' | 'fr' | 'pt' | 'it' = 'es'): string[] {
    const knowledgeItem = this.findAnswer(query, language)
    return knowledgeItem?.followUp || []
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

  searchWithScore(query: string, language: 'es' | 'en' | 'de' | 'fr' | 'pt' | 'it' = 'es'): Array<{ item: KnowledgeItem; score: number }> {
    const normalizedQuery = query.toLowerCase()
    const results: Array<{ item: KnowledgeItem; score: number }> = []

    for (const item of knowledgeBase) {
      let score = 0
      const queryWords = normalizedQuery.split(/\s+/)

      for (const keyword of item.keywords) {
        const normalizedKeyword = keyword.toLowerCase()
        if (normalizedQuery.includes(normalizedKeyword)) {
          score += 12
          if (normalizedQuery === normalizedKeyword) {
            score += 8
          }
        }
        for (const word of queryWords) {
          if (normalizedKeyword.includes(word)) {
            score += 3
            if (normalizedKeyword === word) {
              score += 6
            }
          }
        }
      }

      if (score > 0) {
        results.push({ item, score })
      }
    }

    return results.sort((a, b) => b.score - a.score)
  }
}

export const donChuchoKnowledge = new DonChuchoKnowledge()
export default donChuchoKnowledge
