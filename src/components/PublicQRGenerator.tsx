import { useState } from 'react'
import { Download, Share2, QrCode, Copy } from 'lucide-react'
import publicQRService from '../services/publicQRService'

export default function PublicQRGenerator() {
  const [qrSize, setQrSize] = useState(300)
  const [foregroundColor, setForegroundColor] = useState('000000')
  const [backgroundColor, setBackgroundColor] = useState('FFFFFF')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const qrURL = publicQRService.getStyledQRCodeURL({
    size: qrSize,
    foregroundColor,
    backgroundColor
  })

  const appURL = publicQRService.getAppURL()
  const qrInfo = publicQRService.getQRInfo()

  const handleDownload = () => {
    // Crear un link temporal para descargar la imagen
    const link = document.createElement('a')
    link.href = qrURL
    link.download = `salento-a-la-mano-qr-${qrSize}x${qrSize}.png`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyURL = () => {
    navigator.clipboard.writeText(appURL)
    alert('URL copiada al portapapeles')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Salento a la Mano',
          text: 'Descubre Salento con nuestra guía turística digital',
          url: appURL
        })
      } catch (err) {
        console.log('Error al compartir:', err)
      }
    } else {
      handleCopyURL()
    }
  }

  return (
    <div className="public-qr-generator" style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#1a1a1a'
        }}>
          QR Público Salento a la Mano
        </h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Escanea para acceder a la guía turística digital
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          padding: '1rem',
          background: backgroundColor === 'FFFFFF' ? '#f9f9f9' : backgroundColor,
          borderRadius: '8px',
          border: '2px solid #e0e0e0'
        }}>
          <img 
            src={qrURL} 
            alt="QR Salento a la Mano" 
            style={{ 
              display: 'block',
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <button 
          onClick={handleDownload}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          <Download size={16} />
          Descargar
        </button>

        <button 
          onClick={handleShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          <Share2 size={16} />
          Compartir
        </button>

        <button 
          onClick={handleCopyURL}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          <Copy size={16} />
          Copiar URL
        </button>
      </div>

      <button 
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          width: '100%',
          padding: '0.5rem',
          background: 'transparent',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          color: '#666',
          marginBottom: showAdvanced ? '1rem' : '0'
        }}
      >
        {showAdvanced ? 'Ocultar opciones avanzadas' : 'Mostrar opciones avanzadas'}
      </button>

      {showAdvanced && (
        <div style={{
          padding: '1rem',
          background: '#f9f9f9',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Tamaño del QR: {qrSize}px
            </label>
            <input 
              type="range" 
              min="150" 
              max="600" 
              step="50"
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Color principal (hex)
            </label>
            <input 
              type="color" 
              value={`#${foregroundColor}`}
              onChange={(e) => setForegroundColor(e.target.value.replace('#', ''))}
              style={{ width: '100%', height: '40px' }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.85rem', 
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Color de fondo (hex)
            </label>
            <input 
              type="color" 
              value={`#${backgroundColor}`}
              onChange={(e) => setBackgroundColor(e.target.value.replace('#', ''))}
              style={{ width: '100%', height: '40px' }}
            />
          </div>
        </div>
      )}

      <div style={{
        padding: '1rem',
        background: '#e8f5e9',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#2e7d32'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <QrCode size={16} />
          <strong>Características del QR:</strong>
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Uso infinito sin costo</li>
          <li>Redirección directa a la app web</li>
          <li>No requiere instalación</li>
          <li>Compatible con todos los dispositivos</li>
          <li>Personalizable para materiales de marca</li>
        </ul>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: '#f5f5f5',
        borderRadius: '6px',
        fontSize: '0.8rem',
        wordBreak: 'break-all',
        color: '#666'
      }}>
        <strong>URL de destino:</strong><br />
        {appURL}
      </div>
    </div>
  )
}