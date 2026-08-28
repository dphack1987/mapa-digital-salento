// Servicio de clima en tiempo real
// Proporciona información meteorológica comparativa entre Salento y Valle de Cocora

interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  condition: string
  icon: string
  precipitation: number
  timestamp: number
}

interface WeatherComparison {
  salento: WeatherData
  valleCocora: WeatherData
  recommendation: string
  color: 'green' | 'yellow' | 'red'
}

class WeatherService {
  private cachedWeather: WeatherComparison | null = null
  private lastUpdate: number = 0
  private updateInterval = 30 * 60 * 1000 // 30 minutos

  // Coordenadas aproximadas
  private locations = {
    salento: { lat: 4.6371, lng: -75.5706, name: 'Salento Centro' },
    valleCocora: { lat: 4.6300, lng: -75.5500, name: 'Valle de Cocora' }
  }

  /**
   * Obtener datos de clima desde API (simulado para demo)
   */
  private async fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
    try {
      // En producción, usaríamos una API real como OpenWeatherMap
      // Por ahora usamos datos simulados basados en patrones climáticos reales de la zona
      
      const isValle = lat < 4.635 // Valle de Cocora está más al norte
      const isEvening = new Date().getHours() >= 17 || new Date().getHours() < 6
      
      // Patrones climáticos típicos de la zona
      if (isValle) {
        // Valle de Cocora es más fresco y lluvioso
        return {
          location: isValle ? 'Valle de Cocora' : 'Salento Centro',
          temperature: isEvening ? 14 : 18,
          feelsLike: isEvening ? 12 : 16,
          humidity: 85,
          windSpeed: 15,
          condition: isEvening ? 'Lluvia ligera' : 'Nublado con lluvias',
          icon: isEvening ? '🌧️' : '⛅',
          precipitation: 60,
          timestamp: Date.now()
        }
      } else {
        // Salento centro es más cálido
        return {
          location: 'Salento Centro',
          temperature: isEvening ? 16 : 22,
          feelsLike: isEvening ? 15 : 20,
          humidity: 75,
          windSpeed: 8,
          condition: isEvening ? 'Despejado' : 'Parcialmente nublado',
          icon: isEvening ? '🌙' : '☀️',
          precipitation: 20,
          timestamp: Date.now()
        }
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
      return this.getFallbackWeather(lat === this.locations.valleCocora.lat ? 'valle' : 'salento')
    }
  }

  /**
   * Datos de respaldo si la API falla
   */
  private getFallbackWeather(location: 'salento' | 'valle'): WeatherData {
    const isEvening = new Date().getHours() >= 17 || new Date().getHours() < 6
    
    if (location === 'valle') {
      return {
        location: 'Valle de Cocora',
        temperature: isEvening ? 14 : 18,
        feelsLike: isEvening ? 12 : 16,
        humidity: 85,
        windSpeed: 15,
        condition: isEvening ? 'Lluvia ligera' : 'Nublado',
        icon: isEvening ? '🌧️' : '⛅',
        precipitation: 60,
        timestamp: Date.now()
      }
    } else {
      return {
        location: 'Salento Centro',
        temperature: isEvening ? 16 : 22,
        feelsLike: isEvening ? 15 : 20,
        humidity: 75,
        windSpeed: 8,
        condition: isEvening ? 'Despejado' : 'Parcialmente nublado',
        icon: isEvening ? '🌙' : '☀️',
        precipitation: 20,
        timestamp: Date.now()
      }
    }
  }

  /**
   * Obtener comparación de clima
   */
  async getWeatherComparison(): Promise<WeatherComparison> {
    // Verificar si necesitamos actualizar
    if (this.cachedWeather && Date.now() - this.lastUpdate < this.updateInterval) {
      return this.cachedWeather
    }

    try {
      const [salentoWeather, valleWeather] = await Promise.all([
        this.fetchWeatherData(this.locations.salento.lat, this.locations.salento.lng),
        this.fetchWeatherData(this.locations.valleCocora.lat, this.locations.valleCocora.lng)
      ])

      const comparison: WeatherComparison = {
        salento: salentoWeather,
        valleCocora: valleWeather,
        recommendation: this.generateRecommendation(salentoWeather, valleWeather),
        color: this.getRiskColor(salentoWeather, valleWeather)
      }

      this.cachedWeather = comparison
      this.lastUpdate = Date.now()
      
      // Guardar en localStorage
      this.saveWeatherToStorage(comparison)
      
      return comparison
    } catch (error) {
      console.error('Error getting weather comparison:', error)
      return this.getFallbackComparison()
    }
  }

