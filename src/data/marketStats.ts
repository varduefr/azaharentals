export interface BedroomMarketData {
  bedrooms: number;
  label: string;
  guestCapacity: string;
  isRealBase: boolean; // true para 2 dormitorios (estadística real verificada de mercado vacacional AirDNA/Turisme CV)
  extrapolationFactor: number;
  extrapolationNote: string;
  averageGrossAnnual: number; // Media anual de mercado para alquiler vacacional
  optimizedGrossAnnual: number; // Ingreso bruto anual optimizado con Azahar Rentals
  estimatedNetAnnual: number; // Neto estimado para el propietario tras gestión turística
  highSeasonADR: number; // Tarifa diaria media en temporada alta (Julio/Agosto)
  lowSeasonADR: number; // Tarifa diaria media en temporada baja
  annualOccupancy: number; // Ocupación media anual (%)
  occupiedNights: number; // Noches reservadas al año
}

export interface MunicipalityMarketData {
  id: string;
  name: string;
  shortTagline: string;
  twoBedroomShare: string; // p.ej. "49% del parque vacacional turístico"
  marketHighlights: string;
  officialSources: string;
  bedroomsData: Record<number, BedroomMarketData>;
}

export const MUNICIPALITIES_MARKET_DATA: Record<string, MunicipalityMarketData> = {
  peniscola: {
    id: 'peniscola',
    name: 'Peñíscola',
    shortTagline: 'Capital Turística del Norte de Castellón',
    twoBedroomShare: '49% del total de apartamentos turísticos',
    marketHighlights: 'Máxima demanda familiar nacional e internacional. Las viviendas de 2 y 3 habitaciones concentran el 78% de las reservas vacacionales desde Semana Santa hasta octubre.',
    officialSources: 'AirDNA Market Intelligence 2025/2026, Turisme Comunitat Valenciana (Registro VT) e INE',
    bedroomsData: {
      1: {
        bedrooms: 1,
        label: '1 Habitación (2 - 3 plazas)',
        guestCapacity: '2 - 3 personas',
        isRealBase: false,
        extrapolationFactor: 0.78,
        extrapolationNote: 'Factor 0.78x: Alta rotación de parejas y escapadas de fin de semana.',
        averageGrossAnnual: 16000,
        optimizedGrossAnnual: 18900,
        estimatedNetAnnual: 14740,
        highSeasonADR: 155,
        lowSeasonADR: 70,
        annualOccupancy: 54,
        occupiedNights: 135
      },
      2: {
        bedrooms: 2,
        label: '2 Habitaciones (Dato Base Real de Mercado / 4-6 plazas)',
        guestCapacity: '4 - 6 personas',
        isRealBase: true,
        extrapolationFactor: 1.0,
        extrapolationNote: 'Base real verificada: Tipología reina (49% de la oferta vacacional de Peñíscola).',
        averageGrossAnnual: 20500,
        optimizedGrossAnnual: 24200,
        estimatedNetAnnual: 18870,
        highSeasonADR: 205,
        lowSeasonADR: 85,
        annualOccupancy: 56,
        occupiedNights: 145
      },
      3: {
        bedrooms: 3,
        label: '3 Habitaciones (Familias / 6-8 plazas)',
        guestCapacity: '6 - 8 personas',
        isRealBase: false,
        extrapolationFactor: 1.20,
        extrapolationNote: '+20% vs 2 hab: Mayor capacidad de grupo familiar que eleva el ADR diario.',
        averageGrossAnnual: 24600,
        optimizedGrossAnnual: 29100,
        estimatedNetAnnual: 22700,
        highSeasonADR: 250,
        lowSeasonADR: 98,
        annualOccupancy: 57,
        occupiedNights: 148
      },
      4: {
        bedrooms: 4,
        label: '4 Habitaciones (Grupos / 8-10+ plazas)',
        guestCapacity: '8 - 10+ personas',
        isRealBase: false,
        extrapolationFactor: 1.38,
        extrapolationNote: '+38% vs 2 hab (+15% vs 3 hab): Muy escasos en playa, demanda turística premium.',
        averageGrossAnnual: 28300,
        optimizedGrossAnnual: 33400,
        estimatedNetAnnual: 26050,
        highSeasonADR: 295,
        lowSeasonADR: 115,
        annualOccupancy: 55,
        occupiedNights: 142
      }
    }
  },
  vinaroz: {
    id: 'vinaroz',
    name: 'Vinaròs',
    shortTagline: 'Motor Gastronómico y Comercial del Baix Maestrat',
    twoBedroomShare: '52% del mercado en casco urbano y calas',
    marketHighlights: 'Fuerte desestacionalización vacacional durante todo el año impulsada por sus Carnavales de Interés Turístico, eventos gastronómicos y turismo de calas.',
    officialSources: 'AirDNA Market Intelligence, GuestFavorites & Registro Turisme CV 2025/2026',
    bedroomsData: {
      1: {
        bedrooms: 1,
        label: '1 Habitación (2 - 3 plazas)',
        guestCapacity: '2 - 3 personas',
        isRealBase: false,
        extrapolationFactor: 0.78,
        extrapolationNote: 'Factor 0.78x: Ideal para escapadas en pareja o teletrabajadores de temporada.',
        averageGrossAnnual: 14300,
        optimizedGrossAnnual: 17000,
        estimatedNetAnnual: 13260,
        highSeasonADR: 135,
        lowSeasonADR: 65,
        annualOccupancy: 56,
        occupiedNights: 140
      },
      2: {
        bedrooms: 2,
        label: '2 Habitaciones (Dato Base Real de Mercado / 4-6 plazas)',
        guestCapacity: '4 - 6 personas',
        isRealBase: true,
        extrapolationFactor: 1.0,
        extrapolationNote: 'Base real verificada: La tipología estándar en el paseo marítimo y calas de Vinaròs.',
        averageGrossAnnual: 18400,
        optimizedGrossAnnual: 21800,
        estimatedNetAnnual: 17000,
        highSeasonADR: 175,
        lowSeasonADR: 75,
        annualOccupancy: 58,
        occupiedNights: 146
      },
      3: {
        bedrooms: 3,
        label: '3 Habitaciones (Familias / 6-8 plazas)',
        guestCapacity: '6 - 8 personas',
        isRealBase: false,
        extrapolationFactor: 1.20,
        extrapolationNote: '+20% vs 2 hab: Preferido por familias durante vacaciones estivales y fiestas patronales.',
        averageGrossAnnual: 22100,
        optimizedGrossAnnual: 26200,
        estimatedNetAnnual: 20430,
        highSeasonADR: 215,
        lowSeasonADR: 88,
        annualOccupancy: 59,
        occupiedNights: 150
      },
      4: {
        bedrooms: 4,
        label: '4 Habitaciones (Grupos / 8-10+ plazas)',
        guestCapacity: '8 - 10+ personas',
        isRealBase: false,
        extrapolationFactor: 1.38,
        extrapolationNote: '+38% vs 2 hab: Apartamentos amplios con reservas completas en julio y agosto.',
        averageGrossAnnual: 25400,
        optimizedGrossAnnual: 30100,
        estimatedNetAnnual: 23470,
        highSeasonADR: 255,
        lowSeasonADR: 105,
        annualOccupancy: 56,
        occupiedNights: 144
      }
    }
  },
  benicarlo: {
    id: 'benicarlo',
    name: 'Benicarló',
    shortTagline: 'Autenticidad Marinera, Puerto y Alta Rentabilidad',
    twoBedroomShare: '46% de los apartamentos vacacionales',
    marketHighlights: 'Menor precio de adquisición con rendimientos porcentuales sobre inversión muy elevados. Beneficiada por su cercanía inmediata a Peñíscola y su puerto náutico.',
    officialSources: 'AirROI / AirDNA Benicarló Index 2025/2026, INE Alojamientos Turísticos',
    bedroomsData: {
      1: {
        bedrooms: 1,
        label: '1 Habitación (2 - 3 plazas)',
        guestCapacity: '2 - 3 personas',
        isRealBase: false,
        extrapolationFactor: 0.78,
        extrapolationNote: 'Factor 0.78x: Apartamentos cerca del puerto y playa Morrongo.',
        averageGrossAnnual: 12800,
        optimizedGrossAnnual: 15200,
        estimatedNetAnnual: 11850,
        highSeasonADR: 125,
        lowSeasonADR: 60,
        annualOccupancy: 46,
        occupiedNights: 128
      },
      2: {
        bedrooms: 2,
        label: '2 Habitaciones (Dato Base Real de Mercado / 4-6 plazas)',
        guestCapacity: '4 - 6 personas',
        isRealBase: true,
        extrapolationFactor: 1.0,
        extrapolationNote: 'Base real verificada: Media anual de 147$ ADR según AirROI.',
        averageGrossAnnual: 16500,
        optimizedGrossAnnual: 19500,
        estimatedNetAnnual: 15210,
        highSeasonADR: 160,
        lowSeasonADR: 70,
        annualOccupancy: 48,
        occupiedNights: 135
      },
      3: {
        bedrooms: 3,
        label: '3 Habitaciones (Familias / 6-8 plazas)',
        guestCapacity: '6 - 8 personas',
        isRealBase: false,
        extrapolationFactor: 1.20,
        extrapolationNote: '+20% vs 2 hab: Apartamentos con terraza en zona Caracola y puerto.',
        averageGrossAnnual: 19800,
        optimizedGrossAnnual: 23400,
        estimatedNetAnnual: 18250,
        highSeasonADR: 195,
        lowSeasonADR: 82,
        annualOccupancy: 49,
        occupiedNights: 138
      },
      4: {
        bedrooms: 4,
        label: '4 Habitaciones (Grupos / 8-10+ plazas)',
        guestCapacity: '8 - 10+ personas',
        isRealBase: false,
        extrapolationFactor: 1.38,
        extrapolationNote: '+38% vs 2 hab: Viviendas unifamiliares y áticos de costa.',
        averageGrossAnnual: 22800,
        optimizedGrossAnnual: 26900,
        estimatedNetAnnual: 20980,
        highSeasonADR: 230,
        lowSeasonADR: 98,
        annualOccupancy: 47,
        occupiedNights: 132
      }
    }
  },
  oropesa: {
    id: 'oropesa',
    name: 'Oropesa del Mar',
    shortTagline: 'Epicentro Vacacional Familiar y Playa de La Concha',
    twoBedroomShare: '58% del parque vacacional turístico (Marina d\'Or & Playas)',
    marketHighlights: 'Más de 1.100 apartamentos turísticos registrados. Con la reapertura de Magic World y sus playas galardonadas, el verano alcanza hasta el 96% de ocupación.',
    officialSources: 'Airbtics & AirDNA Oropesa del Mar Report 2025/2026, Turisme CV',
    bedroomsData: {
      1: {
        bedrooms: 1,
        label: '1 Habitación (2 - 3 plazas)',
        guestCapacity: '2 - 3 personas',
        isRealBase: false,
        extrapolationFactor: 0.78,
        extrapolationNote: 'Factor 0.78x: Estudios y 1 dormitorio en primera y segunda línea.',
        averageGrossAnnual: 15200,
        optimizedGrossAnnual: 18200,
        estimatedNetAnnual: 14190,
        highSeasonADR: 145,
        lowSeasonADR: 65,
        annualOccupancy: 50,
        occupiedNights: 136
      },
      2: {
        bedrooms: 2,
        label: '2 Habitaciones (Dato Base Real de Mercado / 4-6 plazas)',
        guestCapacity: '4 - 6 personas',
        isRealBase: true,
        extrapolationFactor: 1.0,
        extrapolationNote: 'Base real verificada: Media de ~19.500€ brutos en datos oficiales de Airbtics/AirDNA.',
        averageGrossAnnual: 19500,
        optimizedGrossAnnual: 23400,
        estimatedNetAnnual: 18250,
        highSeasonADR: 190,
        lowSeasonADR: 75,
        annualOccupancy: 52,
        occupiedNights: 142
      },
      3: {
        bedrooms: 3,
        label: '3 Habitaciones (Familias / 6-8 plazas)',
        guestCapacity: '6 - 8 personas',
        isRealBase: false,
        extrapolationFactor: 1.20,
        extrapolationNote: '+20% vs 2 hab: Idóneo para vacaciones multigeneracionales familiares con niños.',
        averageGrossAnnual: 23400,
        optimizedGrossAnnual: 28100,
        estimatedNetAnnual: 21910,
        highSeasonADR: 235,
        lowSeasonADR: 88,
        annualOccupancy: 53,
        occupiedNights: 145
      },
      4: {
        bedrooms: 4,
        label: '4 Habitaciones (Grupos / 8-10+ plazas)',
        guestCapacity: '8 - 10+ personas',
        isRealBase: false,
        extrapolationFactor: 1.38,
        extrapolationNote: '+38% vs 2 hab: Áticos dúplex con vistas al mar o zonas comunitarias amplias.',
        averageGrossAnnual: 26900,
        optimizedGrossAnnual: 32300,
        estimatedNetAnnual: 25190,
        highSeasonADR: 275,
        lowSeasonADR: 105,
        annualOccupancy: 51,
        occupiedNights: 140
      }
    }
  },
  alcossebre: {
    id: 'alcossebre',
    name: 'Alcossebre (Alcalà de Xivert)',
    shortTagline: 'Turismo Residencial Premium y Sierra de Irta',
    twoBedroomShare: '50% de los apartamentos vacacionales',
    marketHighlights: 'Baja densidad de edificación, calas vírgenes y clientela familiar con alto poder adquisitivo. Temporada extendida de primavera a otoño por turismo de naturaleza.',
    officialSources: 'Airbtics & GuestFavorites Alcossebre Market Report 2025/2026',
    bedroomsData: {
      1: {
        bedrooms: 1,
        label: '1 Habitación (2 - 3 plazas)',
        guestCapacity: '2 - 3 personas',
        isRealBase: false,
        extrapolationFactor: 0.78,
        extrapolationNote: 'Factor 0.78x: Apartamentos en Las Fuentes y playa Romana.',
        averageGrossAnnual: 18800,
        optimizedGrossAnnual: 21600,
        estimatedNetAnnual: 16840,
        highSeasonADR: 160,
        lowSeasonADR: 75,
        annualOccupancy: 59,
        occupiedNights: 148
      },
      2: {
        bedrooms: 2,
        label: '2 Habitaciones (Dato Base Real de Mercado / 4-6 plazas)',
        guestCapacity: '4 - 6 personas',
        isRealBase: true,
        extrapolationFactor: 1.0,
        extrapolationNote: 'Base real verificada: Media de ~24.200€ brutos en datos de mercado de Alcossebre.',
        averageGrossAnnual: 24200,
        optimizedGrossAnnual: 27800,
        estimatedNetAnnual: 21680,
        highSeasonADR: 205,
        lowSeasonADR: 85,
        annualOccupancy: 61,
        occupiedNights: 155
      },
      3: {
        bedrooms: 3,
        label: '3 Habitaciones (Familias / 6-8 plazas)',
        guestCapacity: '6 - 8 personas',
        isRealBase: false,
        extrapolationFactor: 1.20,
        extrapolationNote: '+20% vs 2 hab: Muy demandado por familias europeas con estancias vacacionales de 2 semanas.',
        averageGrossAnnual: 29000,
        optimizedGrossAnnual: 33400,
        estimatedNetAnnual: 26050,
        highSeasonADR: 250,
        lowSeasonADR: 100,
        annualOccupancy: 62,
        occupiedNights: 158
      },
      4: {
        bedrooms: 4,
        label: '4 Habitaciones (Grupos / 8-10+ plazas)',
        guestCapacity: '8 - 10+ personas',
        isRealBase: false,
        extrapolationFactor: 1.38,
        extrapolationNote: '+38% vs 2 hab: Apartamentos y áticos exclusivos con gran terraza y piscina.',
        averageGrossAnnual: 33400,
        optimizedGrossAnnual: 38400,
        estimatedNetAnnual: 29950,
        highSeasonADR: 290,
        lowSeasonADR: 120,
        annualOccupancy: 60,
        occupiedNights: 152
      }
    }
  },
  benicassim: {
    id: 'benicassim',
    name: 'Benicàssim',
    shortTagline: 'La Joya del Mediterráneo, Playas & Grandes Festivales',
    twoBedroomShare: '44% del parque turístico (alta presencia de 3 y 4 hab)',
    marketHighlights: 'La plaza más cotizada de la provincia con ingresos vacacionales que superan los 32.000€ brutos gracias a su temporada estival y festivales de música internacionales.',
    officialSources: 'AirDNA Benicàssim Intelligence & GuestFavorites Report 2025/2026',
    bedroomsData: {
      1: {
        bedrooms: 1,
        label: '1 Habitación (2 - 3 plazas)',
        guestCapacity: '2 - 3 personas',
        isRealBase: false,
        extrapolationFactor: 0.78,
        extrapolationNote: 'Factor 0.78x: Alta demanda en semanas de festivales y puentes.',
        averageGrossAnnual: 21400,
        optimizedGrossAnnual: 25300,
        estimatedNetAnnual: 19730,
        highSeasonADR: 190,
        lowSeasonADR: 85,
        annualOccupancy: 60,
        occupiedNights: 152
      },
      2: {
        bedrooms: 2,
        label: '2 Habitaciones (Dato Base Real de Mercado / 4-6 plazas)',
        guestCapacity: '4 - 6 personas',
        isRealBase: true,
        extrapolationFactor: 1.0,
        extrapolationNote: 'Base real verificada: Media de 27.500€ brutos en AirDNA (hasta 32.500€ con gestión optimizada).',
        averageGrossAnnual: 27500,
        optimizedGrossAnnual: 32500,
        estimatedNetAnnual: 25350,
        highSeasonADR: 245,
        lowSeasonADR: 95,
        annualOccupancy: 62,
        occupiedNights: 160
      },
      3: {
        bedrooms: 3,
        label: '3 Habitaciones (Familias / 6-8 plazas)',
        guestCapacity: '6 - 8 personas',
        isRealBase: false,
        extrapolationFactor: 1.20,
        extrapolationNote: '+20% vs 2 hab: Tarifas de 300€/noche en julio y agosto.',
        averageGrossAnnual: 33000,
        optimizedGrossAnnual: 39000,
        estimatedNetAnnual: 30420,
        highSeasonADR: 300,
        lowSeasonADR: 115,
        annualOccupancy: 63,
        occupiedNights: 164
      },
      4: {
        bedrooms: 4,
        label: '4 Habitaciones (Grupos / 8-10+ plazas)',
        guestCapacity: '8 - 10+ personas',
        isRealBase: false,
        extrapolationFactor: 1.38,
        extrapolationNote: '+38% vs 2 hab: Apartamentos y villas en Las Villas y Torre Bellver con tarifas récord.',
        averageGrossAnnual: 38000,
        optimizedGrossAnnual: 44800,
        estimatedNetAnnual: 34940,
        highSeasonADR: 360,
        lowSeasonADR: 135,
        annualOccupancy: 61,
        occupiedNights: 158
      }
    }
  }
};

