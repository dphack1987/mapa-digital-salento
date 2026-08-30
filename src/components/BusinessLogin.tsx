// Componente de login para comerciantes
import { useState } from 'react'
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Phone, 
  ArrowRight, 
  X,
  AlertCircle
} from 'lucide-react'
import authService from '../services/authService'

interface BusinessLoginProps {
  onLoginSuccess: (user: any) => void
  onClose: () => void
}

export default function BusinessLogin({ onLoginSuccess, onClose }: BusinessLoginProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    businessName: '',
    businessType: 'restaurante',
    phone: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await authService.login(loginData)
      
      if (result.success && result.user) {
        onLoginSuccess(result.user)
      } else {
        setError(result.error || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await authService.register(registerData)
      
      if (result.success && result.user) {
        // Auto-login después del registro
        const loginResult = await authService.login({
          email: registerData.email,
          password: registerData.password
        })
        
        if (loginResult.success && loginResult.user) {
          onLoginSuccess(loginResult.user)
        }
      } else {
        setError(result.error || 'Error al registrar')
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="business-login-overlay">
      <div className="business-login-modal">
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="login-header">
          <div className="login-logo">
            <Building2 size={32} />
          </div>
          <h2>{isRegister ? 'Registrar Negocio' : 'Acceso Comerciantes'}</h2>
          <p>{isRegister ? 'Únete a la red de Salento a la Mano' : 'Gestiona tu negocio en Salento'}</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {!isRegister ? (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>
                <Mail size={16} />
                Email
              </label>
              <input 
                type="email" 
                placeholder="tu@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Lock size={16} />
                Contraseña
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              {!loading && <ArrowRight size={16} />}
            </button>

            <div className="form-footer">
              <p>¿No tienes cuenta? {' '}
                <button type="button" onClick={() => setIsRegister(true)}>
                  Registrar negocio
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form className="register-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>
                <User size={16} />
                Tu nombre
              </label>
              <input 
                type="text" 
                placeholder="Juan Pérez"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Building2 size={16} />
                Nombre del negocio
              </label>
              <input 
                type="text" 
                placeholder="Mi Restaurante"
                value={registerData.businessName}
                onChange={(e) => setRegisterData({ ...registerData, businessName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Building2 size={16} />
                Tipo de negocio
              </label>
              <select 
                value={registerData.businessType}
                onChange={(e) => setRegisterData({ ...registerData, businessType: e.target.value })}
                required
              >
                <option value="restaurante">Restaurante</option>
                <option value="cafeteria">Cafetería</option>
                <option value="hostal">Hostal</option>
                <option value="tienda">Tienda</option>
                <option value="experiencia">Experiencia turística</option>
                <option value="transporte">Transporte</option>
                <option value="artesania">Artesanías</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <Phone size={16} />
                Teléfono
              </label>
              <input 
                type="tel" 
                placeholder="+57 300 123 4567"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Mail size={16} />
                Email
              </label>
              <input 
                type="email" 
                placeholder="tu@email.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Lock size={16} />
                Contraseña
              </label>
              <input 
                type="password" 
                placeholder="Mínimo 6 caracteres"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear cuenta'}
              {!loading && <ArrowRight size={16} />}
            </button>

            <div className="form-footer">
              <p>¿Ya tienes cuenta? {' '}
                <button type="button" onClick={() => setIsRegister(false)}>
                  Iniciar sesión
                </button>
              </p>
            </div>
          </form>
        )}

        <div className="login-info">
          <p>🔒 Tus datos están protegidos</p>
          <p>Al registrarte aceptas nuestros términos y condiciones</p>
        </div>
      </div>
    </div>
  )
}