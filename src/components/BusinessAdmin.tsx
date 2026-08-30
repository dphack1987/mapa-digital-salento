// Interfaz de administración para comercios aliados
// Permite gestionar pedidos, configurar plantillas de WhatsApp, ver estadísticas

import { useState, useEffect } from 'react'
import { 
  Package, 
  BarChart3, 
  Settings, 
  Users, 
  QrCode, 
  MessageSquare, 
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Bell,
  LogOut
} from 'lucide-react'
import orderService from '../services/orderService'
import qrTrackingService from '../services/qrTrackingService'
import whatsappTemplateService from '../services/whatsappTemplateService'
import analyticsService from '../services/analyticsService'
import AnalyticsDashboard from './AnalyticsDashboard'

interface BusinessAdminProps {
  businessId: string
  businessName: string
  onLogout: () => void
}

type AdminTab = 'dashboard' | 'orders' | 'qr' | 'whatsapp' | 'settings'

export default function BusinessAdmin({ businessId, businessName, onLogout }: BusinessAdminProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [orders, setOrders] = useState(orderService.getOrdersByBusiness(businessId))
  const [qrStats, setQrStats] = useState(qrTrackingService.getBusinessStatistics(businessId))
  const [orderStats, setOrderStats] = useState(orderService.getOrderStatistics(businessId))
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    // Actualizar datos periódicamente
    const interval = setInterval(() => {
      setOrders(orderService.getOrdersByBusiness(businessId))
      setQrStats(qrTrackingService.getBusinessStatistics(businessId))
      setOrderStats(orderService.getOrderStatistics(businessId))
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [businessId])

  const updateOrderStatus = (orderId: string, newStatus: 'confirmed' | 'preparing' | 'delivered' | 'cancelled') => {
    orderService.updateOrderStatus(orderId, newStatus)
    setOrders(orderService.getOrdersByBusiness(businessId))
    setOrderStats(orderService.getOrderStatistics(businessId))
  }

  const generateWhatsAppMessage = (orderId: string) => {
    const message = orderService.generateWhatsAppMessage(orderId)
    if (message) {
      navigator.clipboard.writeText(message)
      alert('Mensaje copiado al portapapeles')
    }
  }

  return (
    <div className="business-admin">
      <header className="admin-header">
        <div className="admin-brand">
          <h1>{businessName}</h1>
          <span>Panel de Administración</span>
        </div>
        <button className="logout-button" onClick={onLogout}>
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </header>

      <nav className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={18} />
          Dashboard
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          <Package size={18} />
          Pedidos
        </button>
        <button 
          className={activeTab === 'qr' ? 'active' : ''} 
          onClick={() => setActiveTab('qr')}
        >
          <QrCode size={18} />
          Códigos QR
        </button>
        <button 
          className={activeTab === 'whatsapp' ? 'active' : ''} 
          onClick={() => setActiveTab('whatsapp')}
        >
          <MessageSquare size={18} />
          WhatsApp
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''} 
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} />
          Configuración
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            orderStats={orderStats} 
            qrStats={qrStats} 
            businessName={businessName}
            businessId={businessId}
            onOpenAnalytics={() => setShowAnalytics(true)}
          />
        )}
        
        {activeTab === 'orders' && (
          <OrdersTab 
            orders={orders} 
            onUpdateStatus={updateOrderStatus}
            onGenerateWhatsApp={generateWhatsAppMessage}
          />
        )}
        
        {activeTab === 'qr' && (
          <QrTab 
            businessId={businessId} 
            businessName={businessName}
            stats={qrStats}
          />
        )}
        
        {activeTab === 'whatsapp' && (
          <WhatsAppTab businessId={businessId} businessName={businessName} />
        )}
        
        {activeTab === 'settings' && (
          <SettingsTab businessId={businessId} businessName={businessName} />
        )}
      </main>
      
      {showAnalytics && (
        <AnalyticsDashboard
          placeId={businessId}
          placeName={businessName}
          onClose={() => setShowAnalytics(false)}
          language="es"
        />
      )}
    </div>
  )
}

