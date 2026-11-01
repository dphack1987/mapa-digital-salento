# 🔍 ANÁLISIS DE MEJORAS EN CÓDIGO RAIZ - SALENTO A LA MANO
## Análisis Exhaustivo de `src/App.tsx` (2,823 líneas)

**Fecha:** 31/10/2026  
**Estado:** 🟢 Funcional y en producción  
**Objetivo:** Identificar oportunidades de mejora sin borrar código existente

---

## 📊 MÉTRICAS ACTUALES

### Archivo App.tsx
- **Líneas:** 2,823 líneas
- **Componentes:** 1 componente principal (App) + múltiples modales/lazy components
- **Estado (useState):** 63 instancias
- **Efectos (useEffect):** ~25 instancias
- **Memoization (useMemo):** ~10 instancias
- **Callbacks (useCallback):** ~5 instancias

### Build Actual
- **Bundle size:** 857.59 kB (232.13 kB gzip) - componente components chunk
- **Build time:** 1m 18s
- **Modules:** 1,596 transformados
- **TypeScript:** ✅ Sin errores

---

## 🎯 OPORTUNIDADES DE MEJORA IDENTIFICADAS

### 1. ✅ OPTIMIZACIÓN DE PERFORMANCE (Alta Prioridad)

#### Problema: Muchos useState individuales (63 instancias)

**Situación actual:**
```typescript
const [activeCategory, setActiveCategory] = useState<Category>('Todo')
const [cartCount, setCartCount] = useState(0)
const [search, setSearch] = useState('')
const [quickFilter, setQuickFilter] = useState<'all' | 'whatsapp' | 'pautante'>('all')
const [directoryLimit, setDirectoryLimit] = useState(12)
const [mobileNav, setMobileNav] = useState(false)
const [language, setLanguage] = useState<Language>(...)
const [currency, setCurrency] = useState<Currency>(...)
// ... y 55+ más
```

**Impacto:**
- Cada useState crea su propio estado y triggers re-renders
- Muchos estados están relacionados pero no agrupados
- Dificultad para tracking de cambios

**Mejora propuesta (sin borrar):**
Crear custom hooks para agrupar estados relacionados:

```typescript
// Nuevo archivo: src/hooks/useAppState.ts
export function useAppState() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todo')
  const [search, setSearch] = useState('')
  const [quickFilter, setQuickFilter] = useState<'all' | 'whatsapp' | 'pautante'>('all')
  const [directoryLimit, setDirectoryLimit] = useState(12)

  return {
    activeCategory,
    setActiveCategory,
    search,
    setSearch,
    quickFilter,
    setQuickFilter,
    directoryLimit,
    setDirectoryLimit
  }
}

// Nuevo archivo: src/hooks/useUIState.ts
export function useUIState() {
  const [mobileNav, setMobileNav] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHorsebackRiding, setShowHorsebackRiding] = useState(false)
  const [showReviews, setShowReviews] = useState<string | null>(null)
  const [showSupport, setShowSupport] = useState(false)
  const [showQRShare, setShowQRShare] = useState(false)

  return {
    mobileNav,
    setMobileNav,
    showCart,
    setShowCart,
    showNotifications,
    setShowNotifications,
    showHorsebackRiding,
    setShowHorsebackRiding,
    showReviews,
    setShowReviews,
    showSupport,
    setShowSupport,
    showQRShare,
    setShowQRShare
  }
}
```

**Beneficio:**
- Mejor organización del estado
- Facilita testing de hooks
- Permite reuso en otros componentes
- No requiere borrar código existente (puede migrarse gradualmente)

---

#### Problema: Falta de useCallback en funciones handlers

**Situación actual:**
```typescript
function searchService(term: string) {
  setActiveCategory('Todo')
  setSelectedCategoryPage(null)
  setSelectedPlace(null)
  setSearch(term)
  setQuickFilter('all')
  setTimeout(() => scrollToSection('pedidos'), 0)
  ga4Service.trackSearch(term, 0, 'all')
}

function applyHeroFilter(category: Category, term: string, filter: 'all' | 'whatsapp' | 'pautante' = 'all') {
  setActiveCategory(category)
  setSelectedCategoryPage(null)
  setSelectedPlace(null)
  setSearch(term)
  setQuickFilter(filter)
  setTimeout(() => scrollToSection('pedidos'), 0)
  ga4Service.trackCategoryFilter(category)
}
```

**Impacto:**
- Estas funciones se recrean en cada render
- Props de componentes hijos cambian innecesariamente
- Re-renders cascada innecesarios

