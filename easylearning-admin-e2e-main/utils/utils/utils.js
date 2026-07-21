import { expect } from "@playwright/test";

/**
 * Buscar texto dentro de una tabla con soporte de paginación.
 *
 * @param {import('@playwright/test').Page} page - Página de Playwright
 * @param {string} textoBuscado - Texto que queremos encontrar en la tabla
 * @param {number} [columna] - (Opcional) número de columna donde buscar
 * @param {number} [maxPaginas=10] - Número máximo de páginas a revisar
 * @param {string} [selectorTabla="table"] - Selector de la tabla
 * @returns {import('@playwright/test').Locator} Locator de la fila encontrada
 */
export async function buscarEnTabla(
  page,
  textoBuscado,
  columna,
  maxPaginas = 10,
  selectorTabla = "table"
) {
  let paginaActual = 1;

  // Recorre las paginas de la tabla hasta encontrar el texto o agotar el limite
  while (paginaActual <= maxPaginas) {
    console.log(`🔹 Buscando "${textoBuscado}" en la página ${paginaActual}...`);

    // Espera que la tabla y sus filas estén renderizadas
    await page.waitForSelector(selectorTabla, { timeout: 5000 });
    await page.waitForSelector(`${selectorTabla} tbody tr`, { timeout: 5000 });

    // Selector dinámico según columna
    const selector = columna
      ? `${selectorTabla} tbody tr:has(td:nth-child(${columna}):has-text("${textoBuscado}"))`
      : `${selectorTabla} tbody tr:has(td:has-text("${textoBuscado}"))`;

    const filaCoincidente = page.locator(selector);

    if ((await filaCoincidente.count()) > 0) {
      console.log(`✅ "${textoBuscado}" encontrado en la página ${paginaActual}`);
      await expect(filaCoincidente.first()).toBeVisible({ timeout: 3000 });
      return filaCoincidente.first();
    }

    // Buscar botón "Siguiente" y asegurar que no está deshabilitado
    const botonSiguiente = page.locator(`
      li.page-item:not(.disabled) a.page-link:has-text("Siguiente"),
      a.chip.next:not(.disabled)
    `);

    if ((await botonSiguiente.count()) === 0) {
      console.log(`❌ No se encontró "${textoBuscado}" y no hay más páginas.`);
      break;
    }

    await Promise.all([
      botonSiguiente.first().click(),
      page.waitForSelector(`${selectorTabla} tbody tr`) // espera real del cambio de página
    ]);

    paginaActual++;
  }

  // Se agotaron las paginas (o no habia boton "Siguiente") sin encontrar el texto
  throw new Error(`El texto "${textoBuscado}" no se encontró en ninguna página`);
}
