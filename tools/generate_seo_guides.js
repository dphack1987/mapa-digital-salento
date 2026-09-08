import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const domain = 'https://salentoalamano.com'
const today = new Date().toISOString().slice(0, 10)

const locales = {
  es: { language: 'es-CO', label: 'Español', dir: 'ltr' },
  en: { language: 'en', label: 'English', dir: 'ltr' },
  de: { language: 'de', label: 'Deutsch', dir: 'ltr' },
  fr: { language: 'fr', label: 'Français', dir: 'ltr' },
}

const hubs = {
  es: {
    title: 'Salento, Quindío: guía local de turismo | Salento a la Mano',
    description:
      'Guía local de Salento, Quindío: alojamientos, restaurantes, coffee tours, Valle del Cocora, palmas de cera, trucha arcoíris y experiencias con contacto directo.',
    h1: 'Guía local de Salento, Quindío',
    intro:
      'Encuentra alojamientos, sabores, coffee tours, cascadas y experiencias locales. Información práctica, negocios verificados y contacto directo sin intermediarios.',
    guidesHeading: 'Guías para planificar tu visita',
    usefulHeading: 'Búsquedas útiles',
    cta: 'Explorar el mapa',
    ctaDir: 'Ver directorio local',
    keywords: [
      'mejores fincas cafeteras con trato directo en Salento',
      'hotel familiar cerca de la plaza de Salento',
      'restaurantes con comida local en Salento Quindío',
      'transporte al Valle de Cocora desde Salento',
      'qué hacer en Salento en tres días',
      'cascadas cerca de Salento Quindío',
    ],
  },
  en: {
    title: 'Salento, Colombia Travel Guide | Salento a la Mano',
    description:
      'A local guide to Salento, Colombia: accommodation, restaurants, coffee tours, Cocora Valley, wax palms and direct contact with local businesses.',
    h1: 'Salento, Colombia: local travel guide',
    intro:
      'Find a place to stay, eat, explore and book local experiences in Salento, Quindío. Verified businesses and direct contact — no middlemen.',
    guidesHeading: 'Guides to plan your visit',
    usefulHeading: 'Useful searches',
    cta: 'Explore the map',
    ctaDir: 'Browse local directory',
    keywords: [
      'best coffee farms with direct booking in Salento Colombia',
      'family-friendly hotel near Salento main square',
      'best local restaurants in Salento Quindio',
      'how to get to Cocora Valley from Salento',
      'things to do in Salento Colombia in 3 days',
      'waterfalls near Salento Quindio',
    ],
  },
  de: {
    title: 'Salento Kolumbien: lokaler Reiseführer | Salento a la Mano',
    description:
      'Lokaler Reiseführer für Salento in Kolumbien: Unterkünfte, Restaurants, Kaffeetouren, Cocora-Tal, Wachspalmen und direkter Kontakt zu lokalen Anbietern.',
    h1: 'Salento, Kolumbien: lokaler Reiseführer',
    intro:
      'Entdecke Unterkünfte, regionale Küche, Kaffeetouren, Wasserfälle und lokale Erlebnisse. Geprüfte Anbieter und direkter Kontakt ohne Zwischenhändler.',
    guidesHeading: 'Guides für deine Reiseplanung',
    usefulHeading: 'Nützliche Suchanfragen',
    cta: 'Karte öffnen',
    ctaDir: 'Lokales Verzeichnis ansehen',
    keywords: [
      'beste Kaffeefincas mit direkter Buchung in Salento Kolumbien',
      'familienfreundliches Hotel nahe dem Hauptplatz von Salento',
      'regionale Restaurants in Salento Quindío Kolumbien',
      'Anreise zum Cocora-Tal ab Salento',
      'Salento in drei Tagen erleben',
      'Wasserfälle bei Salento Kolumbien',
    ],
  },
  fr: {
    title: 'Salento Colombie : guide local de voyage | Salento a la Mano',
    description:
      'Guide local de Salento en Colombie : hébergements, restaurants, tours café, vallée de Cocora, palmiers de cire et contact direct avec les commerces locaux.',
    h1: 'Salento, Colombie : guide local de voyage',
    intro:
      'Trouvez où dormir, manger et explorer à Salento, Quindío. Commerces vérifiés et contact direct, sans intermédiaires.',
    guidesHeading: 'Guides pour planifier votre visite',
    usefulHeading: 'Recherches utiles',
    cta: 'Explorer la carte',
    ctaDir: 'Voir l’annuaire local',
    keywords: [
      'meilleures fincas de café avec réservation directe à Salento',
      'hôtel familial près de la place principale de Salento',
      'restaurants locaux à Salento Quindío',
      'comment aller de Salento à la vallée de Cocora',
      'que faire à Salento Colombie en trois jours',
      'cascades près de Salento Quindío',
    ],
  },
}

