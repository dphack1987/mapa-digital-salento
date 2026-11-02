import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Place } from '../../types'
import './ARCameraView.css'

interface ARCameraViewProps {
  places: Place[]
  userLocation: { lat: number; lng: number } | null
  onRequestLocation: () => void
  onClose: () => void
  onPlaceSelect?: (place: Place) => void
}

const FOV_DEG = 65
const HALF_FOV = FOV_DEG / 2
const MAX_RADIUS_M = 3000
const TAPE_RANGE = 75

const toRad = (d: number) => (d * Math.PI) / 180
const toDeg = (r: number) => (r * 180) / Math.PI

const norm180 = (deg: number) => (((deg + 180) % 360) + 360) % 360 - 180

const haversineM = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

const bearingDeg = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const p1 = toRad(lat1)
  const p2 = toRad(lat2)
  const dl = toRad(lng2 - lng1)
  const y = Math.sin(dl) * Math.cos(p2)
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

const formatDist = (m: number) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`)

const CARDINALS = [
  { label: 'N', deg: 0 },
  { label: 'NE', deg: 45 },
  { label: 'E', deg: 90 },
  { label: 'SE', deg: 135 },
  { label: 'S', deg: 180 },
  { label: 'SO', deg: 225 },
  { label: 'O', deg: 270 },
  { label: 'NO', deg: 315 }
]

const cardinalOf = (deg: number) =>
  CARDINALS[Math.round((((deg % 360) + 360) % 360) / 45) % 8].label

type CamState = 'starting' | 'on' | 'denied' | 'unsupported'
type CompassState = 'on' | 'needs-permission' | 'off'

function ARCameraView({ places, userLocation, onRequestLocation, onClose, onPlaceSelect }: ARCameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const headingRef = useRef<number | null>(null)
  const orientHandlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null)
  const orientTimerRef = useRef<number | null>(null)

  const [heading, setHeading] = useState<number | null>(null)
  const [camState, setCamState] = useState<CamState>('starting')
  const [compassState, setCompassState] = useState<CompassState>('off')
  const [orientGranted, setOrientGranted] = useState(false)
  const [selected, setSelected] = useState<Place | null>(null)
  const [speaking, setSpeaking] = useState(false)

  const iosNeedsPermission = useMemo(() => {
    const DOE = (window as any).DeviceOrientationEvent
    return !!DOE && typeof DOE.requestPermission === 'function'
  }, [])

  // ── Cámara ──────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamState('unsupported')
      return
    }
    setCamState('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        try { await videoRef.current.play() } catch { /* autoplay bloqueado */ }
      }
      setCamState('on')
    } catch {
      setCamState('denied')
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [startCamera])

  // ── Brújula ─────────────────────────────────────────────────────
  const startOrientation = useCallback(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      const anyE = e as DeviceOrientationEvent & { webkitCompassHeading?: number }
      let h: number | null = null
      if (typeof anyE.webkitCompassHeading === 'number') {
        h = anyE.webkitCompassHeading
      } else if (e.absolute && typeof e.alpha === 'number') {
        h = (360 - e.alpha) % 360
      }
      if (h == null) return
      headingRef.current = h
      setHeading((prev) => (prev == null ? h! : prev + norm180(h! - prev) * 0.2))
      setCompassState('on')
      if (orientTimerRef.current) {
        window.clearTimeout(orientTimerRef.current)
        orientTimerRef.current = null
      }
    }
    orientHandlerRef.current = onOrient
    window.addEventListener('deviceorientationabsolute', onOrient as EventListener, true)
    window.addEventListener('deviceorientation', onOrient as EventListener, true)
    if (orientTimerRef.current) window.clearTimeout(orientTimerRef.current)
    orientTimerRef.current = window.setTimeout(() => {
      if (headingRef.current == null) setCompassState('off')
    }, 3500)
  }, [])

  useEffect(() => {
    if (iosNeedsPermission && !orientGranted) {
      setCompassState('needs-permission')
      return
    }
    startOrientation()
    return () => {
      const h = orientHandlerRef.current
      if (h) {
        window.removeEventListener('deviceorientationabsolute', h as EventListener, true)
        window.removeEventListener('deviceorientation', h as EventListener, true)
      }
      if (orientTimerRef.current) {
        window.clearTimeout(orientTimerRef.current)
        orientTimerRef.current = null
      }
    }
  }, [iosNeedsPermission, orientGranted, startOrientation])

  const enableCompass = async () => {
    try {
      const DOE = (window as any).DeviceOrientationEvent
      const res = await DOE.requestPermission()
      if (res === 'granted') setOrientGranted(true)
      else setCompassState('off')
    } catch {
      setCompassState('off')
    }
  }

  // ── Scroll bloqueado + TTS cleanup ──────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  const speak = (place: Place) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const info = `${place.name}. ${place.description} Ubicado en ${place.location?.address || 'Salento'}.`
    const u = new SpeechSynthesisUtterance(info)
    u.lang = 'es-ES'
    u.rate = 0.9
    setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }

  const select = (place: Place) => {
    setSelected(place)
    speak(place)
  }

  // ── Cálculo de lugares ──────────────────────────────────────────
  const tracked = useMemo(() => {
    if (!userLocation) return []
    return places
      .filter((p) => p.verified && p.active && p.location?.lat && p.location?.lng)
      .map((p) => {
        const dist = haversineM(userLocation.lat, userLocation.lng, p.location!.lat, p.location!.lng)
        const brg = bearingDeg(userLocation.lat, userLocation.lng, p.location!.lat, p.location!.lng)
        const delta = heading == null ? null : norm180(brg - heading)
        return { place: p, dist, delta }
      })
      .filter((t) => t.dist <= MAX_RADIUS_M)
      .sort((a, b) => a.dist - b.dist)
  }, [places, userLocation, heading])

  const visible = tracked.filter((t) => t.delta != null && Math.abs(t.delta) <= HALF_FOV)
  const edges = tracked.filter((t) => t.delta != null && Math.abs(t.delta) > HALF_FOV && Math.abs(t.delta) <= 130)

  return (
    <div className="arv-overlay" role="dialog" aria-label="Salento AR — realidad aumentada">
      <video ref={videoRef} className={`arv-video${camState === 'on' ? '' : 'arv-video--off'}`} autoPlay playsInline muted />
      {camState !== 'on' && <div className="arv-fallback" />}

      <header className="arv-top">
        <button className="arv-close" onClick={onClose} aria-label="Cerrar AR">✕</button>
        <div className="arv-title">
          <strong>Salento AR</strong>
          <span>{heading != null ? `rumbo ${Math.round(heading)}° ${cardinalOf(heading)}` : 'buscando brújula…'}</span>
        </div>
        <span className={`arv-live arv-live--${camState}`}>
          {camState === 'on' ? '● EN VIVO' : camState === 'starting' ? '…' : 'sin cámara'}
        </span>
      </header>

      {heading != null && (
        <div className="arv-tape" aria-hidden="true">
          <div className="arv-tape-pointer" />
          {CARDINALS.map((c) => {
            const d = norm180(c.deg - heading)
            if (Math.abs(d) > TAPE_RANGE) return null
            return (
              <span
                key={c.label}
                className={`arv-tape-label${c.deg % 90 === 0 ? ' arv-tape-label--major' : ''}`}
                style={{ left: `${50 + (d / TAPE_RANGE) * 50}%` }}
              >
                {c.label}
              </span>
            )
          })}
        </div>
      )}

      <div className="arv-stage">
        {visible.map(({ place, dist, delta }) => (
          <button
            key={place.id}
            className="arv-poi"
            style={{
              left: `${50 + ((delta as number) / HALF_FOV) * 50}%`,
              top: `${60 - Math.min(dist / MAX_RADIUS_M, 1) * 20}%`
            }}
            onClick={() => select(place)}
          >
            <span className="arv-poi-pin" aria-hidden="true">📍</span>
            <span className="arv-poi-card">
              <strong>{place.name}</strong>
              <small>⭐ {place.rating} · {formatDist(dist)}</small>
            </span>
          </button>
        ))}
        {edges.map(({ place, dist, delta }) => (
          <button
            key={`edge-${place.id}`}
            className={`arv-edge${(delta as number) > 0 ? ' arv-edge--right' : ''}`}
            onClick={() => select(place)}
          >
            {(delta as number) > 0 ? '▶' : '◀'} {place.name} · {formatDist(dist)}
          </button>
        ))}
      </div>

      {compassState === 'needs-permission' && (
        <div className="arv-toast">
          <button onClick={enableCompass}>🧭 Activar brújula</button>
          <p>iOS pedirá permiso de movimiento</p>
        </div>
      )}

      {!userLocation && (
        <div className="arv-toast">
          <button onClick={onRequestLocation}>📍 Usar mi ubicación</button>
          <p>Necesitamos tu posición para orientar los lugares</p>
        </div>
      )}

      {camState === 'denied' && (
        <div className="arv-toast arv-toast--warn">
          <p>Cámara bloqueada — modo brújula activo</p>
          <button onClick={startCamera}>Reintentar cámara</button>
        </div>
      )}

      {camState === 'unsupported' && (
        <div className="arv-toast arv-toast--warn">
          <p>Este navegador no permite la cámara — modo brújula</p>
        </div>
      )}

      {!selected && userLocation && tracked.length > 0 && (
        <nav className="arv-chips" aria-label="Lugares cercanos">
          {tracked.slice(0, 6).map(({ place, dist }) => (
            <button key={place.id} onClick={() => select(place)}>
              {place.name} · {formatDist(dist)}
            </button>
          ))}
        </nav>
      )}

      {userLocation && tracked.length === 0 && (
        <p className="arv-empty">No hay lugares verificados a menos de 3 km de ti</p>
      )}

      <p className="arv-hint">Apunta el celular · toca una tarjeta para escuchar a Don Chucho</p>

      {selected && (
        <div className="arv-sheet">
          <button
            className="arv-sheet-close"
            aria-label="Cerrar ficha"
            onClick={() => {
              setSelected(null)
              if ('speechSynthesis' in window) window.speechSynthesis.cancel()
              setSpeaking(false)
            }}
          >
            ✕
          </button>
          <h3>{selected.name}</h3>
          <div className="arv-sheet-meta">
            ⭐ {selected.rating}
            {speaking && <span className="arv-speaking"> 🔊 Don Chucho hablando…</span>}
          </div>
          <p>{selected.description}</p>
          <div className="arv-sheet-actions">
            <button onClick={() => speak(selected)}>🔊 Escuchar</button>
            {selected.contact?.whatsapp && (
              <a href={`https://wa.me/${selected.contact.whatsapp}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            )}
            {onPlaceSelect && (
              <button
                className="arv-sheet-primary"
                onClick={() => {
                  onPlaceSelect(selected)
                  onClose()
                }}
              >
                Ver ficha
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ARCameraView
