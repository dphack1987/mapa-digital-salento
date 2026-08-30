interface AnalyticsData {
  placeId: string
  placeName: string
  views: number
  clicks: {
    whatsapp: number
    phone: number
    email: number
    website: number
  }
  orders: number
  reviews: {
    total: number
    averageRating: number
    distribution: Record<number, number>
  }
  trends: {
    daily: Array<{ date: string; views: number; orders: number }>
    weekly: Array<{ week: string; views: number; orders: number }>
    monthly: Array<{ month: string; views: number; orders: number }>
  }
  benchmarks: {
    categoryAverage: number
    topPerformer: number
    relativePosition: number
  }
}

class AnalyticsService {
  private analyticsData: Map<string, AnalyticsData> = new Map()
  private initialized = false

  initialize() {
    if (this.initialized) return
    this.generateSampleData()
    this.initialized = true
  }

  private generateSampleData() {
    const samplePlaces = [
      { id: '1', name: 'Café Salento Real', type: 'Cafés' },
      { id: '2', name: 'Restaurante El Rincon', type: 'Restaurantes' },
      { id: '3', name: 'Artesanías del Valle', type: 'Artesanías' },
      { id: '4', name: 'Hotel Mirador', type: 'Alojamientos' },
      { id: '5', name: 'Transporte Willys', type: 'Transporte' }
    ]

    samplePlaces.forEach(place => {
      this.analyticsData.set(place.id, this.createSampleAnalytics(place))
    })
  }

  private createSampleAnalytics(place: { id: string; name: string; type: string }): AnalyticsData {
    const baseViews = Math.floor(Math.random() * 500) + 100
    const baseOrders = Math.floor(Math.random() * 50) + 10
    const totalReviews = Math.floor(Math.random() * 30) + 5
    const avgRating = (Math.random() * 2 + 3).toFixed(1)

    return {
      placeId: place.id,
      placeName: place.name,
      views: baseViews,
      clicks: {
        whatsapp: Math.floor(baseViews * 0.3),
        phone: Math.floor(baseViews * 0.15),
        email: Math.floor(baseViews * 0.05),
        website: Math.floor(baseViews * 0.1)
      },
      orders: baseOrders,
      reviews: {
        total: totalReviews,
        averageRating: parseFloat(avgRating),
        distribution: this.generateRatingDistribution(totalReviews, parseFloat(avgRating))
      },
      trends: {
        daily: this.generateDailyTrends(baseViews, baseOrders),
        weekly: this.generateWeeklyTrends(baseViews, baseOrders),
        monthly: this.generateMonthlyTrends(baseViews, baseOrders)
      },
      benchmarks: {
        categoryAverage: baseViews * 0.8,
        topPerformer: baseViews * 1.5,
        relativePosition: Math.floor(Math.random() * 100)
      }
    }
  }

  private generateRatingDistribution(total: number, average: number): Record<number, number> {
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let remaining = total

    // Distribución basada en el promedio
    const fiveStarRatio = average >= 4.5 ? 0.6 : average >= 4 ? 0.4 : average >= 3.5 ? 0.3 : 0.2
    distribution[5] = Math.floor(total * fiveStarRatio)
    remaining -= distribution[5]

    distribution[4] = Math.floor(remaining * 0.4)
    remaining -= distribution[4]

    distribution[3] = Math.floor(remaining * 0.3)
    remaining -= distribution[3]

    distribution[2] = Math.floor(remaining * 0.2)
    remaining -= distribution[2]

    distribution[1] = remaining

    return distribution
  }

