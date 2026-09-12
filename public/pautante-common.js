/* ===== PAUTANTE COMMON JS ===== */
/* Funciones compartidas: carrito, moneda, WhatsApp */
/* Elimina ~120 lineas de JS duplicado por pagina */

var PautanteCommon = (function() {
  var TASAS = { COP: 1, USD: 4000, EUR: 4300 };
  var SIMBOLOS = { COP: '$', USD: 'US$', EUR: '\u20AC' };

  function fmt(precio, moneda) {
    if (precio === 0) return 'Incluido';
    if (moneda === 'COP') return '$' + precio.toLocaleString('es-CO');
    var convertido = (precio / TASAS[moneda]).toFixed(2);
    return SIMBOLOS[moneda] + convertido;
  }

  function countCarrito(carrito) {
    return Object.values(carrito).reduce(function(sum, qty) { return sum + qty; }, 0);
  }

  function totalCarrito(carrito, items) {
    return Object.keys(carrito).reduce(function(sum, id) {
      var p = items.find(function(x) { return x.id === Number(id); });
      return sum + (p ? p.precio * carrito[id] : 0);
    }, 0);
  }

  function actualizarCarritoFlotante(carrito, items, moneda) {
    var count = countCarrito(carrito);
    var total = totalCarrito(carrito, items);
    var badge = document.getElementById('cartBadge');
    var totalEl = document.getElementById('cartTotal');
    var floatEl = document.getElementById('cartFloat');
    if (badge) badge.textContent = count;
    if (totalEl) totalEl.textContent = total > 0 ? fmt(total, moneda) : (count > 0 ? count + ' seleccionados' : '$0');
    if (floatEl) floatEl.classList.toggle('visible', count > 0);
  }

  function renderCarritoModal(carrito, items, moneda) {
    var container = document.getElementById('cartItems');
    var totalEl = document.getElementById('cartModalTotal');
    var itemList = Object.keys(carrito).filter(function(id) { return carrito[id] > 0; });
    if (!container) return;
    if (itemList.length === 0) {
      container.innerHTML = '<p class="muted" style="text-align:center;padding:20px">Tu selecci\u00f3n est\u00e1 vac\u00eda.</p>';
    } else {
      container.innerHTML = itemList.map(function(id) {
        var qty = carrito[id];
        var p = items.find(function(x) { return x.id === Number(id); });
        var priceText = p.precio > 0 ? fmt(p.precio * qty, moneda) : 'Incluido';
        return '<div class="cart-item"><div class="info"><strong>' + p.nombre + '</strong><small>' + (p.precio > 0 ? fmt(p.precio, moneda) + ' ' + (p.precioLabel || 'c/u') : 'Incluido') + '</small></div><div class="qty"><button data-action="dec" data-id="' + p.id + '">\u2212</button><span>' + qty + '</span><button data-action="inc" data-id="' + p.id + '">+</button></div><div class="item-total">' + priceText + '</div></div>';
      }).join('');
    }
    var total = totalCarrito(carrito, items);
    if (totalEl) totalEl.textContent = total > 0 ? fmt(total, moneda) : 'Consultar total';
  }

  function enviarWhatsApp(whatsappNum, carrito, items, moneda, titulo) {
    var itemList = Object.keys(carrito).filter(function(id) { return carrito[id] > 0; });
    if (itemList.length === 0) return;
    var msg = '\uD83C\uDFE8 *' + (titulo || 'PEDIDO') + '*\n\n';
    itemList.forEach(function(id) {
      var qty = carrito[id];
      var p = items.find(function(x) { return x.id === Number(id); });
      msg += '\u2022 ' + p.nombre + ' x' + qty + (p.precio > 0 ? ' \u2014 ' + fmt(p.precio * qty, moneda) : ' \u2014 Incluido') + '\n';
    });
    var total = totalCarrito(carrito, items);
    if (total > 0) msg += '\n*Total: ' + fmt(total, moneda) + '*\n';
    msg += '\n\u00BFMe confirman disponibilidad?';
    window.open('https://wa.me/' + whatsappNum + '?text=' + encodeURIComponent(msg), '_blank');
  }

  return {
    fmt: fmt,
    countCarrito: countCarrito,
    totalCarrito: totalCarrito,
    actualizarCarritoFlotante: actualizarCarritoFlotante,
    renderCarritoModal: renderCarritoModal,
    enviarWhatsApp: enviarWhatsApp
  };
})();
