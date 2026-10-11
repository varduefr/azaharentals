/**
 * Motor de Cálculo de Tarifas Dinámicas y Calendario de Booking.com
 * Azahar Rentals - Gestión de Alojamientos Turísticos
 */

export interface CustomDateRangeRate {
  id: string;
  label: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  pricePerNight: number;
}

export interface BookingSeasonRateConfig {
  lowSeason: number;          // Temporada Baja: Ene, Feb, Mar, Nov, Dic (por defecto 70 €)
  midSeason: number;          // Temporada Media: Abr, May, Jun, Sep, Oct (por defecto 95 €)
  highSeasonJuly: number;     // Temporada Alta: Julio (por defecto 150 €)
  peakSeasonAugust: number;   // Temporada Punta: Agosto (por defecto 185 €)
  easterHoliday: number;      // Semana Santa / Puentes Especiales (por defecto 130 €)
  weekendSupplement: number;  // Suplemento viernes / sábado (0 € o configurable)
  customDateRanges: CustomDateRangeRate[];
}

export const DEFAULT_BOOKING_RATES: BookingSeasonRateConfig = {
  lowSeason: 70,
  midSeason: 95,
  highSeasonJuly: 150,
  peakSeasonAugust: 185,
  easterHoliday: 130,
  weekendSupplement: 0,
  customDateRanges: []
};

export interface NightRateDetail {
  date: string; // YYYY-MM-DD
  price: number;
  seasonName: string;
  isWeekend: boolean;
}

export interface BookingStayCalculation {
  nightsCount: number;
  totalPrice: number;
  averagePricePerNight: number;
  dominantSeason: string;
  seasonBreakdown: Array<{
    seasonName: string;
    nights: number;
    ratePerNight: number;
    subtotal: number;
  }>;
  nightsDetail: NightRateDetail[];
}

const STORAGE_PREFIX = 'booking_rates_';

/**
 * Genera tarifas estacionales predeterminadas y realistas basadas en el precio base del apartamento
 */
export function getDefaultRatesForApartment(basePrice: number = 70): BookingSeasonRateConfig {
  const base = Math.max(30, Math.round(basePrice));
  return {
    lowSeason: base,
    midSeason: Math.round(base * 1.35),
    highSeasonJuly: Math.round(base * 2.15),
    peakSeasonAugust: Math.round(base * 2.65),
    easterHoliday: Math.round(base * 1.85),
    weekendSupplement: 0,
    customDateRanges: []
  };
}

/**
 * Obtiene la configuración de tarifas guardada para un apartamento
 */
export function getStoredBookingRates(aptId: string = 'apt-peniscola-primero', fallbackBasePrice: number = 70): BookingSeasonRateConfig {
  const defaultFallback = getDefaultRatesForApartment(fallbackBasePrice);
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${aptId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        lowSeason: Number(parsed.lowSeason) || defaultFallback.lowSeason,
        midSeason: Number(parsed.midSeason) || defaultFallback.midSeason,
        highSeasonJuly: Number(parsed.highSeasonJuly) || defaultFallback.highSeasonJuly,
        peakSeasonAugust: Number(parsed.peakSeasonAugust) || defaultFallback.peakSeasonAugust,
        easterHoliday: Number(parsed.easterHoliday) || defaultFallback.easterHoliday,
        weekendSupplement: Number(parsed.weekendSupplement) || 0,
        customDateRanges: Array.isArray(parsed.customDateRanges) ? parsed.customDateRanges : []
      };
    }
  } catch (err) {
    console.warn('Error leyendo tarifas de Booking de localStorage:', err);
  }
  return defaultFallback;
}

/**
 * Obtiene las tarifas de Booking configuradas para un apartamento concreto
 */
