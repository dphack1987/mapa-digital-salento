// Servicio de gamificación - Pasaporte del Café y la Trucha
// Sistema de sellos digitales y recompensas para incentivar economía circular

interface Stamp {
  id: string
  placeId: string
  placeName: string
  category: string
  icon: string
  obtainedAt: Date
  visitType: 'dining' | 'shopping' | 'experience' | 'accommodation'
  value: number
}

interface Reward {
  id: string
  name: string
  description: string
  requiredStamps: number
  requiredCategories: string[]
  icon: string
  discount: number
  type: 'discount' | 'free_item' | 'experience' | 'upgrade'
  validUntil?: Date
  partnerPlace?: string
  claimed: boolean
}

interface UserPassport {
  userId: string
  stamps: Stamp[]
  rewards: Reward[]
  totalPoints: number
  level: 'novice' | 'explorer' | 'connoisseur' | 'ambassador'
  createdAt: Date
  lastActivity: Date
}

interface Challenge {
  id: string
  name: string
  description: string
  points: number
  completed: boolean
  completedAt?: Date
}

class GamificationService {
  private passports: Map<string, UserPassport> = new Map()
  private availableRewards: Reward[] = []
  private challenges: Challenge[] = []
  private currentUser: string | null = null

  /**
   * Inicializar el servicio de gamificación
   */
  initialize(): void {
    this.loadRewards()
    this.loadChallenges()
    this.loadPassportsFromStorage()
  }

  /**
   * Cargar recompensas disponibles
   */
  private loadRewards(): void {
    this.availableRewards = [
      {
        id: 'reward-1',
        name: 'Descuento en Café de Origen',
        description: '15% de descuento en cualquier café de origen participante',
        requiredStamps: 3,
        requiredCategories: ['Cafés'],
        icon: '☕',
        discount: 15,
        type: 'discount',
        partnerPlace: 'Café Quindío',
        claimed: false
      },
      {
        id: 'reward-2',
        name: 'Taza de Café Gratuita',
        description: 'Una taza de café cortesía al completar ruta cafetera',
        requiredStamps: 5,
        requiredCategories: ['Cafés', 'Restaurantes'],
        icon: '🫖',
        discount: 100,
        type: 'free_item',
        partnerPlace: 'Café de Altura',
        claimed: false
      },
      {
        id: 'reward-3',
        name: 'Tour de Café Gratuito',
        description: 'Entrada gratuita a tour de café en finca participante',
        requiredStamps: 7,
        requiredCategories: ['Cafés', 'Alojamientos', 'Experiencias'],
        icon: '🌱',
        discount: 100,
        type: 'experience',
        partnerPlace: 'Finca de Don Elías',
        claimed: false
      },
      {
        id: 'reward-4',
        name: 'Descuento en Artesanías',
        description: '20% de descuento en cualquier artesanía local',
        requiredStamps: 4,
        requiredCategories: ['Artesanías'],
        icon: '🧶',
        discount: 20,
        type: 'discount',
        partnerPlace: 'Canasto Quindiano',
        claimed: false
      },
      {
        id: 'reward-5',
        name: 'Experiencia Gastronómica',
        description: 'Plato tradicional de cortesía en restaurante participante',
        requiredStamps: 6,
        requiredCategories: ['Restaurantes', 'Cafés'],
        icon: '🍽️',
        discount: 100,
        type: 'free_item',
        partnerPlace: 'La Fogata',
        claimed: false
      },
      {
        id: 'reward-6',
        name: 'Upgrade de Habitación',
        description: 'Mejora de categoría en hotel participante (sujeto a disponibilidad)',
        requiredStamps: 8,
        requiredCategories: ['Alojamientos', 'Restaurantes', 'Cafés'],
        icon: '🏨',
        discount: 50,
        type: 'upgrade',
        partnerPlace: 'Hotel Camino Nacional',
        claimed: false
      }
    ]
  }