export const EXTRAPOLATION_EXPLANATION = {
  title: '¿Cómo calculamos la extrapolación vacacional a 3 y 4 habitaciones?',
  badge: 'Metodología Estadística de Alquiler Vacacional Turístico',
  summary: 'En el alquiler vacacional turístico de apartamentos, la rentabilidad no aumenta por metros cuadrados planos, sino por capacidad de plazas para familias y grupos de huéspedes.',
  bulletPoints: [
    {
      label: 'Dato Base Real Vacacional (2 Habitaciones)',
      description: 'Es la tipología de referencia analizada en los informes oficiales de AirDNA y Turisme Comunitat Valenciana, al representar cerca del 50% de todos los apartamentos turísticos en la Costa de Castellón.'
    },
    {
      label: 'Apartamento de 3 Habitaciones (+20% de ingresos turísticos)',
      description: 'La capacidad pasa de 4 a 6-8 personas. Permite alojar familias completas con hijos y abuelos, un segmento turístico de gran valor que acepta tarifas diarias de temporada alta notablemente superiores.'
    },
    {
      label: 'Apartamento de 4 Habitaciones (+38% sobre 2 hab / +15% sobre 3 hab)',
      description: 'Muy escasos en primera y segunda línea de playa. Aloja cómodamente a 2 familias juntas (8-10 plazas), logrando tarifas récord por noche y reservas de semanas completas garantizadas en verano.'
    }
  ]
};
