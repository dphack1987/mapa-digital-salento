import { useMemo, useState } from 'react'
import { MessageSquare, Minus, Plus, Search, ShoppingBag, Star } from 'lucide-react'
import type { Currency } from '../types'
import currencyService from '../services/currencyService'
import translationService from '../services/translationService'

const tr = (key: string, fallback?: string): string => translationService.translate(key, fallback)

export type MenuItem = {
  id: string
  name: string
  priceCOP: number | null
  categoryId: string
  isSpecialty: boolean
}

type MenuCategory = {
  id: string
  label: string
  labelKey: string
  symbol: string
}

const CATEGORIES: MenuCategory[] = [
  { id: 'truchas', label: 'Truchas', labelKey: 'menu.cat.truchas', symbol: '🐟' },
  { id: 'carnes', label: 'Carnes y otros', labelKey: 'menu.cat.carnes', symbol: '🥩' },
  { id: 'acompanamientos', label: 'Acompañamientos', labelKey: 'menu.cat.acompanamientos', symbol: '🍟' },
  { id: 'entradas', label: 'Entradas', labelKey: 'menu.cat.entradas', symbol: '🍲' },
  { id: 'desayuno', label: 'Desayuno', labelKey: 'menu.cat.desayuno', symbol: '🍳' },
  { id: 'bebidas', label: 'Bebidas', labelKey: 'menu.cat.bebidas', symbol: '🥤' },
  { id: 'carta', label: 'Carta', labelKey: 'menu.cat.carta', symbol: '🍽️' },
]

