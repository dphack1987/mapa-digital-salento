// Modal de Verificación de Google Search Console
// Muestra métodos de verificación para salentoalamano.com

import { useState } from 'react'
import { 
  X, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  Code, 
  Globe, 
  BarChart,
  Download,
  Upload
} from 'lucide-react'
import googleVerificationService from '../services/googleVerification.service'

interface GoogleVerificationModalProps {
  isOpen: boolean
  onClose: () => void
}

const GoogleVerificationModal: React.FC<GoogleVerificationModalProps> = ({ isOpen, onClose }) => {
  const [activeMethod, setActiveMethod] = useState<number>(0)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedInstruction, setCopiedInstruction] = useState(false)

  if (!isOpen) return null

  const verificationMethods = googleVerificationService.generateAllVerificationMethods()
  const currentMethod = verificationMethods[activeMethod]
  const domain = 'https://salentoalamano.com'
  const brandName = 'Salento a la Mano'

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentMethod.code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyInstruction = (instruction: string) => {
    navigator.clipboard.writeText(instruction)
    setCopiedInstruction(true)
    setTimeout(() => setCopiedInstruction(false), 2000)
  }

  const handleDownloadVercelInstructions = () => {
    const instructions = googleVerificationService.generateVercelInstructions()
    const blob = new Blob([instructions], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'verificacion-google-vercel-instrucciones.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadRobotsTxt = () => {
    const robotsTxt = googleVerificationService.generateRobotsTxt()
    const blob = new Blob([robotsTxt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'robots.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getMethodIcon = (methodName: string) => {
    switch (methodName) {
      case 'Archivo HTML de Verificación':
        return <FileText size={20} />
      case 'Meta Tag de Verificación':
        return <Code size={20} />
      case 'Registro DNS TXT':
        return <Globe size={20} />
      case 'Google Analytics':
        return <BarChart size={20} />
      case 'Google Tag Manager':
        return <Upload size={20} />
      default:
        return <FileText size={20} />
    }
  }

  return (
    <div className="google-verification-modal-overlay" onClick={onClose}>
      <div className="google-verification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <div className="verification-icon">
              <Globe size={24} />
            </div>
            <div>
              <h2>Verificación de Google Search Console</h2>
              <p>{domain} - {brandName}</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="verification-content">
          <div className="methods-sidebar">
            <h3>Métodos de Verificación</h3>
            <div className="methods-list">
              {verificationMethods.map((method, index) => (
                <button
                  key={index}
                  className={`method-item ${activeMethod === index ? 'active' : ''}`}
                  onClick={() => setActiveMethod(index)}
                >
                  <div className="method-icon">{getMethodIcon(method.name)}</div>
                  <div className="method-info">
                    <span className="method-name">{method.name}</span>
                    <span className={`method-priority ${method.priority}`}>
                      {method.priority === 'recommended' ? 'Recomendado' : 'Alternativo'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="download-section">
              <button className="download-button" onClick={handleDownloadVercelInstructions}>
                <Download size={16} />
                Instrucciones Vercel
              </button>
              <button className="download-button" onClick={handleDownloadRobotsTxt}>
                <Download size={16} />
                Descargar robots.txt
              </button>
            </div>
          </div>

          <div className="method-details">
            <div className="method-header">
              <div className="method-title-section">
                {getMethodIcon(currentMethod.name)}
                <div>
                  <h3>{currentMethod.name}</h3>
                  <p>{currentMethod.description}</p>
                </div>
              </div>
              <div className={`priority-badge ${currentMethod.priority}`}>
                {currentMethod.priority === 'recommended' ? (
                  <>
                    <CheckCircle size={16} />
                    Recomendado
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    Alternativo
                  </>
                )}
              </div>
            </div>

            <div className="code-section">
              <div className="code-header">
                <h4>Código de Verificación</h4>
                <button className="copy-button" onClick={handleCopyCode}>
                  {copiedCode ? (
                    <>
                      <CheckCircle size={16} />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <div className="code-display">
                <code>{currentMethod.code}</code>
              </div>
            </div>

            <div className="instructions-section">
              <h4>Instrucciones Paso a Paso</h4>
              <div className="instructions-list">
                {currentMethod.instructions.map((instruction, index) => (
                  <div key={index} className="instruction-item">
                    <span className="instruction-number">{index + 1}</span>
                    <p className="instruction-text">{instruction}</p>
                    <button 
                      className="copy-instruction-button"
                      onClick={() => handleCopyInstruction(instruction)}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-links">
              <h4>Enlaces Útiles</h4>
              <div className="links-grid">
                <a 
                  href="https://search.google.com/search-console" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="quick-link"
                >
                  <ExternalLink size={16} />
                  Google Search Console
                </a>
                <a 
                  href="https://vercel.com/dashboard/domains" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="quick-link"
                >
                  <ExternalLink size={16} />
                  Vercel Domains
                </a>
                <a 
                  href={`https://${domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="quick-link"
                >
                  <ExternalLink size={16} />
                  {domain}
                </a>
              </div>
            </div>

            <div className="verification-status">
              <div className="status-header">
                <h4>Estado de Verificación</h4>
                <span className="status-badge pending">Pendiente</span>
              </div>
              <div className="status-content">
                <p>Para verificar la propiedad:</p>
                <ol>
                  <li>Implementa uno de los métodos mostrados arriba</li>
                  <li>Despliega los cambios en Vercel</li>
                  <li>Ve a Google Search Console</li>
                  <li>Haz clic en "Verificar"</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-info">
            <AlertCircle size={16} />
            <span>Los métodos "Recomendados" son más rápidos y fáciles de implementar</span>
          </div>
          <button className="primary-button" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

export default GoogleVerificationModal