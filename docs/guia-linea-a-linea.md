# Guía línea a línea del proyecto demo

Complementa a [guia-arquitectura-proyecto.md](guia-arquitectura-proyecto.md)
(el mapa general) bajando al detalle de cada archivo. Cubre línea a línea los
archivos propios de `demo-playwright/` (los que definen el comportamiento) y
explica de forma estructural los archivos de infraestructura (Docker,
agentes, config) donde el detalle línea a línea no aporta valor didáctico
(archivos declarativos cortos) o el archivo es de terceros/generado
(`easylearning-admin-e2e-main/`, `node_modules`, `package-lock.json`).

---

## `demo-playwright/db/database.js`

Capa de acceso a la base de datos. Usa `node:sqlite`, el módulo nativo de
Node 22.5+, para no depender de compilar addons nativos como `better-sqlite3`.

```js
1   const path = require('path');
2   const { DatabaseSync } = require('node:sqlite');
```
Línea 1-2: importa el módulo de rutas de Node y `DatabaseSync`, la API
síncrona de SQLite embebida en Node (evita callbacks/promesas para un caso
de uso simple de demo).

```js
6   const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'gestionet_demo.db');
```
Línea 6: la ruta del fichero `.db` es configurable por variable de entorno
(`DB_PATH`). En local apunta junto a este archivo; en Docker se sobreescribe
para apuntar a `/db/gestionet_demo.db`. Ese path `/db` está montado como bind
mount hacia `./demo-playwright/db`, por lo que el fichero queda visible y
persistido en la carpeta local del proyecto. Este mismo fichero es el que se
abriría con Navicat para inspección manual.

```js
8   function getDb() {
9     const db = new DatabaseSync(DB_PATH);
10    db.exec('PRAGMA journal_mode = WAL;');
11    db.exec('PRAGMA busy_timeout = 5000;');
```
Línea 8-9: `getDb()` abre (o crea) la conexión a la base de datos cada vez
que se llama — es una conexión de corta duración por request/test, no un
singleton.
Línea 10: activa el modo `WAL` (Write-Ahead Logging), que permite lecturas y
escrituras concurrentes sin bloquearse mutuamente. Se añadió porque, sin
esto, correr los tests de Playwright (varios navegadores) contra el mismo
fichero SQLite producía errores `database is locked`.
Línea 11: si aun así hay contención, SQLite reintentará durante 5000ms antes
de fallar, en vez de fallar al instante.

```js
13    db.exec(`
14      CREATE TABLE IF NOT EXISTS usuarios (
15        id INTEGER PRIMARY KEY AUTOINCREMENT,
16        nombre TEXT NOT NULL UNIQUE
17      );
```
Línea 13-17: crea la tabla `usuarios` si no existe — un nombre único por
alumno. `IF NOT EXISTS` hace que sea seguro llamarlo en cada arranque.

```js
19      CREATE TABLE IF NOT EXISTS progreso_modulo (
20        id INTEGER PRIMARY KEY AUTOINCREMENT,
21        usuario_id INTEGER NOT NULL,
22        modulo TEXT NOT NULL,
23        puntos INTEGER NOT NULL DEFAULT 0,
24        aciertos INTEGER NOT NULL DEFAULT 0,
25        total_preguntas INTEGER NOT NULL DEFAULT 0,
26        completado INTEGER NOT NULL DEFAULT 0,
27        actualizado_en TEXT NOT NULL,
28        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
29      );
```
Línea 19-29: una fila por intento de módulo completado. Guarda puntos,
aciertos, total de preguntas y timestamp. `usuario_id` enlaza con
`usuarios` mediante clave foránea.

```js
31      CREATE TABLE IF NOT EXISTS badges (
32        id INTEGER PRIMARY KEY AUTOINCREMENT,
33        usuario_id INTEGER NOT NULL,
34        nombre_badge TEXT NOT NULL,
35        modulo TEXT NOT NULL,
36        otorgado_en TEXT NOT NULL,
37        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
38      );
39    `);
40
41    return db;
42  }
```
Línea 31-38: una fila por badge otorgada (Oro/Plata/Bronce), separada de
`progreso_modulo` porque conceptualmente son entidades distintas (un badge
es una recompensa, no una métrica de progreso).
Línea 41: devuelve la conexión abierta para que el llamador la use y la
cierre.

