import { ui, defaultLang, type Lang } from './ui';

// Enlaces externos y constantes globales (decisiones D2/D3).
export const BOOKING_URL = 'https://secuream3.e-gdscloud.com/globalhotelpanama/light/';

/** Idioma a partir de la URL (/es/... o /en/...). */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

/** Traductor con fallback al idioma por defecto. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Ruta equivalente en el otro idioma, para el toggle y el hreflang. */
export function getAlternatePath(url: URL, target: Lang): string {
  const segments = url.pathname.split('/');
  segments[1] = target; // reemplaza el prefijo de idioma
  return segments.join('/') || `/${target}/`;
}
