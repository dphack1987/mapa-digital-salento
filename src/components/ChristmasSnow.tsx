import { useMemo } from 'react'

type Snowflake = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

/** Pocos copos, pequeños y lentos: nieve sutil, nunca tapa el contenido. */
const SNOW_COUNT = 10

/** Capa de nieve navideña (solo se renderiza en temporada, nov–ene). */
export default function ChristmasSnow() {
  const flakes = useMemo<Snowflake[]>(() => {
    return Array.from({ length: SNOW_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 2.5,
      duration: 18 + Math.random() * 12,
      delay: -Math.random() * 24,
      opacity: 0.35 + Math.random() * 0.25,
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
