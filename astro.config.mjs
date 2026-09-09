// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // output: 'static' genera un sitio estatico puro (ideal para Vercel sin SSR)
  output: 'static',

  // Configuracion del servidor de desarrollo local
  server: {
    port: 4321,
    host: true
  },

  // Optimizaciones del build final
  build: {
    // Inline solo hojas de estilo menores a 4kb para mejorar CLS
    inlineStylesheets: 'auto',
    // Genera assets con hash para cache-busting automatico
    assets: '_assets'
  },

  // Compresion de imagenes integrada de Astro
  image: {
    // No usar servicio externo para sitio estatico
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  },

  // Compatibilidad con Vite (bundler interno de Astro)
  vite: {
    build: {
      // Chunk size warning threshold
      chunkSizeWarningLimit: 1000
    }
  }
});
