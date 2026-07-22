// @ts-check
const { test, expect } = require('@playwright/test');
// const { resetDb } = require('../db/database');

// Estas pruebas cubren el flujo E2E completo descrito en la pildora:
// UI gamificada (Playwright) + persistencia de puntos/badges en BBDD
// (la misma tabla que se inspeccionaria manualmente con Navicat).

// Antes de cada test se vacia la BBDD para que los tests sean independientes entre si
// test.beforeEach(() => {
//   resetDb();
// });

test.describe('Quiz gamificado - flujo completo', () => {
  test('un alumno que falla todas las preguntas obtiene la badge Bronce', async ({ page }) => {
    const alumno = 'luis.perez';

    await page.goto('/');
    await page.getByTestId('input-usuario').fill(alumno);
    await page.getByTestId('btn-empezar').click();

    await page.getByTestId('opcion-0').click(); // Incorrecta
    await page.getByTestId('opcion-1').click(); // Incorrecta
    await page.getByTestId('opcion-0').click(); // Incorrecta

    await expect(page.getByTestId('resultado-puntos')).toHaveText('Puntuacion final: 0 puntos');
    await expect(page.getByTestId('resultado-badge')).toHaveText('Badge obtenida: Bronce');
  });

  // Comprueba que el ancho de la barra de progreso (en %) se actualiza tras responder
  test('la barra de progreso avanza en cada pregunta respondida', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('input-usuario').fill('progreso.test');
    await page.getByTestId('btn-empezar').click();

    await expect(page.getByTestId('progreso-bar')).toHaveCSS('width', '0px'); // Aun no se ha respondido nada

    await page.getByTestId('opcion-1').click();
    const anchoTrasPregunta1 = await page.getByTestId('progreso-bar').evaluate((el) => el.style.width);
    expect(anchoTrasPregunta1).toBe('33%'); // 1 de 3 preguntas respondidas
  });

  // Test de contrato de la API: debe validar el body y rechazar datos incompletos con 400
  test('la API rechaza datos invalidos al guardar el progreso', async ({ request }) => {
    const response = await request.post('/api/quiz/completar', {
      data: { usuario: '', modulo: 'fundamentos-testing', aciertos: 1 }, // falta totalPreguntas y usuario vacio
    });
    expect(response.status()).toBe(400);
  });

  test('un alumno que acierta todas las preguntas obtiene la badge Oro y queda persistido en BBDD', async ({ page, request }) => {
    const alumno = 'ana.garcia';

    await page.goto('/');
    await page.getByTestId('input-usuario').fill(alumno);
    await page.getByTestId('btn-empezar').click();

    // Respuestas correctas segun public/app.js: Playwright, Navicat, Vitest
    await page.getByTestId('opcion-1').click(); // Pregunta 1
    await page.getByTestId('opcion-0').click(); // Pregunta 2
    await page.getByTestId('opcion-2').click(); // Pregunta 3

    await expect(page.getByTestId('resultado-puntos')).toHaveText('Puntuacion final: 100 puntos');
    await expect(page.getByTestId('resultado-badge')).toHaveText('Badge obtenida: Oro');

    // Validacion de integridad de datos en BBDD a traves de la misma API que usa la UI.
    // Abrir aqui una segunda conexion sqlite directa asumiria que el proceso de test
    // y el servidor bajo prueba comparten filesystem/DB_PATH, lo cual no se cumple
    // cuando los tests corren contra un servidor externo (p.ej. el contenedor Docker
    // levantado por docker-compose), y provocaba falsos negativos de persistencia.
    const response = await request.get(`/api/usuario/${alumno}/progreso`);
    const { modulos, badges } = await response.json();

    const progreso = modulos.at(-1);
    expect(progreso).toBeTruthy();
    expect(progreso.puntos).toBe(100);
    expect(progreso.aciertos).toBe(3);
    expect(progreso.completado).toBe(1);

    const badge = badges.at(-1);
    expect(badge.nombre_badge).toBe('Oro');
  });
});
