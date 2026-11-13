import { describe, expect, it } from 'vitest'
import { christmasSuggestions } from './donChuchoNlu'
import { donChuchoKnowledge } from './donChuchoKnowledge'

describe('Don Chucho — modo navideño', () => {
  it('sugiere 3 planes navideños en español', () => {
    const s = christmasSuggestions('es')
    expect(s).toHaveLength(3)
    expect(s[0]).toContain('Navidad')
  })

  it('traduce las sugerencias navideñas a los idiomas base', () => {
    expect(christmasSuggestions('en')[0]).toContain('Christmas')
    expect(christmasSuggestions('fr')[0]).toContain('Noël')
    expect(christmasSuggestions('de')[0]).toContain('Weihnachten')
    expect(christmasSuggestions('pt')[0]).toContain('Natal')
    expect(christmasSuggestions('it')[0]).toContain('Natale')
  })

  it('responde qué hacer en Navidad con plan navideño', () => {
    const answer = donChuchoKnowledge.getAnswer('¿qué hacer en Navidad en Salento?', 'es')
    expect(answer).toContain('Mercado Navideño')
    expect(answer).toContain('buñuelos')
  })

  it('responde en inglés cuando se pregunta por Christmas', () => {
    const answer = donChuchoKnowledge.getAnswer('christmas plans in Salento', 'en')
    expect(answer).toContain('Christmas Market')
  })

  it('tiene follow-ups navideños', () => {
    const answer = donChuchoKnowledge.getAnswer('nochebuena en Salento', 'es')
    expect(answer.length).toBeGreaterThan(50)
  })
})
