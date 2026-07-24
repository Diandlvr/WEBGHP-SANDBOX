// Definición de los "slots" de imagen del sitio. Cada slot es una posición fija
// que el editor puede reemplazar. El sitio importa estos archivos por nombre estable,
// de modo que subir una foto nueva solo cambia el archivo y el build la optimiza.
export const slots = [
  { id: 'hero',          label: 'Hero (portada)',           section: 'Inicio',       ratio: '16 / 9' },
  { id: 'about',         label: 'Nosotros',                 section: 'Nosotros',     ratio: '4 / 3'  },
  { id: 'room-standard', label: 'Habitación · Double Queen', section: 'Habitaciones', ratio: '4 / 3'  },
  { id: 'room-deluxe',   label: 'Habitación · King Bed',    section: 'Habitaciones', ratio: '4 / 3'  },
  { id: 'room-suite',    label: 'Suite · Ultra-Luxury',     section: 'Habitaciones', ratio: '4 / 3'  },
];