export function getApartmentBookingRates(apt: { id: string; basePricePerNight?: number; rates?: BookingSeasonRateConfig }): BookingSeasonRateConfig {
  if (!apt) return { ...DEFAULT_BOOKING_RATES };
  
  // 1. Prioridad: LocalStorage personalizado del usuario
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${apt.id}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.lowSeason === 'number') {
        return {
          lowSeason: Number(parsed.lowSeason),
          midSeason: Number(parsed.midSeason) || Math.round(Number(parsed.lowSeason) * 1.35),
          highSeasonJuly: Number(parsed.highSeasonJuly) || Math.round(Number(parsed.lowSeason) * 2.15),
          peakSeasonAugust: Number(parsed.peakSeasonAugust) || Math.round(Number(parsed.lowSeason) * 2.65),
          easterHoliday: Number(parsed.easterHoliday) || Math.round(Number(parsed.lowSeason) * 1.85),
          weekendSupplement: Number(parsed.weekendSupplement) || 0,
          customDateRanges: Array.isArray(parsed.customDateRanges) ? parsed.customDateRanges : []
        };
      }
    }
  } catch (err) {
    console.warn('Error leyendo localStorage de tarifas:', err);
  }

  // 2. Si el apartamento tiene rates explícitas en su modelo (Firestore / catálogo)
  if (apt.rates && typeof apt.rates.lowSeason === 'number') {
    return { ...apt.rates };
  }

  // 3. Fallback inteligente basado en su propio basePricePerNight
  return getDefaultRatesForApartment(apt.basePricePerNight || 70);
}

/**
 * Guarda la configuración de tarifas de Booking en localStorage y emite evento global
 */
