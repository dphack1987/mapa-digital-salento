// Componente de Verificación de Aliados
// Sistema para verificar documentos y validar negocios registrados

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Upload, FileText, Shield, Clock, X, Download, Eye } from 'lucide-react'
import allyRegistrationService, { VerificationDocument } from '../services/allyRegistration.service'

interface AllyVerificationProps {
  allyId: string
  onClose?: () => void
  onVerified?: (allyId: string) => void
}

const AllyVerification: React.FC<AllyVerificationProps> = ({ allyId, onClose, onVerified }) => {
  const [ally, setAlly] = useState<any>(null)
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<Partial<VerificationDocument>>({
    type: 'business_license',
    documentNumber: '',
    issuingAuthority: '',
    expirationDate: ''
  })

  useEffect(() => {
    loadAllyData()
  }, [allyId])

  const loadAllyData = () => {
    setLoading(true)
    try {
      const allyData = allyRegistrationService.getRegistrationById(allyId)
      if (allyData) {
        setAlly(allyData)
      } else {
        setError('Aliado no encontrado')
      }
    } catch (err) {
      setError('Error al cargar datos del aliado')
      console.error('Error loading ally data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentChange = (field: string, value: string) => {
    setCurrentDocument(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddDocument = () => {
    if (!currentDocument.type || !currentDocument.documentNumber || !currentDocument.issuingAuthority) {
      setError('Completa todos los campos del documento')
      return
    }

    const newDocument: VerificationDocument = {
      type: currentDocument.type as VerificationDocument['type'],
      documentNumber: currentDocument.documentNumber,
      issuingAuthority: currentDocument.issuingAuthority,
      expirationDate: currentDocument.expirationDate || undefined
    }

    setDocuments([...documents, newDocument])
    setCurrentDocument({
      type: 'business_license',
      documentNumber: '',
      issuingAuthority: '',
      expirationDate: ''
    })
    setError('')
  }

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const handleVerify = async () => {
    if (documents.length === 0) {
      setError('Debes agregar al menos un documento para verificación')
      return
    }

    setVerifying(true)
    setError('')

    try {
      const result = await allyRegistrationService.verifyAlly(allyId, documents)
      
      if (result.success) {
        setSuccess(true)
        if (onVerified) {
          onVerified(allyId)
        }
        
        // Recargar datos del aliado
        setTimeout(() => {
          loadAllyData()
        }, 1000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Error durante el proceso de verificación')
      console.error('Verification error:', err)
    } finally {
      setVerifying(false)
    }
  }

  const documentTypes = [
    { value: 'business_license', label: 'Licencia Comercial' },
    { value: 'tax_id', label: 'RUT/NIT' },
    { value: 'chamber_of_commerce', label: 'Cámara de Comercio' },
    { value: 'identity', label: 'Documento de Identidad' }
  ]

  if (loading) {
    return (
      <div className="ally-verification-loading">
        <div className="loading-spinner">Cargando datos del aliado...</div>
      </div>
    )
  }

  if (!ally) {
    return (
      <div className="ally-verification-error">
        <AlertCircle size={32} className="text-red-600" />
        <h3>Error</h3>
        <p>{error || 'No se encontró el aliado'}</p>
        <button className="primary-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="verification-success">
        <div className="success-icon">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2>¡Verificación Exitosa!</h2>
        <p>El negocio <strong>{ally.businessName}</strong> ha sido verificado correctamente.</p>
        <div className="verification-details">
          <div className="detail-item">
            <Clock size={16} />
            <span>Fecha de verificación: {new Date().toLocaleDateString('es-CO')}</span>
          </div>
          <div className="detail-item">
            <Shield size={16} />
            <span>Estado: Verificado</span>
          </div>
        </div>
        <div className="success-actions">
          <button className="primary-button" onClick={() => onClose && onClose()}>
            Continuar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ally-verification">
      <div className="verification-header">
        <div className="verification-title">
          <Shield className="text-blue-600" size={24} />
          <div>
            <h2>Verificación de Aliado</h2>
            <p>Validación de documentos y negocio</p>
          </div>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>
      </div>

      <div className="ally-info-summary">
        <div className="summary-card">
          <div className="summary-header">
            <h3>{ally.businessName}</h3>
            <span className={`status-badge ${ally.verificationStatus}`}>
              {ally.verificationStatus === 'verified' ? 'Verificado' : 
               ally.verificationStatus === 'rejected' ? 'Rechazado' : 'Pendiente'}
            </span>
          </div>
          <div className="summary-details">
            <div className="detail-row">
              <span className="detail-label">Tipo:</span>
              <span className="detail-value">{ally.businessType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Contacto:</span>
              <span className="detail-value">{ally.contactPerson}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{ally.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Teléfono:</span>
              <span className="detail-value">{ally.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Dirección:</span>
              <span className="detail-value">{ally.address}</span>
            </div>
          </div>
        </div>
      </div>

      {ally.verificationStatus === 'verified' ? (
        <div className="already-verified">
          <CheckCircle size={32} className="text-green-600" />
          <h3>Este aliado ya está verificado</h3>
          <p>El negocio fue verificado el {new Date(ally.verificationDate || '').toLocaleDateString('es-CO')}</p>
        </div>
      ) : ally.verificationStatus === 'rejected' ? (
        <div className="verification-rejected">
          <AlertCircle size={32} className="text-red-600" />
          <h3>Verificación Rechazada</h3>
          <p>Razón: {ally.rejectionReason || 'No especificada'}</p>
          <button className="secondary-button" onClick={() => {
            // Resetear estado para reintentar
            ally.verificationStatus = 'pending'
            ally.rejectionReason = undefined
            allyRegistrationService.updateAlly(allyId, ally)
            loadAllyData()
          }}>
            Reintentar Verificación
          </button>
        </div>
      ) : (
        <>
          <div className="documents-section">
            <h3>📄 Documentos de Verificación</h3>
            <p>Sube los documentos requeridos para verificar el negocio:</p>

            <div className="document-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Documento *</label>
                  <select
                    value={currentDocument.type}
                    onChange={(e) => handleDocumentChange('type', e.target.value)}
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Número de Documento *</label>
                  <input
                    type="text"
                    value={currentDocument.documentNumber}
                    onChange={(e) => handleDocumentChange('documentNumber', e.target.value)}
                    placeholder="Ej: 123456789"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Entidad Emisora *</label>
                <input
                  type="text"
                  value={currentDocument.issuingAuthority}
                  onChange={(e) => handleDocumentChange('issuingAuthority', e.target.value)}
                  placeholder="Ej: Cámara de Comercio de Armenia"
                />
              </div>

              <div className="form-group">
                <label>Fecha de Expiración (opcional)</label>
                <input
                  type="date"
                  value={currentDocument.expirationDate}
                  onChange={(e) => handleDocumentChange('expirationDate', e.target.value)}
                />
              </div>

              <button 
                className="add-document-button"
                onClick={handleAddDocument}
              >
                <Upload size={16} />
                Agregar Documento
              </button>
            </div>

            {documents.length > 0 && (
              <div className="documents-list">
                <h4>Documentos Agregados ({documents.length})</h4>
                {documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <div className="document-info">
                      <FileText size={16} className="text-blue-600" />
                      <div>
                        <strong>{documentTypes.find(t => t.value === doc.type)?.label}</strong>
                        <p>Número: {doc.documentNumber}</p>
                        <p>Entidad: {doc.issuingAuthority}</p>
                        {doc.expirationDate && <p>Expira: {new Date(doc.expirationDate).toLocaleDateString('es-CO')}</p>}
                      </div>
                    </div>
                    <button 
                      className="remove-document-button"
                      onClick={() => handleRemoveDocument(index)}
                      aria-label="Eliminar documento"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="verification-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="verification-actions">
            <button 
              className="secondary-button"
              onClick={onClose}
              disabled={verifying}
            >
              Cancelar
            </button>
            <button 
              className="primary-button"
              onClick={handleVerify}
              disabled={verifying || documents.length === 0}
            >
              {verifying ? 'Verificando...' : 'Iniciar Verificación'}
            </button>
          </div>

          <div className="verification-info">
            <h4>ℹ️ Información del Proceso</h4>
            <ul>
              <li>Se requiere al menos un documento de licencia comercial o cámara de comercio</li>
              <li>La verificación incluye validación de formato y ubicación</li>
              <li>El proceso puede tardar hasta 24 horas en casos especiales</li>
              <li>Recibirás notificación por email del resultado</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default AllyVerification