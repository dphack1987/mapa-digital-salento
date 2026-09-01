/**
 * Servicio de Palabras Clave Internacionales
 * Optimizado para SEO internacional en múltiples idiomas y mercados
 */

interface InternationalKeyword {
  keyword: string
  language: string
  region: string
  volume: string
  difficulty: string
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
  searchEngine: string
  priority: 'high' | 'medium' | 'low'
  localTranslation: string
}

interface MarketContent {
  market: string
  language: string
  primaryKeywords: string[]
  secondaryKeywords: string[]
  contentRecommendations: string[]
  culturalNotes: string[]
}

class InternationalKeywordsService {
  private brandName: string = 'Salento a la Mano'
  private primaryLocation: string = 'Salento, Quindío, Colombia'

  /**
   * Obtener palabras clave internacionales por mercado
   */
  getInternationalKeywords(): InternationalKeyword[] {
    return [
      // Keywords para mercado chino (Baidu)
      {
        keyword: '哥伦比亚 萨伦托 旅游',
        language: 'zh-CN',
        region: 'CN',
        volume: 'Alto',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Baidu',
        priority: 'high',
        localTranslation: '哥伦比亚 萨伦托 旅游 (Colombia Salento Tourism)'
      },
      {
        keyword: '萨伦托 咖啡三角洲',
        language: 'zh-CN',
        region: 'CN',
        volume: 'Medio',
        difficulty: 'Alta',
        intent: 'informational',
        searchEngine: 'Baidu',
        priority: 'high',
        localTranslation: '萨伦托 咖啡三角洲 (Salento Coffee Triangle)'
      },
      {
        keyword: '哥伦比亚 旅游 攻略',
        language: 'zh-CN',
        region: 'CN',
        volume: 'Alto',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Baidu',
        priority: 'high',
        localTranslation: '哥伦比亚 旅游 攻略 (Colombia Travel Guide)'
      },

      // Keywords para mercado ruso (Yandex)
      {
        keyword: 'Саленто Колумбия туризм',
        language: 'ru-RU',
        region: 'RU',
        volume: 'Alto',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Yandex',
        priority: 'high',
        localTranslation: 'Саленто Колумбия туризм (Salento Colombia Tourism)'
      },
      {
        keyword: 'Кофейный треугольник Колумбия',
        language: 'ru-RU',
        region: 'RU',
        volume: 'Medio',
        difficulty: 'Alta',
        intent: 'informational',
        searchEngine: 'Yandex',
        priority: 'high',
        localTranslation: 'Кофейный треугольник Колумбия (Coffee Triangle Colombia)'
      },
      {
        keyword: 'отдых в Колумбии',
        language: 'ru-RU',
        region: 'RU',
        volume: 'Alto',
        difficulty: 'Media',
        intent: 'transactional',
        searchEngine: 'Yandex',
        priority: 'high',
        localTranslation: 'отдых в Колумбии (Vacation in Colombia)'
      },

      // Keywords para mercado japonés (Yahoo Japan)
      {
        keyword: 'コロンビア サレント 観光',
        language: 'ja-JP',
        region: 'JP',
        volume: 'Medio',
        difficulty: 'Alta',
        intent: 'informational',
        searchEngine: 'Yahoo Japan',
        priority: 'medium',
        localTranslation: 'コロンビア サレント 観光 (Colombia Salento Tourism)'
      },
      {
        keyword: 'コロンビア コーヒー 旅行',
        language: 'ja-JP',
        region: 'JP',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Yahoo Japan',
        priority: 'medium',
        localTranslation: 'コロンビア コーヒー 旅行 (Colombia Coffee Travel)'
      },

      // Keywords para mercado coreano (Naver)
      {
        keyword: '콜롬비아 살렌토 여행',
        language: 'ko-KR',
        region: 'KR',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Naver',
        priority: 'medium',
        localTranslation: '콜롬비아 살렌토 여행 (Colombia Salento Travel)'
      },
      {
        keyword: '콜롬비아 커피 트라이앵글',
        language: 'ko-KR',
        region: 'KR',
        volume: 'Bajo',
        difficulty: 'Alta',
        intent: 'informational',
        searchEngine: 'Naver',
        priority: 'medium',
        localTranslation: '콜롬비아 커피 트라이앵글 (Colombia Coffee Triangle)'
      },

      // Keywords para mercado alemán (Google)
      {
        keyword: 'Kolumbien Salento Tourismus',
        language: 'de-DE',
        region: 'DE',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Kolumbien Salento Tourismus (Colombia Salento Tourism)'
      },
      {
        keyword: 'Kolumbien Kaffee Reise',
        language: 'de-DE',
        region: 'DE',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Kolumbien Kaffee Reise (Colombia Coffee Travel)'
      },

      // Keywords para mercado francés (Google)
      {
        keyword: 'Colombie Salento tourisme',
        language: 'fr-FR',
        region: 'FR',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Colombie Salento tourisme (Colombia Salento tourism)'
      },
      {
        keyword: 'Voyage Colombie café',
        language: 'fr-FR',
        region: 'FR',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Voyage Colombie café (Colombia coffee travel)'
      },

      // Keywords para mercado británico (Google)
      {
        keyword: 'Colombia Salento travel',
        language: 'en-GB',
        region: 'GB',
        volume: 'Alto',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Colombia Salento travel'
      },
      {
        keyword: 'Colombia coffee triangle tourism',
        language: 'en-GB',
        region: 'GB',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Colombia coffee triangle tourism'
      },

      // Keywords para mercado estadounidense (Google)
      {
        keyword: 'Colombia Salento vacation',
        language: 'en-US',
        region: 'US',
        volume: 'Alto',
        difficulty: 'Media',
        intent: 'transactional',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Colombia Salento vacation'
      },
      {
        keyword: 'Colombia travel guide',
        language: 'en-US',
        region: 'US',
        volume: 'Alto',
        difficulty: 'Alta',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Colombia travel guide'
      },

      // Keywords para mercado brasileño (Google)
      {
        keyword: 'Colômbia Salento turismo',
        language: 'pt-BR',
        region: 'BR',
        volume: 'Alto',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Colômbia Salento turismo (Colombia Salento tourism)'
      },
      {
        keyword: 'Viagem Colômbia café',
        language: 'pt-BR',
        region: 'BR',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Viagem Colômbia café (Colombia coffee travel)'
      },

      // Keywords para mercado taiwanés (Google - Chino Tradicional)
      {
        keyword: '台灣 哥倫比亞 薩倫托 旅游',
        language: 'zh-TW',
        region: 'TW',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: '台灣 哥倫比亞 薩倫托 旅游 (Taiwan Colombia Salento Tourism)'
      },
      {
        keyword: '哥倫比亞 咖啡 三角洲',
        language: 'zh-TW',
        region: 'TW',
        volume: 'Bajo',
        difficulty: 'Alta',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: '哥倫比亞 咖啡 三角洲 (Colombia Coffee Triangle)'
      },

      // Keywords para mercado hongkonés (Google - Chino Tradicional)
      {
        keyword: '香港 哥倫比亞 薩倫托 旅游',
        language: 'zh-HK',
        region: 'HK',
        volume: 'Bajo',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: '香港 哥倫比亞 薩倫托 旅游 (Hong Kong Colombia Salento Tourism)'
      },

      // Keywords para mercado tailandés (Google)
      {
        keyword: 'โคลอมเบีย ซาเลนโต ท่องเที่ยว',
        language: 'th-TH',
        region: 'TH',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'โคลอมเบีย ซาเลนโต ท่องเที่ยว (Colombia Salento Tourism)'
      },
      {
        keyword: 'โคลอมเบีย กาแฟ ท่องเที่ยว',
        language: 'th-TH',
        region: 'TH',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'โคลอมเบีย กาแฟ ท่องเที่ยว (Colombia Coffee Travel)'
      },

      // Keywords para mercado vietnamita (Google)
      {
        keyword: 'Colombia Salento du lịch',
        language: 'vi-VN',
        region: 'VN',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Colombia Salento du lịch (Colombia Salento Tourism)'
      },
      {
        keyword: 'Colombia cà phê du lịch',
        language: 'vi-VN',
        region: 'VN',
        volume: 'Bajo',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Colombia cà phê du lịch (Colombia Coffee Travel)'
      },

      // Keywords para mercado indonesio (Google)
      {
        keyword: 'Kolombia Salento wisata',
        language: 'id-ID',
        region: 'ID',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Kolombia Salento wisata (Colombia Salento Tourism)'
      },
      {
        keyword: 'Kolombia kopi wisata',
        language: 'id-ID',
        region: 'ID',
        volume: 'Medio',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Kolombia kopi wisata (Colombia Coffee Travel)'
      },

      // Keywords para mercado malayo (Google)
      {
        keyword: 'Colombia Salento pelancongan',
        language: 'ms-MY',
        region: 'MY',
        volume: 'Bajo',
        difficulty: 'Media',
        intent: 'informational',
        searchEngine: 'Google',
        priority: 'medium',
        localTranslation: 'Colombia Salento pelancongan (Colombia Salento Tourism)'
      },
    ]
  }

