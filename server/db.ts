import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface ApartmentPhoto {
  url: string;
  caption: string;
}

export interface FeaturedApartment {
  id: string;
  name: string;
  town: string;
  zone: string;
  licenseNumber: string;
  rating: number;
  reviewsCount: number;
  basePricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  isFirstLineBeach?: boolean;
  distanceToBeach: string;
  highlights: string[];
  amenities: string[];
  description: string;
  photos: ApartmentPhoto[];
  bookingIcalUrl?: string;
  rates?: any;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  username: string;
  email: string;
  passwordHash: string; // SHA-256 with salt
  salt: string;
  securityQuestion: string;
  securityAnswerHash: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const APARTMENTS_FILE = path.join(DATA_DIR, 'apartments.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure all image URLs use public accessible paths (/images/ instead of /src/assets/images/)
function normalizeApartmentPhotos(apt: FeaturedApartment): FeaturedApartment {
  if (!apt.photos || !Array.isArray(apt.photos)) {
    return { ...apt, photos: [] };
  }
  return {
    ...apt,
    photos: apt.photos.map((p) => ({
      ...p,
      url: p.url ? p.url.replace(/^\/src\/assets\/images\//, '/images/') : p.url
    }))
  };
}

// Initial default seed apartments
const INITIAL_APARTMENTS: FeaturedApartment[] = [
  {
    id: 'apt-peniscola-primero',
    name: 'Ático Mirador del Castillo',
    town: 'Peñíscola',
    zone: 'Playa Norte / Primera Línea',
    licenseNumber: 'VT-42819-CS',
    rating: 4.98,
    reviewsCount: 52,
    basePricePerNight: 70,
    bookingIcalUrl: 'https://ical.booking.com/v1/export?t=266de0d0-36d0-4722-9983-119cc7b7f399',
    rates: {
      lowSeason: 70,
      midSeason: 95,
      highSeasonJuly: 150,
      peakSeasonAugust: 185,
      easterHoliday: 130,
      weekendSupplement: 0,
      customDateRanges: []
    },
    maxGuests: 6,
    bedrooms: 2,
    bathrooms: 2,
    squareMeters: 88,
    isFirstLineBeach: true,
    distanceToBeach: 'Primera línea (25m)',
    highlights: [
      'Terraza panorámica privada con vistas frontales al Castillo Papa Luna',
      'Salón diáfano contemporáneo con salida directa a terraza exterior',
      'Cocina nórdica completamente equipada y 2 baños modernos',
      'Wifi de alta velocidad 600Mb y Aire Acondicionado centralizado',
      'Plaza de parking privado incluida y ascensor'
    ],
    amenities: [
      'Parking privado',
      'Cafetera Nespresso',
      'Wifi 600Mb',
      'Aire acondicionado',
      'Vistas al mar',
      'Terraza exterior',
      'Ascensor',
      'Lavavajillas'
    ],
    description: 'Exclusivo ático turístico en primera línea de Peñíscola con una magnífica terraza privada orientada al mar y al emblemático Castillo del Papa Luna. Decorado con esmero y totalmente equipado para vacaciones de ensueño.',
    photos: [
      {
        url: '/images/peniscola_balcon_terraza_1788561222890.jpg',
        caption: 'Terraza balcón panorámica con vistas al mar y Castillo'
      },
      {
        url: '/images/peniscola_salon_principal_1788444548906.jpg',
        caption: 'Salón principal con salida a terraza y vistas al mar en Peñíscola'
      },
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        caption: 'Terraza y salón diáfano con iluminación natural'
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cocina de diseño equipada con electrodomésticos de alta gama'
      }
    ],
    active: true
  },
  {
    id: 'apt-benicarlo-marina',
    name: 'Residencial Marina & Puerto Deportivo',
    town: 'Benicarló',
    zone: 'Puerto de Benicarló / Playa Morrongo',
    licenseNumber: 'VT-43180-CS',
    rating: 4.95,
    reviewsCount: 44,
    basePricePerNight: 54,
    bookingIcalUrl: 'https://ical.booking.com/v1/export?t=266de0d0-36d0-4722-9983-119cc7b7f399',
    rates: {
      lowSeason: 54,
      midSeason: 75,
      highSeasonJuly: 120,
      peakSeasonAugust: 145,
      easterHoliday: 95,
      weekendSupplement: 0,
      customDateRanges: []
    },
    maxGuests: 6,
    bedrooms: 2,
    bathrooms: 1,
    squareMeters: 75,
    isFirstLineBeach: false,
    distanceToBeach: '50 metros del puerto y playa',
    highlights: [
      'Vistas al puerto deportivo y lonja tradicional de Benicarló',
      'Piscina comunitaria y solárium ajardinado en azotea',
      'Totalmente climatizado con split inverter en todas las estancias',
      'A 3 minutos de los mejores restaurantes marineros'
    ],
    amenities: [
      'Wifi 300Mb',
      'Aire acondicionado',
      'Cafetera italiana',
      'Piscina comunitaria',
      'Vistas al puerto',
      'Ascensor'
    ],
    description: 'Moderno apartamento junto al Puerto Deportivo de Benicarló. Disfruta de la tranquilidad del mar, piscina comunitaria y la excelente gastronomía mediterránea a pie de calle.',
    photos: [
      {
        url: '/images/benicarlo_marina_apt_1788444573430.jpg',
        caption: 'Salón luminoso con balcón exterior junto al puerto de Benicarló'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Salón amplio de concepto abierto con mobiliario nórdico y suelos de madera'
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cocina moderna con península, cafetera Nespresso y todos los utensilios'
      },
      {
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
        caption: 'Dormitorio de matrimonio suite con salida directa a terraza'
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Baño suite moderno con ducha de lluvia termostática'
      }
    ],
    active: true
  },
  {
    id: 'apt-benicarlo-morrongo',
    name: 'Apartamento Playa Morrongo Suite',
    town: 'Benicarló',
    zone: 'Playa Morrongo / Casco Costero',
    licenseNumber: 'VT-43512-CS',
    rating: 4.92,
    reviewsCount: 29,
    basePricePerNight: 80,
    bookingIcalUrl: '',
    maxGuests: 5,
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 92,
    isFirstLineBeach: true,
    distanceToBeach: 'Primera línea (25m)',
    highlights: [
      'Acceso directo a la emblemática Playa del Morrongo con bandera azul',
      'Tres amplios dormitorios exteriores con armarios empotrados',
      'Plaza de garaje en el mismo edificio incluida en la tarifa',
      'Equipamiento premium para familias y largas estancias de verano'
    ],
    amenities: [
      'Parking privado',
      'Cafetera Dolce Gusto',
      'Wifi 600Mb',
      'Aire acondicionado',
      'Terraza solárium',
      'Ascensor'
    ],
    description: 'Espacioso piso familiar a escasos pasos de la arena fina de la Playa del Morrongo. Ideal para vacaciones con niños con la comodidad de garaje privado.',
    photos: [
      {
        url: '/images/benicarlo_morrongo_suite_1788444588447.jpg',
        caption: 'Elegante zona de estar y comedor familiar frente a Playa Morrongo'
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        caption: 'Vistas panorámicas hacia el litoral y jardines de la urbanización'
      },
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        caption: 'Salón comedor luminoso con decoración cálida mediterránea'
      },
      {
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Dormitorio principal con cama Queen Size y luz exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        caption: 'Piscina comunitaria rodeada de palmeras'
      }
    ],
    active: true
  },
  {
    id: 'apt-alcover-rural',
    name: 'Villa Mediterránea Costa Norte',
    town: 'Vinaròs',
    zone: 'Calas Costa Norte / Vinaròs',
    licenseNumber: 'VT-44180-CS',
    rating: 4.95,
    reviewsCount: 22,
    basePricePerNight: 110,
    bookingIcalUrl: '',
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 2,
    squareMeters: 140,
    isFirstLineBeach: false,
    distanceToBeach: '120m de Cala Puntal y senderos',
    highlights: [
      'Chalet independiente con jardín privado vallado y barbacoa',
      'Entorno natural de aguas cristalinas y tranquilidad absoluta',
      'Amplia terraza porche para cenas al aire libre bajo las estrellas',
      'Admite mascotas educadas previa consulta'
    ],
    amenities: [
      'Parking privado',
      'Cafetera de goteo',
      'Wifi',
      'Barbacoa',
      'Jardín privado',
      'Admite mascotas'
    ],
    description: 'Chalet con encanto mediterráneo en la apacible Costa Norte de Vinaròs. Rodeado de calas vírgenes, jardín privado con barbacoa para desconectar en familia.',
    photos: [
      {
        url: '/images/alcover_rural_retreat_1788444605887.jpg',
        caption: 'Porche exterior y jardín mediterráneo privado con zona barbacoa'
      },
      {
        url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
        caption: 'Terraza rústica exterior para cenas al aire libre con aire puro de mar y campo'
      },
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        caption: 'Estar acogedor con vigas de madera noble y mobiliario confortable'
      },
      {
        url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
        caption: 'Dormitorio principal con ambiente de calma absoluta'
      },
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Comedor de estilo rústico integrado con la cocina'
      }
    ],
    active: true
  }
];

