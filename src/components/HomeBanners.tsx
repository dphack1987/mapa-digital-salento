import { useEffect, useState } from 'react'
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
 *  No borres entradas; solo reemplaza rutas/textos si hace falta.
 *  Los banners rotan solos para que todos los pautantes tengan el mismo tiempo en pantalla. */
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
  {
    id: 'eduardo',
    eyebrow: 'Coffee tour',
    title: 'Finca Don Eduardo',
    desc: 'Siembra, cata y recorrido por la finca.',
    href: '/paginas-pautantes/finca-don-eduardo-coffee-tour/',
    cta: 'Ver página',
    image: '/pautas/coffee-tour-finca-don-eduardo/eduardo-arte-publicitario.webp',
    imageAlt: 'Arte publicitario Finca Don Eduardo',
    tone: 'yellow',
    size: 'card',
  },
  {
    id: 'cootracocora',
    eyebrow: 'Transporte',
    title: 'Cootracocora',
    desc: 'Jeeps y rutas hacia el Valle de Cocora.',
    href: '/paginas-pautantes/cootracocora-ltda/',
    cta: 'Ver rutas',
    image: '/pautas/cootracocora_ltda/cootracocora-arte-publicitario.webp',
    imageAlt: 'Arte publicitario Cootracocora',
    tone: 'blue',
    size: 'card',
  },
  {
    id: 'fonda',
    eyebrow: 'Gastronomía',
    title: 'Fonda Boquía',
    desc: 'Trucha y cocina casera a orillas del río.',
    href: '/paginas-pautantes/fonda-boquia/',
    cta: 'Ver carta',
    image: '/pautas/restaurante_bar_fonda_boquia/fonda-arte-publicitario.webp',
    imageAlt: 'Arte publicitario Fonda Boquía',
    tone: 'coral',
    size: 'card',
  },
  {
    id: 'rita',
    eyebrow: 'Naturaleza',
    title: 'Cascadas de Santa Rita',
    desc: 'Senderos, pozos y cascadas en Salento.',
    href: '/paginas-pautantes/reserva-natural-cascadas-de-santa-rita/',
    cta: 'Explorar',
    image: '/pautas/reserva-natural-cascadas-de-santa-rita/rita-arte-publicitario.webp',
    imageAlt: 'Arte publicitario Cascadas de Santa Rita',
    tone: 'green',
    size: 'card',
  },
  {
    id: 'nacional',
    eyebrow: 'Alojamiento',
    title: 'Hotel Camino Nacional',
    desc: 'Habitaciones céntricas en Salento.',
    href: '/paginas-pautantes/hotel-camino-nacional-salento/',
    cta: 'Reservar',
    image: '/pautas/hotel_camino_nacional/nacional-arte-publicitario.webp',
    imageAlt: 'Arte publicitario Hotel Camino Nacional',
    tone: 'ink',
    size: 'card',
  },
  {
    id: 'mahalo',
    eyebrow: 'Alojamiento',
    title: 'Mahalo Hostel',
    desc: 'Habitaciones y dormitorios compartidos.',
    href: '/paginas-pautantes/mahalo-hostel-salento/',
    cta: 'Reservar',
    image: '/pautas/mahalo_hostel/mahalo-arte-publicitaria.webp',
    imageAlt: 'Arte publicitario Mahalo Hostel',
    tone: 'yellow',
    size: 'card',
  },
  {
    id: 'barranqueros',
    eyebrow: 'Alojamiento',
    title: 'Los Barranqueros Hotel',
    desc: 'Descanso tranquilo a 250 m de la plaza.',
    href: '/paginas-pautantes/los-barranqueros-hotel/',
    cta: 'Conocer el hotel',
    image: '/pautas/hotel-barranqueros/barranqueros-arte-publicitario.webp',
    imageAlt: 'Arte publicitario Los Barranqueros Hotel',
    tone: 'blue',
    size: 'card',
  },
  {
    id: 'boki',
    eyebrow: 'Restaurante',
    title: 'Boki Mall · Restaurante Terra',
    desc: 'Cocina de autor y cafés en Boquía.',
    href: '/paginas-pautantes/boki-mall-restaurante-terra/',
    cta: 'Ver carta',
    image: '/pautas/boki_mall/imagenes/images%20(1).webp',
    imageAlt: 'Boki Mall Restaurante Terra en Salento',
    tone: 'coral',
    size: 'card',
  },
  {
    id: 'cabalgatas',
    eyebrow: 'Experiencias',
    title: 'Cabalgatas Cocora Mágica',
    desc: 'Cabalgata por el Valle de Cocora.',
    href: '/paginas-pautantes/cabalgatas-cocora-magica/',
    cta: 'Reservar',
    image: '/pautas/cabalgatas_cocora_magica/imagenes/cabalgatas-en-el-valle-de-cocora-6.webp',
    imageAlt: 'Cabalgatas en el Valle de Cocora',
    tone: 'green',
    size: 'card',
  },
  {
    id: 'ocaso-tour',
    eyebrow: 'Coffee tour',
    title: 'Coffee Tour El Ocaso',
    desc: 'Del cafetal a la taza en la finca.',
    href: '/paginas-pautantes/coffee-tour-alojamiento-finca-hotel-el-ocaso/',
    cta: 'Ver página',
    image: '/pautas/coffee-tour-alojamiento-finca-hotel-el-ocaso/imagenes/foto_casa_ocaso.webp',
    imageAlt: 'Finca Hotel El Ocaso',
    tone: 'ink',
    size: 'card',
  },
  {
    id: 'don-elias-tour',
    eyebrow: 'Coffee tour',
    title: 'Coffee Tour Finca Don Elías',
    desc: 'Café de origen con vista al valle.',
    href: '/paginas-pautantes/coffee-tour-finca-cafetera-don-elias/',
    cta: 'Ver página',
    image: '/pautas/coffee-tour-finca-cafetera-don-elias/imagenes/cafe-don-elias.webp',
    imageAlt: 'Coffee tour Finca Don Elías',
    tone: 'yellow',
    size: 'card',
  },
  {
    id: 'recuerdo',
    eyebrow: 'Coffee tour',
    title: 'El Recuerdo Coffee Tour',
    desc: 'Finca familiar y procesamiento artesanal.',
    href: '/paginas-pautantes/el-recuerdo-coffee-tour/',
    cta: 'Ver página',
    image: '/pautas/el_recuerdo_coffee_tour/imagenes/recuerdopaisaje1.webp',
    imageAlt: 'El Recuerdo Coffee Tour',
    tone: 'green',
    size: 'card',
  },
  {
    id: 'floresta',
    eyebrow: 'Alojamiento',
    title: 'Hotel La Floresta',
    desc: 'Hotel boutique con mirador propio.',
    href: '/paginas-pautantes/hotel-la-floresta-salento/',
    cta: 'Reservar',
    image: '/pautas/hotel_la_floresta_salento/imagenes/lafloresta-fachada.webp',
    imageAlt: 'Fachada Hotel La Floresta',
    tone: 'blue',
    size: 'card',
  },
  {
    id: 'tia-emiss',
    eyebrow: 'Alojamiento',
    title: 'Hotel La Tía Emiss',
    desc: 'Hospedaje familiar en Salento.',
    href: '/paginas-pautantes/hotel-la-tia-emiss/',
    cta: 'Reservar',
    image: '/pautas/hotel_tia_emiss/imagenes/sala-al-aire-libre-del.webp',
    imageAlt: 'Hotel La Tía Emiss',
    tone: 'yellow',
    size: 'card',
  },
  {
    id: 'salento-real',
    eyebrow: 'Alojamiento',
    title: 'Hotel Salento Real',
    desc: 'Hotel boutique colonial con suites y jacuzzi.',
    href: '/paginas-pautantes/hotel-salento-real/',
    cta: 'Reservar',
    image: '/pautas/hotel_salento_real/imagenes/hotel-salento-real-jacuzzi.webp',
    imageAlt: 'Hotel Salento Real',
    tone: 'blue',
    size: 'card',
  },
  {
    id: 'downhill-bike',
    eyebrow: 'Experiencia',
    title: 'Downhill Bike Salento',
    desc: 'Bicicleta, caminatas y cabalgatas en Salento.',
    href: '/paginas-pautantes/downhill-bike-salento/',
    cta: 'Explorar',
    image: '/pautas/downhill_bike_salento/imagenes/downhill-bike-salento-g45.webp',
    imageAlt: 'Downhill Bike Salento',
    tone: 'green',
    size: 'card',
  },
  {
    id: 'ruta-navarco',
    eyebrow: 'Experiencia',
    title: 'Ruta Navarco',
    desc: '4 fincas comunitarias en Willys.',
    href: '/paginas-pautantes/ruta-navarco/',
    cta: 'Explorar',
    image: '/pautas/ruta-navarco/salento-tesoros-trapiche.webp',
    imageAlt: 'Ruta Navarco fincas',
    tone: 'coral',
    size: 'card',
  },
  {
    id: 'manos-dios',
    eyebrow: 'Atractivo',
    title: 'Mirador Las Manos de Dios',
    desc: 'Vista panorámica al Valle de Cocora.',
    href: '/paginas-pautantes/mirador-las-manos-de-dios/',
    cta: 'Explorar',
    image: '/pautas/mirador_mano_de_dios/imagenes/dios2.webp',
    imageAlt: 'Mirador Las Manos de Dios',
    tone: 'green',
    size: 'card',
  },
  {
    id: 'don-elias',
    eyebrow: 'Gastronomía',
    title: 'Restaurante Don Elías',
    desc: 'Trucha en finca cafetera de Vereda Palestina.',
    href: '/paginas-pautantes/restaurante-don-elias/',
    cta: 'Ver carta',
    image: '/imagenes-salento/Trucha-con-camarones-Salento-Quindio-1024x768.jpeg.webp',
    imageAlt: 'Trucha de la cocina salentina',
    tone: 'coral',
    size: 'card',
  },
  {
    id: 'green-house',
    eyebrow: 'Alojamiento',
    title: 'Hotel Green House',
    desc: 'Habitaciones familiares en Salento.',
    href: '/paginas-pautantes/hotel-green-house-salento/',
    cta: 'Reservar',
    image: '/pautas/hotel-green-house/imagenes/green-house-banner.webp',
    imageAlt: 'Banner Hotel Green House Salento',
    tone: 'green',
    size: 'card',
  },
  {
    id: 'shalem',
    eyebrow: 'Restaurante · Bar',
    title: 'Shalem Restaurante Bar',
    desc: 'Carta real con fotos de cada plato.',
    href: '/paginas-pautantes/shalem-restaurante-bar/',
    cta: 'Ver carta',
    image: '/pautas/restaurante-bar-shalem/imagenes/shalem-home-banner.webp',
    imageAlt: 'Shalem Restaurante Bar en Salento',
    tone: 'coral',
    size: 'card',
  },
  {
    id: 'manos-cocora',
    eyebrow: 'Atractivo',
    title: 'Mirador Manos de Cocora',
    desc: 'Manos gigantes, deslizadora y paisaje.',
    href: '/paginas-pautantes/mirador-manos-de-cocora/',
    cta: 'Explorar',
    image: '/pautas/mirador-manos-de-cocora/imagenes/7.-deslizadora-tricolor-nueva-manos-de-cocora-2.webp',
    imageAlt: 'Mirador Manos de Cocora',
    tone: 'blue',
    size: 'card',
  },
  {
    id: 'boki-bar',
    eyebrow: 'Café · Bar',
    title: 'Boki Mall · Barcinales',
    desc: 'Café de especialidad en Boquía.',
    href: '/paginas-pautantes/boki-mall-barcinales-cafe-bar/',
    cta: 'Ver página',
    image: '/pautas/boki_mall/imagenes/314270821.webp',
    imageAlt: 'Barcinales Café Bar de Boki Mall',
    tone: 'ink',
    size: 'card',
  },
  {
    id: 'boki-eventos',
    eyebrow: 'Eventos',
    title: 'Boki Mall · Eventos',
    desc: 'Celebraciones y eventos corporativos.',
    href: '/paginas-pautantes/boki-mall-eventos/',
    cta: 'Consultar',
    image: '/pautas/boki_mall/imagenes/images%20(2).webp',
    imageAlt: 'Espacio de eventos de Boki Mall',
    tone: 'yellow',
    size: 'card',
  },
  {
    id: 'boki-hotel',
    eyebrow: 'Alojamiento',
    title: 'Hotel El Mirador de Boquía',
    desc: 'Habitaciones con vista al valle.',
    href: '/paginas-pautantes/boki-mall-hotel-el-mirador-de-boquia/',
    cta: 'Reservar',
    image: '/pautas/boki_mall/imagenes/Hotel_Mirador_de_Boquia_1747081077351.webp',
    imageAlt: 'Hotel El Mirador de Boquía',
    tone: 'blue',
    size: 'card',
  },
  {
    id: 'camping-rita',
    eyebrow: 'Camping',
    title: 'Camping Cascadas de Santa Rita',
    desc: 'Pasadía, camping y habitaciones.',
    href: '/paginas-pautantes/camping-cascadas-de-santa-rita/',
    cta: 'Reservar',
    image: '/pautas/reserva-natural-cascadas-de-santa-rita/imagenes/cascada2.webp',
    imageAlt: 'Cascadas de Santa Rita',
    tone: 'green',
    size: 'card',
  },
]

const ROTATION_MS = 6000

function BannerCard({ banner, size }: { banner: HomeBanner; size: 'hero' | 'card' }) {
  const isHero = size === 'hero'
  return (
    <a
      className={`home-banner home-banner--${size} home-banner--${banner.tone || 'ink'}`}
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
  const total = BANNERS.length
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (total <= 3) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setOffset((prev) => (prev + 1) % total), ROTATION_MS)
    return () => window.clearInterval(id)
  }, [total])

  if (!total) return null

  const visible = [0, 1, 2, 3, 4, 5, 6].map((i) => BANNERS[(offset + i) % total])
  const [feature, ...rest] = visible

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
          <BannerCard key={`hero-${feature.id}`} banner={feature} size="hero" />
          {rest.length > 0 && (
            <div className="home-banners-grid">
              {rest.map((b) => (
                <BannerCard key={`${offset}-${b.id}`} banner={b} size="card" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
