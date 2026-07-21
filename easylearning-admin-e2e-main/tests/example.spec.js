// @ts-check
// Test de ejemplo generado por Playwright, se mantiene como referencia/plantilla.
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Se espera que el titulo de la pagina contenga la subcadena "Playwright"
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click en el enlace "Get started"
  await page.getByRole('link', { name: 'Get started' }).click();

  // Se espera que la pagina muestre un encabezado con el nombre "Installation"
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
