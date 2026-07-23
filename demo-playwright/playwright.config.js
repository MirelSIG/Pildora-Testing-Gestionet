// @ts-check
// Configuracion de Playwright para la demo (backend + frontend propios).
const { defineConfig, devices } = require('@playwright/test');

const isUiMode = process.argv.includes('--ui');
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const useExternalServer = process.env.PLAYWRIGHT_USE_EXTERNAL_SERVER === '1' && !isUiMode;

module.exports = defineConfig({
  testDir: './tests', // Carpeta donde viven los specs
  fullyParallel: false, // Los tests comparten la misma BD, se ejecutan en serie
  workers: 1, // Un unico worker para evitar condiciones de carrera en la BD
  retries: process.env.CI ? 2 : 0, // En CI se reintenta 2 veces por si hay flakiness
  reporter: [['html', { open: 'never' }], ['list']], // Informe HTML (sin abrir navegador) + salida por consola

  use: {
    baseURL,
    ...(isUiMode ? { headless: false, launchOptions: { slowMo: 250 } } : {}),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Navegadores/motores contra los que se ejecuta la suite
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Playwright levanta automaticamente el backend + frontend antes de ejecutar
  // los tests, igual que haria un pipeline de CI/CD.
  webServer: useExternalServer
    ? undefined
    : {
        command: 'node server.js',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 15000,
      },
});
