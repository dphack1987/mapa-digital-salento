// Voice-First Component - Interacción por voz nativa
// Utiliza Web Speech API para reconocimiento de voz

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import type { Language } from '../types'

// Locales BCP-47 recomendados para reconocimiento y síntesis de voz,
// uno por cada idioma soportado por la aplicación.
export const SPEECH_LOCALES: Record<Language, string> = {
  es: 'es-CO', en: 'en-US', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR', it: 'it-IT', zh: 'zh-CN',
  ja: 'ja-JP', ko: 'ko-KR', th: 'th-TH', vi: 'vi-VN', id: 'id-ID', ms: 'ms-MY', 'en-gb': 'en-GB'
}

// Don Chucho es arriero varón: se prefiere una voz masculina del idioma.
// Muchos navegadores exponen la primera voz del idioma como femenina
// (p. ej. "Google español", "Microsoft Sabina"), así que se busca un
// nombre masculino antes de caer en la primera disponible.
const MALE_VOICE_HINTS = [
  'male', 'jorge', 'pablo', 'raul', 'raúl', 'david', 'daniel', 'diego',
  'carlos', 'javier', 'andres', 'andrés', 'miguel', 'felipe', 'thomas',
  'james', 'richard', 'fred', 'albert', 'hugo', 'enrique', 'roberto',
  'emiliano', 'gerardo', 'juan', 'pedro', 'omar', 'ruben', 'rubén',
  'sergio', 'antonio', 'francisco', 'manuel', 'ricardo', 'eduardo',
  'ignacio', 'gonzalo', 'arturo', 'rafael', 'oscar', 'óscar', 'alvaro',
  'gabriel', 'hector', 'héctor', 'mario', 'alexander', 'andrew',
  'matthew', 'joseph', 'robert', 'michael', 'william', 'charles',
  'martin', 'martín', 'peter', 'pierre', 'hans', 'stefano', 'paolo',
  'joão', 'joao', 'andre', 'andré', 'thiago', 'bruno', 'diego'
]

const FEMALE_VOICE_HINTS = [
  'female', 'sabina', 'elena', 'zira', 'helena', 'luciana', 'lucía',
  'lucia', 'monica', 'mónica', 'catalina', 'isabela', 'paulina',
  'ximena', 'daria', 'karen', 'sara', 'maria', 'maría', 'carmen',
  'paula', 'laura', 'cristina', 'francesca', 'susan', 'hazel', 'iris',
  'sonia', 'sofia', 'sofía', 'valentina', 'camila', 'gabriela',
  'alejandra', 'veronica', 'verónica', 'patricia', 'rosa', 'juana',
  'anna', 'nadia', 'victoria', 'stephanie', 'monika', 'jenny',
  'catarina', 'joana', 'alice', 'emma', 'virginia', 'lisa',
  'samantha', 'google español', 'google us english', 'google deutsch',
  'google français', 'google italiano', 'google português'
]

/** ¿La voz tiene pinta de masculina? (para la voz de Don Chucho) */
export function isLikelyMaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = (voice.name || '').toLowerCase()
  if (name.includes('female') || name.includes('mujer')) return false
  if (name.includes('male') || name.includes('varón') || name.includes('varon')) return true
  if (FEMALE_VOICE_HINTS.some(hint => name.includes(hint))) return false
  return MALE_VOICE_HINTS.some(hint => name.includes(hint))
}

const normalizeLang = (lang: string) => lang.toLowerCase().replace(/_/g, '-')

/**
 * Elige la voz para un idioma priorizando:
 * 1) locale exacto (ej. es-CO) con voz masculina,
 * 2) cualquier voz masculina del idioma (ej. es-MX),
 * 3) locale exacto sin importar el género,
 * 4) la primera del idioma como último recurso.
 */
