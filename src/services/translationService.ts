// Servicio de traducción simplificado para compatibilidad TypeScript
import type { Language } from '../types'

interface TranslationDict {
  [key: string]: string
}

class TranslationService {
  private currentLanguage: Language = Language.ES
  private translations: Record<Language, TranslationDict> = {
    [Language.ES]: {
      explore: 'Explora',
      order: 'Pedidos',
      experiences: 'Experiencias',
      orderTitle: 'Mi pedido',
      guide: 'Guía local',
      title: 'Salento a la mano',
      description: 'Descubre lugares, cafes y experiencias del Eje Cafetero',
      search: 'Buscar en Salento...',
      nearby: 'Cerca de ti',
      today: 'Hoy en Salento',
      map: 'Mapa interactivo',
      loading: 'Cargando información de Salento...',
      offline: 'Modo Offline - Valle de Cocora',
      online: 'Conectado',
      'categories.Todo': 'Todo',
      'categories.Alojamientos': 'Alojamientos',
      'categories.Restaurantes': 'Restaurantes',
      'categories.Cafés': 'Cafés',
      'categories.Artesanías': 'Artesanías',
      'categories.Tiendas': 'Tiendas',
      'categories.Experiencias': 'Experiencias',
      'categories.Servicios': 'Servicios',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Tu guía local',
      'donChucho.placeholder': 'Pregúntale a Don Chucho...',
      'donChucho.welcome': '¡Hola, pues! ¿Buscando dónde comer una buena trucha o un transporte para el Cocora? Pregúnteme lo que quiera.',
      'donChucho.suggestions.coffee': 'Buen café',
      'donChucho.suggestions.cocora': 'Valle de Cocora'
    },
    [Language.EN]: {
      explore: 'Explore',
      order: 'Orders',
      experiences: 'Experiences',
      orderTitle: 'My order',
      guide: 'Local guide',
      title: 'Salento at hand',
      description: 'Discover places, cafes and experiences in the Coffee Region',
      search: 'Search in Salento...',
      nearby: 'Near you',
      today: 'Today in Salento',
      map: 'Interactive map',
      loading: 'Loading Salento information...',
      offline: 'Offline Mode - Cocora Valley',
      online: 'Connected',
      'categories.Todo': 'All',
      'categories.Alojamientos': 'Accommodations',
      'categories.Restaurantes': 'Restaurants',
      'categories.Cafés': 'Cafes',
      'categories.Artesanías': 'Crafts',
      'categories.Tiendas': 'Shops',
      'categories.Experiencias': 'Experiences',
      'categories.Servicios': 'Services',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Your local guide',
      'donChucho.placeholder': 'Ask Don Chucho...',
      'donChucho.welcome': 'Hello there! Looking for a good trout meal or transport to Cocora? Ask me anything you want.',
      'donChucho.suggestions.coffee': 'Good coffee',
      'donChucho.suggestions.cocora': 'Cocora Valley'
    },
    [Language.FR]: {
      explore: 'Explorer',
      order: 'Commandes',
      experiences: 'Expériences',
      orderTitle: 'Ma commande',
      guide: 'Guide local',
      title: 'Salento à portée',
      description: 'Découvrez les lieux, cafés et expériences de la région caféière',
      search: 'Rechercher à Salento...',
      nearby: 'Près de vous',
      today: 'Aujourd\'hui à Salento',
      map: 'Carte interactive',
      loading: 'Chargement des informations Salento...',
      offline: 'Mode Hors Ligne - Vallée de Cocora',
      online: 'Connecté',
      'categories.Todo': 'Tous',
      'categories.Alojamientos': 'Hébergements',
      'categories.Restaurantes': 'Restaurants',
      'categories.Cafés': 'Cafés',
      'categories.Artesanías': 'Artisanat',
      'categories.Tiendas': 'Boutiques',
      'categories.Experiencias': 'Expériences',
      'categories.Servicios': 'Services',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Votre guide local',
      'donChucho.placeholder': 'Demandez à Don Chucho...',
      'donChucho.welcome': 'Bonjour là! Cherchez-vous un bon repas à la truite ou un transport pour Cocora? Demandez-moi ce que vous voulez.',
      'donChucho.suggestions.coffee': 'Bon café',
      'donChucho.suggestions.cocora': 'Vallée de Cocora'
    },
    [Language.DE]: {
      explore: 'Erkunden',
      order: 'Bestellungen',
      experiences: 'Erlebnisse',
      orderTitle: 'Meine Bestellung',
      guide: 'Lokaler Führer',
      title: 'Salento zur Hand',
      description: 'Entdecken Sie Orte, Cafés und Erlebnisse in der Kaffee-Region',
      search: 'In Salento suchen...',
      nearby: 'In Ihrer Nähe',
      today: 'Heute in Salento',
      map: 'Interaktive Karte',
      loading: 'Salento-Informationen werden geladen...',
      offline: 'Offline-Modus - Cocora-Tal',
      online: 'Verbunden',
      'categories.Todo': 'Alle',
      'categories.Alojamientos': 'Unterkünfte',
      'categories.Restaurantes': 'Restaurants',
      'categories.Cafés': 'Cafés',
      'categories.Artesanías': 'Handwerk',
      'categories.Tiendas': 'Geschäfte',
      'categories.Experiencias': 'Erlebnisse',
      'categories.Servicios': 'Dienste',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Ihr lokaler Führer',
      'donChucho.placeholder': 'Fragen Sie Don Chucho...',
      'donChucho.welcome': 'Hallo da! Suchen Sie ein gutes Forellenessen oder Transport nach Cocora? Fragen Sie mich alles, was Sie wollen.',
      'donChucho.suggestions.coffee': 'Guter Kaffee',
      'donChucho.suggestions.cocora': 'Cocora-Tal'
    },
    [Language.PT]: {
      explore: 'Explorar',
      order: 'Pedidos',
      experiences: 'Experiências',
      orderTitle: 'Meu pedido',
      guide: 'Guia local',
      title: 'Salento à mão',
      description: 'Descubra lugares, cafés e experiências na região cafeeira',
      search: 'Buscar em Salento...',
      nearby: 'Perto de você',
      today: 'Hoje em Salento',
      map: 'Mapa interativo',
      loading: 'Carregando informações de Salento...',
      offline: 'Modo Offline - Vale do Cocora',
      online: 'Conectado',
      'categories.Todo': 'Todos',
      'categories.Alojamientos': 'Alojamentos',
      'categories.Restaurantes': 'Restaurantes',
      'categories.Cafés': 'Cafés',
      'categories.Artesanías': 'Artesanato',
      'categories.Tiendas': 'Lojas',
      'categories.Experiencias': 'Experiências',
      'categories.Servicios': 'Serviços',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Seu guia local',
      'donChucho.placeholder': 'Pergunte ao Don Chucho...',
      'donChucho.welcome': 'Olá lá! Procurando uma boa refeição de truta ou transporte para Cocora? Pergunte-me o que quiser.',
      'donChucho.suggestions.coffee': 'Bom café',
      'donChucho.suggestions.cocora': 'Vale do Cocora'
    },
    [Language.IT]: {
      explore: 'Esplora',
      order: 'Ordini',
      experiences: 'Esperienze',
      orderTitle: 'Il mio ordine',
      guide: 'Guida locale',
      title: 'Salento a portata',
      description: 'Scopri luoghi, caffè ed esperienze nella regione del caffè',
      search: 'Cerca a Salento...',
      nearby: 'Vicino a te',
      today: 'Oggi a Salento',
      map: 'Mappa interattiva',
      loading: 'Caricamento informazioni Salento...',
      offline: 'Modalità Offline - Valle del Cocora',
      online: 'Connesso',
      'categories.Todo': 'Tutti',
      'categories.Alojamientos': 'Alloggi',
      'categories.Restaurantes': 'Ristoranti',
      'categories.Cafés': 'Caffè',
      'categories.Artesanías': 'Artigianato',
      'categories.Tiendas': 'Negozi',
      'categories.Experiencias': 'Esperienze',
      'categories.Servicios': 'Servizi',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'La tua guida locale',
      'donChucho.placeholder': 'Chiedi a Don Chucho...',
      'donChucho.welcome': 'Ciao là! Cerchi un buon pasto di trota o trasporto per Cocora? Chiedimi quello che vuoi.',
      'donChucho.suggestions.coffee': 'Buon caffè',
      'donChucho.suggestions.cocora': 'Valle del Cocora'
    }
  }

