import { ArrowRight } from 'lucide-react'

type HomeBanner = {
  id: string
  eyebrow: string
  title: string
  desc?: string
  href: string
  cta: string
  image: string
  imageAlt: string
  tone?: 'coral' | 'green' | 'ink' | 'yellow' | 'blue'
  size?: 'hero' | 'card'
}

/** Espacio creativo bajo el hero.
 *  Imágenes: *-arte-publicitario.webp en cada carpeta de public/pautas/.
 *  No borres entradas; solo reemplaza rutas/textos si hace falta. */
const BANNERS: HomeBanner[] = [
  {
    id: 'ocaso',
    eyebrow: 'Coffee tour · Alojamiento',
    title: 'Finca Hotel El Ocaso',
    desc: 'Arte creativo del pautante — espacio destacado bajo el hero.',
    href: '/paginas-pautantes/finca-hotel-el-ocaso/',
    cta: 'Ver página',
    image: '/pautas/finca_hotel_el_ocaso/ocaso-arte-publicitario.webp',
    imageAlt: 'Arte publicitario Finca Hotel El Ocaso',
    tone: 'ink',
    size: 'hero',
  },
  {
    id: 'moto',
    eyebrow: 'Experiencias',
    title: 'Moto Aventura 110',
    desc: 'Reserva directo por WhatsApp.',
    href: '/paginas-pautantes/moto-aventura-110/',
    cta: 'Reservar ya',
    image: '/pautas/moto_aventura_110/moto-arte-publicitario.webp',
    imageAlt: 'Arte publicitario Moto Aventura 110',
    tone: 'coral',
    size: 'card',
  },
  {
    id: 'bella',
    eyebrow: 'Atractivo',
    title: 'Parque Mirador La Vida Bella',
    desc: 'Mirador y naturaleza en Salento.',
    href: '/paginas-pautantes/parque-mirador-la-vida-es-bella/',
    cta: 'Explorar',
    image: '/pautas/parque-mirador-la-vida-bella/bella-arte-publicitario.webp',
    imageAlt: 'Arte publicitario Parque Mirador La Vida Bella',
    tone: 'green',
    size: 'card',
  },
]

function BannerCard({ banner }: { banner: HomeBanner }) {
  const isHero = banner.size === 'hero'
  return (
    <a
      className={`home-banner home-banner--${banner.size || 'card'} home-banner--${banner.tone || 'ink'}`}
      href={banner.href}
      aria-label={`${banner.title} — ${banner.cta}`}
    >
      <img
        className="home-banner-media"
        src={banner.image}
        alt={banner.imageAlt}
        loading={isHero ? 'eager' : 'lazy'}
        decoding="async"
        width={isHero ? 1200 : 640}
        height={isHero ? 400 : 360}
      />
      <div className="home-banner-scrim" aria-hidden="true" />
      <div className="home-banner-body">
        <p className="home-banner-eyebrow">{banner.eyebrow}</p>
        <p className={isHero ? 'home-banner-title home-banner-title--hero' : 'home-banner-title'}>{banner.title}</p>
        {banner.desc && <p className="home-banner-desc">{banner.desc}</p>}
        <span className="home-banner-cta">
          {banner.cta} <ArrowRight size={15} aria-hidden="true" />
        </span>
      </div>
    </a>
  )
}

export default function HomeBanners() {
  if (!BANNERS.length) return null
  const [feature, ...rest] = BANNERS

  return (
    <section
      className="home-banners"
      id="disenos"
      aria-labelledby="home-banners-title"
    >
      <div className="home-banners-inner">
        <header className="home-banners-header">
          <div>
            <p className="eyebrow">Diseños · destacados</p>
            <h2 id="home-banners-title">Explora y reserva directo</h2>
          </div>
          <p className="home-banners-note">
            Banners creativos con arte de cada pautante.
          </p>
        </header>

        <div className="home-banners-stage">
          <BannerCard banner={feature} />
          {rest.length > 0 && (
            <div className="home-banners-grid">
              {rest.map((b) => (
                <BannerCard key={b.id} banner={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
