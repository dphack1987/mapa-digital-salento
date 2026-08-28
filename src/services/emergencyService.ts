// Servicio de emergencia y seguridad para rutas turísticas
// Proporciona asistencia crítica en zonas sin señal

interface EmergencyContact {
  name: string
  phone: string
  whatsapp?: string
  type: 'police' | 'medical' | 'fire' | 'guide' | 'tourism'
  available24h: boolean
}

interface SafetyPoint {
  id: string
  name: string
  location: {
    lat: number
    lng: number
    description: string
  }
  services: string[]
  type: 'hydration' | 'control' | 'shelter' | 'medical'
}

interface EmergencyLocation {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number
  altitudeAccuracy?: number
  timestamp: number
}

class EmergencyService {
  private currentLocation: EmergencyLocation | null = null
  private isTracking = false

  // Contactos de emergencia para Salento
  private emergencyContacts: EmergencyContact[] = [
    {
      name: 'Policía de Salento',
      phone: '123',
      whatsapp: '573123456789',
      type: 'police',
      available24h: true
    },
    {
      name: 'Cruz Roja Salento',
      phone: '132',
      whatsapp: '573132456789',
      type: 'medical',
      available24h: true
    },
    {
      name: 'Bomberos Salento',
      phone: '119',
      whatsapp: '573119456789',
      type: 'fire',
      available24h: true
    },
    {
      name: 'Policía de Turismo',
      phone: '+57 300 555 5555',
      whatsapp: '573005555555',
      type: 'tourism',
      available24h: true
    },
    {
      name: 'Guías de Rescate Certificados',
      phone: '+57 300 888 8888',
      whatsapp: '573008888888',
      type: 'guide',
      available24h: true
    }
  ]

  // Puntos de seguridad en rutas del Valle de Cocora
  private safetyPoints: SafetyPoint[] = [
    {
      id: 'cocora-entrada',
      name: 'Entrada Principal Valle de Cocora',
      location: {
        lat: 4.6300,
        lng: -75.5500,
        description: 'Punto de control principal, acceso a parking y guías'
      },
      services: ['Control', 'Información', 'Parking', 'Guías'],
      type: 'control'
    },
    {
      id: 'cocora-hidratacion-1',
      name: 'Puesto de Hidratación - Sendero Principal',
      location: {
        lat: 4.6280,
        lng: -75.5450,
        description: 'Venta de agua y snacks, primer punto de descanso'
      },
      services: ['Hidratación', 'Snacks', 'Primeros auxilios básicos'],
      type: 'hydration'
    },
    {
      id: 'cocora-refugio',
      name: 'Refugio - Zona Bosque',
      location: {
        lat: 4.6250,
        lng: -75.5400,
        description: 'Zona de descanso cubierta, punto de encuentro'
      },
      services: ['Refugio', 'Señalización', 'Comunicación'],
      type: 'shelter'
    },
    {
      id: 'salento-centro',
      name: 'Centro de Salento - Hospital de campaña',
      location: {
        lat: 4.6371,
        lng: -75.5706,
        description: 'Punto de retorno seguro, acceso a servicios médicos'
      },
      services: ['Médico', 'Farmacia', 'Transporte', 'Comunicación'],
      type: 'medical'
    }
  ]

