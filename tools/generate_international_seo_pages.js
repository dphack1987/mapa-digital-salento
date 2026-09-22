import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const domain = 'https://www.salentoalamano.com'

const locales = {
  es: {
    language: 'es-CO', title: 'Salento a la Mano | Guía turística de Salento, Quindío',
    description: 'Guía local de Salento, Quindío: alojamientos, restaurantes, cafés, experiencias y servicios con contacto directo.',
    intro: 'Encuentra alojamientos, sabores, experiencias y servicios locales en Salento, Quindío.',
    cta: 'Explorar el mapa',
  },
  en: {
    language: 'en', title: 'Salento, Colombia Travel Guide | Salento a la Mano',
    description: 'A practical local guide to Salento, Colombia with accommodation, food, coffee tours and direct contact with local businesses.',
    intro: 'Find places to stay, eat, explore and connect with local businesses in Salento, Colombia.',
    cta: 'Explore the map',
  },
  de: {
    language: 'de', title: 'Salento Kolumbien Reiseführer | Salento a la Mano',
    description: 'Lokaler Reiseführer für Salento in Kolumbien mit Unterkünften, Gastronomie, Kaffeetouren und direktem Kontakt.',
    intro: 'Entdecke Unterkünfte, regionale Küche, Naturerlebnisse und lokale Anbieter in Salento.',
    cta: 'Karte öffnen',
  },
  fr: {
    language: 'fr', title: 'Guide de voyage Salento Colombie | Salento a la Mano',
    description: 'Guide local de Salento en Colombie : hébergements, restaurants, café, expériences et contact direct.',
    intro: 'Trouvez où dormir, manger et découvrir Salento avec des informations locales et un contact direct.',
    cta: 'Ouvrir la carte',
  },
  pt: {
    language: 'pt-BR', title: 'Salento, Colômbia Guia de Viagem | Salento a la Mano',
    description: 'Guia local de Salento, Colômbia: hospedagem, gastronomia, coffee tours e contato direto com negócios locais.',
    intro: 'Encontre hospedagem, gastronomia, experiências e serviços locais em Salento, Colômbia.',
    cta: 'Explorar o mapa',
  },
  it: {
    language: 'it', title: 'Salento Colombia Guida di Viaggio | Salento a la Mano',
    description: 'Guida locale di Salento in Colombia: alloggi, ristoranti, coffee tour e contatto diretto con le attività locali.',
    intro: 'Trova dove dormire, mangiare e scoprire Salento con informazioni locali e contatto diretto.',
    cta: 'Apri mappa',
  },
}

