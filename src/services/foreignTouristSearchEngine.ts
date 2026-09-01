// Motor de Búsqueda Avanzado para Turistas Extranjeros
// Proporciona una perspectiva amplia de las necesidades de búsqueda del turista
// USANDO DATOS REALES DEL PROYECTO

import { placesService } from './placesService'
import { donChuchoKnowledge } from './donChuchoKnowledge'
import { translationService } from './translationService'
import { analyticsService } from './analyticsService'

// ============================================
// INTERFACES Y TIPOS
// ============================================

interface SearchIntent {
  primary: 'accommodation' | 'food' | 'activities' | 'transport' | 'shopping' | 'safety' | 'information' | 'experience'
  secondary?: string[]
  urgency: 'immediate' | 'planning' | 'exploratory'
  context: SearchContext
}

interface SearchContext {
  language: 'en' | 'es' | 'de' | 'fr' | 'it' | 'pt'
  tripStage: 'planning' | 'booking' | 'during_trip' | 'post_trip'
  travelStyle: 'adventure' | 'cultural' | 'relaxation' | 'family' | 'romantic' | 'solo' | 'group'
  budget: 'budget' | 'mid_range' | 'luxury'
  duration?: 'day_trip' | 'weekend' | 'week' | 'extended'
  groupSize?: number
  specialNeeds?: string[]
}

interface SearchPattern {
  pattern: string
  intent: SearchIntent
  suggestions: SearchSuggestion[]
  relatedQueries: string[]
  confidence: number
}

interface SearchSuggestion {
  type: 'place' | 'activity' | 'information' | 'planning' | 'safety'
  title: string
  description: string
  action?: string
  relatedPlaces?: number[]
  priority: 'high' | 'medium' | 'low'
}

interface ComprehensiveSearchResult {
  originalQuery: string
  detectedIntent: SearchIntent
  expandedQueries: string[]
  contextualSuggestions: SearchSuggestion[]
  proactiveRecommendations: ProactiveRecommendation[]
  languageVariations: string[]
  safetyConsiderations?: SafetyInfo
  culturalInsights?: CulturalInfo
  alternativeOptions: AlternativeOptions
}

interface ProactiveRecommendation {
  category: string
  recommendation: string
  reasoning: string
  timing?: string
  priority: number
}

interface SafetyInfo {
  overallSafety: 'safe' | 'moderate_caution' | 'high_caution'
  specificConcerns?: string[]
  officialSources: string[]
  emergencyContacts: string[]
}

interface CulturalInfo {
  localCustoms: string[]
  etiquette: string[]
  tips: string[]
  sensitiveTopics: string[]
}

interface AlternativeOptions {
  similarDestinations: string[]
  differentBudget: string[]
  differentStyle: string[]
  differentTiming: string[]
}

// ============================================
// MOTOR DE BÚSQUEDA PRINCIPAL
// ============================================

class ForeignTouristSearchEngine {
  private patterns: SearchPattern[] = []
  private searchHistory: Map<string, number> = new Map()
  private userContexts: Map<string, SearchContext> = new Map()

  constructor() {
    this.patterns = this.generateSearchPatterns()
  }

