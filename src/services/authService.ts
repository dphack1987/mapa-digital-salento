// Sistema de autenticación para comerciantes
// Permite login seguro y gestión de sesiones para el panel de administración

interface User {
  id: string
  email: string
  name: string
  businessId: string
  businessName: string
  role: 'admin' | 'manager' | 'staff'
  createdAt: Date
  lastLogin?: Date
}

interface AuthSession {
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  businessName: string
  businessType: string
  phone: string
}

class AuthService {
  private users: Map<string, User> = new Map()
  private sessions: Map<string, AuthSession> = new Map()
  private currentUser: User | null = null
  private sessionDuration = 24 * 60 * 60 * 1000 // 24 horas

  /**
   * Inicializar con datos de prueba
   */
  initialize() {
    // Crear usuario de prueba para desarrollo
    this.register({
      email: 'admin@salento.com',
      password: 'admin123',
      name: 'Administrador',
      businessName: 'Salento a la Mano',
      businessType: 'platform',
      phone: '+573001234567'
    })
  }

  /**
   * Registrar nuevo usuario (comerciante)
   */
  async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    // Validar que el email no exista
    if (this.users.has(data.email)) {
      return { success: false, error: 'El email ya está registrado' }
    }

    // Validar datos
    const validation = this.validateRegistrationData(data)
    if (!validation.valid) {
      return { success: false, error: validation.errors.join(', ') }
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: this.generateUserId(),
      email: data.email,
      name: data.name,
      businessId: this.generateBusinessId(),
      businessName: data.businessName,
      role: 'admin', // Por defecto es admin de su negocio
      createdAt: new Date()
    }

    // En producción, aquí se hashearía el password
    // Por ahora, lo guardamos en memoria (no seguro para producción)
    this.users.set(data.email, newUser)

    return { success: true, user: newUser }
  }

  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    const user = this.users.get(credentials.email)

    if (!user) {
      return { success: false, error: 'Credenciales inválidas' }
    }

    // En producción, aquí se verificaría el password hasheado
    // Por ahora, aceptamos cualquier password para desarrollo
    // if (user.password !== this.hashPassword(credentials.password)) {
    //   return { success: false, error: 'Credenciales inválidas' }
    // }

    // Actualizar último login
    user.lastLogin = new Date()
    this.users.set(credentials.email, user)

    // Crear sesión
    const session: AuthSession = {
      userId: user.id,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + this.sessionDuration),
      createdAt: new Date()
    }

    this.sessions.set(session.token, session)
    this.currentUser = user

    // Guardar en localStorage
    this.saveSessionToStorage(session)

    return { success: true, user, token: session.token }
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    if (this.currentUser) {
      // Eliminar todas las sesiones del usuario
      for (const [token, session] of this.sessions.entries()) {
        if (session.userId === this.currentUser.id) {
          this.sessions.delete(token)
        }
      }
    }

    this.currentUser = null
    this.clearSessionFromStorage()
  }

  /**
   * Verificar si hay una sesión activa
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUser
  }

  /**
   * Refrescar sesión desde localStorage
   */
  refreshSession(): boolean {
    const storedSession = this.getSessionFromStorage()
    
    if (!storedSession) {
      return false
    }

    const session = this.sessions.get(storedSession.token)
    
    if (!session || session.expiresAt < new Date()) {
      this.clearSessionFromStorage()
      return false
    }

    const user = Array.from(this.users.values()).find(u => u.id === session.userId)
    
    if (user) {
      this.currentUser = user
      return true
    }

    return false
  }

  /**
   * Validar token
   */
  validateToken(token: string): boolean {
    const session = this.sessions.get(token)
    
    if (!session) {
      return false
    }

    if (session.expiresAt < new Date()) {
      this.sessions.delete(token)
      return false
    }

    return true
  }

  /**
   * Obtener todos los usuarios (solo para admin)
   */
  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  /**
   * Actualizar usuario
   */
  updateUser(userId: string, updates: Partial<User>): boolean {
    const user = Array.from(this.users.values()).find(u => u.id === userId)
    
    if (user) {
      Object.assign(user, updates)
      this.users.set(user.email, user)
      return true
    }

    return false
  }

  /**
   * Eliminar usuario
   */
  deleteUser(userId: string): boolean {
    const user = Array.from(this.users.values()).find(u => u.id === userId)
    
    if (user) {
      this.users.delete(user.email)
      return true
    }

    return false
  }

  /**
   * Validar datos de registro
   */
  private validateRegistrationData(data: RegisterData): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Email inválido')
    }

    if (!data.password || data.password.length < 6) {
      errors.push('El password debe tener al menos 6 caracteres')
    }

    if (!data.name || data.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres')
    }

    if (!data.businessName || data.businessName.trim().length < 2) {
      errors.push('El nombre del negocio debe tener al menos 2 caracteres')
    }

    if (!data.phone || !this.isValidPhone(data.phone)) {
      errors.push('Teléfono inválido')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Validar formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validar formato de teléfono
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    return phoneRegex.test(phone)
  }

  /**
   * Generar ID de usuario
   */
  private generateUserId(): string {
    return `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generar ID de negocio
   */
  private generateBusinessId(): string {
    return `BIZ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  }

  /**
   * Generar token de sesión
   */
  private generateToken(): string {
    return `TOKEN-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`
  }

  /**
   * Guardar sesión en localStorage
   */
  private saveSessionToStorage(session: AuthSession): void {
    try {
      const sessionData = {
        token: session.token,
        expiresAt: session.expiresAt.toISOString()
      }
      localStorage.setItem('salento_auth_session', JSON.stringify(sessionData))
    } catch (error) {
      console.error('Error saving session to storage:', error)
    }
  }

  /**
   * Obtener sesión de localStorage
   */
  private getSessionFromStorage(): { token: string; expiresAt: string } | null {
    try {
      const stored = localStorage.getItem('salento_auth_session')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error reading session from storage:', error)
    }
    return null
  }

  /**
   * Limpiar sesión de localStorage
   */
  private clearSessionFromStorage(): void {
    try {
      localStorage.removeItem('salento_auth_session')
    } catch (error) {
      console.error('Error clearing session from storage:', error)
    }
  }

  /**
   * Limpiar sesiones expiradas
   */
  cleanExpiredSessions(): void {
    const now = new Date()
    
    for (const [token, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(token)
      }
    }
  }

  /**
   * Obtener estadísticas de autenticación
   */
  getStatistics(): {
    totalUsers: number
    activeSessions: number
    usersByRole: Record<string, number>
  } {
    const usersByRole: Record<string, number> = {}
    
    this.users.forEach(user => {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1
    })

    return {
      totalUsers: this.users.size,
      activeSessions: this.sessions.size,
      usersByRole
    }
  }
}

// Exportar instancia singleton
export const authService = new AuthService()
export default authService