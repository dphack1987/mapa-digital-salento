/* Navegación rápida (subir/bajar) para páginas estáticas.
   Mismo estilo que el toolbar flotante de la app React. */
(function () {
  if (window.__quickNavInjected) return;
  window.__quickNavInjected = true;

  var style = document.createElement('style');
  style.textContent = [
    '.qn-toolbar{position:fixed;right:18px;bottom:128px;display:flex;flex-direction:column;gap:6px;z-index:80;padding:4px;background:rgba(245,241,232,.82);border:1px solid var(--line,#d9d0bf);border-radius:10px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);box-shadow:0 10px 22px rgba(39,54,43,.08)}',
    '.qn-btn{width:26px;height:26px;display:grid;place-items:center;border:1px solid var(--line,#d9d0bf);background:rgba(255,255,255,.96);color:var(--ink,#27362b);border-radius:8px;cursor:pointer;box-shadow:0 6px 14px rgba(39,54,43,.08);padding:0;transition:transform .2s ease,background .2s ease,color .2s ease}',
    '.qn-btn:hover,.qn-btn:focus-visible{background:var(--ink,#27362b);color:#fff;transform:translateY(-2px);outline:none}',
    '.qn-btn svg{width:13px;height:13px;display:block}',
    '@media (max-width:700px){.qn-toolbar{right:10px;bottom:92px}}'
  ].join('');
  document.head.appendChild(style);

  var upSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
  var downSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>';

  function build() {
    if (document.querySelector('.qn-toolbar')) return;
    var bar = document.createElement('div');
    bar.className = 'qn-toolbar';
    bar.setAttribute('aria-label', 'Navegación rápida');

    var up = document.createElement('button');
    up.type = 'button';
    up.className = 'qn-btn';
    up.setAttribute('aria-label', 'Subir al inicio');
    up.innerHTML = upSvg;
    up.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var down = document.createElement('button');
    down.type = 'button';
    down.className = 'qn-btn';
    down.setAttribute('aria-label', 'Bajar al final');
    down.innerHTML = downSvg;
    down.addEventListener('click', function () {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    bar.appendChild(up);
    bar.appendChild(down);
    document.body.appendChild(bar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