function DashboardTab({ orderStats, qrStats, businessName, businessId, onOpenAnalytics }: any) {
  return (
    <div className="dashboard-tab">
      <div className="dashboard-header">
        <h2>📊 Dashboard - {businessName}</h2>
        <button 
          className="analytics-btn"
          onClick={onOpenAnalytics}
        >
          <BarChart3 size={16} />
          Ver Analytics Avanzados
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Package size={24} /></div>
          <div className="stat-info">
            <h3>{orderStats.totalOrders}</h3>
            <p>Pedidos Totales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <h3>${orderStats.totalRevenue.toLocaleString()}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon"><QrCode size={24} /></div>
          <div className="stat-info">
            <h3>{qrStats.totalScans}</h3>
            <p>Escaneos QR</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-info">
            <h3>{qrStats.averageConversionRate.toFixed(1)}%</h3>
            <p>Tasa Conversión</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Estado de Pedidos</h3>
          <div className="status-breakdown">
            {Object.entries(orderStats.statusBreakdown).map(([status, count]) => (
              <div key={status} className="status-item">
                <span className="status-label">{status}</span>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Métodos de Pago</h3>
          <div className="payment-breakdown">
            {Object.entries(orderStats.paymentMethodBreakdown).map(([method, count]) => (
              <div key={method} className="payment-item">
                <span className="payment-label">{method}</span>
                <span className="payment-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrdersTab({ orders, onUpdateStatus, onGenerateWhatsApp }: any) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'preparing' | 'delivered'>('all')
  
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter((order: any) => order.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="status-pending" />
      case 'confirmed': return <CheckCircle size={16} className="status-confirmed" />
      case 'preparing': return <Package size={16} className="status-preparing" />
      case 'delivered': return <CheckCircle size={16} className="status-delivered" />
      case 'cancelled': return <XCircle size={16} className="status-cancelled" />
      default: return <Clock size={16} />
    }
  }

  return (
    <div className="orders-tab">
      <div className="orders-header">
        <h2>📦 Gestión de Pedidos</h2>
        <div className="filter-buttons">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            Todos
          </button>
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>
            Pendientes
          </button>
          <button className={filter === 'confirmed' ? 'active' : ''} onClick={() => setFilter('confirmed')}>
            Confirmados
          </button>
          <button className={filter === 'preparing' ? 'active' : ''} onClick={() => setFilter('preparing')}>
            Preparando
          </button>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">No hay pedidos en esta categoría</div>
        ) : (
          filteredOrders.map((order: any) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">#{order.orderId}</span>
                  <span className="order-customer">{order.customerInfo.name}</span>
                  <span className="order-location">{order.locationInfo.hotelName}</span>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.status)}
                  <span className="status-text">{order.status}</span>
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="order-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <strong>${order.paymentInfo.amount.toLocaleString()}</strong>
                </div>
                
                <div className="order-actions">
                  <button 
                    className="whatsapp-action"
                    onClick={() => onGenerateWhatsApp(order.orderId)}
                  >
                    <MessageSquare size={14} />
                    WhatsApp
                  </button>
                  
                  {order.status === 'pending' && (
                    <button 
                      className="confirm-action"
                      onClick={() => onUpdateStatus(order.orderId, 'confirmed')}
                    >
                      <CheckCircle size={14} />
                      Confirmar
                    </button>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <button 
                      className="prepare-action"
                      onClick={() => onUpdateStatus(order.orderId, 'preparing')}
                    >
                      <Package size={14} />
                      Preparar
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button 
                      className="deliver-action"
                      onClick={() => onUpdateStatus(order.orderId, 'delivered')}
                    >
                      <CheckCircle size={14} />
                      Entregar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function QrTab({ businessId, businessName, stats }: any) {
  const [newQrLocation, setNewQrLocation] = useState('')

  const generateNewQR = () => {
    if (newQrLocation) {
      const qrUrl = qrTrackingService.generateBusinessQR(businessId, businessName, newQrLocation)
      alert(`QR generado: ${qrUrl}`)
      setNewQrLocation('')
    }
  }

  return (
    <div className="qr-tab">
      <h2>📱 Gestión de Códigos QR</h2>
      
      <div className="qr-stats">
        <div className="qr-stat-item">
          <span>Total QRs:</span>
          <strong>{stats.totalQRs}</strong>
        </div>
        <div className="qr-stat-item">
          <span>Total Escaneos:</span>
          <strong>{stats.totalScans}</strong>
        </div>
        <div className="qr-stat-item">
          <span>Conversión:</span>
          <strong>{stats.averageConversionRate.toFixed(1)}%</strong>
        </div>
      </div>

      <div className="qr-generator">
        <h3>Generar Nuevo QR</h3>
        <div className="qr-form">
          <select 
            value={newQrLocation} 
            onChange={(e) => setNewQrLocation(e.target.value)}
          >
            <option value="">Seleccionar ubicación...</option>
            <option value="hostal">Hostal (Mesa de Noche)</option>
            <option value="mostrador">Mostrador</option>
            <option value="jeep">Jeep Willys</option>
            <option value="entrada">Entrada</option>
          </select>
          <button onClick={generateNewQR} disabled={!newQrLocation}>
            <QrCode size={16} />
            Generar QR
          </button>
        </div>
      </div>

      <div className="qr-locations">
        <h3>Ubicaciones de QR</h3>
        <div className="qr-location-list">
          <div className="qr-location-item">
            <span>🏨 Hostal Principal</span>
            <span className="qr-scans">12 escaneos</span>
          </div>
          <div className="qr-location-item">
            <span>🚪 Entrada Principal</span>
            <span className="qr-scans">8 escaneos</span>
          </div>
          <div className="qr-location-item">
            <span>🪑 Mostrador</span>
            <span className="qr-scans">5 escaneos</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WhatsAppTab({ businessId, businessName }: any) {
  const [templateType, setTemplateType] = useState<'order' | 'reservation' | 'inquiry'>('order')

  const previewTemplate = () => {
    let preview = ''
    
    switch (templateType) {
      case 'order':
        const sampleOrder = {
          orderId: 'ORD-123456',
          customerName: 'Juan Pérez',
          hotel: 'Hotel Camino Nacional',
          roomNumber: '101',
          items: [
            { name: 'Trucha con patacón', quantity: 2, price: 35000, notes: 'Sin cebolla' }
          ],
          totalAmount: 70000,
          paymentMethod: 'efectivo',
          timestamp: new Date()
        }
        preview = whatsappTemplateService.generateOrderMessage(sampleOrder, 'es')
        break
      case 'reservation':
        const sampleReservation = {
          reservationId: 'RES-789012',
          customerName: 'María García',
          checkIn: new Date(),
          checkOut: new Date(Date.now() + 86400000),
          guests: 2,
          roomType: 'Doble',
          contactPhone: '+573001234567'
        }
        preview = whatsappTemplateService.generateReservationMessage(sampleReservation, 'es')
        break
      case 'inquiry':
        const sampleInquiry = {
          customerName: 'Carlos López',
          businessName: businessName,
          inquiryType: 'producto',
          message: '¿Tienen disponibilidad para mañana?',
          language: 'es'
        }
        preview = whatsappTemplateService.generateInquiryMessage(sampleInquiry)
        break
    }
    
    return preview
  }

  return (
    <div className="whatsapp-tab">
      <h2>💬 Configuración de WhatsApp</h2>
      
      <div className="whatsapp-config">
        <div className="template-selector">
          <h3>Plantillas de Mensaje</h3>
          <div className="template-buttons">
            <button 
              className={templateType === 'order' ? 'active' : ''} 
              onClick={() => setTemplateType('order')}
            >
              📦 Pedidos
            </button>
            <button 
              className={templateType === 'reservation' ? 'active' : ''} 
              onClick={() => setTemplateType('reservation')}
            >
              🏨 Reservas
            </button>
            <button 
              className={templateType === 'inquiry' ? 'active' : ''} 
              onClick={() => setTemplateType('inquiry')}
            >
              ❓ Consultas
            </button>
          </div>
        </div>

        <div className="template-preview">
          <h3>Vista Previa</h3>
          <div className="preview-content">
            <pre>{previewTemplate()}</pre>
          </div>
        </div>

        <div className="whatsapp-settings">
          <h3>Configuración</h3>
          <div className="setting-item">
            <label>Número de WhatsApp</label>
            <input type="text" placeholder="+57 300 123 4567" />
          </div>
          <div className="setting-item">
            <label>Mensaje de confirmación automática</label>
            <textarea 
              placeholder="Mensaje que se envía automáticamente cuando se recibe un pedido..."
              rows={3}
            />
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Habilitar respuestas automáticas
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsTab({ businessId, businessName }: any) {
  return (
    <div className="settings-tab">
      <h2>⚙️ Configuración del Negocio</h2>
      
      <div className="settings-form">
        <div className="form-section">
          <h3>Información Básica</h3>
          <div className="form-group">
            <label>Nombre del Negocio</label>
            <input type="text" defaultValue={businessName} />
          </div>
          <div className="form-group">
            <label>Tipo de Negocio</label>
            <select>
              <option>Restaurante</option>
              <option>Cafetería</option>
              <option>Hostal</option>
              <option>Tienda</option>
              <option>Experiencia</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Notificaciones</h3>
          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked />
              Recibir notificaciones de nuevos pedidos
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked />
              Recibir notificaciones de escaneos QR
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" />
              Resumen diario de estadísticas
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Integraciones</h3>
          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked />
              WhatsApp Business
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" />
              Sistema de pago local
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button className="save-button">Guardar Cambios</button>
          <button className="export-button">
            <Download size={16} />
            Exportar Datos
          </button>
        </div>
      </div>
    </div>
  )
}