  /**
   * Obtener recomendaciones de contenido por mercado
   */
  getMarketContentRecommendations(): MarketContent[] {
    return [
      {
        market: 'China',
        language: 'zh-CN',
        primaryKeywords: ['哥伦比亚 萨伦托 旅游', '萨伦托 咖啡三角洲', '哥伦比亚 旅游 攻略'],
        secondaryKeywords: ['哥伦比亚 旅游', '咖啡文化', '南美洲 旅游'],
        contentRecommendations: [
          'Enfocarse en fotos de alta calidad del paisaje de Salento',
          'Incluir información sobre la cultura del café',
          'Proporcionar guías paso a paso para visitar',
          'Destacar la seguridad y accesibilidad',
          'Incluir reseñas de otros turistas chinos'
        ],
        culturalNotes: [
          'Los turistas chinos valoran la seguridad y la organización',
          'Prefieren experiencias con guías locales',
          'Les interesa la fotografía y las redes sociales',
          'Valoran la autenticidad cultural'
        ]
      },
      {
        market: 'Rusia',
        language: 'ru-RU',
        primaryKeywords: ['Саленто Колумбия туризм', 'Кофейный треугольник Колумбия', 'отдых в Колумбии'],
        secondaryKeywords: ['Колумбия путешествие', 'кафе культура', 'Южная Америка туризм'],
        contentRecommendations: [
          'Enfocarse en experiencias de lujo y exclusividad',
          'Incluir información sobre vinos y gastronomía',
          'Proporcionar información sobre aventuras y naturaleza',
          'Destacar la belleza natural del Valle de Cocora',
          'Incluir opciones de alojamiento premium'
        ],
        culturalNotes: [
          'Los turistas rusos buscan experiencias de alta calidad',
          'Valoran la gastronomía y el vino',
          'Les interesa la naturaleza y la aventura',
          'Prefieren servicios personalizados'
        ]
      },
      {
        market: 'Japón',
        language: 'ja-JP',
        primaryKeywords: ['コロンビア サレント 観光', 'コロンビア コーヒー 旅行'],
        secondaryKeywords: ['コロンビア 旅行', 'コーヒー 文化', '南アメリカ 観光'],
        contentRecommendations: [
          'Enfocarse en la calidad y detalle de la información',
          'Incluir horarios exactos y precios',
          'Proporcionar mapas detallados',
          'Destacar la cultura del café',
          'Incluir información sobre fotografía'
        ],
        culturalNotes: [
          'Los turistas japoneses valoran la precisión y el detalle',
          'Prefieren información organizada y estructurada',
          'Les interesa la fotografía y la estética',
          'Valoran la cultura local auténtica'
        ]
      },
      {
        market: 'Corea del Sur',
        language: 'ko-KR',
        primaryKeywords: ['콜롬비아 살렌토 여행', '콜롬비아 커피 트라이앵글'],
        secondaryKeywords: ['콜롬비아 여행', '커피 문화', '남아메리카 관광'],
        contentRecommendations: [
          'Enfocarse en experiencias únicas y memorables',
          'Incluir información para compartir en redes sociales',
          'Proporcionar recomendaciones de fotografía',
          'Destacar experiencias auténticas',
          'Incluir tendencias y experiencias populares'
        ],
        culturalNotes: [
          'Los turistas coreanos buscan experiencias únicas',
          'Les interesa compartir en redes sociales',
          'Valoran las tendencias y lo popular',
          'Prefieren experiencias auténticas'
        ]
      },
      {
        market: 'Alemania',
        language: 'de-DE',
        primaryKeywords: ['Kolumbien Salento Tourismus', 'Kolumbien Kaffee Reise'],
        secondaryKeywords: ['Kolumbien Reise', 'Kaffee Kultur', 'Südamerika Tourismus'],
        contentRecommendations: [
          'Enfocarse en sostenibilidad y ecoturismo',
          'Incluir información sobre medio ambiente',
          'Proporcionar datos técnicos y precisos',
          'Destacar la conservación natural',
          'Incluir información sobre biodiversidad'
        ],
        culturalNotes: [
          'Los turistas alemanes valoran la sostenibilidad',
          'Les interesa el ecoturismo',
          'Prefieren información precisa y detallada',
          'Valoran la conservación ambiental'
        ]
      },
      {
        market: 'Francia',
        language: 'fr-FR',
        primaryKeywords: ['Colombie Salento tourisme', 'Voyage Colombie café'],
        secondaryKeywords: ['Voyage Colombie', 'Culture café', 'Amérique du Sud tourisme'],
        contentRecommendations: [
          'Enfocarse en cultura y gastronomía',
          'Incluir información sobre historia local',
          'Proporcionar recomendaciones culinarias',
          'Destacar experiencias culturales',
          'Incluir información sobre arte y arquitectura'
        ],
        culturalNotes: [
          'Los turistas franceses valoran la cultura',
          'Les interesa la gastronomía local',
          'Prefieren experiencias culturales auténticas',
          'Valoran la historia y el arte'
        ]
      }
    ]
  }

