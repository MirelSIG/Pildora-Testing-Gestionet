# Guía: cómo se articula el proyecto demo

Esta guía explica cómo encajan entre sí las piezas del repositorio: la píldora
formativa original, la demo técnica de Playwright, la reproducibilidad con
Docker, la suite E2E real (`easylearning-admin-e2e-main`) y los agentes de QA.
Léela de arriba a abajo: cada capa se apoya en la anterior.

## 1. Vista general en una frase

> Una píldora teórica sobre herramientas de testing se convirtió en una demo
> funcional (Playwright + backend + BBDD), esa demo se hizo reproducible con
> Docker, y ese flujo reproducible se formalizó como una metodología de QA
> ejecutada por agentes especializados.

```
Contenido teórico          Demo funcional              Reproducibilidad      Metodología con agentes
(index.html, README.md) →  (demo-playwright/)      →   (docker-compose.yml,  →  (.claude/agents/,
                                                          Dockerfile*)             .github/skills/)
```

## 2. Las cinco capas del repositorio

| # | Capa | Carpeta / archivo | Qué responde |
|---|------|--------------------|---------------|
| 1 | Contenido formativo | [index.html](../index.html), [README.md](../README.md) | Explica *qué* herramientas de testing existen y cuándo usarlas (PHPUnit, Playwright, Navicat, etc.) |
| 2 | Demo funcional | [demo-playwright/](../demo-playwright/) | Aplica esa teoría: un curso gamificado real (quiz → puntos → badge → BBDD) probado con Playwright |
| 3 | Reproducibilidad | [docker-compose.yml](../docker-compose.yml), `demo-playwright/Dockerfile*` | Empaqueta la demo para que se ejecute igual en cualquier máquina |
| 4 | Suite E2E de referencia | [easylearning-admin-e2e-main/](../easylearning-admin-e2e-main/) | Ejemplo de un proyecto Playwright "real" de Gestionet (panel admin), usado como referencia de estructura (fixtures/tests/utils) |
| 5 | Metodología con agentes | [.claude/agents/](../.claude/agents/), [.github/skills/testing-gestionet/SKILL.md](../.github/skills/testing-gestionet/SKILL.md) | Convierte "ejecutar tests" en un proceso con tres roles: ejecutar → analizar → reportar |

## 3. Capa 2 en detalle: `demo-playwright/`

Es el corazón técnico. Tres piezas que se prueban juntas:

```
demo-playwright/
├── public/            # Frontend: quiz gamificado (HTML/CSS/JS puro)
├── server.js           # Backend Express: calcula puntos y badge, expone la API
├── db/database.js      # Persistencia: SQLite (node:sqlite) — el fichero que
│                        # Navicat abriría para inspección manual
├── tests/               # Tests Playwright: UI + verificación directa en BBDD
└── playwright.config.js # Levanta server.js automáticamente antes de testear
```

Flujo de una ejecución de test:

1. Playwright arranca `node server.js` (vía `webServer` en la config).
2. El test abre el navegador, entra un usuario, responde el quiz.
3. El frontend llama a `POST /api/quiz/completar`.
4. El backend calcula puntos/badge y los persiste en `gestionet_demo.db`.
5. El test verifica **dos cosas a la vez**: lo que se ve en pantalla (UI) y
   lo que quedó escrito en la base de datos (`SELECT` directo), para
   garantizar que UI y BBDD no diverjan — el mismo tipo de comprobación que
   haría un QA manualmente con Navicat.

## 4. Capa 3 en detalle: Docker

`docker-compose.yml` define dos servicios:

- **`demo-playwright`**: levanta la app (frontend + backend) en el puerto
  `4173`, con la BBDD en un volumen (`gestionet_demo_data`) para que persista
  entre reinicios y no dependa de rutas locales.
- **`demo-playwright-tests`** (perfil `tests`, no se levanta por defecto):
  construye una imagen con los navegadores de Playwright instalados y corre
  `npm test` de forma aislada, dejando los reportes en
  `demo-playwright/playwright-report/` y `demo-playwright/test-results/`.

