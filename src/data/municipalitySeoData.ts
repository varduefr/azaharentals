export type MunicipalitySlug =
  | 'peniscola'
  | 'vinaros'
  | 'benicarlo'
  | 'oropesa-del-mar'
  | 'benicassim'
  | 'alcossebre';

export interface MunicipalitySeoProfile {
  slug: MunicipalitySlug;
  name: string;
  locationDataId: string;
  marketStatsId: string;
  townAliases: string[];
  heroImage: string;
  apartmentsSeo: {
    title: string;
    description: string;
    canonicalPath: string;
    image: string;
    badge: string;
    h1: string;
    subtitle: string;
    zonesHighlight: string[];
    localGuideTitle: string;
    localGuideText: string;
    emptyStateTitle: string;
    emptyStateDescription: string;
  };
  laundrySeo: {
    title: string;
    description: string;
    canonicalPath: string;
    image: string;
    badge: string;
    h1: string;
    subtitle: string;
    heroImageCaption: string;
    sectorsHighlight: string;
    logisticsText: string;
    localZones: string[];
    localFaqAnswer: string;
  };
  simulatorSeo: {
    title: string;
    description: string;
    canonicalPath: string;
    image: string;
    badge: string;
    h1: string;
    subtitle: string;
    localHighlight: string;
  };
}

const BASE_DOMAIN = 'https://www.azaharentals.com';

export function normalizeSlugText(value: string): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/gi, 'n')
    .toLowerCase()
    .trim();
}

