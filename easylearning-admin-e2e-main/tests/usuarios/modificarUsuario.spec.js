import { userFixtures } from '../../fixtures/user.fixture.js';
import { expect } from '@playwright/test';
import { buscarEnTabla } from "../../utils/utils.js";

const test = userFixtures;

test("Modificar usuario existente", async ({ adminUser, page }) => {
  const usuarioNombre = "playwright777@user.com";
  const listaUrl =
    "/admin?crudAction=index&crudControllerFqcn=App%5CController%5CAdmin%5CUserCrudController&entityFqcn=App%5CEntity%5CUser&menuIndex=3&signature=A03oO_ntkJkhkqTygnpHw7EQcFgxqIBlh3__yvEWXKo&submenuIndex=0";

  await page.goto(listaUrl, { waitUntil: "networkidle" });
  await page.waitForSelector("table");

  // Buscar usuario en la tabla (columna 3)
  const filaUsuario = await buscarEnTabla(page, usuarioNombre, 3);
  if (!filaUsuario) throw new Error(`Usuario "${usuarioNombre}" NO encontrado en la lista`);

  // Click en el email y esperar navegación (EasyAdmin edita en la misma pestaña)
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    filaUsuario.locator("td:nth-child(3)").click(),
  ]);

  // Click en el botón 'Modificar' (robusto)
  await page.getByRole("link", { name: "Modificar" }).click();
  await page.waitForSelector("#User_firstName");

  // Cambiar nombre y apellido
  await page.locator("#User_firstName").fill("UsuarioModificado");
  await page.locator("#User_lastName").fill("PlaywrightEditado");

  // Cambiar idioma de forma segura
  await page.click("#User_locale-ts-control");
  await page
    .locator(".ts-dropdown:visible div[role='option']")
    .filter({ hasText: /^inglés$/i })
    .first()
    .click();

  // Checkbox activo → desmarcar si está marcado
  const isChecked = await page.isChecked("#User_open");
  if (isChecked) {
    await page.uncheck("#User_open");
  }

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.getByRole("button", { name: "Guardar cambios" }).click(),
  ]);

  // Volver a la lista
  await page.getByRole("link", { name: /listar|volver|list/i }).click();
  await page.waitForSelector("table");

  // Buscar de nuevo el usuario ya modificado
  const filaModificada = await buscarEnTabla(page, usuarioNombre, 3);
  if (!filaModificada) {
    throw new Error(`Usuario "${usuarioNombre}" NO encontrado tras guardar cambios`);
  }

  // Verificaciones
  await expect(filaModificada.locator("td:nth-child(4)")).toContainText("UsuarioModificado");
  await expect(filaModificada.locator("td:nth-child(5)")).toContainText("PlaywrightEditado");
});
