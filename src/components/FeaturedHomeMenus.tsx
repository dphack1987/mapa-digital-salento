import { ArrowRight, Clock3, MapPin, MessageCircle, Star, Utensils, ShoppingBag, Coffee } from 'lucide-react'
import type { Place } from '../types'
import { placeCtaLabel } from '../utils/placeCta'

type FeaturedHomeMenusProps = {
  places: Place[]
}

function hasPautasAsset(place: Place): boolean {
  return (place.photos || []).some((src) => String(src).startsWith('/pautas/'))
}

function getMenuItems(place: Place) {
  const items: Array<{name: string; price: number; category?: string}> = []
  if (place.foodServiceDetails?.menuItems?.length) {
    items.push(...place.foodServiceDetails.menuItems.slice(0, 6).map(m => ({ name: m.name, price: m.price, category: m.category })))
  }
  if (place.foodServiceDetails?.menuHighlights?.length && items.length < 6) {
    const highlights = place.foodServiceDetails.menuHighlights.slice(0, 6 - items.length)
    highlights.forEach(h => {
      const match = h.match(/^(.+?)\s+\$?([\d.,]+)/)
      if (match) {
        items.push({ name: match[1].trim(), price: parseInt(match[2].replace(/[.,]/g, '')) })
      }
    })
  }
  return items
}

export default function FeaturedHomeMenus({ places }: FeaturedHomeMenusProps) {
  const candidates = places.filter(
    (p) =>
      (p.foodServiceDetails?.menuItems?.length || p.foodServiceDetails?.menuHighlights?.length || p.name === 'Fonda Boquía') &&
      (p.type === 'Restaurantes' || p.type === 'Restaurante Bar' || p.type === 'Cafés'),
  )
  if (!candidates.length) return null

  const preferredIds = [22, 28]
  const pautasAssets = candidates.filter((p) => p.isPautante && hasPautasAsset(p))
  const pautasPreferred = preferredIds
    .map((id) => pautasAssets.find((p) => p.id === id))
    .filter(Boolean) as Place[]
  const pautasRest = pautasAssets.filter((p) => !preferredIds.includes(p.id))
  const seen = new Set([...pautasPreferred, ...pautasRest].map((p) => p.id))
  const others = candidates.filter((p) => !seen.has(p.id))
  const cards = [...pautasPreferred, ...pautasRest, ...others]
  if (!cards.length) return null

  return (
    <section className="home-featured-menus" id="menus-destacados" aria-labelledby="home-featured-menus-title">
      <div className="home-featured-menus-inner">
        <header className="home-featured-menus-header">
          <div>
            <h2 id="home-featured-menus-title">Restaurantes con carta</h2>
          </div>
          <a className="outline-button home-featured-menus-all" href="/categorias/restaurantes.html">
            Ver todos <ArrowRight size={16} />
          </a>
        </header>

        <div className="home-featured-menus-grid">
          {cards.map((place) => {
            const slug = place.brandSlug || place.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            const href = place.actionTarget?.viewUrl || `/paginas-pautantes/${slug}/`
            const wa = place.contact?.whatsapp
            const photo = place.photos?.[0]
            const menuItems = getMenuItems(place)
            const hasMenu = menuItems.length > 0

            return (
              <article key={place.id} className="home-featured-menu-card">
                <a className="home-featured-menu-link" href={href} aria-label={`Ver página de ${place.name}`}>
                  <div className={`home-featured-menu-media${photo ? ' has-photo' : ''}`}>
                    {photo ? (
                      <img src={photo} alt={`Logo de ${place.name}`} loading="lazy" width={640} height={400} />
                    ) : (
                      <span className="home-featured-menu-emoji" aria-hidden="true">🍽️</span>
                    )}
                    <span className="home-featured-menu-badge">{place.badge || place.type}</span>
                  </div>
                </a>
                <div className="home-featured-menu-body">
                  <div className="home-featured-menu-meta">
                    {place.rating && <span><Star size={13} aria-hidden="true" /> {place.rating}</span>}
                    {place.timeInfo && <span><Clock3 size={13} aria-hidden="true" /> {place.timeInfo}</span>}
                    {place.location?.landmark && <span><MapPin size={13} aria-hidden="true" /> {place.location.landmark}</span>}
                  </div>
                  <h3><a href={href}>{place.name}</a></h3>
                  <p className="home-featured-menu-desc">{place.description}</p>

                  {hasMenu && (
                    <div className="home-featured-menu-card-list">
                      <h4><Utensils size={14} aria-hidden="true" /> Menú destacado</h4>
                      <ul>
                        {menuItems.map((item, idx) => (
                          <li key={idx}>
                            <span className="menu-item-name">{item.name}</span>
                            <span className="menu-item-price">${item.price.toLocaleString('es-CO')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="home-featured-menu-actions">
                    <a className="button primary" href={href}>
                      {placeCtaLabel(place.type)}
                    </a>
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