  /**
   * Cargar desafíos disponibles
   */
  private loadChallenges(): void {
    this.challenges = [
      {
        id: 'challenge-1',
        name: 'Ruta del Café',
        description: 'Visita 3 cafés diferentes en Salento',
        points: 500,
        completed: false
      },
      {
        id: 'challenge-2',
        name: 'Sabores Locales',
        description: 'Prueba platos en 2 restaurantes tradicionales',
        points: 300,
        completed: false
      },
      {
        id: 'challenge-3',
        name: 'Artesanía Viva',
        description: 'Compra en 2 tiendas de artesanías diferentes',
        points: 400,
        completed: false
      },
      {
        id: 'challenge-4',
        name: 'Experiencia Completa',
        description: 'Visita 1 establecimiento de cada categoría',
        points: 1000,
        completed: false
      },
      {
        id: 'challenge-5',
        name: 'Salentino por un Día',
        description: 'Completa 5 sellos en un solo día',
        points: 600,
        completed: false
      }
    ]
  }

  /**
   * Crear o obtener pasaporte de usuario
   */
  getUserPassport(userId: string): UserPassport {
    if (!this.passports.has(userId)) {
      const newPassport: UserPassport = {
        userId,
        stamps: [],
        rewards: [],
        totalPoints: 0,
        level: 'novice',
        createdAt: new Date(),
        lastActivity: new Date()
      }
      this.passports.set(userId, newPassport)
      this.savePassportsToStorage()
    }
    return this.passports.get(userId)!
  }

