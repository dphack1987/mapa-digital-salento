import { useState, useEffect, useRef } from 'react'
import { pythonBackendService } from '../../services/pythonBackend'
import { getOsirisResponse } from '../../services/donChuchoOsiris'
import { answerDonChucho } from '../../services/donChuchoBrain'
import { localizedSuggestions, weatherSuggestions, christmasSuggestions } from '../../services/donChuchoNlu'
import { isChristmasSeason } from '../../utils/season'
import type { KnowledgeItem } from '../../services/donChuchoKnowledge'
import { SPEECH_LOCALES, pickVoiceForLang, sanitizeSpeechText, isLikelyMaleVoice } from '../VoiceInput'
import type { Language, Place } from '../../types'

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

type LocalPlace = Pautante

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  text: string
  places?: LocalPlace[]
  authentic?: LocalPlace[]
  nearby?: LocalPlace[]
  suggestions?: string[]
  source?: string
}

interface EnhancedDonChuchoProps {
  language: Language
  t: (key: string, fallback?: string) => string
  places?: Place[]
  onFallback?: () => void
  onClose?: () => void
  existingComponent?: React.ReactNode
}

function toLocalPlace(place: Place): LocalPlace {
  return {
    name: place.name,
    type: place.type,
    description: place.description,
    contact: {
      phone: place.contact?.phone,
      whatsapp: place.contact?.whatsapp,
      email: place.contact?.email,
      website: place.contact?.website
    },
    is_partner: Boolean(place.isPautante),
    id: place.id,
    local_approval: place.verified ? 'Verificado' : undefined
  }
}

function splitForSpeech(text: string, maxLength = 180): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/)
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if (`${current} ${sentence}`.trim().length <= maxLength) {
      current = `${current} ${sentence}`.trim()
      continue
    }
    if (current) chunks.push(current)
    if (sentence.length <= maxLength) {
      current = sentence
      continue
    }
    let part = ''
    for (const word of sentence.split(' ')) {
      if (`${part} ${word}`.trim().length <= maxLength) {
        part = `${part} ${word}`.trim()
      } else {
        if (part) chunks.push(part)
        part = word
      }
    }
    current = part
  }

  if (current) chunks.push(current)
  return chunks.filter(Boolean)
}

