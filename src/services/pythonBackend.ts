const configuredUrl = import.meta.env.VITE_PYTHON_API_URL as string | undefined
const isDev = import.meta.env.DEV === true || import.meta.env.MODE === 'development'
const isLocalhost = !configuredUrl || /localhost|127\.0\.0\.1/i.test(configuredUrl)
// Solo intenta el backend FastAPI si hay URL real de prod, o en dev local
const PYTHON_API_URL = configuredUrl && !(isLocalhost && !isDev)
  ? configuredUrl
  : ''
const BACKEND_ENABLED = Boolean(PYTHON_API_URL)

interface Pautante {
  name: string
  type: string
  description: string
  contact: {
    phone?: string
    whatsapp?: string
    email?: string
    website?: string
  }
  is_partner: boolean
  id?: number
  distance_km?: number
}

interface ChatMessage {
  message: string
  user_id?: string
}

interface ChatResponse {
  response: string
  intent: string
  confidence: number
  suggestions: string[]
  pautantes: Pautante[]
  has_pautantes: boolean
  whatsapp_direct: boolean
}

interface WhatsAppDirectResponse {
  success: boolean
  whatsapp_url?: string
  pautante_name?: string
  message?: string
  error?: string
}

interface NearbyPautantesResponse {
  nearby_pautantes: Pautante[]
  user_location: { lat: number; lng: number }
  radius_km: number
}

interface AvailabilityResponse {
  success: boolean
  pautante_id?: number
  pautante_name?: string
  is_available?: boolean
  last_checked?: string
  message?: string
  error?: string
}

interface QualityVerificationResponse {
  success: boolean
  pautante_id?: number
  pautante_name?: string
  quality_score?: number
  verification_method?: string
  verified_by?: string
  verification_date?: string
  criteria?: {
    service_quality: string
    authenticity: string
    local_reputation: string
    safety_standards: string
  }
  error?: string
}

interface TouristTrapFilterResponse {
  category: string
  authentic_places: Array<{
    name: string
    type: string
    authenticity_score: number
    local_approval: string
  }>
  tourist_traps_filtered: number
  filter_criteria: string
}

class PythonBackendService {
  private baseUrl: string
  readonly enabled: boolean

  constructor(baseUrl: string = PYTHON_API_URL) {
    this.baseUrl = baseUrl
    this.enabled = BACKEND_ENABLED && Boolean(baseUrl)
  }

  async healthCheck(): Promise<any> {
    if (!this.enabled) return null
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
          ? AbortSignal.timeout(3000)
          : undefined
      })
      if (!response.ok) return null
      return await response.json()
    } catch {
      // Backend local ausente en prod/esperado: fallback silencioso
      return null
    }
  }
  
  async sendChatMessage(message: string, userId?: string): Promise<ChatResponse> {
    if (!this.enabled) return this.getFallbackResponse(message)
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, user_id: userId })
      })

      if (!response.ok) {
        throw new Error('Error en backend Python')
      }

      return response.json()
    } catch {
      return this.getFallbackResponse(message)
    }
  }

  async getWhatsAppDirect(pautanteId: number): Promise<WhatsAppDirectResponse> {
    if (!this.enabled) return { success: false, error: 'Backend no disponible' }
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/pautantes/whatsapp-direct?pautante_id=${pautanteId}`)
      if (!response.ok) {
        throw new Error('Error en WhatsApp directo')
      }
      return response.json()
    } catch {
      return { success: false, error: 'Error de conexión' }
    }
  }

  async getNearbyPautantes(lat: number, lng: number, category: string = 'all', radius: number = 0.5): Promise<NearbyPautantesResponse> {
    if (!this.enabled) return { nearby_pautantes: [], user_location: { lat, lng }, radius_km: radius }
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/pautantes/nearby?lat=${lat}&lng=${lng}&category=${category}&radius=${radius}`)
      if (!response.ok) {
        throw new Error('Error en nearby pautantes')
      }
      return response.json()
    } catch {
      return { nearby_pautantes: [], user_location: { lat, lng }, radius_km: radius }
    }
  }

  async checkAvailability(pautanteId: number): Promise<AvailabilityResponse> {
    if (!this.enabled) return { success: false, error: 'Backend no disponible' }
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/pautantes/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pautante_id: pautanteId })
      })
      if (!response.ok) {
        throw new Error('Error en disponibilidad')
      }
      return response.json()
    } catch {
      return { success: false, error: 'Error de conexión' }
    }
  }

  async getQualityVerification(pautanteId: number): Promise<QualityVerificationResponse> {
    if (!this.enabled) return { success: false, error: 'Backend no disponible' }
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/pautantes/quality-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pautante_id: pautanteId })
      })
      if (!response.ok) {
        throw new Error('Error en verificación de calidad')
      }
      return response.json()
    } catch {
      return { success: false, error: 'Error de conexión' }
    }
  }

  async getTouristTrapFilter(category: string): Promise<TouristTrapFilterResponse> {
    if (!this.enabled) {
      return {
        category,
        authentic_places: [],
        tourist_traps_filtered: 0,
        filter_criteria: 'local',
      }
    }
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/pautantes/tourist-trap-filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      })
      if (!response.ok) {
        throw new Error('Error en filtro de turistazas')
      }
      return response.json()
    } catch {
      return {
        category,
        authentic_places: [],
        tourist_traps_filtered: 0,
        filter_criteria: 'error',
      }
    }
  }
  
  private getFallbackResponse(message: string): ChatResponse {
    return {
      response: "Estoy procesando tu solicitud con el sistema local. ¿En qué más puedo ayudarte?",
      intent: "general",
      confidence: 0.5,
      suggestions: ["hoteles", "restaurantes"],
      pautantes: [],
      has_pautantes: false,
      whatsapp_direct: false
    }
  }
}

export const pythonBackendService = new PythonBackendService()