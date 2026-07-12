import { test as base } from '@playwright/test';

export const userFixtures = base.extend({
  adminUser: async ({ page }, use) => {
    await page.goto('https://dev-easylearning.gestionetdev.com/login');
    await page.fill('#inputEmail', 'alba.gonzalez.gestionet@gmail.com');
    await page.fill('#inputPassword', '12345678');
    await Promise.all([
      page.waitForURL(/admin/i),
      page.click('button.buttonPrimary[type="submit"]'),
    ]);
    await use({ email: 'alba.gonzalez.gestionet@gmail.com' });
  },

  normalUser: async ({ page }, use) => {
    await page.goto('https://dev-easylearning.gestionetdev.com/login');
    await page.fill('#inputEmail', 'albaUsuario@gmail.com');
    await page.fill('#inputPassword', '12345678');
    await Promise.all([
      page.waitForURL(/campus\/section/i),
      page.click('button.buttonPrimary[type="submit"]'),
    ]);
    await use({ email: 'albaUsuario@gmail.com' });
  },
});