  /**
   * Generar meta descriptions optimizadas por mercado
   */
  generateInternationalMetaDescriptions(): { [key: string]: string } {
    return {
      'zh-CN': '探索哥伦比亚萨伦托的咖啡文化和自然美景。免费互动地图，酒店信息，当地美食和真实体验。零佣金预订，直接联系当地商家。',
      'zh-TW': '探索哥倫比亞薩倫托的咖啡文化和自然美景。免費互動地圖，酒店資訊，當地美食和真實體驗。零佣金預訂，直接聯繫當地商家。',
      'zh-HK': '探索哥倫比亞薩倫托的咖啡文化和自然美景。免費互動地圖，酒店資訊，當地美食和真實體驗。零佣金預訂，直接聯繫當地商家。',
      'ru-RU': 'Откройте для себя кофейную культуру и природную красоту Саленто, Колумбия. Бесплатная интерактивная карта, информация об отелях, местная кухня и аутентичные впечатления. Бронирование без комиссии.',
      'ja-JP': 'コロンビアのサレントでコーヒー文化と自然の美しさを体験。無料のインタラクティブマップ、ホテル情報、地元の料理、本格的な体験。手数料なしの予約。',
      'ko-KR': '콜롬비아 살렌토에서 커피 문화와 자연의 아름다움을 발견하세요. 무료 인터랙티브 지도, 호텔 정보, 현지 요리, 진정한 경험. 수수료 없는 예약.',
      'th-TH': 'สำรวจวัฒนธรรมกาแฟและความงามทางธรรมชาติของ Salento โคลอมเบีย แผนที่โต้ตอบฟรี ข้อมูลโรงแรม อาหารท้องถิ่น และประสบการณ์ที่แท้จริง จองโดยไม่มีค่าคอมมิชชั่น',
      'vi-VN': 'Khám phá văn hóa cà phê và vẻ đẹp thiên nhiên của Salento, Colombia. Bản đồ tương tác miễn phí, thông tin khách sạn, ẩm thực địa phương và trải nghiệm xác thực. Đặt phòng không phí hoa hồng.',
      'id-ID': 'Jelajahi budaya kopi dan keindahan alam Salento, Kolombia. Peta interaktif gratis, info hotel, kuliner lokal, dan pengalaman otentik. Reservasi tanpa komisi.',
      'ms-MY': 'Terokai budaya kopi dan keindahan alam Salento, Colombia. Peta interaktif percuma, maklumat hotel, masakan tempatan, dan pengalaman otentik. Tempahan tanpa komisen.',
      'de-DE': 'Entdecken Sie die Kaffeekultur und natürliche Schönheit von Salento, Kolumbien. Kostenlose interaktive Karte, Hotelinformationen, lokale Küche und authentische Erlebnisse. Buchung ohne Provision.',
      'fr-FR': 'Découvrez la culture du café et la beauté naturelle de Salento, Colombie. Carte interactive gratuite, informations hôtelières, cuisine locale et expériences authentiques. Réservation sans commission.',
      'en-GB': 'Discover the coffee culture and natural beauty of Salento, Colombia. Free interactive map, hotel information, local cuisine, and authentic experiences. Commission-free booking.',
      'en-US': 'Experience Salento, Colombia\'s coffee culture and natural beauty. Free interactive map, hotel info, local cuisine, authentic experiences. No commission booking.',
      'pt-BR': 'Descubra a cultura do café e a beleza natural de Salento, Colômbia. Mapa interativo gratuito, informações de hotéis, culinária local e experiências autênticas. Reserva sem comissão.',
      'es-MX': 'Descubre la cultura del café y la belleza natural de Salento, Colombia. Mapa interactivo gratuito, información de hoteles, cocina local y experiencias auténticas. Reserva sin comisión.',
      'es-CO': 'Descubre la cultura del café y la belleza natural de Salento, Quindío. Mapa interactivo gratuito, información de hoteles, cocina local y experiencias auténticas. Reserva sin comisión.'
    }
  }