Por qué importa: sin Docker, "en mi máquina funciona" es un riesgo real
(versión de Node, navegadores no instalados, rutas distintas). Con Docker,
cualquiera —o cualquier agente— ejecuta exactamente el mismo entorno.

## 5. Capa 4: `easylearning-admin-e2e-main/`

No es parte de la demo gamificada — es un proyecto Playwright independiente
(pruebas del panel de administración de EasyLearning: login, usuarios,
cursos, categorías, itinerarios, filtros). Sirve como **referencia de
estructura real de Gestionet**: fixtures reutilizables, `utils/` con helpers,
tests organizados por dominio. Los agentes de QA están escritos pensando en
que también podrían operar sobre proyectos con esta forma, no solo sobre
`demo-playwright`.

## 6. Capa 5: agentes de QA (`.claude/agents/`)

Se portaron desde `.github/agents/*.agent.md` (formato GitHub Copilot) al
formato nativo de subagentes de Claude Code. Son tres roles con
responsabilidades separadas — cada uno con su propio set de herramientas,
para que no se salgan de su función:

| Agente | Herramientas | Hace | No hace |
|--------|-------------|------|---------|
| `qa-executor` | Bash, Read, Grep, Glob | Corre la suite (Docker o local), recoge evidencia, clasifica fallos por severidad | Nunca edita código |
| `qa-analyst` | Read, Grep, Glob, Edit, Write, Bash | Investiga causa raíz por capa (UI/API/BBDD/config), aplica el fix mínimo, revalida | No hace refactors fuera del alcance del fallo |
| `qa-reporter` | Read, Grep, Glob | Consolida evidencia en una decisión Go / Conditional Go / No-Go | No ejecuta tests ni inventa resultados |

Flujo típico:

```
qa-executor  →  (si falla)  →  qa-analyst  →  revalidación  →  qa-reporter
   ejecuta                       corrige                        decide
```

Para invocarlos desde Claude Code: `@qa-executor`, `@qa-analyst`,
`@qa-reporter`, o simplemente pedir en lenguaje natural ("ejecuta la suite
de Playwright en Docker") — la `description` de cada agente está escrita
para que Claude Code lo seleccione automáticamente cuando aplique.

## 7. La skill `testing-gestionet`

En [.github/skills/testing-gestionet/SKILL.md](../.github/skills/testing-gestionet/SKILL.md)
se formaliza el método de trabajo completo (cuándo testear, cómo ejecutar,
cómo interpretar fallos, cómo cerrar con informe). Los agentes son la
ejecución de esa metodología repartida en roles; la skill es el manual que
la describe en texto.

## 8. Los documentos de `docs/`

- [presentacion-qa-gestionet.md](presentacion-qa-gestionet.md): la narrativa
  completa de por qué se construyó todo esto y en qué orden (útil para
  presentar el trabajo a Gestionet).
- [presentacion-qa-gestionet-diapositivas.md](presentacion-qa-gestionet-diapositivas.md):
  la misma narrativa en formato slides.
- Este archivo (`guia-arquitectura-proyecto.md`): el mapa técnico de cómo
  encajan las piezas, pensado para orientarte rápido en el repo.

## 9. Cómo moverte por el repo según lo que quieras hacer

| Quiero... | Voy a... |
|---|---|
| Entender qué herramientas de testing existen y cuándo usarlas | [index.html](../index.html) |
| Ver/ejecutar la demo funcional | [demo-playwright/README.md](../demo-playwright/README.md) |
| Ejecutar todo en un entorno reproducible | `docker compose up --build -d` (raíz del repo) |
| Ejecutar solo los tests, aislados | `docker compose --profile tests run --rm demo-playwright-tests` |
| Ver un proyecto Playwright "real" de Gestionet como referencia | [easylearning-admin-e2e-main/README.md](../easylearning-admin-e2e-main/README.md) |
| Que un agente ejecute/analice/reporte QA | `.claude/agents/qa-executor.md`, `qa-analyst.md`, `qa-reporter.md` |
| Entender el método de trabajo QA completo | [.github/skills/testing-gestionet/SKILL.md](../.github/skills/testing-gestionet/SKILL.md) |
| Presentar el proyecto a Gestionet | [docs/presentacion-qa-gestionet.md](presentacion-qa-gestionet.md) |
