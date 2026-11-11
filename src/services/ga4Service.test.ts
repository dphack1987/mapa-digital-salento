import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ga4Service from './ga4Service'

describe('ga4Service', () => {
  const gtagMock = vi.fn()

  beforeEach(() => {
    ;(globalThis as any).window = { gtag: gtagMock, location: { href: 'https://salentoalamano.com/' } }
    const service = ga4Service as any
    service.enabled = true
    service.initialized = true
    service.measurementId = 'G-TEST'
    gtagMock.mockClear()
  })

  afterEach(() => {
    delete (globalThis as any).window
  })

  it('envía eventos GA4 personalizados cuando gtag está disponible', () => {
    ga4Service.trackEvent('wsa_nomination_view', { section_id: 'wsa-nominacion' })
    expect(gtagMock).toHaveBeenCalledWith('event', 'wsa_nomination_view', { section_id: 'wsa-nominacion' })
  })

  it('envía page_view con path y título', () => {
    ga4Service.trackPageView('/categorias/restaurantes', 'Restaurantes')
    expect(gtagMock).toHaveBeenCalledWith(
      'event',
      'page_view',
      expect.objectContaining({ page_path: '/categorias/restaurantes', page_title: 'Restaurantes' })
    )
  })

  it('no envía nada cuando gtag no está disponible', () => {
    ;(globalThis as any).window = {}
    ga4Service.trackEvent('wsa_nomination_view', { section_id: 'wsa-nominacion' })
    expect(gtagMock).not.toHaveBeenCalled()
  })
})
