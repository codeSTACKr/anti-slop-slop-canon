// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Static output only. The showcase ships as pre-rendered HTML with no
  // server runtime, no hosted model, and no text sent to any service.
  output: 'static',
  site: 'https://useantislop.com',
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
});
