import { userFixtures } from '../../fixtures/user.fixture.js';
import { expect } from '@playwright/test';

const test = userFixtures;

// Test para crear y luego eliminar un filtro de categoría
test("Crear y eliminar un filtro de categoría con nombre autogenerado", async ({ adminUser, page }) => {

  // Generar nombre único usando timestamp
  const uniqueSuffix = Date.now();
  const filterName = `Filtro Playwright ${uniqueSuffix}`;
  const subFilterName = `PW-${uniqueSuffix}`;

  // Paso 1: Navega directamente a la página de categorías
  await page.goto(
    "https://dev-easylearning.gestionetdev.com/admin?menuIndex=1&routeName=admin-course-categories-page&signature=L2GfUbx3OBTLumHAYryAjG8gxagTAbDbVbZ4IbGew8A&submenuIndex=0&activeRoute=Home&activeParams=JTdCJTdE&routeStatus=JTVCJTdCJTIycm91dGVOYW1lJTIyOiUyMkhvbWUlMjIsJTIycGFyYW1zJTIyOiU3QiUyMmxpbmtOYW1lJTIyOiUyMkNhdGVnb3IlQzMlQURhcyUyMiwlMjJwYXJhbXMlMjI6JTdCJTdEJTdEJTdEJTVE&routeHistory=JTVCJTVE"
  );

  // Paso 2: Accede a la sección "Gestión de usuarios"
  await page.getByRole('link', { name: ' Gestión de usuarios ' }).click();

  // Paso 3: Abre la sección de filtros
  await page.getByRole('link', { name: ' Filtros' }).click();

  // Paso 4: Crear nuevo filtro
  await page.getByRole('link', { name: 'Crear filtro' }).click();
  await page.getByRole('textbox').fill(filterName);

  // Paso 5: Añade un subfiltro
  await page.getByRole('button', { name: ' Añadir subfiltro' }).click();
  await page.locator('#new-NewCategorysFilters-modal').getByRole('textbox').fill(subFilterName);
  await page.getByRole('button', { name: 'Agregar' }).click();

  // Paso 6: Guarda el filtro
  await page.locator('#main').getByRole('button', { name: 'Guardar' }).click();

  // ================= TEARDOWN: Eliminar filtro creado =================
  const row = page.getByRole("row", { name: new RegExp(filterName, 'i') });
  await row.getByRole("link", { name: new RegExp(filterName, 'i') }).click();
  await page.locator('button.btn-danger i.fa-trash').click();
  await page.getByRole('button', { name: 'Aceptar' }).click();
  await page.getByRole("button", { name: /^Eliminar$/ }).click();
  await page.getByRole('button', { name: 'Aceptar' }).click();
});
