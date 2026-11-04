// Agentic Don Chucho - Extiende el chatbot con capacidades de agente
// Puede ejecutar acciones: reservar, navegar, compartir, guardar favoritos

import { Place, Language } from '../types'

export type AgentAction = 
  | { type: 'navigate'; destination: string }
  | { type: 'whatsapp'; phone: string; message: string }
  | { type: 'call'; phone: string }
  | { type: 'share'; title: string; text: string; url?: string }
  | { type: 'save-favorite'; placeId: number }
  | { type: 'open-map'; lat: number; lng: number; label: string }
  | { type: 'open-web'; url: string }
  | { type: 'show-places'; category: string }
  | { type: 'book-tour'; placeId: number; date?: string }

interface AgentResponse {
  text: string
  actions: AgentAction[]
  followUp?: string[]
}

// Parser de intenciones mejorado - detecta intención de acción
export function parseActionIntent(text: string, language: Language): {
  wantsAction: boolean
  actionType: string
  confidence: number
} {
  const lower = text.toLowerCase()
  
  // Intenciones de navegación
  const navigatePatterns = [
    /como llego|cómo llego|como llegar|cómo llegar|how do i get|directions|ir a|llevame|llévame/,
    /wie komme ich|anfahrt|bring mich|comment aller|comment se rendre|itinéraire|emmen|come arriv|indicazioni|portami|como chegar|onde fica|levar-me/,
    /direccion|dirección|ubicación|dónde queda|where is|location|wo ist|où est|dove si trova/,
    /mapa|map|ruta|route|karte|carte|mappa/
  ]
  
  // Intenciones de contacto
  const contactPatterns = [
    /llamar|call|teléfono|phone|celular|anrufen|telefon|handy|appeler|téléphone|chiamare|telefono|ligar/,
    /whatsapp|escribir|write|mensaje|message|nachricht|schreiben|écrire|messaggio|scrivere|mensagem/,
    /contacto|contact|reservar|book|reserva|kontakt|contatto|contato/
  ]
  
  // Intenciones de pedido
  const orderPatterns = [
    /pedir|ordenar|order|domicilio|delivery|bestellen|bestellung|lieferung|commander|livraison|ordinare|consegna|entrega/,
    /enviar|send|traer|bring/
  ]
  
  // Intenciones de compartir
  const sharePatterns = [
    /compartir|share|enviar a|send to|teilen|partager|condividi|compartilhar/,
    /guardar|save|favorito|favorite|favoritos|speichern|favorit|enregistrer|favori|salva|preferito|salvar/
  ]
  
  // Intenciones de tours
  const tourPatterns = [
    /reservar tour|book tour|agendar|schedule|tour buchen|réserver un tour|prenota tour|reservar um tour/,
    /tour del café|coffee tour|cabalgata|horseback|kaffeetour|ausritt|tour du café|balade à cheval|tour del caffè|cavalcata|passeio a cavalo/,
    /experiencia|experience|actividad|activity|erlebnis|expérience|esperienza|experiência/
  ]
  
  for (const pattern of navigatePatterns) {
    if (pattern.test(lower)) return { wantsAction: true, actionType: 'navigate', confidence: 0.85 }
  }
  
  for (const pattern of contactPatterns) {
    if (pattern.test(lower)) return { wantsAction: true, actionType: 'contact', confidence: 0.9 }
  }
  
  for (const pattern of orderPatterns) {
    if (pattern.test(lower)) return { wantsAction: true, actionType: 'order', confidence: 0.85 }
  }
  
  for (const pattern of sharePatterns) {
    if (pattern.test(lower)) return { wantsAction: true, actionType: 'share', confidence: 0.8 }
  }
  
  for (const pattern of tourPatterns) {
    if (pattern.test(lower)) return { wantsAction: true, actionType: 'tour', confidence: 0.85 }
  }
  
  return { wantsAction: false, actionType: 'none', confidence: 0 }
}

