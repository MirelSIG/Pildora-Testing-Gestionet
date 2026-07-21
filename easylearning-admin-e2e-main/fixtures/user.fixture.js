// Fixtures de autenticacion: dejan la sesion ya iniciada antes de que arranque cada test.
import { test as base } from '@playwright/test';

export const userFixtures = base.extend({
  // Inicia sesion como administrador y espera a llegar al panel /admin
  adminUser: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#inputEmail', process.env.ADMIN_EMAIL || 'alba.gonzalez.gestionet@gmail.com');
    await page.fill('#inputPassword', process.env.ADMIN_PASSWORD || '12345678');
    await Promise.all([
      page.waitForURL(/admin/i),
      page.click('button.buttonPrimary[type="submit"]'),
    ]);
    // Expone el email del usuario logueado al test que use esta fixture
    await use({ email: process.env.ADMIN_EMAIL || 'alba.gonzalez.gestionet@gmail.com' });
  },

  // Inicia sesion como usuario normal (alumno) y espera a llegar al campus
  normalUser: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#inputEmail', process.env.USER_EMAIL || 'albaUsuario@gmail.com');
    await page.fill('#inputPassword', process.env.USER_PASSWORD || '12345678');
    await Promise.all([
      page.waitForURL(/campus\/section/i),
      page.click('button.buttonPrimary[type="submit"]'),
    ]);
    await use({ email: 'albaUsuario@gmail.com' });
  },
});
