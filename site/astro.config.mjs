// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Static output only. The showcase ships as pre-rendered HTML with no
  // server runtime, no hosted model, and no text sent to any service.
  output: 'static',
  site: 'https://anti-slop-slop-canon.example',
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
