import type { Language } from '../types'
import { donChuchoKnowledge, type KnowledgeItem } from './donChuchoKnowledge'
import {
  detectKnowledgeIntent,
  detectSmallTalk,
  fallbackReply,
  localizedSuggestions,
  normalizeText,
  smallTalkReply
} from './donChuchoNlu'

export interface DonChuchoContext {
  lastItem?: KnowledgeItem | null
  lastQuery?: string
}

export interface DonChuchoReply {
  text: string
  suggestions: string[]
  relatedPlaceIds: number[]
  category: string | null
  intent: string
  confident: boolean
  source: 'smalltalk' | 'knowledge' | 'context' | 'fallback'
  item: KnowledgeItem | null
}

const FOLLOW_UP_WORDS = new Set([
  'precio', 'precios', 'cuanto', 'cuesta', 'cuestan', 'tarifa', 'valor',
  'horario', 'horarios', 'hora', 'horas', 'abre', 'abren', 'cierra', 'cierran',
  'donde', 'queda', 'ubicado', 'ubicada', 'direccion', 'contacto', 'whatsapp',
  'telefono', 'reservar', 'reserva', 'reservo', 'incluye', 'duracion',
  'detalle', 'detalles', 'info', 'informacion', 'mas', 'price', 'cost',
  'how', 'much', 'schedule', 'open', 'close', 'where', 'address', 'contact', 'book',
  'duration', 'details', 'preis', 'kostet', 'wann', 'offen', 'adresse',
  'prix', 'coute', 'horaire', 'ouvert', 'adresse', 'preco', 'custa',
  'horario', 'aberto', 'endereco', 'prezzo', 'costa', 'orario', 'aperto',
  'indirizzo'
])

const QUERY_STOPWORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
  'que', 'y', 'o', 'en', 'por', 'para', 'con', 'sin', 'mi', 'me', 'te', 'se',
  'su', 'sus', 'es', 'esta', 'estan', 'son', 'hay', 'como', 'cuanto', 'cuanta',
  'cuantos', 'cuantas', 'the', 'a', 'an', 'of', 'to', 'in', 'on', 'at', 'is',
  'are', 'do', 'does', 'i', 'my', 'we', 'you', 'it', 'for', 'with', 'what',
  'where', 'how', 'much', 'can', 'want', 'would', 'like', 'please', 'por',
  'favor'
])

function pickAnswer(item: KnowledgeItem, language: Language): string {
  return item.answer[language] || item.answer.en || item.answer.es
}

function isContextFollowUp(query: string): boolean {
  const norm = normalizeText(query)
  if (!norm) return false
  const tokens = norm.split(' ')
  if (tokens.length <= 2) return true
  return tokens.length <= 5 && tokens.some(token => FOLLOW_UP_WORDS.has(token))
}

function isStrongContextFollowUp(query: string): boolean {
  const norm = normalizeText(query)
  if (!norm) return false
  const contentTokens = norm.split(' ').filter(token => !QUERY_STOPWORDS.has(token))
  if (contentTokens.length === 0 || contentTokens.length > 3) return false
  return contentTokens.every(token => FOLLOW_UP_WORDS.has(token))
}

