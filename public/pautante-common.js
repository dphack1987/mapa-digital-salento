/* ===== PAUTANTE COMMON JS ===== */
/* Menú interactivo reutilizable: carrito, moneda, WhatsApp, tabs, búsqueda */
/* Modelo: Fonda Boquía — aplica a restaurantes, hoteles, coffee tours, experiencias */

var PautanteCommon = (function() {
  var TASAS = { COP: 1, USD: 4000, EUR: 4300 };
  var SIMBOLOS = { COP: '$', USD: 'US$', EUR: '\u20AC' };

  function fmt(precio, moneda, baseCurrency) {
    if (precio === 0) return 'Incluido';
    baseCurrency = baseCurrency || 'COP';
    if (moneda === baseCurrency) {
      if (moneda === 'COP') return '$' + precio.toLocaleString('es-CO');
      return SIMBOLOS[moneda] + precio;
    }
    var precioCOP = baseCurrency === 'USD' ? precio * TASAS.USD : baseCurrency === 'EUR' ? precio * TASAS.EUR : precio;
    if (moneda === 'COP') return '$' + Math.round(precioCOP).toLocaleString('es-CO');
    var convertido = (precioCOP / TASAS[moneda]).toFixed(2);
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

  function actualizarCarritoFlotante(carrito, items, moneda, baseCurrency) {
    var count = countCarrito(carrito);
    var total = totalCarrito(carrito, items);
    var badge = document.getElementById('cartBadge');
    var totalEl = document.getElementById('cartTotal');
    var floatEl = document.getElementById('cartFloat');
    if (badge) badge.textContent = count;
    if (totalEl) totalEl.textContent = total > 0 ? fmt(total, moneda, baseCurrency) : (count > 0 ? count + ' seleccionados' : '$0');
    if (floatEl) floatEl.classList.toggle('visible', count > 0);
  }

  function renderCarritoModal(carrito, items, moneda, baseCurrency) {
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
        var priceText = p.precio > 0 ? fmt(p.precio * qty, moneda, baseCurrency) : 'Incluido';
        return '<div class="cart-item"><div class="info"><strong>' + p.nombre + '</strong><small>' + (p.precio > 0 ? fmt(p.precio, moneda, baseCurrency) + ' ' + (p.precioLabel || 'c/u') : 'Incluido') + '</small></div><div class="qty"><button data-action="dec" data-id="' + p.id + '">\u2212</button><span>' + qty + '</span><button data-action="inc" data-id="' + p.id + '">+</button></div><div class="item-total">' + priceText + '</div></div>';
      }).join('');
    }
    var total = totalCarrito(carrito, items);
    if (totalEl) totalEl.textContent = total > 0 ? fmt(total, moneda, baseCurrency) : 'Consultar total';
  }

  function enviarWhatsApp(whatsappNum, carrito, items, moneda, titulo, baseCurrency) {
    var itemList = Object.keys(carrito).filter(function(id) { return carrito[id] > 0; });
    if (itemList.length === 0) return;
    var msg = '\uD83C\uDFE8 *' + (titulo || 'PEDIDO') + '*\n\n';
    itemList.forEach(function(id) {
      var qty = carrito[id];
      var p = items.find(function(x) { return x.id === Number(id); });
      msg += '\u2022 ' + p.nombre + ' x' + qty + (p.precio > 0 ? ' \u2014 ' + fmt(p.precio * qty, moneda, baseCurrency) : ' \u2014 Incluido') + '\n';
    });
    var total = totalCarrito(carrito, items);
    if (total > 0) msg += '\n*Total: ' + fmt(total, moneda, baseCurrency) + '*\n';
    msg += '\n\u00BFMe confirman disponibilidad?';
    window.open('https://wa.me/' + whatsappNum + '?text=' + encodeURIComponent(msg), '_blank');
  }

  /* ===== INIT MENU: sistema completo reutilizable ===== */
  /* Config:
     containerId: id del div donde renderizar (default: 'menuGrid')
     items: [{id, cat, nombre, precio, desc, img, emoji}]
     categories: [{id, label}] — opcional, se auto-detectan
     whatsapp: string — número WhatsApp
     businessName: string — nombre para el mensaje
     currency: 'COP'|'USD'|'EUR'
     showSearch: boolean
     showCurrency: boolean
     precioLabel: string — ej 'por persona', 'c/u'
  */
  function initMenu(config) {
    var items = config.items || [];
    var whatsapp = config.whatsapp || '';
    var businessName = config.businessName || 'PEDIDO';
    var moneda = config.currency || 'COP';
    var baseCurrency = config.baseCurrency || 'COP';
    var showSearch = config.showSearch !== false;
    var showCurrency = config.showCurrency !== false;
    var precioLabel = config.precioLabel || 'c/u';
    var containerId = config.containerId || 'menuGrid';
    var categoria = 'todas';
    var busqueda = '';
    var carrito = {};

    // Auto-detect categories
    var catSet = {};
    items.forEach(function(item) { catSet[item.cat] = true; });
    var categories = config.categories || [{ id: 'todas', label: 'Todas' }];
    if (!config.categories) {
      Object.keys(catSet).forEach(function(catId) {
        categories.push({ id: catId, label: catId.charAt(0).toUpperCase() + catId.slice(1) });
      });
    }

    // Render tabs
    var tabsEl = document.getElementById('menuTabs');
    if (tabsEl) {
      var catsConConteo = categories.map(function(c) {
        var count = c.id === 'todas' ? items.length : items.filter(function(p) { return p.cat === c.id; }).length;
        return Object.assign({}, c, { count: count });
      });
      tabsEl.innerHTML = catsConConteo.map(function(c) {
        return '<button class="menu-tab' + (c.id === categoria ? ' active' : '') + '" data-cat="' + c.id + '">' + c.label + '<span class="count">' + c.count + '</span></button>';
      }).join('');
    }

    function render() {
      var grid = document.getElementById(containerId);
      var emptyEl = document.getElementById('menuEmpty');
      if (!grid) return;
      var filtrados = items.filter(function(p) {
        var okCat = categoria === 'todas' || p.cat === categoria;
        var okBusq = !busqueda || p.nombre.toLowerCase().indexOf(busqueda) >= 0 || (p.desc || '').toLowerCase().indexOf(busqueda) >= 0;
        return okCat && okBusq;
      });
      if (filtrados.length === 0) {
        grid.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }
      if (emptyEl) emptyEl.style.display = 'none';
      grid.innerHTML = filtrados.map(function(p) {
        var qty = carrito[p.id] || 0;
        var img = p.img
          ? '<img class="menu-card-img" src="' + p.img + '" alt="' + p.nombre + '" loading="lazy"/>'
          : '<div class="menu-card-emoji">' + (p.emoji || '\uD83C\uDF7D\uFE0F') + '</div>';
        var controls = qty > 0
          ? '<div class="qty-ctrl"><button data-action="dec" data-id="' + p.id + '">\u2212</button><span>' + qty + '</span><button data-action="inc" data-id="' + p.id + '">+</button></div>'
          : '<button class="add-btn" data-action="inc" data-id="' + p.id + '" aria-label="Agregar ' + p.nombre + '">+</button>';
        return '<article class="menu-card">' + img + '<div class="menu-card-body"><span class="cat-tag">' + p.cat + '</span><h3>' + p.nombre + '</h3><p class="desc">' + (p.desc || '') + '</p><div class="footer"><span class="price">' + fmt(p.precio, moneda) + (precioLabel ? ' <small>' + precioLabel + '</small>' : '') + '</span>' + controls + '</div></div></article>';
      }).join('');
    }

    // Event delegation
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action]');
      if (t) {
        var id = Number(t.dataset.id);
        var action = t.dataset.action;
        if (action === 'inc') carrito[id] = (carrito[id] || 0) + 1;
        if (action === 'dec') {
          carrito[id] = (carrito[id] || 0) - 1;
          if (carrito[id] <= 0) delete carrito[id];
        }
        render();
        actualizarCarritoFlotante(carrito, items, moneda, baseCurrency);
        renderCarritoModal(carrito, items, moneda, baseCurrency);
        return;
      }
      var tab = e.target.closest('.menu-tab[data-cat]');
      if (tab) {
        categoria = tab.dataset.cat;
        document.querySelectorAll('.menu-tab[data-cat]').forEach(function(b) { b.classList.remove('active'); });
        tab.classList.add('active');
        render();
        return;
      }
      var cur = e.target.closest('.currency-switch button');
      if (cur) {
        moneda = cur.dataset.cur;
        document.querySelectorAll('.currency-switch button').forEach(function(b) { b.classList.remove('active'); });
        cur.classList.add('active');
        render();
        actualizarCarritoFlotante(carrito, items, moneda, baseCurrency);
        renderCarritoModal(carrito, items, moneda, baseCurrency);
        return;
      }
    });

    // Search
    var searchEl = document.getElementById('menuSearch');
    if (searchEl) {
      searchEl.addEventListener('input', function(e) {
        busqueda = e.target.value.toLowerCase().trim();
        render();
      });
    }

    // Cart float
    var cartFloat = document.getElementById('cartFloat');
    if (cartFloat) {
      cartFloat.addEventListener('click', function() {
        renderCarritoModal(carrito, items, moneda, baseCurrency);
        document.getElementById('cartModal').classList.add('open');
      });
    }

    // Cart modal
    var closeCart = document.getElementById('closeCart');
    if (closeCart) closeCart.addEventListener('click', function() { document.getElementById('cartModal').classList.remove('open'); });

    var clearCart = document.getElementById('clearCart');
    if (clearCart) clearCart.addEventListener('click', function() {
      carrito = {};
      render(); actualizarCarritoFlotante(carrito, items, moneda, baseCurrency); renderCarritoModal(carrito, items, moneda, baseCurrency);
    });

    var sendBtn = document.getElementById('sendWhatsApp');
    if (sendBtn) sendBtn.addEventListener('click', function() { enviarWhatsApp(whatsapp, carrito, items, moneda, businessName, baseCurrency); });

    var cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.addEventListener('click', function(e) {
        if (e.target.id === 'cartModal') cartModal.classList.remove('open');
      });
    }

    // Initial render
    render();
    actualizarCarritoFlotante(carrito, items, moneda, baseCurrency);

    return { render: render, getCarrito: function() { return carrito; } };
  }

  return {
    fmt: fmt,
    countCarrito: countCarrito,
    totalCarrito: totalCarrito,
    actualizarCarritoFlotante: actualizarCarritoFlotante,
    renderCarritoModal: renderCarritoModal,
    enviarWhatsApp: enviarWhatsApp,
    initMenu: initMenu
  };
})();
