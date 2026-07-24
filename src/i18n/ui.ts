// Diccionario de strings de interfaz. EN sale del sitio actual (literal).
// ES redactado para revisión de Juan — TODO(juan): validar traducciones.
export const languages = { es: 'Español', en: 'English' } as const;
export const defaultLang = 'es';

export const ui = {
  es: {
    'nav.rooms': 'Habitaciones',
    'nav.offers': 'Ofertas',
    'nav.location': 'Ubicación',
    'nav.contact': 'Contacto',
    'nav.book': 'Reservar',
    'meta.title': 'Global Hotel Panamá · Hotel boutique de lujo en Obarrio',
    'meta.description':
      'Hotel boutique de lujo en la Twist Tower, Obarrio, Ciudad de Panamá. 60 habitaciones y suites, piscina rooftop y restaurante. Reserva directa.',
  },
  en: {
    'nav.rooms': 'Rooms',
    'nav.offers': 'Offers',
    'nav.location': 'Location',
    'nav.contact': 'Contact',
    'nav.book': 'Book Now',
    'meta.title': 'Global Hotel Panama · Boutique Luxury Hotel in Obarrio',
    'meta.description':
      'Boutique luxury hotel in the Twist Tower, Obarrio, Panama City. 60 rooms and suites, rooftop pool and fine dining. Book direct.',
  },
} as const;

export type Lang = keyof typeof ui;
