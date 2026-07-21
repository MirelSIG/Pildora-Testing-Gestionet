// Configuracion de Playwright para la suite E2E del panel de administracion de EasyLearning.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Carpeta con los specs organizados por funcionalidad
  timeout: 30 * 1000, // Timeout maximo por test: 30s
  retries: 2, // Reintenta cada test hasta 2 veces si falla (mitiga flakiness)
  use: {
    baseURL: process.env.BASE_URL || 'https://dev-easylearning.gestionetdev.com', // Entorno de desarrollo por defecto
    headless: true, // Navegador sin interfaz grafica
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true, // Tolera certificados no validos en el entorno de dev
    screenshot: 'only-on-failure',
    video: 'retain-on-failure' // Solo conserva el video cuando el test falla
  },
  reporter: 'html'
});
