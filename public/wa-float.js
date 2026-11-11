/* Botón flotante de WhatsApp para páginas pautantes.
   Detecta el primer enlace wa.me de la página y crea un CTA fijo.
   Se omite si la página ya tiene .wa-float propio. */
(function () {
  if (window.__waFloatInjected) return;
  window.__waFloatInjected = true;

  function build() {
    if (document.querySelector('.wa-float')) return;
    var link = document.querySelector('a[href*="wa.me/"]');
    var href = link ? link.href : null;
    if (!href && window.__pautanteWA) {
      href = 'https://wa.me/' + window.__pautanteWA + '?text=' + encodeURIComponent('Hola, vi su página en Salento a la Mano y quiero más información.');
    }
    if (!href) return;

    var style = document.createElement('style');
    style.textContent = [
      '.wa-float{position:fixed;left:24px;bottom:24px;z-index:999;background:#25d366;color:#fff;padding:13px 20px;border-radius:999px;font-weight:700;font-size:14px;font-family:\'DM Sans\',sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.28);display:inline-flex;align-items:center;gap:8px;text-decoration:none;transition:transform .25s,box-shadow .25s}',
      '.wa-float:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(0,0,0,.32);color:#fff}',
      '@media (max-width:800px){.wa-float{left:16px;bottom:16px;padding:12px 16px;font-size:13px}}'
    ].join('');
    document.head.appendChild(style);

    var a = document.createElement('a');
    a.className = 'wa-float';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.setAttribute('aria-label', 'Contactar por WhatsApp');
    a.textContent = '\uD83D\uDCAC Reservar por WhatsApp';
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
