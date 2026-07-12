import { userFixtures } from '../../fixtures/user.fixture.js';
import { expect } from '@playwright/test';

const test = userFixtures;

test("Impersonar usuario existente", async ({ adminUser, page, context }) => {
  const usuarioNombre = "albaUsuario@gmail.com";

  // 1️⃣ Navegar a la lista de usuarios
  await page.goto(
    "https://dev-easylearning.gestionetdev.com/admin?crudAction=index&crudControllerFqcn=App%5CController%5CAdmin%5CUserCrudController&entityFqcn=App%5CEntity%5CUser&menuIndex=3&signature=A03oO_ntkJkhkqTygnpHw7EQcFgxqIBlh3__yvEWXKo&submenuIndex=0"
  );

  // 2️⃣ Entrar al detalle del usuario
  await page.getByRole("link", { name: usuarioNombre }).click();

  // 3️⃣ Capturar la nueva ventana/tab que se abrirá al clickear "Impersonar"
  const [campusPage] = await Promise.all([
    context.waitForEvent("page"),
    page.locator('a.btn.btn-primary.action-impersonate').click()
  ]);

  // 4️⃣ Esperar que la nueva ventana cargue
  await campusPage.waitForLoadState("domcontentloaded");

  // 5️⃣ Esperar a que la URL final del campus esté lista
  await campusPage.waitForURL(/\/campus\/section\/mi-formacion/i, { timeout: 15000 });

  // 6️⃣ Verificar que la impersonación cargó correctamente
  await expect(campusPage.locator("h1")).toContainText(/Mi formación/i);
});
