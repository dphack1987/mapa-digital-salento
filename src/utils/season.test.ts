import { describe, it, expect } from 'vitest'
import { isChristmasSeason, getSeason } from './season'

describe('utils/season', () => {
  it('activa la temporada navideña en noviembre, diciembre y enero', () => {
    expect(isChristmasSeason(new Date(2026, 10, 15))).toBe(true) // 15-nov
    expect(isChristmasSeason(new Date(2026, 11, 25))).toBe(true) // 25-dic
    expect(isChristmasSeason(new Date(2027, 0, 6))).toBe(true) // 6-ene
  })

  it('se apaga desde febrero (el mes clave) hasta octubre', () => {
    expect(isChristmasSeason(new Date(2027, 1, 1))).toBe(false) // 1-feb: nunca se activa
    expect(isChristmasSeason(new Date(2027, 1, 28))).toBe(false) // fin de febrero
    expect(isChristmasSeason(new Date(2026, 5, 15))).toBe(false) // junio
    expect(isChristmasSeason(new Date(2026, 9, 31))).toBe(false) // 31-oct: aún no
  })

  it('cubre los límites exactos de la ventana nov–ene', () => {
    expect(isChristmasSeason(new Date(2026, 10, 1))).toBe(true) // 1-nov: primer día
    expect(isChristmasSeason(new Date(2027, 0, 31))).toBe(true) // 31-ene: último día
    expect(isChristmasSeason(new Date(2027, 1, 1))).toBe(false) // 1-feb: primer día apagado
  })

  it('getSeason devuelve christmas o default', () => {
    expect(getSeason(new Date(2026, 11, 31))).toBe('christmas')
    expect(getSeason(new Date(2027, 3, 1))).toBe('default')
  })
})