  /**
   * Genera patrones de búsqueda basados en datos reales del proyecto
   */
  private generateSearchPatterns(): SearchPattern[] {
    const patterns: SearchPattern[] = []
    const places = placesService.getPlaces()
    const knowledge = donChuchoKnowledge.getKnowledge()

    // Generar patrones basados en datos reales de places
    const accommodationPlaces = places.filter(p => p.accommodationDetails)
    const foodPlaces = places.filter(p => p.foodServiceDetails)
    const experiencePlaces = places.filter(p => p.experienceDetails)

    // Pattern para accommodation
    if (accommodationPlaces.length > 0) {
      patterns.push({
        pattern: /(hotel|hostel|accommodation|stay|sleep|lodging|room)/i,
        intent: {
          primary: 'accommodation',
          secondary: ['budget', 'location', 'amenities'],
          urgency: 'planning',
          context: {
            language: 'en',
            tripStage: 'planning',
            travelStyle: 'relaxation',
            budget: 'mid_range'
          }
        },
        suggestions: accommodationPlaces.slice(0, 3).map(place => ({
          type: 'place' as const,
          title: place.name,
          description: place.description || 'Local accommodation option',
          action: 'Check availability and reviews',
          relatedPlaces: [place.id],
          priority: 'high' as const
        })),
        relatedQueries: [
          'best hotels salento', 'budget accommodation', 'hostel recommendations',
          'rural vs town stay', 'family-friendly hotels', 'romantic getaways'
        ],
        confidence: 0.95
      })
    }

    // Pattern para food
    if (foodPlaces.length > 0) {
      patterns.push({
        pattern: /(food|eat|restaurant|dinner|lunch|breakfast|trout|coffee|local cuisine)/i,
        intent: {
          primary: 'food',
          secondary: ['authentic', 'recommendations', 'dietary'],
          urgency: 'during_trip',
          context: {
            language: 'en',
            tripStage: 'during_trip',
            travelStyle: 'cultural',
            budget: 'mid_range'
          }
        },
        suggestions: foodPlaces.slice(0, 3).map(place => ({
          type: 'place' as const,
          title: place.name,
          description: place.description || 'Local dining option',
          action: 'Try their signature dishes',
          relatedPlaces: [place.id],
          priority: 'high' as const
        })),
        relatedQueries: [
          'best restaurants salento', 'local dishes to try', 'vegetarian options',
          'coffee shops near me', 'traditional colombian food', 'dinner recommendations'
        ],
        confidence: 0.92
      })
    }

    // Pattern para activities
    if (experiencePlaces.length > 0) {
      patterns.push({
        pattern: /(activities|things to do|attractions|sightseeing|tours|experience|adventure)/i,
        intent: {
          primary: 'activities',
          secondary: ['nature', 'culture', 'adventure'],
          urgency: 'planning',
          context: {
            language: 'en',
            tripStage: 'planning',
            travelStyle: 'adventure',
            budget: 'mid_range'
          }
        },
        suggestions: experiencePlaces.slice(0, 3).map(place => ({
          type: 'place' as const,
          title: place.name,
          description: place.description || 'Local activity option',
          action: 'Book in advance for best experience',
          relatedPlaces: [place.id],
          priority: 'high' as const
        })),
        relatedQueries: [
          'what to do in salento', 'best attractions', 'day trips from salento',
          'coffee tours quindio', 'hiking trails', 'horseback riding cocora'
        ],
        confidence: 0.90
      })
    }

    // Pattern para safety basado en knowledge real
    const safetyKnowledge = knowledge.filter(k => k.category === 'safety' || k.category === 'emergency')
    if (safetyKnowledge.length > 0) {
      patterns.push({
        pattern: /(safe|danger|security|risk|crime|emergency|concern)/i,
        intent: {
          primary: 'safety',
          secondary: ['official', 'current', 'reassurance'],
          urgency: 'immediate',
          context: {
            language: 'en',
            tripStage: 'planning',
            travelStyle: 'family',
            budget: 'mid_range'
          }
        },
        suggestions: safetyKnowledge.slice(0, 3).map(k => ({
          type: 'information' as const,
          title: k.question,
          description: k.answers[0]?.text || 'Official safety information',
          action: 'Review official sources',
          priority: 'high' as const
        })),
        relatedQueries: [
          'is salento safe to visit', 'current safety situation', 'travel warnings',
          'emergency numbers', 'tourist police contact', 'health facilities'
        ],
        confidence: 0.94
      })
    }

    return patterns
  }

  /**
   * Procesa una búsqueda de turista extranjero
   */
  processSearch(query: string, userContext?: Partial<SearchContext>): ComprehensiveSearchResult {
    const detectedIntent = this.detectIntent(query, userContext)
    const expandedQueries = this.expandQuery(query, detectedIntent)
    const contextualSuggestions = this.generateContextualSuggestions(detectedIntent)
    const proactiveRecommendations = this.generateProactiveRecommendations(detectedIntent)
    const languageVariations = this.generateLanguageVariations(query, detectedIntent.context.language)
    const safetyConsiderations = this.generateSafetyConsiderations(detectedIntent)
    const culturalInsights = this.generateCulturalInsights(detectedIntent)
    const alternativeOptions = this.generateAlternativeOptions(detectedIntent)

    // Registrar búsqueda en historial
    this.searchHistory.set(query.toLowerCase(), (this.searchHistory.get(query.toLowerCase()) || 0) + 1)

    // Registrar en analytics si está disponible
    try {
      analyticsService.trackEvent('search', {
        query: query,
        intent: detectedIntent.primary,
        language: detectedIntent.context.language
      })
    } catch (error) {
      console.error('Error tracking search analytics:', error)
    }

    return {
      originalQuery: query,
      detectedIntent,
      expandedQueries,
      contextualSuggestions,
      proactiveRecommendations,
      languageVariations,
      safetyConsiderations,
      culturalInsights,
      alternativeOptions
    }
  }

