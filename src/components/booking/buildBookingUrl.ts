// Construcción del deep link al motor de reservas e-gds (motor propio del hotel).
// Toda la lógica del enlace vive aquí, aislada y testeada: si el motor cambia el
// formato de parámetros, es una edición de una línea + un test.
//
// Parámetros detectados inspeccionando el motor (light):
//   arrivaldate / departuredate  → AAAAMMDD
//   Ocupancy                     → nº de huéspedes
//   HotelID                      → 14
// TODO(juan): confirmar estos nombres con una búsqueda real en el motor y pegar la URL resultante.

export const BOOKING_BASE = 'https://secuream3.e-gdscloud.com/globalhotelpanama/light/';
export const HOTEL_ID = '14';

export interface BookingQuery {
  /** Fecha de entrada: 'YYYY-MM-DD' o Date */
  checkIn?: string | Date;
  /** Fecha de salida: 'YYYY-MM-DD' o Date */
  checkOut?: string | Date;
  /** Nº de huéspedes (adultos) */
  guests?: number;
  /** Código promocional opcional */
  promo?: string;
}

/** Normaliza a Date a partir de 'YYYY-MM-DD' o Date. Devuelve null si es inválida. */
function toDate(value?: string | Date): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Formatea una fecha como AAAAMMDD (formato que espera el motor). */
export function toYmd(value?: string | Date): string | null {
  const d = toDate(value);
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/**
 * Devuelve la URL del motor con la búsqueda ya rellenada.
 * Si faltan fechas o la salida no es posterior a la entrada, devuelve la URL base
 * (fallback seguro: el motor abre igual, sin búsqueda prefijada).
 */
export function buildBookingUrl(query: BookingQuery = {}): string {
  const params = new URLSearchParams({ HotelID: HOTEL_ID });

  const arrival = toDate(query.checkIn);
  const departure = toDate(query.checkOut);
  const validRange = arrival && departure && departure.getTime() > arrival.getTime();

  if (validRange) {
    params.set('arrivaldate', toYmd(arrival)!);
    params.set('departuredate', toYmd(departure)!);
  }

  if (query.guests && query.guests > 0) {
    params.set('Ocupancy', String(Math.floor(query.guests)));
  }

  if (query.promo && query.promo.trim()) {
    // TODO(juan): confirmar el nombre real del parámetro de promoción en el motor.
    params.set('promocode', query.promo.trim());
  }

  return `${BOOKING_BASE}?${params.toString()}`;
}
