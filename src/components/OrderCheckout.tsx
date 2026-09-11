import { useState } from 'react'
import { X, MessageSquare, CreditCard, Banknote, Smartphone } from 'lucide-react'
import type { MenuItem } from './InteractiveMenu'

type PaymentMethod = 'efectivo' | 'nequi' | 'daviplata'

type CheckoutItem = MenuItem & { quantity: number; note?: string; price: number }

type OrderCheckoutProps = {
  items: CheckoutItem[]
  totalCOP: number
  placeName: string
  whatsapp: string
  onClose: () => void
}

function formatCOP(value: number): string {
  return `$${value.toLocaleString('es-CO')}`
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: typeof Banknote; color: string }[] = [
  { id: 'efectivo', label: 'Efectivo', icon: Banknote, color: '#56755b' },
  { id: 'nequi', label: 'Nequi', icon: Smartphone, color: '#9b59b6' },
  { id: 'daviplata', label: 'Daviplata', icon: CreditCard, color: '#3498db' },
]

function buildOrderMessage(
  items: CheckoutItem[],
  totalCOP: number,
  placeName: string,
  buyerName: string,
  phone: string,
  address: string,
  paymentMethod: PaymentMethod,
  generalNotes: string
): string {
  const lines: string[] = []

  lines.push(`🍽️ *PEDIDO — ${placeName}*`)
  lines.push('')

  lines.push(`👤 *${buyerName}*`)
  lines.push(`📞 *${phone}*`)
  lines.push('')

  lines.push('🛒 *Ítems:*')
  items.forEach((item, i) => {
    const lineTotal = item.price * item.quantity
    lines.push(`${i + 1}. ${item.name} x${item.quantity} — ${formatCOP(lineTotal)}`)
    if (item.note) {
      lines.push(`   📝 ${item.note}`)
    }
  })

  lines.push('')
  lines.push(`💰 *Total: ${formatCOP(totalCOP)} COP*`)

  const paymentLabels: Record<PaymentMethod, string> = {
    efectivo: '💵 Efectivo',
    nequi: '💜 Nequi',
    daviplata: '🔵 Daviplata',
  }
  lines.push(`💳 *Pago: ${paymentLabels[paymentMethod]}*`)

  lines.push('')
  lines.push(`📍 *Entrega: ${address}*`)

  if (generalNotes) {
    lines.push('')
    lines.push(`📝 *Notas: ${generalNotes}*`)
  }

  lines.push('')
  lines.push('✅ Por favor confirmar recepción de este pedido')

  return lines.join('\n')
}

export default function OrderCheckout({ items, totalCOP, placeName, whatsapp, onClose }: OrderCheckoutProps) {
  const [buyerName, setBuyerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo')
  const [generalNotes, setGeneralNotes] = useState('')
  const [sending, setSending] = useState(false)

  const isValid = buyerName.trim().length > 2 && phone.trim().length >= 7 && address.trim().length > 3

  function handleSend() {
    if (!isValid || sending) return
    setSending(true)

    const message = buildOrderMessage(items, totalCOP, placeName, buyerName.trim(), phone.trim(), address.trim(), paymentMethod, generalNotes.trim())
    const digits = whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')

    setTimeout(() => setSending(false), 1500)
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <div>
            <p className="checkout-eyebrow">{items.length} {items.length === 1 ? 'plato' : 'platos'} · {formatCOP(totalCOP)} COP</p>
            <h2 className="checkout-title">Tu pedido</h2>
          </div>
          <button className="checkout-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="checkout-body">
          <div className="checkout-section">
            <h3 className="checkout-section-title">Datos de entrega</h3>

            <label className="checkout-field">
              <span>Nombre completo</span>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                autoComplete="name"
              />
            </label>

            <label className="checkout-field">
              <span>Teléfono</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 313 716 0977"
                autoComplete="tel"
              />
            </label>

            <label className="checkout-field">
              <span>Dirección de entrega</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Boquía, vereda cerca al puente"
                rows={2}
              />
            </label>
          </div>

          <div className="checkout-section">
            <h3 className="checkout-section-title">Método de pago</h3>
            <div className="checkout-payments">
              {PAYMENT_OPTIONS.map((opt) => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`checkout-payment-btn${paymentMethod === opt.id ? ' is-selected' : ''}`}
                    onClick={() => setPaymentMethod(opt.id)}
                    style={{ '--pay-color': opt.color } as React.CSSProperties}
                  >
                    <Icon size={18} />
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="checkout-section">
            <h3 className="checkout-section-title">Resumen del pedido</h3>
            <div className="checkout-summary">
              {items.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <span className="checkout-summary-qty">{item.quantity}x</span>
                  <span className="checkout-summary-name">{item.name}</span>
                  <span className="checkout-summary-price">{formatCOP(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="checkout-summary-total">
                <span>Total</span>
                <span>{formatCOP(totalCOP)} COP</span>
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <label className="checkout-field">
              <span>Notas generales (opcional)</span>
              <textarea
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Ej: Sin picante, llegada rápida..."
                rows={2}
              />
            </label>
          </div>
        </div>

        <div className="checkout-footer">
          <button
            type="button"
            className="checkout-submit"
            onClick={handleSend}
            disabled={!isValid || sending}
          >
            <MessageSquare size={16} />
            <span>{sending ? 'Abriendo WhatsApp...' : 'Enviar pedido por WhatsApp'}</span>
          </button>
          {!isValid && (
            <p className="checkout-hint">Completa nombre, teléfono y dirección para continuar</p>
          )}
        </div>
      </div>
    </div>
  )
}
