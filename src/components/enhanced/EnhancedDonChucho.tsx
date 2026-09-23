import { useState, useEffect, useRef } from 'react'
import { pythonBackendService } from '../../services/pythonBackend'

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
  authenticity_score?: number
  local_approval?: string
}

// Alias para lenguaje más natural en la UI
type LocalPlace = Pautante

interface EnhancedDonChuchoProps {
  onFallback?: () => void
  onClose?: () => void
  existingComponent?: React.ReactNode
}

function EnhancedDonChucho({ onFallback, onClose, existingComponent }: EnhancedDonChuchoProps) {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [usePython, setUsePython] = useState(true)
  const [pythonStatus, setPythonStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [localPlaces, setLocalPlaces] = useState<LocalPlace[]>([])
  const [hasLocalPlaces, setHasLocalPlaces] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<LocalPlace[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, boolean>>({})
  const [qualityScores, setQualityScores] = useState<Record<string, number>>({})
  const [authenticPlaces, setAuthenticPlaces] = useState<LocalPlace[]>([])
  
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const onFallbackRef = useRef(onFallback)
  onFallbackRef.current = onFallback

  const goLocal = () => {
    if (onFallbackRef.current) {
      onFallbackRef.current()
      return
    }
    if (onClose) onClose()
  }

  useEffect(() => {
    let cancelled = false
    const checkPythonBackend = async () => {
      try {
        const health = await pythonBackendService.healthCheck()
        if (cancelled) return
        if (health && health.status === 'healthy') {
          setPythonStatus('online')
        } else {
          setPythonStatus('offline')
          setUsePython(false)
          onFallbackRef.current?.()
        }
      } catch (err) {
        if (cancelled) return
        console.warn('[EnhancedDonChucho] Backend no disponible:', err)
        setPythonStatus('offline')
        setUsePython(false)
        onFallbackRef.current?.()
      }
    }

    checkPythonBackend()

    // Inicializar síntesis de voz - Don Chucho propio
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        setAvailableVoices(voices)

        const spanishVoice = voices.find(voice =>
          voice.lang.includes('es') || voice.lang.includes('es-ES') || voice.lang.includes('es-CO')
        )
        if (spanishVoice) {
          setSelectedVoice(spanishVoice)
        } else if (voices.length > 0) {
          setSelectedVoice(voices[0])
        }
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      cancelled = true
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    setIsLoading(true)
    try {
      if (usePython && pythonStatus === 'online') {
        const result = await pythonBackendService.sendChatMessage(message)
        setResponse(result.response)
        setLocalPlaces(result.pautantes || [])
        setHasLocalPlaces(result.has_pautantes || false)
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              setUserLocation({ lat: latitude, lng: longitude })
              loadNearbyPautantes(latitude, longitude)
            },
            (error) => {
              console.log('Geolocation no disponible o denegada')
            }
          )
        }
        
        if (voiceEnabled && result.response) {
          speakResponse(result.response)
        }
        
        // Local Truth Engine: Verificar disponibilidad y calidad
        if (result.pautantes && result.pautantes.length > 0) {
          checkLocalPlacesTruth(result.pautantes)
        }
      } else {
        if (onFallback) {
          onFallback()
          return
        }
        setResponse('Estoy procesando tu solicitud con el sistema local. ¿En qué más puedo ayudarte?')
        setLocalPlaces([])
        setHasLocalPlaces(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setResponse('Hubo un error de conexión. Por favor intenta de nuevo.')
      setUsePython(false)
      setLocalPlaces([])
      setHasLocalPlaces(false)
    } finally {
      setIsLoading(false)
    }
  }

  const speakResponse = (text: string) => {
    if (!speechSynthRef.current || !voiceEnabled) return
    
    stopSpeaking()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    currentUtteranceRef.current = utterance
    speechSynthRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (isSpeaking) {
      stopSpeaking()
    }
  }

  const handleVoiceChange = (voiceIndex: number) => {
    if (availableVoices[voiceIndex]) {
      setSelectedVoice(availableVoices[voiceIndex])
    }
  }

  const checkLocalPlacesTruth = async (localPlacesList: LocalPlace[]) => {
    // Local Truth Engine: Verificar disponibilidad y calidad de cada lugar local
    for (const localPlace of localPlacesList) {
      if (localPlace.id) {
        // Verificar disponibilidad
        const availability = await pythonBackendService.checkAvailability(localPlace.id)
        if (availability.success && availability.is_available !== undefined) {
          setAvailabilityStatus(prev => ({...prev, [String(localPlace.id)]: availability.is_available!}))
        }
        
        // Verificar calidad
        const quality = await pythonBackendService.getQualityVerification(localPlace.id)
        if (quality.success && quality.quality_score) {
          setQualityScores(prev => ({...prev, [String(localPlace.id)]: quality.quality_score!}))
        }
      }
    }
    
    // Filtro de turistazas para la categoría (place.type -> clave backend)
    if (localPlacesList.length > 0) {
      const rawType = (localPlacesList[0].type || '').toLowerCase()
      const typeMap: Record<string, string> = {
        'alojamientos': 'accommodation',
        'camping': 'accommodation',
        'restaurantes': 'food',
        'restaurante bar': 'food',
        'cafés': 'food',
        'cafes': 'food',
        'coffee tours': 'coffee',
        'servicios': 'transport',
        'atractivos turísticos': 'nature',
        'atractivos turisticos': 'nature',
        'experiencias': 'nature',
        'eventos': 'events',
        'artesanías': 'shopping',
        'artesanias': 'shopping',
        'tiendas': 'shopping',
      }
      const category = typeMap[rawType] || rawType
      const filter = await pythonBackendService.getTouristTrapFilter(category)
      if (filter.authentic_places && filter.authentic_places.length > 0) {
        setAuthenticPlaces(filter.authentic_places as unknown as LocalPlace[])
      }
    }
  }

  const loadNearbyPautantes = async (lat: number, lng: number) => {
    try {
      const nearby = await pythonBackendService.getNearbyPautantes(lat, lng, 'all', 5)
      setNearbyPlaces(nearby.nearby_pautantes || [])
    } catch (error) {
      console.error('Error cargando nearby pautantes:', error)
    }
  }

  const handleWhatsApp = async (whatsapp: string, pautanteId?: number) => {
    if (whatsapp) {
      if (pautanteId) {
        const direct = await pythonBackendService.getWhatsAppDirect(pautanteId)
        if (direct.success && direct.whatsapp_url) {
          window.open(direct.whatsapp_url, '_blank')
          return
        }
      }
      window.open(`https://wa.me/${whatsapp}`, '_blank')
    }
  }

  const handleVoiceCommand = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'es-ES'
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setMessage(transcript)
      }
      recognition.start()
    } else {
      alert('Tu navegador no soporta comandos de voz')
    }
  }

  if (pythonStatus === 'offline' && existingComponent) {
    return <>{existingComponent}</>
  }

  return (
    <div className="enhanced-don-chucho">
      <div className="status-indicator">
        <span className={`status ${pythonStatus}`}>
          {pythonStatus === 'checking' ? 'Verificando...' :
           pythonStatus === 'online' ? 'Don Chucho IA Online' :
           'Don Chucho IA Offline'}
        </span>
        {pythonStatus === 'online' && <span className="zero-click-badge">Zero-Click Access</span>}
        {voiceEnabled && <span className="voice-badge">🔊 Voz Activa</span>}
        <button type="button" className="enhanced-close" onClick={() => (onClose ? onClose() : goLocal())} aria-label="Cerrar asistente">
          ✕
        </button>
      </div>

      {pythonStatus === 'offline' && (
        <div className="enhanced-offline-banner">
          <p>El asistente IA no está conectado. Puedes seguir con el asistente local de Don Chucho.</p>
          <button type="button" onClick={goLocal}>Usar asistente local</button>
        </div>
      )}
      
      <div className="chat-container">
        <div className="messages">
          {response && (
            <div className="message response">
              <strong>Don Chucho IA:</strong>
              <p style={{whiteSpace: 'pre-line'}}>{response}</p>
              
              {hasLocalPlaces && localPlaces.length > 0 && (
                <div className="local-places-results">
                  {localPlaces.map((localPlace, index) => (
                    <div key={index} className="local-place-card">
                      <div className="local-place-header">
                        <strong>{localPlace.name}</strong>
                        <span className="badge">{localPlace.type}</span>
                        {localPlace.distance_km && (
                          <span className="distance-badge">{localPlace.distance_km} km</span>
                        )}
                        {localPlace.id && availabilityStatus[String(localPlace.id)] !== undefined && (
                          <span className={`availability-badge ${availabilityStatus[String(localPlace.id)] ? 'available' : 'unavailable'}`}>
                            {availabilityStatus[String(localPlace.id)] ? '✓ Disponible' : '✗ Sin cupo'}
                          </span>
                        )}
                        {localPlace.id && qualityScores[String(localPlace.id)] && (
                          <span className="quality-badge">
                            ★ {qualityScores[String(localPlace.id)]}/100
                          </span>
                        )}
                      </div>
                      <p>{localPlace.description}</p>
                      <div className="local-place-actions">
                        <button 
                          onClick={() => handleWhatsApp(localPlace.contact.whatsapp!, localPlace.id)}
                          className="whatsapp-btn"
                        >
                          WhatsApp One-Tap
                        </button>
                        {localPlace.contact.phone && (
                          <a href={`tel:${localPlace.contact.phone}`} className="phone-btn">
                            Llamar
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {authenticPlaces.length > 0 && (
                <div className="authentic-places-section">
                  <h4>Lugares auténticos recomendados</h4>
                  {authenticPlaces.map((place, index) => (
                    <div key={index} className="authentic-place-item">
                      <strong>{place.name}</strong>
                      <span className="authenticity-badge">
                        {place.local_approval}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {nearbyPlaces.length > 0 && (
                <div className="nearby-section">
                  <h4>Servicios cercanos a ti:</h4>
                  {nearbyPlaces.slice(0, 3).map((place, index) => (
                    <div key={index} className="nearby-card">
                      <strong>{place.name}</strong>
                      <span className="nearby-distance">{place.distance_km} km</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="input-area">
          <button 
            onClick={handleVoiceCommand}
            className="voice-btn"
            title="Comando de voz"
          >
            🎤
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe o usa voz: hotel cerca, restaurante, etc..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className="send-btn"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
          
          <div className="voice-controls">
            <button 
              onClick={toggleVoice}
              className={`voice-toggle ${voiceEnabled ? 'enabled' : 'disabled'}`}
              title={voiceEnabled ? 'Voz activada' : 'Voz desactivada'}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
            
            {isSpeaking && (
              <button 
                onClick={stopSpeaking}
                className="stop-voice-btn"
                title="Detener voz"
              >
                ⏹️
              </button>
            )}
            
            {availableVoices.length > 1 && (
              <select 
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voiceIndex = availableVoices.findIndex(v => v.name === e.target.value)
                  if (voiceIndex >= 0) handleVoiceChange(voiceIndex)
                }}
                className="voice-selector"
              >
                {availableVoices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedDonChucho