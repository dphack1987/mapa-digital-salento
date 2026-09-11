import { Utensils, MessageSquare, Truck } from 'lucide-react'

type FeatureCardsProps = {
  compact?: boolean
}

export default function FeatureCards({ compact = false }: FeatureCardsProps) {
  const cards = [
    {
      icon: Utensils,
      title: 'Pide de tus\nrestaurantes favoritos.',
      desc: 'Encontrarás una gran variedad de restaurantes y tipos de comida. Tu restaurante favorito está a un clic de distancia.',
      color: 'var(--coral)',
      bg: 'linear-gradient(135deg, #e76c52 0%, #d4573e 100%)',
    },
    {
      icon: MessageSquare,
      title: 'Pide sin\ncomplicaciones.',
      desc: '¿Quieres trucha, una hamburguesa o algo típico? Pedir es fácil y rápido. Paga con efectivo, Nequi o Daviplata.',
      color: 'var(--green)',
      bg: 'linear-gradient(135deg, #56755b 0%, #3d5a42 100%)',
    },
    {
      icon: Truck,
      title: 'Entrega\nrápida.',
      desc: 'Los socios locales garantizan que los pedidos se entreguen rápidamente y en perfectas condiciones.',
      color: '#27362b',
      bg: 'linear-gradient(135deg, #27362b 0%, #1a2620 100%)',
    },
  ]

  if (compact) {
    return (
      <div className="feature-cards feature-cards--compact">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="feature-card feature-card--mini" style={{ background: card.bg }}>
              <div className="feature-card-icon"><Icon size={20} /></div>
              <span className="feature-card-title-mini">{card.title.replace('\n', ' ')}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section className="feature-cards" aria-label="Cómo funciona">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <div key={i} className="feature-card" style={{ background: card.bg }}>
            <div className="feature-card-content">
              <h3 className="feature-card-title">{card.title}</h3>
              <p className="feature-card-desc">{card.desc}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
