// Test E2E: crea una categoria de curso desde el panel de admin y la elimina
// a continuacion para no dejar datos residuales en el entorno (no se guarda).
import { userFixtures as test } from '../../fixtures/user.fixture.js';

test("Crear y eliminar una categoría (no se guarda)", async ({ adminUser, page }) => {
  // Generar un nombre único
  const nombreCategoria = `PlaywrightCategoria-${Date.now()}`;

  // Navegar a la página de categorías
  await page.goto("/admin?menuIndex=1&routeName=admin-course-categories-page");

  // Abrir formulario
  await page.getByRole('link', { name: 'Crear categoría' }).click();

  // Escribir nombre
  await page.locator('input[type="text"]').fill(nombreCategoria);

  // Marcar opciones
  await page.locator('label').nth(2).click();
  await page.locator('label').nth(3).click();
  await page.getByText('Interna Teleformación').click();
  await page.locator('label').nth(4).click();

  // Activar switch
  await page.locator('.d-flex.flex-row.flex-nowrap.align-items-center.mb-1 > .BaseSwitch > label').first().click();

  // Click en opción Extern
  await page.locator('.Extern > div:nth-child(3)').click();

  // Marcar último campo
  await page.locator('label').nth(5).click();

  // Guardar
  await page.getByRole('button', { name: 'Guardar' }).click();

  // ➤ TEARDOWN: eliminar solo la categoría creada
  // Esperar a que el link con el nombre aparezca
  const categoriaLink = page.getByRole('link', { name: nombreCategoria });
  await categoriaLink.waitFor({ state: 'visible', timeout: 10000 });

  // Localizar la fila padre del link
  const fila = categoriaLink.locator('xpath=ancestor::tr');

  // Click en botón eliminar dentro de la fila
  await fila.locator('button.btn-danger').click();

  // Confirmar modal
  await page.getByRole('button', { name: 'Aceptar' }).click();

  // Esperar a que desaparezca la fila
  await categoriaLink.waitFor({ state: 'detached', timeout: 10000 });
});
