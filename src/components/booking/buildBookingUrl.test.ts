import { describe, it, expect } from 'vitest';
import { buildBookingUrl, toYmd, BOOKING_BASE } from './buildBookingUrl';

describe('toYmd', () => {
  it('formatea a AAAAMMDD', () => {
    expect(toYmd('2026-08-01')).toBe('20260801');
    expect(toYmd('2026-12-25')).toBe('20261225');
  });
  it('devuelve null con entrada inválida', () => {
    expect(toYmd(undefined)).toBeNull();
    expect(toYmd('no-es-fecha')).toBeNull();
  });
});

describe('buildBookingUrl', () => {
  it('sin datos devuelve la base con HotelID', () => {
    const url = buildBookingUrl();
    expect(url.startsWith(BOOKING_BASE)).toBe(true);
    expect(url).toContain('HotelID=14');
    expect(url).not.toContain('arrivaldate');
  });

  it('con rango válido incluye fechas y ocupación', () => {
    const url = buildBookingUrl({ checkIn: '2026-08-01', checkOut: '2026-08-03', guests: 2 });
    expect(url).toContain('arrivaldate=20260801');
    expect(url).toContain('departuredate=20260803');
    expect(url).toContain('Ocupancy=2');
  });

  it('si la salida no es posterior a la entrada, omite las fechas (fallback)', () => {
    const url = buildBookingUrl({ checkIn: '2026-08-03', checkOut: '2026-08-01', guests: 2 });
    expect(url).not.toContain('arrivaldate');
    expect(url).not.toContain('departuredate');
    expect(url).toContain('Ocupancy=2');
  });

  it('ignora fechas iguales', () => {
    const url = buildBookingUrl({ checkIn: '2026-08-01', checkOut: '2026-08-01' });
    expect(url).not.toContain('arrivaldate');
  });

  it('incluye el código promocional cuando se pasa', () => {
    const url = buildBookingUrl({ promo: 'VERANO' });
    expect(url).toContain('promocode=VERANO');
  });

  it('ignora huéspedes no positivos', () => {
    expect(buildBookingUrl({ guests: 0 })).not.toContain('Ocupancy');
  });
});
