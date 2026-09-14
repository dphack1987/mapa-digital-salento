const NotFound = () => {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: '#f5f1e8',
      color: '#2d2a24',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: 600 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          justifyContent: 'center',
          marginBottom: 40
        }}>
          <img src="/logo_salento2026.png" alt="Salento a la Mano" style={{ height: 40 }} />
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontSize: '1.2rem',
            fontWeight: 600
          }}>Salento a la Mano</span>
        </div>

        <div style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '8rem',
          fontWeight: 600,
          color: '#c8a96e',
          lineHeight: 1,
          marginBottom: 8,
          opacity: 0.6
        }}>404</div>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌵</div>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '1.8rem',
          fontWeight: 600,
          marginBottom: 12
        }}>Te perdiste en el camino</h1>
        <p style={{
          fontSize: '1rem',
          color: '#666',
          marginBottom: 32,
          lineHeight: 1.6
        }}>
          Esta pagina no existe o fue movida.<br />
          Pero tranquilo, Salento tiene mucho por descubrir.
        </p>

        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 40
        }}>
          <a href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 24px',
            borderRadius: 12,
            fontSize: '0.95rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: '#2d2a24',
            color: 'white'
          }}>🏠 Volver al inicio</a>
          <button onClick={() => window.history.back()} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 24px',
            borderRadius: 12,
            fontSize: '0.95rem',
            fontWeight: 600,
            background: 'transparent',
            color: '#2d2a24',
            border: '2px solid #c8a96e',
            cursor: 'pointer'
          }}>← Volver atras</button>
        </div>

        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          marginBottom: 32
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>🔍 Que buscabas?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10
          }}>
            {[
              { icon: '🍽️', label: 'Restaurantes', href: '/categorias/restaurantes.html' },
              { icon: '🏨', label: 'Alojamientos', href: '/categorias/alojamientos.html' },
              { icon: '☕', label: 'Coffee Tours', href: '/categorias/coffee-tours.html' },
              { icon: '🌴', label: 'Atractivos', href: '/categorias/atractivos-turisticos.html' },
              { icon: '🗺️', label: 'Mapa interactivo', href: '/mapa-interactivo-salento.html' },
              { icon: '🥾', label: 'Valle de Cocora', href: '/valle-de-cocora-salento.html' },
              { icon: '🐟', label: 'Mejor trucha', href: '/mejor-trucha-salento.html' },
              { icon: '❓', label: 'Preguntas frecuentes', href: '/faq-salento-preguntas-frecuentes-turistas-informacion-oficial.html' },
            ].map((item) => (
              <a key={item.href} href={item.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 12,
                borderRadius: 10,
                background: '#f9f7f3',
                textDecoration: 'none',
                color: '#2d2a24',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#999' }}>
          Salento a la Mano ·{' '}
          <a href="https://www.mapaturisticodelquindio.com" style={{ color: '#c8a96e', textDecoration: 'none' }}>
            Mapa Turistico del Quindio
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