const guides = [
  {
    slug: 'guia-valle-del-cocora',
    content: {
      es: {
        title: 'Valle del Cocora: cómo llegar, qué ver | Salento, Quindío',
        description:
          'Cómo llegar al Valle del Cocora desde Salento en jeep willys, cuándo ir, qué llevar y trucos para ver las palmas de cera, el árbol nacional de Colombia.',
        intro:
          'El Valle de Cocora es el único lugar del mundo donde crecen las palmas de cera (Ceroxylon quindiuense), el árbol nacional de Colombia. Está a pocos minutos de Salento y es el corazón natural del Quindío.',
        facts: [
          'Salida: jeeps willys desde la Calle Real, junto a la plaza de Salento',
          'Tiempo de trayecto: unos 30 minutos',
          'Altitud: entre 1.800 y 2.400 metros sobre el nivel del mar',
          'Clima de montaña andina: lluvias frecuentes por la tarde',
          'Senderos desde 1 hora hasta jornadas completas',
        ],
        sections: [
          ['Cómo llegar desde Salento', 'Los jeeps willys (todo terreno) parten de la Calle Real y la plaza de Salento a lo largo de la mañana. El recorrido hasta el valle toma unos 30 minutos. Consulta las fichas locales de experiencias y transporte para confirmar horarios y tarifas actualizadas.'],
          ['Cuándo ir y qué esperar', 'Las mañanas son el mejor momento: hay menos lluvia y la visibilidad de las palmas es mayor. Entre semana hay menos visitantes. El clima de montaña cambia rápido, así que la lluvia por la tarde es habitual.'],
          ['Qué llevar', 'Agua, calzado de campo o botas, ropa impermeable, protección solar, gorra y efectivo. Algunos puntos de la zona no tienen buena señal de datos ni datáfonos.'],
          ['Visita responsable', 'Las palmas de cera son patrimonio nacional: respeta los senderos, no arranques plantas ni frutos y elige operadores locales de Salento para que la visita beneficie a la comunidad.'],
        ],
        faq: [
          ['¿Cómo llego al Valle de Cocora desde Salento?', 'En jeep willys que parten de la Calle Real (junto a la plaza de Salento) de forma continua por la mañana. El trayecto dura unos 30 minutos.'],
          ['¿Cuánto dura la visita al Valle de Cocora?', 'Depende de la ruta: desde una caminata corta de 1 a 2 horas hasta rutas de montaña de medio día o día completo.'],
          ['¿Cuál es la mejor hora para ir?', 'La mañana. Hay menos lluvia, más visibilidad de las palmas y una temperatura más agradable para caminar.'],
        ],
      },
      en: {
        title: 'Cocora Valley: how to get there and what to see | Salento',
        description:
          'How to get to Cocora Valley from Salento by Willy jeep, when to go, what to pack and tips to see the wax palms, the national tree of Colombia.',
        intro:
          'Cocora Valley is the only place on Earth where the wax palm (Ceroxylon quindiuense), the national tree of Colombia, grows. It is a few minutes from Salento and the natural heart of Quindío.',
        facts: [
          'Departure: Willy jeeps from Calle Real, next to Salento main square',
          'Travel time: about 30 minutes',
          'Altitude: 1,800–2,400 metres above sea level',
          'Andean mountain weather: rain is common in the afternoon',
          'Trails from 1 hour up to full-day hikes',
        ],
        sections: [
          ['How to get there from Salento', 'Willy jeeps (off-road) leave from Calle Real and Salento main square throughout the morning. The drive to the valley takes about 30 minutes. Check the local experience and transport pages for up-to-date schedules and fares.'],
          ['When to go and what to expect', 'Mornings are the best time: less rain and better views of the palms. Midweek brings fewer visitors. Mountain weather changes fast and afternoon showers are normal.'],
          ['What to pack', 'Water, trail shoes or boots, waterproof layer, sunscreen, a hat and cash. Some spots in the area have no phone signal or card machines.'],
          ['Visiting responsibly', 'Wax palms are national heritage: stay on the trails, do not pick plants, and support local Salento operators so your visit benefits the community.'],
        ],
        faq: [
          ['How do I get to Cocora Valley from Salento?', 'By Willy jeep leaving from Calle Real (next to Salento main square) continuously in the morning. The ride takes about 30 minutes.'],
          ['How long does a Cocora Valley visit take?', 'It depends on the route: from a short 1–2 hour walk to half-day or full-day mountain trails.'],
          ['What is the best time to go?', 'The morning. There is less rain, better palm visibility and a more comfortable temperature for hiking.'],
        ],
      },
      de: {
        title: 'Cocora-Tal: Anreise und Sehenswürdigkeiten | Salento',
        description:
          'So erreichst du das Cocora-Tal von Salento mit dem Willy-Jeep, die beste Reisezeit, Packliste und Tipps für die Wachspalmen, den Nationalbaum Kolumbiens.',
        intro:
          'Das Cocora-Tal ist der einzige Ort der Welt, an dem die Wachspalme (Ceroxylon quindiuense), der Nationalbaum Kolumbiens, wächst. Es liegt wenige Minuten von Salento entfernt und ist das Naturherz von Quindío.',
        facts: [
          'Abfahrt: Willy-Jeeps an der Calle Real, neben der Plaza von Salento',
          'Fahrtzeit: circa 30 Minuten',
          'Höhe: 1.800 bis 2.400 Meter über dem Meer',
          'Anden-Gebirgsklima: nachmittags häufig Regen',
          'Wege von 1 Stunde bis zu ganztägigen Wanderungen',
        ],
        sections: [
          ['Anreise von Salento', 'Willy-Jeeps (Geländewagen) fahren am Vormittag durchgehend von der Calle Real und der Plaza von Salento. Die Fahrt ins Tal dauert rund 30 Minuten. Aktuelle Zeiten und Preise findest du in den lokalen Erlebnis- und Transportseiten.'],
          ['Beste Reisezeit und was dich erwartet', 'Vormittags ist die Zeit zum Hingehen: weniger Regen und besserer Blick auf die Palmen. Unter der Woche sind weniger Besucher unterwegs. Das Gebirgswetter wechselt schnell, nachmittags ist Regen normal.'],
          ['Packliste', 'Wasser, Wanderschuhe, Regenjacke, Sonnenschutz, Mütze und Bargeld. In einigen Bereichen gibt es weder Mobilfunk noch Kartenzahlung.'],
          ['Verantwortungsvoller Besuch', 'Wachspalmen sind Nationalerbe: bleib auf den Wegen, pflücke keine Pflanzen und unterstütze lokale Anbieter aus Salento.'],
        ],
        faq: [
          ['Wie komme ich von Salento ins Cocora-Tal?', 'Mit dem Willy-Jeep von der Calle Real (neben der Plaza von Salento), der vormittags durchgehend fährt. Die Fahrt dauert etwa 30 Minuten.'],
          ['Wie lange dauert der Besuch im Cocora-Tal?', 'Je nach Route: von einer kurzen 1–2-stündigen Wanderung bis zu halbtägigen oder ganztägigen Bergtouren.'],
          ['Wann ist die beste Zeit zum Gehen?', 'Am Vormittag. Es regnet seltener, die Palmen sind besser sichtbar und die Temperatur ist angenehmer zum Wandern.'],
        ],
      },
      fr: {
        title: 'Vallée de Cocora : accès et que voir | Salento, Colombie',
        description:
          'Comment aller à la vallée de Cocora depuis Salento en jeep Willy, quand y aller, quoi emporter et astuces pour voir le palmier de cire, l’arbre national de Colombie.',
        intro:
          'La vallée de Cocora est le seul endroit au monde où pousse le palmier de cire (Ceroxylon quindiuense), l’arbre national de Colombie. Elle est à quelques minutes de Salento, au cœur naturel du Quindío.',
        facts: [
          'Départ : jeeps Willy depuis la Calle Real, près de la place de Salento',
          'Trajet : environ 30 minutes',
          'Altitude : entre 1 800 et 2 400 mètres',
          'Climat de montagne andine : pluies fréquentes l’après-midi',
          'Sentiers de 1 heure à des randonnées complètes',
        ],
        sections: [
          ['Accès depuis Salento', 'Les jeeps Willy (tout-terrain) partent de la Calle Real et de la place de Salento toute la matinée. Le trajet dure environ 30 minutes. Consultez les pages locales d’expériences et de transport pour les horaires et tarifs à jour.'],
          ['Quand y aller et à quoi s’attendre', 'Le matin est le meilleur moment : moins de pluie et une meilleure vue sur les palmiers. En semaine, il y a moins de visiteurs. Le climat de montagne change vite et la pluie l’après-midi est fréquente.'],
          ['Que prévoir', 'De l’eau, des chaussures de marche, une veste imperméable, de la protection solaire, une casquette et de l’argent liquide. Certains endroits n’ont ni réseau ni terminal de carte.'],
          ['Une visite responsable', 'Les palmiers de cire sont un patrimoine national : restez sur les sentiers, ne cueillez pas de plantes et privilégiez les opérateurs locaux de Salento.'],
        ],
        faq: [
          ['Comment aller à la vallée de Cocora depuis Salento ?', 'En jeep Willy depuis la Calle Real (près de la place de Salento), en continu le matin. Le trajet prend environ 30 minutes.'],
          ['Combien de temps dure la visite ?', 'Selon l’itinéraire : d’une balade de 1 à 2 heures à des randonnées d’une demi-journée ou d’une journée complète.'],
          ['Quelle est la meilleure heure pour y aller ?', 'Le matin. Moins de pluie, une meilleure visibilité des palmiers et une température agréable pour marcher.'],
        ],
      },
    },
    related: [
      { name: 'Cabalgatas Cocora Mágica', url: '/paginas-pautantes/cabalgatas-cocora-magica/', desc: 'Cabalgatas guiadas por el valle y la montaña.' },
      { name: 'Cascadas de Santa Rita', url: '/paginas-pautantes/reserva-natural-cascadas-de-santa-rita/', desc: 'Piscinas naturales y senderismo cerca de Salento.' },
      { name: 'Moto Aventura 110', url: '/paginas-pautantes/moto-aventura-110/', desc: 'Sesiones de enduro y rutas en moto por la montaña.' },
    ],
  },
  {
    slug: '10-tours-cafe-salento',
    content: {
      es: {
        title: 'Coffee tours en Salento: cómo elegir la mejor finca',
        description:
          'Cómo elegir un coffee tour en Salento (Quindío): qué incluye, cuánto dura, dónde inicia y cómo reservar directo con fincas cafeteras familiares.',
        intro:
          'Salento es el corazón cafetero de Colombia. Las fincas del pueblo y de sus alrededores abren sus puertas para mostrar todo el recorrido del café: siembra, cosecha, beneficio y catas de café especial.',
        facts: [
          'Fincas cafeteras a pocos minutos de Salento',
          'Recorridos de 1 a 3 horas aproximadamente',
          'Incluyen visita a cultivo, proceso y cata',
          'Trato directo con familias cafeteras',
          'Reserva directa por WhatsApp, sin intermediarios',
        ],
        sections: [
          ['Qué incluye un coffee tour', 'Las experiencias van de la siembra y la recolección al beneficio (despulpe, fermentación y secado) y terminan con una cata de café especial. Pregunta siempre qué incluye la tarifa y qué debe pagarse aparte.'],
          ['Cómo comparar experiencias', 'Compara duración, idioma del guía, punto de encuentro, transporte incluido y servicio de cata. Las fichas locales de cada finca incluyen su información y contacto para decidir sin depender de agencias externas.'],
          ['Reserva directa y ventajas', 'Reservar directo con la finca permite confirmar disponibilidad, horarios, tarifas y condiciones de cancelación en segundos, y precios locales sin comisiones de intermediarios.'],
        ],
        faq: [
          ['¿Cuánto cuesta un coffee tour en Salento?', 'Las tarifas varían según la finca, la duración y lo que incluya. Cada ficha local publica los precios y el contacto directo del operador para confirmar.'],
          ['¿Cuál es el mejor coffee tour de Salento?', 'Depende de lo que busques: familias con niños, cata especializada o recorrido por la plantación. Compara las fincas locales y elige la experiencia que más se ajuste a tu plan.'],
          ['¿Se puede reservar un coffee tour por WhatsApp?', 'Sí. La mayoría de las fincas de Salento acepta reserva directa por WhatsApp, lo que facilita confirmar horarios y disponibilidad.'],
        ],
      },
      en: {
        title: 'Coffee Tours in Salento: How to Choose the Best Farm',
        description:
          'How to choose a coffee tour in Salento (Quindío, Colombia): what it includes, how long it takes, where it starts and how to book directly with family coffee farms.',
        intro:
          'Salento is the coffee heart of Colombia. Local farms open their doors to show the full journey of coffee: planting, harvest, processing and specialty coffee cupping.',
        facts: [
          'Coffee farms a few minutes from Salento',
          'Tours of about 1 to 3 hours',
          'Includes plantation, process and cupping',
          'Direct contact with coffee farming families',
          'Direct WhatsApp booking, no middlemen',
        ],
        sections: [
          ['What a coffee tour includes', 'Experiences go from planting and picking to processing (pulping, fermentation and drying) and end with a specialty coffee cupping. Always ask what the fare includes and what is paid separately.'],
          ['How to compare experiences', 'Compare duration, guide language, meeting point, included transport and cupping service. Each farm\'s local page has its information and contact so you can decide without third-party agencies.'],
          ['Direct booking advantages', 'Booking directly with the farm lets you confirm availability, times, fares and cancellation terms in seconds, enjoying local prices without intermediaries.'],
        ],
        faq: [
          ['How much does a coffee tour in Salento cost?', 'Fares vary by farm, duration and inclusions. Each local page publishes prices and the operator\'s direct contact for confirmation.'],
          ['Which is the best coffee tour in Salento?', 'It depends on what you want: family-friendly tours, specialised cupping or a full plantation walk. Compare local farms and pick the experience that fits your plan.'],
          ['Can I book a coffee tour by WhatsApp?', 'Yes. Most farms in Salento accept direct WhatsApp bookings, making it easy to confirm times and availability.'],
        ],
      },
      de: {
        title: 'Kaffeetouren in Salento: die beste Finca wählen',
        description:
          'So wählst du eine Kaffeetour in Salento (Quindío, Kolumbien): Inhalt, Dauer, Startpunkt und direkte Buchung bei familiären Kaffeefincas.',
        intro:
          'Salento ist das Kaffeeherz Kolumbiens. Die Fincas des Ortes öffnen ihre Türen, um den ganzen Weg des Kaffees zu zeigen: Anbau, Ernte, Aufbereitung und die Verkostung von Spezialitätenkaffee.',
        facts: [
          'Kaffeefincas wenige Minuten von Salento entfernt',
          'Touren von etwa 1 bis 3 Stunden',
          'Inklusive Plantage, Verarbeitung und Verkostung',
          'Direkter Kontakt mit Kaffeebauern-Familien',
          'Direkte WhatsApp-Buchung ohne Zwischenhändler',
        ],
        sections: [
          ['Was eine Kaffeetour beinhaltet', 'Die Erlebnisse reichen vom Anbau und der Ernte bis zur Aufbereitung (Entpulpen, Fermentation, Trocknung) und enden mit einer Verkostung von Spezialitätenkaffee. Frag immer, was im Preis enthalten ist und was extra bezahlt wird.'],
          ['Erlebnisse vergleichen', 'Vergleiche Dauer, Sprache des Führers, Treffpunkt, inklusiven Transport und Verkostung. Auf den lokalen Seiten jeder Finca findest du Informationen und Kontakt, um ohne fremde Agenturen zu entscheiden.'],
          ['Direkte Buchungsvorteile', 'Direkt bei der Finca zu buchen ermöglicht es, Verfügbarkeit, Zeiten, Preise und Stornobedingungen in Sekunden zu bestätigen – zum lokalen Preis ohne Zwischenhändler.'],
        ],
        faq: [
          ['Was kostet eine Kaffeetour in Salento?', 'Die Preise hängen von Finca, Dauer und Inhalt ab. Jede lokale Seite veröffentlicht Preise und den direkten Kontakt des Betreibers zur Bestätigung.'],
          ['Welche ist die beste Kaffeetour in Salento?', 'Das hängt davon ab, was du suchst: familienfreundlich, spezialisierte Verkostung oder Plantagenbesuch. Vergleiche die lokalen Fincas und wähle das passende Erlebnis.'],
          ['Kann ich eine Kaffeetour per WhatsApp buchen?', 'Ja. Die meisten Fincas in Salento nehmen direkte WhatsApp-Buchungen an, um Zeiten und Verfügbarkeit einfach zu bestätigen.'],
        ],
      },
      fr: {
        title: 'Tours de café à Salento : choisir la meilleure finca',
        description:
          'Comment choisir un tour de café à Salento (Quindío, Colombie) : contenu, durée, point de départ et réservation directe auprès des fincas familiales.',
        intro:
          'Salento est le cœur caféier de la Colombie. Les fincas de la région ouvrent leurs portes pour montrer tout le parcours du café : plantation, récolte, traitement et dégustation de café de spécialité.',
        facts: [
          'Fincas à quelques minutes de Salento',
          'Circuits d’environ 1 à 3 heures',
          'Incluent plantation, processus et dégustation',
          'Contact direct avec les familles caféières',
          'Réservation directe par WhatsApp, sans intermédiaires',
        ],
        sections: [
          ['Ce que comprend un tour de café', 'Les expériences vont de la plantation et de la récolte au traitement (dépulpage, fermentation, séchage) et se terminent par une dégustation de café de spécialité. Demandez toujours ce qui est inclus et ce qui est payé à part.'],
          ['Comment comparer les expériences', 'Comparez la durée, la langue du guide, le point de rendez-vous, le transport inclus et la dégustation. Chaque fiche locale indique ses informations et son contact pour décider sans passer par des agences.'],
          ['Avantages de la réservation directe', 'Réserver directement auprès de la finca permet de confirmer disponibilité, horaires, tarifs et conditions d’annulation en quelques secondes, à prix local, sans commissions.'],
        ],
        faq: [
          ['Combien coûte un tour de café à Salento ?', 'Les tarifs varient selon la finca, la durée et les inclusions. Chaque fiche locale publie les prix et le contact direct de l’opérateur pour confirmer.'],
          ['Quel est le meilleur tour de café à Salento ?', 'Cela dépend de vos envies : familles, dégustation spécialisée ou visite de la plantation. Comparez les fincas locales et choisissez l’expérience adaptée à votre plan.'],
          ['Peut-on réserver un tour de café par WhatsApp ?', 'Oui. La plupart des fincas de Salento acceptent la réservation directe par WhatsApp, ce qui facilite la confirmation des horaires et de la disponibilité.'],
        ],
      },
    },
    related: [
      { name: 'Finca Cafetera Don Elías', url: '/paginas-pautantes/coffee-tour-finca-cafetera-don-elias/', desc: 'Experiencia cafetera familiar.' },
      { name: 'Finca Don Eduardo Coffee Tour', url: '/paginas-pautantes/coffee-tour-finca-don-eduardo/', desc: 'Recorrido y cata de café especial.' },
      { name: 'Finca Hotel El Ocaso', url: '/paginas-pautantes/coffee-tour-alojamiento-finca-hotel-el-ocaso/', desc: 'Alojamiento + experiencia cafetera.' },
    ],
  },
  {
    slug: 'que-hacer-en-salento-3-dias',
    content: {
      es: {
        title: 'Qué hacer en Salento: itinerario de 3 días',
        description:
          'Itinerario de 3 días en Salento (Quindío): casco histórico, Valle del Cocora, fincas cafeteras, gastronomía con trucha arcoíris y artesanías locales.',
        intro:
          'Salento se recorre a pie: la Calle Real, la plaza, los miradores y la gastronomía están a pocos metros. Con tres días puedes combinar pueblo, naturaleza, café y compras locales a tu ritmo.',
        facts: [
          'Día 1: casco histórico, miradores y gastronomía',
          'Día 2: Valle del Cocora o naturaleza cercana',
          'Día 3: finca cafetera y artesanías',
          'Todo el centro se recorre a pie',
          'Reserva con operadores locales de Salento',
        ],
        sections: [
          ['Día 1: pueblo y gastronomía', 'Recorre la Calle Real y la plaza principal, prueba la trucha arcoíris y el helado de coco artesanal de las heladerías del centro. Incluye una visita a los miradores para ver el pueblo desde arriba.'],
          ['Día 2: naturaleza', 'Sal por la mañana hacia el Valle del Cocora o a cascadas cercanas como Santa Rita. Consulta el clima la noche anterior y reserva transporte o experiencia con un operador local.'],
          ['Día 3: café y compras', 'Visita una finca cafetera, conoce artesanías y productos regionales y vuelve a pasear por el pueblo con calma. Reserva con los negocios de la ficha local que quieras visitar.'],
        ],
        faq: [
          ['¿Cuántos días se necesitan en Salento?', 'Con 2 o 3 días puedes combinar el pueblo, el Valle del Cocora, una finca cafetera y la gastronomía sin prisa.'],
          ['¿Puedo visitar Salento y el Valle de Cocora en el mismo día?', 'Sí, si sales temprano. Se recomienda dedicar la mañana al valle y la tarde al pueblo, donde puedes almorzar trucha arcoíris.'],
          ['¿Salento es seguro para visitar?', 'Salento es un pueblo turístico tranquilo. Camina por zonas concurridas, respeta horarios y haz excursiones de montaña con guías o operadores locales.'],
        ],
      },
      en: {
        title: 'What to Do in Salento: A 3-Day Itinerary',
        description:
          'A 3-day itinerary for Salento (Quindío, Colombia): historic centre, Cocora Valley, coffee farms, local food with rainbow trout and handicrafts.',
        intro:
          'Salento is a walking town: Calle Real, the main square, lookouts and restaurants are all within a few metres. With three days you can combine town, nature, coffee and local shopping at your own pace.',
        facts: [
          'Day 1: historic centre, lookouts and food',
          'Day 2: Cocora Valley or nearby nature',
          'Day 3: coffee farm and handicrafts',
          'The whole centre is walkable',
          'Book with local Salento operators',
        ],
        sections: [
          ['Day 1: town and food', 'Walk Calle Real and the main square, try rainbow trout and the artisanal coconut ice cream from the centre\'s parlours. Add a visit to the lookouts for a view over the town.'],
          ['Day 2: nature', 'Head out in the morning to Cocora Valley or nearby waterfalls such as Santa Rita. Check the weather the night before and book transport or an experience with a local operator.'],
          ['Day 3: coffee and shopping', 'Visit a coffee farm, browse handicrafts and regional products, and take a relaxed walk through town. Book directly with the local businesses you want to visit.'],
        ],
        faq: [
          ['How many days do you need in Salento?', 'With 2 or 3 days you can combine the town, Cocora Valley, a coffee farm and the local food without rushing.'],
          ['Can I visit Salento and Cocora Valley on the same day?', 'Yes, if you leave early. Spend the morning in the valley and the afternoon in town, where you can lunch on rainbow trout.'],
          ['Is Salento safe to visit?', 'Salento is a calm tourist town. Walk in busy areas, respect timings and do mountain excursions with local guides or operators.'],
        ],
      },
      de: {
        title: 'Was in Salento tun: 3-Tage-Programm',
        description:
          'Ein 3-Tage-Programm für Salento (Quindío, Kolumbien): historisches Zentrum, Cocora-Tal, Kaffeefincas, regionale Küche mit Regenbogenforelle und Handwerk.',
        intro:
          'Salento erkundet man zu Fuß: Die Calle Real, die Plaza, Aussichtspunkte und Restaurants liegen wenige Meter auseinander. Mit drei Tagen verbindest du Stadt, Natur, Kaffee und lokale Läden in deinem eigenen Tempo.',
        facts: [
          'Tag 1: historisches Zentrum, Aussichtspunkte, Essen',
          'Tag 2: Cocora-Tal oder Natur in der Umgebung',
          'Tag 3: Kaffeefinca und Kunsthandwerk',
          'Das gesamte Zentrum ist fußläufig erreichbar',
          'Buche bei lokalen Anbietern aus Salento',
        ],
        sections: [
          ['Tag 1: Stadt und Kulinarik', 'Laufe die Calle Real und den Hauptplatz entlang, probiere Regenbogenforelle und das handgemachte Kokoseis der Eisdielen im Zentrum. Besuche anschließend die Aussichtspunkte über dem Ort.'],
          ['Tag 2: Natur', 'Starte am Morgen ins Cocora-Tal oder zu nahen Wasserfällen wie Santa Rita. Prüfe das Wetter am Vorabend und buche Transport oder ein Erlebnis bei einem lokalen Anbieter.'],
          ['Tag 3: Kaffee und Shopping', 'Besuche eine Kaffeefinca, entdecke Kunsthandwerk und regionale Produkte und schlendere entspannt durch den Ort. Buche direkt bei den lokalen Betrieben, die du besuchen möchtest.'],
        ],
        faq: [
          ['Wie viele Tage braucht man in Salento?', 'Mit 2 bis 3 Tagen verbindest du die Stadt, das Cocora-Tal, eine Kaffeefinca und die lokale Küche ganz entspannt.'],
          ['Kann ich Salento und das Cocora-Tal an einem Tag besichtigen?', 'Ja, wenn du früh losfährst. Verbringe den Vormittag im Tal und den Nachmittag im Ort, wo du Regenbogenforelle essen kannst.'],
          ['Ist Salento sicher zu besuchen?', 'Salento ist ein ruhiger Touristenort. Bewege dich auf belebten Wegen, achte auf zeitabläufe und mache Bergausflüge mit lokalen Guides oder Anbietern.'],
        ],
      },
      fr: {
        title: 'Que faire à Salento : itinéraire de 3 jours',
        description:
          'Un itinéraire de 3 jours à Salento (Quindío, Colombie) : centre historique, vallée de Cocora, fincas de café, cuisine locale à la truite arc-en-ciel et artisanat.',
        intro:
          'Salento se visite à pied : la Calle Real, la place, les points de vue et les restaurants sont à quelques mètres. En trois jours, combinez village, nature, café et shopping local à votre rythme.',
        facts: [
          'Jour 1 : centre historique, points de vue et gastronomie',
          'Jour 2 : vallée de Cocora ou nature proche',
          'Jour 3 : finca de café et artisanat',
          'Tout le centre se parcourt à pied',
          'Réservez auprès des opérateurs locaux de Salento',
        ],
        sections: [
          ['Jour 1 : village et gastronomie', 'Parcourez la Calle Real et la place principale, goûtez la truite arc-en-ciel et la glace artisanale à la noix de coco du centre. Ajoutez les points de vue pour voir le village d’en haut.'],
          ['Jour 2 : nature', 'Partez le matin vers la vallée de Cocora ou les cascades proches comme Santa Rita. Vérifiez la météo la veille et réservez le transport ou une expérience avec un opérateur local.'],
          ['Jour 3 : café et shopping', 'Visitez une finca de café, découvrez l’artisanat et les produits régionaux, puis flânez dans le village. Réservez directement auprès des commerces locaux que vous souhaitez voir.'],
        ],
        faq: [
          ['Combien de jours faut-il à Salento ?', 'Avec 2 ou 3 jours, vous pouvez combiner le village, la vallée de Cocora, une finca de café et la gastronomie sans vous presser.'],
          ['Peut-on visiter Salento et la vallée de Cocora le même jour ?', 'Oui, en partant tôt. Consacrez le matin à la vallée et l’après-midi au village, où vous déjeunerez de truite arc-en-ciel.'],
          ['Est-ce que Salento est sûr ?', 'Salento est un village touristique calme. Marchez dans les zones fréquentées et faites les excursions en montagne avec des guides locaux.'],
        ],
      },
    },
    related: [
      { name: 'Restaurantes en Salento', url: '/categorias/restaurantes.html', desc: 'Gastronomía local: trucha, típicos y café.' },
      { name: 'Alojamientos en Salento', url: '/categorias/alojamientos.html', desc: 'Hoteles y fincas con contacto directo.' },
      { name: 'Atractivos turísticos', url: '/categorias/atractivos-turisticos.html', desc: 'Senderos, miradores, cascadas y puntos de interés.' },
    ],
  },
]

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

