/* Salento a la Mano — Analítica de páginas pautantes
 * Capa de medición del embudo comercial:
 *   page_view → menu_item_view → item_added → checkout_start → whatsapp_click
 * Envía eventos a GA4 (G-1Z70BRW660, misma propiedad que la app) y,
 * si el backend está disponible, los registra vía beacon en
 * POST /api/v1/analytics/event para alimentar dashboards de comercios.
 * Todo es tolerante a fallos: nunca bloquea la UX. */
(function () {
  'use strict';

  var GA_ID = window.__PAUTANTE_GA_ID || 'G-1Z70BRW660';
  var BACKEND = window.__PAUTANTE_API || ''; // ej. 'https://api.salentoalamano.com'
  var SLUG = (location.pathname.match(/\/paginas-pautantes\/([^/]+)/) || [])[1] || '';
  var BUSINESS = SLUG ? SLUG.replace(/-/g, ' ') : document.title;

  // --- dataLayer / gtag (mismo patrón que index.html) ---
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true });

  if (!document.querySelector('script[data-pa-gtag]')) {
    var s = document.createElement('script');
    s.async = true;
    s.dataset.paGtag = '1';
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // --- Utilidades ---
  function baseParams() {
    return {
      business_slug: SLUG || undefined,
      business_name: BUSINESS,
      page_path: location.pathname,
      page_lang: (navigator.language || 'es').split('-')[0],
      currency_pref: getCurrency() || undefined
    };
  }

  function getCurrency() {
    try {
      var btn = document.querySelector('.currency-switch button.active');
      return btn ? btn.dataset.cur : null;
    } catch (e) { return null; }
  }

  var queue = [];
  var flushed = false;

  function flush() {
    if (flushed) return;
    flushed = true;
    queue.forEach(function (ev) { send(ev.name, ev.params); });
    queue = [];
  }
  // gtag procesa dataLayer aunque el script aún no cargue; no hace falta esperar.
  setTimeout(flush, 0);

  function send(name, params) {
    var p = Object.assign(baseParams(), params || {});
    try { gtag('event', name, p); } catch (e) {}

    var payload = JSON.stringify({ event: name, params: p, ts: Date.now() });
    if (BACKEND) try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(BACKEND + '/api/v1/analytics/event', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch(BACKEND + '/api/v1/analytics/event', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: payload, keepalive: true, credentials: 'omit'
        }).catch(function () {});
      }
    } catch (e) {}

    // Resumen local (solo este navegador; útil para demos y depuración)
    try {
      var key = 'pa_events_' + (SLUG || 'home');
      var all = JSON.parse(localStorage.getItem(key) || '[]');
      all.push({ e: name, p: p, t: Date.now() });
      localStorage.setItem(key, JSON.stringify(all.slice(-200)));
    } catch (e) {}
  }

  window.PautanteAnalytics = {
    track: function (name, params) { queue.push({ name: name, params: params }); },
    flush: flush,
    slug: SLUG
  };

  // --- Evento inicial: vista de ficha comercial ---
  queue.push({
    name: 'pautante_page_view',
    params: { page_title: document.title, referrer_path: document.referrer || undefined }
  });

  // --- Clics en WhatsApp (cta de reserva/pedido, flotante, menús) ---
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
    if (!a) return;
    var text = (a.textContent || '').trim().slice(0, 60);
    var isFloat = a.classList.contains('wa-float') || !!a.closest('.wa-float');
    queue.push({
      name: isFloat ? 'whatsapp_float_click' : 'whatsapp_click',
      params: { cta_text: text || undefined, cta_href: (a.getAttribute('href') || '').slice(0, 120) }
    });
  }, true);

  // --- Eventos emitidos por pautante-common.js (menú/carrito) ---
  window.addEventListener('pautante:event', function (e) {
    var d = e.detail || {};
    queue.push({ name: d.type, params: d.params || {} });
  });

  // Vista de tarjeta de menú cuando entra al viewport (una vez por sesión)
  var seenCards = {};
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var card = en.target.closest('.menu-card');
        if (!card || en.intersectionRatio < 0.5) return;
        var title = (card.querySelector('h3') || {}).textContent || '';
        var key = SLUG + '|' + title;
        if (seenCards[key]) return;
        seenCards[key] = true;
        queue.push({ name: 'menu_item_view', params: { item_name: title.trim().slice(0, 80) } });
        io.unobserve(card);
      });
    }, { threshold: 0.5 });
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.menu-card').forEach(function (c) { io.observe(c); });
      // Re-observar tras re-renders del menú
      var grid = document.getElementById('menuGrid');
      if (grid && window.MutationObserver) {
        new MutationObserver(function () {
          grid.querySelectorAll('.menu-card').forEach(function (c) { io.observe(c); });
        }).observe(grid, { childList: true });
      }
    });
  }
})();
