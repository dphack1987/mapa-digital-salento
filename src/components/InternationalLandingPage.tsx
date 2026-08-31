// Componente de Landing Page Internacional
// Generación dinámica de páginas por idioma para indexación global

import { useEffect } from 'react'
import internationalSEOService from '../services/internationalSEO.service'

interface InternationalLandingPageProps {
  lang: string
}

const InternationalLandingPage: React.FC<InternationalLandingPageProps> = ({ lang }) => {
  useEffect(() => {
    // Inyectar metadatos específicos del idioma
    const page = internationalSEOService.getPageByLang(lang)
    if (page) {
      // Actualizar título
      document.title = page.title
      
      // Actualizar descripción
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', page.description)
      }
      
      // Actualizar keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      if (metaKeywords) {
        metaKeywords.setAttribute('content', page.keywords.join(', '))
      }
      
      // Actualizar Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', page.ogTitle)
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]')
      if (ogDescription) {
        ogDescription.setAttribute('content', page.ogDescription)
      }
      
      // Actualizar Twitter
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) {
        twitterTitle.setAttribute('content', page.twitterTitle)
      }
      
      const twitterDescription = document.querySelector('meta[name="twitter:description"]')
      if (twitterDescription) {
        twitterDescription.setAttribute('content', page.twitterDescription)
      }
      
      // Inyectar Schema.org específico
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(page.schema)
      document.head.appendChild(script)
      
      // Cleanup
      return () => {
        document.head.removeChild(script)
      }
    }
  }, [lang])

  const page = internationalSEOService.getPageByLang(lang)
  
  if (!page) {
    return <div>Loading...</div>
  }

  return (
    <div className="international-landing-page">
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
      
      <div className="cta-section">
        <h3>🎯 Planifica tu visita con confianza</h3>
        <p>Usa nuestro mapa interactivo para encontrar hoteles, restaurantes y servicios verificados.</p>
        <a href="/" className="cta-button">Ver Mapa Oficial de Salento</a>
      </div>
      
      <div className="language-selector">
        <a href="/es/" className={lang === 'es' ? 'active' : ''}>Español</a>
        <a href="/en/" className={lang === 'en' ? 'active' : ''}>English</a>
        <a href="/de/" className={lang === 'de' ? 'active' : ''}>Deutsch</a>
        <a href="/fr/" className={lang === 'fr' ? 'active' : ''}>Français</a>
        <a href="/it/" className={lang === 'it' ? 'active' : ''}>Italiano</a>
      </div>
    </div>
  )
}

export default InternationalLandingPage