// Voice-First Component - Interacción por voz nativa
// Utiliza Web Speech API para reconocimiento de voz

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import type { Language } from '../types'

// Locales BCP-47 recomendados para reconocimiento y síntesis de voz,
// uno por cada idioma soportado por la aplicación.
export const SPEECH_LOCALES: Record<Language, string> = {
  es: 'es-CO', en: 'en-US', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR', it: 'it-IT', zh: 'zh-CN',
  ja: 'ja-JP', ko: 'ko-KR', th: 'th-TH', vi: 'vi-VN', id: 'id-ID', ms: 'ms-MY', 'en-gb': 'en-GB', ar: 'ar-SA'
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
  'joão', 'joao', 'andre', 'andré', 'thiago', 'bruno', 'diego',
  // Chino mandarín
  'kangkang', 'yunxi', 'yunyang', 'yunjian', 'yunfeng', 'liang', 'li-mu',
  'limu', 'yu-shu', 'yushu', 'zhiwei', 'male chinese',
  // Japonés
  'ichiro', 'otoya', 'keita', 'takumi', 'daichi', 'naoki', 'male japanese',
  // Coreano
  'injoon', 'minho', 'minsu', 'junwoo', 'hyunsu', 'male korean',
  // Árabe
  'naayf', 'maged', 'majed', 'tarik', 'khalid', 'male arabic',
  // Tailandés
  'niwat', 'male thai',
  // Vietnamita
  'namminh', 'nam minh', 'male vietnamese',
  // Indonesio
  'andika', 'ardi', 'male indonesian',
  // Malayo
  'rizwan', 'yazid', 'male malay'
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
  'google français', 'google italiano', 'google português',
  // Chino mandarín
  'huihui', 'yaoyao', 'yating', 'ting-ting', 'tingting', 'mei-jia',
  'meijia', 'sin-ji', 'sinji', 'xiaoxiao', 'xiaoyi', 'google 普通话',
  'google 中文', 'google 國語',
  // Japonés
  'haruka', 'ayumi', 'sayaka', 'kyoko', 'nanami', 'google 日本語',
  // Coreano
  'heami', 'yumi', 'yuna', 'sora', 'google 한국의',
  // Árabe
  'hoda', 'laila', 'salma', 'zariyah', 'google العربية',
  // Tailandés
  'pattara', 'kanya', 'achara', 'premwadee', 'google ไทย',
  // Vietnamita
  'linh', 'mai', 'hoaimy', 'google tiếng việt',
  // Indonesio
  'gadis', 'damayanti', 'google bahasa indonesia',
  // Malayo
  'suhaila', 'amira', 'google bahasa melayu'
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

// Nombre hablado de cada moneda por idioma. Evita que el TTS lea el símbolo
// "$" como "dólares" cuando en realidad el precio está en pesos colombianos.
const SPOKEN_CURRENCIES: Record<string, { cop: string; usd: string; eur: string }> = {
  es: { cop: 'pesos colombianos', usd: 'dólares estadounidenses', eur: 'euros' },
  en: { cop: 'Colombian pesos', usd: 'US dollars', eur: 'euros' },
  'en-gb': { cop: 'Colombian pesos', usd: 'US dollars', eur: 'euros' },
  fr: { cop: 'pesos colombiens', usd: 'dollars américains', eur: 'euros' },
  de: { cop: 'kolumbianische Pesos', usd: 'US-Dollar', eur: 'Euro' },
  pt: { cop: 'pesos colombianos', usd: 'dólares americanos', eur: 'euros' },
  it: { cop: 'pesos colombiani', usd: 'dollari americani', eur: 'euros' },
  zh: { cop: '哥伦比亚比索', usd: '美元', eur: '欧元' },
  ja: { cop: 'コロンビアペソ', usd: '米ドル', eur: 'ユーロ' },
  ko: { cop: '콜롬비아 페소', usd: '미국 달러', eur: '유로' },
  ar: { cop: 'بيزو كولومبي', usd: 'دولار أمريكي', eur: 'يورو' },
  th: { cop: 'เปโซโคลอมเบีย', usd: 'ดอลลาร์สหรัฐ', eur: 'ยูโร' },
  vi: { cop: 'peso Colombia', usd: 'đô la Mỹ', eur: 'euro' },
  id: { cop: 'peso Kolombia', usd: 'dolar AS', eur: 'euro' },
  ms: { cop: 'peso Colombia', usd: 'dolar AS', eur: 'euro' }
}

/**
 * Convierte importes con símbolo "$" a moneda hablada. Los precios del sitio
 * son siempre COP; "$" nunca debe leerse como dólares.
 */
export function normalizeCurrencyForSpeech(text: string, language = 'es'): string {
  if (!text) return text
  const lang = language.toLowerCase()
  const base = lang.split('-')[0]
  const names = SPOKEN_CURRENCIES[lang] || SPOKEN_CURRENCIES[base] || SPOKEN_CURRENCIES.es
  const number = '([0-9][0-9.,\\s]*)'
  const amountEnd = '(?=\\s|$|[.,;:)])'
  let out = text

  // Rangos: $80.000-$200.000 → 80.000 a 200.000 pesos colombianos
  out = out.replace(
    new RegExp(`\\$\\s*${number}\\s*[-–—]\\s*\\$\\s*${number}${amountEnd}`, 'g'),
    (_match, from: string, to: string) => `${from.trim()} a ${to.trim()} ${names.cop}`
  )
  // Importes con COP explícito: "$80.000 COP" → "80.000 COP"
  out = out.replace(new RegExp(`\\$\\s*${number}\\s*COP\\b`, 'gi'), (_match, amount: string) => `${amount.trim()} COP`)
  // Importes con COP pospuesto: "80.000 COP" → "80.000 pesos colombianos"
  out = out.replace(new RegExp(`${number}\\s*COP\\b`, 'gi'), (_match, amount: string) => `${amount.trim()} ${names.cop}`)
  // Importes con "$" antepuesto: "$12.000" → "12.000 pesos colombianos"
  out = out.replace(new RegExp(`\\$\\s*${number}${amountEnd}`, 'g'), (_match, amount: string) => `${amount.trim()} ${names.cop}`)
  // Importes con "$" pospuesto: "12 000 $" → "12 000 pesos colombianos"
  out = out.replace(new RegExp(`${number}\\s*\\$`, 'g'), (_match, amount: string) => `${amount.trim()} ${names.cop}`)
  // Monedas explícitas distintas de COP
  out = out.replace(new RegExp(`US\\$\\s*${number}`, 'gi'), (_match, amount: string) => `${amount.trim()} ${names.usd}`)
  out = out.replace(/\bUSD\b|\bUS dollars?\b/gi, names.usd)
  out = out.replace(/\bEUR\b/gi, names.eur)
  // Cualquier "$" restante (símbolo suelto) también es COP en este sitio
  out = out.replace(/\$/g, names.cop)

  const escaped = names.cop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Quita el "COP" que haya quedado tras una moneda ya normalizada.
  out = out.replace(new RegExp(`(${escaped})\\s+COP\\b`, 'gi'), names.cop)
  out = out.replace(/\bCOP\b/gi, names.cop)
  return out.replace(new RegExp(`(?:${escaped})(?:[\\s,;/-]+${escaped})+`, 'gi'), names.cop)
}

/**
 * Limpia el texto para TTS: quita emoji y símbolos que los lectores
 * en voz alta deletrean o leen raro (🌤️, ☀️, ✓, ★, ⏹️…), y normaliza
 * los importes para que se lean en la moneda correcta (COP).
 * El texto en pantalla no se toca.
 */
export function sanitizeSpeechText(text: string, language = 'es'): string {
  if (!text) return text
  return normalizeCurrencyForSpeech(text, language)
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

    const cleanText = sanitizeSpeechText(text, lang)
    if (!cleanText) return

    // Cancelar si ya está hablando
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.volume = 1.0

    // Voz masculina preferida (Don Chucho es varón); si no hay, la mejor
    // coincidencia del idioma. Si tampoco hay, el navegador usa su voz
    // por defecto para `utterance.lang`.
    const matchedVoice = pickVoiceForLang(voices, lang)
    if (matchedVoice) utterance.voice = matchedVoice
    // Si el dispositivo solo tiene voces femeninas para ese idioma, bajamos
    // el tono para acercarnos a una voz masculina sin cambiar de idioma.
    utterance.pitch = matchedVoice && !isLikelyMaleVoice(matchedVoice) ? 0.8 : 1.0

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
