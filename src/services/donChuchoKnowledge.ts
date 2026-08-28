// Base de conocimiento local para Don Chucho
// Contiene información específica sobre Salento para respuestas más inteligentes

interface KnowledgeItem {
  keywords: string[]
  category: 'cafe' | 'comida' | 'artesanias' | 'hospedaje' | 'turismo' | 'transporte' | 'emergencias' | 'general'
  answer: {
    es: string
    en: string
  }
  followUp?: string[]
  relatedPlaces?: number[] // IDs de lugares relacionados
}

const knowledgeBase: KnowledgeItem[] = [
  {
    keywords: ['cafe', 'coffee', 'cafetería', 'café especialidad', 'origen'],
    category: 'cafe',
    answer: {
      es: 'En Salento tienes excelentes opciones de café de origen. Te recomiendo Café Quindío cerca de la plaza principal, Café de Altura con métodos filtrados, o Brunch de la Plaza para desayunos con café. ¿Buscas algo específico?',
      en: 'In Salento you have excellent specialty coffee options. I recommend Café Quindío near the main square, Café de Altura with filtered methods, or Brunch de la Plaza for coffee breakfasts. Looking for something specific?'
    },
    followUp: ['¿Quieres café con desayuno?', '¿Prefieres métodos filtrados?', '¿Necesitas directions?'],
    relatedPlaces: [1, 6]
  },
  {
    keywords: ['trucha', 'comida', 'restaurant', 'almuerzo', 'cena', 'parrilla'],
    category: 'comida',
    answer: {
      es: 'Para comida tradicional salentina, La Fogata es excelente para trucha y patacón. También Brunch de la Plaza para desayunos y almuerzos ligeros. ¿Tienes alguna preferencia específica?',
      en: 'For traditional Salento food, La Fogata is excellent for trout and patacón. Also Brunch de la Plaza for breakfasts and light lunches. Any specific preference?'
    },
    followUp: ['¿Prefieres trucha?', '¿Quieres algo vegetariano?', '¿Necesitas domicilio?'],
    relatedPlaces: [1, 4]
  },
  {
    keywords: ['artesanias', 'artesanía', 'souvenir', 'regalo', 'bolsos', 'cerámica'],
    category: 'artesanias',
    answer: {
      es: 'Para artesanías locales, Canasto Quindío en la Calle Real tiene productos hechos por manos locales: bolsos tejidos, cerámica y café de origen. También hay otras tiendas en la zona.',
      en: 'For local crafts, Canasto Quindío on Calle Real has handmade products: woven bags, ceramics, and origin coffee. There are also other shops in the area.'
    },
    followUp: ['¿Buscas algo específico?', '¿Necesitas regalo?', '¿Presupuesto aproximado?'],
    relatedPlaces: [2]
  },
  {
    keywords: ['hotel', 'hospedaje', 'alojamiento', 'habitación', 'posada'],
    category: 'hospedaje',
    answer: {
      es: 'Hotel Camino Nacional es una excelente opción 2 estrellas en el centro. También hay otras posadas y hostales en la zona. ¿Cuántas personas son y qué fechas necesitas?',
      en: 'Hotel Camino Nacional is an excellent 2-star option in the center. There are also other inns and hostels in the area. How many people and what dates do you need?'
    },
    followUp: ['¿Cuántas personas?', '¿Qué fechas?', '¿Presupuesto?'],
    relatedPlaces: [5]
  },
  {
    keywords: ['cocora', 'valle', 'palmas', 'caballo', 'caballos', 'senderismo', 'hike'],
    category: 'turismo',
    answer: {
      es: 'Para el Valle de Cocora, te recomiendo reservar un guía local con Guías del Cocora. Pueden organizar el transporte en Willys o caballos. Sal temprano (8am) y lleva agua. La caminata toma 3-4 horas.',
      en: 'For Cocora Valley, I recommend booking a local guide with Guías del Cocora. They can arrange Willys or horse transport. Leave early (8am) and bring water. The hike takes 3-4 hours.'
    },
    followUp: ['¿Prefieres Willys o caballo?', '¿Necesitas guía?', '¿Grupo grande?'],
    relatedPlaces: [3, 8]
  },
  {
    keywords: ['mirador', 'cruz', 'vista', 'paisaje', 'fotos'],
    category: 'turismo',
    answer: {
      es: 'El Mirador Alto de la Cruz ofrece las mejores vistas de Salento y el valle. Está a 15 minutos caminando desde el pueblo. Ideal para fotos al atardecer.',
      en: 'The Alto de la Cruz viewpoint offers the best views of Salento and the valley. It\'s a 15-minute walk from town. Perfect for sunset photos.'
    },
    followUp: ['¿Cómo llegar?', '¿Mejor hora?', '¿Difícil el acceso?'],
    relatedPlaces: []
  },
  {
    keywords: ['transporte', 'bus', 'willys', 'jeep', 'taxi', 'armenia'],
    category: 'transporte',
    answer: {
      es: 'Para transporte: buses salen频繁mente del terminal a Armenia (45 min). Para Cocora, los Willys salen desde el parque (cada 30 min). Taxis y mototaxis disponibles en el centro.',
      en: 'For transport: buses run frequently from the terminal to Armenia (45 min). For Cocora, Willys leave from the park (every 30 min). Taxis and mototaxis available downtown.'
    },
    followUp: ['¿A dónde vas?', '¿Cuántas personas?', '¿Presupuesto?'],
    relatedPlaces: []
  },
  {
    keywords: ['emergencia', 'help', 'ayuda', 'médico', 'policía', 'cruz roja'],
    category: 'emergencias',
    answer: {
      es: 'Emergencias: 123 (Policía, Bomberos, Ambulancia), Cruz Roja: 132. Hospital más cercano en Armenia (39 km). Para emergencias menores, hay farmacias en el centro.',
      en: 'Emergencies: 123 (Police, Fire, Ambulance), Red Cross: 132. Nearest hospital in Armenia (39 km). For minor emergencies, there are pharmacies downtown.'
    },
    followUp: ['¿Tipo de emergencia?', '¿Necesitas dirección específica?'],
    relatedPlaces: []
  },
  {
    keywords: ['cascada', 'santa rita', 'camino', 'sendero'],
    category: 'turismo',
    answer: {
      es: 'La Cascada Santa Rita está a solo 5 minutos caminando desde el pueblo. Es un sendero fácil y accesible. Ideal para una caminata corta. No necesitas guía.',
      en: 'Santa Rita Waterfall is just a 5-minute walk from town. It\'s an easy and accessible trail. Perfect for a short hike. No guide needed.'
    },
    followUp: ['¿Cómo llegar?', '¿Mejor hora?', '¿Entrada?'],
    relatedPlaces: []
  },
  {
    keywords: ['finca', 'don elias', 'café', 'tour', 'visita'],
    category: 'turismo',
    answer: {
      es: 'Finca de Don Elías ofrece tours de café tradicionales. Está a 10 min en carro del pueblo. Aprendes sobre el proceso del café desde la planta hasta la taza. Reserva recomendada.',
      en: 'Finca de Don Elías offers traditional coffee tours. It\'s 10 min by car from town. You learn about the coffee process from plant to cup. Reservation recommended.'
    },
    followUp: ['¿Cómo reservar?', '¿Precio?', '¿Horarios?'],
    relatedPlaces: []
  },
  {
    keywords: ['dinero', 'cambio', 'atm', 'banco', 'efectivo'],
    category: 'general',
    answer: {
      es: 'Hay cajeros ATM en el centro, pero a veces se quedan sin efectivo. Te recomiendo traer suficiente efectivo. Algunos hoteles como Camino Nacional ofrecen cambio de divisas.',
      en: 'There are ATMs downtown, but sometimes they run out of cash. I recommend bringing enough cash. Some hotels like Camino Nacional offer currency exchange.'
    },
    followUp: ['¿Necesitas cambio específico?', '¿Dólares/Euros?'],
    relatedPlaces: [5]
  },
  {
    keywords: ['clima', 'tiempo', 'lluvia', 'frío', 'ropa'],
    category: 'general',
    answer: {
      es: 'El clima es variable: días calurosos (20-25°C) y noches frescas (10-15°C). Lluvias en tarde/noche especialmente en temporada lluviosa. Trae ropa ligera y una chaqueta.',
      en: 'Weather is variable: warm days (20-25°C) and cool nights (10-15°C). Rain in afternoon/evening especially in rainy season. Bring light clothes and a jacket.'
    },
    followUp: ['¿Qué época visitás?', '¿Para el valle?'],
    relatedPlaces: []
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