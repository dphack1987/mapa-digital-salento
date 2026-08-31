// Componente para compartir la página mediante QR code
// Facilita el acceso rápido y compartición del sitio

import { useState, useEffect } from 'react'
import { Share2, Download, Copy, X, QrCode } from 'lucide-react'
import qrCodeGenerator from '../services/qrCodeGenerator'

interface QRShareProps {
  onClose?: () => void
  url?: string
  title?: string
  description?: string
}

const QRShare: React.FC<QRShareProps> = ({ 
  onClose, 
  url = typeof window !== 'undefined' ? window.location.href : 'https://salentoalamano.com',
  title = 'Salento a la Mano',
  description = 'Escané para acceder al mapa digital de Salento'
}) => {
  const [qrCode, setQRCode] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    generateQRCode()
  }, [url])

  const generateQRCode = async () => {
    try {
      setLoading(true)
      setError('')
      
      const qrDataURL = await qrCodeGenerator.generateQRCodeDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#27362b', // Color del branding
          light: '#f5f1e8'  // Color del branding
        },
        errorCorrectionLevel: 'H' // Alta corrección de errores
      })
      
      setQRCode(qrDataURL)
    } catch (err) {
      console.error('Error generating QR code:', err)
      setError('No se pudo generar el código QR')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  const handleDownload = () => {
    qrCodeGenerator.downloadQRCode(url, `salento-alamano-qr.png`, {
      width: 300,
      margin: 2,
      color: {
        dark: '#27362b',
        light: '#f5f1e8'
      }
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  return (
    <div className="qr-share-overlay" onClick={onClose}>
      <div className="qr-share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-share-header">
          <div className="qr-share-title">
            <QrCode size={20} />
            <span>Compartir con QR</span>
          </div>
          <button 
            className="icon-button" 
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="qr-share-content">
          {loading ? (
            <div className="qr-loading">
              <div className="qr-spinner"></div>
              <p>Generando código QR...</p>
            </div>
          ) : error ? (
            <div className="qr-error">
              <p>{error}</p>
              <button onClick={generateQRCode} className="retry-button">
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <div className="qr-code-container">
                <img 
                  src={qrCode} 
                  alt="Código QR de Salento a la Mano" 
                  className="qr-code-image"
                />
                <div className="qr-branding">
                  <div className="qr-logo-placeholder">🌿</div>
                  <span className="qr-brand-text">Salento a la Mano</span>
                </div>
              </div>

              <div className="qr-share-info">
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="qr-url">
                  <code>{url}</code>
                </div>
              </div>

              <div className="qr-share-actions">
                <button 
                  className="share-action-button"
                  onClick={handleCopyToClipboard}
                  disabled={copied}
                >
                  <Copy size={18} />
                  {copied ? '¡Copiado!' : 'Copiar URL'}
                </button>
                
                <button 
                  className="share-action-button"
                  onClick={handleDownload}
                >
                  <Download size={18} />
                  Descargar QR
                </button>
                
                {navigator.share && (
                  <button 
                    className="share-action-button"
                    onClick={handleShare}
                  >
                    <Share2 size={18} />
                    Compartir
                  </button>
                )}
              </div>

              <div className="qr-share-tips">
                <h4>💡 Consejos de uso:</h4>
                <ul>
                  <li>Imprime el QR y colócalo en tu negocio</li>
                  <li>Compártelo en WhatsApp con visitantes</li>
                  <li>Úsalo en material promocional</li>
                  <li>Ideal para menús y tarjetas de presentación</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="qr-share-footer">
          <p className="qr-footer-text">
            Este QR siempre llevará a la información más actualizada de Salento
          </p>
        </div>
      </div>
    </div>
  )
}

export default QRShare