  /**
   * Obtener ubicación precisa del usuario
   */
  async getCurrentLocation(): Promise<EmergencyLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: EmergencyLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
            timestamp: Date.now()
          }
          this.currentLocation = location
          resolve(location)
        },
        (error) => {
          reject(new Error(`Error de geolocalización: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  /**
   * Iniciar seguimiento de ubicación
   */
  startLocationTracking(): void {
    if (!navigator.geolocation || this.isTracking) return

    this.isTracking = true
    navigator.geolocation.watchPosition(
      (position) => {
        this.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
          timestamp: Date.now()
        }
      },
      (error) => {
        console.error('Error tracking location:', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0
      }
    )
  }

  /**
   * Detener seguimiento de ubicación
   */
  stopLocationTracking(): void {
    this.isTracking = false
    // En una implementación completa, usaría navigator.geolocation.clearWatch()
  }

  /**
   * Generar mensaje de emergencia con ubicación
   */
  generateEmergencyMessage(emergencyType: 'medical' | 'police' | 'fire' | 'lost' = 'lost'): string {
    if (!this.currentLocation) {
      return '🆘 EMERGENCIA - Sin ubicación GPS. Por favor comparte tu ubicación manualmente.'
    }

    const { latitude, longitude, accuracy } = this.currentLocation
    const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    const accuracyText = `Precisión: ±${Math.round(accuracy)}m`
    const timestamp = new Date(this.currentLocation.timestamp).toLocaleTimeString()

    const messages = {
      medical: `🏥 EMERGENCIA MÉDICA
📍 Ubicación: ${coords}
${accuracyText}
🕐 Hora: ${timestamp}
🚶️ Necesito asistencia médica urgente.`,
      
      police: `👮 EMERGENCIA POLICIAL
📍 Ubicación: ${coords}
${accuracyText}
🕐 Hora: ${timestamp}
🚨 Necesito asistencia policial urgente.`,
      
      fire: `🔥 EMERGENCIA INCENDIO
📍 Ubicación: ${coords}
${accuracyText}
🕐 Hora: ${timestamp}
🆘 Hay un incendio en mi ubicación.`,
      
      lost: `🚶️ ESTO EXTRAVIADO
📍 Ubicación: ${coords}
${accuracyText}
🕐 Hora: ${timestamp}
👣 Necesito ayuda para encontrar el camino de retorno.`
    }

    return messages[emergencyType]
  }

  /**
   * Compartir ubicación por WhatsApp
   */
  shareLocationWhatsApp(emergencyType: 'medical' | 'police' | 'fire' | 'lost' = 'lost'): void {
    const message = this.generateEmergencyMessage(emergencyType)
    const whatsappUrl = `https://wa.me/573123456789?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  /**
   * Compartir ubicación por SMS (si disponible)
   */
  shareLocationSMS(emergencyType: 'medical' | 'police' | 'fire' | 'lost' = 'lost'): void {
    const message = this.generateEmergencyMessage(emergencyType)
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`
    window.open(smsUrl, '_self')
  }

  /**
   * Obtener contactos de emergencia
   */
  getEmergencyContacts(): EmergencyContact[] {
    return this.emergencyContacts
  }

  /**
   * Obtener contacto específico por tipo
   */
  getEmergencyContactByType(type: 'police' | 'medical' | 'fire' | 'guide' | 'tourism'): EmergencyContact | undefined {
    return this.emergencyContacts.find(contact => contact.type === type)
  }

  /**
   * Llamar a contacto de emergencia
   */
  callEmergencyContact(type: 'police' | 'medical' | 'fire' | 'guide' | 'tourism'): void {
    const contact = this.getEmergencyContactByType(type)
    if (contact) {
      window.location.href = `tel:${contact.phone}`
    }
  }

  /**
   * Obtener puntos de seguridad cercanos
   */
  getNearbySafetyPoints(): SafetyPoint[] {
    if (!this.currentLocation) {
      return this.safetyPoints
    }

    // En una implementación completa, calcularía distancia y ordenar
    return this.safetyPoints
  }

  /**
   * Obtener punto de seguridad más cercano
   */
  getNearestSafetyPoint(): SafetyPoint | null {
    const points = this.getNearbySafetyPoints()
    if (points.length === 0) return null

    // En implementación completa, usaría fórmula de Haversine para distancia
    return points[0] // Por ahora retorna el primero
  }

  /**
   * Generar enlace de Google Maps con ubicación
   */
  generateGoogleMapsLink(): string {
    if (!this.currentLocation) {
      return 'https://maps.google.com/'
    }

    const { latitude, longitude } = this.currentLocation
    return `https://maps.google.com/?q=${latitude},${longitude}`
  }

  /**
   * Generar coordenadas para compartir
   */
  getCoordinatesForSharing(): string {
    if (!this.currentLocation) {
      return 'Ubicación no disponible'
    }

    const { latitude, longitude, accuracy } = this.currentLocation
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`
  }

  /**
   * Verificar si hay GPS disponible
   */
  isGPSSupported(): boolean {
    return 'geolocation' in navigator
  }

  /**
   * Verificar precisión de ubicación actual
   */
  getLocationAccuracy(): string {
    if (!this.currentLocation) {
      return 'No disponible'
    }

    const { accuracy } = this.currentLocation
    if (accuracy < 10) return 'Alta (<10m)'
    if (accuracy < 50) return 'Media (<50m)'
    if (accuracy < 100) return 'Baja (<100m)'
    return 'Muy baja (>100m)'
  }

  /**
   * Consejos de seguridad para rutas específicas
   */
  getSafetyAdvice(route: 'cocora' | 'cascada' | 'senderos'): string[] {
    const advice = {
      cocora: [
        'Sal temprano (antes de 8am) para evitar multitudes',
        'Llevar al menos 2L de agua por persona',
        'Usar protector solar y sombrero',
        'Usar calzado con buen agarre',
        'No separarse del grupo',
        'Informar a alguien tu ruta',
        'Evitar horas pico (10am-2pm)',
        'Tener batería de celular cargada'
      ],
      cascada: [
        'Usar calzado antideslizante',
        'No bajar si está lloviendo',
        'Caminar por senderos marcados',
        'Llevar bastón o caminante',
        'Informar hora de retorno',
        'Tener celular con batería',
        'Evitar horas de mayor flujo'
      ],
      senderos: [
        'Informar ruta específica',
        'Llevar mapa offline como respaldo',
        'Llevar suficiente agua',
        'Vestir apropiadamente',
        'Tener luz de emergencia',
        'Compartir ubicación con alguien',
        'Evitar senderos no señalizados'
      ]
    }

    return advice[route] || []
  }
}

// Exportar instancia singleton
export const emergencyService = new EmergencyService()
export default emergencyService