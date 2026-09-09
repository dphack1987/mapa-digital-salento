/**
 * Componente de Landing Page Programática
 * Renderiza páginas SEO optimizadas basadas en configuración del servicio
 */

import { Helmet } from 'react-helmet-async'
import { useEffect } from 'react'
import { ArrowRight, Star, MapPin, Clock, Phone, MessageSquare, ChevronRight, Heart, Search, Utensils, Mountain, Coffee, Hotel, Compass } from 'lucide-react'
import programaticLandingService from '../services/programaticLandingService'

interface ProgrammaticLandingPageProps {
  slug: string
  language?: 'es' | 'en'
}

function ProgrammaticLandingPage({ slug, language = 'es' }: ProgrammaticLandingPageProps) {
  const landingConfig = programaticLandingService.getLandingPage(slug)

  useEffect(() => {
    if (landingConfig) {
      window.scrollTo(0, 0)
    }
  }, [landingConfig])

  if (!landingConfig) {
    return (
      <div className="error-page">
        <h1>Página no encontrada</h1>
        <p>La landing page solicitada no existe.</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  const { meta, content, h1 } = landingConfig

  return (
    <>
      <Helmet>
        <title>{meta.ogTitle}</title>
        <meta name="description" content={meta.ogDescription} />
        <meta name="keywords" content={meta.keywords.join(', ')} />
        <link rel="canonical" href={meta.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        <meta name="twitter:image" content={meta.ogImage} />
      </Helmet>

      <div className="programmatic-landing-page">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="hero-content">
            <h1>{h1}</h1>
            <p>{content.hero.subtitle}</p>
            <button className="cta-button primary">
              {content.hero.cta} <ArrowRight size={20} />
            </button>
          </div>
          <div className="hero-image">
            <img src={content.hero.image} alt={h1} />
          </div>
        </section>

        {/* Main Content */}
        <main className="landing-content">
          {content.sections.map((section, index) => (
            <section key={index} className="content-section">
              <h2>{section.heading}</h2>
              <p>{section.content}</p>
              
              {section.subsections && section.subsections.length > 0 && (
                <div className="subsections">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="subsection">
                      <h3>{subsection.heading}</h3>
                      <p>{subsection.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* CTA Section */}
          <section className="cta-section">
            <h2>¿Listo para tu viaje a Salento?</h2>
            <div className="cta-buttons">
              <button className="cta-button primary">
                {content.cta.primary} <ArrowRight size={20} />
              </button>
              <button className="cta-button secondary">
                {content.cta.secondary} <Compass size={20} />
              </button>
              {content.cta.whatsapp && (
                <a 
                  href="https://wa.me/573000000000?text=Hola,%20quiero%20información%20sobre%20Salento"
                  className="cta-button whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare size={20} />
                  Contactar por WhatsApp
                </a>
              )}
            </div>
          </section>

          {/* FAQ Section */}
          {content.faq && content.faq.items.length > 0 && (
            <section className="faq-section">
              <h2>Preguntas Frecuentes</h2>
              <div className="faq-items">
                {content.faq.items.map((item, index) => (
                  <div key={index} className="faq-item">
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Pages */}
          {content.related && content.related.pages.length > 0 && (
            <section className="related-pages">
              <h2>{content.related.title}</h2>
              <div className="related-grid">
                {content.related.pages.map((page, index) => (
                  <a key={index} href={page.url} className="related-card">
                    <h3>{page.title}</h3>
                    <p>{page.description}</p>
                    <span className="related-link">
                      Ver más <ChevronRight size={16} />
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  )
}

export default ProgrammaticLandingPage