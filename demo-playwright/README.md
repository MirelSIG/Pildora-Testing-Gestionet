# Demo: Playwright + Claude Code para testing de cursos gamificados

Demo funcional que complementa la píldora de testing de Gestionet. Simula un
curso interactivo gamificado (quiz con puntos y badges) cuyo backend persiste
los resultados en una base de datos que podría inspeccionarse/validarse
manualmente con **Navicat**, y que se prueba de extremo a extremo con
**Playwright**.

## Qué demuestra

- Un frontend gamificado (quiz, barra de progreso, puntos, badges).
- Un backend Express con reglas de negocio (cálculo de puntos y badge).
- Persistencia en SQLite (`db/gestionet_demo.db`) — el mismo fichero que se
  abriría en Navicat para revisar tablas `usuarios`, `progreso_modulo` y
  `badges`.
- Tests E2E con Playwright que:
  1. Simulan un alumno respondiendo el quiz en un navegador real.
  2. Verifican la UI (puntos, badge, barra de progreso).
  3. Verifican **directamente en la base de datos** que los datos guardados
     coinciden con lo mostrado en pantalla (integridad UI ↔ BBDD).
  4. Prueban la API a nivel HTTP (casos de validación de entrada).
- Ejecución multinavegador (Chromium, Firefox, WebKit) en un único comando.

## Estructura

```text
demo-playwright/
├── db/database.js        # capa de acceso a SQLite (node:sqlite)
├── server.js              # API Express (guardar/leer progreso)
├── public/                # frontend del quiz gamificado
├── tests/                 # tests E2E de Playwright
└── playwright.config.js   # arranca server.js automaticamente antes de testear
```

## Instalación

```bash
cd demo-playwright
npm install
npx playwright install --with-deps   # descarga los navegadores
```

Requiere Node.js 22.5+ (usa el módulo nativo `node:sqlite`, sin dependencias
nativas que compilar).

## Ejecutar la demo manualmente

```bash
npm start
# abrir http://localhost:4173
```

## Ejecutar con Docker (entorno reproducible)

Desde la raiz del repositorio:

```bash
docker compose up --build -d
# abrir http://localhost:4173
```

Parar y eliminar el contenedor:

```bash
docker compose down
```

Eliminar tambien los datos persistidos (SQLite en volumen Docker):

```bash
docker compose down -v
```

La base de datos se guarda en el volumen `gestionet_demo_data`, evitando
rupturas por diferencias entre sistemas operativos o rutas locales.

Para ejecutar los tests E2E en contenedor (aislado):

```bash
docker compose --profile tests run --rm demo-playwright-tests
```

El reporte HTML y los resultados quedan disponibles en:

- `demo-playwright/playwright-report`
- `demo-playwright/test-results`

## Ejecutar los tests automatizados

```bash
npm test              # todos los navegadores, modo headless
npm run test:headed   # viendo el navegador
npm run test:ui       # modo UI interactivo con navegador visible y slow motion
npm run report        # abre el último informe HTML
```

> Nota: `test:ui` siempre levanta el servidor local de la demo para evitar
> problemas de conexión a localhost cuando existe `PLAYWRIGHT_USE_EXTERNAL_SERVER=1`.

Después de correr `npm start` una vez, puedes abrir `db/gestionet_demo.db`
con Navicat (conexión SQLite) para ver los registros guardados por el quiz.

## Conexión con Claude Code

Este proyecto es apto para ejecutarse desde Claude Code mediante el **MCP
server de Playwright**, lo que permite:

- Pedirle a Claude Code que ejecute `npx playwright test` y analice fallos.
- Pedirle que navegue la app en vivo (via el MCP de Playwright) para
  depurar visualmente un fallo antes de tocar código.
- Generar o ampliar tests a partir de una descripción del flujo de usuario
  (p. ej. "añade un test que compruebe la badge Plata con 2 de 3 aciertos").

Para habilitarlo, añade el servidor MCP de Playwright a la configuración de
Claude Code (`claude mcp add playwright npx @playwright/mcp@latest`) y
Claude Code podrá controlar un navegador real dentro de la conversación,
además de ejecutar esta suite de tests.
