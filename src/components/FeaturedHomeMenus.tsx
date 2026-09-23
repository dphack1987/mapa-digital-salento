import { ArrowRight, Clock3, MapPin, MessageCircle, Star } from 'lucide-react'
import type { Place } from '../types'
import { placeCtaLabel } from '../utils/placeCta'

type FeaturedHomeMenusProps = {
  places: Place[]
}

function hasPautasAsset(place: Place): boolean {
  return (place.photos || []).some((src) => String(src).startsWith('/pautas/'))
}

export default function FeaturedHomeMenus({ places }: FeaturedHomeMenusProps) {
  const candidates = places.filter(
    (p) =>
      (p.foodServiceDetails?.menuItems?.length || p.foodServiceDetails?.menuHighlights?.length || p.name === 'Fonda Boquía') &&
      (p.type === 'Restaurantes' || p.type === 'Restaurante Bar' || p.type === 'Cafés'),
  )
  if (!candidates.length) return null

  // Prioridad comercial: pautantes con assets en /pautas/ primero; luego el resto
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
            <p className="eyebrow">Sabores locales · carta destacada</p>
            <h2 id="home-featured-menus-title">Menú de la casa, sin rodeos.</h2>
            <p className="home-featured-menus-lead">
              Pautantes de Salento y Boquía. Entra a cada página para ver su carta completa y pedir o reservar directo por WhatsApp.
            </p>
          </div>
          <a className="outline-button home-featured-menus-all" href="/categorias/restaurantes.html">
            Ver todos los restaurantes <ArrowRight size={16} />
          </a>
        </header>

        <div className="home-featured-menus-grid">
          {cards.map((place) => {
            const slug = place.brandSlug || place.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            const href = place.actionTarget?.viewUrl || `/paginas-pautantes/${slug}/`
            const wa = place.contact?.whatsapp
            const photo = place.photos?.[0]
            const itemCount = place.foodServiceDetails?.menuItems?.length || 0

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
                  <p className="home-featured-menu-hint">
                    {itemCount > 0
                      ? `Carta con ${itemCount} platos en su página`
                      : 'Carta completa en su página'}
                  </p>

                  <div className="home-featured-menu-actions">
                    <a className="button primary" href={href}>{placeCtaLabel(place.type)}</a>
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
