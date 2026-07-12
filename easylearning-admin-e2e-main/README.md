# Pruebas Automatizadas con Playwright

Este repositorio contiene pruebas automatizadas utilizando **Playwright**. El objetivo es validar el funcionamiento de la aplicación mediante pruebas end-to-end (E2E), ejecutadas en navegadores reales. Solo contiene las pruebas del apartado de administrador para dev-easylearning

## 🚀 Tecnologías utilizadas

* Playwright
* Node.js
* JavaScript
* Visual Studio Code

## 📂 Estructura del proyecto

```
/fixtures       → datos o configuraciones reutilizables
/tests          → pruebas automatizadas
  /...       → pruebas
/utils     -> funciones reutilizables
/playwright.config.ts → configuración de Playwright
```

### Detalle de carpetas

| Carpeta          | Descripción                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| **fixtures/**    | Fixtures personalizados: datos, configuración e importación para los tests. |
| **tests/**       | Contiene todos los archivos de pruebas (`.spec.ts`).                        |
| **utils/**       | Funciones reutilizables para ahorrar repeticiones de codigo                 |

---

## ▶️ Cómo ejecutar el proyecto

### Comandos útiles de Playwright

```bash
npx playwright test
# Ejecuta todas las pruebas end-to-end

npx playwright test --ui
# Inicia el modo interactivo de Playwright

npx playwright test --project=chromium
# Ejecuta las pruebas solo en Chrome

npx playwright test ejemplo
# Ejecuta un archivo de prueba específico

npx playwright test --debug
# Ejecuta en modo debug

npx playwright codegen
# Genera pruebas automáticamente con Codegen
```

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar navegadores de Playwright

```bash
npx playwright install
```

### 3. Ejecutar todas las pruebas

```bash
npx playwright test
```

### 5. Ver reporte de pruebas

```bash
npx playwright show-report
```

---

## 🧪 Ejecutar una prueba específica (por ejemplo, login)

```bash
npx playwright test tests/login/loginPositivo.spec.js
```

---

## ✅ Buenas prácticas

* Usar fixtures para reutilizar lógica (ejemplo: login automático).
* Colocar funciones repetitivas en `fixtures/` o `util/`.

--- 