function EnhancedDonChucho({ language, t, places, onFallback, onClose, existingComponent }: EnhancedDonChuchoProps) {
  const christmas = isChristmasSeason()
  const welcomeText = christmas
    ? t('donChucho.welcomeChristmas', '¡Felices fiestas! Soy Don Chucho, arriero quindiano y tu guía local en Salento. En diciembre el pueblo brilla: posadas, mercados navideños, buñuelos y el Valle de Cocora. ¿Qué plan navideño armamos?')
    : t('donChucho.welcome', '¡Hola! Soy Don Chucho, arriero quindiano y tu guía local especializado en Salento. Puedo orientarte sobre el Valle de Cocora, los caminos, el café, la cultura y lo práctico para tu visita. ¿Qué quieres descubrir?')
  const initialSuggestions = christmas
    ? christmasSuggestions(language)
    : localizedSuggestions('general', language)

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 0,
    role: 'assistant',
    text: welcomeText,
    suggestions: initialSuggestions,
    source: 'welcome'
  }])
  const [suggestions, setSuggestions] = useState<string[]>(() => initialSuggestions)
  const [isLoading, setIsLoading] = useState(false)
  const [usePython, setUsePython] = useState(false)
  const [pythonStatus, setPythonStatus] = useState<'online' | 'offline'>('offline')
  const [isDeviceOffline, setIsDeviceOffline] = useState(!navigator.onLine)
  const [offlineNoticeDismissed, setOfflineNoticeDismissed] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceNotice, setVoiceNotice] = useState('')
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, boolean>>({})
  const [qualityScores, setQualityScores] = useState<Record<string, number>>({})
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')

  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const recognitionRef = useRef<any>(null)
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const messageIdRef = useRef(1)
  const lastItemRef = useRef<KnowledgeItem | null>(null)
  const onFallbackRef = useRef(onFallback)
  onFallbackRef.current = onFallback
  const lastSpokenFollowUpRef = useRef<Record<string, string>>({})

  const speechLocale = SPEECH_LOCALES[language].toLowerCase()
  const speechBase = speechLocale.split('-')[0]
  const languageVoices = availableVoices.filter(voice => {
    const voiceLang = voice.lang.toLowerCase().replace('_', '-')
    return voiceLang === speechLocale || voiceLang === speechBase || voiceLang.startsWith(`${speechBase}-`)
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

    void checkPythonBackend()
  }, [])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const speechSynth = window.speechSynthesis
    speechSynthRef.current = speechSynth

    const loadVoices = () => {
      const voices = speechSynth.getVoices()
      const preferredVoice = pickVoiceForLang(voices, SPEECH_LOCALES[language])
      setAvailableVoices(voices)
      setSelectedVoice(preferredVoice)
      setVoiceNotice('')
    }

    loadVoices()
    speechSynth.addEventListener('voiceschanged', loadVoices)

    return () => speechSynth.removeEventListener('voiceschanged', loadVoices)
  }, [language])

  useEffect(() => {
    const el = messagesRef.current
    if (!el) return
    const last = el.lastElementChild as HTMLElement | null
    if (last && last.classList.contains('assistant') && last.querySelector('.local-place-card')) {
      el.scrollTop = Math.max(0, last.offsetTop - 8)
      return
    }
    el.scrollTop = el.scrollHeight
  }, [messages, isLoading, interimText])

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

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 0) {
        return [{ ...prev[0], text: welcomeText }]
      }
      return prev
    })
    setSuggestions(prev => (prev.length === 3 && messages.length === 1 ? initialSuggestions : prev))
  }, [language])

  useEffect(() => () => {
    speechSynthRef.current?.cancel()
    recognitionRef.current?.abort?.()
  }, [])

  const addMessage = (payload: Omit<ChatMessage, 'id'>): number => {
    const id = messageIdRef.current
    messageIdRef.current += 1
    setMessages(prev => [...prev, { ...payload, id }])
    return id
  }

  const updateMessage = (id: number, payload: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(item => (item.id === id ? { ...item, ...payload } : item)))
  }

  const resolveVoice = (): SpeechSynthesisVoice | null =>
    selectedVoice || pickVoiceForLang(availableVoices, SPEECH_LOCALES[language]) || languageVoices[0] || null

  const stopSpeaking = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const speakResponse = (text: string) => {
    if (!speechSynthRef.current || !voiceEnabled) return

    const cleanText = sanitizeSpeechText(text, SPEECH_LOCALES[language])
    if (!cleanText) return

    stopSpeaking()
    const voiceForSpeech = resolveVoice()
    const chunks = splitForSpeech(cleanText)

    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.lang = voiceForSpeech?.lang || SPEECH_LOCALES[language]
      utterance.rate = 0.92
      utterance.pitch = voiceForSpeech && !isLikelyMaleVoice(voiceForSpeech) ? 0.8 : 1.0
      utterance.volume = 1.0

      if (voiceForSpeech) {
        setVoiceNotice('')
        utterance.voice = voiceForSpeech
      } else {
        setVoiceNotice(t('donChucho.voiceNotInstalled', 'No speech voice is installed for the selected language on this device.'))
      }

      utterance.onstart = () => setIsSpeaking(true)
      if (index === chunks.length - 1) {
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
      }

      speechSynthRef.current!.speak(utterance)
    })
  }

  const buildSpokenText = (base: string, placeList: LocalPlace[] = []): string => {
    const locale = SPEECH_LOCALES[language]
    const cleaned = sanitizeSpeechText(base, locale)
    const names = placeList.map(place => place?.name).filter(Boolean).join(', ')
    if (!names) return cleaned
    const intro = t('donChucho.spokenPlaces', 'Te recomiendo estos lugares:')
    return `${cleaned} ${sanitizeSpeechText(intro, locale)} ${sanitizeSpeechText(names, locale)}`.trim()
  }

  const speakFollowUp = (key: string, intro: string, placeList: LocalPlace[]) => {
    if (!speechSynthRef.current || !voiceEnabled || placeList.length === 0) return
    const names = placeList.map(place => place?.name).filter(Boolean).join(', ')
    if (!names || lastSpokenFollowUpRef.current[key] === names) return
    lastSpokenFollowUpRef.current[key] = names

    const text = sanitizeSpeechText(`${intro} ${names}`, SPEECH_LOCALES[language])
    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    const voiceForSpeech = resolveVoice()
    utterance.lang = voiceForSpeech?.lang || SPEECH_LOCALES[language]
    utterance.rate = 0.9
    utterance.pitch = voiceForSpeech && !isLikelyMaleVoice(voiceForSpeech) ? 0.8 : 1.0
    utterance.volume = 1.0
    if (voiceForSpeech) utterance.voice = voiceForSpeech
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    speechSynthRef.current.speak(utterance)
  }

  const toggleVoice = () => {
    setVoiceEnabled(previous => {
      const next = !previous
      if (!next) stopSpeaking()
      return next
    })
  }

  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice)
    setVoiceNotice('')
  }

  const findRelatedPlaces = (ids: number[]): LocalPlace[] => {
    if (!places?.length || !ids.length) return []
    return ids
      .map(id => places.find(place => place.id === id))
      .filter((place): place is Place => Boolean(place))
      .slice(0, 3)
      .map(toLocalPlace)
  }

  const checkLocalPlacesTruth = async (localPlaceList: LocalPlace[], messageId: number) => {
    for (const localPlace of localPlaceList) {
      if (localPlace.id) {
        const availability = await pythonBackendService.checkAvailability(localPlace.id)
        if (availability.success && availability.is_available !== undefined) {
          setAvailabilityStatus(prev => ({ ...prev, [String(localPlace.id)]: availability.is_available! }))
        }

        const quality = await pythonBackendService.getQualityVerification(localPlace.id)
        if (quality.success && quality.quality_score) {
          setQualityScores(prev => ({ ...prev, [String(localPlace.id)]: quality.quality_score! }))
        }
      }
    }

    if (localPlaceList.length > 0) {
      const rawType = (localPlaceList[0].type || '').toLowerCase()
      const typeMap: Record<string, string> = {
        alojamientos: 'accommodation',
        camping: 'accommodation',
        restaurantes: 'food',
        'restaurante bar': 'food',
        'cafés': 'food',
        cafes: 'food',
        'coffee tours': 'coffee',
        servicios: 'transport',
        'atractivos turísticos': 'nature',
        'atractivos turisticos': 'nature',
        experiencias: 'nature',
        eventos: 'events',
        'artesanías': 'shopping',
        artesanias: 'shopping',
        tiendas: 'shopping'
      }
      const category = typeMap[rawType] || rawType
      const filter = await pythonBackendService.getTouristTrapFilter(category)
      if (filter.authentic_places && filter.authentic_places.length > 0) {
        const list = filter.authentic_places as unknown as LocalPlace[]
        updateMessage(messageId, { authentic: list })
        speakFollowUp(
          `authentic-${messageId}`,
          t('donChucho.spokenAuthentic', 'También te recomiendo estos lugares auténticos:'),
          list
        )
      }
    }
  }

  const loadNearbyPautantes = async (lat: number, lng: number, messageId: number) => {
    try {
      const nearby = await pythonBackendService.getNearbyPautantes(lat, lng, 'all', 5)
      const list = nearby.nearby_pautantes || []
      updateMessage(messageId, { nearby: list })
      speakFollowUp(
        `nearby-${messageId}`,
        t('donChucho.spokenNearby', 'Servicios cercanos a ti:'),
        list.slice(0, 3)
      )
    } catch (error) {
      console.error('Error cargando nearby pautantes:', error)
    }
  }

  const handleWhatsApp = (whatsapp: string) => {
    const digits = whatsapp.replace(/\D/g, '')
    if (!digits) return
    window.open(`https://wa.me/${digits}`, '_blank', 'noopener,noreferrer')
  }

  const handleSendMessage = async (textOverride?: string) => {
    const userMessage = (textOverride ?? message).trim()
    if (!userMessage || isLoading) return

    if (voiceEnabled) stopSpeaking()
    setMessage('')
    setInterimText('')
    addMessage({ role: 'user', text: userMessage })
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 160))

      const osirisResponse = language === 'zh' ? null : await getOsirisResponse(userMessage, language)
      if (osirisResponse) {
        addMessage({
          role: 'assistant',
          text: osirisResponse,
          suggestions: weatherSuggestions(language),
          source: 'weather'
        })
        setSuggestions(weatherSuggestions(language))
        if (voiceEnabled) speakResponse(osirisResponse)
        return
      }

      const reply = answerDonChucho(userMessage, language, { lastItem: lastItemRef.current })
      if (reply.item) lastItemRef.current = reply.item
      const relatedPlaces = findRelatedPlaces(reply.relatedPlaceIds)

      if (reply.confident || reply.source === 'knowledge') {
        addMessage({
          role: 'assistant',
          text: reply.text,
          places: relatedPlaces,
          suggestions: reply.suggestions,
          source: reply.source
        })
        setSuggestions(reply.suggestions)
        if (voiceEnabled) speakResponse(buildSpokenText(reply.text, relatedPlaces))
        return
      }

      if (usePython && pythonStatus === 'online') {
        const result = await pythonBackendService.sendChatMessage(userMessage)
        const messageId = addMessage({
          role: 'assistant',
          text: result.response,
          places: result.pautantes || [],
          suggestions: reply.suggestions,
          source: 'backend'
        })
        setSuggestions(reply.suggestions)
        if (voiceEnabled) speakResponse(buildSpokenText(result.response, result.pautantes || []))

        if (result.pautantes && result.pautantes.length > 0) {
          void checkLocalPlacesTruth(result.pautantes, messageId)
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              void loadNearbyPautantes(position.coords.latitude, position.coords.longitude, messageId)
            },
            () => undefined
          )
        }
        return
      }

      addMessage({
        role: 'assistant',
        text: reply.text,
        suggestions: reply.suggestions,
        source: reply.source
      })
      setSuggestions(reply.suggestions)
      if (voiceEnabled) speakResponse(reply.text)
    } catch (error) {
      console.error('Error:', error)
      addMessage({
        role: 'assistant',
        text: t('donChucho.errorFallback', 'No pude completar esa consulta. Puedes intentarlo de nuevo o preguntarme por la guía local de Salento.'),
        suggestions: localizedSuggestions('general', language),
        source: 'error'
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceNotice(t('donChucho.voiceUnsupported', 'Voice input is not available in this browser.'))
      return
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      return
    }

    stopSpeaking()
    const recognition = new SpeechRecognition()
    recognition.lang = SPEECH_LOCALES[language]
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setIsListening(true)
      setInterimText('')
      setVoiceNotice('')
    }

    recognition.onresult = (event: any) => {
      let finalText = ''
      let interim = ''
      for (let index = event.resultIndex; index < event.results.length; index++) {
        const transcript = event.results[index][0].transcript
        if (event.results[index].isFinal) finalText += transcript
        else interim += transcript
      }
      if (interim) setInterimText(interim)
      if (finalText.trim()) {
        setInterimText('')
        setMessage('')
        void handleSendMessage(finalText.trim())
      }
    }

    recognition.onerror = (event: any) => {
      setIsListening(false)
      setInterimText('')
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setVoiceNotice(t('donChucho.voiceError', 'No pude escucharte. Intenta de nuevo.'))
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimText('')
    }

    try {
      recognition.start()
    } catch {
      setIsListening(false)
    }
  }

  if (pythonStatus === 'offline' && existingComponent) {
    return <>{existingComponent}</>
  }

  return (
    <div className="enhanced-don-chucho">
      <div className="status-indicator">
        <span className={`status ${pythonStatus}`}>
          {pythonStatus === 'online'
            ? t('donChucho.onlineStatus', 'Don Chucho IA Online')
            : isDeviceOffline
              ? t('donChucho.offlineStatus', 'Don Chucho · Modo offline')
              : t('donChucho.subtitle', 'Tu guía local')}
        </span>
        {pythonStatus === 'online' && <span className="zero-click-badge">Zero-Click Access</span>}
        {voiceEnabled && <span className="voice-badge">🔊 {t('donChucho.voiceActive', 'Voz activa')}</span>}
        <button
          type="button"
          className="enhanced-close"
          onClick={() => (onClose ? onClose() : goLocal())}
          aria-label={t('donChucho.closeAssistant', 'Cerrar asistente')}
        >
          ✕
        </button>
      </div>

      {isDeviceOffline && !offlineNoticeDismissed && (
        <div className="enhanced-offline-banner">
          <p>{t('donChucho.offlineMessage', 'Modo offline activo. Don Chucho sigue disponible con la guía local de Salento; las consultas en tiempo real se actualizarán al recuperar la conexión.')}</p>
          <button type="button" onClick={() => setOfflineNoticeDismissed(true)}>
            {t('donChucho.offlineContinue', 'Continuar sin conexión')}
          </button>
        </div>
      )}

      <div className="chat-container">
        <div className="messages" ref={messagesRef} aria-live="polite" role="log">
          {messages.map(chatMessage => (
            <div key={chatMessage.id} className={`chat-message ${chatMessage.role}`}>
              {chatMessage.role === 'assistant' && <div className="chat-avatar">DC</div>}
              <div className="chat-bubble">
                <div className="chat-author">
                  {chatMessage.role === 'assistant' ? t('donChucho.title', 'Don Chucho') : t('donChucho.you', 'Tú')}
                </div>
                <p style={{ whiteSpace: 'pre-line' }}>{chatMessage.text}</p>

                {chatMessage.places && chatMessage.places.length > 0 && (
                  <div className="local-places-results">
                    {chatMessage.places.map((localPlace, index) => (
                      <div key={`${chatMessage.id}-${localPlace.id ?? index}`} className="local-place-card">
                        <div className="local-place-header">
                          <strong>{localPlace.name}</strong>
                          <span className="badge">{t(`categories.${localPlace.type}`, localPlace.type)}</span>
                          {localPlace.distance_km && <span className="distance-badge">{localPlace.distance_km} km</span>}
                          {localPlace.id && availabilityStatus[String(localPlace.id)] !== undefined && (
                            <span className={`availability-badge ${availabilityStatus[String(localPlace.id)] ? 'available' : 'unavailable'}`}>
                              {availabilityStatus[String(localPlace.id)]
                                ? t('donChucho.available', '✓ Disponible')
                                : t('donChucho.unavailable', '✗ Sin cupo')}
                            </span>
                          )}
                          {localPlace.id && qualityScores[String(localPlace.id)] && (
                            <span className="quality-badge">★ {qualityScores[String(localPlace.id)]}/100</span>
                          )}
                        </div>
                        {language === 'es' && localPlace.description && <p>{localPlace.description}</p>}
                        <div className="local-place-actions">
                          {localPlace.contact.whatsapp && (
                            <button
                              type="button"
                              onClick={() => handleWhatsApp(localPlace.contact.whatsapp!)}
                              className="whatsapp-btn"
                            >
                              {t('donChucho.whatsapp', 'WhatsApp One-Tap')}
                            </button>
                          )}
                          {localPlace.contact.phone && (
                            <a href={`tel:${localPlace.contact.phone}`} className="phone-btn">
                              {t('donChucho.call', 'Llamar')}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {chatMessage.authentic && chatMessage.authentic.length > 0 && (
                  <div className="authentic-places-section">
                    <h4>{t('donChucho.authenticPlaces', 'Lugares auténticos recomendados')}</h4>
                    {chatMessage.authentic.map((place, index) => (
                      <div key={`${chatMessage.id}-authentic-${index}`} className="authentic-place-item">
                        <strong>{place.name}</strong>
                        <span className="authenticity-badge">{t('donChucho.verified', place.local_approval || 'Verificado')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {chatMessage.nearby && chatMessage.nearby.length > 0 && (
                  <div className="nearby-section">
                    <h4>{t('donChucho.nearbyPlaces', 'Servicios cercanos a ti:')}</h4>
                    {chatMessage.nearby.slice(0, 3).map((place, index) => (
                      <div key={`${chatMessage.id}-nearby-${index}`} className="nearby-card">
                        <strong>{place.name}</strong>
                        <span className="nearby-distance">{place.distance_km} km</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message assistant">
              <div className="chat-avatar">DC</div>
              <div className="chat-bubble typing" aria-label={t('donChucho.thinking', 'Don Chucho está pensando...')}>
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {isListening && (
            <div className="voice-interim" role="status">
              {interimText || t('donChucho.listening', 'Escuchando...')}
            </div>
          )}
        </div>

        {suggestions.length > 0 && !isLoading && (
          <div className="chat-suggestions" aria-label={t('donChucho.suggestions', 'También puedes preguntar:')}>
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className="suggestion-chip"
                onClick={() => void handleSendMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="input-area">
          <button
            type="button"
            onClick={handleVoiceCommand}
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            title={t('donChucho.voiceCommand', 'Voice input')}
            aria-label={t('donChucho.voiceCommand', 'Voice input')}
            aria-pressed={isListening}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={event => setMessage(event.target.value)}
            placeholder={isListening
              ? (interimText || t('donChucho.listening', 'Escuchando...'))
              : t('donChucho.placeholder', 'Ask Don Chucho...')}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void handleSendMessage()
              }
            }}
          />
          <button
            type="button"
            onClick={() => void handleSendMessage()}
            disabled={isLoading || !message.trim()}
            className="send-btn"
          >
            {isLoading ? '...' : t('donChucho.sendQuestion', 'Send question')}
          </button>

          <div className="voice-controls">
            <button
              type="button"
              onClick={toggleVoice}
              className={`voice-toggle ${voiceEnabled ? 'enabled' : 'disabled'}`}
              title={voiceEnabled ? t('donChucho.voiceEnabled', 'Read-aloud enabled') : t('donChucho.voiceDisabled', 'Read-aloud disabled')}
              aria-label={voiceEnabled ? t('donChucho.voiceEnabled', 'Read-aloud enabled') : t('donChucho.voiceDisabled', 'Read-aloud disabled')}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>

            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="stop-voice-btn"
                title={t('donChucho.stopVoice', 'Stop speaking')}
                aria-label={t('donChucho.stopVoice', 'Stop speaking')}
              >
                ⏹️
              </button>
            )}

            {languageVoices.length > 1 && (
              <select
                value={selectedVoice?.name || ''}
                aria-label={t('donChucho.selectVoice', 'Select voice')}
                onChange={event => {
                  const voice = languageVoices.find(item => item.name === event.target.value)
                  if (voice) handleVoiceChange(voice)
                }}
                className="voice-selector"
              >
                {languageVoices.map(voice => (
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
