import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, Clock, MapPin, Shield, Calendar, ExternalLink, Share2, AlertTriangle } from 'lucide-react'
import seoLandingService from '../services/seoLandingService'

interface DynamicLandingPageProps {
  slug: string
  onClose?: () => void
}

const DynamicLandingPage: React.FC<DynamicLandingPageProps> = ({ slug, onClose }) => {
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    seoLandingService.initialize()
    const pageData = seoLandingService.getPage(slug)
    setPage(pageData)
    setLoading(false)
    
    if (pageData) {
      setLastUpdated(new Date(pageData.lastUpdated).toLocaleString('es-ES'))
    }
  }, [slug])

  if (loading) {
    return (
      <div className="landing-page-loading">
        <div className="loading-spinner">Cargando información oficial...</div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="landing-page-error">
        <AlertTriangle size={48} />
        <h2>Página no encontrada</h2>
        <p>La información que buscas no está disponible actualmente.</p>
        {onClose && <button onClick={onClose}>Volver al inicio</button>}
      </div>
    )
  }

  const metaTags = seoLandingService.generateMetaTags(page)
  const schema = page.schema

  return (
    <div className="dynamic-landing-page">
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metaTags['og:title']} />
        <meta property="og:description" content={metaTags['og:description']} />
        <meta property="og:url" content={metaTags['og:url']} />
        <meta property="og:type" content={metaTags['og:type']} />
        <meta property="og:image" content={metaTags['og:image']} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={metaTags['twitter:card']} />
        <meta name="twitter:title" content={metaTags['twitter:title']} />
        <meta name="twitter:description" content={metaTags['twitter:description']} />
        <meta name="twitter:image" content={metaTags['twitter:image']} />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <div className="landing-header">
        <div className="landing-container">
          <div className="official-badge">
            <Shield size={20} />
            <span>Información Oficial</span>
          </div>
          <h1>{page.title}</h1>
          <p className="landing-description">{page.description}</p>
          
          <div className="landing-meta">
            <div className="meta-item">
              <Clock size={16} />
              <span>Actualizado: {lastUpdated}</span>
            </div>
            <div className="meta-item">
              <MapPin size={16} />
              <span>Salento, Quindío</span>
            </div>
            <div className="meta-item source-badge">
              <CheckCircle size={16} />
              <span>Fuente: {page.source === 'official' ? 'Oficial' : page.source === 'community' ? 'Comunidad' : 'Mixta'}</span>
            </div>
          </div>

          <div className="status-indicator">
            <span className="status-dot green"></span>
            <span className="status-text">SITUACIÓN OPERATIVA</span>
          </div>
        </div>
      </div>

      <div className="landing-content">
        <div className="landing-container">
          <div 
            className="landing-body"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          <div className="landing-actions">
            <div className="action-grid">
              <button className="action-button primary">
                <ExternalLink size={18} />
                Ver Servicios Disponibles
              </button>
              <button className="action-button secondary">
                <Share2 size={18} />
                Compartir Información
              </button>
            </div>
          </div>

          <div className="landing-faq">
            <h2>Preguntas Frecuentes</h2>
            <div className="faq-list">
              {Array.isArray(schema.mainEntity) && schema.mainEntity.map((item: any, index: number) => (
                <div key={index} className="faq-item">
                  <h3>{item.name}</h3>
                  <p>{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-footer">
            <div className="official-source">
              <Shield size={24} />
              <div>
                <h3>Información Oficial</h3>
                <p>Esta información es proporcionada por la Red de Prestadores Turísticos de Salento, garantizando veracidad y actualización constante.</p>
              </div>
            </div>
            
            <div className="contact-info">
              <h4>¿Necesitas más información?</h4>
              <p>Contacta directamente con nuestros aliados locales:</p>
              <button className="contact-button">
                WhatsApp de Asistencia
              </button>
            </div>
          </div>
        </div>
      </div>

      {onClose && (
        <button className="close-landing" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  )
}

export default DynamicLandingPage