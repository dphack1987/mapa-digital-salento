import { ArrowRight } from 'lucide-react'
import translationService from '../services/translationService'

const tr = (key: string, fallback?: string): string => translationService.translate(key, fallback)

type ChristmasBannerProps = {
  onExploreMap: () => void
}

/** Banner de temporada navideña bajo el hero (nov–ene). */
export default function ChristmasBanner({ onExploreMap }: ChristmasBannerProps) {
  return (
    <section className="christmas-banner" id="navidad" aria-labelledby="christmas-banner-title">
      <div className="christmas-banner-inner">
        <div className="christmas-banner-copy">
          <p className="eyebrow">{tr('christmas.eyebrow', 'Temporada navideña')}</p>
          <h2 id="christmas-banner-title">{tr('christmas.title', 'Navidad en Salento')}</h2>
          <p className="christmas-banner-text">
            {tr('christmas.text', 'De noviembre a enero, Salento vive su mejor cara: posadas con ofertas especiales, restaurantes con menú navideño, ferias y eventos. Aquí está tu agenda.')}
          </p>
        </div>
        <div className="christmas-banner-actions">
          <a className="dark-button" href="/agenda-eventos-salento.html">
            {tr('christmas.ctaAgenda', 'Ver agenda navideña')} <ArrowRight size={16} />
          </a>
          <button type="button" className="outline-button" onClick={onExploreMap}>
            {tr('christmas.ctaMap', 'Explorar el mapa')} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