export function saveStoredBookingRates(aptId: string = 'apt-peniscola-primero', config: BookingSeasonRateConfig): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${aptId}`, JSON.stringify(config));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('azahar_rates_updated', { detail: { aptId, config } }));
    }
  } catch (err) {
    console.warn('Error guardando tarifas de Booking en localStorage:', err);
  }
}

/**
 * Comprueba si una fecha concreta cae en Semana Santa o festivo especial
 */
function isEasterOrHoliday(dateStr: string): boolean {
  // Semana Santa 2026: ~29 de marzo al 6 de abril
  // Semana Santa 2027: ~25 de marzo al 2 de abril
  // Fin de Año: 29 dic - 2 ene
  if (
    (dateStr >= '2026-03-27' && dateStr <= '2026-04-06') ||
    (dateStr >= '2027-03-24' && dateStr <= '2027-04-03') ||
    (dateStr >= '2026-12-30' && dateStr <= '2027-01-02') ||
    (dateStr >= '2027-12-30' && dateStr <= '2028-01-02')
  ) {
    return true;
  }
  return false;
}

/**
 * Determina el precio y temporada para una noche específica (formato YYYY-MM-DD)
 */
export function getRateForNight(dateIso: string, rates: BookingSeasonRateConfig): { price: number; seasonName: string; isWeekend: boolean } {
  // 1. Comprobar reglas de fechas personalizadas
  if (rates.customDateRanges && rates.customDateRanges.length > 0) {
    for (const range of rates.customDateRanges) {
      if (dateIso >= range.startDate && dateIso <= range.endDate) {
        return {
          price: range.pricePerNight,
          seasonName: range.label || 'Tarifa Especial Booking',
          isWeekend: false
        };
      }
    }
  }

  // 2. Comprobar Semana Santa y Fin de Año
  if (isEasterOrHoliday(dateIso)) {
    return {
      price: rates.easterHoliday,
      seasonName: 'Semana Santa / Puentes',
      isWeekend: false
    };
  }

  // 3. Temporadas por mes
  const parts = dateIso.split('-');
  const month = parts.length >= 2 ? parseInt(parts[1], 10) : 1; // 1 to 12
  const dateObj = new Date(dateIso);
  const dayOfWeek = dateObj.getUTCDay(); // 0: Dom, 5: Vie, 6: Sab
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
  const weekendExtra = isWeekend && rates.weekendSupplement > 0 ? rates.weekendSupplement : 0;

  if (month === 8) {
    // Agosto
    return {
      price: rates.peakSeasonAugust + weekendExtra,
      seasonName: 'Temporada Punta (Agosto)',
      isWeekend
    };
  } else if (month === 7) {
    // Julio
    return {
      price: rates.highSeasonJuly + weekendExtra,
      seasonName: 'Temporada Alta (Julio)',
      isWeekend
    };
  } else if (month === 4 || month === 5 || month === 6 || month === 9 || month === 10) {
    // Abril, Mayo, Junio, Septiembre, Octubre
    const monthNames: Record<number, string> = {
      4: 'Abril',
      5: 'Mayo',
      6: 'Junio',
      9: 'Septiembre',
      10: 'Octubre'
    };
    return {
      price: rates.midSeason + weekendExtra,
      seasonName: `Temporada Media (${monthNames[month] || 'Primavera/Otoño'})`,
      isWeekend
    };
  } else {
    // Enero, Febrero, Marzo, Noviembre, Diciembre
    return {
      price: rates.lowSeason + weekendExtra,
      seasonName: 'Temporada Baja (Invierno)',
      isWeekend
    };
  }
}

/**
 * Calcula el importe total, desglose y tarifa media de una estancia entre checkIn y checkOut
 */
export function calculateBookingStayRate(
  checkIn: string,
  checkOut: string,
  rates: BookingSeasonRateConfig = DEFAULT_BOOKING_RATES
): BookingStayCalculation {
  if (!checkIn || !checkOut) {
    return {
      nightsCount: 1,
      totalPrice: rates.lowSeason,
      averagePricePerNight: rates.lowSeason,
      dominantSeason: 'Temporada Baja (Invierno)',
      seasonBreakdown: [
        {
          seasonName: 'Temporada Baja (Invierno)',
          nights: 1,
          ratePerNight: rates.lowSeason,
          subtotal: rates.lowSeason
        }
      ],
      nightsDetail: [
        {
          date: checkIn || '2026-09-09',
          price: rates.lowSeason,
          seasonName: 'Temporada Baja (Invierno)',
          isWeekend: false
        }
      ]
    };
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  let calculatedNights = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (calculatedNights <= 0) calculatedNights = 1;

  const nightsDetail: NightRateDetail[] = [];
  const seasonGroups: Record<string, { count: number; sum: number; lastRate: number }> = {};
  let total = 0;

  for (let i = 0; i < calculatedNights; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const { price, seasonName, isWeekend } = getRateForNight(dateStr, rates);
    nightsDetail.push({
      date: dateStr,
      price,
      seasonName,
      isWeekend
    });

    total += price;

    if (!seasonGroups[seasonName]) {
      seasonGroups[seasonName] = { count: 0, sum: 0, lastRate: price };
    }
    seasonGroups[seasonName].count += 1;
    seasonGroups[seasonName].sum += price;
    seasonGroups[seasonName].lastRate = price;
  }

  // Determinar temporada dominante (la que tiene más noches)
  let dominantSeason = 'Tarifa Booking.com';
  let maxCount = -1;
  const breakdown: Array<{
    seasonName: string;
    nights: number;
    ratePerNight: number;
    subtotal: number;
  }> = [];

  for (const [season, data] of Object.entries(seasonGroups)) {
    if (data.count > maxCount) {
      maxCount = data.count;
      dominantSeason = season;
    }
    breakdown.push({
      seasonName: season,
      nights: data.count,
      ratePerNight: Math.round(data.sum / data.count),
      subtotal: data.sum
    });
  }

  const averagePricePerNight = Math.round(total / calculatedNights);

  return {
    nightsCount: calculatedNights,
    totalPrice: total,
    averagePricePerNight,
    dominantSeason,
    seasonBreakdown: breakdown,
    nightsDetail
  };
}
