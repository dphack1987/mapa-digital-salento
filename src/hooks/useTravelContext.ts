// Context-Aware UI Hook - Detecta la fase del viaje del usuario
// y adapta la interfaz dinámicamente

import { useState, useEffect, useCallback } from 'react'

export type TravelPhase = 'planning' | 'on-trip' | 'post-trip'

export interface TravelContext {
  phase: TravelPhase
  daysUntilTrip: number | null
  daysSinceTrip: number | null
  isCurrentlyInSalento: boolean
  lastSearchCategory: string | null
  recentInteractions: string[]
  preferredLanguage: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  trackInteraction: (text: string, category: string) => void
  setTripDate: (date: string) => void
}

const STORAGE_KEY = 'salento_travel_context'
const INTERACTION_KEY = 'salento_recent_interactions'

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

function detectTravelPhase(): TravelPhase {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      if (data.tripDate) {
        const tripDate = new Date(data.tripDate)
        const now = new Date()
        const diffDays = Math.ceil((tripDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays > 0 && diffDays <= 30) return 'planning'
        if (diffDays <= 0 && diffDays >= -7) return 'on-trip'
        if (diffDays < -7) return 'post-trip'
      }
    }
  } catch {}
  
  // Detectar por comportamiento
  try {
    const interactions = JSON.parse(localStorage.getItem(INTERACTION_KEY) || '[]')
    const recentCategories = interactions.slice(-10).map((i: any) => i.category)
    
    const planningSignals = ['hotel', 'hospedaje', 'ruta', 'como llegar', 'transporte']
    const onTripSignals = ['restaurante', 'comer', 'cerca', 'ahora', 'abierto']
    
    const planningCount = recentCategories.filter((c: string) => 
      planningSignals.some(s => c.includes(s))
    ).length
    
    const onTripCount = recentCategories.filter((c: string) => 
      onTripSignals.some(s => c.includes(s))
    ).length
    
    if (planningCount > onTripCount && planningCount >= 2) return 'planning'
    if (onTripCount > planningCount && onTripCount >= 2) return 'on-trip'
  } catch {}
  
  return 'planning'
}

function detectLocation(): boolean {
  // Por ahora, asumir que si busca cosas "cerca" o "ahora", está en Salento
  try {
    const interactions = JSON.parse(localStorage.getItem(INTERACTION_KEY) || '[]')
    const last5 = interactions.slice(-5)
    const locationSignals = ['cerca', 'ahi', 'como llego', 'donde est', 'mapa']
    return last5.some((i: any) => 
      locationSignals.some(s => i.text?.toLowerCase().includes(s))
    )
  } catch {
    return false
  }
}

export function useTravelContext(): TravelContext {
  const [phase, setPhase] = useState<TravelPhase>('planning')
  const [daysUntilTrip, setDaysUntilTrip] = useState<number | null>(null)
  const [daysSinceTrip, setDaysSinceTrip] = useState<number | null>(null)
  const [isCurrentlyInSalento, setIsCurrentlyInSalento] = useState(false)
  const [lastSearchCategory, setLastSearchCategory] = useState<string | null>(null)
  const [recentInteractions, setRecentInteractions] = useState<string[]>([])
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>(getTimeOfDay())

  const trackInteraction = useCallback((text: string, category: string) => {
    try {
      const interactions = JSON.parse(localStorage.getItem(INTERACTION_KEY) || '[]')
      interactions.push({ text, category, timestamp: Date.now() })
      // Mantener solo las últimas 50 interacciones
      if (interactions.length > 50) interactions.splice(0, interactions.length - 50)
      localStorage.setItem(INTERACTION_KEY, JSON.stringify(interactions))
      
      setLastSearchCategory(category)
      setRecentInteractions(interactions.slice(-10).map((i: any) => i.text))
    } catch {}
  }, [])

  const setTripDate = useCallback((date: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tripDate: date }))
    setPhase('planning')
    setDaysUntilTrip(Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
  }, [])

  useEffect(() => {
    const detectedPhase = detectTravelPhase()
    const isInSalento = detectLocation()
    
    setPhase(detectedPhase)
    setIsCurrentlyInSalento(isInSalento)
    setTimeOfDay(getTimeOfDay())
  }, [])

  return {
    phase,
    daysUntilTrip,
    daysSinceTrip,
    isCurrentlyInSalento,
    lastSearchCategory,
    recentInteractions,
    preferredLanguage: 'es',
    timeOfDay,
    trackInteraction,
    setTripDate
  }
}

// Helper para obtener mensajes contextuales
export function getContextualMessage(context: TravelContext): string {
  const { phase, timeOfDay, isCurrentlyInSalento } = context
  
  const messages: Record<string, Record<TravelPhase, string>> = {
    morning: {
      planning: '☀️ Buenos días! ¿Planeando tu viaje a Salento? Te ayudo a preparar todo.',
      'on-trip': '☀️ Buenos días en Salento! ¿Listo para el día de aventura?',
      'post-trip': '☀️ Buenos días! ¿Extrañando Salento? Te cuento las novedades.'
    },
    afternoon: {
      planning: '🌤️ Buenas tardes! ¿Buscando qué hacer en Salento? Tengo opciones perfectas.',
      'on-trip': '🌤️ Buenas tardes! ¿Buscando dónde almorzar o qué hacer esta tarde?',
      'post-trip': '🌤️ Buenas tardes! ¿Cómo te fue en Salento? Comparte tu experiencia.'
    },
    evening: {
      planning: '🌅 Buenas noches! ¿Planeando tu visita a Salento? Te ayudo con alojamiento.',
      'on-trip': '🌙 Buenas noches! ¿Buscando dónde cenar o明日 qué hacer?',
      'post-trip': '🌙 Buenas noches! ¿Recuerdas tus noches en Salento?'
    },
    night: {
      planning: '🌙 Buenas noches! ¿Planeando con calma? Te ayudo a organizar tu viaje.',
      'on-trip': '🌙 Buenas noches en Salento! ¿Buscando algo tranquilo?',
      'post-trip': '🌙 Buenas noches! ¿Soñando con regresar a Salento?'
    }
  }
  
  return messages[timeOfDay]?.[phase] || messages.morning.planning
}
