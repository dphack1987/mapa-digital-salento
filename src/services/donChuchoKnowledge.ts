// Base de conocimiento local para Don Chucho
// Contiene información específica sobre Salento para respuestas más inteligentes

interface KnowledgeItem {
  keywords: string[]
  category: 'cafe' | 'comida' | 'artesanias' | 'hospedaje' | 'turismo' | 'transporte' | 'emergencias' | 'general' | 'defensivo'
  answer: {
    es: string
    en: string
  }
  followUp?: string[]
  relatedPlaces?: number[] // IDs de lugares relacionados
  isDefensive?: boolean
  defensiveActions?: string[]
  urgency?: 'low' | 'medium' | 'high' // Nivel de urgencia para respuestas defensivas
  sources?: string[] // Fuentes de información para respuestas defensivas
}

const knowledgeBase: KnowledgeItem[] = [
  {
    keywords: ['cafe', 'coffee', 'cafetería', 'café especialidad', 'origen'],
    category: 'cafe',
    answer: {
      es: '¡Ay, amigo! Para café de verdad, aquí en Salento somos maestros. Te recomiendo Café Quindío cerca de la plaza - ese café tiene alma de montaña. También Café de Altura si quieres sabores más finos, o Brunch de la Plaza para empezar el día con pie derecho. ¿Qué tipo de café te antoja?',
      en: 'Hey friend! For real coffee, here in Salento we are masters. I recommend Café Quindío near the square - that coffee has mountain soul. Also Café de Altura if you want finer flavors, or Brunch de la Plaza to start the day right. What type of coffee do you fancy?'
    },
    followUp: ['¿Café con tinto o descafeinado?', '¿Prefieres methods filtrados?', '¿Necesitas directions?'],
    relatedPlaces: [1, 6]
  },
  {
    keywords: ['trucha', 'comida', 'restaurant', 'almuerzo', 'cena', 'parrilla'],
    category: 'comida',
    answer: {
      es: '¡Uy, qué rico! Para trucha bien preparada, La Fogata es la casa - ahí le ponen cariño al patacón. Si quieres algo más ligero, Brunch de la Plaza tiene desayunos que te dejan satisfecho. ¿Con qué ganas comer?',
      en: 'Oh, how delicious! For well-prepared trout, La Fogata is the place - they put love into the patacón. If you want something lighter, Brunch de la Plaza has breakfasts that leave you satisfied. What are you in the mood for?'
    },
    followUp: ['¿Trucha al horno o frita?', '¿Algo vegetariano?', '¿Necesitas domicilio?'],
    relatedPlaces: [1, 4]
  },
  {
    keywords: ['artesanias', 'artesanía', 'souvenir', 'regalo', 'bolsos', 'cerámica'],
    category: 'artesanias',
    answer: {
      es: 'Para llevarse un pedacito de Salento, Canasto Quindío en la Calle Real es tesoro - ahí todo está hecho con manos de nuestra gente. Bolsos tejidos con historias, cerámica con tierra de acá, y café que sabe a tradición. ¿Qué se te antoja llevar?',
      en: 'To take a piece of Salento with you, Canasto Quindío on Calle Real is a treasure - everything there is made with local hands. Woven bags with stories, ceramics with local earth, and coffee that tastes like tradition. What would you like to take?'
    },
    followUp: ['¿Algo específico?', '¿Regalo para alguien especial?', '¿Presupuesto aproximado?'],
    relatedPlaces: [2]
  },
  {
    keywords: ['hotel', 'hospedaje', 'alojamiento', 'habitación', 'posada'],
    category: 'hospedaje',
    answer: {
      es: 'Para descansar como en casa, Hotel Camino Nacional es buena opción - está en el centro y la gente es amable. Si quieres algo más especial, Boki Mall en Boquía ganó el premio al mejor hotel rural 2024 - tienen hotel, restaurante y café bar todo en un solo lugar. ¿Cuántos son y para cuándo?',
      en: 'To rest like at home, Hotel Camino Nacional is a good option - it\'s in the center and the people are friendly. If you want something more special, Boki Mall in Boquía won the 2024 best rural hotel award - they have hotel, restaurant and café bar all in one place. How many people and for when?'
    },
    followUp: ['¿Cuántas personas?', '¿Qué fechas?', '¿Prefieres centro o rural?', '¿Te interesa Boki Mall?'],
    relatedPlaces: [5, 13]
  },
  {
    keywords: ['boki', 'boki mall', 'boquía', 'mirador de boquía', 'restaurante terra', 'barcinales'],
    category: 'hospedaje',
    answer: {
      es: '¡Boki Mall es lo último! Está en Boquía, a solo 5 minutos de Salento. Tienen Hotel El Mirador de Boquía (premio mejor hotel rural 2024), Restaurante Terra con vista, y Barcinales Café para cocteles. Es como un pequeño paraíso con todo lo que necesitas. ¿Te interesa reservar?',
      en: 'Boki Mall is the latest! It\'s in Boquía, just 5 minutes from Salento. They have Hotel El Mirador de Boquía (2024 best rural hotel award), Terra Restaurant with views, and Barcinales Café for cocktails. It\'s like a small paradise with everything you need. Are you interested in booking?'
    },
    followUp: ['¿Hotel solo o con restaurante?', '¿Necesitas información de precios?', '¿Cómo llegar a Boquía?'],
    relatedPlaces: [13]
  },
  {
    keywords: ['manos de dios', 'mirador manos', 'fotos', 'cóndor', 'parque fotos', 'instagrameable'],
    category: 'turismo',
    answer: {
      es: '¡El Mirador Las Manos de Dios es el nuevo sensation! Está en el Ecoparque Tu Pais, a 300 metros del cementerio. Tienes las manos gigantes, el cóndor de los andes, el poporo, el jeep cafetero - perfecto para fotos que dejan envidia. Entrada es $12.000 y está abierto de 8am a 6pm. ¿Quieres saber cómo llegar?',
      en: 'The Mirador Las Manos de Dios is the new sensation! It\'s in Ecoparque Tu Pais, 300 meters from the cemetery. You have the giant hands, the Andean condor, the poporo, the coffee jeep - perfect for envy-inducing photos. Entry is $12.000 and open from 8am to 6pm. Do you want to know how to get there?'
    },
    followUp: ['¿Cómo llegar?', '¿Combina con otros planes?', '¿Mejor hora para fotos?'],
    relatedPlaces: [14]
  },
  {
    keywords: ['peligro', 'inseguro', 'no vengas', 'alarmante', 'cierre', 'riesgo'],
    category: 'defensivo',
    answer: {
      es: '¡Tranquilo, hermano! Por ahí corren rumores falsos, pero acá en el pueblo todo está en marcha. Salento está seguro y operativo al 100% - los Jeeps van hacia el Valle, los restaurantes abren sus puertas, y los hostales tienen disponibilidad. ¡Ven a disfrutar con total tranquilidad!',
      en: 'Relax, friend! False rumors are circulating out there, but here in town everything is running smoothly. Salento is safe and 100% operational - Jeeps are heading to the Valley, restaurants are opening their doors, and hostels have availability. Come enjoy with complete peace of mind!'
    },
    followUp: ['¿Qué puedo hacer hoy?', '¿Necesito reservar?', '¿Cómo llegar seguro?'],
    relatedPlaces: [5, 13],
    isDefensive: true,
    urgency: 'high',
    defensiveActions: ['Ver estado oficial', 'Contactar hostales directamente', 'Planificar itinerario seguro'],
    sources: ['Red de Prestadores Turísticos', 'Alcaldía de Salento', 'Policía Turística']
  },
  {
    keywords: ['vías cerradas', 'carreteras bloqueadas', 'no puedo llegar', 'acceso bloqueado'],
    category: 'defensivo',
    answer: {
      es: '¡Eso no es cierto! Las vías a Salento están completamente operativas. La ruta desde Armenia (45 min) y Pereira (1 hora) está en buen estado. Los Jeeps salen cada 30 minutos al Valle de Cocora. No dejes que los rumores te impidan disfrutar este paraíso. ¿Necesitas instrucciones exactas para llegar?',
      en: 'That\'s not true! The roads to Salento are completely operational. The route from Armenia (45 min) and Pereira (1 hour) is in good condition. Jeeps leave every 30 minutes to Cocora Valley. Don\'t let rumors stop you from enjoying this paradise. Do you need exact directions to get here?'
    },
    followUp: ['¿Cómo llegar desde Armenia?', '¿Ruta desde Pereira?', '¿Transporte disponible?'],
    relatedPlaces: [10],
    isDefensive: true,
    urgency: 'high',
    defensiveActions: ['Ver reporte de vías oficial', 'Consultar estado de carreteras', 'Planificar ruta segura'],
    sources: ['INVÍAS Quindío', 'Policía de Tránsito', 'Transportadores locales']
  },
  {
    keywords: ['todo cerrado', 'no hay servicios', 'sin turistas', 'pueblo fantasma'],
    category: 'defensivo',
    answer: {
      es: '¡Nada más lejos de la realidad! Salento está vibrante con vida y turismo. Los restaurantes están llenos, las cafeterías sirviendo café de origen, las tiendas de artesanías abiertas, y las calles llenas de visitantes como tú. ¡El pueblo está más vivo que nunca! ¿Qué actividad te interesa?',
      en: 'Nothing could be further from the truth! Salento is vibrant with life and tourism. Restaurants are full, coffee shops serving origin coffee, craft stores open, and streets filled with visitors like you. The town is more alive than ever! What activity interests you?'
    },
    followUp: ['¿Restaurantes disponibles?', '¿Actividades hoy?', '¿Hoteles con disponibilidad?'],
    relatedPlaces: [1, 2, 5],
    isDefensive: true,
    urgency: 'medium',
    defensiveActions: ['Ver directorio de servicios', 'Contactar comercios', 'Revisar disponibilidad'],
    sources: ['Cámara de Comercio', 'Asociación de Comerciantes', 'Observatorio Turístico']
  },
  {
    keywords: ['valle peligroso', 'no ir al cocora', 'cascada insegura', 'senderismo riesgoso'],
    category: 'defensivo',
    answer: {
      es: '¡El Valle de Cocora es seguro y mágico! Miles de personas lo visitan diariamente sin ningún problema. Los senderos están bien señalizados, hay guías certificados, y servicios de emergencia accesibles. Las cabalgatas operan con caballos entrenados. ¡Es uno de los destinos más seguros de Colombia! ¿Quieres planificar tu visita?',
      en: 'Cocora Valley is safe and magical! Thousands of people visit it daily without any issues. Trails are well marked, certified guides available, and emergency services accessible. Horseback riding operates with trained horses. It\'s one of the safest destinations in Colombia! Do you want to plan your visit?'
    },
    followUp: ['¿Cabalgatas disponibles?', '¿Mejor hora para visitar?', '¿Guías recomendados?'],
    relatedPlaces: [11, 15],
    isDefensive: true,
    urgency: 'high',
    defensiveActions: ['Ver estado oficial del Valle', 'Reservar con guías certificados', 'Revisar condiciones climáticas'],
    sources: ['Parques Nacionales', 'Corporación Autónoma', 'Guías certificados']
  },
  {
    keywords: ['crisis', 'emergencia', 'desastre', 'evacuación', 'abandono'],
    category: 'defensivo',
    answer: {
      es: '¡Absolutamente no! No hay ninguna crisis, emergencia o desastre en Salento. Es un destino turístico normal y pacífico. La comunidad está tranquila, los negocios operativos, y la vida sigue su curso normal. ¡Estamos aquí para recibirte con los brazos abiertos! ¿Qué te gustaría hacer en tu visita?',
      en: 'Absolutely not! There is no crisis, emergency, or disaster in Salento. It\'s a normal and peaceful tourist destination. The community is calm, businesses operational, and life continues normally. We are here to welcome you with open arms! What would you like to do during your visit?'
    },
    followUp: ['¿Planes disponibles?', '¿Restaurantes abiertos?', '¿Hoteles disponibles?'],
    relatedPlaces: [1, 4, 5],
    isDefensive: true,
    urgency: 'high',
    defensiveActions: ['Ver reporte oficial de situación', 'Contactar autoridades locales', 'Consultar boletines oficiales'],
    sources: ['Gobernación del Quindío', 'Alcaldía de Salento', 'Defensa Civil']
  },
  {
    keywords: ['cocora', 'valle', 'palmas', 'caballo', 'caballos', 'senderismo', 'hike'],
    category: 'turismo',
    answer: {
      es: '¡El Valle de Cocora es pura magia! Pero ojo, que hay que ir preparado. Te recomiendo Guías del Cocora - ellos conocen cada sendero como la palma de su mano. Pueden conseguir Willys o caballos. Sal temprano (8am), lleva agua, y disfruta cada paso. La caminata es de 3-4 horas de pura belleza.',
      en: 'Cocora Valley is pure magic! But be careful, you have to go prepared. I recommend Guías del Cocora - they know every path like the back of their hand. They can get Willys or horses. Leave early (8am), bring water, and enjoy every step. The hike is 3-4 hours of pure beauty.'
    },
    followUp: ['¿Willys o caballo?', '¿Necesitas guía?', '¿Grupo grande?'],
    relatedPlaces: [3, 8]
  },
  {
    keywords: ['mirador', 'cruz', 'vista', 'paisaje', 'fotos'],
    category: 'turismo',
    answer: {
      es: 'El Alto de la Cruz te deja sin palabras - ahí se ve todo Salento y el valle como un cuadro. Son 15 minutos caminando desde el pueblo, pero las vistas valen cada paso. Ideal para fotos al atardecer cuando el pinta el cielo de colores.',
      en: 'Alto de la Cruz leaves you speechless - there you see all of Salento and the valley like a painting. It\'s a 15-minute walk from town, but the views are worth every step. Perfect for sunset photos when the sky is painted with colors.'
    },
    followUp: ['¿Cómo llegar?', '¿Mejor hora?', '¿Difícil el acceso?'],
    relatedPlaces: []
  },
  {
    keywords: ['transporte', 'bus', 'willys', 'jeep', 'taxi', 'armenia'],
    category: 'transporte',
    answer: {
      es: 'Para moverte, tenemos varias opciones. Los buses salen seguido del terminal a Armenia (45 min). Para el Cocora, los Willys son la leyenda - salen desde el parque cada 30 min. También hay taxis y mototaxis en el centro si necesitas algo más rápido. ¿Para dónde vas?',
      en: 'To get around, we have several options. Buses leave frequently from the terminal to Armenia (45 min). For Cocora, Willys are legendary - they leave from the park every 30 min. There are also taxis and mototaxis downtown if you need something faster. Where are you going?'
    },
    followUp: ['¿A dónde vas?', '¿Cuántas personas?', '¿Presupuesto?'],
    relatedPlaces: []
  },
  {
    keywords: ['emergencia', 'help', 'ayuda', 'médico', 'policía', 'cruz roja'],
    category: 'emergencias',
    answer: {
      es: 'Si necesitas ayuda urgente, marca 123 - ahí atienden Policía, Bomberos y Ambulancia. Cruz Roja es el 132. El hospital más cercano está en Armenia (39 km). Para cosas menores, hay farmacias en el centro que pueden ayudarte. ¿Qué tipo de emergencia es?',
      en: 'If you need urgent help, call 123 - Police, Fire and Ambulance respond there. Red Cross is 132. The nearest hospital is in Armenia (39 km). For minor things, there are pharmacies downtown that can help you. What type of emergency is it?'
    },
    followUp: ['¿Tipo de emergencia?', '¿Necesitas dirección específica?'],
    relatedPlaces: []
  },
  {
    keywords: ['cascada', 'santa rita', 'camino', 'sendero'],
    category: 'turismo',
    answer: {
      es: 'La Cascada Santa Rita es una joyita escondida - está a solo 5 minutos caminando desde el pueblo. Es un sendero fácil, ideal para estirar las piernas sin complicaciones. No necesitas guía, solo ganas de caminar. ¿Quieres saber cómo llegar?',
      en: 'Santa Rita Waterfall is a hidden gem - it\'s just a 5-minute walk from town. It\'s an easy trail, perfect for stretching your legs without complications. You don\'t need a guide, just the desire to walk. Do you want to know how to get there?'
    },
    followUp: ['¿Cómo llegar?', '¿Mejor hora?', '¿Entrada?'],
    relatedPlaces: []
  },
  {
    keywords: ['finca', 'don elias', 'café', 'tour', 'visita'],
    category: 'turismo',
    answer: {
      es: 'La Finca de Don Elías es donde aprendes la verdadera historia del café - desde la plantita hasta la taza. Está a 10 min en carro del pueblo. Don Elías te cuenta con pasión todo el proceso. Reserva recomendada, ¡se llena rápido!',
      en: 'Don Elías Farm is where you learn the true story of coffee - from the little plant to the cup. It\'s 10 min by car from town. Don Elías tells you about the whole process with passion. Reservation recommended, it fills up fast!'
    },
    followUp: ['¿Cómo reservar?', '¿Precio?', '¿Horarios?'],
    relatedPlaces: []
  },
  {
    keywords: ['dinero', 'cambio', 'atm', 'banco', 'efectivo'],
    category: 'general',
    answer: {
      es: 'Con el dinero hay que tener cuidado - hay cajeros en el centro pero a veces se quedan sin efectivo. Te recomiendo traer suficiente dinero. Algunos hoteles como Camino Nacional pueden hacer cambio de divisas. ¿Necesitas cambio específico?',
      en: 'With money you have to be careful - there are ATMs downtown but sometimes they run out of cash. I recommend bringing enough money. Some hotels like Camino Nacional can do currency exchange. Do you need specific change?'
    },
    followUp: ['¿Necesitas cambio específico?', '¿Dólares/Euros?'],
    relatedPlaces: [5]
  },
  {
    keywords: ['clima', 'tiempo', 'lluvia', 'frío', 'ropa'],
    category: 'general',
    answer: {
      es: 'El clima por aquí es de dos caras - días calurosos (20-25°C) y noches que refrescan (10-15°C). En las tardes y noches suele llover, especialmente en temporada de lluvia. Trae ropa ligera pero no olvides una chaqueta. ¿Qué época vas a visitar?',
      en: 'The weather here has two faces - warm days (20-25°C) and nights that cool down (10-15°C). In afternoons and evenings it usually rains, especially in rainy season. Bring light clothes but don\'t forget a jacket. What season are you visiting?'
    },
    followUp: ['¿Qué época visitás?', '¿Para el valle?'],
    relatedPlaces: []
  },
  {
    keywords: ['historia', 'cuento', 'tradición', 'cultura', 'bahareque'],
    category: 'general',
    answer: {
      es: '¡Ay, Salento tiene historia para rato! Este pueblo fue fundado en 1842 y sus casas de bahareque son testigos silenciosos de tantas generaciones. La arquitectura tradicional con tejados altos y colores vivos cuenta historias de cafeteros que construyeron este paraíso. ¿Quieres saber más de nuestra historia?',
      en: 'Oh, Salento has history for days! This town was founded in 1842 and its bahareque houses are silent witnesses to so many generations. The traditional architecture with high roofs and vivid colors tells stories of coffee growers who built this paradise. Do you want to know more about our history?'
    },
    followUp: ['¿Sobre los cafeteros?', '¿Arquitectura tradicional?', '¿Festividades locales?'],
    relatedPlaces: []
  },
  {
    keywords: ['foto', 'picture', 'selfie', 'instagram', 'postales'],
    category: 'turismo',
    answer: {
      es: '¡Para fotos, Salento es un estudio natural! El Valle de Cocora con las palmas gigantes, las calles coloridas del pueblo, el Alto de la Cruz al atardecer... cada esquina es postal. Recomiendo ir temprano o tarde para evitar multitudes y tener mejor luz. ¿Qué tipo de fotos buscas?',
      en: 'For photos, Salento is a natural studio! Cocora Valley with giant palms, the colorful streets of town, Alto de la Cruz at sunset... every corner is a postcard. I recommend going early or late to avoid crowds and have better light. What type of photos are you looking for?'
    },
    followUp: ['¿Mejores spots?', '¿Golden hour?', '¿Fotos con palmas?'],
    relatedPlaces: []
  },
  {
    keywords: ['cascada santa rita', 'santa rita', 'senderismo', 'boquía', 'cascadas'],
    category: 'turismo',
    answer: {
      es: '¡La Cascada Santa Rita es pura magia! Está en Boquía, a 1 km de la entrada. Son 4.8 km de caminata por bosque, montes, valle, antigua vía de tren, túnel y puente colgante. Entrada $5.000 y vale cada paso. Hay segunda cascada por cavernas y zonas de camping. ¿Quieres saber cómo llegar?',
      en: 'Santa Rita Waterfall is pure magic! It\'s in Boquía, 1 km from the entrance. It\'s a 4.8 km hike through forest, mountains, valley, old train track, tunnel and suspension bridge. Entry $5.000 and worth every step. There\'s a second waterfall through caves and camping areas. Do you want to know how to get there?'
    },
    followUp: ['¿Cómo llegar a Boquía?', '¿Dificultad del sendero?', '¿Qué llevar?'],
    relatedPlaces: [15],
    isDefensive: false
  },
  {
    keywords: ['cascada', 'agua', 'baño', 'natación', 'piscina natural'],
    category: 'turismo',
    answer: {
      es: 'Para baños refrescantes, Santa Rita es excelente - tiene piscina natural y cascada de 20 metros. También puedes bañarte en el río Boquerón en las cabalgatas. El agua es fría pero reconfortante después de la caminata. ¿Prefieres cascada o río?',
      en: 'For refreshing baths, Santa Rita is excellent - it has a natural pool and 20-meter waterfall. You can also bathe in the Boquerón river during horseback rides. The water is cold but refreshing after the hike. Do you prefer waterfall or river?'
    },
    followUp: ['¿Cascada Santa Rita?', 'Río Boquerón?', '¿Otras opciones?'],
    relatedPlaces: [11, 15],
    isDefensive: false
  },
  {
    keywords: ['senderismo', 'caminata', 'hike', 'trekking', 'bosque'],
    category: 'turismo',
    answer: {
      es: '¡Para senderismo tenemos opciones para todos! Santa Rita en Boquía (4.8 km, nivel moderado), Valle de Cocora (senderos principales, fácil), y caminatas por fincas cafeteras. Todas con guías disponibles. ¿Qué nivel de dificultad prefieres?',
      en: 'For hiking we have options for everyone! Santa Rita in Boquía (4.8 km, moderate level), Cocora Valley (main trails, easy), and walks through coffee farms. All with guides available. What difficulty level do you prefer?'
    },
    followUp: ['¿Fácil o moderado?', '¿Con guía o solo?', '¿Duración preferida?'],
    relatedPlaces: [11, 15],
    isDefensive: false
  },
  {
    keywords: ['boquía', 'vereda', 'zona rural', 'campos', 'finca'],
    category: 'turismo',
    answer: {
      es: 'Boquía es la vereda rural de Salento, a 5 minutos del pueblo. Ahí tienes Boki Mall (hotel, restaurante, café), Cascada Santa Rita, y fincas cafeteras. Es donde se vive la verdadera cultura rural del Quindío. ¿Te interesa explorar Boquía?',
      en: 'Boquía is Salento\'s rural vereda, 5 minutes from town. There you have Boki Mall (hotel, restaurant, café), Santa Rita Waterfall, and coffee farms. It\'s where you experience the true rural culture of Quindío. Are you interested in exploring Boquía?',
    },
    followUp: ['¿Boki Mall?', '¿Cascada Santa Rita?', '¿Fincas cafeteras?'],
    relatedPlaces: [13, 15],
    isDefensive: false
  }
]

