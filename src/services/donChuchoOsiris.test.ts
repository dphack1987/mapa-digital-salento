import { describe, it, expect } from 'vitest'
import { normalizeOsirisLang, shouldUseOsirisData, isTourismQuery, getOsirisResponse } from './donChuchoOsiris'

describe('donChuchoOsiris', () => {
  it('normaliza en-gb y en-us a en', () => {
    expect(normalizeOsirisLang('en-gb')).toBe('en')
    expect(normalizeOsirisLang('en-us')).toBe('en')
  })

  it('normaliza los idiomas soportados', () => {
    expect(normalizeOsirisLang('es')).toBe('es')
    expect(normalizeOsirisLang('de')).toBe('de')
    expect(normalizeOsirisLang('fr')).toBe('fr')
    expect(normalizeOsirisLang('pt')).toBe('pt')
    expect(normalizeOsirisLang('it')).toBe('it')
  })

  it('retorna null para idiomas sin contenido Osiris', () => {
    expect(normalizeOsirisLang('ja')).toBeNull()
    expect(normalizeOsirisLang('ko')).toBeNull()
  })

  it('usa español como idioma por defecto', () => {
    expect(normalizeOsirisLang(undefined)).toBe('es')
  })

  it('detecta consultas de clima', () => {
    expect(shouldUseOsirisData('¿Qué clima hace hoy?')).toBe(true)
    expect(shouldUseOsirisData('best coffee tour')).toBe(false)
  })

  it('detecta consultas turísticas', () => {
    expect(isTourismQuery('actividades para visitar el Valle de Cocora')).toBe(true)
    expect(isTourismQuery('fix the login bug')).toBe(false)
  })

  it('getOsirisResponse cae al conocimiento local para idioma no soportado', async () => {
    expect(await getOsirisResponse('clima', 'ja')).toBeNull()
  })
})
