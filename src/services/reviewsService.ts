// Sistema de reseñas y calificaciones
// Permite que los turistas califiquen lugares y servicios

interface Review {
  id: string
  placeId: string
  placeName: string
  placeType: string
  userId: string
  userName: string
  rating: number // 1-5
  title: string
  comment: string
  photos?: string[]
  createdAt: Date
  updatedAt?: Date
  verified: boolean // Si el usuario realmente visitó el lugar
  helpful: number // Número de usuarios que marcaron la reseña como útil
  language: 'es' | 'en'
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number> // Distribución de calificaciones 1-5
  recentReviews: Review[]
  topRatedReviews: Review[]
}

class ReviewsService {
  private reviews: Map<string, Review> = new Map()
  private reviewCounter = 0

  /**
   * Crear nueva reseña
   */
  createReview(reviewData: {
    placeId: string
    placeName: string
    placeType: string
    userId: string
    userName: string
    rating: number
    title: string
    comment: string
    photos?: string[]
    verified?: boolean
    language?: 'es' | 'en'
  }): Review {
    // Validar datos
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('La calificación debe estar entre 1 y 5')
    }

    if (!reviewData.title || reviewData.title.trim().length === 0) {
      throw new Error('El título es requerido')
    }

    if (!reviewData.comment || reviewData.comment.trim().length === 0) {
      throw new Error('El comentario es requerido')
    }

    this.reviewCounter++
    const reviewId = this.generateReviewId()

    const review: Review = {
      id: reviewId,
      placeId: reviewData.placeId,
      placeName: reviewData.placeName,
      placeType: reviewData.placeType,
      userId: reviewData.userId,
      userName: reviewData.userName,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      photos: reviewData.photos || [],
      createdAt: new Date(),
      verified: reviewData.verified || false,
      helpful: 0,
      language: reviewData.language || 'es'
    }

