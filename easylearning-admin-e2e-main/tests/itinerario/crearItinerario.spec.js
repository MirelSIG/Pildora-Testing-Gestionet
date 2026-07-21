// Test E2E: crea un itinerario formativo, lo localiza en el listado paginado
// (usando el helper buscarEnTabla) y a continuacion lo elimina.
import { userFixtures } from '../../fixtures/user.fixture.js';
import { expect } from '@playwright/test';
import { buscarEnTabla } from "../../utils/utils.js";

const test = userFixtures;

test("Crear itinerario y borrar", async ({ adminUser, page }) => {
  await page.goto(
    "/admin?crudAction=index&crudControllerFqcn=App%5CController%5CAdmin%5CItineraryCrudController&entityFqcn=App%5CEntity%5CItinerary&menuIndex=1&signature=Cqn6KED7vWCKJ7iQ_xJwkoa3-aMeSw3ClJRChiQFAlo&submenuIndex=3"
  );

  const itinerarioNombre = `Itinerario Playwright ${Date.now()}`;

  await page.getByRole("button", { name: /Crear itinerario/i }).click();
  await page.getByText(/Nombre/i)
    .locator("xpath=..")
    .getByRole("textbox")
    .fill(itinerarioNombre);

  await page.getByRole("button", { name: /Guardar/i }).click();
  await expect(page.getByRole("heading", { name: itinerarioNombre })).toBeVisible();

  await page.getByRole("link", { name: /Volver al listado/i }).click();
  await expect(page.locator("table")).toBeVisible();

  await buscarEnTabla(page, itinerarioNombre);

  // Localiza la fila exacta que contiene el itinerario creado
  const filaItinerario = page.locator('table tr', { has: page.getByRole('link', { name: itinerarioNombre }) });

  // ➤ TEARDOWN: eliminar el itinerario
  // 1️⃣ Abrir menú de acciones
  const btnAcciones = filaItinerario.getByRole('button', { name: /|Borrar/i }).first();
  await expect(btnAcciones).toBeVisible();
  await btnAcciones.click();

  // 2️⃣ Hacer clic en la opción "Eliminar" dentro del dropdown
  const eliminarOption = page.locator('ul.dropdown-menu.show >> text=Eliminar').first();
  await expect(eliminarOption).toBeVisible();
  await eliminarOption.click();

  // 3️⃣ Confirmar en el modal
  const confirmarBtn = page.getByRole('button', { name: /Aceptar|Confirmar/i }).first();
  await expect(confirmarBtn).toBeVisible();
  await confirmarBtn.click();

  // 4️⃣ Verificar que la fila desapareció
  await expect(filaItinerario).toHaveCount(0);
});
