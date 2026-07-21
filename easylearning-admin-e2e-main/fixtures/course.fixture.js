// Fixture que, ademas de loguear como admin, crea un curso de prueba listo para usar.
import { userFixtures } from './user.fixture.js';

export const courseFixtures = userFixtures.extend({
  // Extiende la fixture de admin creando un curso con nombre unico (timestamp) y lo expone
  cursoName: async ({ page, adminUser }, use) => {
    const nombreCurso = `Curso Playwright ${Date.now()}`; // Timestamp evita colisiones entre ejecuciones

    await page.goto('/admin');
    await page.getByRole('link', { name: 'Cursos', exact: true }).click();
    await page.getByRole('button', { name: 'Crear curso' }).click();

    await page.fill('#name', nombreCurso);
    await page.fill('#code', 'Código temporal');
    await page.selectOption('#typeCourse', { label: 'Teleformación' });
    await page.selectOption('#category', { label: 'General' });
    await page.getByRole('button', { name: '1h' }).click();

    await page.locator('#new-course-form-btn-submit').click();
    await page.waitForLoadState('networkidle');

    // Exponemos el nombre del curso a los tests
    await use(nombreCurso);
  },
});

// Exportamos un `test` listo para usar en los tests
export const test = courseFixtures;