// Generar acciones basadas en intención y contexto
export function generateActions(
  intent: string,
  places: Place[],
  selectedPlace: Place | null,
  language: Language
): AgentAction[] {
  const actions: AgentAction[] = []
  const isEn = language === 'en' || language === 'en-gb'
  
  switch (intent) {
    case 'navigate':
      if (selectedPlace?.location) {
        actions.push({
          type: 'open-map',
          lat: selectedPlace.location.lat,
          lng: selectedPlace.location.lng,
          label: selectedPlace.name
        })
      } else {
        // Navegar a Salento centro
        actions.push({
          type: 'open-map',
          lat: 4.6364,
          lng: -75.5732,
          label: isEn ? 'Salento center' : 'Centro de Salento'
        })
      }
      break
      
    case 'contact':
      if (selectedPlace?.contact?.whatsapp) {
        actions.push({
          type: 'whatsapp',
          phone: selectedPlace.contact.whatsapp,
          message: isEn 
            ? `Hello! I'm interested in ${selectedPlace.name}. Can you help me?`
            : `¡Hola! Estoy interesado en ${selectedPlace.name}. ¿Me pueden ayudar?`
        })
      }
      if (selectedPlace?.contact?.phone) {
        actions.push({ type: 'call', phone: selectedPlace.contact.phone })
      }
      break
      
    case 'order':
      if (selectedPlace?.contact?.whatsapp) {
        actions.push({
          type: 'whatsapp',
          phone: selectedPlace.contact.whatsapp,
          message: isEn
            ? `Hello! I'd like to make an order. Can you send me the menu?`
            : `¡Hola! Me gustaría hacer un pedido. ¿Me pueden enviar el menú?`
        })
      }
      break
      
    case 'share':
      if (selectedPlace) {
        actions.push({
          type: 'share',
          title: selectedPlace.name,
          text: isEn
            ? `Check out ${selectedPlace.name} in Salento! ${selectedPlace.description || ''}`
            : `¡Mira ${selectedPlace.name} en Salento! ${selectedPlace.description || ''}`,
          url: selectedPlace.actionTarget?.viewUrl || undefined
        })
      }
      break
      
    case 'tour':
      if (selectedPlace) {
        actions.push({ type: 'book-tour', placeId: selectedPlace.id })
        if (selectedPlace.contact?.whatsapp) {
          actions.push({
            type: 'whatsapp',
            phone: selectedPlace.contact.whatsapp,
            message: isEn
              ? `Hello! I'd like to book a tour at ${selectedPlace.name}. What availability do you have?`
              : `¡Hola! Me gustaría reservar un tour en ${selectedPlace.name}. ¿Qué disponibilidad tienen?`
          })
        }
      }
      break
  }
  
  return actions
}

