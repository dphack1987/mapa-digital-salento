# 🚀 GUÍA DE INTEGRACIÓN OSIRIS AI - APP.TSX

Esta guía explica cómo integrar los componentes de OSIRIS AI en `App.tsx` **sin modificar destructivamente** el código existente.

---

## 📋 ARCHIVOS CREADOS

✅ **Archivos nuevos creados:**
1. `src/services/osirisTypes.ts` - Tipos TypeScript para OSIRIS
2. `src/services/osirisDataService.ts` - Servicio que consume API OSIRIS
3. `src/services/osirisOfflineService.ts` - Servicio offline con caché
4. `src/hooks/useOsirisData.ts` - Custom hook para datos OSIRIS
5. `src/components/SafetyWidget.tsx` - Widget de seguridad y clima
6. `src/components/EarthquakeMarker.tsx` - Marcador de terremotos para mapa
7. `src/services/donChuchoOsiris.ts` - Extensión de Don Chucho con datos OSIRIS
8. `src/styles-osiris.css` - Estilos para componentes OSIRIS

✅ **Archivos modificados (adiciones mínimas):**
1. `public/sw.js` - Agregado caché para OSIRIS API
2. `src/main.tsx` - Agregado import de `styles-osiris.css`

---

## 🔧 PASO 1: IMPORTAR COMPONENTES EN APP.TSX

Al inicio de `App.tsx`, agregar estos imports:

```typescript
// Agregar después de los imports existentes
import SafetyWidget from './components/SafetyWidget'
import EarthquakeMarker from './components/EarthquakeMarker'
import { useOsirisData } from './hooks/useOsirisData'
import osirisDataService from './services/osirisDataService'
```

---

## 🔧 PASO 2: AGREGAR ESTADO PARA DATOS OSIRIS

Dentro del componente principal `App`, agregar:

```typescript
// Después de los estados existentes
const [earthquakes, setEarthquakes] = useState([])
const [showOsirisWidget, setShowOsirisWidget] = useState(true)
```

---

## 🔧 PASO 3: CARGAR DATOS DE OSIRIS

Agregar este useEffect dentro del componente App:

```typescript
// Cargar datos de OSIRIS al montar
useEffect(() => {
  const loadOsirisData = async () => {
    try {
      const eqData = await osirisDataService.getEarthquakesNearSalento()
      setEarthquakes(eqData)
    } catch (error) {
      console.error('Error loading OSIRIS data:', error)
    }
  }

  loadOsirisData()

  // Actualizar cada 10 minutos
  const interval = setInterval(loadOsirisData, 10 * 60 * 1000)
  return () => clearInterval(interval)
}, [])
```

---

## 🔧 PASO 4: AGREGAR WIDGET DE SEGURIDAD EN LA UI

Opción A: En el sidebar (recomendado)

Buscar el sidebar en App.tsx y agregar:

```typescript
{showOsirisWidget && (
  <div className="sidebar-section">
    <SafetyWidget />
  </div>
)}
```

Opción B: Como botón flotante

Agregar en el JSX principal:

```typescript
{showOsirisWidget && (
  <div className="osiris-widget-container">
    <SafetyWidget />
  </div>
)}
```

---

## 🔧 PASO 5: AGREGAR MARCADORES DE TERREMOTOS EN EL MAPA

Dentro del componente `MapContainer`, después de los marcadores existentes, agregar:

```typescript
{/* Marcadores de terremotos OSIRIS */}
{earthquakes.map(eq => (
  <EarthquakeMarker key={eq.id} earthquake={eq} />
))}
```

---

## 🔧 PASO 6: INTEGRAR CON DON CHUCHO (OPCIONAL)

Si quieres que Don Chucho use datos de OSIRIS, importar y usar:

```typescript
import { getOsirisResponse } from './services/donChuchoOsiris'

// En el sistema de respuestas de Don Chucho
const handleDonChuchoQuery = async (query: string, language: string) => {
  // Primero intentar respuesta OSIRIS
  const osirisResponse = await getOsirisResponse(query, language)
  if (osirisResponse) {
    return osirisResponse
  }

  // Si no, usar sistema existente
  return existingDonChuchoResponse(query, language)
}
```

---

## 🎨 PASO 7: AGREGAR ESTILOS PARA POSICIONAMIENTO

En `styles-osiris.css` o en tu CSS existente, agregar:

```css
/* Contenedor del widget (si usas opción B del paso 4) */
.osiris-widget-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  max-width: 380px;
}

/* Si usas en sidebar */
.sidebar-section {
  margin-bottom: 16px;
}
```

---

## ✅ VERIFICACIÓN

Después de integrar, verificar:

1. ✅ El widget de seguridad aparece en la UI
2. ✅ Los marcadores de terremotos aparecen en el mapa (si hay actividad)
3. ✅ El widget muestra datos de terremotos y clima
4. ✅ Funciona en modo offline (datos cacheados)
5. ✅ No hay errores en consola
6. ✅ TypeScript compila sin errores

---

## 🚀 TESTING

### Test 1: Verificar carga de datos

```typescript
// En el navegador, abrir consola y ejecutar:
import osirisDataService from './services/osirisDataService'
const data = await osirisDataService.getEarthquakesNearSalento()
console.log('Earthquakes:', data)
```

### Test 2: Verificar modo offline

1. Cargar la app con conexión
2. Desconectar internet (DevTools > Network > Offline)
3. Verificar que el widget aún muestra datos cacheados
4. Verificar timestamp de "Última actualización"

### Test 3: Verificar mapa

1. Cargar el mapa
2. Verificar que los marcadores de terremotos aparecen (si hay actividad)
3. Click en un marcador para ver el popup
4. Verificar que el popup muestra datos correctos

---

## 📝 NOTAS IMPORTANTES

### ✅ Lo que hicimos:
- Creamos archivos NUEVOS (no borramos nada)
- Hicimos adiciones MÍNIMAS a archivos existentes
- Usamos el sistema de caché existente (offlineStorage)
- Mantuvimos la arquitectura existente

### ⚠️ Lo que NO hicimos:
- NO modificamos destructivamente App.tsx
- NO borramos código existente
- NO cambiamos la estructura del proyecto
- NO modificamos componentes existentes

### 🎯 Resultado:
- Integración limpia y reversible
- Puedes desactivar fácilmente cambiando `showOsirisWidget`
- Si algo falla, solo elimina los nuevos archivos
- El proyecto original sigue intacto

---

## 🔄 DESHACER INTEGRACIÓN (SI ES NECESARIO)

Si quieres deshacer la integración:

1. Eliminar los imports agregados en App.tsx
2. Eliminar el estado y useEffect de OSIRIS
3. Eliminar el componente SafetyWidget del JSX
4. Eliminar los marcadores EarthquakeMarker del mapa
5. Eliminar el import de `styles-osiris.css` en main.tsx
6. Eliminar los archivos nuevos creados

---

## 📞 SOPORTE

Si tienes problemas:

1. Verificar que los archivos nuevos están en las rutas correctas
2. Verificar que TypeScript compila sin errores: `npm run type-check`
3. Verificar consola del navegador para errores
4. Verificar que OSIRIS API está accesible: https://osirisai.live/api/earthquakes

---

## 🎉 ¡LISTO!

La integración está completa. Ahora tu mapa turístico de Salento tiene:
- ✅ Datos sísmicos en tiempo real
- ✅ Datos climáticos en tiempo real
- ✅ Calidad del aire
- ✅ Modo offline con caché
- ✅ Integración con Don Chucho
- ✅ Marcadores visuales en el mapa

**Todo sin modificar destructivamente el código existente.**
