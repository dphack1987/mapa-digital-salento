import { useMemo, useState, useRef, useCallback } from 'react'
import { Minus, Plus, ShoppingBag, Star, ChevronRight, MessageSquare, StickyNote } from 'lucide-react'
import type { Currency, MenuItemData } from '../types'
import currencyService from '../services/currencyService'
import translationService from '../services/translationService'
import OrderCheckout from './OrderCheckout'

const tr = (key: string, fallback?: string): string => translationService.translate(key, fallback)

export type MenuItem = {
  id: string
  name: string
  priceCOP: number | null
  categoryId: string
  isSpecialty: boolean
  description?: string
}

type MenuCategory = {
  id: string
  label: string
  emoji: string
}

const CATEGORIES: MenuCategory[] = [
  { id: 'destacados', label: 'Destacados', emoji: '⭐' },
  { id: 'truchas', label: 'Truchas', emoji: '🐟' },
  { id: 'carnes', label: 'Carnes', emoji: '🥩' },
  { id: 'acompanamientos', label: 'Acompañamientos', emoji: '🍟' },
  { id: 'desayuno', label: 'Desayuno', emoji: '🍳' },
  { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
]

function normalize(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function parseMenuHighlight(raw: string, index: number): MenuItem {
  const match = raw.trim().match(/^(.*?)\s*\$\s*([\d.,]+)\s*$/)
  if (!match) {
    return { id: `item-${index}`, name: raw.trim(), priceCOP: null, categoryId: 'otros', isSpecialty: false }
  }
  const priceCOP = Number(match[2].replace(/[.,]/g, '')) || null
  return { id: `item-${index}`, name: match[1].trim(), priceCOP, categoryId: 'otros', isSpecialty: false }
}

function categorizeItem(name: string): string {
  const n = normalize(name)
  if (/(jugo|limonada|cafe|chocolate|agua|gaseosa|cerveza|te |malteada|batido|granizado|soda|vino|coctel|leche|milo)/.test(n)) return 'bebidas'
  if (/(huevo|calentado|desayuno|perico|chorizo en)/.test(n)) return 'desayuno'
  if (/(patacon|empanada|salchipapa|papa|yuca|arepa|platano|ensalada|arroz|porcion|nuggets|crema|porcion de)/.test(n)) return 'acompanamientos'
  if (/(trucha|mojarra)/.test(n)) return 'truchas'
  if (/(carne|pollo|cerdo|lomo|costilla|chuleta|pescado|camaron|langostino|churrasco|filete)/.test(n)) return 'carnes'
  return 'otros'
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
  menuItems?: MenuItemData[]
  specialties?: string[]
  currency?: Currency
}

export default function InteractiveMenu({ placeName, whatsapp, menuHighlights, menuItems, specialties = [], currency = 'COP' }: InteractiveMenuProps) {
  const [activeCategory, setActiveCategory] = useState('destacados')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({})

  const specialtySet = useMemo(() => new Set(specialties.map((s) => normalize(s))), [specialties])

  const items = useMemo<MenuItem[]>(() => {
    if (menuItems && menuItems.length > 0) {
      return menuItems.map((mi) => ({
        id: mi.id,
        name: mi.name,
        priceCOP: mi.price,
        categoryId: mi.category,
        isSpecialty: mi.isSpecialty ?? false,
        description: mi.description,
      }))
    }

    return menuHighlights.map((raw, index) => {
      const parsed = parseMenuHighlight(raw, index)
      const normalizedName = normalize(parsed.name)
      const isSpecialty = [...specialtySet].some((s) => s.length > 3 && (normalizedName.includes(s) || s.includes(normalizedName)))
      return { ...parsed, categoryId: categorizeItem(parsed.name), isSpecialty }
    })
  }, [menuHighlights, menuItems, specialtySet])

  const visibleCategories = useMemo(() => {
    const cats = CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.id === 'destacados'
        ? items.filter((item) => item.isSpecialty)
        : items.filter((item) => item.categoryId === cat.id),
    })).filter((cat) => cat.items.length > 0)

    const mappedIds = new Set(CATEGORIES.map((c) => c.id))
    const otherItems = items.filter((item) => !mappedIds.has(item.categoryId) && !(item.isSpecialty && cats.some((c) => c.id === 'destacados')))
    if (otherItems.length > 0) {
      cats.push({ id: 'otros', label: 'Otros', emoji: '🍽️', items: otherItems })
    }

    return cats
  }, [items])

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

  const checkoutItems = useMemo(() => {
    return items
      .filter((item) => (quantities[item.id] ?? 0) > 0 && item.priceCOP)
      .map((item) => ({
        ...item,
        priceCOP: item.priceCOP!,
        quantity: quantities[item.id] ?? 0,
        note: notes[item.id],
        price: item.priceCOP!,
      }))
  }, [items, quantities, notes])

  const scrollToCategory = useCallback((catId: string) => {
    setActiveCategory(catId)
    const el = categoryRefs.current[catId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  function addItem(id: string) {
    setQuantities((prev) => ({ ...prev, [id]: Math.min(20, (prev[id] ?? 0) + 1) }))
    setJustAdded(id)
    setTimeout(() => setJustAdded(null), 500)
  }

  function removeItem(id: string) {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) - 1)
      if (next === 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  function displayPrice(priceCOP: number | null): string {
    if (priceCOP === null) return 'A confirmar'
    if (currency === 'COP') return formatCOP(priceCOP)
    try {
      return currencyService.formatAmount(currencyService.convertFromCOP(priceCOP, currency), currency)
    } catch {
      return formatCOP(priceCOP)
    }
  }

  const whatsappOk = isValidWhatsApp(whatsapp)

  return (
    <section className="imenu" aria-label={`Menú de ${placeName}`}>
      <div className="imenu-header">
        <span className="imenu-badge-live"><span className="imenu-badge-dot" /> Carta disponible</span>
        <h2 className="imenu-title">Menú</h2>
        <p className="imenu-subtitle">Toca para agregar. Pedido directo sin comisiones.</p>
      </div>

      <nav className="imenu-tabs" aria-label="Categorías del menú">
        {visibleCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`imenu-tab${activeCategory === cat.id ? ' is-active' : ''}`}
            onClick={() => scrollToCategory(cat.id)}
          >
            <span className="imenu-tab-emoji">{cat.emoji}</span>
            <span className="imenu-tab-label">{cat.label}</span>
          </button>
        ))}
      </nav>

      {visibleCategories.length === 0 && (
        <p className="imenu-empty">No hay platos disponibles.</p>
      )}

      <div className="imenu-grid">
        {visibleCategories.map((cat) => (
          <div
            key={cat.id}
            id={`imenu-${cat.id}`}
            className="imenu-category"
            ref={(el) => { categoryRefs.current[cat.id] = el }}
          >
            <h3 className="imenu-cat-title">
              <span>{cat.emoji}</span> {cat.label}
              <span className="imenu-cat-count">{cat.items.length}</span>
            </h3>
            <div className="imenu-cards">
              {cat.items.map((item) => {
                const qty = quantities[item.id] ?? 0
                const isJustAdded = justAdded === item.id
                const isEditing = editingNote === item.id
                return (
                  <div
                    key={item.id}
                    className={`imenu-card${qty > 0 ? ' has-qty' : ''}${isJustAdded ? ' pop' : ''}`}
                  >
                    <div className="imenu-card-body" onClick={() => item.priceCOP !== null && addItem(item.id)}>
                      <div className="imenu-card-info">
                        <div className="imenu-card-name-row">
                          <span className="imenu-card-name">{item.name}</span>
                          {item.isSpecialty && (
                            <span className="imenu-card-specialty"><Star size={8} /></span>
                          )}
                        </div>
                        {item.description && (
                          <p className="imenu-card-desc">{item.description}</p>
                        )}
                      </div>
                      <span className="imenu-card-price">
                        {item.priceCOP !== null ? displayPrice(item.priceCOP) : 'A confirmar'}
                      </span>
                    </div>

                    {item.priceCOP !== null && (
                      <div className="imenu-card-footer">
                        {qty > 0 ? (
                          <div className="imenu-card-controls">
                            <div className="imenu-card-stepper">
                              <button
                                type="button"
                                className="imenu-step-btn"
                                onClick={(e) => { e.stopPropagation(); removeItem(item.id) }}
                                aria-label={`Quitar ${item.name}`}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="imenu-step-qty">{qty}</span>
                              <button
                                type="button"
                                className="imenu-step-btn is-add"
                                onClick={(e) => { e.stopPropagation(); addItem(item.id) }}
                                aria-label={`Agregar ${item.name}`}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <button
                              type="button"
                              className={`imenu-note-btn${isEditing ? ' is-active' : ''}`}
                              onClick={(e) => { e.stopPropagation(); setEditingNote(isEditing ? null : item.id) }}
                              aria-label={`Nota para ${item.name}`}
                              title="Agregar nota"
                            >
                              <StickyNote size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="imenu-card-add"
                            onClick={(e) => { e.stopPropagation(); addItem(item.id) }}
                            aria-label={`Agregar ${item.name}`}
                          >
                            <Plus size={18} />
                          </button>
                        )}
                      </div>
                    )}

                    {isEditing && (
                      <div className="imenu-card-note">
                        <input
                          type="text"
                          placeholder="Ej: sin cebolla, poco cocida..."
                          value={notes[item.id] ?? ''}
                          onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {totalCount > 0 && (
        <div className="imenu-cart" aria-live="polite">
          <div className="imenu-cart-info">
            <span className="imenu-cart-icon"><ShoppingBag size={18} /></span>
            <div className="imenu-cart-text">
              <strong>{totalCount} {totalCount === 1 ? 'plato' : 'platos'}</strong>
              <span>{formatCOP(totalCOP)} COP</span>
            </div>
          </div>
          <button
            type="button"
            className="imenu-cart-btn"
            onClick={() => setShowCheckout(true)}
          >
            <MessageSquare size={15} />
            <span>Pedir ahora</span>
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {showCheckout && (
        <OrderCheckout
          items={checkoutItems}
          totalCOP={totalCOP}
          placeName={placeName}
          whatsapp={whatsapp ?? ''}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </section>
  )
}