**Mejora propuesta (sin borrar):**
Envolver funciones en useCallback:

```typescript
const searchService = useCallback((term: string) => {
  setActiveCategory('Todo')
  setSelectedCategoryPage(null)
  setSelectedPlace(null)
  setSearch(term)
  setQuickFilter('all')
  setTimeout(() => scrollToSection('pedidos'), 0)
  ga4Service.trackSearch(term, 0, 'all')
}, [])

const applyHeroFilter = useCallback((category: Category, term: string, filter: 'all' | 'whatsapp' | 'pautante' = 'all') => {
  setActiveCategory(category)
  setSelectedCategoryPage(null)
  setSelectedPlace(null)
  setSearch(term)
  setQuickFilter(filter)
  setTimeout(() => scrollToSection('pedidos'), 0)
  ga4Service.trackCategoryFilter(category)
}, [])
```

**Beneficio:**
- Previene recreación de funciones en cada render
- Reduce re-renders de componentes hijos
- Mejora performance especialmente en móviles
- Cambio minimalista (solo agregar wrapper)

---

#### Problema: useMemo no utilizado en cálculos costosos

**Situación actual:**
```typescript
const filteredPlaces = places.filter(place => {
  // Lógica de filtrado compleja
  if (activeCategory !== 'Todo' && place.type !== activeCategory) return false
  if (quickFilter === 'whatsapp' && !place.contact.whatsapp) return false
  if (quickFilter === 'pautante' && !place.isPautante) return false
  if (search && !placeMatchesSearch(place, normalizeQuery)) return false
  return true
})
```

**Impacto:**
- Filtrado se ejecuta en cada render
- Con 30+ lugares y búsquedas frecuentes, puede ser costoso
- No se cachea el resultado

**Mejora propuesta (sin borrar):**
Envolver en useMemo:

```typescript
const filteredPlaces = useMemo(() => {
  return places.filter(place => {
    if (activeCategory !== 'Todo' && place.type !== activeCategory) return false
    if (quickFilter === 'whatsapp' && !place.contact.whatsapp) return false
    if (quickFilter === 'pautante' && !place.isPautante) return false
    if (search && !placeMatchesSearch(place, normalizeQuery)) return false
    return true
  })
}, [places, activeCategory, quickFilter, search, normalizeQuery])
```

**Beneficio:**
- Filtrado solo se recalcula cuando dependencies cambian
- Reduce CPU usage en renders innecesarios
- Mejora responsiveness en móviles
- Cambio minimalista (solo agregar wrapper)

---

### 2. ✅ MEJORA DE ORGANIZACIÓN DE CÓDIGO (Media Prioridad)

#### Problema: Componente App demasiado grande (2,823 líneas)

**Situación actual:**
- Todo en un solo archivo
- Difícil de navegar y mantener
- Colaboración difícil (merge conflicts)

**Mejora propuesta (sin borrar):**
Extraer secciones lógicas a componentes/modals separados:

**Archivos nuevos a crear:**
```
src/components/app/
├── AppHeader.tsx          (Header y navegación)
├── AppHero.tsx            (Hero section con filtros)
├── AppDirectory.tsx       (Directorio de lugares)
├── AppFooter.tsx          (Footer)
├── AppModals.tsx          (Todos los modales agrupados)
└── index.ts               (Export de todos)
```

**Beneficio:**
- Mejor organización
- Facilita mantenimiento
- Permite lazy loading granular
- No requiere borrar (solo mover código a nuevos archivos)

---

#### Problema: Lógica de negocio mezclada con UI

