import { useState, useEffect } from 'react'
import { Download, Share2, Copy, CheckCircle, AlertCircle, Smartphone, Facebook, Instagram, MessageCircle, Globe, Linkedin, Twitter } from 'lucide-react'
import backlinkGeneratorService from '../services/backlinkGeneratorService'

interface BacklinkManagerProps {
  businessId: string
  businessName: string
  businessType: string
  whatsapp?: string
  onClose?: () => void
  language?: 'es' | 'en'
}

const BacklinkManager: React.FC<BacklinkManagerProps> = ({
  businessId,
  businessName,
  businessType,
  whatsapp,
  onClose,
  language = 'es'
}) => {
  const [config, setConfig] = useState({
    landingPage: 'turismo-salento-seguro-hoy',
    targetAudience: 'both' as 'tourists' | 'locals' | 'both',
    tone: 'informative' as 'informative' | 'promotional' | 'community',
    language: language
  })
  
  const [generatedContent, setGeneratedContent] = useState<any[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const landingPages = [
    { value: 'estado-vias-salento-hoy', label: language === 'es' ? 'Estado de Vías' : 'Road Status' },
    { value: 'hoteles-hostales-abiertos-salento', label: language === 'es' ? 'Alojamientos' : 'Accommodations' },
    { value: 'valle-cocora-operativo-seguro', label: language === 'es' ? 'Valle de Cocora' : 'Cocora Valley' },
    { value: 'turismo-salento-seguro-hoy', label: language === 'es' ? 'Turismo General' : 'General Tourism' },
    { value: 'transporte-jeeps-salento-operativo', label: language === 'es' ? 'Transporte' : 'Transport' }
  ]

  const toneOptions = [
    { value: 'informative', label: language === 'es' ? 'Informativo' : 'Informative', description: language === 'es' ? 'Enfoque en datos oficiales' : 'Focus on official data' },
    { value: 'promotional', label: language === 'es' ? 'Promocional' : 'Promotional', description: language === 'es' ? 'Enfoque en servicios' : 'Focus on services' },
    { value: 'community', label: language === 'es' ? 'Comunitario' : 'Community', description: language === 'es' ? 'Enfoque en economía local' : 'Focus on local economy' }
  ]

  const platformIcons = {
    instagram: Instagram,
    facebook: Facebook,
    whatsapp: MessageCircle,
    google_business: Globe,
    twitter: Twitter,
    linkedin: Linkedin
  }

  const generateContent = () => {
    setLoading(true)
    const business = {
      id: businessId,
      name: businessName,
      type: businessType,
      whatsapp
    }
    
    const content = backlinkGeneratorService.generateBacklinkContent(business, config)
    setGeneratedContent(content)
    setLoading(false)
  }

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text)
    setCopied(platform)
    setTimeout(() => setCopied(null), 2000)
  }

  const shareToPlatform = (content: any, platform: string) => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.content)}&url=${encodeURIComponent(content.url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content.url)}`
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
    } else if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(content.content)}`
      window.open(whatsappUrl, '_blank')
    } else {
      copyToClipboard(content.content, platform)
    }
  }

  const downloadCSV = () => {
    const business = {
      id: businessId,
      name: businessName,
      type: businessType,
      whatsapp
    }
    
    const csv = backlinkGeneratorService.exportToCSV([business], config)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backlink_content_${businessName.replace(/\s+/g, '_')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateWhatsAppStatus = () => {
    const status = backlinkGeneratorService.generateWhatsAppStatus(
      { id: businessId, name: businessName, type: businessType, whatsapp },
      config.landingPage,
      config.language
    )
    copyToClipboard(status, 'whatsapp_status')
  }

  useEffect(() => {
    generateContent()
  }, [config])

  return (
    <div className="backlink-manager">
      <div className="backlink-header">
        <div className="header-content">
          <h2>{language === 'es' ? 'Generador de Contenido' : 'Content Generator'}</h2>
          <p>{language === 'es' ? 'Crea contenido para tus redes sociales con información oficial de Salento' : 'Create content for your social media with official Salento information'}</p>
        </div>
        {onClose && <button className="close-button" onClick={onClose}>✕</button>}
      </div>

      <div className="backlink-config">
        <div className="config-section">
          <label>{language === 'es' ? 'Página de destino' : 'Landing Page'}</label>
          <select 
            value={config.landingPage} 
            onChange={(e) => setConfig({...config, landingPage: e.target.value})}
          >
            {landingPages.map(page => (
              <option key={page.value} value={page.value}>{page.label}</option>
            ))}
          </select>
        </div>

        <div className="config-section">
          <label>{language === 'es' ? 'Tono del mensaje' : 'Message Tone'}</label>
          <div className="tone-options">
            {toneOptions.map(option => (
              <button
                key={option.value}
                className={`tone-option ${config.tone === option.value ? 'active' : ''}`}
                onClick={() => setConfig({...config, tone: option.value as any})}
              >
                <div className="tone-label">{option.label}</div>
                <div className="tone-description">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="config-section">
          <label>{language === 'es' ? 'Idioma' : 'Language'}</label>
          <div className="language-toggle">
            <button 
              className={config.language === 'es' ? 'active' : ''}
              onClick={() => setConfig({...config, language: 'es'})}
            >
              Español
            </button>
            <button 
              className={config.language === 'en' ? 'active' : ''}
              onClick={() => setConfig({...config, language: 'en'})}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-content">
          <div className="loading-spinner">{language === 'es' ? 'Generando contenido...' : 'Generating content...'}</div>
        </div>
      ) : (
        <div className="backlink-content">
          <div className="content-grid">
            {generatedContent.map((item, index) => {
              const IconComponent = platformIcons[item.platform as keyof typeof platformIcons]
              return (
                <div 
                  key={index} 
                  className={`content-card ${selectedPlatform === item.platform ? 'selected' : ''}`}
                  onClick={() => setSelectedPlatform(item.platform)}
                >
                  <div className="card-header">
                    <IconComponent size={20} />
                    <span className="platform-name">{item.platform}</span>
                  </div>
                  
                  <div className="card-content">
                    <p className="content-text">{item.content}</p>
                    <div className="content-meta">
                      <span className="hashtags">{item.hashtags.join(' ')}</span>
                      <span className="url">{item.url}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="action-button copy"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(item.content, item.platform)
                      }}
                    >
                      {copied === item.platform ? <CheckCircle size={16} /> : <Copy size={16} />}
                      {copied === item.platform ? (language === 'es' ? 'Copiado' : 'Copied') : (language === 'es' ? 'Copiar' : 'Copy')}
                    </button>
                    <button 
                      className="action-button share"
                      onClick={(e) => {
                        e.stopPropagation()
                        shareToPlatform(item, item.platform)
                      }}
                    >
                      <Share2 size={16} />
                      {language === 'es' ? 'Compartir' : 'Share'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="backlink-actions">
            <button className="action-button whatsapp" onClick={generateWhatsAppStatus}>
              <Smartphone size={18} />
              {language === 'es' ? 'Estado WhatsApp' : 'WhatsApp Status'}
            </button>
            <button className="action-button download" onClick={downloadCSV}>
              <Download size={18} />
              {language === 'es' ? 'Descargar CSV' : 'Download CSV'}
            </button>
          </div>
        </div>
      )}

      <div className="backlink-tips">
        <div className="tips-header">
          <AlertCircle size={20} />
          <h3>{language === 'es' ? 'Recomendaciones' : 'Recommendations'}</h3>
        </div>
        <ul>
          <li>{language === 'es' ? 'Usa fotos auténticas de tu negocio y del pueblo' : 'Use authentic photos of your business and town'}</li>
          <li>{language === 'es' ? 'Publica simultáneamente en varias plataformas' : 'Post simultaneously on multiple platforms'}</li>
          <li>{language === 'es' ? 'Incluye geolocalización en todas las publicaciones' : 'Include geolocation in all posts'}</li>
          <li>{language === 'es' ? 'Responde rápidamente a comentarios y mensajes' : 'Respond quickly to comments and messages'}</li>
          <li>{language === 'es' ? 'Actualiza el contenido semanalmente' : 'Update content weekly'}</li>
        </ul>
      </div>
    </div>
  )
}

export default BacklinkManager