const guides = [
  {
    slug: 'guia-valle-del-cocora',
    esTitle: 'Guía para visitar el Valle del Cocora',
    enTitle: 'A Practical Guide to Visiting Cocora Valley',
    deTitle: 'Ein praktischer Besucherführer für das Cocora-Tal',
    frTitle: 'Guide pratique pour visiter la vallée de Cocora',
    ptTitle: 'Guia Prático para Visitar o Vale do Cocora',
    itTitle: 'Guida Pratica per Visitare la Valle del Cocora',
    esIntro: 'Planifica una visita responsable al Valle del Cocora con información de acceso, transporte, clima y experiencias locales.',
    enIntro: 'Plan a responsible visit to Cocora Valley with practical information about access, transport, weather and local experiences.',
    deIntro: 'Planen Sie einen verantwortungsvollen Besuch im Cocora-Tal mit praktischen Informationen zu Zugang, Transport, Wetter und lokalen Erlebnissen.',
    frIntro: 'Planifiez une visite responsable de la vallée de Cocora avec des informations pratiques sur l\'accès, le transport, le météo et les expériences locales.',
    ptIntro: 'Planeje uma visita responsável ao Vale do Cocora com informações práticas sobre acesso, transporte, clima e experiências locais.',
    itIntro: 'Pianifica una visita responsabile alla Valle del Cocora con informazioni pratiche su accesso, trasporti, meteo ed esperienze locali.',
    sections: {
      es: [
        ['Antes de salir', 'Consulta el clima, confirma horarios y lleva ropa cómoda, impermeable, agua y calzado apropiado.'],
        ['Cómo organizar el día', 'Define primero el transporte y el tiempo disponible. Contacta directamente al operador de la experiencia antes de reservar.'],
        ['Conexión local', 'Consulta las fichas de transporte, guías, restaurantes y alojamientos de Salento para organizar el recorrido.'],
      ],
      en: [
        ['Before you leave', 'Check the weather, confirm schedules and bring comfortable clothes, a raincoat, water and appropriate footwear.'],
        ['How to organize the day', 'First define transportation and available time. Contact the experience operator directly before booking.'],
        ['Local connection', 'Check the listings for transportation, guides, restaurants and accommodation in Salento to organize your trip.'],
      ],
      de: [
        ['Vor der Abfahrt', 'Prüfen Sie das Wetter, bestätigen Sie die Zeitpläne und bringen Sie bequeme Kleidung, einen Regenmantel, Wasser und passendes Schuhwerk mit.'],
        ['Wie Sie den Tag organisieren', 'Definieren Sie zuerst den Transport und die verfügbare Zeit. Kontaktieren Sie den Erlebnisbetreiber direkt vor der Buchung.'],
        ['Lokale Verbindung', 'Schauen Sie sich die Einträge für Transport, Führungen, Restaurants und Unterkünfte in Salento an, um Ihren Ausflug zu planen.'],
      ],
      fr: [
        ['Avant de partir', 'Vérifiez la météo, confirmez les horaires et apportez des vêtements confortables, un imperméable, de l\'eau et des chaussures adaptées.'],
        ['Comment organiser la journée', 'Définissez d\'abord le transport et le temps disponible. Contactez l\'opérateur d\'expérience directement avant de réserver.'],
        ['Connexion locale', 'Consultez les fiches de transport, guides, restaurants et hébergements de Salento pour organiser votre parcours.'],
      ],
      pt: [
        ['Antes de sair', 'Consulte o clima, confirme os horários e leve roupas confortáveis, impermeável, água e calçado adequado.'],
        ['Como organizar o dia', 'Defina primeiro o transporte e o tempo disponível. Contate diretamente o operador da experiência antes de reservar.'],
        ['Conexão local', 'Consulte as fichas de transporte, guias, restaurantes e hospedagens de Salento para organizar o roteiro.'],
      ],
      it: [
        ['Prima di partire', 'Controlla il meteo, conferma gli orari e porta vestiti comodi, un impermeabile, acqua e calzature adeguate.'],
        ['Come organizzare la giornata', 'Definisci prima il trasporto e il tempo disponibile. Contatta direttamente l\'operatore dell\'esperienza prima di prenotare.'],
        ['Connessione locale', 'Consulta le schede di trasporto, guide, ristoranti e alloggi di Salento per organizzare il percorso.'],
      ],
    },
  },
  {
    slug: '10-tours-cafe-salento',
    esTitle: 'Tours de café en Salento: cómo elegir',
    enTitle: 'Coffee Tours in Salento: How to Choose',
    deTitle: 'Kaffeetouren in Salento: So wählen Sie die richtige',
    frTitle: 'Coffee tours à Salento : comment choisir',
    ptTitle: 'Coffee tours em Salento: como escolher',
    itTitle: 'Coffee tour a Salento: come scegliere',
    esIntro: 'Una guía para comparar experiencias cafeteras, duración, punto de encuentro, servicios y contacto directo.',
    enIntro: 'A guide to comparing coffee experiences, duration, meeting points, services and direct contact.',
    deIntro: 'Ein Leitfaden zum Vergleich von Kaffeeerlebnissen, Dauer, Treffpunkten, Dienstleistungen und direktem Kontakt.',
    frIntro: 'Un guide pour comparer les expériences de café, la durée, les points de rencontre, les services et le contact direct.',
    ptIntro: 'Um guia para comparar experiências de café, duração, pontos de encontro, serviços e contato direto.',
    itIntro: 'Una guida per confrontare le esperienze sul caffè, la durata, i punti di incontro, i servizi e il contatto diretto.',
    sections: {
      es: [
        ['Busca una experiencia clara', 'Revisa qué incluye el recorrido, cuánto dura y dónde comienza.'],
        ['Pregunta antes de reservar', 'Confirma disponibilidad, tarifa, idioma, transporte y condiciones de cancelación con el operador.'],
        ['Conoce el origen', 'Las fichas locales ayudan a descubrir fincas cafeteras y negocios que explican el proceso del café.'],
      ],
      en: [
        ['Look for a clear experience', 'Check what the tour includes, how long it lasts and where it starts.'],
        ['Ask before booking', 'Confirm availability, fare, language, transportation and cancellation conditions with the operator.'],
        ['Learn about the origin', 'Local listings help you discover coffee farms and businesses that explain the coffee process.'],
      ],
      de: [
        ['Suchen Sie ein klares Erlebnis', 'Prüfen Sie, was die Tour beinhaltet, wie lange sie dauert und wo sie beginnt.'],
        ['Fragen Sie vor der Buchung', 'Bestätigen Sie Verfügbarkeit, Tarif, Sprache, Transport und Stornobedingungen mit dem Betreiber.'],
        ['Lernen Sie den Ursprung kennen', 'Lokale Einträge helfen Ihnen, Kaffeefirmen und Unternehmen zu entdecken, die den Kaffeeprozess erklären.'],
      ],
      fr: [
        ['Cherchez une expérience claire', 'Vérifiez ce que comprend la visite, sa durée et son point de départ.'],
        ['Renseignez-vous avant de réserver', 'Confirmez la disponibilité, le tarif, la langue, le transport et les conditions d\'annulation avec l\'opérateur.'],
        ['Découvrez l\'origine', 'Les fiches locales vous aident à découvrir les fincas de café et les entreprises qui expliquent le processus du café.'],
      ],
      pt: [
        ['Busque uma experiência clara', 'Verifique o que o roteiro inclui, a duração e o local de partida.'],
        ['Pergunte antes de reservar', 'Confirme disponibilidade, tarifa, idioma, transporte e condições de cancelamento com o operador.'],
        ['Conheça a origem', 'As fichas locais ajudam a descobrir fazendas de café e negócios que explicam o processo do café.'],
      ],
      it: [
        ['Cerca un\'esperienza chiara', 'Controlla cosa include il tour, la durata e il punto di partenza.'],
        ['Chiedi prima di prenotare', 'Conferma disponibilità, tariffa, lingua, trasporto e condizioni di cancellazione con l\'operatore.'],
        ['Scopri l\'origine', 'Le schede locali ti aiutano a scoprire le fazende di caffè e le attività che spiegano il processo della lavorazione del caffè.'],
      ],
    },
  },
  {
    slug: 'que-hacer-en-salento-3-dias',
    esTitle: 'Qué hacer en Salento: itinerario de 3 días',
    enTitle: 'What to Do in Salento: A 3-Day Itinerary',
    deTitle: 'Was Sie in Salento tun können: Ein 3-Tage-Programm',
    frTitle: 'Que faire à Salento : un itinéraire de 3 jours',
    ptTitle: 'O que fazer em Salento: itinerário de 3 dias',
    itTitle: 'Cosa fare a Salento: itinerario di 3 giorni',
    esIntro: 'Una base flexible para combinar pueblo, café, naturaleza, gastronomía y compras locales.',
    enIntro: 'A flexible plan combining the town, coffee, nature, food and local shopping.',
    deIntro: 'Ein flexibler Plan, der Dorf, Kaffee, Natur, Essen und lokales Einkaufen kombiniert.',
    frIntro: 'Un plan flexible combinant le village, le café, la nature, la nourriture et le shopping local.',
    ptIntro: 'Um plano flexível combinando vila, café, natureza, comida e compras locais.',
    itIntro: 'Un piano flessibile che combina il paese, il caffè, la natura, il cibo e lo shopping locale.',
    sections: {
      es: [
        ['Día 1: pueblo y gastronomía', 'Recorre el centro, consulta restaurantes y cafés, y reserva tiempo para conocer productos locales.'],
        ['Día 2: naturaleza', 'Organiza una salida al Valle de Cocora o una experiencia cercana según clima, tiempo y dificultad.'],
        ['Día 3: café y compras', 'Visita una finca cafetera, conoce artesanías y contacta directamente los negocios que quieras visitar.'],
      ],
      en: [
        ['Day 1: town and food', 'Walk through the center, check out restaurants and cafes, and save time to discover local products.'],
        ['Day 2: nature', 'Plan a trip to Cocora Valley or a nearby experience depending on weather, time and difficulty.'],
        ['Day 3: coffee and shopping', 'Visit a coffee farm, discover crafts and contact the businesses you want to visit directly.'],
      ],
      de: [
        ['Tag 1: Dorf und Gastronomie', 'Erkunden Sie das Zentrum, schauen Sie sich Restaurants und Cafés an und nehmen Sie sich Zeit, um lokale Produkte zu entdecken.'],
        ['Tag 2: Natur', 'Organisieren Sie einen Ausflug ins Cocora-Tal oder ein Erlebnis in der Nähe je nach Wetter, Zeit und Schwierigkeitsgrad.'],
        ['Tag 3: Kaffee und Einkaufen', 'Besuchen Sie eine Kaffeefarm, entdecken Sie Handwerk und kontaktieren Sie direkt die Geschäfte, die Sie besuchen möchten.'],
      ],
      fr: [
        ['Jour 1 : village et gastronomie', 'Parcourez le centre, explorez les restaurants et cafés, et réservez du temps pour découvrir les produits locaux.'],
        ['Jour 2 : nature', 'Organisez une excursion dans la vallée de Cocora ou une expérience à proximité selon la météo, le temps et la difficulté.'],
        ['Jour 3 : café et shopping', 'Visitez une finca de café, découvrez l\'artisanat et contactez directement les commerces que vous souhaitez visiter.'],
      ],
      pt: [
        ['Dia 1: vila e gastronomia', 'Percorra o centro, consulte restaurantes e cafés, e reserve tempo para conhecer produtos locais.'],
        ['Dia 2: natureza', 'Organize uma excursão ao Vale do Cocora ou uma experiência próxima, conforme o clima, tempo e dificuldade.'],
        ['Dia 3: café e compras', 'Visite uma fazenda de café, conheça artesanatos e contate diretamente os negócios que deseja visitar.'],
      ],
      it: [
        ['Giorno 1: paese e gastronomia', 'Percorri il centro, dai un\'occhiata a ristoranti e caffè e riserva del tempo per scoprire i prodotti locali.'],
        ['Giorno 2: natura', 'Organizza un\'escursione nella Valle del Cocora o un\'esperienza vicina in base al meteo, al tempo disponibile e alla difficoltà.'],
        ['Giorno 3: caffè e shopping', 'Visita una fazenda di caffè, scopri l\'artigianato e contatta direttamente le attività che vuoi visitare.'],
      ],
    },
  },
  {
    slug: 'mejores-coffee-tours-salento',
    esTitle: 'Los mejores coffee tours en Salento: comparativa honesta',
    enTitle: 'Best Coffee Tours in Salento: An Honest Comparison',
    deTitle: 'Die besten Kaffeetouren in Salento: Ein ehrlicher Vergleich',
    frTitle: 'Les meilleurs coffee tours à Salento : une comparaison honnête',
    ptTitle: 'Melhores coffee tours em Salento: comparativo honesto',
    itTitle: 'Miglior coffee tour a Salento: confronto onesto',
    esIntro: 'Comparamos las fincas cafeteras verificadas de Salento con datos reales: duración, idiomas, precios de referencia y contacto directo sin intermediarios.',
    enIntro: 'We compare verified coffee farms in Salento with real data: duration, languages, reference prices and direct contact with no middlemen.',
    deIntro: 'Wir vergleichen verifizierte Kaffeefarmen in Salento mit echten Daten: Dauer, Sprachen, Referenzpreise und direkter Kontakt ohne Vermittler.',
    frIntro: 'Nous comparons les fincas de café vérifiées à Salento avec des données réelles : durée, langues, prix de référence et contact direct sans intermédiaires.',
    ptIntro: 'Comparamos as fazendas de café verificadas de Salento com dados reais: duração, idiomas, preços de referência e contato direto, sem intermediários.',
    itIntro: 'Confrontiamo le fazende di caffè verificate a Salento con dati reali: durata, lingue, prezzi di riferimento e contatto diretto senza intermediari.',
    sections: {
      es: [
        ['Cómo comparar un coffee tour', 'Revisa duración, idiomas, punto de encuentro, qué incluye y si el precio es por persona. Todas las fincas verificadas permiten contacto directo por WhatsApp, sin intermediarios ni comisiones.'],
        ['Fincas verificadas en Salento', 'Finca Don Eduardo (3 horas, tours en inglés y español, a 8 minutos caminando de la plaza principal, rango $$$ con tour en inglés de $100.000 COP por persona) · Finca Cafetera Don Elías (rango $$, consultar tarifas actuales) · El Recuerdo Coffee Tour (rango $$, reserva previa por WhatsApp).'],
        ['Antes de reservar', 'Confirma disponibilidad, tarifa vigente, idioma del tour, punto de encuentro y política de cancelación directamente con la finca.'],
      ],
      en: [
        ['How to compare a coffee tour', 'Check duration, languages, meeting point, what is included and whether the price is per person. Every verified farm offers direct WhatsApp contact with no middlemen or commissions.'],
        ['Verified farms in Salento', 'Finca Don Eduardo (3 hours, tours in English and Spanish, an 8-minute walk from the main square, $$$ range with the English tour at $100,000 COP per person) · Finca Cafetera Don Elías ($$ range, ask for current rates) · El Recuerdo Coffee Tour ($$ range, advance booking via WhatsApp).'],
        ['Before booking', 'Confirm availability, current rates, tour language, meeting point and cancellation policy directly with the farm.'],
      ],
      de: [
        ['So vergleichen Sie eine Kaffeetour', 'Prüfen Sie Dauer, Sprachen, Treffpunkt, was inklusive ist und ob der Preis pro Person ist. Jede verifizierte Farm bietet direkten WhatsApp-Kontakt ohne Vermittler oder Provisionen.'],
        ['Verifizierte Farmen in Salento', 'Finca Don Eduardo (3 Stunden, Touren auf Englisch und Spanisch, 8 Gehminuten vom Hauptplatz, $$$-Bereich mit englischer Tour für $100.000 COP pro Person) · Finca Cafetera Don Elías ($$-Bereich, aktuelle Tarife erfragen) · El Recuerdo Coffee Tour ($$-Bereich, Vorab-Buchung per WhatsApp).'],
        ['Vor der Buchung', 'Bestätigen Sie Verfügbarkeit, aktuelle Tarife, Tour-Sprache, Treffpunkt und Stornierungsbedingungen direkt bei der Farm.'],
      ],
      fr: [
        ['Comment comparer un coffee tour', 'Vérifiez la durée, les langues, le point de rencontre, ce qui est inclus et si le prix est par personne. Chaque finca vérifiée offre un contact WhatsApp direct sans intermédiaires ni commissions.'],
        ['Fincas vérifiées à Salento', 'Finca Don Eduardo (3 heures, visites en anglais et espagnol, à 8 minutes à pied de la place principale, gamme $$$ avec visite en anglais à $100.000 COP par personne) · Finca Cafetera Don Elías (gamme $$, demandez les tarifs actuels) · El Recuerdo Coffee Tour (gamme $$, réservation à l\'avance par WhatsApp).'],
        ['Avant de réserver', 'Confirmez la disponibilité, les tarifs actuels, la langue de la visite, le point de rencontre et la politique d\'annulation directement avec la finca.'],
      ],
      pt: [
        ['Como comparar um coffee tour', 'Verifique duração, idiomas, ponto de encontro, o que está incluído e se o preço é por pessoa. Todas as fazendas verificadas oferecem contato direto por WhatsApp, sem intermediários nem comissões.'],
        ['Fazendas verificadas em Salento', 'Finca Don Eduardo (3 horas, tours em inglês e espanhol, a 8 minutos a pé da praça principal, faixa $$$ com tour em inglês por $100.000 COP por pessoa) · Finca Cafetera Don Elías (faixa $$, consulte os preços atuais) · El Recuerdo Coffee Tour (faixa $$, reserva antecipada por WhatsApp).'],
        ['Antes de reservar', 'Confirme disponibilidade, preços vigentes, idioma do tour, ponto de encontro e política de cancelamento diretamente com a fazenda.'],
      ],
      it: [
        ['Come confrontare un coffee tour', 'Controlla durata, lingue, punto d\'incontro, cosa è incluso e se il prezzo è a persona. Ogni fazenda verificata offre contatto diretto via WhatsApp senza intermediari o commissioni.'],
        ['Fazende verificate a Salento', 'Finca Don Eduardo (3 ore, tour in inglese e spagnolo, a 8 minuti a piedi dalla piazza principale, fascia $$$ con tour in inglese a $100.000 COP a persona) · Finca Cafetera Don Elías (fascia $$, chiedi le tariffe attuali) · El Recuerdo Coffee Tour (fascia $$, prenotazione anticipata via WhatsApp).'],
        ['Prima di prenotare', 'Conferma disponibilità, tariffe attuali, lingua del tour, punto d\'incontro e politica di cancellazione direttamente con la fazenda.'],
      ],
    },
  },
  {
    slug: 'experiencia-salento-llegada-a-salida',
    esTitle: 'Salento de llegada a salida: tu experiencia completa',
    enTitle: 'Salento from Arrival to Departure: Your Complete Experience',
    deTitle: 'Salento von Ankunft bis Abfahrt: Ihr vollständiges Erlebnis',
    frTitle: 'Salento de l\'arrivée au départ : votre expérience complète',
    ptTitle: 'Salento da chegada à partida: sua experiência completa',
    itTitle: 'Salento dall\'arrivo alla partenza: la tua esperienza completa',
    esIntro: 'Del terminal a la despedida: cómo vivir Salento con transporte, hospedaje, Cocora, café y gastronomía verificados, en trato directo.',
    enIntro: 'From the bus terminal to farewell: how to experience Salento with verified transport, stays, Cocora, coffee and food, booked direct.',
    deIntro: 'Vom Busbahnhof bis zum Abschied: So erleben Sie Salento mit verifiziertem Transport, Unterkünften, Cocora, Kaffee und Essen — direkt gebucht.',
    frIntro: 'Du terminal de bus aux adieux : comment vivre Salento avec un transport, des hébergements, Cocora, café et nourriture vérifiés, réservés directement.',
    ptIntro: 'Da rodoviária à despedida: como viver Salento com transporte, hospedagem, Cocora, café e gastronomia verificados, em contato direto.',
    itIntro: 'Dalla stazione dei bus all\'addio: come vivere Salento con trasporto, alloggi, Cocora, caffè e cibo verificati, prenotati direttamente.',
    sections: {
      es: [
        ['La llegada', 'Llega al Terminal de Transporte de Salento y ubica la plaza principal: allí está el Terminal de Transporte Público Jeep Willys, punto de partida al Valle de Cocora.'],
        ['El check-in', 'Hoteles verificados como Hotel Camino Nacional y Hotel La Floresta (desde $124.000 COP/noche) reciben con contacto directo por WhatsApp.'],
        ['Los días: Cocora y café', 'Dedica un día al Valle de Cocora con Cootracocora (salidas diarias 6:00 AM – 9:00 PM, tarifa de referencia desde $3.600 COP) y otro a un coffee tour verificado como Finca Don Eduardo (3 horas, en inglés y español). Cierra con trucha en Fonda Boquía (11 preparaciones, $28.000–$46.000).'],
        ['La despedida', 'Coordina tu regreso desde la plaza con la cooperativa y confirma horarios de salida directamente por WhatsApp. Tu dinero se queda en Salento.'],
      ],
      en: [
        ['Arrival', 'Arrive at the Salento Transport Terminal and head to the main square: the Willys Jeep Public Transport Terminal, gateway to Cocora Valley, is there.'],
        ['Check-in', 'Verified hotels such as Hotel Camino Nacional and Hotel La Floresta (from $124,000 COP/night) welcome you with direct WhatsApp contact.'],
        ['The days: Cocora and coffee', 'Spend one day in Cocora Valley with Cootracocora (daily departures 6:00 AM – 9:00 PM, reference fare from $3,600 COP) and another on a verified coffee tour like Finca Don Eduardo (3 hours, in English and Spanish). Finish with trout at Fonda Boquía (11 preparations, $28,000–$46,000).'],
        ['Farewell', 'Arrange your return from the square with the cooperative and confirm departure times directly via WhatsApp. Your money stays in Salento.'],
      ],
      de: [
        ['Ankunft', 'Kommen Sie am Salento-Transportterminal an und begeben Sie sich zum Hauptplatz: Dort befindet sich das Willys-Jeep-Öffentlicher-Transport-Terminal, der Eingang zum Cocora-Tal.'],
        ['Check-in', 'Verifizierte Hotels wie Hotel Camino Nacional und Hotel La Floresta (ab $124.000 COP/Nacht) empfangen Sie mit direktem WhatsApp-Kontakt.'],
        ['Die Tage: Cocora und Kaffee', 'Verbringen Sie einen Tag im Cocora-Tal mit Cootracocora (tägliche Abfahrten 6:00 – 21:00 Uhr, Referenztarif ab $3.600 COP) und einen weiteren auf einer verifizierten Kaffeetour wie Finca Don Eduardo (3 Stunden, auf Englisch und Spanisch). Schließen Sie mit Forelle in Fonda Boquía ab (11 Zubereitungen, $28.000–$46.000).'],
        ['Abschied', 'Organisieren Sie Ihre Rückkehr vom Platz mit der Genossenschaft und bestätigen Sie die Abfahrtszeiten direkt per WhatsApp. Ihr Geld bleibt in Salento.'],
      ],
      fr: [
        ['Arrivée', 'Arrivez au terminal de transport de Salento et rendez-vous sur la place principale : le terminal de transport public Willys Jeep, point de départ pour la vallée de Cocora, s\'y trouve.'],
        ['Check-in', 'Des hébergements vérifiés comme l\'Hôtel Camino Nacional et l\'Hôtel La Floresta (à partir de $124.000 COP/nuit) vous accueillent avec un contact WhatsApp direct.'],
        ['Les jours : Cocora et café', 'Passez un jour dans la vallée de Cocora avec Cootracocora (départs quotidiens 6h00 – 21h00, tarif de référence à partir de $3.600 COP) et un autre sur un coffee tour vérifié comme la Finca Don Eduardo (3 heures, en anglais et en espagnol). Terminez par la truite à la Fonda Boquía (11 préparations, $28.000–$46.000).'],
        ['Les adieux', 'Organisez votre retour depuis la place avec la coopérative et confirmez les horaires de départ directement par WhatsApp. Votre argent reste à Salento.'],
      ],
      pt: [
        ['A chegada', 'Chegue à Rodoviária de Salento e vá até a praça principal: lá fica o Terminal de Transporte Público Jeep Willys, porta de entrada do Vale do Cocora.'],
        ['O check-in', 'Hotéis verificados como Hotel Camino Nacional e Hotel La Floresta (desde $124.000 COP/noite), recebem com contato direto por WhatsApp.'],
        ['Os dias: Cocora e café', 'Dedique um dia ao Vale do Cocora com a Cootracocora (saídas diárias 6:00 – 21:00, tarifa de referência desde $3.600 COP) e outro a um coffee tour verificado como a Finca Don Eduardo (3 horas, em inglês e espanhol). Feche com truta na Fonda Boquía (11 preparos, $28.000–$46.000).'],
        ['A despedida', 'Combine seu retorno desde a praça com a cooperativa e confirme os horários diretamente por WhatsApp. Seu dinheiro fica em Salento.'],
      ],
      it: [
        ['Arrivo', 'Arriva al terminal dei trasporti di Salento e dirigiti alla piazza principale: lì si trova il terminal dei trasporti pubblici Willys Jeep, punto di partenza per la Valle del Cocora.'],
        ['Check-in', 'Alloggi verificati come Hotel Camino Nacional e Hotel La Floresta (da $124.000 COP/notte) ti accolgono con contatto diretto via WhatsApp.'],
        ['I giorni: Cocora e caffè', 'Dedica un giorno alla Valle del Cocora con Cootracocora (partenze giornaliere 6:00 – 21:00, tariffa di riferimento da $3.600 COP) e un altro a un coffee tour verificato come Finca Don Eduardo (3 ore, in inglese e spagnolo). Chiudi con la trota alla Fonda Boquía (11 preparazioni, $28.000–$46.000).'],
        ['L\'addio', 'Organizza il tuo ritorno dalla piazza con la cooperativa e conferma gli orari di partenza direttamente via WhatsApp. I tuoi soldi restano a Salento.'],
      ],
    },
  },
  {
    slug: 'como-llegar-valle-cocora-sin-tour',
    esTitle: 'Cómo llegar al Valle de Cocora sin tour: guía por tu cuenta',
    enTitle: 'How to Get to Cocora Valley Without a Tour: Independent Guide',
    deTitle: 'So gelangen Sie ohne Tour ins Cocora-Tal: Unabhängiger Leitfaden',
    frTitle: 'Comment aller à la vallée de Cocora sans visite guidée : guide indépendant',
    ptTitle: 'Como chegar ao Vale do Cocora sem excursão: guia por conta própria',
    itTitle: 'Come arrivare alla Valle del Cocora senza tour: guida indipendente',
    esIntro: 'Llega al Valle de Cocora por tu cuenta en jeep Willys compartido desde la plaza de Salento, con tarifa de referencia, horarios y punto de encuentro verificados.',
    enIntro: 'Reach Cocora Valley on your own by shared Willys jeep from Salento main square, with verified reference fares, schedules and meeting point.',
    deIntro: 'Erreichen Sie das Cocora-Tal auf eigene Faust mit einem gemeinsamen Willys-Jeep vom Hauptplatz von Salento, mit verifizierten Referenztarifen, Zeitplänen und Treffpunkt.',
    frIntro: 'Atteignez la vallée de Cocora par vous-même en Willys jeep partagée depuis la place principale de Salento, avec des tarifs de référence, horaires et point de rencontre vérifiés.',
    ptIntro: 'Chegue ao Vale do Cocora por conta própria de jipe Willys compartilhado desde a praça de Salento, com tarifa de referência, horários e ponto de encontro verificados.',
    itIntro: 'Raggiungi la Valle del Cocora autonomamente in Willys jeep condivisa dalla piazza principale di Salento, con tariffe di riferimento, orari e punto d\'incontro verificati.',
    sections: {
      es: [
        ['El transporte público al Cocora', 'La cooperativa Cootracocora opera jeeps Willys tradicionales Salento – Valle de Cocora con salidas diarias de 6:00 AM a 9:00 PM desde la plaza principal. Tarifa de referencia desde $3.600 COP por trayecto; confirma la tarifa vigente por WhatsApp.'],
        ['Cómo funciona el cupo', 'Las salidas son al completar cupo desde el Terminal de Transporte Público Jeep Willys en la plaza principal. Llega con anticipación en temporada alta.'],
        ['El regreso', 'Los jeeps regresan del Valle a Salento en la misma modalidad. Coordina el horario de vuelta directamente con la cooperativa, sin intermediarios.'],
      ],
      en: [
        ['Public transport to Cocora', 'The Cootracocora cooperative runs traditional Willys jeeps Salento – Cocora Valley with daily departures from 6:00 AM to 9:00 PM from the main square. Reference fare from $3,600 COP per ride; confirm the current fare via WhatsApp.'],
        ['How seating works', 'Jeeps leave once full from the Willys Jeep Public Transport Terminal on the main square. Arrive early in high season.'],
        ['The way back', 'Jeeps return from the Valley to Salento the same way. Arrange your return time directly with the cooperative, with no middlemen.'],
      ],
      de: [
        ['Öffentlicher Transport zum Cocora', 'Die Genossenschaft Cootracocora betreibt traditionelle Willys-Jeeps Salento – Cocora-Tal mit täglichen Abfahrten von 6:00 bis 21:00 Uhr vom Hauptplatz. Referenztarif ab $3.600 COP pro Fahrt; bestätigen Sie den aktuellen Tarif per WhatsApp.'],
        ['So funktioniert die Platzvergabe', 'Jeeps fahren ab, sobald sie voll sind, vom Willys-Jeep-Öffentlicher-Transport-Terminal auf dem Hauptplatz. Kommen Sie in der Hochsaison frühzeitig.'],
        ['Die Rückfahrt', 'Jeeps kehren auf demselben Weg vom Tal nach Salento zurück. Organisieren Sie Ihre Rückfahrzeit direkt mit der Genossenschaft, ohne Vermittler.'],
      ],
      fr: [
        ['Transport public vers Cocora', 'La coopérative Cootracocora exploite des Willys jeeps traditionnels Salento – vallée de Cocora avec des départs quotidiens de 6h00 à 21h00 depuis la place principale. Tarif de référence à partir de $3.600 COP par trajet ; confirmez le tarif actuel par WhatsApp.'],
        ['Comment fonctionne les places', 'Les jeeps partent une fois pleines depuis le terminal de transport public Willys Jeep sur la place principale. Arrivez tôt en haute saison.'],
        ['Le retour', 'Les jeeps reviennent de la vallée à Salento de la même manière. Organisez votre heure de retour directement avec la coopérative, sans intermédiaires.'],
      ],
      pt: [
        ['Transporte público para o Cocora', 'A cooperativa Cootracocora opera jipes Willys tradicionais Salento – Vale do Cocora com saídas diárias das 6:00 às 21:00 desde a praça principal. Tarifa de referência a partir de $3.600 COP por trecho; confirme a tarifa vigente por WhatsApp.'],
        ['Como funciona a lotação', 'Os jipes saem ao completar a lotação no Terminal de Transporte Público Jeep Willys, na praça principal. Chegue com antecedência na alta temporada.'],
        ['A volta', 'Os jipes retornam do Vale para Salento no mesmo esquema. Combine o horário de volta diretamente com a cooperativa, sem intermediários.'],
      ],
      it: [
        ['Trasporto pubblico per il Cocora', 'La cooperativa Cootracocora opera Willys jeep tradizionali Salento – Valle del Cocora con partenze giornaliere dalle 6:00 alle 21:00 dalla piazza principale. Tariffa di riferimento da $3.600 COP a tratta; conferma la tariffa attuale via WhatsApp.'],
        ['Come funziona la posti', 'I jeep partono una volta pieni dal terminal dei trasporti pubblici Willys Jeep sulla piazza principale. Arriva con anticipo in alta stagione.'],
        ['Il ritorno', 'I jeep tornano dalla valle a Salento nello stesso modo. Organizza il tuo orario di ritorno direttamente con la cooperativa, senza intermediari.'],
      ],
    },
  },
]

