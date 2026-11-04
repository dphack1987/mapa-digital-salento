#!/usr/bin/env node
/**
 * Descarga datos reales de clima para Salento en tiempo de build.
 * Fuente oficial gratuita (sin API key):
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

async function fetchJson(url, label) {
  const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`)
  return res.json()
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
  const weather = await fetchWeather().catch(err => {
    console.warn(`Open-Meteo no disponible (${err.message}) - se guarda null`)
    return null
  })

  const payload = {
    generatedAt: new Date().toISOString(),
    location: SALENTO,
    weather,
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2))
  console.log(`safety-data.json generado: clima ${weather ? 'OK' : 'no disponible'} -> ${OUT_PATH}`)
}

main().catch(err => {
  console.error('fetch-safety-data falló:', err)
  process.exit(1)
})
