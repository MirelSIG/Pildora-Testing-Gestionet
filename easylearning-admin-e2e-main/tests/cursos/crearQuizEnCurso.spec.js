// Test E2E: sobre el curso creado por la fixture, añade un capitulo de tipo Quiz
// con dos preguntas y despues elimina el curso para no dejar datos residuales.
import { courseFixtures } from '../../fixtures/course.fixture.js';
import { expect } from '@playwright/test';

const test = courseFixtures;

test("Crear quiz en curso playwright - versión limpia", async ({ adminUser, page, cursoName }) => {

  const modalQuiz = page.locator("#questions-games"); // Modal donde se redactan las preguntas del quiz

  // Función para crear una pregunta en el quiz
  const crearPregunta = async (enunciado, respuestas, correctaIndex, forceClick = false) => {
    await page.getByRole("button", { name: "Crear pregunta" }).click({ force: forceClick });
    await modalQuiz.waitFor({ state: "visible" });

    await modalQuiz.getByRole("textbox", { name: "Escribir enunciado de pregunta" }).fill(enunciado);

    for (let i = 0; i < respuestas.length; i++) {
      await modalQuiz.getByRole("textbox", { name: "Escribir una respuesta" }).nth(i).fill(respuestas[i]);
    }

    await modalQuiz.locator(`[id="${correctaIndex + 1}"]`).check();
    await modalQuiz.getByRole("button", { name: "Close" }).click();
    await modalQuiz.waitFor({ state: "hidden" });
  };

  // ➤ Navegar a sección de capítulos y crear capítulo
  await page.getByRole("button", { name: "Capítulos" }).click();
  await page.getByRole("link", { name: "Añadir capítulo" }).click();
  await page.getByRole("textbox", { name: "Título" }).fill("Quiz");

  // Seleccionar tipo Quiz y crear quiz
  await page.getByText("Quiz", { exact: true }).click();
  await page.getByRole("button", { name: "Crear quiz" }).click();

  // Espera que el modal cargue
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500); // espera extra por animaciones

  // ➤ Crear preguntas
  await crearPregunta("¿Qué significa la sigla CPU?", ["Central Processing Unit", "Patata"], 0, true);
  await crearPregunta("¿Cuál de los siguientes es un sistema operativo?", ["Microsoft Word", "Windows"], 1);

  // ➤ Guardar quiz
  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await page.getByRole('button', { name: 'Atrás' }).click();

  // ➤ ELIMINAR CURSO
  const filaCurso = page.locator(`tr:has-text("${cursoName}")`);
  await expect(filaCurso).toBeVisible({ timeout: 10000 });

  const idCurso = await filaCurso.locator('td >> nth=0').innerText();
  const botonMenu = page.locator(`#dropdown-menu-${idCurso}`);
  await expect(botonMenu).toBeVisible({ timeout: 5000 });
  await botonMenu.click();

  const botonEliminar = page.getByRole('button', { name: 'Eliminar' });
  await expect(botonEliminar).toBeVisible({ timeout: 5000 });
  await botonEliminar.click();

  const botonAceptar = page.getByRole('button', { name: 'Aceptar' });
  await expect(botonAceptar).toBeVisible({ timeout: 5000 });
  await botonAceptar.click();

  await filaCurso.waitFor({ state: 'detached', timeout: 10000 });
  console.log("✔️ Curso eliminado correctamente");

}, { timeout: 60000 }); // Timeout ampliado: el test crea varias entidades y su limpieza es lenta
