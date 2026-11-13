import { ArrowRight } from 'lucide-react'
import translationService from '../services/translationService'

const tr = (key: string, fallback?: string): string => translationService.translate(key, fallback)

type ChristmasBannerProps = {
  onExploreMap: () => void
}

/** Nochebuena estilizada: la flor navideña colombiana, motivo original de la temporada. */
function Poinsettia({ className }: { className?: string }) {
  const outer = [0, 51.4, 102.9, 154.3, 205.7, 257.1, 308.6]
  const inner = outer.map((a) => a + 25.7)
  const petal = 'M0 0C-9 -11 -8.5 -25 0 -37C8.5 -25 9 -11 0 0Z'
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g transform="translate(50 52)">
        {outer.map((a) => (
          <path key={`o${a}`} d={petal} transform={`rotate(${a})`} fill="#c93f2b" stroke="rgba(246,215,142,.85)" strokeWidth="1.1" />
        ))}
        {inner.map((a) => (
          <path key={`i${a}`} d={petal} transform={`rotate(${a}) scale(.62)`} fill="#a93222" stroke="rgba(246,215,142,.7)" strokeWidth="1.4" />
        ))}
        <circle r="6" fill="#e8a33d" stroke="#f6d78e" strokeWidth="1" />
        <circle cx="0" cy="-10" r="1.8" fill="#f9e7b8" />
        <circle cx="8.5" cy="4.5" r="1.8" fill="#f9e7b8" />
        <circle cx="-8.5" cy="4.5" r="1.8" fill="#f9e7b8" />
      </g>
    </svg>
  )
}

/** Banner de temporada navideña bajo el hero (nov–ene): marco dorado + nochebuena. */
export default function ChristmasBanner({ onExploreMap }: ChristmasBannerProps) {
  return (
    <section className="christmas-banner" id="navidad" aria-labelledby="christmas-banner-title">
      <div className="christmas-banner-inner">
        <span className="christmas-frame" aria-hidden="true">
          <i className="c-tl" /><i className="c-tr" /><i className="c-bl" /><i className="c-br" />
        </span>
        <Poinsettia className="christmas-poinsettia" />
        <div className="christmas-banner-copy">
          <p className="eyebrow">✦ {tr('christmas.eyebrow', 'Temporada navideña')} ✦</p>
          <h2 id="christmas-banner-title">{tr('christmas.title', 'Navidad en Salento')}</h2>
          <div className="christmas-divider" aria-hidden="true"><span /><b>◆</b><span /></div>
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