**Situación actual:**
```typescript
// Dentro de App.tsx
function handleProviderAction(providerId: number, action: 'reserve' | 'order' | 'contact') {
  const provider = places.find(p => p.id === providerId)
  if (!provider) return
  if (!isValidWhatsAppCO(provider?.contact?.whatsapp)) {
    console.warn(`[App][whatsapp] número inválido para ${provider.name}:`, provider.contact.whatsapp)
  }

  switch (action) {
    case 'reserve':
      if (provider.contact.whatsapp) {
        const message = t('wa.reserve', `¡Hola! Quiero hacer una reserva en ${provider.name}. ¿Qué disponibilidad tienen?`).replace('{name}', provider.name)
        window.open(`https://wa.me/${provider.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
      }
      break
    // ... más casos
  }
}
```

**Mejora propuesta (sin borrar):**
Extraer lógica a servicios:

```typescript
// Nuevo archivo: src/services/whatsappActionService.ts
export class WhatsAppActionService {
  static handleAction(provider: Place, action: 'reserve' | 'order' | 'contact', t: any) {
    if (!isValidWhatsAppCO(provider?.contact?.whatsapp)) {
      console.warn(`[WhatsAppAction] número inválido para ${provider.name}:`, provider.contact.whatsapp)
    }

    const messages = {
      reserve: t('wa.reserve', `¡Hola! Quiero hacer una reserva en ${provider.name}. ¿Qué disponibilidad tienen?`).replace('{name}', provider.name),
      order: t('wa.order', `¡Hola! Quiero hacer un pedido con ${provider.name}. ¿Qué tienen disponible?`).replace('{name}', provider.name),
      contact: t('wa.contact', `¡Hola! Me interesan sus servicios. ¿Pueden proporcionar más información?`)
    }

    const message = messages[action]
    window.open(`https://wa.me/${provider.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
  }
}
```

**Beneficio:**
- Separación de concerns
- Lógica reutilizable
- Facilita testing
- No requiere borrar (llamar servicio desde App.tsx)

---

### 3. ✅ MEJORAS DE ACCESSIBILIDAD (Media Prioridad)

#### Problema: Falta de ARIA labels en algunos elementos

**Situación actual:**
```typescript
<button onClick={() => handleCategoryChange(category)}>
  {category === 'Todo' && <Sparkles size={17} />}
  {t(`categories.${category}`)}
</button>
```

**Mejora propuesta (sin borrar):**
Agregar ARIA labels:

```typescript
<button
  onClick={() => handleCategoryChange(category)}
  aria-label={`Filtrar por ${category}`}
  aria-pressed={activeCategory === category}
  role="tab"
>
  {category === 'Todo' && <Sparkles size={17} />}
  {t(`categories.${category}`)}
</button>
```

**Beneficio:**
- Mejor accesibilidad para screen readers
- Cumplimiento WCAG AA
- Mejor SEO
- Cambio minimalista

---

#### Problema: Falta de loading states para usuarios con conexión lenta

**Situación actual:**
```typescript
const [loading, setLoading] = useState(true)
// ... pero no se usa consistentemente en toda la UI
```

**Mejora propuesta (sin borrar):**
Crear componente de loading consistente:

```typescript
// Nuevo archivo: src/components/LoadingState.tsx
export function LoadingState({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}
```

**Beneficio:**
- Mejor UX en conexiones lentas
- Feedback claro al usuario
- No requiere borrar (agregar donde falte)

---

### 4. ✅ MEJORAS DE SEO (Alta Prioridad para WSA)

#### Problema: Schema.org incompleto para todos los lugares

**Situación actual:**
Schema.org solo en index.html, no dinámico por lugar

**Mejora propuesta (sin borrar):**
Agregar schema dinámico en Helmet:

```typescript
// En App.tsx, cuando selectedPlace cambia
const placeSchema = useMemo(() => {
  if (!selectedPlace) return null

  return {
    "@context": "https://schema.org",
    "@type": selectedPlace.type === 'Alojamientos' ? 'Hotel' : 'LocalBusiness',
    "name": selectedPlace.name,
    "description": selectedPlace.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Salento",
      "addressRegion": "Quindío",
      "addressCountry": "CO"
    },
    "telephone": selectedPlace.contact.phone,
    "priceRange": selectedPlace.priceRange
  }
}, [selectedPlace])

// En JSX
{selectedPlace && (
  <script type="application/ld+json">
    {JSON.stringify(placeSchema)}
  </script>
)}
```

**Beneficio:**
- Mejor SEO para cada lugar
- Rich snippets en Google
- Crítico para WSA (impacto medible)
- No requiere borrar (solo agregar)

---

#### Problema: Open Graph dinámico incompleto

**Situación actual:**
OG tags estáticos en index.html

**Mejora propuesta (sin borrar):**
Actualizar OG tags dinámicamente:

```typescript
const ogImage = useMemo(() => {
  if (selectedPlace && selectedPlace.photos?.[0]) {
    return selectedPlace.photos[0]
  }
  return 'https://www.salentoalamano.com/imagenes-salento/1326163558.webp'
}, [selectedPlace])

// En Helmet
<meta property="og:image" content={ogImage} />
<meta property="og:image:alt" content={selectedPlace?.name || 'Salento a la Mano'} />
```

**Beneficio:**
- Mejor sharing en redes sociales
- Aumenta tráfico social
- Mejor visibilidad para WSA
- No requiere borrar (solo agregar)

---

### 5. ✅ MEJORAS DE ERROR HANDLING (Media Prioridad)

#### Problema: Falta de Error Boundaries

**Situación actual:**
Sin error boundaries, un error en un componente rompe toda la app

**Mejora propuesta (sin borrar):**
Agregar Error Boundary:

```typescript
// Nuevo archivo: src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    ga4Service.trackEvent('error_boundary', {
      error: error.message,
      component: errorInfo.componentStack
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Algo salió mal</h2>
          <p>Por favor, recarga la página</p>
          <button onClick={() => window.location.reload()}>Recargar</button>
        </div>
      )
    }
    return this.props.children
  }
}
```

**Beneficio:**
- App no se rompe completamente con errores
- Mejor UX
- Tracking de errores en GA4
- No requiere borrar (envolver App)

---

### 6. ✅ MEJORAS DE TESTING (Alta Prioridad para WSA)

#### Problema: Sin tests unitarios o integración

**Situación actual:**
Cero tests en el proyecto

**Mejora propuesta (sin borrar):**
Agregar tests críticos:

```typescript
// Nuevo archivo: src/App.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/Salento/i)).toBeInTheDocument()
  })

  it('tracks category filter changes', () => {
    render(<App />)
    const categoryButton = screen.getByText('Restaurantes')
    fireEvent.click(categoryButton)
    // Verificar que GA4 tracking fue llamado
  })

  it('handles search input', () => {
    render(<App />)
    const searchInput = screen.getByPlaceholderText(/buscar/i)
    fireEvent.change(searchInput, { target: { value: 'café' } })
    // Verificar resultados filtrados
  })
})
```

**Beneficio:**
- Confianza en cambios
- Prevención de regressions
- Crítico para WSA (calidad de código)
- No requiere borrar (archivos nuevos)

---

## 📋 PRIORIDAD DE IMPLEMENTACIÓN

### Fase 1: Mejoras Inmediatas (1-2 días)
- ✅ useCallback en handlers (performance)
- ✅ useMemo en filteredPlaces (performance)
- ✅ Schema.org dinámico por lugar (SEO WSA)
- ✅ Open Graph dinámico (SEO WSA)

### Fase 2: Mejoras de Organización (3-5 días)
- ✅ Custom hooks para estado (useAppState, useUIState)
- ✅ Separar lógica de WhatsApp a servicio
- ✅ Error Boundary wrapper

### Fase 3: Mejoras de Calidad (1 semana)
- ✅ Componentes separados (AppHeader, AppHero, etc.)
- ✅ ARIA labels mejorados
- ✅ Loading states consistentes
- ✅ Tests unitarios críticos

---

## 🎯 IMPACTO EN WSA

### Mejoras que Impactan Directamente WSA

1. **Schema.org dinámico** - Mejor SEO → más tráfico → métricas más altas
2. **Performance optimizaciones** - Mejor Lighthouse score → mejor percepción
3. **Error Boundary** - App más robusta → mejor UX → métricas más altas
4. **Tests** - Calidad de código demostrable → impresiona jurado

### Métricas WSA Mejoradas

**TECHNOLOGY (8.5/10 → 9.5/10):**
- Performance optimizado
- Error handling robusto
- Tests en lugar

**CONTENT (8/10 → 9/10):**
- Schema.org dinámico
- OG tags dinámicos
- Contenido más rico

**FUNCTIONALITY (9/10 → 9.5/10):**
- ARIA labels mejorados
- Loading states
- Error handling

---

## 💡 RECOMENDACIÓN FINAL

**Para WSA 2026 en tiempo récord (4 semanas):**

**Semana 1:** Fase 1 (Mejoras Inmediatas)
- useCallback y useMemo (2 horas)
- Schema.org dinámico (4 horas)
- Open Graph dinámico (2 horas)

**Semana 2-3:** Fase 2 + Fase 3 parcial
- Custom hooks (1 día)
- Separar lógica WhatsApp (4 horas)
- Error Boundary (2 horas)
- Componentes separados (2 días)

**Semana 4:** Testing + Documentación
- Tests críticos (2 días)
- Documentación de mejoras (1 día)

**Total estimado:** ~40 horas de desarrollo (1 semana full-time)

---

**Conclusión:** El código base es sólido y funcional. Las mejoras propuestas son incrementales, no destructivas, y pueden implementarse gradualmente sin riesgo. Priorizar Fase 1 para impacto inmediato en WSA.