function hreflangLinks(pathName, selfLocale) {
  const alternates = Object.entries(locales).map(([locale, data]) => {
    const href = `${domain}/${locale}/${pathName}`
    if (locale === selfLocale) return `<link rel="alternate" hreflang="${data.language}" href="${href}" />`
    return `<link rel="alternate" hreflang="${data.language}" href="${href}" />`
  })
  return alternates.join('\n    ')
}

const shell = `<style>main{max-width:1184px;margin:auto;padding:28px 20px 80px}.site-head{display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:1px solid var(--line);padding-bottom:20px;margin-bottom:55px}.brand{display:inline-flex;align-items:center;gap:10px;font-weight:700}.brand-logo{width:42px;height:42px}.locale-nav{display:flex;gap:8px;flex-wrap:wrap}.locale-nav a{padding:9px 11px;border:1px solid var(--line);border-radius:4px;font:11px 'DM Mono';text-decoration:none}.hero{max-width:760px;border-left:3px solid var(--coral);padding-left:24px}.eyebrow{font:11px 'DM Mono';text-transform:uppercase;color:var(--coral);letter-spacing:.1em}.hero h1{font-size:clamp(2.2rem,6vw,4.4rem);line-height:.98;margin:14px 0}.hero p{color:#697568;line-height:1.7}.section{margin-top:48px;padding-top:28px;border-top:1px solid var(--line)}.section h2{font-size:1.9rem}.guide-grid,.related-grid,.fact-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.guide-card,.related-card,.fact-card{border:1px solid var(--line);padding:18px;background:#fff}.guide-card h3,.related-card h3{margin-top:0}.guide-card p,.related-card p,.fact-card p{color:#697568;line-height:1.55;font-size:13px}.fact-card{background:var(--lime-2)}ul.keywords{padding-left:18px}li{color:#697568;line-height:1.7}details{border:1px solid var(--line);border-radius:6px;padding:14px 16px;margin-bottom:10px;background:#fff}summary{cursor:pointer;font-weight:600}.fin{color:#697568;line-height:1.6}@media(max-width:700px){main{padding:20px 16px 55px}.site-head{align-items:flex-start;flex-direction:column;margin-bottom:35px}.guide-grid,.related-grid,.fact-grid{grid-template-columns:1fr}.hero{padding-left:16px}}</style>`

