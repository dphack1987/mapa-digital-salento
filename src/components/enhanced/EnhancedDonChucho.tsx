import { useState, useEffect, useRef } from 'react'
import { pythonBackendService } from '../../services/pythonBackend'
import { getOsirisResponse, getTourismResponse, isTourismQuery, getPredictiveResponse, isPredictiveQuery } from '../../services/donChuchoOsiris'
import { searchLocalKnowledge } from '../../services/donChuchoKnowledge'
import type { Language } from '../../types'

const SPEECH_LOCALES: Record<Language, string> = {
  es: 'es-CO', en: 'en-US', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR', it: 'it-IT', zh: 'zh-CN',
  ja: 'ja-JP', ko: 'ko-KR', th: 'th-TH', vi: 'vi-VN', id: 'id-ID', ms: 'ms-MY', 'en-gb': 'en-GB'
}

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
  language: Language
  t: (key: string, fallback?: string) => string
  onFallback?: () => void
  onClose?: () => void
  existingComponent?: React.ReactNode
}

function EnhancedDonChucho({ language, t, onFallback, onClose, existingComponent }: EnhancedDonChuchoProps) {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState(() => t('donChucho.welcome', '¡Hola! Soy Don Chucho, arriero quindiano y tu guía local especializado en Salento. ¿Qué quieres descubrir?'))
  const [isLoading, setIsLoading] = useState(false)
  const [usePython, setUsePython] = useState(false) // Iniciamos en false para usar local primero
  const [pythonStatus, setPythonStatus] = useState<'online' | 'offline'>('offline')
  const [isDeviceOffline, setIsDeviceOffline] = useState(!navigator.onLine)
  const [offlineNoticeDismissed, setOfflineNoticeDismissed] = useState(false)
  const [localPlaces, setLocalPlaces] = useState<LocalPlace[]>([])
  const [hasLocalPlaces, setHasLocalPlaces] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<LocalPlace[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceNotice, setVoiceNotice] = useState('')
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, boolean>>({})
  const [qualityScores, setQualityScores] = useState<Record<string, number>>({})
  const [authenticPlaces, setAuthenticPlaces] = useState<LocalPlace[]>([])
  
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const onFallbackRef = useRef(onFallback)
  onFallbackRef.current = onFallback
  const knowledgeLanguage: Exclude<Language, 'zh'> = language === 'zh' ? 'en' : language
  // Selección de voces compatible con locales como `en-gb` (cuyo prefijo de
  // idioma base es `en`), evitando depender de `${language}-`.
  const speechLocale = SPEECH_LOCALES[language].toLowerCase()
  const speechBase = speechLocale.split('-')[0]
  const languageVoices = availableVoices.filter(voice => {
    const v = voice.lang.toLowerCase().replace('_', '-')
    return v === speechLocale || v === speechBase || v.startsWith(`${speechBase}-`)
  })
  const visibleVoiceNotice = voiceNotice || (availableVoices.length > 0 && languageVoices.length === 0
    ? t('donChucho.voiceNotInstalled', 'No speech voice is installed for the selected language on this device.')
    : '')

  const goLocal = () => {
    if (onFallbackRef.current) {
      onFallbackRef.current()
      return
    }
    if (onClose) onClose()
  }

  useEffect(() => {
    // Intentar verificar backend Python en background, pero no bloquear
    const checkPythonBackend = async () => {
      try {
        const health = await pythonBackendService.healthCheck()
        if (health && health.status === 'healthy') {
          setPythonStatus('online')
          setUsePython(true)
        } else {
          setPythonStatus('offline')
        }
      } catch {
        setPythonStatus('offline')
      }
    }

    checkPythonBackend()
  }, [])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const speechSynth = window.speechSynthesis
    speechSynthRef.current = speechSynth

    const loadVoices = () => {
      const voices = speechSynth.getVoices()
      const preferredLocale = SPEECH_LOCALES[language].toLowerCase()
      const preferredBase = preferredLocale.split('-')[0]
      const preferredVoice = voices.find(voice => voice.lang.toLowerCase().replace('_', '-') === preferredLocale)
        || voices.find(voice => voice.lang.toLowerCase().replace('_', '-').startsWith(`${preferredBase}-`))
      setAvailableVoices(voices)
      setSelectedVoice(preferredVoice || null)
      setVoiceNotice('')
    }

    loadVoices()
    speechSynth.addEventListener('voiceschanged', loadVoices)

    return () => speechSynth.removeEventListener('voiceschanged', loadVoices)
  }, [language])

  useEffect(() => {
    // Desplaza el área de mensajes al final para que la última respuesta
    // no quede cortada en la parte inferior de la ventana.
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [response, isLoading, localPlaces, nearbyPlaces, authenticPlaces])

  useEffect(() => {
    const handleOnline = () => {
      setIsDeviceOffline(false)
      setOfflineNoticeDismissed(false)
    }
    const handleOffline = () => {
      setIsDeviceOffline(true)
      setOfflineNoticeDismissed(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = message.trim()
    setIsLoading(true)
    try {
      // 1. Primero intentar respuesta predictiva (Fase 3) - Máxima prioridad
      if (language !== 'zh' && isPredictiveQuery(userMessage)) {
        const predictiveResponse = await getPredictiveResponse(userMessage, language)
        if (predictiveResponse) {
          setResponse(predictiveResponse)
          setLocalPlaces([])
          setHasLocalPlaces(false)
          setMessage('')

          if (voiceEnabled && predictiveResponse) {
            speakResponse(predictiveResponse)
          }
          setIsLoading(false)
          return
        }
      }

      // 2. Segundo, intentar respuesta turística mejorada (Fase 2)
      if (language !== 'zh' && isTourismQuery(userMessage)) {
        const tourismResponse = await getTourismResponse(userMessage, language)
        if (tourismResponse) {
          setResponse(tourismResponse)
          setLocalPlaces([])
          setHasLocalPlaces(false)
          setMessage('')

          if (voiceEnabled && tourismResponse) {
            speakResponse(tourismResponse)
          }
          setIsLoading(false)
          return
        }
      }

      // 3. Tercero, intentar respuesta OSIRIS estándar (Fase 1)
      const osirisResponse = language === 'zh' ? null : await getOsirisResponse(userMessage, language)
      if (osirisResponse) {
        setResponse(osirisResponse)
        setLocalPlaces([])
        setHasLocalPlaces(false)
        setMessage('')

        if (voiceEnabled && osirisResponse) {
          speakResponse(osirisResponse)
        }
        setIsLoading(false)
        return
      }

      // 4. Cuarto, usar base de conocimiento local como fallback principal
      const localKnowledge = searchLocalKnowledge(userMessage, knowledgeLanguage)
      if (localKnowledge) {
        const localAnswer = language === 'zh'
          ? localKnowledge.answer.zh
          : localKnowledge.answer[knowledgeLanguage] || localKnowledge.answer.es
        if (!localAnswer && language !== 'zh') return
        const answerText = localAnswer || t('donChucho.zhKnowledgeFallback', '这个主题暂时没有经过核实的中文离线答复。你可以询问萨伦托的交通、住宿、咖啡或科科拉山谷。')
        setResponse(answerText)
        setLocalPlaces([])
        setHasLocalPlaces(false)
        setMessage('')

        if (voiceEnabled && answerText) {
          speakResponse(answerText)
        }
        setIsLoading(false)
        return
      }

      if (language === 'zh') {
        const fallback = t('donChucho.zhKnowledgeFallback', '这个主题暂时没有经过核实的中文离线答复。你可以询问萨伦托的交通、住宿、咖啡或科科拉山谷。')
        setResponse(fallback)
        setLocalPlaces([])
        setHasLocalPlaces(false)
        setMessage('')
        if (voiceEnabled) speakResponse(fallback)
        return
      }

      // 5. Si todo falla, usar backend Python si está disponible
      if (usePython && pythonStatus === 'online') {
        const result = await pythonBackendService.sendChatMessage(userMessage)
        setResponse(result.response)
        setLocalPlaces(result.pautantes || [])
        setHasLocalPlaces(result.has_pautantes || false)
        setMessage('')
        
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
        // Fallback final: respuesta genérica del sistema local
        setResponse(t('donChucho.localFallback', 'Soy Don Chucho, arriero quindiano y tu guía de Salento. Puedo ayudarte con el Valle de Cocora, transporte, café, cultura y planes locales. ¿Qué quieres descubrir?'))
        setLocalPlaces([])
        setHasLocalPlaces(false)
        setMessage('')
      }
    } catch (error) {
      console.error('Error:', error)
      // Fallback a respuesta local en caso de error
      setResponse(t('donChucho.errorFallback', 'No pude completar esa consulta. Puedes intentarlo de nuevo o preguntarme por la guía local de Salento.'))
      setLocalPlaces([])
      setHasLocalPlaces(false)
      setMessage('')
    } finally {
      setIsLoading(false)
    }
  }

  const speakResponse = (text: string) => {
    if (!speechSynthRef.current || !voiceEnabled) return
    
    stopSpeaking()
    const voiceForSpeech = selectedVoice || languageVoices[0] || null

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = voiceForSpeech?.lang || SPEECH_LOCALES[language]
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    if (voiceForSpeech) {
      setVoiceNotice('')
      utterance.voice = voiceForSpeech
    } else {
      // Sin una voz específica instalada: se usa la voz por defecto del
      // navegador con el idioma solicitado, e informamos al usuario.
      setVoiceNotice(t('donChucho.voiceNotInstalled', 'No speech voice is installed for the selected language on this device.'))
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
      setVoiceNotice('')
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
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert(t('donChucho.voiceUnsupported', 'Voice input is not available in this browser.'))
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = SPEECH_LOCALES[language]
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setMessage(transcript)
    }
    recognition.start()
  }

  if (pythonStatus === 'offline' && existingComponent) {
    return <>{existingComponent}</>
  }

  return (
    <div className="enhanced-don-chucho">
      <div className="status-indicator">
        <span className={`status ${pythonStatus}`}>
           {pythonStatus === 'online' ? t('donChucho.onlineStatus', 'Don Chucho IA Online') :
           isDeviceOffline ? t('donChucho.offlineStatus', 'Don Chucho · Modo offline') : t('donChucho.subtitle', 'Tu guía local')}
        </span>
        {pythonStatus === 'online' && <span className="zero-click-badge">Zero-Click Access</span>}
          {voiceEnabled && <span className="voice-badge">🔊 {t('donChucho.voiceActive', 'Voz activa')}</span>}
          <button type="button" className="enhanced-close" onClick={() => (onClose ? onClose() : goLocal())} aria-label={t('donChucho.closeAssistant', 'Cerrar asistente')}>
          ✕
        </button>
      </div>

      {isDeviceOffline && !offlineNoticeDismissed && (
        <div className="enhanced-offline-banner">
          <p>{t('donChucho.offlineMessage', 'Modo offline activo. Don Chucho sigue disponible con la guía local de Salento; las consultas en tiempo real se actualizarán al recuperar la conexión.')}</p>
          <button type="button" onClick={() => setOfflineNoticeDismissed(true)}>{t('donChucho.offlineContinue', 'Continuar sin conexión')}</button>
        </div>
      )}
      
      <div className="chat-container">
        <div className="messages" ref={messagesRef} aria-live="polite" role="log">
          {response && (
            <div className="message response">
              <strong>{t('donChucho.title', 'Don Chucho')}:</strong>
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
                        {localPlace.contact.whatsapp && (
                          <button
                            onClick={() => handleWhatsApp(localPlace.contact.whatsapp!, localPlace.id)}
                            className="whatsapp-btn"
                          >
                            WhatsApp One-Tap
                          </button>
                        )}
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
            title={t('donChucho.voiceCommand', 'Voice input')}
          >
            🎤
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('donChucho.placeholder', 'Ask Don Chucho...')}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className="send-btn"
          >
            {isLoading ? '...' : t('donChucho.sendQuestion', 'Send question')}
          </button>
          
          <div className="voice-controls">
            <button 
              onClick={toggleVoice}
              className={`voice-toggle ${voiceEnabled ? 'enabled' : 'disabled'}`}
              title={voiceEnabled ? t('donChucho.voiceEnabled', 'Read-aloud enabled') : t('donChucho.voiceDisabled', 'Read-aloud disabled')}
              aria-label={voiceEnabled ? t('donChucho.voiceEnabled', 'Read-aloud enabled') : t('donChucho.voiceDisabled', 'Read-aloud disabled')}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
            
            {isSpeaking && (
              <button 
                onClick={stopSpeaking}
                className="stop-voice-btn"
                title={t('donChucho.stopVoice', 'Stop speaking')}
                aria-label={t('donChucho.stopVoice', 'Stop speaking')}
              >
                ⏹️
              </button>
            )}
            
            {availableVoices.length > 1 && (
              <select 
                value={selectedVoice?.name || ''}
                aria-label={t('donChucho.selectVoice', 'Select voice')}
                onChange={(e) => {
                  const voiceIndex = availableVoices.findIndex(v => v.name === e.target.value)
                  if (voiceIndex >= 0) handleVoiceChange(voiceIndex)
                }}
                className="voice-selector"
              >
                {availableVoices.map((voice, index) => (
                  <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            )}
          </div>
          {visibleVoiceNotice && <small className="voice-notice" role="status">{visibleVoiceNotice}</small>}
        </div>
      </div>
    </div>
  )
}

export default EnhancedDonChucho