  /**
   * Generar recomendación basada en condiciones climáticas
   */
  private generateRecommendation(salento: WeatherData, valle: WeatherData): string {
    const isEvening = new Date().getHours() >= 17 || new Date().getHours() < 6
    const rainProbability = Math.max(salento.precipitation, valle.precipitation)
    
    if (rainProbability > 70) {
      return '⚠️ Alta probabilidad de lluvia. Lleva impermeable y considera posponer el Valle de Cocora.'
    }
    
    if (rainProbability > 50) {
      return '🌧️ Posibilidad de lluvias. Recomendado llevar impermeable para el Valle de Cocora.'
    }
    
    if (isEvening) {
      return '🌙 Buen clima nocturno. Ideal para caminar por el pueblo y disfrutar de restaurantes.'
    }
    
    if (valle.temperature < 15) {
      return '🌬️ Clima fresco en el Valle. Lleva chaqueta ligera para la caminata.'
    }
    
    return '☀️ Clima excelente para explorar. Buen momento para visitar el Valle de Cocora.'
  }

  /**
   * Determinar color de riesgo basado en condiciones
   */
  private getRiskColor(salento: WeatherData, valle: WeatherData): 'green' | 'yellow' | 'red' {
    const rainProbability = Math.max(salento.precipitation, valle.precipitation)
    const tempDifference = Math.abs(salento.temperature - valle.temperature)
    
    if (rainProbability > 70) return 'red'
    if (rainProbability > 50 || tempDifference > 8) return 'yellow'
    return 'green'
  }

  /**
   * Comparación de respaldo
   */
  private getFallbackComparison(): WeatherComparison {
    const salento = this.getFallbackWeather('salento')
    const valle = this.getFallbackWeather('valle')
    
    return {
      salento,
      valleCocora: valle,
      recommendation: this.generateRecommendation(salento, valle),
      color: this.getRiskColor(salento, valle)
    }
  }

  /**
   * Guardar clima en localStorage
   */
  private saveWeatherToStorage(comparison: WeatherComparison): void {
    try {
      localStorage.setItem('salento_weather_data', JSON.stringify({
        comparison,
        lastUpdate: this.lastUpdate
      }))
    } catch (error) {
      console.error('Error saving weather to storage:', error)
    }
  }

  /**
   * Cargar clima desde localStorage
   */
  private loadWeatherFromStorage(): WeatherComparison | null {
    try {
      const stored = localStorage.getItem('salento_weather_data')
      if (stored) {
        const data = JSON.parse(stored)
        this.cachedWeather = data.comparison
        this.lastUpdate = data.lastUpdate
        return data.comparison
      }
    } catch (error) {
      console.error('Error loading weather from storage:', error)
    }
    return null
  }

  /**
   * Formatear temperatura para display
   */
  formatTemperature(temp: number): string {
    return `${Math.round(temp)}°C`
  }

  /**
   * Obtener icono para condición
   */
  getConditionIcon(condition: string): string {
    const icons: Record<string, string> = {
      'Despejado': '☀️',
      'Parcialmente nublado': '⛅',
      'Nublado': '☁️',
      'Nublado con lluvias': '🌧️',
      'Lluvia ligera': '🌧️',
      'Lluvia fuerte': '⛈️',
      'Tormenta': '⛈️',
      'Niebla': '🌫️',
      'Despejado nocturno': '🌙',
      'Parcialmente nublado nocturno': '☁️'
    }
    
    return icons[condition] || '🌡️'
  }

  /**
   * Inicializar el servicio
   */
  initialize(): void {
    this.loadWeatherFromStorage()
    
    // Actualizar periódicamente
    setInterval(() => {
      this.getWeatherComparison()
    }, this.updateInterval)
  }

  /**
   * Forzar actualización de clima
   */
  async forceUpdate(): Promise<WeatherComparison> {
    this.lastUpdate = 0 // Resetear para forzar actualización
    return this.getWeatherComparison()
  }

  /**
   * Obtener última actualización
   */
  getLastUpdate(): Date {
    return new Date(this.lastUpdate)
  }

  /**
   * Verificar si los datos están actualizados
   */
  isDataFresh(): boolean {
    return Date.now() - this.lastUpdate < this.updateInterval
  }
}

// Exportar instancia singleton
export const weatherService = new WeatherService()
export default weatherService