  private generateDailyTrends(baseViews: number, baseOrders: number): Array<{ date: string; views: number; orders: number }> {
    const trends = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })

      const variance = Math.random() * 0.4 - 0.2 // ±20%
      const dayViews = Math.floor(baseViews * (0.1 + variance))
      const dayOrders = Math.floor(baseOrders * (0.1 + variance))

      trends.push({ date: dateStr, views: dayViews, orders: dayOrders })
    }

    return trends
  }

  private generateWeeklyTrends(baseViews: number, baseOrders: number): Array<{ week: string; views: number; orders: number }> {
    const trends = []
    const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']

    weeks.forEach((week, index) => {
      const variance = Math.random() * 0.3 - 0.15
      const weekViews = Math.floor(baseViews * (0.25 + variance))
      const weekOrders = Math.floor(baseOrders * (0.25 + variance))

      trends.push({ week, views: weekViews, orders: weekOrders })
    })

    return trends
  }

  private generateMonthlyTrends(baseViews: number, baseOrders: number): Array<{ month: string; views: number; orders: number }> {
    const trends = []
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']

    months.forEach((month, index) => {
      const growth = 1 + (index * 0.1) // Crecimiento mensual
      const variance = Math.random() * 0.2 - 0.1
      const monthViews = Math.floor(baseViews * (0.16 * growth + variance))
      const monthOrders = Math.floor(baseOrders * (0.16 * growth + variance))

      trends.push({ month, views: monthViews, orders: monthOrders })
    })

    return trends
  }

  getAnalytics(placeId: string): AnalyticsData | null {
    return this.analyticsData.get(placeId) || null
  }

  getAllAnalytics(): AnalyticsData[] {
    return Array.from(this.analyticsData.values())
  }

  trackView(placeId: string) {
    const data = this.analyticsData.get(placeId)
    if (data) {
      data.views++
      this.updateTrends(data, 'view')
    }
  }

  trackClick(placeId: string, type: 'whatsapp' | 'phone' | 'email' | 'website') {
    const data = this.analyticsData.get(placeId)
    if (data) {
      data.clicks[type]++
    }
  }

  trackOrder(placeId: string) {
    const data = this.analyticsData.get(placeId)
    if (data) {
      data.orders++
      this.updateTrends(data, 'order')
    }
  }

  private updateTrends(data: AnalyticsData, type: 'view' | 'order') {
    const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    const dailyTrend = data.trends.daily.find(t => t.date === today)

    if (dailyTrend) {
      if (type === 'view') dailyTrend.views++
      if (type === 'order') dailyTrend.orders++
    }
  }

  getTopPerformers(limit: number = 5): AnalyticsData[] {
    return Array.from(this.analyticsData.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  }

  getCategoryAnalytics(category: string): AnalyticsData[] {
    return Array.from(this.analyticsData.values())
      .filter(data => {
        // En una implementación real, filtraríamos por categoría del lugar
        return true
      })
  }

  getInsights(placeId: string): string[] {
    const data = this.analyticsData.get(placeId)
    if (!data) return []

    const insights = []

    // Análisis de rendimiento
    if (data.views > data.benchmarks.categoryAverage) {
      insights.push('Tu perfil tiene un rendimiento superior al promedio de tu categoría')
    } else {
      insights.push('Considera mejorar tus fotos y descripción para aumentar las visitas')
    }

    // Análisis de conversión
    const conversionRate = (data.orders / data.views) * 100
    if (conversionRate > 10) {
      insights.push('Excelente tasa de conversión de visitas a pedidos')
    } else if (conversionRate < 5) {
      insights.push('Tu tasa de conversión es baja - revisa precios y disponibilidad')
    }

    // Análisis de reseñas
    if (data.reviews.averageRating >= 4.5) {
      insights.push('Tus reseñas son excelentes - úsalas en tu marketing')
    } else if (data.reviews.averageRating < 3.5) {
      insights.push('Las reseñas necesitan atención - responde a los comentarios negativos')
    }

    // Análisis de contacto
    const totalClicks = Object.values(data.clicks).reduce((a, b) => a + b, 0)
    const clickRate = (totalClicks / data.views) * 100
    if (clickRate > 20) {
      insights.push('Buen nivel de interacción - los clientes interesados contactan frecuentemente')
    } else {
      insights.push('Asegúrate que tus datos de contacto sean visibles y actualizados')
    }

    return insights
  }
}

const analyticsService = new AnalyticsService()
export default analyticsService