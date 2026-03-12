import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  define: {
    // Algunos paquetes de butterchurn-presets o webamp pueden buscar 'global' o 'process.env'
    'global': 'window',
    'process.env': {}
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar las librerías grandes para evitar avisos de tamaño y mejorar el cacheo
          'webamp-vendor': ['webamp'],
          'butterchurn-vendor': ['butterchurn', 'butterchurn-presets']
        }
      }
    },
    commonjsOptions: {
      // Forzar la transformación de CommonJS para librerías problemáticas
      transformMixedEsModules: true,
    }
  }
});
