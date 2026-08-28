// Componente de escaneo QR para hoteles
// Permite a los hoteles generar y validar códigos QR para sus huéspedes

import { useState, useEffect } from 'react'
import hotelQRService from '../services/qrHotelService'

interface QRScannerProps {
  hotelId: string
  hotelName: string
}

export default function QRScanner({ hotelId, hotelName }: QRScannerProps) {
  const [qrCode, setQRCode] = useState<any>(null)
  const [showQR, setShowQR] = useState(false)
  const [roomNumber, setRoomNumber] = useState('')
  const [sessionCreated, setSessionCreated] = useState(false)

  useEffect(() => {
    // Generar QR inicial para el hotel
    const config = {
      id: `config-${hotelId}`,
      hotelId,
      hotelName,
      allowedRooms: [],
      primaryColor: '#27362b',
      secondaryColor: '#e76c52',
      welcomeMessage: {
        es: `Bienvenido a ${hotelName}. Escanea el QR para acceder a tu sesión personalizada.`,
        en: `Welcome to ${hotelName}. Scan the QR to access your personalized session.`
      },
      metadata: {
        location: 'Recepción'
      }
    }

    const generatedQR = hotelQRService.generateHotelQR(config)
    setQRCode(generatedQR)
  }, [hotelId, hotelName])

  const handleQRGeneration = () => {
    setShowQR(!showQR)
  }

  const handleSessionCreation = () => {
    if (qrCode && roomNumber) {
      hotelQRService.createQRSession(qrCode.id, roomNumber)
      setSessionCreated(true)
    }
  }

  const handlePrintQR = () => {
    if (qrCode) {
      const payload = hotelQRService.generateQRPayload(qrCode.id)
      const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}`
      window.open(qrURL, '_blank')
    }
  }

  const getStats = () => {
    if (!qrCode) return null
    return hotelQRService.getQRStats(qrCode.id)
  }

  return (
    <div className="qr-scanner-container">
      <div className="qr-header">
        <h3>📱 Sistema QR para {hotelName}</h3>
        <p className="qr-description">Genera códigos QR únicos para tus huéspedes</p>
      </div>

      <div className="qr-controls">
        <button 
          className="qr-button" 
          onClick={handleQRGeneration}
        >
          {showQR ? 'Ocultar QR' : 'Generar QR Nuevo'}
        </button>

        {showQR && qrCode && (
          <button 
            className="qr-button secondary" 
            onClick={handlePrintQR}
          >
            🖨️ Imprimir QR
          </button>
        )}
      </div>

      {showQR && qrCode && (
        <div className="qr-display">
          <div className="qr-code-visual">
            <div className="qr-placeholder">
              <div className="qr-pattern">
                <div className="qr-corner top-left"></div>
                <div className="qr-corner top-right"></div>
                <div className="qr-corner bottom-left"></div>
                <div className="qr-center"></div>
              </div>
            </div>
            <p className="qr-id">ID: {qrCode.id}</p>
          </div>

          <div className="qr-info">
            <div className="qr-info-item">
              <span className="qr-label">Hotel:</span>
              <span className="qr-value">{qrCode.hotelName}</span>
            </div>
            <div className="qr-info-item">
              <span className="qr-label">Generado:</span>
              <span className="qr-value">{new Date(qrCode.generatedAt).toLocaleDateString()}</span>
            </div>
            <div className="qr-info-item">
              <span className="qr-label">Expira:</span>
              <span className="qr-value">{new Date(qrCode.expiresAt).toLocaleDateString()}</span>
            </div>
            <div className="qr-info-item">
              <span className="qr-label">Estado:</span>
              <span className={`qr-value ${qrCode.isActive ? 'active' : 'inactive'}`}>
                {qrCode.isActive ? '✅ Activo' : '❌ Inactivo'}
              </span>
            </div>
          </div>

          {getStats() && (
            <div className="qr-stats">
              <h4>📊 Estadísticas</h4>
              <div className="stat-item">
                <span className="stat-label">Escaneos totales:</span>
                <span className="stat-value">{getStats()?.scans}</span>
              </div>
              {getStats()?.lastScanned && (
                <div className="stat-item">
                  <span className="stat-label">Último escaneo:</span>
                  <span className="stat-value">{new Date(getStats()!.lastScanned!).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          <div className="qr-session-demo">
            <h4>🧪 Demo: Crear Sesión de Huésped</h4>
            <div className="session-form">
              <input
                type="text"
                placeholder="Número de habitación (ej: 204)"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="session-input"
              />
              <button 
                className="session-button"
                onClick={handleSessionCreation}
                disabled={!roomNumber}
              >
                Crear Sesión
              </button>
            </div>
            {sessionCreated && (
              <div className="session-success">
                ✅ Sesión creada para habitación {roomNumber}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="qr-instructions">
        <h4>📋 Instrucciones de Uso</h4>
        <ol>
          <li>Genera un código QR único para tu hotel</li>
          <li>Imprime el código QR en stickers de alta calidad</li>
          <li>Coloca los stickers en recepción y mesas de noche</li>
          <li>Los huéspedes escanean el QR para acceder a su sesión personalizada</li>
          <li>Monitorea las estadísticas de uso en tiempo real</li>
        </ol>
      </div>
    </div>
  )
}