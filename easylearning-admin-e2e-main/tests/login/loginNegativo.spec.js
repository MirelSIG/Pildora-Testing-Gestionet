import { test, expect } from '@playwright/test';

// Agrupamos los tests relacionados al login negativo
test.describe('Login negativo', () => {

  // Se ejecuta antes de cada test → abre la página de login
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // Caso 1: Intentar iniciar sesión con un email que no existe
  test('Email inexistente', async ({ page }) => {
    await page.fill('#inputEmail', 'usuario_inexistente@example.com');
    await page.fill('#inputPassword', '12345678');
    await page.click('button.buttonPrimary[type="submit"]');

    await expect(page).toHaveURL('/login');

    const errorMessage = page.locator('div.alert.alert-danger');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Credenciales no válidas.');
  });

  // Caso 2: Usuario válido pero contraseña incorrecta
  test('Contraseña incorrecta para usuario válido', async ({ page }) => {
    await page.fill('#inputEmail', 'alba.gonzalez.gestionet@gmail.com');
    await page.fill('#inputPassword', 'contraseña_incorrecta');
    await page.click('button.buttonPrimary[type="submit"]');

    await expect(page).toHaveURL('/login');

    const errorMessage = page.locator('div.alert.alert-danger');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Credenciales no válidas.');
  });

  // Caso 3: Intentar enviar formulario vacío
  test('Email y contraseña vacíos', async ({ page }) => {
    await page.goto('/login');

    await page.click('button.buttonPrimary[type="submit"]');

    const emailInput = page.locator('#inputEmail');

    // Ya sin "as HTMLInputElement" → válido en JS
    const validity = await emailInput.evaluate((element) => {
      return {
        valueMissing: element.validity.valueMissing,
        message: element.validationMessage,
      };
    });

    expect(validity.valueMissing).toBe(true);
    expect(validity.message).not.toBe("");
  });

});
