import { ServiceItem } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'licencia-turistica',
    iconName: 'FileCheck',
    badge: 'Trámite Incluido',
    title: 'Tramitación y Entrega de Licencia Turística (VT)',
    shortDescription: 'Gestionamos y te entregamos tu número oficial de Vivienda Turística de la Generalitat Valenciana sin que tengas que lidiar con ayuntamientos ni papeleos.',
    fullDescription: 'En la Comunidad Valenciana es obligatorio contar con el código de registro VT y certificado de compatibilidad urbanística. Nosotros nos encargamos de todo el expediente: memoria técnica, plano de compatibilidad municipal, seguro de responsabilidad civil, alta telemática y placa identificativa homologada.',
    bulletPoints: [
      'Informe técnico y compatibilidad urbanística con el ayuntamiento',
      'Alta telemática directa en el Registro de Turisme Comunitat Valenciana',
      'Revisión de estatutos de la comunidad de propietarios',
      'Instalación de placa identificativa oficial exigida por normativa',
      'Cumplimiento estricto del Decreto 9/2024 de la Generalitat Valenciana'
    ]
  },
  {
    id: 'revenue-pricing',
    iconName: 'TrendingUp',
    badge: 'Máximo Ingreso',
    title: 'Precios Dinámicos & Revenue Management con IA',
    shortDescription: 'Multiplicamos tus ingresos ajustando tarifas en tiempo real según ocupación local, eventos (FIB, Carnavales), puentes, clima y demanda hotelera.',
    fullDescription: 'No dejamos tus precios en piloto automático. Utilizamos herramientas avanzadas de revenue management combinadas con la supervisión de expertos locales para fijar el precio óptimo por noche cada día del año, logrando hasta un +40% más de beneficio neto que un particular.',
    bulletPoints: [
      'Ajuste algorítmico diario de precios según oferta y demanda en la Costa de Castellón',
      'Estrategias de estancia mínima para evitar huecos en el calendario',
      'Monitorización de tarifas de la competencia y ocupación hotelera de la zona',
      'Optimización especial para eventos (FIB Benicàssim, Carnavales Vinaròs, etc.)'
    ]
  },
  {
    id: 'multichannel-distribution',
    iconName: 'Globe',
    title: 'Publicación Multicanal & Posicionamiento Superhost',
    shortDescription: 'Tu apartamento visible en Airbnb, Booking.com, VRBO, Expedia y Google Rentals con sincronización instantánea de calendarios 100% libre de overbooking.',
    fullDescription: 'Diseñamos anuncios de alto impacto con fotografía profesional inmobiliaria, textos persuasivos en múltiples idiomas (inglés, francés, alemán, valenciano, español) y sincronización de disponibilidad mediante software Channel Manager líder.',
    bulletPoints: [
      'Sesión de fotografía profesional y tour virtual',
      'Categoría Superhost en Airbnb y Partner Preferente en Booking.com',
      'Sincronización centralizada e instantánea (cero riesgo de reservas duplicadas)',
      'Optimización SEO de descripciones para posicionar en primeras posiciones'
    ]
  },
  {
    id: 'guest-checkin-care',
    iconName: 'KeyRound',
    title: 'Recepción 24/7, Cerraduras Inteligentes & Atención al Huésped',
    shortDescription: 'Check-in y check-out presencial o autónomo con cerraduras electrónicas, atención telefónica multilingüe 24/7 y registro policial oficial (SES.HOSPEDAJES).',
    fullDescription: 'Los huéspedes reciben un servicio de nivel hotelero desde el primer mensaje. Resolvemos dudas al instante, proporcionamos guías locales digitales de Peñíscola, Vinaròs y alrededores, y gestionamos el parte obligatorio de viajeros con la Guardia Civil y Policía Nacional.',
    bulletPoints: [
      'Instalación opcional de cerraduras inteligentes de última generación',
      'Check-in personalizado presencial disponible',
      'Atención telefónica de emergencias para huéspedes 24 horas al día, 365 días',
      'Envío automático y legal de partes de viajeros a SES.HOSPEDAJES / Fuerzas de Seguridad'
    ]
  },
  {
    id: 'cleaning-laundry',
    iconName: 'Sparkles',
    title: 'Limpieza Hotelera, Lavandería Industrial & Amenities',
    shortDescription: 'Protocolos de desinfección profesional tras cada salida, lencería de cama y toallas de alta calidad y reposición de kit de bienvenida ecológico.',
    fullDescription: 'La limpieza es el factor número 1 en las valoraciones de 5 estrellas. Contamos con equipos propios formados en estándares hoteleros que inspeccionan cada rincón antes de la entrada del siguiente viajero.',
    bulletPoints: [
      'Lavandería industrial con tratamiento térmico desinfectante de sábanas y toallas',
      'Inspección de control de calidad previa a cada check-in con checklist fotográfico',
      'Reposición de amenities sostenibles de baño y cocina de primera marca',
      'Limpiezas a fondo estacionales y puestas a punto de inicio de temporada'
    ]
  },
  {
    id: 'maintenance-protection',
    iconName: 'Wrench',
    title: 'Mantenimiento Técnico, Control de Fianzas & Seguros',
    shortDescription: 'Cuidamos de tu vivienda como si fuera nuestra. Reparaciones inmediatas, gestión de depósitos de garantía y coberturas contra daños.',
    fullDescription: 'Disponemos de técnicos propios (electricidad, fontanería, cerrajería, climatización) para solucionar cualquier imprevisto sin interrumpir la estancia ni generar malas opiniones. Cobramos y retenemos fianzas a los huéspedes para salvaguardar tu patrimonio.',
    bulletPoints: [
      'Servicio técnico de emergencias para reparaciones inmediatas en la vivienda',
      'Gestión integral de fianzas y depósitos de garantía por daños',
      'Cobertura con pólizas de responsabilidad civil y protección AirCover de hasta 3M€',
      'Mantenimiento preventivo de aire acondicionado, calderas y electrodomésticos'
    ]
  },
  {
    id: 'owner-portal',
    iconName: 'LayoutDashboard',
    title: 'Portal del Propietario en Vivo & Liquidaciones Mensuales',
    shortDescription: 'Transparencia absoluta: consulta en tiempo real desde tu móvil las reservas confirmadas, ingresos generados y bloquea fechas para tus propias vacaciones.',
    fullDescription: 'Tendrás acceso a una aplicación exclusiva para propietarios donde podrás ver cada reserva con su importe exacto, facturas, valoraciones de huéspedes y bloquear días para disfrutar de tu propio apartamento en la playa cuando quieras.',
    bulletPoints: [
      'Acceso móvil y web con visualización de calendario en tiempo real',
      'Liquidaciones mensuales con transferencias puntuales a tu cuenta bancaria',
      'Facturas desglosadas y documentación preparada para tu declaración de IRPF',
      'Flexibilidad total: reserva fechas para tu uso personal con 1 solo clic'
    ]
  }
];
