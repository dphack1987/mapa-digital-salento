import type { CSSProperties } from 'react'

type ChristmasHatProps = {
  className?: string
  style?: CSSProperties
}

/** Sombrero navideño SVG que se superpone al logo de Salento a la Mano. */
export default function ChristmasHat({ className, style }: ChristmasHatProps) {
  const hatClass = 'christmas-hat ' + (className || '')
  return (
    <svg
      className={hatClass.trim()}
      style={style}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      data-testid="christmas-hat"
    >
      <circle cx="60" cy="15" r="11" fill="#ffffff" />
      <path d="M60 27 L20 97 L100 97 Z" fill="#d64533" />
      <rect x="4" y="86" width="112" height="14" rx="7" fill="#ffffff" />
      <rect x="4" y="86" width="112" height="5" rx="2.5" fill="#e8bb58" opacity="0.9" />
    </svg>
  )
}