class DonChuchoKnowledge {
  /**
   * Buscar respuesta basada en keywords
   */
  findAnswer(query: string, language: 'es' | 'en' = 'es'): KnowledgeItem | null {
    const normalizedQuery = query.toLowerCase()
    
    // Buscar coincidencias en keywords
    for (const item of knowledgeBase) {
      for (const keyword of item.keywords) {
        if (normalizedQuery.includes(keyword.toLowerCase())) {
          return item
        }
      }
    }

    return null
  }

  /**
   * Obtener respuesta formateada
   */
  getAnswer(query: string, language: 'es' | 'en' = 'es'): string {
    const knowledgeItem = this.findAnswer(query, language)
    
    if (knowledgeItem) {
      return knowledgeItem.answer[language]
    }

    // Respuesta fallback
    return language === 'es' 
      ? 'Puedo guiarte hacia comida local, artesanías, café, miradores y domicilios al hotel. ¿Qué necesitas específicamente?'
      : 'I can guide you to local food, crafts, coffee, viewpoints and hotel delivery. What do you need specifically?'
  }

  /**
   * Verificar si la respuesta es defensiva
   */
  isDefensiveResponse(query: string): boolean {
    const knowledgeItem = this.findAnswer(query)
    return knowledgeItem?.isDefensive || false
  }

