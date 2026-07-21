# Presentacion QA para Gestionet - Estructura de diapositivas

## Diapositiva 1. Titulo

**Titulo:** De Playwright a agentes QA para Gestionet

**Subtitulo:** Como converti unas practicas de testing en una metodologia reutilizable para el departamento QA.

**Mensaje oral:**

- Mi trabajo no consistio solo en hacer pruebas.
- Construi una demo de testing, la hice reproducible con Docker y despues la transforme en una base de agentes de IA para agilizar tareas de QA.

## Diapositiva 2. Problema que queria resolver

**Titulo:** El problema real del testing

**Puntos clave:**

- Las pruebas fallan por diferencias de entorno.
- Revisar fallos manualmente consume tiempo.
- Repetir tareas de QA ralentiza al equipo.
- Necesitabamos una forma mas ordenada y reproducible de trabajar.

**Mensaje oral:**

- La idea fue crear una forma de testing que se pueda repetir igual en cualquier equipo.

## Diapositiva 3. Que es Playwright

**Titulo:** Testing automatizado con navegadores reales

**Puntos clave:**

- Playwright comprueba la aplicacion como si fuera una persona usuaria.
- Permite validar interfaz, flujos y comportamientos.
- Sirve para detectar errores antes de liberar un cambio.

**Mensaje oral:**

- Elegi Playwright porque es util para validar experiencias reales de usuario, no solo funciones aisladas.

## Diapositiva 4. La demo que construi

**Titulo:** Flujo de prueba usado como ejemplo

**Puntos clave:**

- Un usuario responde un quiz gamificado.
- La aplicacion calcula puntos y badge.
- El backend guarda la informacion.
- El test verifica que la UI y la base de datos coinciden.

**Mensaje oral:**

- Elegi un caso sencillo pero realista, porque conecta interfaz, logica y datos.

## Diapositiva 5. Reproducibilidad con Docker

**Titulo:** Mismo resultado en cualquier entorno

**Puntos clave:**

- Docker evita diferencias entre maquinas.
- La demo se ejecuta en contenedores.
- Los tests tambien se pueden correr aislados.
- Se reducen errores por version, ruta o instalacion local.

**Archivos de referencia:**

- [docker-compose.yml](../docker-compose.yml)
- [demo-playwright/Dockerfile](../demo-playwright/Dockerfile)
- [demo-playwright/Dockerfile.tests](../demo-playwright/Dockerfile.tests)

**Mensaje oral:**

- Esto hace que QA pueda ejecutar lo mismo en cualquier equipo sin depender de configuraciones locales.

## Diapositiva 6. Estructura tecnica

**Titulo:** Componentes del proyecto

**Puntos clave:**

- Backend: [demo-playwright/server.js](../demo-playwright/server.js)
- Base de datos: [demo-playwright/db/database.js](../demo-playwright/db/database.js)
- Configuracion de tests: [demo-playwright/playwright.config.js](../demo-playwright/playwright.config.js)
- Tests E2E: [demo-playwright/tests](../demo-playwright/tests)

**Mensaje oral:**

- Dividi la demo en capas para que el flujo de testing fuera claro y facil de mantener.

## Diapositiva 7. Skill de testing

**Titulo:** Convertir una demo en una metodologia

**Puntos clave:**

- Cree la skill [testing-gestionet](../.github/skills/testing-gestionet/SKILL.md).
- Define cuando usar el flujo de testing.
- Indica como ejecutar pruebas.
- Ayuda a interpretar fallos y cerrar con informe.

**Mensaje oral:**

- El objetivo fue que el trabajo no quedara como algo puntual, sino como una forma de trabajar repetible.

## Diapositiva 8. Agentes QA

**Titulo:** Dividir el trabajo por roles

**Puntos clave:**

- [QA Executor](../.github/agents/qa-executor.agent.md): ejecuta las pruebas y recoge evidencias.
- [QA Analyst](../.github/agents/qa-analyst.agent.md): analiza la causa raiz y propone o aplica el fix minimo.
- [QA Reporter](../.github/agents/qa-reporter.agent.md): resume resultados y emite decision final.

**Mensaje oral:**

- Con los agentes, cada parte del trabajo QA queda separada por responsabilidad.

## Diapositiva 9. Valor para Gestionet

**Titulo:** Que aporta al departamento QA

**Puntos clave:**

- Menos trabajo repetitivo.
- Mas rapidez al detectar y analizar fallos.
- Menos dependencia del entorno local.
- Mejor trazabilidad de resultados.
- Base reutilizable para futuros casos de prueba.

**Mensaje oral:**

- Esto ayuda al equipo a trabajar de forma mas rapida, ordenada y consistente.

## Diapositiva 10. Cierre

**Titulo:** Conclusiones

**Puntos clave:**

- Primero cree una prueba realista con Playwright.
- Despues la hice reproducible con Docker.
- Finalmente la converti en una plantilla de agentes QA.

**Mensaje oral final:**

- Durante mis practicas no solo hice testing automatizado: asimile un proceso profesional que puede reutilizarse para agilizar tareas del departamento QA en Gestionet.

## Diapositiva 11. Flujo de trabajo propuesto

**Titulo:** Como se usaria en el dia a dia

**Puntos clave:**

1. QA Executor ejecuta la suite en Docker.
2. QA Analyst revisa y corrige el fallo.
3. QA Reporter consolida el resultado.
4. Se decide Go, Conditional Go o No-Go.

**Mensaje oral:**

- Este flujo imita como puede trabajar un equipo QA real cuando prepara una liberacion.