export const MUNICIPALITY_PROFILES: Record<MunicipalitySlug, MunicipalitySeoProfile> = {
  peniscola: {
    slug: 'peniscola',
    name: 'Peñíscola',
    locationDataId: 'peniscola',
    marketStatsId: 'peniscola',
    townAliases: ['peniscola', 'peñiscola', 'peñíscola'],
    heroImage: '/images/peniscola_balcon_terraza_1788561222890.jpg',
    apartmentsSeo: {
      title: 'Apartamentos Turísticos en Peñíscola | Alquiler Vacacional VT | Azahar Rentals',
      description:
        'Reserva apartamentos turísticos en Peñíscola en primera línea de Playa Norte y vistas al Castillo Papa Luna. Licencias oficiales VT, check-in 24/7 y limpieza hotelera.',
      canonicalPath: '/apartamentos-turisticos-peniscola',
      image: `${BASE_DOMAIN}/images/peniscola_balcon_terraza_1788561222890.jpg`,
      badge: 'Alquiler Vacacional Verificado en Peñíscola',
      h1: 'Apartamentos Turísticos y Vacacionales en Peñíscola',
      subtitle:
        'Alojamientos turísticos seleccionados en Playa Norte, Casco Antiguo y Playa Sur con vistas al Castillo del Papa Luna, licencia oficial VT de la Generalitat Valenciana, check-in 24/7 y lencería de hotel.',
      zonesHighlight: [
        'Playa Norte y Avenida Papa Luna (primera línea)',
        'Entorno del Castillo Templario y Casco Antiguo',
        'Playa Sur y Puerto Pesquero de Peñíscola',
        'Las Atalayas, Cerro Mar y Parque Natural Sierra de Irta',
      ],
      localGuideTitle: 'Por qué elegir nuestros apartamentos turísticos en Peñíscola',
      localGuideText:
        'Peñíscola es el destino vacacional líder del norte de Castellón, con 5 km de playa de arena fina galardonada con Bandera Azul y acceso directo al casco histórico medieval. Nuestros apartamentos en Peñíscola cuentan con climatización, Wifi 600Mb, parking privado y asistencia local presencial durante toda tu estancia.',
      emptyStateTitle: 'Apartamentos verificados en Peñíscola bajo demanda',
      emptyStateDescription:
        'Actualmente nuestras unidades en Peñíscola están en rotación de temporada. Consúltanos por WhatsApp para fechas disponibles en Playa Norte, Playa Sur y Avenida Papa Luna.',
    },
    laundrySeo: {
      title: 'Lavandería Industrial en Peñíscola | Hoteles, Pisos Turísticos y Clínicas | Azahar',
      description:
        'Servicio B2B de lavandería industrial en Peñíscola con recogida y entrega 24/48h en Playa Norte, Av. Papa Luna y Casco Antiguo. Sábanas, toallas, batas y uniformes.',
      canonicalPath: '/lavanderia-industrial-peniscola',
      image: `${BASE_DOMAIN}/images/industrial_laundry.jpg`,
      badge: 'Servicio B2B en Peñíscola · Rutas Diarias',
      h1: 'Lavandería Industrial en Peñíscola para Hoteles, Pisos Turísticos, Gimnasios y Clínicas',
      subtitle:
        'Cobertura logística diaria en Peñíscola (Avenida Papa Luna, Playa Norte, Playa Sur y Casco Antiguo) con lavado desinfectante, secado envolvente y planchado calandra para sábanas, toallas, batas y uniformes de hostelería.',
      heroImageCaption:
        'Servicio activo en Peñíscola: Avenida Papa Luna, Playa Norte, Playa Sur, Las Atalayas y centro urbano.',
      sectorsHighlight:
        'Especialistas en la alta rotación estival de hoteles de playa, apartamentos turísticos VT en Avenida Papa Luna, restaurantes del casco antiguo, gimnasios y clínicas privadas de Peñíscola.',
      logisticsText:
        'Rutas diarias programadas en Peñíscola con recogida y entrega puerta a puerta en Avenida Papa Luna, Playa Norte, Playa Sur, Peñismar y Las Atalayas. Entrega en 24/48h o express de cambio de check-in.',
      localZones: [
        'Avenida Papa Luna y Playa Norte',
        'Casco Antiguo y Castillo de Peñíscola',
        'Playa Sur y Zona Comercial Urbana',
        'Peñismar, Las Atalayas y Font Nova',
      ],
      localFaqAnswer:
        'En Peñíscola realizamos recogidas y entregas diarias en toda la Avenida Papa Luna, Playa Norte, Playa Sur y urbanizaciones, con servicio express en fin de semana sincronizado con tus check-in y check-out.',
    },
    simulatorSeo: {
      title: 'Simulador Rentabilidad Alquiler Vacacional Peñíscola 2025/2026 | Azahar Rentals',
      description:
        'Calcula gratis cuánto puedes ganar con tu apartamento turístico en Peñíscola (Playa Norte, Playa Sur, Casco Antiguo). Datos reales AirDNA y Turisme CV.',
      canonicalPath: '/simulador-peniscola',
      image: `${BASE_DOMAIN}/images/peniscola_coast_1788275771316.jpg`,
      badge: 'Estudio de Mercado Peñíscola 2025/2026',
      h1: 'Simulador de Rentabilidad Alquiler Vacacional en Peñíscola',
      subtitle:
        'Estima los ingresos brutos y netos anuales de tu vivienda turística en Peñíscola (Playa Norte, Playa Sur, Av. Papa Luna y Las Atalayas) con datos verificados de ocupación, ADR estacional y normativa VT.',
      localHighlight:
        'Peñíscola alcanza ocupaciones del 84%-96% entre mayo y octubre y tarifas medias de 175 € a 310 €/noche en temporada alta.',
    },
  },
  vinaros: {
    slug: 'vinaros',
    name: 'Vinaròs',
    locationDataId: 'vinaroz',
    marketStatsId: 'vinaroz',
    townAliases: ['vinaros', 'vinaròs', 'vinaroz'],
    heroImage: '/images/modern_apartment_1788275785243.jpg',
    apartmentsSeo: {
      title: 'Apartamentos Turísticos en Vinaròs | Alquiler Vacacional VT | Azahar Rentals',
      description:
        'Alquiler vacacional y apartamentos turísticos en Vinaròs junto a Playa del Fortí, Fora del Forat y Calas de la Costa Norte. Licencias VT y gestión 360°.',
      canonicalPath: '/apartamentos-turisticos-vinaros',
      image: `${BASE_DOMAIN}/images/modern_apartment_1788275785243.jpg`,
      badge: 'Alquiler Vacacional Verificado en Vinaròs',
      h1: 'Apartamentos Turísticos y Vacacionales en Vinaròs',
      subtitle:
        'Viviendas vacacionales verificadas en Vinaròs junto a la Playa del Fortí, Paseo Marítimo, Fora del Forat y las calas vírgenes de la Costa Norte y Sur. Registro turístico oficial VT y atención 24 horas.',
      zonesHighlight: [
        'Playa del Fortí y Paseo Marítimo (centro urbano)',
        'Playa Fora del Forat y Zona del Clot',
        'Calas de la Costa Norte: Cala Puntal, Llanetes y Sòl de Riu',
        'Puerto Náutico y área gastronómica del Langostino de Vinaròs',
      ],
      localGuideTitle: 'Alojamiento turístico en Vinaròs: mar, calas y gastronomía todo el año',
      localGuideText:
        'Vinaròs combina amplias playas urbanas con Bandera Azul como El Fortí con más de veinte calas naturales en su Costa Norte y Sur. Su dinamismo comercial, los famosos Carnavales y su cocina marinera generan una demanda vacacional constante en cualquier estación.',
      emptyStateTitle: 'Apartamentos turísticos en Vinaròs disponibles bajo consulta',
      emptyStateDescription:
        'Estamos incorporando nuevas viviendas verificadas con licencia VT en Playa del Fortí, Fora del Forat y Costa Norte de Vinaròs. Escríbenos por WhatsApp para disponibilidad inmediata o consulta el catálogo completo de la comarca.',
    },
    laundrySeo: {
      title: 'Lavandería Industrial en Vinaròs | Hoteles, Pisos Turísticos y Clínicas | Azahar',
      description:
        'Lavandería industrial en Vinaròs para hoteles, apartamentos turísticos, restaurantes, gimnasios y clínicas médicas. Recogida y entrega en El Fortí, centro y Costa Norte.',
      canonicalPath: '/lavanderia-industrial-vinaros',
      image: `${BASE_DOMAIN}/images/industrial_laundry.jpg`,
      badge: 'Servicio B2B en Vinaròs · Costa Norte y Centro',
      h1: 'Lavandería Industrial en Vinaròs para Hoteles, Pisos Turísticos, Gimnasios y Clínicas',
      subtitle:
        'Servicio B2B de lavado, desinfección térmica y planchado calandra en Vinaròs con recogida y entrega puerta a puerta en el centro urbano, Paseo Marítimo, Playa del Fortí, Costa Norte y Polígono Industrial.',
      heroImageCaption:
        'Servicio activo en Vinaròs: Playa del Fortí, Paseo Marítimo, Puerto, Costa Norte y Costa Sur.',
      sectorsHighlight:
        'Cobertura adaptada a hoteles urbanos y costeros, apartamentos turísticos en calas y paseo marítimo, restaurantes gastronómicos, centros deportivos y clínicas sanitarias de Vinaròs.',
      logisticsText:
        'Rutas regulares en Vinaròs con entrega en 24/48h en casco urbano, Avenida País Valencià, Playa del Fortí, Fora del Forat, Costa Norte y Costa Sur. Empaquetado higiénico y trazabilidad por lote.',
      localZones: [
        'Centro Urbano y Paseo Marítimo / Playa del Fortí',
        'Puerto Pesquero y Zona Comercial',
        'Calas de la Costa Norte y Sòl de Riu',
        'Costa Sur y Polígonos Empresariales de Vinaròs',
      ],
      localFaqAnswer:
        'Cubrimos todo el término de Vinaròs (centro, Paseo Marítimo, Playa del Fortí, Costa Norte y Costa Sur) con recogida programada de 2 a 6 días por semana según el volumen de tu establecimiento.',
    },
    simulatorSeo: {
      title: 'Simulador Rentabilidad Alquiler Vacacional Vinaròs 2025/2026 | Azahar Rentals',
      description:
        'Calcula los ingresos netos anuales de tu vivienda turística en Vinaròs (Playa del Fortí, Fora del Forat y Costa Norte). Datos reales AirDNA y Turisme CV.',
      canonicalPath: '/simulador-vinaros',
      image: `${BASE_DOMAIN}/images/modern_apartment_1788275785243.jpg`,
      badge: 'Estudio de Mercado Vinaròs 2025/2026',
      h1: 'Simulador de Rentabilidad Alquiler Vacacional en Vinaròs',
      subtitle:
        'Calcula gratis el potencial anual de ingresos de tu piso o chalet turístico en Vinaròs (Playa del Fortí, Paseo Marítimo, Fora del Forat y Costa Norte) con métricas reales del Baix Maestrat.',
      localHighlight:
        'Vinaròs destaca por su desestacionalización (58% de ocupación anual media) impulsada por turismo de calas, gastronomía y eventos todo el año.',
    },
  },
  benicarlo: {
    slug: 'benicarlo',
    name: 'Benicarló',
    locationDataId: 'benicarlo',
    marketStatsId: 'benicarlo',
    townAliases: ['benicarlo', 'benicarló'],
    heroImage: '/images/benicarlo_marina_apt_1788444573430.jpg',
    apartmentsSeo: {
      title: 'Apartamentos Turísticos en Benicarló | Alquiler Vacacional VT | Azahar Rentals',
      description:
        'Reserva apartamentos turísticos en Benicarló junto al Puerto Deportivo, Playa del Morrongo y La Caracola. Licencias VT oficiales, piscina y garaje privado.',
      canonicalPath: '/apartamentos-turisticos-benicarlo',
      image: `${BASE_DOMAIN}/images/benicarlo_marina_apt_1788444573430.jpg`,
      badge: 'Alquiler Vacacional Verificado en Benicarló',
      h1: 'Apartamentos Turísticos y Vacacionales en Benicarló',
      subtitle:
        'Alojamientos vacacionales en primera línea y junto al Puerto Deportivo de Benicarló, Playa del Morrongo y el paseo costero hacia Peñíscola (Playa La Caracola). Equipados con piscina, parking y licencia oficial VT.',
      zonesHighlight: [
        'Playa del Morrongo (Bandera Azul urbana)',
        'Puerto Deportivo y Lonja Gastronómica de Benicarló',
        'Paseo Papa Luna / Playa de La Caracola (conexión con Peñíscola)',
        'Playa del Gurugú y Playa de Mar Xica',
      ],
      localGuideTitle: 'Disfruta de Benicarló desde nuestros apartamentos junto al mar',
      localGuideText:
        'Benicarló ofrece un equilibrio único entre autenticidad marinera, gastronomía con Denominación de Origen (Alcachofa de Benicarló) y playas familiares tranquilas a un paso de Peñíscola. Nuestros apartamentos destacan por sus amplias terrazas, piscinas comunitarias y fácil aparcamiento.',
      emptyStateTitle: 'Apartamentos verificados en Benicarló',
      emptyStateDescription:
        'Consulta disponibilidad directa para nuestros residenciales en el Puerto de Benicarló y Playa del Morrongo o contacta por WhatsApp para fechas flexibles.',
    },
    laundrySeo: {
      title: 'Lavandería Industrial en Benicarló | Hoteles, Pisos Turísticos y Clínicas | Azahar',
      description:
        'Servicio de lavandería industrial en Benicarló para hoteles, apartamentos turísticos, restaurantes del puerto, gimnasios y clínicas. Recogida y entrega 24/48h.',
      canonicalPath: '/lavanderia-industrial-benicarlo',
      image: `${BASE_DOMAIN}/images/industrial_laundry.jpg`,
      badge: 'Servicio B2B en Benicarló · Puerto y Costa Sur',
      h1: 'Lavandería Industrial en Benicarló para Hoteles, Pisos Turísticos, Gimnasios y Clínicas',
      subtitle:
        'Lavado higiénico, secado y planchado calandra en Benicarló con recogida y entrega puerta a puerta en la zona del Puerto Deportivo, Playa del Morrongo, centro urbano, Papa Luna y polígonos industriales.',
      heroImageCaption:
        'Servicio activo en Benicarló: Puerto Deportivo, Playa Morrongo, La Caracola y casco urbano.',
      sectorsHighlight:
        'Servicio pensado para hoteles costeros, residenciales de apartamentos turísticos en Morrongo y Papa Luna, restaurantes marineros del puerto, centros deportivos y clínicas privadas de Benicarló.',
      logisticsText:
        'Rutas rápidas en Benicarló conectando Puerto Deportivo, Playa del Morrongo, Avenida Papa Luna (zona La Caracola), casco urbano y Polígono Industrial El Collet con entregas en 24/48h.',
      localZones: [
        'Puerto Deportivo y Playa del Morrongo',
        'Avenida Papa Luna y Playa de La Caracola',
        'Casco Urbano y Área Comercial',
        'Polígono Industrial y Costa Norte (Mar Xica)',
      ],
      localFaqAnswer:
        'En Benicarló ofrecemos rutas diarias y de fin de semana que enlazan el Puerto Deportivo, Playa del Morrongo, Avenida Papa Luna y centro urbano con devolución en 24/48 horas.',
    },
    simulatorSeo: {
      title: 'Simulador Rentabilidad Alquiler Vacacional Benicarló 2025/2026 | Azahar Rentals',
      description:
        'Calcula gratis la rentabilidad anual de tu apartamento turístico en Benicarló (Puerto, Playa Morrongo y Papa Luna). Datos reales AirDNA y Turisme CV.',
      canonicalPath: '/simulador-benicarlo',
      image: `${BASE_DOMAIN}/images/benicarlo_marina_apt_1788444573430.jpg`,
      badge: 'Estudio de Mercado Benicarló 2025/2026',
      h1: 'Simulador de Rentabilidad Alquiler Vacacional en Benicarló',
      subtitle:
        'Calcula los ingresos netos anuales de tu vivienda vacacional en Benicarló (Puerto Deportivo, Playa del Morrongo y corredor Papa Luna hacia Peñíscola) con métricas oficiales actualizadas.',
      localHighlight:
        'Benicarló ofrece uno de los mayores retornos netos sobre inversión de Castellón gracias a su alta demanda estival junto a Peñíscola.',
    },
  },
  'oropesa-del-mar': {
    slug: 'oropesa-del-mar',
    name: 'Oropesa del Mar',
    locationDataId: 'oropesa',
    marketStatsId: 'oropesa',
    townAliases: ['oropesa del mar', 'oropesa'],
    heroImage: '/images/castellon_hero_1788275752376.jpg',
    apartmentsSeo: {
      title: 'Apartamentos Turísticos en Oropesa del Mar | Alquiler Vacacional VT | Azahar Rentals',
      description:
        'Apartamentos turísticos en Oropesa del Mar junto a Playa de La Concha, Morro de Gos y Les Amplàries (Magic World). Licencias VT, piscina y check-in 24/7.',
      canonicalPath: '/apartamentos-turisticos-oropesa-del-mar',
      image: `${BASE_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
      badge: 'Alquiler Vacacional Verificado en Oropesa del Mar',
      h1: 'Apartamentos Turísticos y Vacacionales en Oropesa del Mar',
      subtitle:
        'Alojamientos turísticos familiares en Oropesa del Mar junto a la Playa de La Concha, Playa Morro de Gos, Les Amplàries (entorno Magic World) y la Vía Verde del Mar. Todos con licencia turística VT oficial y gestión hotelera.',
      zonesHighlight: [
        'Playa de La Concha (bahía familiar de arena fina)',
        'Playa Morro de Gos y Paseo Marítimo',
        'Les Amplàries y entorno vacacional Magic World / Marina d’Or',
        'Puerto Deportivo de Oropesa y Vía Verde del Mar hacia Benicàssim',
      ],
      localGuideTitle: 'Vacaciones en familia en Oropesa del Mar con máxima comodidad',
      localGuideText:
        'Oropesa del Mar es uno de los enclaves familiares más demandados de la Costa de Azahar gracias a sus bahías protegidas, parques de ocio, rutas cicloturistas junto al mar y urbanizaciones completas con piscina y zonas infantiles.',
      emptyStateTitle: 'Apartamentos turísticos en Oropesa del Mar disponibles bajo consulta',
      emptyStateDescription:
        'Gestionamos apartamentos familiares con licencia VT en Playa de La Concha, Morro de Gos y Les Amplàries. Consúltanos por WhatsApp para recibir opciones disponibles en tus fechas o explora toda la Costa de Castellón.',
    },
    laundrySeo: {
      title: 'Lavandería Industrial en Oropesa del Mar | Hoteles y Pisos Turísticos | Azahar',
      description:
        'Servicio B2B de lavandería industrial en Oropesa del Mar para hoteles, complejos turísticos, apartamentos en La Concha, Morro de Gos y Les Amplàries.',
      canonicalPath: '/lavanderia-industrial-oropesa-del-mar',
      image: `${BASE_DOMAIN}/images/industrial_laundry.jpg`,
      badge: 'Servicio B2B en Oropesa del Mar · Gran Capacidad',
      h1: 'Lavandería Industrial en Oropesa del Mar para Hoteles, Pisos Turísticos, Gimnasios y Clínicas',
      subtitle:
        'Servicio de alta capacidad en Oropesa del Mar para hoteles vacacionales, bloques de apartamentos turísticos en La Concha, Morro de Gos y Les Amplàries, spas, gimnasios y clínicas privadas con recogida y entrega puerta a puerta.',
      heroImageCaption:
        'Servicio activo en Oropesa del Mar: Playa de La Concha, Morro de Gos, Les Amplàries y Puerto Deportivo.',
      sectorsHighlight:
        'Preparados para el gran volumen turístico de Oropesa del Mar: packs sellados de sábanas y toallas por apartamento, servicio diario para hoteles y desinfección certificada para centros wellness y clínicas.',
      logisticsText:
        'Rutas optimizadas en Oropesa del Mar cubriendo Les Amplàries (zona Magic World), Morro de Gos, Playa de La Concha, casco urbano y El Balcó con entregas en 24/48h incluso en picos de agosto.',
      localZones: [
        'Playa de La Concha y Puerto Deportivo',
        'Playa Morro de Gos y Paseo Marítimo',
        'Les Amplàries (complejos turísticos y hoteles)',
        'Casco Urbano y Urbanización El Balcó / La Renegà',
      ],
      localFaqAnswer:
        'En Oropesa del Mar operamos con rutas frecuentes en La Concha, Morro de Gos y Les Amplàries, preparando kits individuales por cambio de huésped o carros completos para hoteles y apartahoteles.',
    },
    simulatorSeo: {
      title: 'Simulador Rentabilidad Alquiler Vacacional Oropesa del Mar 2025/2026 | Azahar',
      description:
        'Calcula gratis los ingresos anuales de tu vivienda turística en Oropesa del Mar (La Concha, Morro de Gos, Les Amplàries). Datos AirDNA y Turisme CV.',
      canonicalPath: '/simulador-oropesa-del-mar',
      image: `${BASE_DOMAIN}/images/castellon_hero_1788275752376.jpg`,
      badge: 'Estudio de Mercado Oropesa del Mar 2025/2026',
      h1: 'Simulador de Rentabilidad Alquiler Vacacional en Oropesa del Mar',
      subtitle:
        'Calcula el rendimiento bruto y neto anual de tu apartamento en Oropesa del Mar (Playa de La Concha, Morro de Gos y Les Amplàries / Magic World) con estadísticas reales del mercado vacacional.',
      localHighlight:
        'Oropesa del Mar supera los 1.100 apartamentos turísticos activos con picos de ocupación del 96% en julio y agosto.',
    },
  },
  benicassim: {
    slug: 'benicassim',
    name: 'Benicàssim',
    locationDataId: 'benicassim',
    marketStatsId: 'benicassim',
    townAliases: ['benicassim', 'benicàssim', 'benicasim'],
    heroImage: '/images/peniscola_salon_principal_1788444548906.jpg',
    apartmentsSeo: {
      title: 'Apartamentos Turísticos en Benicàssim | Alquiler Vacacional VT | Azahar Rentals',
      description:
        'Alquiler vacacional y apartamentos turísticos en Benicàssim junto a Playa Voramar, Almadraba, Torre Sant Vicent y Heliópolis. Licencias VT y gestión 360°.',
      canonicalPath: '/apartamentos-turisticos-benicassim',
      image: `${BASE_DOMAIN}/images/peniscola_salon_principal_1788444548906.jpg`,
      badge: 'Alquiler Vacacional Verificado en Benicàssim',
      h1: 'Apartamentos Turísticos y Vacacionales en Benicàssim',
      subtitle:
        'Alojamientos turísticos exclusivos en Benicàssim junto a las playas de Voramar, La Almadraba, Torre Sant Vicent y Heliópolis, a un paso de la Ruta de las Villas y el Desierto de las Palmas. Registro VT oficial y servicio hotelero 360°.',
      zonesHighlight: [
        'Playa Voramar y Ruta de las Villas Belle Époque',
        'Playa Torre Sant Vicent y La Almadraba',
        'Playa Heliópolis y Eurosol (paseo marítimo sur)',
        'Casco Urbano y entorno Desierto de las Palmas / Recinto de Festivales',
      ],
      localGuideTitle: 'Apartamentos en Benicàssim: playas premium, villas y eventos todo el año',
      localGuideText:
        'Benicàssim es la plaza turística de mayor valor añadido de la provincia de Castellón. Sus playas tranquilas de arena dorada, el paseo litoral hasta Oropesa, la oferta gastronómica y eventos internacionales (FIB, Rototom, ciclos culturales) garantizan una experiencia única en cualquier época.',
      emptyStateTitle: 'Apartamentos turísticos en Benicàssim disponibles bajo consulta',
      emptyStateDescription:
        'Gestionamos apartamentos y villas verificadas en Voramar, Torre Sant Vicent y Heliópolis (Benicàssim). Consúltanos por WhatsApp para disponibilidad en tus fechas o explora los alojamientos activos en Castellón.',
    },
    laundrySeo: {
      title: 'Lavandería Industrial en Benicàssim | Hoteles, Villas y Clínicas | Azahar Rentals',
      description:
        'Lavandería industrial en Benicàssim con acabado 5 estrellas para hoteles boutique, apartamentos en Voramar y Heliópolis, spas, gimnasios y clínicas médicas.',
      canonicalPath: '/lavanderia-industrial-benicassim',
      image: `${BASE_DOMAIN}/images/industrial_laundry.jpg`,
      badge: 'Servicio B2B en Benicàssim · Acabado Premium',
      h1: 'Lavandería Industrial en Benicàssim para Hoteles, Pisos Turísticos, Gimnasios y Clínicas',
      subtitle:
        'Lencería de cama satinada, toallas de alto gramaje y vestuario sanitario/hostelero en Benicàssim con recogida y entrega puerta a puerta en Voramar, Torre Sant Vicent, Heliópolis, Las Villas y casco urbano.',
      heroImageCaption:
        'Servicio activo en Benicàssim: Voramar, Torre Sant Vicent, Heliópolis, Montornés y casco urbano.',
      sectorsHighlight:
        'Diseñado para los exigentes estándares de hoteles boutique en Voramar, apartamentos y villas vacacionales en Heliópolis y Las Villas, restaurantes, clubes deportivos y clínicas privadas de Benicàssim.',
      logisticsText:
        'Rutas diarias en Benicàssim cubriendo Playa Voramar, Almadraba, Torre Sant Vicent, Paseo Marítimo Heliópolis, Eurosol, Las Villas y zona centro, con entrega garantizada en 24/48h.',
      localZones: [
        'Playa Voramar y Paseo de Las Villas',
        'Torre Sant Vicent y La Almadraba',
        'Playa Heliópolis y Zona Eurosol',
        'Casco Urbano, Montornés y Torre Bellver',
      ],
      localFaqAnswer:
        'En Benicàssim prestamos servicio diario puerta a puerta desde Voramar hasta Heliópolis y el casco urbano, con especial cuidado en sábanas de alto número de hilos, albornoces de spa y lencería de villas.',
    },
    simulatorSeo: {
      title: 'Simulador Rentabilidad Alquiler Vacacional Benicàssim 2025/2026 | Azahar Rentals',
      description:
        'Calcula gratis los ingresos anuales de tu vivienda turística en Benicàssim (Voramar, Torre Sant Vicent, Heliópolis). Datos reales AirDNA y Turisme CV.',
      canonicalPath: '/simulador-benicassim',
      image: `${BASE_DOMAIN}/images/peniscola_salon_principal_1788444548906.jpg`,
      badge: 'Estudio de Mercado Benicàssim 2025/2026',
      h1: 'Simulador de Rentabilidad Alquiler Vacacional en Benicàssim',
      subtitle:
        'Estima cuánto puede generar tu apartamento o villa turística en Benicàssim (Voramar, Almadraba, Torre Sant Vicent y Heliópolis) con datos reales de tarifas ADR, festivales y ocupación anual.',
      localHighlight:
        'Benicàssim lidera la provincia en ADR (hasta 360 €/noche en verano) con ingresos brutos optimizados que superan los 32.500 €/año en 2 habitaciones.',
    },
  },
  alcossebre: {
    slug: 'alcossebre',
    name: 'Alcossebre',
    locationDataId: 'alcossebre',
    marketStatsId: 'alcossebre',
    townAliases: ['alcossebre', 'alcala de xivert', 'alcalà de xivert', 'alcocebre'],
    heroImage: '/images/benicarlo_morrongo_suite_1788444588447.jpg',
    apartmentsSeo: {
      title: 'Apartamentos Turísticos en Alcossebre | Alquiler Vacacional VT | Azahar Rentals',
      description:
        'Apartamentos turísticos en Alcossebre junto a Playa Romana, El Carregador, Las Fuentes y Sierra de Irta. Licencias VT oficiales, piscina y entorno natural.',
      canonicalPath: '/apartamentos-turisticos-alcossebre',
      image: `${BASE_DOMAIN}/images/benicarlo_morrongo_suite_1788444588447.jpg`,
      badge: 'Alquiler Vacacional Verificado en Alcossebre',
      h1: 'Apartamentos Turísticos y Vacacionales en Alcossebre',
      subtitle:
        'Viviendas vacacionales en Alcossebre (Alcalà de Xivert) rodeadas de calas vírgenes y el Parque Natural de la Sierra de Irta, junto a Playa Romana, El Carregador y Las Fuentes. Con licencia VT oficial y gestión integral.',
      zonesHighlight: [
        'Playa del Carregador y Paseo Marítimo de Alcossebre',
        'Playa Romana y Playa del Moro (Banderas Azules)',
        'Urbanización Las Fuentes y Puerto Deportivo',
        'Cap i Corp y Calas del Parque Natural Sierra de Irta',
      ],
      localGuideTitle: 'Naturaleza protegida y playas tranquilas en Alcossebre',
      localGuideText:
        'Alcossebre destaca por su baja densidad urbanística, sus manantiales de agua dulce en la arena de Las Fuentes y el acceso directo a las rutas y calas de la Sierra de Irta, atrayendo a familias y viajeros europeos que valoran la calma y la calidad.',
      emptyStateTitle: 'Apartamentos turísticos en Alcossebre disponibles bajo consulta',
      emptyStateDescription:
        'Gestionamos residenciales seleccionados en Las Fuentes, Playa Romana y El Carregador de Alcossebre. Contáctanos por WhatsApp para disponibilidad personalizada o explora otras localidades de Castellón.',
    },
    laundrySeo: {
      title: 'Lavandería Industrial en Alcossebre | Hoteles, Apartamentos y Spas | Azahar Rentals',
      description:
        'Lavandería industrial en Alcossebre (Alcalà de Xivert) para hoteles, apartamentos turísticos en Las Fuentes y Playa Romana, restaurantes y centros wellness.',
      canonicalPath: '/lavanderia-industrial-alcossebre',
      image: `${BASE_DOMAIN}/images/industrial_laundry.jpg`,
      badge: 'Servicio B2B en Alcossebre · Sierra de Irta',
      h1: 'Lavandería Industrial en Alcossebre para Hoteles, Pisos Turísticos, Gimnasios y Clínicas',
      subtitle:
        'Recogida y entrega puerta a puerta en Alcossebre y Alcalà de Xivert (Las Fuentes, Playa Romana, El Carregador y Cap i Corp) con lavado desinfectante, secado y planchado calandra profesional.',
      heroImageCaption:
        'Servicio activo en Alcossebre: Las Fuentes, El Carregador, Playa Romana, Tres Playas y Cap i Corp.',
      sectorsHighlight:
        'Soluciones textiles de máxima calidad para apartahoteles y urbanizaciones vacacionales, hoteles boutique frente al mar, restaurantes del puerto deportivo de Las Fuentes, gimnasios y clínicas en Alcalà-Alcossebre.',
      logisticsText:
        'Rutas programadas en Alcossebre y Alcalà de Xivert conectando Las Fuentes, Playa del Carregador, Playa Romana, Tres Playas y Cap i Corp con entregas puntuales en 24/48 horas.',
      localZones: [
        'Las Fuentes y Puerto Deportivo de Alcossebre',
        'Playa del Carregador y Centro Turístico',
        'Playa Romana, Playa del Moro y Tres Playas',
        'Cap i Corp y Alcalà de Xivert',
      ],
      localFaqAnswer:
        'Cubrimos todas las zonas residenciales y turísticas de Alcossebre (Las Fuentes, Carregador, Playa Romana, Cap i Corp) y Alcalà de Xivert con rutas regulares y packs herméticos listos para cada cambio de huésped.',
    },
    simulatorSeo: {
      title: 'Simulador Rentabilidad Alquiler Vacacional Alcossebre 2025/2026 | Azahar Rentals',
      description:
        'Calcula gratis la rentabilidad anual de tu vivienda turística en Alcossebre (Las Fuentes, Playa Romana, El Carregador). Datos reales AirDNA y Turisme CV.',
      canonicalPath: '/simulador-alcossebre',
      image: `${BASE_DOMAIN}/images/benicarlo_morrongo_suite_1788444588447.jpg`,
      badge: 'Estudio de Mercado Alcossebre 2025/2026',
      h1: 'Simulador de Rentabilidad Alquiler Vacacional en Alcossebre',
      subtitle:
        'Calcula el potencial anual de tu apartamento o residencial turístico en Alcossebre (Las Fuentes, Playa Romana, El Carregador y Sierra de Irta) con datos de mercado de turismo residencial premium.',
      localHighlight:
        'Alcossebre logra una temporada extendida de primavera a otoño (61% de ocupación media anual) con estancias familiares largas y cliente internacional.',
    },
  },
};

export const MUNICIPALITY_LIST: MunicipalitySeoProfile[] = [
  MUNICIPALITY_PROFILES.peniscola,
  MUNICIPALITY_PROFILES.vinaros,
  MUNICIPALITY_PROFILES.benicarlo,
  MUNICIPALITY_PROFILES['oropesa-del-mar'],
  MUNICIPALITY_PROFILES.benicassim,
  MUNICIPALITY_PROFILES.alcossebre,
];

export function resolveMunicipalitySlug(rawSlug?: string | null): MunicipalitySlug | null {
  if (!rawSlug) return null;
  const norm = normalizeSlugText(rawSlug);
  if (norm === 'peniscola') return 'peniscola';
  if (norm === 'vinaros' || norm === 'vinaroz') return 'vinaros';
  if (norm === 'benicarlo') return 'benicarlo';
  if (norm === 'oropesa-del-mar' || norm === 'oropesa') return 'oropesa-del-mar';
  if (norm === 'benicassim' || norm === 'benicasim') return 'benicassim';
  if (norm === 'alcossebre' || norm === 'alcocebre' || norm === 'alcala-de-xivert') return 'alcossebre';
  return null;
}

export function matchesApartmentMunicipality(town: string, slug: MunicipalitySlug): boolean {
  const profile = MUNICIPALITY_PROFILES[slug];
  if (!profile) return false;
  const normTown = normalizeSlugText(town);
  return profile.townAliases.some((alias) => normTown.includes(normalizeSlugText(alias)));
}