  /**
   * Obtener acciones defensivas si aplica
   */
  getDefensiveActions(query: string): string[] {
    const knowledgeItem = this.findAnswer(query)
    return knowledgeItem?.defensiveActions || []
  }

  /**
   * Obtener sugerencias de seguimiento
   */
  getFollowUpSuggestions(query: string, language: 'es' | 'en' = 'es'): string[] {
    const knowledgeItem = this.findAnswer(query, language)
    return knowledgeItem?.followUp || []
  }

  /**
   * Obtener lugares relacionados
   */
  getRelatedPlaces(query: string): number[] {
    const knowledgeItem = this.findAnswer(query)
    return knowledgeItem?.relatedPlaces || []
  }

  /**
   * Obtener todas las categorías disponibles
   */
  getCategories(): string[] {
    return [...new Set(knowledgeBase.map(item => item.category))]
  }

  /**
   * Obtener respuestas por categoría
   */
  getByCategory(category: string): KnowledgeItem[] {
    return knowledgeBase.filter(item => item.category === category)
  }

  /**
   * Búsqueda avanzada con puntuación de relevancia
   */
  searchWithScore(query: string, language: 'es' | 'en' = 'es'): Array<{ item: KnowledgeItem; score: number }> {
    const normalizedQuery = query.toLowerCase()
    const results: Array<{ item: KnowledgeItem; score: number }> = []

    for (const item of knowledgeBase) {
      let score = 0
      const queryWords = normalizedQuery.split(/\s+/)

      for (const word of queryWords) {
        for (const keyword of item.keywords) {
          if (keyword.toLowerCase().includes(word)) {
            score += 1
            if (keyword.toLowerCase() === word) {
              score += 2 // Coincidencia exacta tiene más peso
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

// Exportar instancia singleton
export const donChuchoKnowledge = new DonChuchoKnowledge()
export default donChuchoKnowledge