import { describe, it, expect } from 'vitest'
import { isLikelyMaleVoice, pickVoiceForLang, sanitizeSpeechText, SPEECH_LOCALES } from './VoiceInput'

describe('VoiceInput helpers', () => {
  it('sanitiza emoji y colapsa espacios para TTS', () => {
    expect(sanitizeSpeechText('¡Hola! 🎉 mundo 😊')).toBe('¡Hola! mundo')
  })

  it('sanitiza texto vacío', () => {
    expect(sanitizeSpeechText('')).toBe('')
  })

  it('lee los precios en pesos colombianos y nunca en dólares', () => {
    expect(sanitizeSpeechText('Entrada $12.000 COP', 'es-CO')).toBe('Entrada 12.000 pesos colombianos')
    expect(sanitizeSpeechText('desde $20.000', 'es-CO')).toBe('desde 20.000 pesos colombianos')
    expect(sanitizeSpeechText('Tours $80.000-$200.000 COP', 'es-CO')).toBe('Tours 80.000 a 200.000 pesos colombianos')
    expect(sanitizeSpeechText('Entry $12,000', 'en-US')).toBe('Entry 12,000 Colombian pesos')
    expect(sanitizeSpeechText('Entrée 12 000 $', 'fr-FR')).toBe('Entrée 12 000 pesos colombiens')
  })

  it('detecta una voz con nombre masculino', () => {
    expect(isLikelyMaleVoice({ name: 'Jorge', lang: 'es-CO' } as unknown as SpeechSynthesisVoice)).toBe(true)
  })

  it('detecta una voz femenina (Google US English)', () => {
    expect(isLikelyMaleVoice({ name: 'Google US English', lang: 'en-US' } as unknown as SpeechSynthesisVoice)).toBe(false)
  })

  it('pickVoiceForLang prioriza la voz masculina del idioma', () => {
    const voices = [
      { name: 'Google US English', lang: 'en-US' } as unknown as SpeechSynthesisVoice,
      { name: 'Jorge', lang: 'es-CO' } as unknown as SpeechSynthesisVoice,
    ]
    expect(pickVoiceForLang(voices, 'es-CO')?.name).toBe('Jorge')
  })

  it('expone los locales por idioma soportado', () => {
    expect(SPEECH_LOCALES.es).toBe('es-CO')
    expect(SPEECH_LOCALES.en).toBe('en-US')
  })
})