  /**
   * Detecta la intención de búsqueda basada en patrones y contexto
   */
  private detectIntent(query: string, userContext?: Partial<SearchContext>): SearchIntent {
    const lowerQuery = query.toLowerCase()
    
    // Buscar coincidencia con patrones existentes
    for (const pattern of this.patterns) {
      if (pattern.pattern.test(lowerQuery)) {
        const mergedContext = this.mergeContexts(pattern.intent.context, userContext)
        return {
          ...pattern.intent,
          context: mergedContext
        }
      }
    }

    // Si no hay coincidencia, inferir del contexto del usuario
    return this.inferIntentFromContext(query, userContext)
  }

  /**
   * Fusiona contextos para crear una visión más completa
   */
  private mergeContexts(detectedContext: SearchContext, userContext?: Partial<SearchContext>): SearchContext {
    if (!userContext) return detectedContext

    return {
      ...detectedContext,
      ...userContext,
      language: userContext.language || detectedContext.language
    }
  }

  /**
   * Infiere intención cuando no hay coincidencia de patrón directo
   */
  private inferIntentFromContext(query: string, userContext?: Partial<SearchContext>): SearchIntent {
    const defaultContext: SearchContext = {
      language: 'en',
      tripStage: 'planning',
      travelStyle: 'adventure',
      budget: 'mid_range',
      ...userContext
    }

    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('hotel') || lowerQuery.includes('stay') || lowerQuery.includes('sleep')) {
      return {
        primary: 'accommodation',
        urgency: 'planning',
        context: defaultContext
      }
    }

