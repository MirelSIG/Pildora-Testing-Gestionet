export async function fillInput(page, locator, value) {
  await locator.waitFor({ state: 'visible' });

  await locator.focus();
  await page.waitForTimeout(100);

  await locator.fill('');
  await locator.fill(value);

  await locator.evaluate((el, val) => {
    el.value = val;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);

  await locator.blur();
}

