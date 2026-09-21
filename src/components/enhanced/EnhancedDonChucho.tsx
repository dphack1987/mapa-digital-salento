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

interface EnhancedDonChuchoProps {
  onFallback?: () => void
  existingComponent?: React.ReactNode
}

function EnhancedDonChucho({ onFallback, existingComponent }: EnhancedDonChuchoProps) {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [usePython, setUsePython] = useState(true)
  const [pythonStatus, setPythonStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [pautantes, setPautantes] = useState<Pautante[]>([])
  const [hasPautantes, setHasPautantes] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null)
  const [nearbyPautantes, setNearbyPautantes] = useState<Pautante[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, boolean>>({})
  const [qualityScores, setQualityScores] = useState<Record<string, number>>({})
  const [authenticPlaces, setAuthenticPlaces] = useState<Pautante[]>([])
  
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const checkPythonBackend = async () => {
      const health = await pythonBackendService.healthCheck()
      if (health && health.status === 'healthy') {
        setPythonStatus('online')
      } else {
        setPythonStatus('offline')
        setUsePython(false)
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
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    setIsLoading(true)
    try {
      if (usePython && pythonStatus === 'online') {
        const result = await pythonBackendService.sendChatMessage(message)
        setResponse(result.response)
        setPautantes(result.pautantes || [])
        setHasPautantes(result.has_pautantes || false)
        
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
          checkPautantesTruth(result.pautantes)
        }
      } else {
        if (onFallback) {
          onFallback()
        }
        setResponse('Usando sistema existente de Don Chucho')
        setPautantes([])
        setHasPautantes(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setResponse('Error de conexión, usando sistema local')
      setUsePython(false)
      setPautantes([])
      setHasPautantes(false)
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

  const checkPautantesTruth = async (pautantesList: Pautante[]) => {
    // Local Truth Engine: Verificar disponibilidad y calidad de cada pautante
    for (const pautante of pautantesList) {
      if (pautante.id) {
        // Verificar disponibilidad
        const availability = await pythonBackendService.checkAvailability(pautante.id)
        if (availability.success && availability.is_available !== undefined) {
          setAvailabilityStatus(prev => ({...prev, [String(pautante.id)]: availability.is_available!}))
        }
        
        // Verificar calidad
        const quality = await pythonBackendService.getQualityVerification(pautante.id)
        if (quality.success && quality.quality_score) {
          setQualityScores(prev => ({...prev, [String(pautante.id)]: quality.quality_score!}))
        }
      }
    }
    
    // Filtro de turistazas para la categoría
    if (pautantesList.length > 0) {
      const category = pautantesList[0].type.toLowerCase()
      const filter = await pythonBackendService.getTouristTrapFilter(category)
      if (filter.authentic_places && filter.authentic_places.length > 0) {
        setAuthenticPlaces(filter.authentic_places as unknown as Pautante[])
      }
    }
  }

  const loadNearbyPautantes = async (lat: number, lng: number) => {
    try {
      const nearby = await pythonBackendService.getNearbyPautantes(lat, lng, 'all', 0.5)
      setNearbyPautantes(nearby.nearby_pautantes || [])
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
      </div>
      
      <div className="chat-container">
        <div className="messages">
          {response && (
            <div className="message response">
              <strong>Don Chucho IA:</strong>
              <p style={{whiteSpace: 'pre-line'}}>{response}</p>
              
              {hasPautantes && pautantes.length > 0 && (
                <div className="pautantes-results">
                  {pautantes.map((pautante, index) => (
                    <div key={index} className="pautante-card">
                      <div className="pautante-header">
                        <strong>{pautante.name}</strong>
                        <span className="badge">{pautante.type}</span>
                        {pautante.distance_km && (
                          <span className="distance-badge">{pautante.distance_km} km</span>
                        )}
                        {pautante.id && availabilityStatus[String(pautante.id)] !== undefined && (
                          <span className={`availability-badge ${availabilityStatus[String(pautante.id)] ? 'available' : 'unavailable'}`}>
                            {availabilityStatus[String(pautante.id)] ? '✓ Disponible' : '✗ Sin cupo'}
                          </span>
                        )}
                        {pautante.id && qualityScores[String(pautante.id)] && (
                          <span className="quality-badge">
                            ★ {qualityScores[String(pautante.id)]}/100
                          </span>
                        )}
                      </div>
                      <p>{pautante.description}</p>
                      <div className="pautante-actions">
                        <button 
                          onClick={() => handleWhatsApp(pautante.contact.whatsapp!, pautante.id)}
                          className="whatsapp-btn"
                        >
                          WhatsApp One-Tap
                        </button>
                        {pautante.contact.phone && (
                          <a href={`tel:${pautante.contact.phone}`} className="phone-btn">
                            Llamar
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {authenticPlaces.length > 0 && (
                <div className="authentic-section">
                  <h4>Lugares auténticos recomendados por locales:</h4>
                  {authenticPlaces.slice(0, 3).map((place, index) => (
                    <div key={index} className="authentic-card">
                      <strong>{place.name}</strong>
                      {place.authenticity_score && (
                        <span className="authenticity-score">
                          Autenticidad: {place.authenticity_score}%
                        </span>
                      )}
                      {place.local_approval && (
                        <span className="local-approval">✓ Aprobado por locales</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {nearbyPautantes.length > 0 && (
                <div className="nearby-section">
                  <h4>Servicios cercanos a ti:</h4>
                  {nearbyPautantes.slice(0, 3).map((pautante, index) => (
                    <div key={index} className="nearby-card">
                      <strong>{pautante.name}</strong>
                      <span className="nearby-distance">{pautante.distance_km} km</span>
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