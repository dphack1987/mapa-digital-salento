// Servicio de traducción dinámica con soporte multi-idioma y detección automática

type SupportedLanguage = 'es' | 'en' | 'fr' | 'de' | 'pt' | 'it'

interface TranslationDict {
  [key: string]: string
}

interface TranslationData {
  [language: string]: TranslationDict
}

// Diccionario de traducciones para elementos estáticos de la UI
const staticTranslations: TranslationData = {
  es: {
    explore: 'Mapa digital',
    order: 'Pide local',
    experiences: 'Planes',
    guide: 'Mapa digital, pedidos y planes',
    title: 'Salento, a tu ritmo.',
    description: 'Encuentra lugares, pide a tu hospedaje y descubre Salento desde un mapa digital pensado para viajeros.',
    search: '¿Qué buscas en Salento?',
    nearby: 'Lugares y servicios cercanos',
    today: 'Descubre Salento',
    map: 'Mapa digital de Salento',
    orderTitle: 'Mi pedido',
    loading: 'Cargando información de Salento...',
    offline: 'Información local disponible',
    welcome: 'Bienvenido a Salento',
    verified: 'Pautante Verificado',
    loadingData: 'Cargando datos...',
    errorLoading: 'Error al cargar datos',
    retry: 'Intentar de nuevo',
    addToCart: 'Añadir al carrito',
    removeFromCart: 'Eliminar del carrito',
    total: 'Total',
    checkout: 'Finalizar pedido',
    delivery: 'Domicilio',
    pickup: 'Recoger en lugar',
    hotel: 'Hotel',
    room: 'Habitación',
    phone: 'Celular',
    directions: 'Indicaciones',
    sendOrder: 'Enviar pedido',
    orderSent: 'Pedido enviado',
    orderFailed: 'Error al enviar pedido',
    currency: 'Moneda',
    language: 'Idioma',
    savePreferences: 'Guardar preferencias',
    categories: {
      Todo: 'Todo',
      Alojamientos: 'Alojamientos',
      Restaurantes: 'Restaurantes',
      Cafés: 'Cafés',
      Artesanías: 'Artesanías',
      Tiendas: 'Tiendas',
      Experiencias: 'Experiencias',
      Servicios: 'Servicios'
    },
    badges: {
      verified: 'Verificado',
      popular: 'Popular',
      local: 'Local',
      delivery: 'Domicilio',
      new: 'Nuevo'
    },
    donChucho: {
      title: 'Don Chucho',
      subtitle: 'Tu guía local',
      placeholder: 'Pregúntale a Don Chucho...',
      ask: 'Preguntar',
      suggestions: {
        coffee: 'Buen café',
        cocora: 'Valle de Cocora',
        food: 'Comida local',
        crafts: 'Artesanías'
      }
    }
  },
  en: {
    explore: 'Digital map',
    order: 'Order local',
    experiences: 'Things to do',
    guide: 'Digital map, orders and plans',
    title: 'Salento, your way.',
    description: 'Find local places, order to your hotel and discover Salento through a digital map made for travelers.',
    search: 'What are you looking for in Salento?',
    nearby: 'Nearby places and services',
    today: 'Discover Salento',
    map: 'Salento digital map',
    orderTitle: 'My order',
    loading: 'Loading Salento information...',
    offline: 'Local information available',
    welcome: 'Welcome to Salento',
    verified: 'Verified Partner',
    loadingData: 'Loading data...',
    errorLoading: 'Error loading data',
    retry: 'Try again',
    addToCart: 'Add to cart',
    removeFromCart: 'Remove from cart',
    total: 'Total',
    checkout: 'Checkout',
    delivery: 'Delivery',
    pickup: 'Pickup',
    hotel: 'Hotel',
    room: 'Room',
    phone: 'Phone',
    directions: 'Directions',
    sendOrder: 'Send order',
    orderSent: 'Order sent',
    orderFailed: 'Failed to send order',
    currency: 'Currency',
    language: 'Language',
    savePreferences: 'Save preferences',
    categories: {
      Todo: 'All',
      Alojamientos: 'Accommodations',
      Restaurantes: 'Restaurants',
      Cafés: 'Cafés',
      Artesanías: 'Crafts',
      Tiendas: 'Shops',
      Experiencias: 'Experiences',
      Servicios: 'Services'
    },
    badges: {
      verified: 'Verified',
      popular: 'Popular',
      local: 'Local',
      delivery: 'Delivery',
      new: 'New'
    },
    donChucho: {
      title: 'Don Chucho',
      subtitle: 'Your local guide',
      placeholder: 'Ask Don Chucho...',
      ask: 'Ask',
      suggestions: {
        coffee: 'Best coffee',
        cocora: 'Cocora Valley',
        food: 'Local food',
        crafts: 'Local crafts'
      }
    }
  },
  fr: {
    explore: 'Carte numérique',
    order: 'Commander local',
    experiences: 'Activités',
    guide: 'Carte numérique, commandes et plans',
    title: 'Salento, à votre rythme.',
    description: 'Trouvez des lieux, commandez à votre hébergement et découvrez Salento via une carte numérique pour voyageurs.',
    search: 'Que cherchez-vous à Salento?',
    nearby: 'Lieux et services à proximité',
    today: 'Découvrir Salento',
    map: 'Carte numérique de Salento',
    orderTitle: 'Ma commande',
    loading: 'Chargement des informations Salento...',
    offline: 'Informations locales disponibles',
    welcome: 'Bienvenue à Salento',
    verified: 'Partenaire vérifié',
    loadingData: 'Chargement des données...',
    errorLoading: 'Erreur de chargement',
    retry: 'Réessayer',
    addToCart: 'Ajouter au panier',
    removeFromCart: 'Retirer du panier',
    total: 'Total',
    checkout: 'Finaliser la commande',
    delivery: 'Livraison',
    pickup: 'À emporter',
    hotel: 'Hôtel',
    room: 'Chambre',
    phone: 'Téléphone',
    directions: 'Instructions',
    sendOrder: 'Envoyer la commande',
    orderSent: 'Commande envoyée',
    orderFailed: 'Échec de l\'envoi',
    currency: 'Devise',
    language: 'Langue',
    savePreferences: 'Enregistrer les préférences',
    categories: {
      Todo: 'Tout',
      Alojamientos: 'Hébergements',
      Restaurantes: 'Restaurants',
      Cafés: 'Cafés',
      Artesanías: 'Artisanat',
      Tiendas: 'Boutiques',
      Experiencias: 'Expériences',
      Servicios: 'Services'
    },
    badges: {
      verified: 'Vérifié',
      popular: 'Populaire',
      local: 'Local',
      delivery: 'Livraison',
      new: 'Nouveau'
    },
    donChucho: {
      title: 'Don Chucho',
      subtitle: 'Votre guide local',
      placeholder: 'Demander à Don Chucho...',
      ask: 'Demander',
      suggestions: {
        coffee: 'Meilleur café',
        cocora: 'Vallée de Cocora',
        food: 'Cuisine locale',
        crafts: 'Artisanat local'
      }
    }
  },
  de: {
    explore: 'Digitale Karte',
    order: 'Lokal bestellen',
    experiences: 'Aktivitäten',
    guide: 'Digitale Karte, Bestellungen und Pläne',
    title: 'Salento, Ihr Weg.',
    description: 'Finden Sie Orte, bestellen Sie in Ihre Unterkunft und entdecken Sie Salento durch eine digitale Karte für Reisende.',
    search: 'Was suchen Sie in Salento?',
    nearby: 'Orte und Dienstleistungen in der Nähe',
    today: 'Salento entdecken',
    map: 'Digitale Salento-Karte',
    orderTitle: 'Meine Bestellung',
    loading: 'Salento-Informationen werden geladen...',
    offline: 'Lokale Informationen verfügbar',
    welcome: 'Willkommen in Salento',
    verified: 'Verifizierter Partner',
    loadingData: 'Daten werden geladen...',
    errorLoading: 'Fehler beim Laden',
    retry: 'Erneut versuchen',
    addToCart: 'In den Warenkorb',
    removeFromCart: 'Aus dem Warenkorb entfernen',
    total: 'Gesamt',
    checkout: 'Kasse',
    delivery: 'Lieferung',
    pickup: 'Abholung',
    hotel: 'Hotel',
    room: 'Zimmer',
    phone: 'Telefon',
    directions: 'Wegbeschreibung',
    sendOrder: 'Bestellung senden',
    orderSent: 'Bestellung gesendet',
    orderFailed: 'Bestellung fehlgeschlagen',
    currency: 'Währung',
    language: 'Sprache',
    savePreferences: 'Einstellungen speichern',
    categories: {
      Todo: 'Alle',
      Alojamientos: 'Unterkünfte',
      Restaurantes: 'Restaurants',
      Cafés: 'Cafés',
      Artesanías: 'Handwerk',
      Tiendas: 'Geschäfte',
      Experiencias: 'Erlebnisse',
      Servicios: 'Dienstleistungen'
    },
    badges: {
      verified: 'Verifiziert',
      popular: 'Beliebt',
      local: 'Lokal',
      delivery: 'Lieferung',
      new: 'Neu'
    },
    donChucho: {
      title: 'Don Chucho',
      subtitle: 'Ihr lokaler Führer',
      placeholder: 'Fragen Sie Don Chucho...',
      ask: 'Fragen',
      suggestions: {
        coffee: 'Bester Kaffee',
        cocora: 'Cocora-Tal',
        food: 'Lokales Essen',
        crafts: 'Lokales Handwerk'
      }
    }
  },
  pt: {
    explore: 'Mapa digital',
    order: 'Pedir local',
    experiences: 'Atividades',
    guide: 'Mapa digital, pedidos e planos',
    title: 'Salento, ao seu ritmo.',
    description: 'Encontre lugares, peça para sua hospedagem e descubra Salento através de um mapa digital feito para viajantes.',
    search: 'O que você procura em Salento?',
    nearby: 'Lugares e serviços próximos',
    today: 'Descobrir Salento',
    map: 'Mapa digital de Salento',
    orderTitle: 'Meu pedido',
    loading: 'Carregando informações de Salento...',
    offline: 'Informações locais disponíveis',
    welcome: 'Bem-vindo a Salento',
    verified: 'Parceiro verificado',
    loadingData: 'Carregando dados...',
    errorLoading: 'Erro ao carregar dados',
    retry: 'Tentar novamente',
    addToCart: 'Adicionar ao carrinho',
    removeFromCart: 'Remover do carrinho',
    total: 'Total',
    checkout: 'Finalizar pedido',
    delivery: 'Entrega',
    pickup: 'Retirada',
    hotel: 'Hotel',
    room: 'Quarto',
    phone: 'Telefone',
    directions: 'Instruções',
    sendOrder: 'Enviar pedido',
    orderSent: 'Pedido enviado',
    orderFailed: 'Falha ao enviar pedido',
    currency: 'Moeda',
    language: 'Idioma',
    savePreferences: 'Salvar preferências',
    categories: {
      Todo: 'Todos',
      Alojamientos: 'Alojamentos',
      Restaurantes: 'Restaurantes',
      Cafés: 'Cafés',
      Artesanías: 'Artesanato',
      Tiendas: 'Lojas',
      Experiencias: 'Experiências',
      Servicios: 'Serviços'
    },
    badges: {
      verified: 'Verificado',
      popular: 'Popular',
      local: 'Local',
      delivery: 'Entrega',
      new: 'Novo'
    },
    donChucho: {
      title: 'Don Chucho',
      subtitle: 'Seu guia local',
      placeholder: 'Pergunte ao Don Chucho...',
      ask: 'Perguntar',
      suggestions: {
        coffee: 'Melhor café',
        cocora: 'Vale do Cocora',
        food: 'Comida local',
        crafts: 'Artesanato local'
      }
    }
  },
  it: {
    explore: 'Mappa digitale',
    order: 'Ordina locale',
    experiences: 'Attività',
    guide: 'Mappa digitale, ordini e piani',
    title: 'Salento, a tuo ritmo.',
    description: 'Trova luoghi, ordina al tuo alloggio e scopri Salento attraverso una mappa digitale per viaggiatori.',
    search: 'Cosa cerchi a Salento?',
    nearby: 'Luoghi e servizi vicini',
    today: 'Scopri Salento',
    map: 'Mappa digitale di Salento',
    orderTitle: 'Il mio ordine',
    loading: 'Caricamento informazioni Salento...',
    offline: 'Informazioni locali disponibili',
    welcome: 'Benvenuto a Salento',
    verified: 'Partner verificato',
    loadingData: 'Caricamento dati...',
    errorLoading: 'Errore nel caricamento',
    retry: 'Riprova',
    addToCart: 'Aggiungi al carrello',
    removeFromCart: 'Rimuovi dal carrello',
    total: 'Totale',
    checkout: 'Pagamento',
    delivery: 'Consegna',
    pickup: 'Ritiro',
    hotel: 'Hotel',
    room: 'Stanza',
    phone: 'Telefono',
    directions: 'Indicazioni',
    sendOrder: 'Invia ordine',
    orderSent: 'Ordine inviato',
    orderFailed: 'Invio ordine fallito',
    currency: 'Valuta',
    language: 'Lingua',
    savePreferences: 'Salva preferenze',
    categories: {
      Todo: 'Tutti',
      Alojamientos: 'Alloggi',
      Restaurantes: 'Ristoranti',
      Cafés: 'Caffè',
      Artesanías: 'Artigianato',
      Tiendas: 'Negozi',
      Experiencias: 'Esperienze',
      Servicios: 'Servizi'
    },
    badges: {
      verified: 'Verificato',
      popular: 'Popolare',
      local: 'Locale',
      delivery: 'Consegna',
      new: 'Nuovo'
    },
    donChucho: {
      title: 'Don Chucho',
      subtitle: 'La tua guida locale',
      placeholder: 'Chiedi a Don Chucho...',
      ask: 'Chiedi',
      suggestions: {
        coffee: 'Miglior caffè',
        cocora: 'Valle del Cocora',
        food: 'Cibo locale',
        crafts: 'Artigianato locale'
      }
    }
  }
}

