import React, { useState } from 'react'

interface YandexVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (code: string) => void
}

const YandexVerificationModal: React.FC<YandexVerificationModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState(1)

  if (!isOpen) return null

  const handleVerify = () => {
    if (verificationCode.trim()) {
      onVerify(verificationCode)
      setStep(3)
    }
  }

  const renderStep1 = () => (
    <div className="yandex-verification-step">
      <h3>Paso 1: Obtener Código de Verificación</h3>
      <p>Ve a Yandex Webmaster para obtener tu código de verificación:</p>
      <ol>
        <li>Visita <a href="https://webmaster.yandex.com/" target="_blank" rel="noopener noreferrer">Yandex Webmaster</a></li>
        <li>Inicia sesión con tu cuenta Yandex</li>
        <li>Haz clic en "Добавить сайт" (Agregar sitio)</li>
        <li>Ingresa tu URL: https://salentoalamano.com</li>
        <li>Selecciona el método de verificación</li>
        <li>Copia el código de verificación proporcionado</li>
      </ol>
      <div className="warning-box">
        <p>⚠️ Nota: Yandex Webmaster está principalmente en ruso. Necesitarás traducir la página o usar un traductor.</p>
      </div>
      <button className="btn-primary" onClick={() => setStep(2)}>
        Continuar →
      </button>
    </div>
  )

  const renderStep2 = () => (
    <div className="yandex-verification-step">
      <h3>Paso 2: Ingresar Código de Verificación</h3>
      <div className="verification-input">
        <label>Código de Verificación de Yandex:</label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Ingresa el código de verificación de Yandex"
          className="verification-code-input"
        />
      </div>

      <div className="method-preview">
        <h4>Meta Tag generado:</h4>
        <code>
          &lt;meta name="yandex-verification" content="{verificationCode || 'TU_CODIGO'}" /&gt;
        </code>
      </div>

      <div className="warning-box">
        <p>⚠️ Opcional: Solo configúralo si tienes audiencia en Rusia o países de habla rusa.</p>
      </div>

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
    <div className="yandex-verification-step">
      <h3>✓ Verificación Completada</h3>
      <p>El código de verificación de Yandex ha sido configurado.</p>
      <div className="verification-summary">
        <p><strong>Código:</strong> {verificationCode}</p>
      </div>
      <div className="next-steps">
        <h4>Próximos pasos:</h4>
        <ol>
          <li>Despliega los cambios en Vercel</li>
          <li>Ve a Yandex Webmaster</li>
          <li>Haz clic en "Проверить" (Verificar)</li>
          <li>Envía tu sitemap a Yandex</li>
        </ol>
      </div>
      <button className="btn-primary" onClick={onClose}>
        Cerrar
      </button>
    </div>
  )

  return (
    <div className="yandex-verification-modal-overlay">
      <div className="yandex-verification-modal">
        <div className="modal-header">
          <h2>Verificación de Yandex Webmaster</h2>
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

export default YandexVerificationModal