import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import translationService from '../services/translationService'

const tr = (key: string, fallback?: string): string => translationService.translate(key, fallback)

export type GalleryPhoto = {
  src: string
  alt: string
}

type PhotoGalleryProps = {
  photos: GalleryPhoto[]
  label: string
}

export default function PhotoGallery({ photos, label }: PhotoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback(
    (delta: number) => {
      setOpenIndex((prev) => (prev === null ? prev : (prev + delta + photos.length) % photos.length))
    },
    [photos.length]
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [openIndex, close, step])

  if (photos.length === 0) return null

  return (
    <>
      <div className="pg-grid" role="list" aria-label={label}>
        {photos.map((photo, index) => (
          <button
            key={`${photo.src}-${index}`}
            type="button"
            role="listitem"
            className="pg-thumb"
            onClick={() => setOpenIndex(index)}
            aria-label={`${tr('gallery.expand', 'Ampliar foto')}: ${photo.alt}`}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <span className="pg-thumb-veil" aria-hidden>
              <Expand size={18} />
              <em>{photo.alt}</em>
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && photos[openIndex] && (
        <div className="pg-lightbox" role="dialog" aria-modal="true" aria-label={`${label} — ${openIndex + 1} / ${photos.length}`} onClick={close}>
          <button type="button" className="pg-close" onClick={close} aria-label={tr('gallery.close', 'Cerrar visor')}>
            <X size={20} />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="pg-nav pg-prev"
                onClick={(event) => {
                  event.stopPropagation()
                  step(-1)
                }}
                aria-label={tr('gallery.prev', 'Foto anterior')}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="pg-nav pg-next"
                onClick={(event) => {
                  event.stopPropagation()
                  step(1)
                }}
                aria-label={tr('gallery.next', 'Foto siguiente')}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <figure className="pg-figure" onClick={(event) => event.stopPropagation()}>
            <img src={photos[openIndex].src} alt={photos[openIndex].alt} />
            <figcaption>
              <span>{photos[openIndex].alt}</span>
              <strong>
                {openIndex + 1} / {photos.length}
              </strong>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
