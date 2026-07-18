import { courseFixtures } from '../../fixtures/course.fixture.js';
import { expect } from '@playwright/test';

const test = courseFixtures;

test("Crear y eliminar un curso (no se guarda)", async ({ cursoName, page }) => {
  await page.goto("/admin");
  await page.getByRole("link", { name: "Cursos", exact: true }).click();

  // Verifica que el curso creado por la fixture aparece en la lista
  const filaCurso = page.locator(`tr:has-text("${cursoName}")`);
  await expect(filaCurso).toBeVisible({ timeout: 10000 });

  // Obtiene el ID de la fila para abrir el menú correspondiente
  const idCurso = await filaCurso.locator('td >> nth=0').innerText(); // Ajusta si tu ID está en otra columna
  const botonMenu = page.locator(`#dropdown-menu-${idCurso}`);
  
  await expect(botonMenu).toBeVisible({ timeout: 5000 });
  await botonMenu.click();

  // Haz click en "Eliminar"
  const botonEliminar = page.getByRole('button', { name: 'Eliminar' });
  await expect(botonEliminar).toBeVisible({ timeout: 5000 });
  await botonEliminar.click();

  // Confirma la eliminación
  const botonAceptar = page.getByRole('button', { name: 'Aceptar' });
  await expect(botonAceptar).toBeVisible({ timeout: 5000 });
  await botonAceptar.click();

  // Espera que la fila desaparezca
  await filaCurso.waitFor({ state: 'detached', timeout: 10000 });
  console.log("✔️ Curso eliminado correctamente");
});