Nota actual: `resetDb()` quedó comentada en este archivo y ya no se exporta.
Se retiró para permitir observar persistencia real entre ejecuciones de la
demo y de los tests en Docker sin vaciado automático previo.

```js
50  module.exports = { getDb, DB_PATH };
```
Línea 50: expone `getDb` y `DB_PATH`. `getDb` lo usa `server.js`; los tests
ya no abren SQLite directamente, sino que validan persistencia vía API.

---

## `demo-playwright/server.js`

Backend Express: expone la API que el frontend consume y aplica la regla de
negocio de puntos/badges.

```js
1   const path = require('path');
2   const express = require('express');
3   const { getDb } = require('./db/database');
5   const app = express();
6   const PORT = process.env.PORT || 4173;
```
Línea 1-3: dependencias. Línea 5-6: instancia Express; el puerto es
configurable por entorno (Docker lo fija a `4173` explícitamente).

```js
8   app.use(express.json());
9   app.use(express.static(path.join(__dirname, 'public')));
```
Línea 8: middleware que parsea `Content-Type: application/json` en el body
de las requests (necesario para leer `req.body` en el POST del quiz).
Línea 9: sirve `public/` como archivos estáticos — así `index.html`,
`app.js` y `styles.css` se acceden directamente en `http://localhost:4173/`.

```js
11  const REGLAS_BADGE = [
12    { minPuntos: 100, nombre: 'Oro' },
13    { minPuntos: 60, nombre: 'Plata' },
14    { minPuntos: 0, nombre: 'Bronce' },
15  ];
17  function calcularBadge(puntos) {
18    return REGLAS_BADGE.find((r) => puntos >= r.minPuntos).nombre;
19  }
```
Línea 11-15: tabla de reglas de gamificación, ordenada de mayor a menor
umbral. Línea 17-19: `find` devuelve la primera regla cuyo umbral se cumple
— como está ordenada de mayor a menor, encuentra siempre el tramo correcto
(100 → Oro, 60-99 → Plata, 0-59 → Bronce).

```js
21  function obtenerOCrearUsuario(db, nombre) {
22    const existente = db.prepare('SELECT * FROM usuarios WHERE nombre = ?').get(nombre);
23    if (existente) return existente;
24    const info = db.prepare('INSERT INTO usuarios (nombre) VALUES (?)').run(nombre);
25    return { id: info.lastInsertRowid, nombre };
26  }
```
Línea 21-26: patrón "find or create". Busca al usuario por nombre (línea
22); si existe lo devuelve (23); si no, lo inserta (24) y construye el
objeto con el `id` recién generado (`lastInsertRowid`, línea 25) sin
necesidad de un segundo `SELECT`.

