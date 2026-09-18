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
    /como llego|cómo llego|how do i get|directions|ir a|llevame|llévame/,
    /direccion|dirección|ubicación|dónde queda|where is|location/,
    /mapa|map|ruta|route/
  ]
  
  // Intenciones de contacto
  const contactPatterns = [
    /llamar|call|teléfono|phone|celular/,
    /whatsapp|escribir|write|mensaje|message/,
    /contacto|contact|reservar|book|reserva/
  ]
  
  // Intenciones de pedido
  const orderPatterns = [
    /pedir|ordenar|order|domicilio|delivery/,
    /enviar|send|traer|bring/
  ]
  
  // Intenciones de compartir
  const sharePatterns = [
    /compartir|share|enviar a|send to/,
    /guardar|save|favorito|favorite|favoritos/
  ]
  
  // Intenciones de tours
  const tourPatterns = [
    /reservar tour|book tour|agendar|schedule/,
    /tour del café|coffee tour|cabalgata|horseback/,
    /experiencia|experience|actividad|activity/
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
  const isEn = language === 'en'
  
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
  const isEn = language === 'en'
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
  
  // Generar texto de respuesta
  let responseText = ''
  const followUp: string[] = []
  
  switch (actionType) {
    case 'navigate':
      responseText = mentionedPlace
        ? (isEn ? `Opening directions to ${mentionedPlace.name}...` : `Abriendo ruta a ${mentionedPlace.name}...`)
        : (isEn ? 'Opening map of Salento...' : 'Abriendo mapa de Salento...')
      followUp.push(isEn ? 'Need other directions?' : '¿Necesitas otras instrucciones?')
      break
      
    case 'contact':
      responseText = mentionedPlace
        ? (isEn ? `Connecting you with ${mentionedPlace.name}...` : `Conectándote con ${mentionedPlace.name}...`)
        : (isEn ? 'Which place do you want to contact?' : '¿Con cuál lugar quieres contactar?')
      break
      
    case 'order':
      responseText = mentionedPlace
        ? (isEn ? `Opening order with ${mentionedPlace.name}...` : `Abriendo pedido con ${mentionedPlace.name}...`)
        : (isEn ? 'Which restaurant do you want to order from?' : '¿De cuál restaurante quieres pedir?')
      break
      
    case 'share':
      responseText = mentionedPlace
        ? (isEn ? `Sharing ${mentionedPlace.name}...` : `Compartiendo ${mentionedPlace.name}...`)
        : ''
      break
      
    case 'tour':
      responseText = mentionedPlace
        ? (isEn ? `Opening tour reservation at ${mentionedPlace.name}...` : `Abriendo reserva de tour en ${mentionedPlace.name}...`)
        : (isEn ? 'Which tour interests you?' : '¿Qué tour te interesa?')
      break
  }
  
  return { text: responseText, actions, followUp }
}