class TranslationService {
  private currentLanguage: SupportedLanguage = 'es'
  private userPreference: SupportedLanguage | null = null

  /**
   * Detectar idioma del navegador automáticamente
   */
  detectBrowserLanguage(): SupportedLanguage {
    const browserLang = navigator.language.toLowerCase()
    
    // Mapeo de códigos de idioma a nuestros idiomas soportados
    const languageMap: Record<string, SupportedLanguage> = {
      'es': 'es',
      'en': 'en',
      'en-us': 'en',
      'en-gb': 'en',
      'fr': 'fr',
      'fr-fr': 'fr',
      'de': 'de',
      'de-de': 'de',
      'pt': 'pt',
      'pt-br': 'pt',
      'pt-pt': 'pt',
      'it': 'it',
      'it-it': 'it'
    }

    // Verificar preferencia guardada primero
    if (this.userPreference) {
      return this.userPreference
    }

    // Intentar detectar del navegador
    for (const [code, language] of Object.entries(languageMap)) {
      if (browserLang.startsWith(code)) {
        return language
      }
    }

    // Fallback a español
    return 'es'
  }

  /**
   * Establecer idioma manualmente
   */
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language
    this.userPreference = language
    this.savePreference()
  }

  /**
   * Obtener idioma actual
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage
  }

  /**
   * Traducir una clave
   */
  translate(key: string, fallback?: string): string {
    const translations = staticTranslations[this.currentLanguage]
    
    // Soporte para claves anidadas (ej: "categories.Todo")
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return fallback || key
      }
    }
    
    return typeof value === 'string' ? value : (fallback || key)
  }

  /**
   * Traducir contenido dinámico (descripciones, menús, etc.)
   * En una implementación completa, esto usaría una API de traducción
   */
  async translateDynamicContent(text: string, targetLanguage?: SupportedLanguage): Promise<string> {
    const target = targetLanguage || this.currentLanguage
    
    // Si es el mismo idioma, retornar original
    if (target === 'es') return text
    
    // En una implementación completa, aquí llamaríamos a una API de traducción
    // Por ahora, usamos un sistema básico de traducción para contenido común
    return this.translateCommonPhrases(text, target)
  }

  /**
   * Traducción básica de frases comunes (placeholder para API real)
   */
  private translateCommonPhrases(text: string, targetLanguage: SupportedLanguage): string {
    const commonPhrases: Record<string, Record<SupportedLanguage, string>> = {
      'Café de origen': {
        es: 'Café de origen',
        en: 'Single-origin coffee',
        fr: 'Café d\'origine',
        de: 'Ursprungskaffee',
        pt: 'Café de origem',
        it: 'Caffè d\'origine'
      },
      'Desayuno': {
        es: 'Desayuno',
        en: 'Breakfast',
        fr: 'Petit-déjeuner',
        de: 'Frühstück',
        pt: 'Café da manhã',
        it: 'Colazione'
      },
      'Trucha': {
        es: 'Trucha',
        en: 'Trout',
        fr: 'Truite',
        de: 'Forelle',
        pt: 'Truta',
        it: 'Trote'
      },
      'Artesanías': {
        es: 'Artesanías',
        en: 'Crafts',
        fr: 'Artisanat',
        de: 'Handwerk',
        pt: 'Artesanato',
        it: 'Artigianato'
      },
      'Habitación': {
        es: 'Habitación',
        en: 'Room',
        fr: 'Chambre',
        de: 'Zimmer',
        pt: 'Quarto',
        it: 'Stanza'
      }
    }

    for (const [phrase, translations] of Object.entries(commonPhrases)) {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        return text.replace(new RegExp(phrase, 'gi'), translations[targetLanguage])
      }
    }

    return text // Retornar original si no hay traducción
  }

  /**
   * Guardar preferencia de idioma en localStorage
   */
  private savePreference(): void {
    try {
      localStorage.setItem('salento_language', this.currentLanguage)
    } catch (error) {
      console.error('Error saving language preference:', error)
    }
  }

  /**
   * Cargar preferencia de idioma desde localStorage
   */
  loadPreference(): void {
    try {
      const saved = localStorage.getItem('salento_language')
      if (saved && this.isValidLanguage(saved)) {
        this.userPreference = saved as SupportedLanguage
        this.currentLanguage = saved as SupportedLanguage
      }
    } catch (error) {
      console.error('Error loading language preference:', error)
    }
  }

  /**
   * Validar si un idioma es soportado
   */
  private isValidLanguage(lang: string): lang is SupportedLanguage {
    return ['es', 'en', 'fr', 'de', 'pt', 'it'].includes(lang)
  }

  /**
   * Obtener todos los idiomas soportados
   */
  getSupportedLanguages(): { code: SupportedLanguage; name: string; nativeName: string }[] {
    return [
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' }
    ]
  }

  /**
   * Inicializar el servicio
   */
  initialize(): SupportedLanguage {
    this.loadPreference()
    this.currentLanguage = this.detectBrowserLanguage()
    return this.currentLanguage
  }
}

// Exportar instancia singleton
export const translationService = new TranslationService()
export default translationService