function extractContextualAnswer(item: KnowledgeItem, query: string, language: Language): string {
  const answer = pickAnswer(item, language)
  const norm = normalizeText(query)
  const sentences = answer
    .split(/(?<=[.!?])\s+|\n+/)
    .map(sentence => sentence.trim())
    .filter(Boolean)

  const pick = (patterns: RegExp[]): string[] =>
    sentences.filter(sentence => patterns.some(pattern => pattern.test(sentence)))

  let selected: string[] = []

  if (/(precio|cuanto|cuesta|cuestan|tarifa|valor|cost|price|preis|prix|preco|prezzo)/.test(norm)) {
    selected = pick([/\$|cop|precio|tarifa|entrada|cuesta|cost|price|preis|prix|preco|prezzo/i])
  } else if (/(horario|hora|abre|cierra|open|schedule|offen|horaire|ouvert|orario|aperto)/.test(norm)) {
    selected = pick([/horario|abre|cierra|am|pm|hora|open|close|schedule|offen|horaire|ouvert|orario|aperto/i])
  } else if (/(donde|queda|ubicad|direccion|where|address|wo|adresse|onde|endereco|dove|indirizzo)/.test(norm)) {
    selected = pick([/queda|ubicad|direccion|km|calle|vereda|centro|address|located|adresse|endereco|indirizzo/i])
  } else if (/(contacto|whatsapp|telefono|reservar|reserva|book|contact)/.test(norm)) {
    selected = pick([/whatsapp|telefono|reserva|contacto|book|contact|reserv/i])
  } else if (/(duracion|cuanto dura|how long|duration|duree|duracao|durata)/.test(norm)) {
    selected = pick([/min|hora|dura|duration|hours|duree|duracao|durata/i])
  }

  if (selected.length === 0) selected = sentences.slice(0, 2)
  return selected.slice(0, 2).join(' ').trim()
}

export function answerDonChucho(
  query: string,
  language: Language,
  context: DonChuchoContext = {}
): DonChuchoReply {
  const cleaned = query.trim()
  if (!cleaned) {
    return {
      text: fallbackReply(language),
      suggestions: localizedSuggestions('general', language),
      relatedPlaceIds: [],
      category: 'general',
      intent: 'fallback',
      confident: false,
      source: 'fallback',
      item: null
    }
  }

  const smallTalk = detectSmallTalk(cleaned)
  if (smallTalk) {
    return {
      text: smallTalkReply(smallTalk, language),
      suggestions: localizedSuggestions('general', language),
      relatedPlaceIds: [],
      category: 'general',
      intent: smallTalk,
      confident: true,
      source: 'smalltalk',
      item: null
    }
  }

  const contextReply = (item: KnowledgeItem): DonChuchoReply => ({
    text: extractContextualAnswer(item, cleaned, language),
    suggestions: donChuchoKnowledge.getFollowUpSuggestions(item.keywords[0], language),
    relatedPlaceIds: item.relatedPlaces || [],
    category: item.category,
    intent: 'followup',
    confident: true,
    source: 'context',
    item
  })

  if (context.lastItem && isStrongContextFollowUp(cleaned)) {
    return contextReply(context.lastItem)
  }

  const results = donChuchoKnowledge.searchWithScore(cleaned, language)
  const top = results[0]
  const second = results[1]
  const margin = top && second ? top.score - second.score : Number.POSITIVE_INFINITY
  const sameCategory = top && second ? top.item.category === second.item.category : false
  const confident = Boolean(top) && top.score >= 8 && (margin >= 2 || sameCategory || top.score >= 30)

  if (confident && top) {
    const item = top.item
    return {
      text: pickAnswer(item, language),
      suggestions: donChuchoKnowledge.getFollowUpSuggestions(cleaned, language),
      relatedPlaceIds: item.relatedPlaces || [],
      category: item.category,
      intent: detectKnowledgeIntent(cleaned) || item.category,
      confident: true,
      source: 'knowledge',
      item
    }
  }

  if (context.lastItem && isContextFollowUp(cleaned)) {
    return contextReply(context.lastItem)
  }

  if (top && top.score >= 6) {
    const item = top.item
    return {
      text: pickAnswer(item, language),
      suggestions: donChuchoKnowledge.getFollowUpSuggestions(cleaned, language),
      relatedPlaceIds: item.relatedPlaces || [],
      category: item.category,
      intent: detectKnowledgeIntent(cleaned) || item.category,
      confident: false,
      source: 'knowledge',
      item
    }
  }

  return {
    text: fallbackReply(language),
    suggestions: localizedSuggestions('general', language),
    relatedPlaceIds: [],
    category: 'general',
    intent: 'fallback',
    confident: false,
    source: 'fallback',
    item: null
  }
}
