// Rellena un input de forma robusta, disparando los eventos que suelen esperar
// los frameworks reactivos (Vue/React) para detectar el cambio de valor.
export async function fillInput(page, locator, value) {
  await locator.waitFor({ state: 'visible' });

  await locator.focus();
  await page.waitForTimeout(100); // Pequeña espera para que el framework registre el foco

  // Se limpia el campo antes de escribir, evitando concatenar con un valor previo
  await locator.fill('');
  await locator.fill(value);

  // Fuerza el valor y dispara los eventos 'input'/'change' manualmente,
  // necesario cuando el framework no reacciona solo al fill() de Playwright
  await locator.evaluate((el, val) => {
    el.value = val;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);

  await locator.blur();
}

