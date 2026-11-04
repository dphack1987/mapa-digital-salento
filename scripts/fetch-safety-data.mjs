#!/usr/bin/env node
/**
 * Descarga datos reales de seguridad y clima para Salento en tiempo de build.
 * Fuentes oficiales/gratuitas (sin API key):
 *  - USGS Earthquake Hazards Program (feed GeoJSON oficial, el mismo que usa OSIRIS)
 *  - Open-Meteo (pronóstico meteorológico, uso gratuito sin key)
 *
 * Salida: public/data/safety-data.json
 * Se ejecuta automaticamente con `npm run build` (hook prebuild).
 * Tambien manual: `npm run data:refresh`
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, '..', 'public', 'data', 'safety-data.json')

const SALENTO = { lat: 4.636, lng: -75.567, name: 'Salento, Quindío, Colombia' }
const QUAKE_RADIUS_KM = 300
const QUAKE_LIMIT = 20

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function fetchJson(url, label) {
  const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`)
  return res.json()
}

async function fetchEarthquakes() {
  // Feed oficial USGS: M2.5+ ultimos 7 dias + M4.5+ ultimos 30 dias
  const [day, week] = await Promise.all([
    fetchJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', 'USGS day'),
    fetchJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson', 'USGS week'),
  ])

  const seen = new Map()
  for (const feature of [...(day.features || []), ...(week.features || [])]) {
    const p = feature.properties || {}
    const c = feature.geometry?.coordinates || []
    const [lng, lat, depth] = c
    if (lat == null || lng == null) continue
    if (haversineKm(SALENTO.lat, SALENTO.lng, lat, lng) > QUAKE_RADIUS_KM) continue
    seen.set(feature.id, {
      id: feature.id,
      magnitude: p.mag ?? null,
      place: p.place || 'Región de Salento',
      time: p.time ? new Date(p.time).toISOString() : null,
      lat: Math.round(lat * 1000) / 1000,
      lng: Math.round(lng * 1000) / 1000,
      depth: depth != null ? Math.round(depth * 10) / 10 : null,
      url: p.url || null,
    })
  }

  return [...seen.values()]
    .filter(q => q.magnitude != null)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, QUAKE_LIMIT)
}

async function fetchWeather() {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(SALENTO.lat))
  url.searchParams.set('longitude', String(SALENTO.lng))
  url.searchParams.set('timezone', 'America/Bogota')
  url.searchParams.set('forecast_days', '7')
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m')
  url.searchParams.set('hourly', 'temperature_2m,precipitation_probability,weather_code')
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max')

  const data = await fetchJson(url.toString(), 'Open-Meteo')
  const current = data.current || {}
  const hourly = data.hourly || {}
  const daily = data.daily || {}

  // Próximas 48 horas
  const next48 = []
  const times = hourly.time || []
  const startIdx = times.findIndex(t => new Date(t) >= new Date(Date.now() - 3600_000))
  for (let i = Math.max(0, startIdx); i < times.length && next48.length < 48; i++) {
    next48.push({
      time: times[i],
      temp: hourly.temperature_2m?.[i] ?? null,
      precipProb: hourly.precipitation_probability?.[i] ?? null,
      weatherCode: hourly.weather_code?.[i] ?? null,
    })
  }

  const days = (daily.time || []).map((date, i) => ({
    date,
    weatherCode: daily.weather_code?.[i] ?? null,
    tempMax: daily.temperature_2m_max?.[i] ?? null,
    tempMin: daily.temperature_2m_min?.[i] ?? null,
    precipProbMax: daily.precipitation_probability_max?.[i] ?? null,
  }))

  return {
    current: {
      time: current.time || null,
      temperature: current.temperature_2m ?? null,
      feelsLike: current.apparent_temperature ?? null,
      humidity: current.relative_humidity_2m ?? null,
      precipitation: current.precipitation ?? null,
      weatherCode: current.weather_code ?? null,
      windSpeed: current.wind_speed_10m ?? null,
      windGusts: current.wind_gusts_10m ?? null,
    },
    hourly: next48,
    daily: days,
  }
}

async function main() {
  const [earthquakes, weather] = await Promise.all([
    fetchEarthquakes().catch(err => {
      console.warn(`USGS no disponible (${err.message}) - se guarda lista vacia`)
      return []
    }),
    fetchWeather().catch(err => {
      console.warn(`Open-Meteo no disponible (${err.message}) - se guarda null`)
      return null
    }),
  ])

  const payload = {
    generatedAt: new Date().toISOString(),
    location: SALENTO,
    earthquakes,
    weather,
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2))
  console.log(`safety-data.json generado: ${earthquakes.length} sismos, clima ${weather ? 'OK' : 'no disponible'} -> ${OUT_PATH}`)
}

main().catch(err => {
  console.error('fetch-safety-data falló:', err)
  process.exit(1)
})
