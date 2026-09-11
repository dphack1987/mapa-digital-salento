// Servicio de traducción simplificado para compatibilidad TypeScript
import { Language } from '../types'

interface TranslationDict {
  [key: string]: string
}

class TranslationService {
  private currentLanguage: Language = 'es';
  private translations: Record<Language, TranslationDict> = {
    'es': {
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
      'categories.Restaurante Bar': 'Restaurante Bar',
      'categories.Cafés': 'Cafés',
      'categories.Coffee Tours': 'Coffee Tours',
      'categories.Artesanías': 'Artesanías',
      'categories.Tiendas': 'Tiendas',
      'categories.Experiencias': 'Experiencias',
      'categories.Eventos': 'Eventos',
      'categories.Atractivos Turísticos': 'Atractivos Turísticos',
      'categories.Servicios': 'Servicios',
      'categories.Camping': 'Camping',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Tu guía local',
      'donChucho.placeholder': 'Pregúntale a Don Chucho...',
      'donChucho.welcome': '¡Hola, pues! ¿Buscando dónde comer una buena trucha o un transporte para el Cocora? Pregúnteme lo que quiera.',
      'donChucho.suggestions.coffee': 'Buen café',
      'donChucho.suggestions.cocora': 'Valle de Cocora',
      'nav.home': 'Inicio', 'nav.services': 'Servicios', 'nav.lodging': 'Alojamientos', 'nav.directory': 'Directorio', 'nav.map': 'Mapa', 'nav.guideOffline': 'Guía offline',
      'nav.eat': 'Comer', 'nav.see': 'Ver', 'nav.book': 'Reservar',
      'nav.horseback': 'Cabalgatas', 'nav.willys': 'Transporte Willys', 'nav.ruralTransport': 'Transporte rural', 'nav.motoRental': 'Alquiler de motos', 'nav.cocora': 'Valle de Cocora',
      'banner.microcopy': 'Sin registro · Sin comisiones · Pagas directo al negocio local',
      'trust.aria': 'Ventajas de comprar directo',
      'trust.t1t': 'Cero intermediarios', 'trust.t1s': '0% comisión por venta',
      'trust.t2t': 'Confirmación instantánea', 'trust.t2s': 'Te responde el negocio',
      'trust.t3t': 'Locales verificados', 'trust.t3s': 'Fichas validadas en territorio',
      'trust.t4t': 'WhatsApp directo', 'trust.t4s': 'Hablas con quien te atiende',
      'money.promise': 'Tu dinero se queda en Salento',
      'authority.note': 'Fuente de autoridad local: datos verificados con aliados de Salento · Guía 2026',
      'menu.searchPh': 'Buscar en el menú (ej. trucha, jugo…)', 'menu.emptyA': 'No encontramos platos con', 'menu.emptyB': 'Prueba con otra palabra.',
      'menu.totalEmpty': 'Tu pedido está vacío', 'menu.unit1': 'plato', 'menu.unitN': 'platos', 'menu.inOrder': 'en tu pedido',
      'menu.total': 'Total', 'menu.orderBtn': 'Pedir por WhatsApp', 'menu.noWhatsapp': 'El pautante confirma tu pedido por WhatsApp desde la ficha.', 'menu.consultPrice': 'Precio a confirmar',
      'menu.cat.truchas': 'Truchas', 'menu.cat.carnes': 'Carnes y otros', 'menu.cat.acompanamientos': 'Acompañamientos', 'menu.cat.entradas': 'Entradas', 'menu.cat.desayuno': 'Desayuno', 'menu.cat.bebidas': 'Bebidas', 'menu.cat.carta': 'Carta',
      'price.free': 'Entrada libre', 'price.confirm': 'Precio a confirmar por WhatsApp', 'reviews.first': '¡Sé el primero en opinar!', 'menu.specialty': 'Especialidad de la casa',
      'gallery.expand': 'Ampliar foto', 'gallery.close': 'Cerrar visor', 'gallery.prev': 'Foto anterior', 'gallery.next': 'Foto siguiente',
      'detail.back': 'Volver al directorio', 'detail.verifiedFile': 'Ficha del pautante verificado', 'detail.knowPlace': 'Conoce este lugar',
      'meta.homeTitle': 'Salento a la Mano | Mapa turístico de Salento, Quindío — Directo, sin intermediarios',
      'meta.homeDesc': 'Mapa turístico interactivo de Salento, Quindío. Contacto directo con locales verificados, sin intermediarios.'
    },
    'en': {
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
      'categories.Restaurante Bar': 'Restaurant Bar',
      'categories.Cafés': 'Cafes',
      'categories.Coffee Tours': 'Coffee Tours',
      'categories.Artesanías': 'Crafts',
      'categories.Tiendas': 'Shops',
      'categories.Experiencias': 'Experiences',
      'categories.Eventos': 'Events',
      'categories.Atractivos Turísticos': 'Tourist Attractions',
      'categories.Servicios': 'Services',
      'categories.Camping': 'Camping',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Your local guide',
      'donChucho.placeholder': 'Ask Don Chucho...',
      'donChucho.welcome': 'Hello there! Looking for a good trout meal or transport to Cocora? Ask me anything you want.',
      'donChucho.suggestions.coffee': 'Good coffee',
      'donChucho.suggestions.cocora': 'Cocora Valley',
      'nav.home': 'Home', 'nav.services': 'Services', 'nav.lodging': 'Stays', 'nav.directory': 'Directory', 'nav.map': 'Map', 'nav.guideOffline': 'Offline guide',
      'nav.eat': 'Eat', 'nav.see': 'See', 'nav.book': 'Book',
      'nav.horseback': 'Horseback rides', 'nav.willys': 'Willys transport', 'nav.ruralTransport': 'Rural transport', 'nav.motoRental': 'Motorbike rental', 'nav.cocora': 'Cocora Valley',
      'banner.microcopy': 'No sign-up · No commissions · You pay the local business directly',
      'trust.aria': 'Direct booking advantages',
      'trust.t1t': 'Zero middlemen', 'trust.t1s': '0% sales commission',
      'trust.t2t': 'Instant confirmation', 'trust.t2s': 'The business replies to you',
      'trust.t3t': 'Verified locals', 'trust.t3s': 'Listings validated on the ground',
      'trust.t4t': 'Direct WhatsApp', 'trust.t4s': 'You talk to your host',
      'money.promise': 'Your money stays in Salento',
      'authority.note': 'Local authority source: data verified with Salento allies · 2026 guide',
      'menu.searchPh': 'Search the menu (e.g. trout, juice…)', 'menu.emptyA': 'No dishes found for', 'menu.emptyB': 'Try another word.',
      'menu.totalEmpty': 'Your order is empty', 'menu.unit1': 'dish', 'menu.unitN': 'dishes', 'menu.inOrder': 'in your order',
      'menu.total': 'Total', 'menu.orderBtn': 'Order via WhatsApp', 'menu.noWhatsapp': 'The business confirms your order via WhatsApp from its listing.', 'menu.consultPrice': 'Price to confirm',
      'menu.cat.truchas': 'Trout', 'menu.cat.carnes': 'Meat & more', 'menu.cat.acompanamientos': 'Sides', 'menu.cat.entradas': 'Starters', 'menu.cat.desayuno': 'Breakfast', 'menu.cat.bebidas': 'Drinks', 'menu.cat.carta': 'Menu',
      'price.free': 'Free entry', 'price.confirm': 'Price to confirm via WhatsApp', 'reviews.first': 'Be the first to review!', 'menu.specialty': 'House specialty',
      'gallery.expand': 'Enlarge photo', 'gallery.close': 'Close viewer', 'gallery.prev': 'Previous photo', 'gallery.next': 'Next photo',
      'detail.back': 'Back to directory', 'detail.verifiedFile': 'Verified partner listing', 'detail.knowPlace': 'Get to know this place',
      'meta.homeTitle': 'Salento a la Mano | Tourist Map of Salento, Quindío — Direct, no middlemen',
      'meta.homeDesc': 'Interactive tourist map of Salento, Quindío. Direct contact with verified locals, no middlemen.'
    },
    'fr': {
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
      'categories.Restaurante Bar': 'Restaurant Bar',
      'categories.Cafés': 'Cafés',
      'categories.Coffee Tours': 'Coffee Tours',
      'categories.Artesanías': 'Artisanat',
      'categories.Tiendas': 'Boutiques',
      'categories.Experiencias': 'Expériences',
      'categories.Eventos': 'Événements',
      'categories.Atractivos Turísticos': 'Attractions Touristiques',
      'categories.Servicios': 'Services',
      'categories.Camping': 'Camping',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Votre guide local',
      'donChucho.placeholder': 'Demandez à Don Chucho...',
      'donChucho.welcome': 'Bonjour là! Cherchez-vous un bon repas à la truite ou un transport pour Cocora? Demandez-moi ce que vous voulez.',
      'donChucho.suggestions.coffee': 'Bon café',
      'donChucho.suggestions.cocora': 'Vallée de Cocora',
      'nav.home': 'Accueil', 'nav.services': 'Services', 'nav.lodging': 'Hébergements', 'nav.directory': 'Annuaire', 'nav.map': 'Carte', 'nav.guideOffline': 'Guide hors ligne',
      'nav.eat': 'Manger', 'nav.see': 'Voir', 'nav.book': 'Réserver',
      'nav.horseback': 'Balades à cheval', 'nav.willys': 'Transport Willys', 'nav.ruralTransport': 'Transport rural', 'nav.motoRental': 'Location de motos', 'nav.cocora': 'Vallée de Cocora',
      'banner.microcopy': 'Sans inscription · Sans commissions · Vous payez directement le commerce local',
      'trust.aria': 'Avantages de la réservation directe',
      'trust.t1t': 'Zéro intermédiaire', 'trust.t1s': '0 % de commission',
      'trust.t2t': 'Confirmation instantanée', 'trust.t2s': 'Le commerce vous répond',
      'trust.t3t': 'Acteurs locaux vérifiés', 'trust.t3s': 'Fiches validées sur le terrain',
      'trust.t4t': 'WhatsApp direct', 'trust.t4s': 'Vous parlez à votre hôte',
      'money.promise': 'Votre argent reste à Salento',
      'authority.note': 'Source d’autorité locale : données vérifiées avec les alliés de Salento · Guide 2026',
      'menu.searchPh': 'Rechercher dans le menu (ex. truite, jus…)', 'menu.emptyA': 'Aucun plat trouvé pour', 'menu.emptyB': 'Essayez un autre mot.',
      'menu.totalEmpty': 'Votre commande est vide', 'menu.unit1': 'plat', 'menu.unitN': 'plats', 'menu.inOrder': 'dans votre commande',
      'menu.total': 'Total', 'menu.orderBtn': 'Commander par WhatsApp', 'menu.noWhatsapp': 'L’établissement confirme votre commande par WhatsApp depuis sa fiche.', 'menu.consultPrice': 'Prix à confirmer',
      'menu.cat.truchas': 'Truites', 'menu.cat.carnes': 'Viandes et autres', 'menu.cat.acompanamientos': 'Accompagnements', 'menu.cat.entradas': 'Entrées', 'menu.cat.desayuno': 'Petit-déjeuner', 'menu.cat.bebidas': 'Boissons', 'menu.cat.carta': 'Carte',
      'price.free': 'Entrée libre', 'price.confirm': 'Prix à confirmer par WhatsApp', 'reviews.first': 'Soyez le premier à donner votre avis !', 'menu.specialty': 'Spécialité de la maison',
      'gallery.expand': 'Agrandir la photo', 'gallery.close': 'Fermer la visionneuse', 'gallery.prev': 'Photo précédente', 'gallery.next': 'Photo suivante',
      'detail.back': 'Retour à l’annuaire', 'detail.verifiedFile': 'Fiche partenaire vérifiée', 'detail.knowPlace': 'Découvrez ce lieu',
      'meta.homeTitle': 'Salento a la Mano | Carte touristique de Salento, Quindío — Direct, sans intermédiaires',
      'meta.homeDesc': 'Carte touristique interactive de Salento, Quindío. Contact direct avec des locaux vérifiés, sans intermédiaires.'
    },
    'de': {
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
      'categories.Restaurante Bar': 'Restaurant Bar',
      'categories.Cafés': 'Cafés',
      'categories.Coffee Tours': 'Coffee Tours',
      'categories.Artesanías': 'Handwerk',
      'categories.Tiendas': 'Geschäfte',
      'categories.Experiencias': 'Erlebnisse',
      'categories.Eventos': 'Veranstaltungen',
      'categories.Atractivos Turísticos': 'Touristenattraktionen',
      'categories.Servicios': 'Dienste',
      'categories.Camping': 'Camping',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Ihr lokaler Führer',
      'donChucho.placeholder': 'Fragen Sie Don Chucho...',
      'donChucho.welcome': 'Hallo da! Suchen Sie ein gutes Forellenessen oder Transport nach Cocora? Fragen Sie mich alles, was Sie wollen.',
      'donChucho.suggestions.coffee': 'Guter Kaffee',
      'donChucho.suggestions.cocora': 'Cocora-Tal',
      'nav.home': 'Start', 'nav.services': 'Services', 'nav.lodging': 'Unterkünfte', 'nav.directory': 'Verzeichnis', 'nav.map': 'Karte', 'nav.guideOffline': 'Offline-Guide',
      'nav.eat': 'Essen', 'nav.see': 'Entdecken', 'nav.book': 'Buchen',
      'nav.horseback': 'Ausritte', 'nav.willys': 'Willys-Transport', 'nav.ruralTransport': 'Ländlicher Transport', 'nav.motoRental': 'Motorradverleih', 'nav.cocora': 'Cocora-Tal',
      'banner.microcopy': 'Keine Anmeldung · Keine Provisionen · Du zahlst direkt an den lokalen Betrieb',
      'trust.aria': 'Vorteile der Direktbuchung',
      'trust.t1t': 'Keine Mittelsmänner', 'trust.t1s': '0 % Verkaufsprovision',
      'trust.t2t': 'Sofortige Bestätigung', 'trust.t2s': 'Der Betrieb antwortet dir',
      'trust.t3t': 'Verifizierte Locals', 'trust.t3s': 'Vor Ort geprüfte Einträge',
      'trust.t4t': 'Direkt per WhatsApp', 'trust.t4s': 'Du sprichst mit deinem Gastgeber',
      'money.promise': 'Dein Geld bleibt in Salento',
      'authority.note': 'Lokale Autoritätsquelle: mit Salento-Partnern verifizierte Daten · Guide 2026',
      'menu.searchPh': 'Im Menü suchen (z. B. Forelle, Saft…)', 'menu.emptyA': 'Keine Gerichte gefunden für', 'menu.emptyB': 'Versuch ein anderes Wort.',
      'menu.totalEmpty': 'Deine Bestellung ist leer', 'menu.unit1': 'Gericht', 'menu.unitN': 'Gerichte', 'menu.inOrder': 'in deiner Bestellung',
      'menu.total': 'Gesamt', 'menu.orderBtn': 'Per WhatsApp bestellen', 'menu.noWhatsapp': 'Der Betrieb bestätigt deine Bestellung per WhatsApp über seinen Eintrag.', 'menu.consultPrice': 'Preis auf Anfrage',
      'menu.cat.truchas': 'Forellen', 'menu.cat.carnes': 'Fleisch & mehr', 'menu.cat.acompanamientos': 'Beilagen', 'menu.cat.entradas': 'Vorspeisen', 'menu.cat.desayuno': 'Frühstück', 'menu.cat.bebidas': 'Getränke', 'menu.cat.carta': 'Karte',
      'price.free': 'Eintritt frei', 'price.confirm': 'Preis per WhatsApp bestätigen', 'reviews.first': 'Sei der Erste mit einer Bewertung!', 'menu.specialty': 'Spezialität des Hauses',
      'gallery.expand': 'Foto vergrößern', 'gallery.close': 'Betrachter schließen', 'gallery.prev': 'Vorheriges Foto', 'gallery.next': 'Nächstes Foto',
      'detail.back': 'Zurück zum Verzeichnis', 'detail.verifiedFile': 'Verifizierter Partnereintrag', 'detail.knowPlace': 'Diesen Ort kennenlernen',
      'meta.homeTitle': 'Salento a la Mano | Touristenkarte von Salento, Quindío — Direkt, ohne Mittelsmänner',
      'meta.homeDesc': 'Interaktive Touristenkarte von Salento, Quindío. Direktkontakt mit verifizierten Locals, ohne Mittelsmänner.'
    },
    'pt': {
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
      'categories.Restaurante Bar': 'Restaurante Bar',
      'categories.Cafés': 'Cafés',
      'categories.Coffee Tours': 'Coffee Tours',
      'categories.Artesanías': 'Artesanato',
      'categories.Tiendas': 'Lojas',
      'categories.Experiencias': 'Experiências',
      'categories.Eventos': 'Eventos',
      'categories.Atractivos Turísticos': 'Atrações Turísticas',
      'categories.Servicios': 'Serviços',
      'categories.Camping': 'Camping',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'Seu guia local',
      'donChucho.placeholder': 'Pergunte ao Don Chucho...',
      'donChucho.welcome': 'Olá lá! Procurando uma boa refeição de truta ou transporte para Cocora? Pergunte-me o que quiser.',
      'donChucho.suggestions.coffee': 'Bom café',
      'donChucho.suggestions.cocora': 'Vale do Cocora',
      'nav.home': 'Início', 'nav.services': 'Serviços', 'nav.lodging': 'Hospedagem', 'nav.directory': 'Diretório', 'nav.map': 'Mapa', 'nav.guideOffline': 'Guia offline',
      'nav.eat': 'Comer', 'nav.see': 'Ver', 'nav.book': 'Reservar',
      'nav.horseback': 'Cavalgadas', 'nav.willys': 'Transporte Willys', 'nav.ruralTransport': 'Transporte rural', 'nav.motoRental': 'Aluguel de motos', 'nav.cocora': 'Vale do Cocora',
      'banner.microcopy': 'Sem cadastro · Sem comissões · Você paga direto ao negócio local',
      'trust.aria': 'Vantagens de reservar direto',
      'trust.t1t': 'Zero intermediários', 'trust.t1s': '0% de comissão',
      'trust.t2t': 'Confirmação instantânea', 'trust.t2s': 'O negócio responde para você',
      'trust.t3t': 'Locais verificados', 'trust.t3s': 'Fichas validadas em campo',
      'trust.t4t': 'WhatsApp direto', 'trust.t4s': 'Você fala com quem atende',
      'money.promise': 'Seu dinheiro fica em Salento',
      'authority.note': 'Fonte de autoridade local: dados verificados com aliados de Salento · Guia 2026',
      'menu.searchPh': 'Buscar no cardápio (ex. truta, suco…)', 'menu.emptyA': 'Nenhum prato encontrado para', 'menu.emptyB': 'Tente outra palavra.',
      'menu.totalEmpty': 'Seu pedido está vazio', 'menu.unit1': 'prato', 'menu.unitN': 'pratos', 'menu.inOrder': 'no seu pedido',
      'menu.total': 'Total', 'menu.orderBtn': 'Pedir por WhatsApp', 'menu.noWhatsapp': 'O estabelecimento confirma seu pedido por WhatsApp na ficha.', 'menu.consultPrice': 'Preço a confirmar',
      'menu.cat.truchas': 'Trutas', 'menu.cat.carnes': 'Carnes e outros', 'menu.cat.acompanamientos': 'Acompanhamentos', 'menu.cat.entradas': 'Entradas', 'menu.cat.desayuno': 'Café da manhã', 'menu.cat.bebidas': 'Bebidas', 'menu.cat.carta': 'Cardápio',
      'price.free': 'Entrada gratuita', 'price.confirm': 'Preço a confirmar por WhatsApp', 'reviews.first': 'Seja o primeiro a opinar!', 'menu.specialty': 'Especialidade da casa',
      'gallery.expand': 'Ampliar foto', 'gallery.close': 'Fechar visualizador', 'gallery.prev': 'Foto anterior', 'gallery.next': 'Próxima foto', 'menu.cat.carta': 'Cardápio',
      'detail.back': 'Voltar ao diretório', 'detail.verifiedFile': 'Ficha de parceiro verificado', 'detail.knowPlace': 'Conheça este lugar',
      'meta.homeTitle': 'Salento a la Mano | Mapa turístico de Salento, Quindío — Direto, sem intermediários',
      'meta.homeDesc': 'Mapa turístico interativo de Salento, Quindío. Contato direto com locais verificados, sem intermediários.'
    },
    'it': {
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
      'categories.Restaurante Bar': 'Ristorante Bar',
      'categories.Cafés': 'Caffè',
      'categories.Coffee Tours': 'Coffee Tours',
      'categories.Artesanías': 'Artigianato',
      'categories.Tiendas': 'Negozi',
      'categories.Experiencias': 'Esperienze',
      'categories.Eventos': 'Eventi',
      'categories.Atractivos Turísticos': 'Attrazioni Turistiche',
      'categories.Servicios': 'Servizi',
      'categories.Camping': 'Camping',
      'donChucho.title': 'Don Chucho',
      'donChucho.subtitle': 'La tua guida locale',
      'donChucho.placeholder': 'Chiedi a Don Chucho...',
      'donChucho.welcome': 'Ciao là! Cerchi un buon pasto di trota o trasporto per Cocora? Chiedimi quello che vuoi.',
      'donChucho.suggestions.coffee': 'Buon caffè',
      'donChucho.suggestions.cocora': 'Valle del Cocora',
      'nav.home': 'Home', 'nav.services': 'Servizi', 'nav.lodging': 'Alloggi', 'nav.directory': 'Elenco', 'nav.map': 'Mappa', 'nav.guideOffline': 'Guida offline',
      'nav.eat': 'Mangiare', 'nav.see': 'Vedere', 'nav.book': 'Prenota',
      'nav.horseback': 'Passeggiate a cavallo', 'nav.willys': 'Trasporto Willys', 'nav.ruralTransport': 'Trasporto rurale', 'nav.motoRental': 'Noleggio moto', 'nav.cocora': 'Valle del Cocora',
      'banner.microcopy': 'Senza registrazione · Senza commissioni · Paghi direttamente l’attività locale',
      'trust.aria': 'Vantaggi della prenotazione diretta',
      'trust.t1t': 'Zero intermediari', 'trust.t1s': '0% di commissione',
      'trust.t2t': 'Conferma istantanea', 'trust.t2s': 'L’attività ti risponde',
      'trust.t3t': 'Locali verificati', 'trust.t3s': 'Schede validate sul campo',
      'trust.t4t': 'WhatsApp diretto', 'trust.t4s': 'Parli con chi ti accoglie',
      'money.promise': 'I tuoi soldi restano a Salento',
      'authority.note': 'Fonte autorevole locale: dati verificati con gli alleati di Salento · Guida 2026',
      'menu.searchPh': 'Cerca nel menù (es. trota, succo…)', 'menu.emptyA': 'Nessun piatto trovato per', 'menu.emptyB': 'Prova un’altra parola.',
      'menu.totalEmpty': 'Il tuo ordine è vuoto', 'menu.unit1': 'piatto', 'menu.unitN': 'piatti', 'menu.inOrder': 'nel tuo ordine',
      'menu.total': 'Totale', 'menu.orderBtn': 'Ordina via WhatsApp', 'menu.noWhatsapp': 'La struttura conferma il tuo ordine via WhatsApp dalla sua scheda.', 'menu.consultPrice': 'Prezzo da confermare',
      'menu.cat.truchas': 'Trote', 'menu.cat.carnes': 'Carni e altro', 'menu.cat.acompanamientos': 'Contorni', 'menu.cat.entradas': 'Antipasti', 'menu.cat.desayuno': 'Colazione', 'menu.cat.bebidas': 'Bevande', 'menu.cat.carta': 'Menù',
      'detail.back': 'Torna all’elenco', 'detail.verifiedFile': 'Scheda partner verificata', 'detail.knowPlace': 'Scopri questo luogo',
      'meta.homeTitle': 'Salento a la Mano | Mappa turistica di Salento, Quindío — Diretto, senza intermediari',
      'meta.homeDesc': 'Mappa turistica interattiva di Salento, Quindío. Contatto diretto con locali verificati, senza intermediari.'
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
      'es': 'es',
      'en': 'en',
      'fr': 'fr',
      'de': 'de',
      'pt': 'pt',
      'it': 'it'
    }

    const detectedLang = langMap[browserLang] || 'es';
    
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
    const translations = this.translations[language] || this.translations['es'];
    
    const value = translations[key]
    
    return value || fallback || key
  }
}

// Exportar instancia singleton
export const translationService = new TranslationService()
export default translationService