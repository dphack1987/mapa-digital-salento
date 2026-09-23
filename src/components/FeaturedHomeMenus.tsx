import { ArrowRight, Clock3, MapPin, MessageCircle, Star } from 'lucide-react'
import type { Place } from '../types'

type FeaturedHomeMenusProps = {
  places: Place[]
}

function formatCOP(value: number): string {
  return `$${value.toLocaleString('es-CO')}`
}

function findPlace(places: Place[], id: number): Place | undefined {
  return places.find((p) => p.id === id)
}

export default function FeaturedHomeMenus({ places }: FeaturedHomeMenusProps) {
  const donElias = findPlace(places, 22)
  const terra = findPlace(places, 28)
  if (!donElias && !terra) return null

  const cards = [donElias, terra].filter(Boolean) as Place[]

  return (
    <section className="home-featured-menus" id="menus-destacados" aria-labelledby="home-featured-menus-title">
      <div className="home-featured-menus-inner">
        <header className="home-featured-menus-header">
          <div>
            <p className="eyebrow">Sabores locales · carta destacada</p>
            <h2 id="home-featured-menus-title">Menú de la casa, sin rodeos.</h2>
            <p className="home-featured-menus-lead">
              Platos verificados de pautantes de Salento y Boquía. Pide o reserva directo por WhatsApp: sin comisiones ni intermediarios.
            </p>
          </div>
          <a className="outline-button home-featured-menus-all" href="/categorias/restaurantes.html">
            Ver todos los restaurantes <ArrowRight size={16} />
          </a>
        </header>

        <div className="home-featured-menus-grid">
          {cards.map((place) => {
            const items = place.foodServiceDetails?.menuItems ?? []
            const highlights = place.foodServiceDetails?.menuHighlights ?? []
            const slug = place.brandSlug || place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            const href = place.actionTarget?.viewUrl || `/paginas-pautantes/${slug}/`
            const wa = place.contact?.whatsapp
            const photo = place.photos?.[0]
            const isTerra = place.id === 28

            return (
              <article key={place.id} className="home-featured-menu-card">
                <div className={`home-featured-menu-media${photo ? ' has-photo' : ''}`}>
                  {photo ? (
                    <img src={photo} alt={`Logo de ${place.name}`} loading="lazy" width={640} height={400} />
                  ) : (
                    <span className="home-featured-menu-emoji" aria-hidden="true">🍽️</span>
                  )}
                  <span className="home-featured-menu-badge">{place.badge || place.type}</span>
                </div>
                <div className="home-featured-menu-body">
                  <div className="home-featured-menu-meta">
                    {place.rating && <span><Star size={13} aria-hidden="true" /> {place.rating}</span>}
                    {place.timeInfo && <span><Clock3 size={13} aria-hidden="true" /> {place.timeInfo}</span>}
                    {place.location?.landmark && <span><MapPin size={13} aria-hidden="true" /> {place.location.landmark}</span>}
                  </div>
                  <h3>{place.name}</h3>
                  <p className="home-featured-menu-desc">{place.description}</p>

                  {items.length > 0 ? (
                    <ul className="home-featured-menu-list">
                      {items.map((item) => (
                        <li key={item.id}>
                          <div>
                            <strong>{item.name}</strong>
                            {item.description && <small>{item.description}</small>}
                          </div>
                          <span className="home-featured-menu-price">{formatCOP(item.price)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="home-featured-menu-list home-featured-menu-list--highlights">
                      {highlights.map((h, i) => (
                        <li key={`${place.id}-h-${i}`}>
                          <div><strong>{h}</strong></div>
                        </li>
                      ))}
                      <li className="home-featured-menu-note">
                        <div>
                          <strong>Carta del día en el restaurante</strong>
                          <small>
                            {isTerra
                              ? 'Especialidades de temporada · confirma carta completa al reservar'
                              : 'Especialidades cafeteras y trucha · confirma carta completa al reservar'}
                          </small>
                        </div>
                      </li>
                    </ul>
                  )}

                  <div className="home-featured-menu-actions">
                    <a className="button primary" href={href}>Ver ficha completa</a>
                    {wa && (
                      <a className="button" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                        <MessageCircle size={15} aria-hidden="true" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
