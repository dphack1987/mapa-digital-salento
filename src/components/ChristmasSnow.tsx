import { useEffect, useMemo, useState } from 'react'

type Snowflake = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
  blur: number
}

/**
 * Nieve con profundidad de campo (3 planos): lejos nítidos y lentos,
 * cerca grandes, desenfocados y rápidos — look cinematográfico, nunca tapa el contenido.
 */
const SNOW_COUNT = 18

const layerOf = (i: number): number => i % 3 // 0 lejos · 1 medio · 2 cerca (bokeh)

export default function ChristmasSnow() {
  // Page Visibility: pausa la animación cuando la pestaña está oculta (ahorro de CPU/GPU).
  const [pageVisible, setPageVisible] = useState(true)
  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const flakes = useMemo<Snowflake[]>(() => {
    return Array.from({ length: SNOW_COUNT }, (_, i) => {
      const layer = layerOf(i)
      if (layer === 0) {
        return {
          id: i, left: Math.random() * 100,
          size: 2 + Math.random() * 1.8,
          duration: 24 + Math.random() * 12,
          delay: -Math.random() * 30,
          opacity: 0.38 + Math.random() * 0.15,
          blur: 0,
        }
      }
      if (layer === 1) {
        return {
          id: i, left: Math.random() * 100,
          size: 4.5 + Math.random() * 2.5,
          duration: 16 + Math.random() * 8,
          delay: -Math.random() * 26,
          opacity: 0.55 + Math.random() * 0.18,
          blur: 0.6,
        }
      }
      return {
        id: i, left: Math.random() * 100,
        size: 9 + Math.random() * 7,
        duration: 9 + Math.random() * 6,
        delay: -Math.random() * 22,
        opacity: 0.28 + Math.random() * 0.16,
        blur: 3 + Math.random() * 2.5,
      }
    })
  }, [])

  return (
    <div className={`christmas-snow${pageVisible ? '' : ' christmas-snow--paused'}`} aria-hidden="true">
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="christmas-snowflake"
          style={{
            left: flake.left + '%',
            width: flake.size + 'px',
            height: flake.size + 'px',
            opacity: flake.opacity,
            filter: flake.blur > 0 ? `blur(${flake.blur}px)` : undefined,
            animationDuration: flake.duration + 's',
            animationDelay: flake.delay + 's',
          }}
        />
      ))}
    </div>
  )
}
