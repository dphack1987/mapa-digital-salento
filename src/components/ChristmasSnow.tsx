import { useMemo } from 'react'

type Snowflake = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

/** Pocos copos, pequeños y lentos: nieve elegante, nunca tapa el contenido. */
const SNOW_COUNT = 16

/** Capa de nieve navideña (solo se renderiza en temporada, nov–ene). */
export default function ChristmasSnow() {
  const flakes = useMemo<Snowflake[]>(() => {
    return Array.from({ length: SNOW_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3.5 + Math.random() * 4.5,
      duration: 16 + Math.random() * 12,
      delay: -Math.random() * 24,
      opacity: 0.55 + Math.random() * 0.3,
    }))
  }, [])

  return (
    <div className="christmas-snow" aria-hidden="true">
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="christmas-snowflake"
          style={{
            left: flake.left + '%',
            width: flake.size + 'px',
            height: flake.size + 'px',
            opacity: flake.opacity,
            animationDuration: flake.duration + 's',
            animationDelay: flake.delay + 's',
          }}
        />
      ))}
    </div>
  )
}