export function pickVoiceForLang(
  voices: SpeechSynthesisVoice[],
  lang: string
): SpeechSynthesisVoice | null {
  const requested = normalizeLang(lang || 'es-CO')
  const base = requested.split('-')[0]
  const exact: SpeechSynthesisVoice[] = []
  const baseExact: SpeechSynthesisVoice[] = []
  const prefix: SpeechSynthesisVoice[] = []
  const seen = new Set<string>()

  for (const voice of voices) {
    const vLang = normalizeLang(voice.lang || '')
    const key = `${voice.name}|${voice.lang}`
    if (seen.has(key)) continue
    if (vLang === requested) exact.push(voice)
    else if (vLang === base) baseExact.push(voice)
    else if (vLang.startsWith(`${base}-`)) prefix.push(voice)
    else continue
    seen.add(key)
  }

  const tiers = [exact, baseExact, prefix]
  for (const tier of tiers) {
    const male = tier.find(isLikelyMaleVoice)
    if (male) return male
  }
  return exact[0] || baseExact[0] || prefix[0] || null
}

/**
 * Limpia el texto para TTS: quita emoji y símbolos que los lectores
 * en voz alta deletrean o leen raro (🌤️, ☀️, ✓, ★, ⏹️…).
 * El texto en pantalla no se toca.
 */
export function sanitizeSpeechText(text: string): string {
  if (!text) return text
  return text
    .replace(
      /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{FE0E}\u{FE0F}\u{200D}]/gu,
      ' '
    )
    .replace(/\s+/g, ' ')
    .trim()
}

interface VoiceInputProps {
  onTranscript: (text: string) => void
  language?: string
  continuous?: boolean
  disabled?: boolean
}

export function VoiceInput({ 
  onTranscript, 
  language = 'es-CO', 
  continuous = false,
  disabled = false 
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = continuous
      recognition.interimResults = true
      recognition.lang = language
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onend = () => {
        setIsListening(false)
        if (continuous && !disabled) {
          // Reiniciar si es modo continuo
          try { recognition.start() } catch {}
        }
      }

      recognition.onresult = (event: any) => {
        let interim = ''
        let final = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            final += result[0].transcript
          } else {
            interim += result[0].transcript
          }
        }

        if (final) {
          setTranscript(final)
          setInterimTranscript('')
          onTranscript(final)
        } else {
          setInterimTranscript(interim)
        }
      }

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
      }
    }
  }, [language, continuous, onTranscript, disabled])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current || disabled) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setTranscript('')
      setInterimTranscript('')
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.warn('Could not start recognition:', e)
      }
    }
  }, [isListening, disabled])

  if (!isSupported) {
    return null // No mostrar nada si no soporta voz
  }

  return (
    <div className="voice-input-container">
      <button
        className={`voice-btn ${isListening ? 'voice-btn-active' : ''}`}
        onClick={toggleListening}
        disabled={disabled}
        aria-label={isListening ? 'Detener voz' : 'Hablar'}
        title={isListening ? 'Grabando...' : 'Pulsa para hablar'}
      >
        {isListening ? (
          <MicOff size={18} className="voice-icon voice-icon-active" />
        ) : (
          <Mic size={18} className="voice-icon" />
        )}
        {isListening && <span className="voice-pulse" />}
      </button>
      
      {interimTranscript && (
        <div className="voice-interim">
          <Volume2 size={12} />
          <span>{interimTranscript}</span>
        </div>
      )}
    </div>
  )
}

// Hook para voz sintetizada (Text-to-Speech)
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || []
      setVoices(availableVoices)
    }
    
    loadVoices()
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices)
    
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const speak = useCallback((text: string, lang = 'es-CO') => {
    if (!window.speechSynthesis) return

    const cleanText = sanitizeSpeechText(text)
    if (!cleanText) return

    // Cancelar si ya está hablando
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Voz masculina preferida (Don Chucho es varón); si no hay, la mejor
    // coincidencia del idioma. Si tampoco hay, el navegador usa su voz
    // por defecto para `utterance.lang`.
    const matchedVoice = pickVoiceForLang(voices, lang)
    if (matchedVoice) utterance.voice = matchedVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [voices])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking }
}