  /**
   * Añadir sello al pasaporte
   */
  addStamp(userId: string, placeId: string, placeName: string, category: string, visitType: Stamp['visitType']): Stamp {
    const passport = this.getUserPassport(userId)
    
    // Verificar si ya tiene sello de este lugar
    const existingStamp = passport.stamps.find(stamp => stamp.placeId === placeId)
    if (existingStamp) {
      return existingStamp
    }

    const icon = this.getCategoryIcon(category)
    const value = this.getStampValue(category, visitType)

    const newStamp: Stamp = {
      id: `stamp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      placeId,
      placeName,
      category,
      icon,
      obtainedAt: new Date(),
      visitType,
      value
    }

    passport.stamps.push(newStamp)
    passport.totalPoints += value
    passport.lastActivity = new Date()
    passport.level = this.calculateLevel(passport.totalPoints)

    this.checkChallenges(passport)
    this.checkRewards(passport)
    this.savePassportsToStorage()

    console.log('Stamp added:', newStamp)
    return newStamp
  }

  /**
   * Obtener icono por categoría
   */
  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Cafés': '☕',
      'Restaurantes': '🍽️',
      'Artesanías': '🧶',
      'Alojamientos': '🏨',
      'Experiencias': '🌟',
      'Servicios': '🛠️',
      'Tiendas': '🛍️'
    }
    return icons[category] || '📍'
  }

  /**
   * Obtener valor de sello según categoría y tipo de visita
   */
  private getStampValue(category: string, visitType: Stamp['visitType']): number {
    const baseValues: Record<string, number> = {
      'Cafés': 100,
      'Restaurantes': 150,
      'Artesanías': 120,
      'Alojamientos': 200,
      'Experiencias': 180,
      'Servicios': 80,
      'Tiendas': 90
    }

    const visitMultipliers: Record<Stamp['visitType'], number> = {
      'dining': 1.2,
      'shopping': 1.0,
      'experience': 1.5,
      'accommodation': 1.3
    }

    const baseValue = baseValues[category] || 100
    const multiplier = visitMultipliers[visitType] || 1.0

    return Math.round(baseValue * multiplier)
  }

  /**
   * Calcular nivel del usuario según puntos
   */
  private calculateLevel(points: number): UserPassport['level'] {
    if (points >= 2000) return 'ambassador'
    if (points >= 1000) return 'connoisseur'
    if (points >= 500) return 'explorer'
    return 'novice'
  }

  /**
   * Verificar y actualizar desafíos
   */
  private checkChallenges(passport: UserPassport): void {
    const categories = passport.stamps.map(stamp => stamp.category)
    const uniqueCategories = [...new Set(categories)]
    const uniquePlaces = [...new Set(passport.stamps.map(stamp => stamp.placeId))]

    // Desafío 1: Ruta del Café
    const coffeeStamps = passport.stamps.filter(stamp => stamp.category === 'Cafés')
    if (coffeeStamps.length >= 3) {
      this.completeChallenge('challenge-1', passport)
    }

    // Desafío 2: Sabores Locales
    const restaurantStamps = passport.stamps.filter(stamp => stamp.category === 'Restaurantes')
    if (restaurantStamps.length >= 2) {
      this.completeChallenge('challenge-2', passport)
    }

    // Desafío 3: Artesanía Viva
    const craftStamps = passport.stamps.filter(stamp => stamp.category === 'Artesanías')
    if (craftStamps.length >= 2) {
      this.completeChallenge('challenge-3', passport)
    }

    // Desafío 4: Experiencia Completa
    if (uniqueCategories.length >= 5) {
      this.completeChallenge('challenge-4', passport)
    }

    // Desafío 5: Salentino por un Día
    const today = new Date()
    const todayStamps = passport.stamps.filter(stamp => {
      const stampDate = new Date(stamp.obtainedAt)
      return stampDate.toDateString() === today.toDateString()
    })
    if (todayStamps.length >= 5) {
      this.completeChallenge('challenge-5', passport)
    }
  }

  /**
   * Completar desafío
   */
  private completeChallenge(challengeId: string, passport: UserPassport): void {
    const challenge = this.challenges.find(c => c.id === challengeId)
    if (challenge && !challenge.completed) {
      challenge.completed = true
      challenge.completedAt = new Date()
      passport.totalPoints += challenge.points
      passport.level = this.calculateLevel(passport.totalPoints)
      console.log('Challenge completed:', challenge.name, `+${challenge.points} points`)
    }
  }

  /**
   * Verificar y desbloquear recompensas
   */
  private checkRewards(passport: UserPassport): void {
    const categories = passport.stamps.map(stamp => stamp.category)
    const uniqueCategories = [...new Set(categories)]

    for (const reward of this.availableRewards) {
      if (passport.rewards.some(r => r.id === reward.id)) continue // Ya tiene la recompensa

      const hasRequiredStamps = passport.stamps.length >= reward.requiredStamps
      const hasRequiredCategories = reward.requiredCategories.every(cat => 
        uniqueCategories.includes(cat)
      )

      if (hasRequiredStamps && hasRequiredCategories) {
        passport.rewards.push({ ...reward, claimed: false })
        console.log('Reward unlocked:', reward.name)
      }
    }
  }

  /**
   * Reclamar recompensa
   */
  claimReward(userId: string, rewardId: string): Reward | null {
    const passport = this.getUserPassport(userId)
    const reward = passport.rewards.find(r => r.id === rewardId)

    if (reward && !reward.claimed) {
      reward.claimed = true
      passport.lastActivity = new Date()
      this.savePassportsToStorage()
      return reward
    }

    return null
  }

  /**
   * Obtener recompensas disponibles para el usuario
   */
  getAvailableRewards(userId: string): Reward[] {
    const passport = this.getUserPassport(userId)
    return passport.rewards.filter(reward => !reward.claimed)
  }

  /**
   * Obtener recompensas reclamadas
   */
  getClaimedRewards(userId: string): Reward[] {
    const passport = this.getUserPassport(userId)
    return passport.rewards.filter(reward => reward.claimed)
  }

  /**
   * Obtener todos los desafíos
   */
  getChallenges(): Challenge[] {
    return this.challenges
  }

  /**
   * Obtener desafíos completados
   */
  getCompletedChallenges(userId: string): Challenge[] {
    const passport = this.getUserPassport(userId)
    return this.challenges.filter(challenge => challenge.completed)
  }

  /**
   * Obtener progreso hacia un desafío específico
   */
  getChallengeProgress(userId: string, challengeId: string): { current: number; target: number; percentage: number } {
    const passport = this.getUserPassport(userId)
    const challenge = this.challenges.find(c => c.id === challengeId)
    
    if (!challenge) return { current: 0, target: 0, percentage: 0 }

    let current = 0
    let target = 0

    switch (challengeId) {
      case 'challenge-1':
        current = passport.stamps.filter(s => s.category === 'Cafés').length
        target = 3
        break
      case 'challenge-2':
        current = passport.stamps.filter(s => s.category === 'Restaurantes').length
        target = 2
        break
      case 'challenge-3':
        current = passport.stamps.filter(s => s.category === 'Artesanías').length
        target = 2
        break
      case 'challenge-4':
        current = [...new Set(passport.stamps.map(s => s.category))].length
        target = 5
        break
      case 'challenge-5':
        const today = new Date()
        current = passport.stamps.filter(s => {
          const stampDate = new Date(s.obtainedAt)
          return stampDate.toDateString() === today.toDateString()
        }).length
        target = 5
        break
    }

    const percentage = target > 0 ? Math.round((current / target) * 100) : 0

    return { current, target, percentage }
  }

  /**
   * Obtener estadísticas del pasaporte
   */
  getPassportStats(userId: string): {
    totalStamps: number
    totalPoints: number
    level: string
    completedChallenges: number
    availableRewards: number
    byCategory: Record<string, number>
  } {
    const passport = this.getUserPassport(userId)
    const byCategory: Record<string, number> = {}

    for (const stamp of passport.stamps) {
      byCategory[stamp.category] = (byCategory[stamp.category] || 0) + 1
    }

    return {
      totalStamps: passport.stamps.length,
      totalPoints: passport.totalPoints,
      level: passport.level,
      completedChallenges: this.getCompletedChallenges(userId).length,
      availableRewards: this.getAvailableRewards(userId).length,
      byCategory
    }
  }

  /**
   * Generar código para reclamar sello (para uso en establecimientos)
   */
  generateStampCode(userId: string, placeId: string): string {
    const timestamp = Date.now()
    const hash = `${userId}-${placeId}-${timestamp}`
    return btoa(hash).substring(0, 8)
  }

  /**
   * Validar código de sello
   */
  validateStampCode(code: string, placeId: string): { valid: boolean; userId?: string } {
    // En una implementación real, esto validaría contra un backend
    // Por ahora, simulamos validación
    return { valid: true, userId: 'demo-user' }
  }

  /**
   * Obtener nivel formateado
   */
  getLevelName(level: UserPassport['level']): string {
    const names: Record<UserPassport['level'], string> = {
      'novice': 'Novato',
      'explorer': 'Explorador',
      'connoisseur': 'Conocedor',
      'ambassador': 'Embajador'
    }
    return names[level]
  }

  /**
   * Obtener siguiente nivel
   */
  getNextLevel(currentLevel: UserPassport['level']): { level: UserPassport['level']; pointsRequired: number } | null {
    const levels: UserPassport['level'][] = ['novice', 'explorer', 'connoisseur', 'ambassador']
    const currentIndex = levels.indexOf(currentLevel)
    
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1]
      const pointsRequired = (currentIndex + 1) * 500
      return { level: nextLevel, pointsRequired }
    }

    return null
  }

  /**
   * Guardar pasaportes en localStorage
   */
  private savePassportsToStorage(): void {
    try {
      const passportsData = Array.from(this.passports.entries())
      localStorage.setItem('salento_passports', JSON.stringify(passportsData))
    } catch (error) {
      console.error('Error saving passports to storage:', error)
    }
  }

  /**
   * Cargar pasaportes desde localStorage
   */
  private loadPassportsFromStorage(): void {
    try {
      const stored = localStorage.getItem('salento_passports')
      if (stored) {
        const passportsData = JSON.parse(stored)
        this.passports = new Map(
          passportsData.map(([userId, passport]: [string, any]) => [
            userId,
            {
              ...passport,
              stamps: passport.stamps.map((stamp: any) => ({
                ...stamp,
                obtainedAt: new Date(stamp.obtainedAt)
              })),
              createdAt: new Date(passport.createdAt),
              lastActivity: new Date(passport.lastActivity)
            }
          ])
        )
      }
    } catch (error) {
      console.error('Error loading passports from storage:', error)
    }
  }

  /**
   * Establecer usuario actual
   */
  setCurrentUser(userId: string): void {
    this.currentUser = userId
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): string | null {
    return this.currentUser
  }
}

// Exportar instancia singleton
export const gamificationService = new GamificationService()
export default gamificationService