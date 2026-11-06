// Dashboard de Negocio e Impacto — Salento a la Manó
// Muestra métricas reales del catálogo (lugares, comercios, pautantes)
// y proyecciones del modelo claramente identificadas.
// Usado como vitrina para demos (jurado WSA, aliados, prensa).

import { useMemo, useState } from 'react'
import { Store, Users, Globe, TrendingUp, Shield, X, BarChart3, MapPin, MessageCircle, Camera, BadgeCheck, Rocket, Cpu, Handshake, Leaf } from 'lucide-react'
import type { Place } from '../types'

interface BusinessDashboardProps {
  places: Place[]
  onClose?: () => void
}

const LANGUAGES = ['Español', 'English', 'Français', 'Deutsch', 'Português', 'Italiano']
const CURRENCIES = ['COP', 'USD', 'EUR']

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ places, onClose }) => {
  const stats = useMemo(() => {
    const verified = places.filter(p => p.verified)
    const pautantes = places.filter(p => p.isPautante)
    const withPhotos = places.filter(p => (p.photos?.length ?? 0) > 0)
    const withWhatsApp = places.filter(p => p.contact?.whatsapp || p.contact?.phone)
    const byType = new Map<string, number>()
    places.forEach(p => byType.set(p.type, (byType.get(p.type) ?? 0) + 1))
    const topTypes = [...byType.entries()].sort((a, b) => b[1] - a[1])
    const maxType = topTypes[0]?.[1] ?? 1
    return { total: places.length, verified: verified.length, pautantes: pautantes.length, withPhotos: withPhotos.length, withWhatsApp: withWhatsApp.length, topTypes, maxType }
  }, [places])

  const tabs = [
    { id: 'negocio', label: 'Negocio', icon: <Store size={14} /> },
    { id: 'impacto', label: 'Impacto', icon: <Users size={14} /> },
    { id: 'escalabilidad', label: 'Escalabilidad', icon: <Rocket size={14} /> },
    { id: 'tecnologia', label: 'Tecnología', icon: <Cpu size={14} /> },
  ] as const
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('negocio')

  return (
    <div className="defensive-seo-dashboard">
      <div className="business-dashboard-panel">
        <div className="defensive-seo-header">
          <div className="defensive-seo-title">
            <BarChart3 size={24} color="var(--green)" />
            <div>
              <h2>Impacto de la plataforma</h2>
              <p>Salento a la Mano · métricas reales del directorio + modelo de negocio</p>
            </div>
          </div>
          <div className="header-actions">
            {onClose && <button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>}
          </div>
        </div>

        <div className="defensive-seo-stats">
          <div className="stat-card"><BadgeCheck size={20} color="var(--green)" /><div><strong>{stats.verified}</strong><span>Lugares verificados</span></div></div>
          <div className="stat-card"><Store size={20} color="var(--blue, #3b82f6)" /><div><strong>{stats.pautantes}</strong><span>Comercios con reserva directa</span></div></div>
          <div className="stat-card"><Camera size={20} color="var(--purple, #a855f7)" /><div><strong>{stats.withPhotos}</strong><span>Lugares con fotos propias</span></div></div>
          <div className="stat-card"><Globe size={20} color="var(--coral)" /><div><strong>{LANGUAGES.length}</strong><span>Idiomas + {CURRENCIES.length} monedas</span></div></div>
        </div>

        <div className="defensive-seo-tabs">
          {tabs.map(t => (
            <button key={t.id} className={`tab-button ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="defensive-seo-content">
          {activeTab === 'negocio' && (
            <div className="biz-tab">
              <h3 className="biz-h">Red comercial activa</h3>
              <p className="biz-note">Datos reales del catálogo publicado. Los comercios reservan directo por WhatsApp: <strong>0% de comisión</strong> para el visitante (vs 15–30% típico de OTAs).</p>
              <div className="biz-bars">
                {stats.topTypes.map(([type, count]) => (
                  <div key={type} className="biz-row">
                    <span className="biz-row-label">{type}</span>
                    <div className="biz-bar-track"><div className="biz-bar-fill" style={{ width: `${Math.round((count / stats.maxType) * 100)}%` }} /></div>
                    <strong className="biz-row-count">{count}</strong>
                  </div>
                ))}
              </div>
              <div className="biz-chips">
                <span className="biz-chip"><MessageCircle size={13} /> {stats.withWhatsApp} con contacto directo</span>
                <span className="biz-chip"><Globe size={13} /> {LANGUAGES.length} idiomas</span>
                <span className="biz-chip"><TrendingUp size={13} /> {CURRENCIES.join(' · ')} monedas</span>
              </div>
            </div>
          )}

          {activeTab === 'impacto' && (
            <div className="biz-tab">
              <h3 className="biz-h">Impacto en la comunidad local</h3>
              <div className="biz-cards-2">
                <div className="biz-mini-card"><Handshake size={22} /><strong>{stats.pautantes}</strong><span>comercios con página propia y reserva directa</span></div>
                <div className="biz-mini-card"><MapPin size={22} /><strong>Salento + zona rural</strong><span>cobertura verificada campo–pueblo (Valle del Cocora sin señal incluida)</span></div>
                <div className="biz-mini-card"><Leaf size={22} /><strong>Menos intermediación</strong><span>el margen completo queda en el negocio local</span></div>
                <div className="biz-mini-card"><Users size={22} /><strong>{LANGUAGES.length} idiomas</strong><span>turismo internacional atendido sin barrera de idioma</span></div>
              </div>
              <h4 className="biz-sub">Alineación ODS</h4>
              <div className="biz-chips">
                <span className="biz-chip">ODS 8 · Trabajo decente y crecimiento</span>
                <span className="biz-chip">ODS 9 · Innovación e infraestructura</span>
                <span className="biz-chip">ODS 10 · Reducción de desigualdades</span>
                <span className="biz-chip">ODS 11 · Ciudades sostenibles</span>
                <span className="biz-chip">ODS 17 · Alianzas</span>
              </div>
            </div>
          )}

          {activeTab === 'escalabilidad' && (
            <div className="biz-tab">
              <h3 className="biz-h">Modelo replicable por municipio</h3>
              <div className="biz-roadmap">
                <div className="biz-roadmap-item done"><MapPin size={16} /><div><strong>Salento</strong><span>Operativo · {stats.total} lugares · {stats.pautantes} comercios directos</span></div></div>
                <div className="biz-roadmap-item progress"><Rocket size={16} /><div><strong>Filandia</strong><span>Implementación · misma arquitectura de datos</span></div></div>
                <div className="biz-roadmap-item"><MapPin size={16} /><div><strong>10 municipios Quindío</strong><span>Roadmap · clon del modelo con datos locales</span></div></div>
                <div className="biz-roadmap-item"><Globe size={16} /><div><strong>LATAM</strong><span>1.100+ municipios turísticos · plantilla multi-país ya traducida</span></div></div>
              </div>
              <p className="biz-note">La réplica por municipio toma semanas, no años: el catálogo, las páginas pautantes y el menú interactivo se generan desde la misma base de datos.</p>
            </div>
          )}

          {activeTab === 'tecnologia' && (
            <div className="biz-tab">
              <h3 className="biz-h">Tecnología aplicada al contexto rural</h3>
              <div className="biz-cards-2">
                <div className="biz-mini-card"><Shield size={22} /><strong>Offline-first</strong><span>Service Worker + IndexedDB: funciona sin señal en el Valle de Cocora</span></div>
                <div className="biz-mini-card"><Globe size={22} /><strong>6 idiomas automáticos</strong><span>Detección de navegador + traducción completa ES/EN/FR/DE/PT/IT</span></div>
                <div className="biz-mini-card"><TrendingUp size={22} /><strong>SEO estructurado</strong><span>Schema.org por lugar + FAQPage + Open Graph dinámico en cada ficha</span></div>
                <div className="biz-mini-card"><Cpu size={22} /><strong>Don Chucho IA</strong><span>Asistente con base de conocimiento verificada local</span></div>
              </div>
              <p className="biz-note">Medición: Google Analytics 4 con eventos de negocio (vistas, búsquedas, clics WhatsApp, pedidos) para reportar impacto real.</p>
            </div>
          )}
        </div>

        <div className="defensive-seo-footer">
          <p><Shield size={14} /> Datos del catálogo en vivo · Proyecciones del modelo identificadas como tales · Salento a la Manó · WSA Business &amp; Commerce</p>
        </div>
      </div>
    </div>
  )
}

export default BusinessDashboard
