// Logger condicional que solo actúa en desarrollo
const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development'

export const logger = {
  log: isDevelopment ? console.log : () => {},
  error: console.error, // Siempre loguear errores
  warn: isDevelopment ? console.warn : () => {},
  info: isDevelopment ? console.info : () => {},
  debug: isDevelopment ? console.debug : () => {}
}

export default logger