import { userFixtures as test } from '../../fixtures/user.fixture.js';
import { expect } from '@playwright/test';

// Test 1: Verifica el login con un usuario administrador
test('Login con adminUser', async ({ adminUser, page }) => {
  // Muestra por consola el email del usuario que se está usando para el login
  console.log('Usuario logueado:', adminUser.email);

  // Valida que después del login, la URL actual sea la del panel de administración
  await expect(page).toHaveURL(/admin/i);
});

// Test 2: Verifica el login con un usuario normal
test('Login con user normal', async ({ normalUser, page }) => {
  // Muestra por consola el email del usuario utilizado
  console.log('Usuario logueado:', normalUser.email);

  // Valida que un usuario normal entra en el campus, no en admin
  await expect(page).toHaveURL(
    '/campus/section/mi-formacion'
  );
});