    this.reviews.set(reviewId, review)
    return review
  }

  /**
   * Obtener reseña por ID
   */
  getReview(reviewId: string): Review | undefined {
    return this.reviews.get(reviewId)
  }

  /**
   * Obtener reseñas de un lugar
   */
  getReviewsByPlace(placeId: string): Review[] {
    return Array.from(this.reviews.values())
      .filter(review => review.placeId === placeId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Obtener reseñas de un usuario
   */
  getReviewsByUser(userId: string): Review[] {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Obtener estadísticas de reseñas de un lugar
   */
  getPlaceStats(placeId: string): ReviewStats {
    const placeReviews = this.getReviewsByPlace(placeId)

    if (placeReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recentReviews: [],
        topRatedReviews: []
      }
    }

    const totalRating = placeReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / placeReviews.length

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    placeReviews.forEach(review => {
      ratingDistribution[review.rating]++
    })

    const recentReviews = placeReviews.slice(0, 5)
    const topRatedReviews = [...placeReviews]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Redondear a 1 decimal
      totalReviews: placeReviews.length,
      ratingDistribution,
      recentReviews,
      topRatedReviews
    }
  }

  /**
   * Obtener estadísticas generales
   */
  getOverallStats(): {
    totalReviews: number
    averageRating: number
    reviewsByType: Record<string, number>
    reviewsByLanguage: Record<string, number>
    verifiedReviews: number
  } {
    const allReviews = Array.from(this.reviews.values())

    const totalReviews = allReviews.length
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0

    const reviewsByType: Record<string, number> = {}
    const reviewsByLanguage: Record<string, number> = {}
    let verifiedReviews = 0

    allReviews.forEach(review => {
      reviewsByType[review.placeType] = (reviewsByType[review.placeType] || 0) + 1
      reviewsByLanguage[review.language] = (reviewsByLanguage[review.language] || 0) + 1
      if (review.verified) verifiedReviews++
    })

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewsByType,
      reviewsByLanguage,
      verifiedReviews
    }
  }

  /**
   * Marcar reseña como útil
   */
  markAsHelpful(reviewId: string): boolean {
    const review = this.reviews.get(reviewId)
    if (review) {
      review.helpful++
      this.reviews.set(reviewId, review)
      return true
    }
    return false
  }

  /**
   * Actualizar reseña
   */
  updateReview(reviewId: string, updates: Partial<Omit<Review, 'id' | 'createdAt' | 'userId'>>): boolean {
    const review = this.reviews.get(reviewId)
    if (review) {
      Object.assign(review, updates, { updatedAt: new Date() })
      this.reviews.set(reviewId, review)
      return true
    }
    return false
  }

  /**
   * Eliminar reseña
   */
  deleteReview(reviewId: string): boolean {
    return this.reviews.delete(reviewId)
  }

  /**
   * Obtener reseñas destacadas (altamente calificadas)
   */
  getFeaturedReviews(limit: number = 10): Review[] {
    return Array.from(this.reviews.values())
      .filter(review => review.rating >= 4 && review.verified)
      .sort((a, b) => {
        // Primero por calificación, luego por número de helpful
        if (b.rating !== a.rating) return b.rating - a.rating
        return b.helpful - a.helpful
      })
      .slice(0, limit)
  }

  /**
   * Obtener reseñas recientes
   */
  getRecentReviews(limit: number = 20): Review[] {
    return Array.from(this.reviews.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  /**
   * Buscar reseñas por texto
   */
  searchReviews(query: string, language?: 'es' | 'en'): Review[] {
    const normalizedQuery = query.toLowerCase()
    
    return Array.from(this.reviews.values())
      .filter(review => {
        const matchesLanguage = !language || review.language === language
        const matchesQuery = 
          review.title.toLowerCase().includes(normalizedQuery) ||
          review.comment.toLowerCase().includes(normalizedQuery) ||
          review.placeName.toLowerCase().includes(normalizedQuery)
        
        return matchesLanguage && matchesQuery
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Generar resumen de reseñas para mostrar en UI
   */
  generateReviewSummary(placeId: string, placeName: string): {
    rating: number
    count: number
    distribution: Record<number, number>
    latestReviews: Array<{ userName: string; rating: number; comment: string; date: string }>
  } {
    const stats = this.getPlaceStats(placeId)
    
    return {
      rating: stats.averageRating,
      count: stats.totalReviews,
      distribution: stats.ratingDistribution,
      latestReviews: stats.recentReviews.map(review => ({
        userName: review.userName,
        rating: review.rating,
        comment: review.comment.substring(0, 100) + (review.comment.length > 100 ? '...' : ''),
        date: review.createdAt.toLocaleDateString()
      }))
    }
  }

  /**
   * Validar si un usuario puede reseñar un lugar
   */
  canUserReview(userId: string, placeId: string): boolean {
    const existingReview = Array.from(this.reviews.values()).find(
      review => review.userId === userId && review.placeId === placeId
    )
    return !existingReview
  }

  /**
   * Generar ID de reseña
   */
  private generateReviewId(): string {
    return `REV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  }

  /**
   * Generar datos de ejemplo para desarrollo
   */
  generateSampleReviews(): void {
    const sampleReviews = [
      {
        placeId: '1',
        placeName: 'Café Quindío',
        placeType: 'Cafés',
        userId: 'user-001',
        userName: 'María García',
        rating: 5,
        title: '¡El mejor café de Salento!',
        comment: 'El café es increíble, el ambiente es muy acogedor y el personal súper amable. Vengo cada vez que visito Salento.',
        verified: true,
        language: 'es'
      },
      {
        placeId: '1',
        placeName: 'Café Quindío',
        placeType: 'Cafés',
        userId: 'user-002',
        userName: 'John Smith',
        rating: 4,
        title: 'Great coffee with a view',
        comment: 'Excellent specialty coffee and beautiful view of the main square. Highly recommended for coffee lovers.',
        verified: true,
        language: 'en'
      },
      {
        placeId: '4',
        placeName: 'La Fogata',
        placeType: 'Restaurantes',
        userId: 'user-003',
        userName: 'Carlos Rodríguez',
        rating: 5,
        title: 'Trucha espectacular',
        comment: 'La mejor trucha que he probado en Salento. Porciones generosas y el patacón está crujiente. Muy recomendado.',
        verified: true,
        language: 'es'
      },
      {
        placeId: '5',
        placeName: 'Hotel Camino Nacional',
        placeType: 'Alojamientos',
        userId: 'user-004',
        userName: 'Ana Martínez',
        rating: 4,
        title: 'Ubicación perfecta',
        comment: 'Hotel muy bien ubicado en el centro del pueblo. Habitaciones limpias y personal servicial. Desayuno incluido muy completo.',
        verified: true,
        language: 'es'
      }
    ]

    sampleReviews.forEach(reviewData => {
      try {
        this.createReview(reviewData)
      } catch (error) {
        console.error('Error creating sample review:', error)
      }
    })
  }
}

// Exportar instancia singleton
export const reviewsService = new ReviewsService()
export default reviewsService