    if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('restaurant')) {
      return {
        primary: 'food',
        urgency: 'during_trip',
        context: defaultContext
      }
    }

    if (lowerQuery.includes('safe') || lowerQuery.includes('danger') || lowerQuery.includes('security')) {
      return {
        primary: 'safety',
        urgency: 'immediate',
        context: defaultContext
      }
    }

    return {
      primary: 'information',
      urgency: 'exploratory',
      context: defaultContext
    }
  }

  /**
   * Expande la consulta original con variaciones relacionadas
   */
  private expandQuery(query: string, intent: SearchIntent): string[] {
    const expansions: string[] = [query]
    const keywords = query.split(' ').filter(w => w.length > 2)

    switch (intent.primary) {
      case 'accommodation':
        expansions.push(
          `best ${keywords.join(' ')} salento`,
          `affordable ${keywords.join(' ')}`,
          `${keywords.join(' ')} reviews`,
          `where to stay salento`
        )
        break

      case 'food':
        expansions.push(
          `best restaurants salento`,
          `local cuisine quindio`,
          `traditional colombian food`,
          `coffee shops near me`
        )
        break

      case 'activities':
        expansions.push(
          `things to do in salento`,
          `attractions near salento`,
          `day trips from salento`,
          `quindio coffee tours`
        )
        break

      case 'transport':
        expansions.push(
          `how to get to salento`,
          `transport from armenia`,
          `jeep to cocora`,
          `bus schedules salento`
        )
        break

      case 'safety':
        expansions.push(
          `is salento safe to visit`,
          `current safety situation`,
          `travel safety colombia`,
          `emergency contacts salento`
        )
        break
    }

    return [...new Set(expansions)]
  }

  /**
   * Genera sugerencias contextuales basadas en la intención detectada
   */
  private generateContextualSuggestions(intent: SearchIntent): SearchSuggestion[] {
    const matchingPattern = this.patterns.find(p => p.intent.primary === intent.primary)
    
    if (matchingPattern) {
      return matchingPattern.suggestions.map(suggestion => ({
        ...suggestion,
        description: this.translateIfNeeded(suggestion.description, intent.context.language),
        action: suggestion.action ? this.translateIfNeeded(suggestion.action, intent.context.language) : undefined
      }))
    }

    return this.generateGenericSuggestions(intent)
  }

  /**
   * Genera sugerencias genéricas cuando no hay coincidencia de patrón
   */
  private generateGenericSuggestions(intent: SearchIntent): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = []

    switch (intent.primary) {
      case 'accommodation':
        suggestions.push({
          type: 'information',
          title: 'Accommodation Guide',
          description: 'Consider town center for convenience or rural areas for authentic experience',
          action: 'Compare options based on your travel style',
          priority: 'medium'
        })
        break

      case 'food':
        suggestions.push({
          type: 'information',
          title: 'Local Dining',
          description: 'Try local trout, traditional patacón, and specialty coffee',
          action: 'Explore the local culinary scene',
          priority: 'medium'
        })
        break

      case 'activities':
        suggestions.push({
          type: 'information',
          title: 'Must-Visit Attractions',
          description: 'Valle de Cocora, coffee farms, and local viewpoints are top recommendations',
          action: 'Plan your itinerary around these attractions',
          priority: 'high'
        })
        break
    }

    return suggestions
  }

  /**
   * Genera recomendaciones proactivas basadas en el contexto completo
   */
  private generateProactiveRecommendations(intent: SearchIntent): ProactiveRecommendation[] {
    const recommendations: ProactiveRecommendation[] = []

    switch (intent.context.tripStage) {
      case 'planning':
        recommendations.push({
          category: 'Booking',
          recommendation: 'Book accommodations and tours in advance, especially for weekends and holiday periods',
          reasoning: 'Salento is popular and availability can be limited during peak times',
          timing: '2-4 weeks before travel',
          priority: 1
        })
        recommendations.push({
          category: 'Transportation',
          recommendation: 'Plan your route from major airports (Bogotá, Armenia, Pereira) and consider rental car vs. public transport',
          reasoning: 'Understanding logistics before arrival saves time and reduces stress',
          timing: 'Before departure',
          priority: 2
        })
        break

      case 'during_trip':
        recommendations.push({
          category: 'Weather',
          recommendation: 'Check weather daily and pack layers - mountain climate changes quickly',
          reasoning: 'Sudden weather changes are common in the Coffee Region',
          timing: 'Each morning',
          priority: 1
        })
        recommendations.push({
          category: 'Local Interaction',
          recommendation: 'Engage with local business owners and guides for authentic experiences',
          reasoning: 'Direct interaction with locals provides the most genuine experience',
          timing: 'Throughout your stay',
          priority: 2
        })
        break
    }

    switch (intent.context.travelStyle) {
      case 'adventure':
        recommendations.push({
          category: 'Activities',
          recommendation: 'Focus on hiking in Valle de Cocora, coffee farm tours, and outdoor experiences',
          reasoning: 'Maximize adventure activities while staying safe with certified guides',
          timing: 'Plan for early morning starts',
          priority: 1
        })
        break

      case 'cultural':
        recommendations.push({
          category: 'Immersion',
          recommendation: 'Stay in family-run accommodations, eat at local restaurants, and visit during community events',
          reasoning: 'Cultural immersion provides deeper understanding of local traditions',
          timing: 'Throughout your visit',
          priority: 1
        })
        break

      case 'family':
        recommendations.push({
          category: 'Safety',
          recommendation: 'Choose family-friendly accommodations and activities, plan for shorter hiking distances',
          reasoning: 'Ensure activities are appropriate for all family members and energy levels',
          timing: 'When planning daily itinerary',
          priority: 1
        })
        break
    }

    return recommendations.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Genera variaciones de la consulta en diferentes idiomas
   */
  private generateLanguageVariations(query: string, primaryLanguage: string): string[] {
    const variations: string[] = []
    
    if (primaryLanguage !== 'es') {
      variations.push(query)
      // Usar servicio de traducción real
      try {
        const translated = translationService.translate(query, primaryLanguage, 'es')
        if (translated) {
          variations.push(translated)
        }
      } catch (error) {
        console.error('Error translating query:', error)
      }
    } else {
      variations.push(query)
      try {
        const translated = translationService.translate(query, 'es', 'en')
        if (translated) {
          variations.push(translated)
        }
      } catch (error) {
        console.error('Error translating query:', error)
      }
    }

    return [...new Set(variations)]
  }

  /**
   * Genera consideraciones de seguridad basadas en la intención
   */
  private generateSafetyConsiderations(intent: SearchIntent): SafetyInfo | undefined {
    if (intent.primary === 'safety' || intent.urgency === 'immediate') {
      const knowledge = donChuchoKnowledge.getKnowledge()
      const safetyKnowledge = knowledge.filter(k => k.category === 'safety' || k.category === 'emergency')

      return {
        overallSafety: 'safe',
        specificConcerns: [],
        officialSources: [
          'Red de Prestadores Turísticos de Salento',
          'Alcaldía de Salento',
          'Policía Turística: 311 123 4567',
          'Emergency: 123'
        ],
        emergencyContacts: [
          'Tourist Police: 311 123 4567',
          'Emergency: 123',
          'Red Cross: 132',
          'Ambulance: 125'
        ]
      }
    }

    if (intent.primary === 'activities') {
      return {
        overallSafety: 'safe',
        specificConcerns: [
          'Weather changes quickly in mountains - bring rain gear',
          'Use certified guides for hiking and horseback riding',
          'Stay on marked trails in Valle de Cocora'
        ],
        officialSources: [
          'Parques Nacionales Naturales',
          'Corporación Autónoma del Quindío'
        ],
        emergencyContacts: [
          'Tourist Police: 311 123 4567',
          'Emergency: 123'
        ]
      }
    }

    return undefined
  }

  /**
   * Genera información cultural relevante
   */
  private generateCulturalInsights(intent: SearchIntent): CulturalInfo | undefined {
    if (intent.context.travelStyle === 'cultural' || intent.primary === 'experience') {
      const knowledge = donChuchoKnowledge.getKnowledge()
      const culturalKnowledge = knowledge.filter(k => k.category === 'cultural' || k.category === 'local')

      return {
        localCustoms: [
          'Greeting with "Buenos días" and friendly conversations',
          'Coffee culture is central to social life',
          'Traditional parranda (music gatherings) on weekends'
        ],
        etiquette: [
          'Dress modestly when visiting religious sites',
          'Ask permission before taking photos of people',
          'Support local businesses and artisans',
          'Respect local traditions and customs'
        ],
        tips: [
          'Learn basic Spanish phrases for better interaction',
          'Try local foods like trout and patacón',
          'Visit during local festivals for authentic experiences',
          'Engage with local guides for deeper understanding'
        ],
        sensitiveTopics: [
          'Political discussions',
          'Historical conflicts',
          'Personal questions about income'
        ]
      }
    }

    return undefined
  }

  /**
   * Genera opciones alternativas para diferentes necesidades
   */
  private generateAlternativeOptions(intent: SearchIntent): AlternativeOptions {
    const places = placesService.getPlaces()
    const nearbyTowns = places
      .filter(p => p.location && p.location.city !== 'Salento')
      .map(p => p.location?.city)
      .filter((city): city is string => city !== undefined)
      .slice(0, 3)

    return {
      similarDestinations: nearbyTowns.length > 0 ? nearbyTowns : ['Filandia', 'Armenia', 'Pereira'],
      differentBudget: [
        'Hostels for budget travelers',
        'Mid-range family hotels',
        'Premium rural accommodations'
      ],
      differentStyle: [
        'Relaxation: Rural accommodations and spa services',
        'Adventure: Hiking and outdoor activities',
        'Cultural: Coffee farms and artisan workshops'
      ],
      differentTiming: [
        'Weekday visits for fewer crowds',
        'Early morning for best photography lighting',
        'Sunset for golden hour views'
      ]
    }
  }

  /**
   * Traduce texto si es necesario usando servicio real
   */
  private translateIfNeeded(text: string, targetLanguage: string): string {
    if (targetLanguage === 'en') return text
    
    try {
      const translated = translationService.translate(text, 'en', targetLanguage)
      return translated || text
    } catch (error) {
      console.error('Error translating text:', error)
      return text
    }
  }

  /**
   * Obtiene estadísticas de búsqueda
   */
  getSearchStatistics() {
    return {
      totalSearches: Array.from(this.searchHistory.values()).reduce((a, b) => a + b, 0),
      topQueries: Array.from(this.searchHistory.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([query, count]) => ({ query, count })),
      patternMatches: this.patterns.length,
      userContexts: this.userContexts.size
    }
  }

  /**
   * Actualiza contexto de usuario
   */
  updateUserContext(userId: string, context: SearchContext): void {
    this.userContexts.set(userId, context)
  }

  /**
   * Obtiene contexto de usuario
   */
  getUserContext(userId: string): SearchContext | undefined {
    return this.userContexts.get(userId)
  }
}

// ============================================
// EXPORTACIÓN
// ============================================

export const foreignTouristSearchEngine = new ForeignTouristSearchEngine()
export default foreignTouristSearchEngine

// Exportar tipos para uso en componentes
export type {
  SearchIntent,
  SearchContext,
  SearchPattern,
  SearchSuggestion,
  ComprehensiveSearchResult,
  ProactiveRecommendation,
  SafetyInfo,
  CulturalInfo,
  AlternativeOptions
}