```js
29  app.post('/api/quiz/completar', (req, res) => {
30    const { usuario, modulo, aciertos, totalPreguntas } = req.body;
32    if (!usuario || !modulo || typeof aciertos !== 'number' || typeof totalPreguntas !== 'number') {
33      return res.status(400).json({ error: 'Datos de entrada invalidos' });
34    }
```
Línea 29: endpoint que el frontend llama al terminar el quiz. Línea 30:
desestructura el body. Línea 32-34: validación de entrada mínima en el
borde del sistema (rechaza usuario/módulo vacíos o tipos incorrectos) —
la prueba de esto está en `tests/quiz-gamificado.spec.js` ("la API rechaza
datos invalidos").

```js
36    const puntos = Math.round((aciertos / totalPreguntas) * 100);
37    const badge = calcularBadge(puntos);
38    const ahora = new Date().toISOString();
```
Línea 36: convierte aciertos/total en porcentaje entero (0-100). Línea 37:
aplica la regla de badges. Línea 38: timestamp ISO para las columnas
`actualizado_en` / `otorgado_en`.

```js
40    const db = getDb();
41    try {
42      const user = obtenerOCrearUsuario(db, usuario);
44      db.prepare(`
45        INSERT INTO progreso_modulo (usuario_id, modulo, puntos, aciertos, total_preguntas, completado, actualizado_en)
46        VALUES (?, ?, ?, ?, ?, 1, ?)
47      `).run(user.id, modulo, puntos, aciertos, totalPreguntas, ahora);
49      db.prepare(`
50        INSERT INTO badges (usuario_id, nombre_badge, modulo, otorgado_en)
51        VALUES (?, ?, ?, ?)
52      `).run(user.id, badge, modulo, ahora);
54      res.json({ usuario: user.nombre, modulo, puntos, badge });
55    } finally {
56      db.close();
57    }
58  });
```
Línea 40: abre la conexión a BBDD para esta request. Línea 41/55-57:
`try/finally` garantiza que `db.close()` se ejecute siempre, incluso si una
query lanza — evita fugas de conexiones/locks abiertos. Línea 44-47: usa
placeholders `?` (no interpolación de strings) para evitar inyección SQL —
único punto donde entra dato de usuario en una query. Línea 49-52: inserta
la badge otorgada. Línea 54: responde con lo que la UI necesita mostrar
(puntos y badge).

```js
60  app.get('/api/usuario/:nombre/progreso', (req, res) => {
61    const db = getDb();
62    try {
63      const user = db.prepare('SELECT * FROM usuarios WHERE nombre = ?').get(req.params.nombre);
64      if (!user) return res.json({ modulos: [], badges: [] });
66      const modulos = db.prepare('SELECT * FROM progreso_modulo WHERE usuario_id = ?').all(user.id);
67      const badges = db.prepare('SELECT * FROM badges WHERE usuario_id = ?').all(user.id);
68      res.json({ modulos, badges });
69    } finally {
70      db.close();
71    }
72  });
```
Endpoint de consulta (no lo usa el frontend actual, pero permite inspeccionar
el progreso de un alumno vía API sin abrir Navicat). Línea 64: si el usuario
no existe, responde con listas vacías en vez de un 404 — simplifica el
consumo desde un cliente.

```js
74  if (require.main === module) {
75    app.listen(PORT, () => {
76      console.log(`Demo Gestionet corriendo en http://localhost:${PORT}`);
77    });
78  }
80  module.exports = app;
```
Línea 74-78: solo arranca el servidor HTTP si el archivo se ejecuta
directamente (`node server.js`), no cuando se importa. Línea 80: exporta la
app Express — permitiría testear la API sin levantar un puerto real (con
`supertest`, por ejemplo), aunque los tests actuales usan la API HTTP real
vía Playwright `request`.

---

## `demo-playwright/playwright.config.js`

```js
1   // @ts-check
2   const { defineConfig, devices } = require('@playwright/test');
3   const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173';
4   const useExternalServer = process.env.PLAYWRIGHT_USE_EXTERNAL_SERVER === '1';
4   module.exports = defineConfig({
5     testDir: './tests',
6     fullyParallel: false,
7     workers: 1,
8     retries: process.env.CI ? 2 : 0,
9     reporter: [['html', { open: 'never' }], ['list']],
```
Línea 1: activa chequeo de tipos de JSDoc en editores compatibles. Línea 5:
los tests viven en `./tests`. Línea 6-7: paralelismo desactivado y un solo
worker — se decidió así porque varios workers escribiendo a la vez en el
mismo fichero SQLite producían `database is locked`; para esta demo se
prioriza fiabilidad sobre velocidad. Línea 8: en CI reintenta un test
fallido hasta 2 veces (mitiga flakiness de red/timing); en local, cero
reintentos para ver el fallo real de inmediato. Línea 9: genera un reporte
HTML (sin abrirlo automáticamente) y un listado por consola.

```js
11    use: {
12      baseURL,
13      trace: 'on-first-retry',
14      screenshot: 'only-on-failure',
15    },
```
Línea 12: permite usar rutas relativas (`page.goto('/')`) en los tests y
cambiar el host vía entorno (`PLAYWRIGHT_BASE_URL`) cuando la suite corre en
Docker contra `http://demo-playwright:4173`.
Línea 13: graba una traza (timeline navegable) solo cuando un test falla y
se reintenta — evita el coste de trazar todo siempre. Línea 14: igual con
capturas de pantalla.

```js
17    projects: [
18      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
19      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
20      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
21    ],
```
Línea 17-21: la misma suite se ejecuta tres veces, una por motor de
navegador, usando los perfiles de dispositivo predefinidos de Playwright —
esto es lo que da la cobertura "multinavegador" mencionada en el README.

```js
25    webServer: useExternalServer
26      ? undefined
27      : {
28          command: 'node server.js',
29          url: baseURL,
30          reuseExistingServer: !process.env.CI,
31          timeout: 15000,
32        },
```
Línea 25-32: en local, Playwright puede levantar `node server.js` como
`webServer`; en Docker, con `PLAYWRIGHT_USE_EXTERNAL_SERVER=1`, se desactiva
ese arranque interno para usar el servicio Compose ya levantado. Esto evita
que el contenedor de tests apunte a una app distinta de la que persiste datos.

---

## `demo-playwright/tests/quiz-gamificado.spec.js`

Estructura general (sin repetir cada línea, ya documentada por bloques):

- **No hay `beforeEach(resetDb)` activo**: está comentado para conservar
  registros entre ejecuciones y poder inspeccionarlos en `db/gestionet_demo.db`.
- **Test "badge Oro"**: rellena el nombre, pulsa "Empezar", responde las 3
  preguntas con los índices correctos (definidos en `public/app.js`), verifica
  el texto final en pantalla y luego valida persistencia consultando
  `GET /api/usuario/:nombre/progreso` con `request`.
  Esta comprobación vía API evita falsos negativos cuando el test y el servidor
  corren en contenedores distintos.
- **Test "badge Bronce"**: mismo flujo pero respondiendo mal las 3
  preguntas; solo verifica UI (la cobertura de BBDD ya la da el test
  anterior).
- **Test "barra de progreso"**: verifica que el ancho de la barra pasa de
  `0px` a `33%` tras responder la primera pregunta (1 de 3 ≈ 33%).
- **Test "API rechaza datos inválidos"**: usa `request.post` (cliente HTTP
  de Playwright, sin navegador) para mandar un body incompleto y comprobar
  el `400` — prueba la API de forma aislada de la UI.

---

## `demo-playwright/public/` (frontend)

- **`index.html`**: tres `<section>` que se muestran/ocultan según el
  estado (`login` → `quiz` → `resultado`), usando el atributo `hidden`.
  Cada elemento interactivo lleva `data-testid`, que es lo que los
  selectores de Playwright usan (`page.getByTestId(...)`) en vez de
  depender de clases CSS, que pueden cambiar por diseño.
- **`app.js`**: guarda el estado del quiz en un objeto `state` (usuario,
  pregunta actual, aciertos). `PREGUNTAS` es un array fijo con la pregunta,
  las opciones y el índice de la opción correcta. `renderPregunta()` pinta
  la pregunta actual y genera un botón por opción dinámicamente.
  `responder()` compara la opción pulsada contra `correcta`, actualiza
  puntos parciales y avanza; al llegar a la última pregunta llama a
  `finalizarQuiz()`, que hace el `fetch` a `/api/quiz/completar` y muestra
  el resultado devuelto por el backend (no lo calcula en el cliente, para
  que la fuente de verdad sea siempre el servidor).
- **`styles.css`**: estética oscura simple, sin lógica — no se testea
  directamente (Playwright verifica comportamiento, no estilos exactos,
  salvo el ancho de la barra de progreso que sí es funcional).

---

## Infraestructura Docker (nivel declarativo, no línea a línea)

### `demo-playwright/Dockerfile`
Imagen para correr la app: parte de `node:22-bookworm-slim` (Node 22, base
ligera Debian — necesaria para `node:sqlite`), copia `package*.json` e
instala con `npm ci` (instalación reproducible, respeta el lockfile) antes
de copiar el resto del código (aprovecha la cache de capas de Docker: si
solo cambia el código y no las dependencias, no se reinstala nada). Expone
el puerto `4173` y arranca con `npm start`.

### `demo-playwright/Dockerfile.tests`
Igual que el anterior pero además instala los navegadores de Playwright
(`npx playwright install --with-deps chromium firefox webkit`) y arranca
`npm test` en vez del servidor — es la imagen "efímera" que solo corre la
suite y termina.

### `docker-compose.yml`
- **Servicio `demo-playwright`**: construye con el `Dockerfile` normal,
  publica el puerto `4173:4173`, fija `DB_PATH=/db/gestionet_demo.db` y monta
  `./demo-playwright/db:/db` para que la BBDD persista en disco local
  del repositorio, además de `restart: unless-stopped` para que se reinicie si el host
  reinicia.
- **Servicio `demo-playwright-tests`**: bajo el perfil `tests` (no arranca
  con `docker compose up` normal, solo con `--profile tests`), usa una
  BBDD compartida en `/db/gestionet_demo.db` (mismo bind mount local) y
  monta como volúmenes las carpetas de reportes locales para poder ver los
  resultados fuera del contenedor tras la ejecución.

---

## Agentes (`.claude/agents/*.md`) y skill

Cada agente es un archivo con **frontmatter** (metadatos: `name`,
`description`, `tools`, `model`) seguido de un **system prompt en Markdown**
que define su rol, restricciones, heurísticas y el formato exacto de salida
que debe devolver. No son "código" ejecutable línea a línea; son
instrucciones estructuradas que Claude Code inyecta al invocar ese agente.
Ver la sección 6 de [guia-arquitectura-proyecto.md](guia-arquitectura-proyecto.md)
para el resumen de qué hace cada uno y cómo se encadenan.

---

## `easylearning-admin-e2e-main/` (proyecto de terceros)

No forma parte de la demo que construimos — es una suite Playwright real
de Gestionet (login, usuarios, cursos, categorías, itinerarios, filtros)
incluida como referencia de estructura. Resumen por carpeta, sin bajar a
línea de código (son archivos ajenos, algunos duplicados por error de
importación — ver nota):

- **`fixtures/`**: `user.fixture.js` y `course.fixture.js` — datos/objetos
  reutilizables que los tests importan para no repetir literales.
- **`tests/`**: un subdirectorio por dominio funcional (`login/`,
  `usuarios/`, `cursos/`, `categoria/`, `filtro/`, `itinerario/`), cada uno
  con uno o más `*.spec.js`.
- **`utils/`**: `helpers.js` y `utils.js` con funciones compartidas (ojo:
  existen duplicados en `utils/utils/helpers.js` y `utils/utils/utils.js`
  — probablemente un artefacto de cómo se copió el proyecto; si vas a
  tocar este código conviene confirmar cuál es la copia viva antes de
  editar).
- **`playwright.config.js`**: configuración independiente de la de
  `demo-playwright` (viewport `1280x720`, sin `webServer` porque apunta a
  un entorno ya desplegado, video en fallos).
- **`.github/workflows/playwright.yml`**: pipeline CI que instala
  dependencias, navegadores, corre `npx playwright test` y publica el
  reporte como artefacto — el mismo patrón que podría aplicarse a
  `demo-playwright` si se quisiera correr en GitHub Actions además de
  Docker local.

Si quieres el detalle línea a línea de algún `.spec.js` concreto de este
proyecto (por ejemplo `loginPositivo.spec.js`), dímelo y lo hago aparte —
aquí se resumió porque son ~15 archivos y la mayoría sigue el mismo patrón.
