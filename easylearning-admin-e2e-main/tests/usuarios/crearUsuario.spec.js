// Test E2E: crea un usuario con datos unicos desde el panel de admin,
// comprueba que aparece en el listado y lo elimina para dejar el entorno limpio.
import { userFixtures } from '../../fixtures/user.fixture.js';
import { expect } from '@playwright/test';
import { buscarEnTabla } from "../../utils/utils.js";
import { fillInput } from "../../utils/helpers.js";

const test = userFixtures;

test("Crear usuario único y borrarlo", async ({ adminUser, page }) => {

  const timestamp = Date.now();
  const usuarioEmail = `playwright_${timestamp}@usuario.com`;
  const usuarioNombre = `Playwright_${timestamp}`;
  await page.goto(
    "/admin?crudAction=index&crudControllerFqcn=App%5CController%5CAdmin%5CUserCrudController&entityFqcn=App%5CEntity%5CUser&menuIndex=3&submenuIndex=0"
  );

  // 🔹 Crear usuario
  await page.getByRole('link', { name: 'Crear Usuario' }).click();

  await fillInput(page, page.getByRole('textbox', { name: 'Correo electrónico' }), usuarioEmail);
  await fillInput(page, page.getByRole('textbox', { name: 'Nombre' }), usuarioNombre);
  await fillInput(page, page.getByRole('textbox', { name: 'Apellido' }), 'Usuario');
  await page.getByRole('checkbox', { name: 'Campus abierto' }).check();
  await fillInput(page, page.locator('#User_registerKey'), '123456789a');
  await fillInput(page, page.getByRole('textbox', { name: 'Contraseña' }), '12345678');

  // Guardar usuario
  const guardarBtn = page.getByRole('button', { name: 'Guardar' });
  await guardarBtn.waitFor({ state: 'visible' });
  await guardarBtn.click();

  // 🔹 Buscar usuario en la tabla
  await buscarEnTabla(page, usuarioEmail);

  // Abrir menú de acciones y borrar
  const usuarioRow = page.locator('tr', { hasText: usuarioEmail });
  await usuarioRow.locator('a.dropdown-toggle').click();
  await usuarioRow.locator('a:has-text("Borrar")').click();

  // Confirmar eliminación
  const modalDeleteBtn = page.locator('button#modal-delete-button');
  await modalDeleteBtn.waitFor({ state: 'visible' });
  await modalDeleteBtn.click();

  // Esperar a que la fila desaparezca
  await usuarioRow.waitFor({ state: 'detached', timeout: 10000 });

  // Verificación final
  const usuarioExiste = await page.locator('tr', { hasText: usuarioEmail }).count();
  expect(usuarioExiste).toBe(0);
});