// Ejecutar acción agente
export function executeAction(action: AgentAction): void {
  switch (action.type) {
    case 'navigate':
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(action.destination)}`, '_blank')
      break
      
    case 'whatsapp':
      window.open(`https://wa.me/${action.phone}?text=${encodeURIComponent(action.message)}`, '_blank')
      break
      
    case 'call':
      window.open(`tel:${action.phone}`, '_self')
      break
      
    case 'share':
      if (navigator.share) {
        navigator.share({ title: action.title, text: action.text, url: action.url })
      } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(`${action.title}\n${action.text}\n${action.url || ''}`)
      }
      break
      
    case 'save-favorite':
      try {
        const favorites = JSON.parse(localStorage.getItem('salento_favorites') || '[]')
        if (!favorites.includes(action.placeId)) {
          favorites.push(action.placeId)
          localStorage.setItem('salento_favorites', JSON.stringify(favorites))
        }
      } catch {}
      break
      
    case 'open-map':
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${action.lat},${action.lng}&query=${encodeURIComponent(action.label)}`, '_blank')
      break
      
    case 'open-web':
      window.open(action.url, '_blank')
      break
      
    case 'show-places':
      // Emitir evento personalizado para que la app muestre places
      window.dispatchEvent(new CustomEvent('salento:show-places', { detail: { category: action.category } }))
      break
      
    case 'book-tour':
      // Emitir evento para abrir modal de reserva
      window.dispatchEvent(new CustomEvent('salento:book-tour', { detail: { placeId: action.placeId, date: action.date } }))
      break
  }
}

// Generar respuesta con acciones integradas
export function generateAgenticResponse(
  text: string,
  places: Place[],
  language: Language
): AgentResponse {
  const lower = text.toLowerCase()
  const { wantsAction, actionType, confidence } = parseActionIntent(text, language)
  
  if (!wantsAction || confidence < 0.7) {
    return { text: '', actions: [] }
  }
  
  // Buscar lugar mencionado
  const mentionedPlace = places.find(p => 
    lower.includes(p.name.toLowerCase())
  )
  
  const actions = generateActions(actionType, places, mentionedPlace || null, language)
  
  // Textos localizados para los 6 idiomas con cobertura humana.
  // El resto de idiomas cae al idioma base (español) según la política del proyecto.
  interface AgentPhrases {
    navigatePlace: (n: string) => string
    navigateMap: string
    followNavigate: string
    contactPlace: (n: string) => string
    contactAsk: string
    orderPlace: (n: string) => string
    orderAsk: string
    sharePlace: (n: string) => string
    tourPlace: (n: string) => string
    tourAsk: string
  }
  const phrasesByLang: Partial<Record<Language, AgentPhrases>> = {
    es: {
      navigatePlace: (n) => `Abriendo ruta a ${n}...`,
      navigateMap: 'Abriendo mapa de Salento...',
      followNavigate: '¿Necesitas otras instrucciones?',
      contactPlace: (n) => `Conectándote con ${n}...`,
      contactAsk: '¿Con cuál lugar quieres contactar?',
      orderPlace: (n) => `Abriendo pedido con ${n}...`,
      orderAsk: '¿De cuál restaurante quieres pedir?',
      sharePlace: (n) => `Compartiendo ${n}...`,
      tourPlace: (n) => `Abriendo reserva de tour en ${n}...`,
      tourAsk: '¿Qué tour te interesa?'
    },
    en: {
      navigatePlace: (n) => `Opening directions to ${n}...`,
      navigateMap: 'Opening map of Salento...',
      followNavigate: 'Need other directions?',
      contactPlace: (n) => `Connecting you with ${n}...`,
      contactAsk: 'Which place do you want to contact?',
      orderPlace: (n) => `Opening order with ${n}...`,
      orderAsk: 'Which restaurant do you want to order from?',
      sharePlace: (n) => `Sharing ${n}...`,
      tourPlace: (n) => `Opening tour reservation at ${n}...`,
      tourAsk: 'Which tour interests you?'
    },
    de: {
      navigatePlace: (n) => `Route nach ${n} wird geöffnet...`,
      navigateMap: 'Karte von Salento wird geöffnet...',
      followNavigate: 'Brauchst du weitere Wegbeschreibungen?',
      contactPlace: (n) => `Verbindung mit ${n} wird hergestellt...`,
      contactAsk: 'Welchen Ort möchtest du kontaktieren?',
      orderPlace: (n) => `Bestellung bei ${n} wird geöffnet...`,
      orderAsk: 'Bei welchem Restaurant möchtest du bestellen?',
      sharePlace: (n) => `${n} wird geteilt...`,
      tourPlace: (n) => `Tour-Buchung bei ${n} wird geöffnet...`,
      tourAsk: 'Welche Tour interessiert dich?'
    },
    fr: {
      navigatePlace: (n) => `Ouverture de l'itinéraire vers ${n}...`,
      navigateMap: 'Ouverture de la carte de Salento...',
      followNavigate: 'Besoin d\'autres indications ?',
      contactPlace: (n) => `Mise en relation avec ${n}...`,
      contactAsk: 'Quel lieu voulez-vous contacter ?',
      orderPlace: (n) => `Ouverture de la commande avec ${n}...`,
      orderAsk: 'De quel restaurant voulez-vous commander ?',
      sharePlace: (n) => `Partage de ${n}...`,
      tourPlace: (n) => `Ouverture de la réservation de tour à ${n}...`,
      tourAsk: 'Quel tour vous intéresse ?'
    },
    pt: {
      navigatePlace: (n) => `Abrindo rota para ${n}...`,
      navigateMap: 'Abrindo mapa de Salento...',
      followNavigate: 'Precisa de outras instruções?',
      contactPlace: (n) => `Conectando você com ${n}...`,
      contactAsk: 'Com qual lugar você quer falar?',
      orderPlace: (n) => `Abrindo pedido com ${n}...`,
      orderAsk: 'De qual restaurante você quer pedir?',
      sharePlace: (n) => `Compartilhando ${n}...`,
      tourPlace: (n) => `Abrindo reserva de tour em ${n}...`,
      tourAsk: 'Qual tour te interessa?'
    },
    it: {
      navigatePlace: (n) => `Apertura del percorso verso ${n}...`,
      navigateMap: 'Apertura della mappa di Salento...',
      followNavigate: 'Ti servono altre indicazioni?',
      contactPlace: (n) => `Ti metto in contatto con ${n}...`,
      contactAsk: 'Quale luogo vuoi contattare?',
      orderPlace: (n) => `Apertura dell\'ordine con ${n}...`,
      orderAsk: 'Da quale ristorante vuoi ordinare?',
      sharePlace: (n) => `Condivisione di ${n}...`,
      tourPlace: (n) => `Apertura della prenotazione del tour presso ${n}...`,
      tourAsk: 'Quale tour ti interessa?'
    }
  }
  // `en-gb` reutiliza los textos en inglés; el resto sin cobertura cae al base (español).
  const p = phrasesByLang[language] || (language === 'en-gb' ? phrasesByLang.en! : phrasesByLang.es!)
  
  // Generar texto de respuesta
  let responseText = ''
  const followUp: string[] = []
  
  switch (actionType) {
    case 'navigate':
      responseText = mentionedPlace
        ? p.navigatePlace(mentionedPlace.name)
        : p.navigateMap
      followUp.push(p.followNavigate)
      break
      
    case 'contact':
      responseText = mentionedPlace
        ? p.contactPlace(mentionedPlace.name)
        : p.contactAsk
      break
      
    case 'order':
      responseText = mentionedPlace
        ? p.orderPlace(mentionedPlace.name)
        : p.orderAsk
      break
      
    case 'share':
      responseText = mentionedPlace
        ? p.sharePlace(mentionedPlace.name)
        : ''
      break
      
    case 'tour':
      responseText = mentionedPlace
        ? p.tourPlace(mentionedPlace.name)
        : p.tourAsk
      break
  }
  
  return { text: responseText, actions, followUp }
}
