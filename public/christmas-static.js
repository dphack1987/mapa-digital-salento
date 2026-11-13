/*
 * Navidad del Eje Cafetero — páginas estáticas (nov–ene).
 * Sincrónico en <head>: setea data-season ANTES del primer paint (sin FOUC)
 * e inyecta la alert bar editorial al cargar el body.
 */
(function () {
  try {
    var month = new Date().getMonth() // 10=nov, 11=dic, 0=ene
    if (month !== 10 && month !== 11 && month !== 0) return

    document.documentElement.setAttribute('data-season', 'christmas')

    function injectAlert() {
      if (!document.body || document.querySelector('.christmas-alert')) return
      var bar = document.createElement('div')
      bar.className = 'christmas-alert'
      bar.setAttribute('role', 'status')
      var link = document.createElement('a')
      link.href = '/agenda-eventos-salento.html'
      link.appendChild(document.createTextNode('🎄 Navidad en Salento: horarios especiales, menús navideños y ferias'))
      var cta = document.createElement('span')
      cta.className = 'christmas-alert-cta'
      cta.textContent = 'Ver agenda →'
      link.appendChild(cta)
      bar.appendChild(link)
      document.body.insertBefore(bar, document.body.firstChild)
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectAlert)
    } else {
      injectAlert()
    }
  } catch (e) { /* sin romper la página */ }
})()