  /**
   * Generar títulos optimizados por mercado
   */
  generateInternationalTitles(): { [key: string]: string } {
    return {
      'zh-CN': '萨伦托哥伦比亚旅游指南 - 免费互动地图与零佣金预订',
      'zh-TW': '薩倫托哥倫比亞旅遊指南 - 免費互動地圖與零佣金預訂',
      'zh-HK': '薩倫托哥倫比亞旅遊指南 - 免費互動地圖與零佣金預訂',
      'ru-RU': 'Саленто Колумбия Туризм - Бесплатная Карта и Бронирование Без Комиссии',
      'ja-JP': 'サレントコロンビア観光ガイド - 無料地図と手数料なし予約',
      'ko-KR': '살렌토 콜롬비아 여행 가이드 - 무료 지도와 수수료 없는 예약',
      'th-TH': 'คู่มือการท่องเที่ยว Salento โคลอมเบีย - แผนที่ฟรีและการจองที่ไม่มีค่าธรรมเนียม',
      'vi-VN': 'Hướng dẫn du lịch Salento Colombia - Bản đồ miễn phí và đặt phòng không phí hoa hồng',
      'id-ID': 'Panduan Wisata Salento Kolombia - Peta Gratis dan Reservasi Tanpa Komisi',
      'ms-MY': 'Pelancongan Panduan Salento Colombia - Peta Percuma dan Tempahan Tanpa Komisen',
      'de-DE': 'Salento Kolumbien Tourismus - Kostenlose Karte und Provision-freie Buchung',
      'fr-FR': 'Tourisme Salento Colombie - Carte Gratuite et Réservation Sans Commission',
      'en-GB': 'Salento Colombia Travel Guide - Free Map and Commission-Free Booking',
      'en-US': 'Salento Colombia Travel Guide - Free Interactive Map & No Commission',
      'pt-BR': 'Guia de Turismo Salento Colômbia - Mapa Grátis e Reserva Sem Comissão',
      'es-MX': 'Guía de Turismo Salento Colombia - Mapa Gratuito y Reserva Sin Comisión',
      'es-CO': 'Salento a la Mano - Guía Turística Gratis del Quindío'
    }
  }

  /**
   * Obtener estadísticas de palabras clave internacionales
   */
  getInternationalKeywordStats(): {
    totalKeywords: number
    highPriorityKeywords: number
    marketsCovered: number
    languagesCovered: number
    searchEngines: string[]
  } {
    const keywords = this.getInternationalKeywords()
    const highPriority = keywords.filter(k => k.priority === 'high').length
    const markets = this.getMarketContentRecommendations()
    const languages = [...new Set(keywords.map(k => k.language))]
    const engines = [...new Set(keywords.map(k => k.searchEngine))]

    return {
      totalKeywords: keywords.length,
      highPriorityKeywords: highPriority,
      marketsCovered: markets.length,
      languagesCovered: languages.length,
      searchEngines: engines
    }
  }
}

export default new InternationalKeywordsService()