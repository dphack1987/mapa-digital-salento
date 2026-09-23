export type PlaceCtaKind = 'menu' | 'reserve' | 'info'

/** Etiqueta de CTA según tipo de lugar (sin borrar lógica previa). */
export function placeCtaKind(type: string | undefined): PlaceCtaKind {
  const value = String(type || '')
  if (/restaurant|gastrono|restaurante|caf[eé]s?\b|café/i.test(value)) return 'menu'
  if (/alojamiento|hotel|camping|hospedaje|hostal|hostel|finca hotel/i.test(value)) return 'reserve'
  return 'info'
}

export function placeCtaLabel(type: string | undefined): string {
  const kind = placeCtaKind(type)
  if (kind === 'menu') return 'Ver menú'
  if (kind === 'reserve') return 'Reservar ya'
  return 'Ver información'
}

/** Compatible con marcadores del mapa (Gastronómico, Comercial, Turístico). */
export function markerCtaLabel(type: string | undefined): string {
  const value = String(type || '')
  if (/restaurant|gastrono|restaurante/i.test(value)) return 'Ver menú'
  if (/alojamiento|hotel|camping|hospedaje/i.test(value)) return 'Reservar ya'
  return 'Ver información'
}
