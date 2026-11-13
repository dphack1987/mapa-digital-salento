import { useMemo } from 'react'

type Snowflake = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

const SNOW_COUNT = 16

/** Capa de nieve navideña (solo se renderiza en temporada). */
export default function ChristmasSnow() {
  const flakes = useMemo<Snowflake[]>(() => {
    return Array.from({ length: SNOW_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 5,
      duration: 8 + Math.random() * 9,
      delay: -Math.random() * 14,
      opacity: 0.35 + Math.random() * 0.5,
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
