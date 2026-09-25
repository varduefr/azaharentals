/**
 * Sincronizador y analizador del calendario oficial iCal de Booking.com
 * Azahar Rentals - Gestión de Alojamientos Turísticos
 */

export interface IcalBlockedEvent {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  summary: string;
  uid?: string;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  conflictingEvent?: IcalBlockedEvent;
  allEventsCount: number;
  lastChecked: string;
}

export const DEFAULT_PENISCOLA_ICAL_URL =
  'https://ical.booking.com/v1/export?t=266de0d0-36d0-4722-9983-119cc7b7f399';

// Copia de seguridad del feed oficial para disponibilidad inmediata y tolerancia a fallos
export const INITIAL_BOOKING_ICAL_SNAPSHOT = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//admin.booking.com\\, b.v.//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20260908
DTEND;VALUE=DATE:20260921
UID:705b667c9bbe944c2e6f19ae0c01096c@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20260924
DTEND;VALUE=DATE:20260926
UID:4500e7f00cf9d308887c0b45dd1596f2@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20261008
DTEND;VALUE=DATE:20261012
UID:aa92a57136a85b81cfee3c964b20fa69@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20261017
DTEND;VALUE=DATE:20261019
UID:0e8926242cd24d0b4da0c94b16e45bcd@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20261224
DTEND;VALUE=DATE:20261227
UID:3bda60a65d94ecca3a0f75181db4d69a@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20261230
DTEND;VALUE=DATE:20270101
UID:90cdb585d6c3b3507aeeef4009fa4c6d@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270326
DTEND;VALUE=DATE:20270329
UID:ef27cbe62a773ea246297fead51ce95d@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270415
DTEND;VALUE=DATE:20270418
UID:abd6c784c7bbf96fd179578038cfa3ec@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270423
DTEND;VALUE=DATE:20270425
UID:bd58e7c5f99c8ddb2edfd2d13e384864@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270527
DTEND;VALUE=DATE:20270531
UID:cb3414eafc5b63b98b406cbd34423776@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270612
DTEND;VALUE=DATE:20270627
UID:94fcf35893f1a85455b03d5568a969f0@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270628
DTEND;VALUE=DATE:20270709
UID:4125dc5f71c75a9a85dc599de2a9da91@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270724
DTEND;VALUE=DATE:20270731
UID:af9b01453b78c0ed39a24c7444221311@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270801
DTEND;VALUE=DATE:20270815
UID:279a5861d05b4d0f9a3c0d155ea60ab6@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270816
DTEND;VALUE=DATE:20270826
UID:346b740c3bb4d0803b5e085ec896bcbb@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
BEGIN:VEVENT
DTSTAMP:20260908T113356Z
DTSTART;VALUE=DATE:20270901
DTEND;VALUE=DATE:20280308
UID:6894da1e67f4f478c252fcf505c4e659@booking.com
SUMMARY:CLOSED - Not available
ORGANIZER:mailto:noreply@booking.com
END:VEVENT
END:VCALENDAR`;

/**
 * Parsea el formato textual iCal (.ics) y extrae los rangos de fechas bloqueadas
 */
export function parseIcalContent(icsText: string): IcalBlockedEvent[] {
  const events: IcalBlockedEvent[] = [];
  if (!icsText) return events;

  const eventBlocks = icsText.split('BEGIN:VEVENT');
  // descartar el preludio antes del primer VEVENT
  eventBlocks.shift();

  for (const block of eventBlocks) {
    const rawLines = block.split(/\r?\n/);
    let start = '';
    let end = '';
    let summary = 'Ocupado / No disponible';
    let uid = '';

    for (const line of rawLines) {
      const cleanLine = line.trim();
      if (cleanLine.startsWith('DTSTART')) {
        const parts = cleanLine.split(':');
        if (parts[1]) {
          start = parseIcalDate(parts[1]);
        }
      } else if (cleanLine.startsWith('DTEND')) {
        const parts = cleanLine.split(':');
        if (parts[1]) {
          end = parseIcalDate(parts[1]);
        }
      } else if (cleanLine.startsWith('SUMMARY:')) {
        summary = cleanLine.replace('SUMMARY:', '').trim();
      } else if (cleanLine.startsWith('UID:')) {
        uid = cleanLine.replace('UID:', '').trim();
      } else if (cleanLine === 'END:VEVENT') {
        break;
      }
    }

    if (start && end) {
      events.push({
        start,
        end,
        summary: summary || 'No disponible en Booking.com',
        uid
      });
    }
  }

  return events;
}

/**
 * Convierte strings como "20260908" o "20260908T120000Z" a "2026-09-08"
 */
function parseIcalDate(dateStr: string): string {
  const digits = dateStr.replace(/[^0-9]/g, '');
  if (digits.length >= 8) {
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);
    return `${y}-${m}-${d}`;
  }
  return dateStr;
}

/**
 * Comprueba si el rango solicitado (checkIn -> checkOut) se solapa con algún período bloqueado
 */
export function checkAvailability(
  checkIn: string,
  checkOut: string,
  events: IcalBlockedEvent[]
): AvailabilityResult {
  const lastChecked = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  if (!checkIn || !checkOut) {
    return {
      isAvailable: true,
      allEventsCount: events.length,
      lastChecked
    };
  }

  const requestedStart = new Date(checkIn).getTime();
  const requestedEnd = new Date(checkOut).getTime();

  for (const event of events) {
    const eventStart = new Date(event.start).getTime();
    const eventEnd = new Date(event.end).getTime();

    // Hay solapamiento si la entrada es anterior a la fecha de fin del evento
    // Y la salida es posterior a la fecha de inicio del evento
    if (requestedStart < eventEnd && requestedEnd > eventStart) {
      return {
        isAvailable: false,
        conflictingEvent: event,
        allEventsCount: events.length,
        lastChecked
      };
    }
  }

  return {
    isAvailable: true,
    allEventsCount: events.length,
    lastChecked
  };
}

/**
 * Descarga el feed iCal desde el endpoint proxy o mediante fallback seguro
 */
export async function fetchBookingIcalFeed(url: string): Promise<IcalBlockedEvent[]> {
  const targetUrl = url.trim() || DEFAULT_PENISCOLA_ICAL_URL;

  try {
    // Intentar primero a través de nuestro proxy de servidor Vite
    const proxyUrl = `/api/booking-ical?url=${encodeURIComponent(targetUrl)}`;
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/calendar, text/plain, */*'
      }
    });

    if (response.ok) {
      const text = await response.text();
      const parsed = parseIcalContent(text);
      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.info('Proxy iCal temporalmente no disponible, usando fallback sincronizado:', err);
  }

  // Fallback con el snapshot oficial verificado
  return parseIcalContent(INITIAL_BOOKING_ICAL_SNAPSHOT);
}

/**
 * Formatea una fecha YYYY-MM-DD a formato español DD/MM/AAAA
 */
export function formatIcalDateEs(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDate;
}
