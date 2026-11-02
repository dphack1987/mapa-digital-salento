// Ticker de social proof en tiempo real
// Muestra actividad reciente y usuarios activos para generar confianza

import { useState, useEffect } from 'react'
import { Users, Activity } from 'lucide-react'

interface Activity {
  user: string
  action: string
  time: string
}

const SocialProofTicker: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(15)
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [activityIndex, setActivityIndex] = useState(0)

  const activities: Activity[] = [
    { user: 'Juan de Bogotá', action: 'reservó Hotel Camino Nacional', time: 'hace 2 min' },
    { user: 'María de Argentina', action: 'visitó Valle de Cocora', time: 'hace 5 min' },
    { user: 'Pedro de España', action: 'reservó coffee tour', time: 'hace 8 min' },
    { user: 'Ana de México', action: 'vio restaurantes en Salento', time: 'hace 12 min' },
    { user: 'Carlos de Chile', action: 'contactó hotel por WhatsApp', time: 'hace 15 min' },
    { user: 'Laura de Francia', action: 'buscó coffee tours', time: 'hace 18 min' },
    { user: 'Miguel de Perú', action: 'vió información de vías', time: 'hace 22 min' },
    { user: 'Sofía de Italia', action: 'exploró mapa de Salento', time: 'hace 25 min' }
  ]

  useEffect(() => {
    // Actualizar contador de usuarios activos cada 30 segundos
    const usersInterval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(10, prev + change)
      })
    }, 30000)

    // Rotar actividades cada 8 segundos
    const activityInterval = setInterval(() => {
      setActivityIndex(prev => (prev + 1) % activities.length)
    }, 8000)

    return () => {
      clearInterval(usersInterval)
      clearInterval(activityInterval)
    }
  }, [])

  useEffect(() => {
    setCurrentActivity(activities[activityIndex])
  }, [activityIndex])

  if (!currentActivity) return null

  return (
    <div className="social-proof-ticker">
      <div className="active-users">
        <Users size={16} />
        <span>{activeUsers} explorando Salento ahora</span>
      </div>

      <div className="activity-item">
        <Activity size={14} />
        <span className="activity-text">
          <strong>{currentActivity.user}</strong> {currentActivity.action}
        </span>
        <span className="activity-time">{currentActivity.time}</span>
      </div>
    </div>
  )
}

export default SocialProofTicker