function normalize(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function parseMenuItem(raw: string, index: number): MenuItem {
  const match = raw.trim().match(/^(.*?)\s*\$\s*([\d.,]+)\s*$/)
  if (!match) {
    return { id: `item-${index}`, name: raw.trim(), priceCOP: null, categoryId: 'carta', isSpecialty: false }
  }
  const priceCOP = Number(match[2].replace(/[.,]/g, '')) || null
  return { id: `item-${index}`, name: match[1].trim(), priceCOP, categoryId: 'carta', isSpecialty: false }
}

function categorizeItem(name: string): string {
  const n = normalize(name)
  if (/(jugo|limonada|cafe|chocolate|agua|gaseosa|cerveza|te |malteada|batido|granizado|soda|vino|coctel|leche)/.test(n)) return 'bebidas'
  if (/(huevo|calentado|desayuno|perico)/.test(n)) return 'desayuno'
  if (/(patacon|empanada|salchipapa|papa|yuca|arepa|platano|ensalada)/.test(n)) return 'acompanamientos'
  if (/(crema|sopa|consome|ceviche)/.test(n)) return 'entradas'
  if (/(trucha)/.test(n)) return 'truchas'
  if (/(mojarra|carne|pollo|cerdo|lomo|costilla|chuleta|pescado|camaron|langostino|churrasco)/.test(n)) return 'carnes'
  return 'carta'
}

function formatCOP(value: number): string {
  return `$${value.toLocaleString('es-CO')}`
}

function isValidWhatsApp(whatsapp?: string): boolean {
  const digits = (whatsapp ?? '').replace(/\D/g, '')
  return /^57\d{9,10}$/.test(digits)
}

type InteractiveMenuProps = {
  placeName: string
  whatsapp?: string
  menuHighlights: string[]
  specialties?: string[]
  currency?: Currency
}

export default function InteractiveMenu({ placeName, whatsapp, menuHighlights, specialties = [], currency = 'COP' }: InteractiveMenuProps) {
  const [query, setQuery] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const specialtySet = useMemo(() => new Set(specialties.map((s) => normalize(s))), [specialties])

  const items = useMemo<MenuItem[]>(() => {
    return menuHighlights.map((raw, index) => {
      const parsed = parseMenuItem(raw, index)
      const normalizedName = normalize(parsed.name)
      const isSpecialty = [...specialtySet].some((s) => s.length > 3 && (normalizedName.includes(s) || s.includes(normalizedName)))
      return { ...parsed, categoryId: categorizeItem(parsed.name), isSpecialty }
    })
  }, [menuHighlights, specialtySet])

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return items
    return items.filter((item) => normalize(item.name).includes(q))
  }, [items, query])

  const visibleCategories = useMemo(() => {
    return CATEGORIES.map((cat) => ({ ...cat, items: filtered.filter((item) => item.categoryId === cat.id) })).filter(
      (cat) => cat.items.length > 0
    )
  }, [filtered])

  const { totalCOP, totalCount } = useMemo(() => {
    let total = 0
    let count = 0
    for (const item of items) {
      const qty = quantities[item.id] ?? 0
      if (qty > 0 && item.priceCOP) {
        total += qty * item.priceCOP
        count += qty
      }
    }
    return { totalCOP: total, totalCount: count }
  }, [items, quantities])

  function changeQty(id: string, delta: number) {
    setQuantities((prev) => {
      const next = Math.max(0, Math.min(20, (prev[id] ?? 0) + delta))
      if (next === 0) {
        const { [id]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  function displayPrice(priceCOP: number | null): string {
    if (priceCOP === null) return tr('menu.consultPrice', 'Precio a confirmar')
    if (currency === 'COP') return formatCOP(priceCOP)
    try {
      return currencyService.formatAmount(currencyService.convertFromCOP(priceCOP, currency), currency)
    } catch {
      return formatCOP(priceCOP)
    }
  }

  function orderViaWhatsApp() {
    if (!isValidWhatsApp(whatsapp)) return
    const lines = items
      .filter((item) => (quantities[item.id] ?? 0) > 0 && item.priceCOP)
      .map((item) => `• ${quantities[item.id]}x ${item.name} — ${formatCOP((quantities[item.id] ?? 0) * (item.priceCOP ?? 0))}`)
    const message = [`Hola, quiero hacer este pedido en ${placeName}:`, ...lines, `Total: ${formatCOP(totalCOP)} COP`].join('\n')
    window.open(`https://wa.me/${(whatsapp ?? '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const whatsappOk = isValidWhatsApp(whatsapp)

  return (
    <section className="imenu" aria-label={`Menú interactivo de ${placeName}`}>
      <p className="eyebrow">Carta interactiva</p>
      <h2>Menú: arma tu pedido</h2>
      <p className="imenu-hint">Toca + para agregar platos. El total se calcula solo y el pedido llega directo al pautante por WhatsApp, sin intermediarios ni comisiones.</p>

      <div className="imenu-search" role="search">
        <Search size={15} aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tr('menu.searchPh')}
          aria-label={tr('menu.searchPh')}
        />
      </div>

      <nav className="imenu-pills" aria-label="Categorías del menú">
        {visibleCategories.map((cat) => (
          <a key={cat.id} href={`#imenu-${cat.id}`} className="imenu-pill">
            <span aria-hidden>{cat.symbol}</span> {cat.label} ({cat.items.length})
          </a>
        ))}
      </nav>

      {visibleCategories.length === 0 && <p className="imenu-empty">{tr('menu.emptyA')} “{query}”. {tr('menu.emptyB')}</p>}

      {visibleCategories.map((cat) => (
        <div key={cat.id} id={`imenu-${cat.id}`} className="imenu-category">
          <h3 className="imenu-category-title">
            <span aria-hidden>{cat.symbol}</span> {tr(cat.labelKey, cat.label)}
          </h3>
          <ul className="imenu-list">
            {cat.items.map((item) => {
              const qty = quantities[item.id] ?? 0
              return (
                <li key={item.id} className={`imenu-item${qty > 0 ? ' is-selected' : ''}`}>
                  <span className="imenu-symbol" aria-hidden>{cat.symbol}</span>
                  <div className="imenu-item-copy">
                    <strong>{item.name}</strong>
                    <span className="imenu-price">{displayPrice(item.priceCOP)}</span>
                    {item.isSpecialty && (
                      <span className="imenu-badge"><Star size={11} aria-hidden /> {tr('menu.specialty', 'Especialidad de la casa')}</span>
                    )}
                  </div>
                  {item.priceCOP !== null ? (
                    <div className="imenu-stepper" role="group" aria-label={`Cantidad de ${item.name}`}>
                      <button type="button" className="imenu-step-btn" onClick={() => changeQty(item.id, -1)} disabled={qty === 0} aria-label={`Quitar uno de ${item.name}`}>
                        <Minus size={15} />
                      </button>
                      <span className="imenu-qty" aria-live="polite">{qty}</span>
                      <button type="button" className="imenu-step-btn is-add" onClick={() => changeQty(item.id, 1)} aria-label={`Agregar uno de ${item.name}`}>
                        <Plus size={15} />
                      </button>
                    </div>
                  ) : (
                    <span className="imenu-consult">{tr('menu.consultPrice', 'Precio a confirmar')}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <div className="imenu-totalbar" aria-live="polite">
        <div className="imenu-total-copy">
          <span className="imenu-total-icon" aria-hidden><ShoppingBag size={18} /></span>
          <div>
            <strong>{totalCount === 0 ? tr('menu.totalEmpty') : `${totalCount} ${totalCount === 1 ? tr('menu.unit1', 'plato') : tr('menu.unitN', 'platos')} ${tr('menu.inOrder', 'en tu pedido')}`}</strong>
            <span className="imenu-total-amount">{tr('menu.total', 'Total')}: {currency === 'COP' ? `${formatCOP(totalCOP)} COP` : displayPrice(totalCOP)}</span>
          </div>
        </div>
        <button type="button" className="imenu-order-btn" onClick={orderViaWhatsApp} disabled={totalCount === 0 || !whatsappOk}>
          <MessageSquare size={16} aria-hidden /> {tr('menu.orderBtn')}
        </button>
        {!whatsappOk && <small className="imenu-note">{tr('menu.noWhatsapp')}</small>}
      </div>
    </section>
  )
}