const keywords = {
  es: ['mejores fincas cafeteras con trato directo en Salento', 'hotel familiar cerca de la plaza de Salento', 'restaurantes con comida local en Salento Quindío', 'transporte al Valle de Cocora desde Salento', 'qué hacer en Salento en tres días', 'mejores coffee tours en Salento con reserva directa', 'cómo llegar al Valle de Cocora sin tour desde Salento'],
  en: ['best coffee farms with direct booking in Salento Colombia', 'family-friendly hotel near Salento main square', 'best local restaurants in Salento Quindio', 'how to get to Cocora Valley from Salento', 'things to do in Salento Colombia in 3 days', 'best coffee tours in Salento Colombia with direct booking', 'how to get to Cocora Valley from Salento without a tour'],
  de: ['beste Kaffeefincas mit direkter Buchung in Salento Kolumbien', 'familienfreundliches Hotel nahe dem Hauptplatz von Salento', 'regionale Restaurants in Salento Quindío Kolumbien', 'Anreise zum Cocora-Tal ab Salento Kolumbien', 'Salento Kolumbien in drei Tagen erleben', 'beste Kaffeetouren in Salento mit direkter Buchung', 'wie man ohne Tour ins Cocora-Tal nach Salento kommt'],
  fr: ['meilleures fincas de café avec réservation directe à Salento', 'hôtel familial près de la place principale de Salento', 'restaurants locaux à Salento Quindío Colombie', 'comment aller de Salento à la vallée de Cocora', 'que faire à Salento Colombie en trois jours', 'meilleurs coffee tours à Salento avec réservation directe', 'comment aller à la vallée de Cocora sans visite guidée depuis Salento'],
  pt: ['melhores coffee tours em Salento Colômbia', 'como chegar ao Vale do Cocora saindo de Salento', 'onde ficar em Salento perto da praça principal', 'o que fazer em Salento em 3 dias', 'restaurantes com comida típica em Salento Quindío', 'melhores fazendas de café com reserva direta em Salento', 'como chegar ao Vale do Cocora sem excursão saindo de Salento'],
  it: ['migliori fazende di caffè con prenotazione diretta a Salento Colombia', 'hotel familiare vicino alla piazza principale di Salento', 'ristoranti locali a Salento Quindío Colombia', 'come arrivare alla Valle del Cocora da Salento', 'cosa fare a Salento Colombia in 3 giorni', 'miglior coffee tour a Salento con prenotazione diretta', 'come arrivare alla Valle del Cocora senza tour da Salento'],
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function hreflang(pathname) {
  return Object.entries(locales).map(([locale, data]) => `<link rel="alternate" hreflang="${data.language}" href="${domain}/${locale}/${pathname}" />`).join('\n    ')
}

function shell(locale, pathname, title, description, content) {
  const data = locales[locale]
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${domain}/${locale}/${pathname}">${hreflang(pathname)}<link rel="alternate" hreflang="x-default" href="${domain}/es/${pathname}"><link rel="stylesheet" href="/page-theme.css"><style>main{max-width:1184px;margin:auto;padding:28px 20px 80px}.site-head{display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:1px solid var(--line);padding-bottom:20px;margin-bottom:55px}.brand{display:inline-flex;align-items:center;gap:10px;font-weight:700}.brand-logo{width:42px;height:42px}.locale-nav{display:flex;gap:8px;flex-wrap:wrap}.locale-nav a{padding:9px 11px;border:1px solid var(--line);border-radius:4px;font:11px 'DM Mono'}.hero{max-width:760px;border-left:3px solid var(--coral);padding-left:24px}.eyebrow{font:11px 'DM Mono';text-transform:uppercase;color:var(--coral);letter-spacing:.1em}.hero h1{font-size:clamp(2.5rem,6vw,5rem);line-height:.98;margin:14px 0}.hero p{color:#697568;line-height:1.7}.section{margin-top:55px;padding-top:28px;border-top:1px solid var(--line)}.section h2{font-size:2rem}.guide-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.guide-card{border:1px solid var(--line);padding:18px;background:#fff}.guide-card h3{margin-top:0}.guide-card p{color:#697568;line-height:1.55;font-size:13px}@media(max-width:700px){main{padding:20px 16px 55px}.site-head{align-items:flex-start;flex-direction:column;margin-bottom:35px}.guide-grid{grid-template-columns:1fr}.hero{padding-left:16px}}</style></head><body><main><header class="site-head"><a class="brand" href="/${locale}/"><img class="brand-logo" src="/logo_salento2026.webp" alt="Salento a la Mano"><span>Salento a la Mano</span></a><nav class="locale-nav">${Object.keys(locales).map(l => `<a href="/${l}/${pathname}">${l.toUpperCase()}</a>`).join('')}</nav></header>${content}</main></body></html>`
}

const UI = {
  es: { guides: 'Guías para planificar tu visita', searches: 'Búsquedas útiles', localGuide: 'Guía local', explore: 'Explora negocios locales', exploreText: 'Consulta el directorio y contacta directamente a los establecimientos registrados.' },
  en: { guides: 'Guides to plan your visit', searches: 'Useful searches', localGuide: 'Local guide', explore: 'Explore local businesses', exploreText: 'Browse the directory and contact registered businesses directly.' },
  de: { guides: 'Reiseführer für Ihren Besuch', searches: 'Nützliche Suchen', localGuide: 'Lokaler Führer', explore: 'Lokale Geschäfte entdecken', exploreText: 'Durchstöbern Sie das Verzeichnis und kontaktieren Sie registrierte Unternehmen direkt.' },
  fr: { guides: 'Guides pour planifier votre visite', searches: 'Recherches utiles', localGuide: 'Guide local', explore: 'Découvrir les commerces locaux', exploreText: 'Parcourez l\'annuaire et contactez directement les commerces enregistrés.' },
  pt: { guides: 'Guias para planejar sua visita', searches: 'Buscas úteis', localGuide: 'Guia local', explore: 'Explore negócios locais', exploreText: 'Consulte o diretório e fale diretamente com os estabelecimentos registrados.' },
  it: { guides: 'Guide per pianificare la tua visita', searches: 'Ricerche utili', localGuide: 'Guida locale', explore: 'Esplora attività locali', exploreText: 'Sfoglia l\'elenco e contatta direttamente le attività registrate.' },
}

function pickTitle(guide, locale) {
  return guide[`${locale}Title`] || guide.enTitle
}

function pickIntro(guide, locale) {
  return guide[`${locale}Intro`] || guide.enIntro
}

function pickSections(guide, locale) {
  if (guide.sections && !Array.isArray(guide.sections)) {
    return guide.sections[locale] || guide.sections.en || []
  }
  return guide.sections || []
}

for (const [locale, data] of Object.entries(locales)) {
  const ui = UI[locale] || UI.en
  const dir = path.join(publicDir, locale)
  fs.mkdirSync(dir, { recursive: true })
  const guideCards = guides.map(guide => `<article class="guide-card"><h3>${escapeHtml(pickTitle(guide, locale))}</h3><p>${escapeHtml(pickIntro(guide, locale))}</p><a class="btn primary" href="/${locale}/guias/${guide.slug}.html">${data.cta}</a></article>`).join('')
  const keywordsList = keywords[locale].map(keyword => `<li>${escapeHtml(keyword)}</li>`).join('')
  const content = `<section class="hero"><span class="eyebrow">Salento, Quindío, Colombia</span><h1>${escapeHtml(data.title.split(' | ')[0])}</h1><p>${escapeHtml(data.intro)}</p><a class="btn primary" href="/">${data.cta}</a></section><section class="section"><h2>${ui.guides}</h2><div class="guide-grid">${guideCards}</div></section><section class="section"><h2>${ui.searches}</h2><ul>${keywordsList}</ul></section>`
  fs.writeFileSync(path.join(dir, 'index.html'), shell(locale, '', data.title, data.description, content), 'utf8')
  const guideDir = path.join(dir, 'guias')
  fs.mkdirSync(guideDir, { recursive: true })
  for (const guide of guides) {
    const guideTitle = pickTitle(guide, locale)
    const guideSeoTitle = `${guideTitle} | ${locale.toUpperCase()}`
    const guideIntro = pickIntro(guide, locale)
    const sectionHtml = pickSections(guide, locale).map(([heading, text]) => `<div class="section"><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></div>`).join('')
    const guideContent = `<section class="hero"><span class="eyebrow">${ui.localGuide}</span><h1>${escapeHtml(guideTitle)}</h1><p>${escapeHtml(guideIntro)}</p></section>${sectionHtml}<section class="section"><h2>${ui.explore}</h2><p>${ui.exploreText}</p><a class="btn primary" href="/categorias/index.html">${data.cta}</a></section>`
    fs.writeFileSync(path.join(guideDir, `${guide.slug}.html`), shell(locale, `guias/${guide.slug}.html`, guideSeoTitle, guideIntro, guideContent), 'utf8')
  }
}

const sitemapPath = path.join(publicDir, 'sitemap.xml')
let sitemap = fs.readFileSync(sitemapPath, 'utf8')
const urls = []
for (const locale of Object.keys(locales)) {
  urls.push(`/${locale}/`)
  guides.forEach(guide => urls.push(`/${locale}/guias/${guide.slug}.html`))
}
const entries = urls.filter(url => !sitemap.includes(`${domain}${url}`)).map(url => `  <url><loc>${domain}${url}</loc><lastmod>2026-09-16</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n')
if (entries) sitemap = sitemap.replace('</urlset>', `${entries}\n</urlset>`)
fs.writeFileSync(sitemapPath, sitemap, 'utf8')
console.log(`Generadas ${Object.keys(locales).length} entradas de idioma y ${guides.length * Object.keys(locales).length} guías editoriales.`)
console.log(`Keywords long-tail nativas registradas: ${Object.values(keywords).flat().length}.`)
