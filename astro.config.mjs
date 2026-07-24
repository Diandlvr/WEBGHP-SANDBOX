// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://globalhotelpanama.com',

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: true, // /es/ y /en/ ambos explícitos
      redirectToDefaultLocale: false,
    },
  },

  integrations: [sitemap()],
});