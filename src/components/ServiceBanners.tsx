import { ArrowRight } from 'lucide-react'

type ServiceBanner = {
  id: string
  title: string
  description: string
  image: string
  href: string
  cta: string
}

const SERVICE_BANNERS: ServiceBanner[] = [
  {
    id: 'domicilios',
    title: 'Pedidos a Domicilio',
    description: 'Pide directamente a restaurantes y comercios sin intermediarios. WhatsApp directo.',
    image: '/banners/banner-domicilios.jpg',
    href: '/servicios/pedidos-domicilio.html',
    cta: 'Ver Servicios'
  },
  {
    id: 'realidad-aumentada',
    title: 'Realidad Aumentada',
    description: 'Apunta tu celular y descubre lugares turísticos en tiempo real. Funciona offline.',
    image: '/banners/banner-realidad-aumentada.jpg',
    href: '/servicios/realidad-aumentada.html',
    cta: 'Probar AR'
  },
  {
    id: 'reservas',
    title: 'Reservas de Hoteles',
    description: 'Reserva hoteles y alojamientos directamente por WhatsApp. Sin comisiones.',
    image: '/banners/banner-reservas.jpg',
    href: '/servicios/reservas-hoteles.html',
    cta: 'Ver Hoteles'
  },
  {
    id: 'transporte',
    title: 'Servicio de Transporte',
    description: 'Jeeps Willys, buses y transporte turístico. Contacto directo con proveedores.',
    image: '/banners/banner-servicio-transporte.jpg',
    href: '/servicios/transporte-salento.html',
    cta: 'Ver Transporte'
  }
]

export default function ServiceBanners() {
  return (
    <section className="service-banners" aria-label="Servicios destacados">
      <div className="service-banners-header">
        <h2>Nuestros Servicios</h2>
      </div>
      <div className="service-banners-grid">
        {SERVICE_BANNERS.map((banner) => (
          <a
            key={banner.id}
            className="service-banner-card"
            href={banner.href}
            aria-label={`${banner.title} - ${banner.cta}`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="service-banner-image"
              loading="lazy"
            />
            <div className="service-banner-content">
              <h3>{banner.title}</h3>
              <p>{banner.description}</p>
              <span className="service-banner-cta">
                {banner.cta} <ArrowRight size={16} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