  /**
   * Inicializar el servicio de traducción
   */
  initialize(): Language {
    // Detectar idioma del navegador
    const browserLang = navigator.language.split('-')[0] as Language
    
    // Mapeo de idiomas del navegador a nuestros idiomas soportados
    const langMap: Record<string, Language> = {
      'es': Language.ES,
      'en': Language.EN,
      'fr': Language.FR,
      'de': Language.DE,
      'pt': Language.PT,
      'it': Language.IT
    }

    const detectedLang = langMap[browserLang] || Language.ES
    
    // Cargar preferencia guardada si existe
    const savedLang = localStorage.getItem('salento_language') as Language
    this.currentLanguage = savedLang || detectedLang
    
    // Guardar preferencia inicial
    if (!savedLang) {
      localStorage.setItem('salento_language', this.currentLanguage)
    }

    return this.currentLanguage
  }

  /**
   * Establecer idioma actual
   */
  setLanguage(language: Language): void {
    this.currentLanguage = language
    localStorage.setItem('salento_language', language)
  }

  /**
   * Obtener idioma actual
   */
  getLanguage(): Language {
    return this.currentLanguage
  }

  /**
   * Traducir una clave
   */
  translate(key: string, fallback?: string): string {
    const language = this.currentLanguage
    const translations = this.translations[language] || this.translations[Language.ES]
    
    const value = translations[key]
    
    return value || fallback || key
  }
}

// Exportar instancia singleton
export const translationService = new TranslationService()
export default translationService