// Servicio de conversión de moneda con tasas en tiempo real
// Usa APIs públicas para obtener tasas de cambio actualizadas

import { Currency } from '../types'

interface ExchangeRates {
  COP: number
  USD: number
  EUR: number
}

interface CurrencyInfo {
  code: Currency
  symbol: string
  name: string
  flag: string
}

const CURRENCY_INFO: Record<Currency, CurrencyInfo> = {
  COP: { code: 'COP', symbol: '$', name: 'Peso colombiano', flag: '🇨🇴' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' }
}

// Tasas de respaldo por si la API falla
const FALLBACK_RATES: ExchangeRates = {
  COP: 1,
  USD: 0.00025,
  EUR: 0.00021
}

class CurrencyService {
  private rates: ExchangeRates = FALLBACK_RATES
  private lastUpdate: number = 0
  private updateInterval = 60 * 60 * 1000 // 1 hora
  private isUpdating = false

  /**
   * Obtener tasas de cambio desde API pública
   */
  private async fetchRatesFromAPI(): Promise<ExchangeRates> {
    try {
      // Usar exchangerate-api (API gratuita sin autenticación)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/COP')
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        COP: 1,
        USD: 1 / data.rates.USD,
        EUR: 1 / data.rates.EUR
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      return FALLBACK_RATES
    }
  }

  /**
   * Actualizar tasas de cambio
   */
  async updateRates(): Promise<void> {
    if (this.isUpdating) return
    
    this.isUpdating = true

    try {
      const newRates = await this.fetchRatesFromAPI()
      this.rates = newRates
      this.lastUpdate = Date.now()
      
      // Guardar en localStorage
      this.saveRatesToStorage()
      
      console.log('Exchange rates updated:', this.rates)
    } catch (error) {
      console.error('Error updating exchange rates:', error)
    } finally {
      this.isUpdating = false
    }
  }

  /**
   * Obtener tasas actuales
   */
  getRates(): ExchangeRates {
    // Verificar si necesitamos actualizar
    if (Date.now() - this.lastUpdate > this.updateInterval) {
      this.updateRates()
    }
    
    return this.rates
  }

  /**
   * Convertir monto de COP a otra moneda
   */
  convertFromCOP(amount: number, toCurrency: Currency): number {
    const rates = this.getRates()
    const rate = rates[toCurrency]
    return Math.round(amount * rate * 100) / 100
  }

  /**
   * Convertir monto a COP desde otra moneda
   */
  convertToCOP(amount: number, fromCurrency: Currency): number {
    const rates = this.getRates()
    const rate = rates[fromCurrency]
    return Math.round((amount / rate) * 100) / 100
  }

  /**
   * Formatear monto con símbolo de moneda
   */
  formatAmount(amount: number, currency: Currency): string {
    const info = CURRENCY_INFO[currency]
    const formatted = amount.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    return `${info.symbol}${formatted}`
  }

  /**
   * Formatear monto completo con información de moneda
   */
  formatAmountWithInfo(amount: number, currency: Currency): string {
    const info = CURRENCY_INFO[currency]
    const formatted = this.formatAmount(amount, currency)
    return `${formatted} ${info.code}`
  }

  /**
   * Obtener información de moneda
   */
  getCurrencyInfo(currency: Currency): CurrencyInfo {
    return CURRENCY_INFO[currency]
  }

  /**
   * Obtener todas las monedas disponibles
   */
  getAvailableCurrencies(): CurrencyInfo[] {
    return Object.values(CURRENCY_INFO)
  }

  /**
   * Guardar tasas en localStorage
   */
  private saveRatesToStorage(): void {
    try {
      localStorage.setItem('salento_exchange_rates', JSON.stringify({
        rates: this.rates,
        lastUpdate: this.lastUpdate
      }))
    } catch (error) {
      console.error('Error saving rates to storage:', error)
    }
  }

  /**
   * Cargar tasas desde localStorage
   */
  private loadRatesFromStorage(): void {
    try {
      const stored = localStorage.getItem('salento_exchange_rates')
      if (stored) {
        const data = JSON.parse(stored)
        this.rates = data.rates
        this.lastUpdate = data.lastUpdate
      }
    } catch (error) {
      console.error('Error loading rates from storage:', error)
    }
  }

  /**
   * Obtener última actualización
   */
  getLastUpdate(): Date {
    return new Date(this.lastUpdate)
  }

  /**
   * Verificar si las tasas están actualizadas
   */
  areRatesFresh(): boolean {
    return Date.now() - this.lastUpdate < this.updateInterval
  }

  /**
   * Inicializar el servicio
   */
  initialize(): void {
    this.loadRatesFromStorage()
    
    // Actualizar si están desactualizadas o no hay datos
    if (!this.areRatesFresh() || this.lastUpdate === 0) {
      this.updateRates()
    }

    // Actualizar periódicamente
    setInterval(() => {
      this.updateRates()
    }, this.updateInterval)
  }

  /**
   * Calcular equivalencia aproximada para referencia rápida
   */
  getQuickReference(amountCOP: number): Record<Currency, string> {
    return {
      COP: this.formatAmount(amountCOP, 'COP'),
      USD: this.formatAmount(this.convertFromCOP(amountCOP, 'USD'), 'USD'),
      EUR: this.formatAmount(this.convertFromCOP(amountCOP, 'EUR'), 'EUR')
    }
  }
}

// Exportar instancia singleton
export const currencyService = new CurrencyService()
export default currencyService