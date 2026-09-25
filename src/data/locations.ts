import { LocationData } from '../types';

export const LOCATIONS_DATA: LocationData[] = [
  {
    id: 'peniscola',
    name: 'Peñíscola',
    subtitle: 'La Ciudad en el Mar & Capital Turística del Norte',
    badge: 'Máxima Demanda',
    description: 'Destino estrella de la Costa del Azahar con reconocimiento internacional. Fuerte demanda familiar y europea desde Semana Santa hasta finales de octubre, con picos de ocupación del 96% en temporada alta.',
    highlightBeaches: [
      'Playa Norte (5 km de arena fina con vistas al Castillo)',
      'Playa Sur (aguas tranquilas junto al puerto)',
      'Cala del Moro y Calas del Parque Natural Sierra de Irta',
      'Playa de las Viudas'
    ],
    averageAnnualYield: '16.500€ - 32.000€',
    averageOccupancy: '84% (May-Oct)',
    highSeasonADR: '175€ - 310€/noche',
    image: '/images/peniscola_coast_1788275771316.jpg',
    popularPropertyTypes: 'Apartamentos 1-3 hab. con terraza y vistas al mar, adosados con piscina comunitaria',
    tags: ['Castillo Templario', 'Bandera Azul', 'Turismo Internacional', 'Sierra de Irta']
  },
  {
    id: 'vinaroz',
    name: 'Vinaròs (Vinaroz)',
    subtitle: 'Gastronomía, Tradición Marinera y Calas Vírgenes',
    badge: 'Alta Rentabilidad',
    description: 'El motor comercial y gastronómico del norte de Castellón. Gran dinamismo durante todo el año gracias a su afamada gastronomía (Langostino de Vinaròs), su paseo marítimo y sus más de 20 calas idílicas.',
    highlightBeaches: [
      'Playa del Fortí (Bandera Azul en pleno casco urbano)',
      'Playa de Fora del Forat (amplia con palmeral y servicios)',
      'Playa del Clot (aguas someras familiares)',
      'Calas de la Costa Norte: Cala Puntal, Llanetes, Sòl de Riu'
    ],
    averageAnnualYield: '14.000€ - 26.500€',
    averageOccupancy: '78% anual',
    highSeasonADR: '145€ - 240€/noche',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    popularPropertyTypes: 'Pisos céntricos a pie de playa, áticos con solárium y chalets en Costa Norte',
    tags: ['Langostino de Vinaròs', 'Carnavales', 'Calas Escondidas', 'Paseo Marítimo']
  },
  {
    id: 'benicarlo',
    name: 'Benicarló',
    subtitle: 'Puerto Deportivo, Playas Abiertas y Autenticidad',
    badge: 'Crecimiento Exponencial',
    description: 'Ubicación estratégica privilegiada pegada a Peñíscola y Vinaròs. Ofrece precios de compra muy atractivos que generan unas de las tasas de retorno neto por alquiler turístico más altas de la provincia.',
    highlightBeaches: [
      'Playa Morrongo (Bandera Azul urbana de arena dorada)',
      'Playa de La Caracola (conectada con el paseo a Peñíscola)',
      'Playa del Gurugú y Playa de Mar Xica',
      'Puerto Pesquero y Marina Náutica de Benicarló'
    ],
    averageAnnualYield: '13.500€ - 24.000€',
    averageOccupancy: '79% anual',
    highSeasonADR: '135€ - 220€/noche',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    popularPropertyTypes: 'Apartamentos en primera y segunda línea, viviendas con parking y piscina',
    tags: ['Puerto Deportivo', 'Alcachofa DO', 'Paseo Peñíscola', 'Tranquilidad']
  },
  {
    id: 'oropesa',
    name: 'Oropesa del Mar',
    subtitle: 'El Paraíso Familiar de Playas y Vía Verde',
    badge: 'Gran Volumen Vacacional',
    description: 'Uno de los centros turísticos más consolidados de España con una infraestructura inigualable: bahías de aguas cristalinas, el complejo residencial Marina d\'Or / Magic World y la impresionante Vía Verde del Mar.',
    highlightBeaches: [
      'Playa de La Concha (emblemática bahía protegida de arena fina)',
      'Playa Morro de Gos (extensa con paseo marítimo)',
      'Playa Les Amplàries (junto a jardines y complejos vacacionales)',
      'Playa de la Renegà y Vía Verde del Mar hacia Benicàssim'
    ],
    averageAnnualYield: '15.000€ - 28.000€',
    averageOccupancy: '82% temporada',
    highSeasonADR: '150€ - 270€/noche',
    image: '/images/castellon_hero_1788275752376.jpg',
    popularPropertyTypes: 'Apartamentos con piscina comunitaria, áticos con vistas al mar y terrazas amplias',
    tags: ['Playa de La Concha', 'Vía Verde del Mar', 'Marina d\'Or', 'Familiar']
  },
  {
    id: 'alcossebre',
    name: 'Alcossebre (Alcalà de Xivert)',
    subtitle: 'Naturaleza Protegida y Playas Vírgenes',
    badge: 'Turismo Premium',
    description: 'Sin masificación y con baja densidad urbanística al pie del Parque Natural de la Sierra de Irta. Huéspedes de poder adquisitivo medio-alto que buscan tranquilidad, calas y naturaleza.',
    highlightBeaches: [
      'Playa Romana y Playa del Carregador (Banderas Azules)',
      'Playa de Las Fuentes (con manantiales de agua dulce en la arena)',
      'Playa del Moro y Playa Manyetes',
      'Calas vírgenes de la Sierra de Irta (Cala Blanca, Cala Mundina)'
    ],
    averageAnnualYield: '14.500€ - 27.000€',
    averageOccupancy: '80% temporada',
    highSeasonADR: '160€ - 280€/noche',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    popularPropertyTypes: 'Residenciales ajardinados con piscina, apartamentos con vistas a Sierra de Irta',
    tags: ['Parque Natural', 'Baja Densidad', 'Manantiales Las Fuentes', 'Calidad']
  },
  {
    id: 'benicassim',
    name: 'Benicàssim',
    subtitle: 'Villas Históricas, Festivales y Exclusividad',
    badge: 'Temporada Larga',
    description: 'El destino más cosmopolita de la costa castellonense. Combina turismo de playa de alto nivel con eventos de fama mundial (FIB, Rototom) y una vibrante vida cultural todo el año.',
    highlightBeaches: [
      'Playa Voramar (con la emblemática Ruta de las Villas "Belle Époque")',
      'Playa Torre Sant Vicent y Playa Almadraba',
      'Playa Heliópolis y Eurosol',
      'Desierto de las Palmas y calas rocosas'
    ],
    averageAnnualYield: '18.000€ - 35.000€',
    averageOccupancy: '85% anual',
    highSeasonADR: '180€ - 340€/noche',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    popularPropertyTypes: 'Villas independientes, áticos con grandes terrazas en primera línea',
    tags: ['Ruta de las Villas', 'Festivales FIB', 'Exclusividad', 'Alta Ocupación']
  }
];
