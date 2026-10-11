// Featured Apartments Data for Vacation Rentals
// All images are served directly from the public folder /images/

const peniscolaBalconPhoto = '/images/peniscola_balcon_terraza_1788561222890.jpg';
const peniscolaSalonPhoto = '/images/peniscola_salon_principal_1788444548906.jpg';
const benicarlo1Photo = '/images/benicarlo_marina_apt_1788444573430.jpg';
const benicarlo2Photo = '/images/benicarlo_morrongo_suite_1788444588447.jpg';
const alcoverPhoto = '/images/alcover_rural_retreat_1788444605887.jpg';

import { BookingSeasonRateConfig } from '../utils/bookingRates';

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
  amenities?: string[];
  description: string;
  photos: ApartmentPhoto[];
  bookingIcalUrl?: string;
  rates?: BookingSeasonRateConfig;
  active?: boolean;
}

export const FEATURED_APARTMENTS: FeaturedApartment[] = [
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
      'Primera línea de playa (25m)',
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
        url: peniscolaBalconPhoto,
        caption: 'Terraza balcón panorámica con vistas al mar (balcon1.png)'
      },
      {
        url: peniscolaSalonPhoto,
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
    ]
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
    bathrooms: 2,
    squareMeters: 80,
    isFirstLineBeach: false,
    distanceToBeach: 'A 100m de Playa Morrongo',
    highlights: [
      'A 2 minutos a pie del puerto náutico y la lonja gastronómica',
      'Terraza exterior soleada con mobiliario de exterior contemporáneo',
      'Piscina comunitaria en recinto residencial cerrado',
      'Cocina abierta con electrodomésticos Bosch y lavavajillas',
      'Garaje cerrado en el mismo edificio'
    ],
    amenities: [
      'Wifi 600Mb',
      'Piscina comunitaria',
      'Aire acondicionado',
      'Terraza exterior',
      'Cafetera Nespresso',
      'Ascensor',
      'Parking privado'
    ],
    description: 'Luminoso apartamento vacacional junto a la playa del Morrongo y el animado puerto deportivo de Benicarló. Perfecto para disfrutar de la afamada gastronomía marinera, paseos costeros y descanso familiar.',
    photos: [
      {
        url: benicarlo1Photo,
        caption: 'Salón y terraza mediterránea junto al puerto y la marina de Benicarló'
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
    ]
  },
  {
    id: 'apt-benicarlo-morrongo',
    name: 'Brisas del Morrongo & Costa Papa Luna',
    town: 'Benicarló',
    zone: 'Paseo de la Costa Sur / Playa La Caracola',
    licenseNumber: 'VT-43612-CS',
    rating: 4.97,
    reviewsCount: 38,
    basePricePerNight: 60,
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 1,
    squareMeters: 76,
    isFirstLineBeach: true,
    distanceToBeach: 'Primera línea (25m)',
    highlights: [
      'Amplia terraza chill-out orientada al Mediterráneo',
      'Piscina para adultos e infantil rodeada de jardines',
      'Conexión directa por paseo litoral hacia Peñíscola',
      'Aire Acondicionado silencioso en todas las estancias',
      'Smart TV 55" y Wifi simétrico apto para teletrabajo'
    ],
    amenities: [
      'Primera línea de playa (25m)',
      'Wifi 600Mb',
      'Aire acondicionado',
      'Piscina comunitaria',
      'Terraza exterior',
      'Vistas al mar',
      'Cafetera italiana',
      'Smart TV 55"'
    ],
    description: 'Apartamento costero de ambiente fresco y relajante, ubicado en el paseo que une Benicarló con Peñíscola. Ideal para amantes del mar, paseos en bicicleta por la costa y cenas en la terraza al anochecer.',
    photos: [
      {
        url: benicarlo2Photo,
        caption: 'Terraza privada con vistas abiertas al mar y mobiliario chill-out'
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
    ]
  },
  {
    id: 'apt-alcover-rural',
    name: 'Villa Rural & Vistas de Alcover',
    town: 'Alcover',
    zone: 'Centro Histórico / Valle del Glorieta & Prades',
    licenseNumber: 'HUT-029415',
    rating: 4.96,
    reviewsCount: 31,
    basePricePerNight: 64,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 105,
    isFirstLineBeach: false,
    distanceToBeach: 'Entorno de Montaña y Pozas Naturales (a 20 min de la costa)',
    highlights: [
      'Paredes de piedra vista restauradas y techos de vigas de madera',
      'Mirador privado con vistas panorámicas a las montañas de Prades',
      'A minutos del valle del río Glorieta y sus famosas pozas naturales ("Nius")',
      'Cocina rústica contemporánea con chimenea de pellet y barbacoa exterior',
      'Máxima tranquilidad, senderismo de montaña y rutas de cicloturismo'
    ],
    amenities: [
      'Wifi alta velocidad',
      'Barbacoa',
      'Chimenea',
      'Terraza exterior',
      'Vistas a la montaña',
      'Cafetera Nespresso',
      'Parking privado'
    ],
    description: 'Encantador alojamiento vacacional de estilo rústico-contemporáneo en Alcover. Combina la calidez de la arquitectura tradicional catalana con todas las comodidades modernas, en un entorno idílico entre las montañas de Prades y a corta distancia de la costa.',
    photos: [
      {
        url: alcoverPhoto,
        caption: 'Salón con piedra vista y grandes ventanales con vistas a la naturaleza de Alcover'
      },
      {
        url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
        caption: 'Terraza rústica exterior para cenas al aire libre con aire puro de montaña'
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
    ]
  }
];
