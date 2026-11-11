import { describe, expect, it } from 'vitest'
import { TRANSLATION_EXTRAS } from './translationExtras'
import { translationService } from './translationService'
import {
  detectKnowledgeIntent,
  detectSmallTalk,
  expandQuery,
  fallbackReply,
  localizedSuggestions,
  smallTalkReply
} from './donChuchoNlu'
import type { Language } from '../types'

const LOCALIZED: Language[] = ['ar', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'zh']
const CORE_KEYS = [
  'hero.title',
  'nav.home',
  'directory.heading',
  'categories.Todo',
  'donChucho.title',
  'donChucho.welcome',
  'aria.changeLanguage'
]

describe('traducciones adicionales', () => {
  it.each(LOCALIZED)('%s incluye las claves visibles principales', (language) => {
    const dict = TRANSLATION_EXTRAS[language]
    expect(dict).toBeTruthy()
    for (const key of CORE_KEYS) {
      expect(dict?.[key], `${language}:${key}`).toBeTruthy()
    }
  })

  it('el servicio de traducción fusiona los extras', () => {
    ;(globalThis as any).localStorage = { getItem: () => null, setItem: () => {} }
    for (const language of LOCALIZED) {
      translationService.setLanguage(language)
      expect(translationService.translate('nav.home'), language).not.toBe('nav.home')
      expect(translationService.translate('donChucho.title'), language).not.toBe('donChucho.title')
    }
  })

  it('detecta saludos y temas en árabe y asiáticos', () => {
    expect(detectSmallTalk('مرحبا')).toBe('greeting')
    expect(detectSmallTalk('こんにちは')).toBe('greeting')
    expect(detectSmallTalk('안녕하세요')).toBe('greeting')
    expect(detectKnowledgeIntent('أين آكل')).toBe('comer')
    expect(expandQuery('コーヒー')).toContain('cafe')
    expect(expandQuery('コーヒーはどこですか')).toContain('cafe')
  })

  it('Don Chucho responde en los idiomas localizados', () => {
    for (const language of ['ar', 'ja', 'ko', 'th', 'vi', 'id', 'ms'] as Language[]) {
      expect(smallTalkReply('greeting', language)).not.toBe(smallTalkReply('greeting', 'en'))
      expect(fallbackReply(language)).not.toBe(fallbackReply('en'))
      expect(localizedSuggestions('general', language).length).toBeGreaterThan(0)
    }
  })
})