function renderPage({ locale, pathName, title, description, body, jsonLd }) {
  const data = locales[locale]
  const localeNav = Object.entries(locales)
    .map(([l, d]) => `<a href="${domain}/${l}/${pathName}" hreflang="${d.language}">${d.label}</a>`)
    .join('')
  const jsonLdBlock = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('</', '<\\/')}</script>` : ''
  return `<!doctype html><html lang="${locale === 'es' ? 'es' : locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${domain}/${locale}/${pathName}"><link rel="alternate" hreflang="x-default" href="${domain}/es/${pathName}">${hreflangLinks(pathName, locale)}<link rel="stylesheet" href="/page-theme.css">${shell}</head><body><main><header class="site-head"><a class="brand" href="/${locale}/"><img class="brand-logo" src="/logo_salento2026.png" alt="Salento a la Mano" width="42" height="42"><span>Salento a la Mano</span></a><nav class="locale-nav">${localeNav}</nav></header>${body}<footer class="section"><p class="fin">Salento a la Mano — Guía local de Salento, Quindío, Colombia. Información sin intermediarios: alojamientos, coffee tours, restaurantes y experiencias con contacto directo.</p></footer></main>${jsonLdBlock}</body></html>`
}

function writeGuide(locale, guide) {
  const c = guide.content[locale]
  const hub = hubs[locale]
  const dir = path.join(publicDir, locale, 'guias')
  fs.mkdirSync(dir, { recursive: true })
  const facts = c.facts.map(f => `<div class="fact-card"><p>${escapeHtml(f)}</p></div>`).join('')
  const sections = c.sections.map(([h, p]) => `<div class="section"><h2>${escapeHtml(h)}</h2><p>${escapeHtml(p)}</p></div>`).join('')
  const faq = c.faq.map(([q, a]) => `<details><summary>${escapeHtml(q)}</summary><p class="fin">${escapeHtml(a)}</p></details>`).join('')
  const related = guide.related.map(item => `<article class="related-card"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.desc)}</p><a class="btn primary" href="${item.url}">${locale === 'es' ? 'Ver ficha local' : 'View local page'}</a></article>`).join('')
  const body = [
    `<section class="hero"><span class="eyebrow">${locale === 'es' ? 'Salento, Quindío, Colombia' : 'Salento, Quindío, Colombia'}</span><h1>${escapeHtml(c.title.split(':')[0].split('—')[0])}</h1><p>${escapeHtml(c.intro)}</p></section>`,
    `<section class="section"><h2>${locale === 'es' ? 'Datos rápidos' : 'Quick facts'}</h2><div class="fact-grid">${facts}</div></section>`,
    sections,
    `<section class="section"><h2>${locale === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2>${faq}</section>`,
    `<section class="section"><h2>${locale === 'es' ? 'Explora negocios locales de Salento' : 'Explore local Salento businesses'}</h2><div class="related-grid">${related}</div></section>`,
    `<section class="section"><p class="fin"><a class="btn primary" href="/${locale}/">${hub.cta}</a> <a class="btn" href="/${locale}/guias/">${locale === 'es' ? 'Ver todas las guías' : 'See all guides'}</a></p></section>`,
  ].join('')
  const pathName = `guias/${guide.slug}.html`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    description: c.description,
    inLanguage: locales[locale].language,
    mainEntityOfPage: `${domain}/${locale}/${pathName}`,
    publisher: {
      '@type': 'Organization',
      name: 'Salento a la Mano',
      url: domain,
      logo: { '@type': 'ImageObject', url: `${domain}/logo_salento2026.png` },
    },
    author: { '@type': 'Organization', name: 'Salento a la Mano' },
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
  fs.writeFileSync(
    path.join(dir, `${guide.slug}.html`),
    renderPage({ locale, pathName, title: c.title, description: c.description, body, jsonLd: [jsonLd, faqJsonLd] }),
    'utf8',
  )
}

function writeHub(locale) {
  const c = hubs[locale]
  const dir = path.join(publicDir, locale)
  fs.mkdirSync(dir, { recursive: true })
  const guideCards = guides
    .map(g => `<article class="guide-card"><h3>${escapeHtml(g.content[locale].title.split(':')[0].split('—')[0])}</h3><p>${escapeHtml(g.content[locale].intro)}</p><a class="btn primary" href="/${locale}/guias/${g.slug}.html">${c.cta}</a></article>`)
    .join('')
  const keywordsList = c.keywords.map(k => `<li>${escapeHtml(k)}</li>`).join('')
  const body = [
    `<section class="hero"><span class="eyebrow">Salento, Quindío, Colombia</span><h1>${escapeHtml(c.h1)}</h1><p>${escapeHtml(c.intro)}</p><a class="btn primary" href="/">${c.cta}</a> <a class="btn" href="/categorias/index.html">${c.ctaDir}</a></section>`,
    `<section class="section"><h2>${escapeHtml(c.guidesHeading)}</h2><div class="guide-grid">${guideCards}</div></section>`,
    `<section class="section"><h2>${escapeHtml(c.usefulHeading)}</h2><ul class="keywords">${keywordsList}</ul></section>`,
  ].join('')
  const pathName = ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Salento a la Mano',
    url: `${domain}/${locale}/`,
    inLanguage: locales[locale].language,
    publisher: { '@type': 'Organization', name: 'Salento a la Mano', url: domain },
  }
  fs.writeFileSync(path.join(dir, 'index.html'), renderPage({ locale, pathName, title: c.title, description: c.description, body, jsonLd }), 'utf8')
}

function buildSitemap() {
  const urlset = []
  function entry({ loc, lastmod = today, changefreq = 'weekly', priority = '0.8', alternates = [], image }) {
    let xml = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n`
    if (image) {
      xml += `    <image:image>\n      <image:loc>${image.loc}</image:loc>\n      <image:title>${image.title}</image:title>\n    </image:image>\n`
    }
    alternates.forEach(a => {
      xml += `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}" />\n`
    })
    xml += `  </url>\n`
    urlset.push(xml)
  }

  const localized = (pathName, priority) => {
    Object.entries(locales).forEach(([locale, data]) => {
      entry({
        loc: `${domain}/${locale}/${pathName}`,
        changefreq: 'monthly',
        priority,
        alternates: Object.entries(locales).map(([l, d]) => ({ lang: d.language, href: `${domain}/${l}/${pathName}` })),
      })
    })
  }

  entry({
    loc: `${domain}/`,
    changefreq: 'daily',
    priority: '1.0',
    image: { loc: `${domain}/imagenes-salento/1326163558.webp`, title: 'Salento a la Mano - Guía Turística Oficial 2026' },
  })

  const categories = ['categorias/index.html', 'categorias/alojamientos.html', 'categorias/coffee-tours.html', 'categorias/restaurantes.html', 'categorias/atractivos-turisticos.html']
  categories.forEach(c => entry({ loc: `${domain}/${c}`, changefreq: 'weekly', priority: '0.8' }))

  const landings = fs.readdirSync(path.join(publicDir, 'paginas-pautantes'), { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(publicDir, 'paginas-pautantes', d.name, 'index.html')))
    .map(d => d.name)
  landings.forEach(slug => entry({ loc: `${domain}/paginas-pautantes/${slug}/`, changefreq: 'weekly', priority: '0.8' }))

  const fichas = fs.readdirSync(path.join(publicDir, 'pautantes'))
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''))
  fichas.forEach(slug => entry({ loc: `${domain}/pautantes/${slug}.html`, changefreq: 'monthly', priority: '0.6' }))

  const defensivePages = fs.readdirSync(publicDir).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''))
  const defensive = ['estado-actual-salento-hoteles-abiertos-vias-libres-valle-cocora-operando-100', 'landing-estado-actual-salento-2026', 'valle-cocora-accesible-100', 'salento-seguro-turismo', 'hoteles-abiertos-salento', 'vias-salento-libres-acceso', 'mapa-interactivo-salento', 'registro-aliados', 'don-chucho-asistente']
  defensive.filter(p => defensivePages.includes(p)).forEach(p => entry({ loc: `${domain}/${p}`, changefreq: 'weekly', priority: '0.7' }))

  localized('', '0.7')
  guides.forEach(g => localized(`guias/${g.slug}.html`, '0.6'))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urlset.join('')}</urlset>\n`
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')
  console.log(`Sitemap: ${urlset.length} URLs (+${landings.length} landings, ${fichas.length} fichas).`)
}

for (const locale of Object.keys(locales)) {
  writeHub(locale)
  guides.forEach(guide => writeGuide(locale, guide))
}
buildSitemap()
console.log(`Guías generadas: ${Object.keys(locales).length} hubs + ${Object.keys(locales).length * guides.length} guías.`)