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
    
    // Cancelar si ya está hablando
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    // Seleccionar la voz que mejor coincida con el idioma solicitado.
    // Prioridad: coincidencia exacta (ej. es-CO) → mismo locale base (ej. es)
    // → cualquier variante de ese idioma (ej. es-MX). Si no hay, se omite
    // y el navegador usa su voz por defecto para `utterance.lang`.
    const requested = (lang || 'es-CO').toLowerCase()
    const base = requested.split('-')[0]
    const matchedVoice =
      voices.find(v => v.lang.toLowerCase() === requested) ||
      voices.find(v => v.lang.toLowerCase().replace('_', '-') === requested) ||
      voices.find(v => v.lang.toLowerCase().split('-')[0] === base)
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
