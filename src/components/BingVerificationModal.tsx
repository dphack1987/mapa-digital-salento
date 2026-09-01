import React, { useState } from 'react'

interface BingVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (code: string) => void
}

const BingVerificationModal: React.FC<BingVerificationModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [verificationCode, setVerificationCode] = useState('')
  const [method, setMethod] = useState<'meta' | 'xml'>('meta')
  const [step, setStep] = useState(1)

  if (!isOpen) return null

  const handleVerify = () => {
    if (verificationCode.trim()) {
      onVerify(verificationCode)
      setStep(3)
    }
  }

  const renderStep1 = () => (
    <div className="bing-verification-step">
      <h3>Paso 1: Obtener Código de Verificación</h3>
      <p>Ve a Bing Webmaster Tools para obtener tu código de verificación:</p>
      <ol>
        <li>Visita <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer">Bing Webmaster Tools</a></li>
        <li>Inicia sesión con tu cuenta Microsoft</li>
        <li>Haz clic en "Add a site"</li>
        <li>Ingresa tu URL: https://mapa-digital-salento.vercel.app</li>
        <li>Selecciona el método de verificación</li>
        <li>Copia el código de verificación proporcionado</li>
      </ol>
      <button className="btn-primary" onClick={() => setStep(2)}>
        Continuar →
      </button>
    </div>
  )

  const renderStep2 = () => (
    <div className="bing-verification-step">
      <h3>Paso 2: Ingresar Código de Verificación</h3>
      <div className="method-selector">
        <label>
          <input
            type="radio"
            value="meta"
            checked={method === 'meta'}
            onChange={(e) => setMethod(e.target.value as 'meta' | 'xml')}
          />
          Meta Tag (Recomendado)
        </label>
        <label>
          <input
            type="radio"
            value="xml"
            checked={method === 'xml'}
            onChange={(e) => setMethod(e.target.value as 'meta' | 'xml')}
          />
          Archivo XML
        </label>
      </div>

      <div className="verification-input">
        <label>Código de Verificación de Bing:</label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Ingresa el código de verificación de Bing"
          className="verification-code-input"
        />
      </div>

      {method === 'meta' && (
        <div className="method-preview">
          <h4>Meta Tag generado:</h4>
          <code>
            &lt;meta name="msvalidate.01" content="{verificationCode || 'TU_CODIGO'}" /&gt;
          </code>
        </div>
      )}

      {method === 'xml' && (
        <div className="method-preview">
          <h4>Archivo XML generado:</h4>
          <pre>
            {'<?xml version="1.0"?>\\n'}
            {'<users>\\n'}
            {'  <user>' + (verificationCode || 'YOUR_BING_VERIFICATION_CODE') + '</user>\\n'}
            {'</users>'}
          </pre>
        </div>
      )}

      <div className="step-buttons">
        <button className="btn-secondary" onClick={() => setStep(1)}>
          ← Atrás
        </button>
        <button className="btn-primary" onClick={handleVerify} disabled={!verificationCode.trim()}>
          Verificar
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="bing-verification-step">
      <h3>✓ Verificación Completada</h3>
      <p>El código de verificación de Bing ha sido configurado.</p>
      <div className="verification-summary">
        <p><strong>Método:</strong> {method === 'meta' ? 'Meta Tag' : 'Archivo XML'}</p>
        <p><strong>Código:</strong> {verificationCode}</p>
      </div>
      <div className="next-steps">
        <h4>Próximos pasos:</h4>
        <ol>
          <li>Despliega los cambios en Vercel</li>
          <li>Ve a Bing Webmaster Tools</li>
          <li>Haz clic en "Verify"</li>
          <li>Envía tu sitemap a Bing</li>
        </ol>
      </div>
      <button className="btn-primary" onClick={onClose}>
        Cerrar
      </button>
    </div>
  )

  return (
    <div className="bing-verification-modal-overlay">
      <div className="bing-verification-modal">
        <div className="modal-header">
          <h2>Verificación de Bing Webmaster Tools</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  )
}

export default BingVerificationModal