export function getApartments(): FeaturedApartment[] {
  try {
    if (fs.existsSync(APARTMENTS_FILE)) {
      const data = fs.readFileSync(APARTMENTS_FILE, 'utf-8');
      const list = JSON.parse(data);
      if (Array.isArray(list) && list.length > 0) {
        return list.map(normalizeApartmentPhotos);
      }
    }
    // If not found or empty, save default and return
    saveApartments(INITIAL_APARTMENTS);
    return INITIAL_APARTMENTS;
  } catch (error) {
    console.error('Error reading apartments file, falling back to initial data:', error);
    return INITIAL_APARTMENTS;
  }
}

export function saveApartments(apartments: FeaturedApartment[]): void {
  try {
    fs.writeFileSync(APARTMENTS_FILE, JSON.stringify(apartments, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving apartments to file:', error);
  }
}

export function getApartmentById(id: string): FeaturedApartment | undefined {
  const list = getApartments();
  return list.find((a) => a.id === id);
}

export function createApartment(data: Partial<FeaturedApartment>): FeaturedApartment {
  const list = getApartments();
  const id = data.id || 'apt-' + (data.town || 'castellon').toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  
  const newApt: FeaturedApartment = {
    id,
    name: data.name || 'Nuevo Apartamento Turístico',
    town: data.town || 'Peñíscola',
    zone: data.zone || 'Costa de Castellón',
    licenseNumber: data.licenseNumber || 'VT-00000-CS',
    rating: data.rating ?? 5.0,
    reviewsCount: data.reviewsCount ?? 1,
    basePricePerNight: Number(data.basePricePerNight) || 80,
    bookingIcalUrl: data.bookingIcalUrl || '',
    maxGuests: Number(data.maxGuests) || 4,
    bedrooms: Number(data.bedrooms) || 2,
    bathrooms: Number(data.bathrooms) || 1,
    squareMeters: Number(data.squareMeters) || 75,
    isFirstLineBeach: typeof data.isFirstLineBeach === 'boolean'
      ? data.isFirstLineBeach
      : Boolean(data.distanceToBeach?.toLowerCase().includes('primera')),
    distanceToBeach: data.isFirstLineBeach ? 'Primera línea (25m)' : (data.distanceToBeach || '100m de la playa'),
    highlights: Array.isArray(data.highlights) && data.highlights.length > 0 
      ? data.highlights 
      : ['Alojamiento turístico homologado con Licencia Oficial GVA'],
    amenities: Array.isArray(data.amenities) 
      ? data.amenities 
      : ['Wifi', 'Aire acondicionado'],
    description: data.description || 'Excelente alojamiento turístico gestionado por Azahar Rentals.',
    photos: Array.isArray(data.photos) && data.photos.length > 0
      ? data.photos
      : [
          {
            url: '/images/peniscola_balcon_terraza_1788561222890.jpg',
            caption: 'Foto de Portada'
          }
        ],
    active: data.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  list.unshift(newApt);
  saveApartments(list);
  return newApt;
}

export function updateApartment(id: string, updates: Partial<FeaturedApartment>): FeaturedApartment | null {
  const list = getApartments();
  const index = list.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const existing = list[index];

  const hasBeachAmenity = Array.isArray(updates.amenities)
    ? updates.amenities.some((a) => a.toLowerCase().includes('primera línea') || a.toLowerCase().includes('primera linea'))
    : undefined;

  const isFirstLine = typeof updates.isFirstLineBeach === 'boolean'
    ? updates.isFirstLineBeach
    : (hasBeachAmenity !== undefined
        ? hasBeachAmenity
        : (updates.distanceToBeach !== undefined
            ? updates.distanceToBeach.toLowerCase().includes('primera')
            : existing.isFirstLineBeach));

  const finalDistance = isFirstLine
    ? 'Primera línea (25m)'
    : (updates.distanceToBeach !== undefined
        ? updates.distanceToBeach
        : (existing.distanceToBeach?.toLowerCase().includes('primera') ? '50 metros del puerto y playa' : existing.distanceToBeach));

  const updated: FeaturedApartment = {
    ...existing,
    ...updates,
    maxGuests: updates.maxGuests !== undefined ? Number(updates.maxGuests) : existing.maxGuests,
    bedrooms: updates.bedrooms !== undefined ? Number(updates.bedrooms) : existing.bedrooms,
    bathrooms: updates.bathrooms !== undefined ? Number(updates.bathrooms) : existing.bathrooms,
    squareMeters: updates.squareMeters !== undefined ? Number(updates.squareMeters) : existing.squareMeters,
    basePricePerNight: updates.basePricePerNight !== undefined ? Number(updates.basePricePerNight) : existing.basePricePerNight,
    isFirstLineBeach: isFirstLine,
    distanceToBeach: finalDistance,
    id: existing.id, // preserve id
    updatedAt: new Date().toISOString()
  };

  list[index] = updated;
  saveApartments(list);
  return updated;
}

export function deleteApartment(id: string): boolean {
  const list = getApartments();
  const filtered = list.filter((a) => a.id !== id);
  if (filtered.length === list.length) return false;
  saveApartments(filtered);
  return true;
}
