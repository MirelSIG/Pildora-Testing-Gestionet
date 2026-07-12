import { userFixtures } from '../../fixtures/user.fixture.js';
import { expect } from '@playwright/test';
import { buscarEnTabla } from "../../utils/utils";       // Función utilitaria para buscar un texto dentro de una tabla con paginación

const test = userFixtures;

// Agrupa los tests bajo el mismo contexto
test.describe("Verificación de usuarios", () => {

  test("✅ Verificar que un usuario EXISTENTE aparece en la tabla", async ({ adminUser, page }) => {
    // Accede a la vista del listado de usuarios en el administrador
    await page.goto(
      "https://dev-easylearning.gestionetdev.com/admin?crudAction=index&crudControllerFqcn=App%5CController%5CAdmin%5CUserCrudController&entityFqcn=App%5CEntity%5CUser&menuIndex=3&signature=A03oO_ntkJkhkqTygnpHw7EQcFgxqIBlh3__yvEWXKo&submenuIndex=0"
    );

    const usuarioExistente = "playwright777@user.com"; // Usuario que se espera encontrar en la tabla

    // Llama a la función para buscar el usuario en la tabla (si no está, lanzará un error)
    await buscarEnTabla(page, usuarioExistente, 3);
  });

  test("❌ Verificar que un usuario INEXISTENTE NO aparece en la tabla", async ({ adminUser, page }) => {
    // Accede a la vista del listado de usuarios en el administrador
    await page.goto(
      "https://dev-easylearning.gestionetdev.com/admin?crudAction=index&crudControllerFqcn=App%5CController%5CAdmin%5CUserCrudController&entityFqcn=App%5CEntity%5CUser&menuIndex=3&signature=A03oO_ntkJkhkqTygnpHw7EQcFgxqIBlh3__yvEWXKo&submenuIndex=0"
    );

    const usuarioInexistente = "usuario_que_no_existe@user.com"; // Usuario que NO debería estar en la tabla
    
    // Se espera que la función arroje un error al no encontrar el usuario
    await expect(async () => {
      await buscarEnTabla(page, usuarioInexistente, 3);
    }).rejects.toThrow(/no se encontró en ninguna página/);
  });

});
