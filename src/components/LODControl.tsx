// LOD (Level of Detail) Adaptativo
// Permite al usuario ajustar el nivel de detalle de la información

import React, { useState, useEffect } from 'react'
import { Minus, Plus, AlignJustify } from 'lucide-react'

export type DetailLevel = 'quick' | 'normal' | 'detailed'

interface LODControlProps {
  level: DetailLevel
  onChange: (level: DetailLevel) => void
  language?: string
}

const STORAGE_KEY = 'salento_detail_level'

const labels: Record<string, Record<DetailLevel, string>> = {
  es: { quick: 'Rápido', normal: 'Normal', detailed: 'Detallado' },
  en: { quick: 'Quick', normal: 'Normal', detailed: 'Detailed' },
  fr: { quick: 'Rapide', normal: 'Normal', detailed: 'Détaillé' },
  de: { quick: 'Schnell', normal: 'Normal', detailed: 'Detailliert' },
  pt: { quick: 'Rápido', normal: 'Normal', detailed: 'Detalhado' },
  it: { quick: 'Veloce', normal: 'Normale', detailed: 'Dettagliato' }
}

export function LODControl({ level, onChange, language = 'es' }: LODControlProps) {
  const options: DetailLevel[] = ['quick', 'normal', 'detailed']
  
  return (
    <div className="lod-control">
      <span className="lod-label">{labels[language]?.[level] || labels.es[level]}</span>
      <div className="lod-buttons">
        {options.map(opt => (
          <button
            key={opt}
            className={`lod-btn ${level === opt ? 'lod-btn-active' : ''}`}
            onClick={() => onChange(opt)}
            title={labels[language]?.[opt] || opt}
          >
            {opt === 'quick' && <Minus size={12} />}
            {opt === 'normal' && <AlignJustify size={12} />}
            {opt === 'detailed' && <Plus size={12} />}
          </button>
        ))}
      </div>
    </div>
  )
}

// Hook para manejar nivel de detalle
export function useDetailLevel(): [DetailLevel, (level: DetailLevel) => void] {
  const [level, setLevel] = useState<DetailLevel>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return (stored as DetailLevel) || 'normal'
    } catch {
      return 'normal'
    }
  })

  const updateLevel = (newLevel: DetailLevel) => {
    setLevel(newLevel)
    localStorage.setItem(STORAGE_KEY, newLevel)
  }

  return [level, updateLevel]
}

// Función para truncar texto según nivel de detalle
export function adaptDetail(text: string, level: DetailLevel, maxLength?: number): string {
  if (level === 'quick') {
    // Primera oración o máx 80 caracteres
    const firstSentence = text.split(/[.!?]+/)[0]
    const max = maxLength || 80
    return firstSentence.length > max ? firstSentence.substring(0, max) + '...' : firstSentence
  }
  
  if (level === 'detailed') {
    return text // Texto completo
  }
  
  // Normal: texto completo pero truncado si es muy largo
  const maxNormal = maxLength || 200
  if (text.length > maxNormal) {
    return text.substring(0, maxNormal) + '...'
  }
  return text
}

// Componente de respuesta adaptativa
export function AdaptiveResponse({
  text,
  detailLevel,
  language,
  onExpand
}: {
  text: string
  detailLevel: DetailLevel
  language?: string
  onExpand?: () => void
}) {
  const adaptedText = adaptDetail(text, detailLevel)
  const isTruncated = adaptedText !== text
  
  return (
    <div className="adaptive-response">
      <p className="adaptive-text">{adaptedText}</p>
      {isTruncated && onExpand && (
        <button className="adaptive-expand" onClick={onExpand}>
          {language === 'es' ? 'Ver más' : 'Read more'}
        </button>
      )}
    </div>
  )
}
