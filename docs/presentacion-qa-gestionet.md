# Presentacion QA para Gestionet

## Proposito del documento

Este documento explica, de forma sencilla, el proceso que segui para comprender el proceso de testing a partir de una demo para el departamento QA de Gestionet.

El proceso se puede resumir en tres pasos:

- primero construi una demo de testing automatizado con Playwright,
- despues la hice reproducible con Docker,
- y finalmente la converti en una base de agentes de IA para agilizar tareas repetitivas de calidad.

El objetivo no es solo "hacer pruebas", sino dejar una forma de trabajar que permita validar productos con menos errores, menos dependencia del entorno local y mas rapidez en la ejecucion y analisis.

## Resumen ejecutivo

Durante las practicas, el trabajo evoluciono en tres niveles:

1. **Testing funcional con Playwright**: se creo una demo con un flujo realista de usuario para validar una aplicacion web.
2. **Estandarizacion con Docker**: se encapsulo la ejecucion en contenedores para evitar diferencias entre equipos, sistemas operativos o instalaciones locales.
3. **Agentes de QA**: se crearon agentes especializados para ejecutar pruebas, analizar fallos y reportar resultados de forma estructurada.

Esto permite que un equipo de QA no solo ejecute tests, sino que trabaje con un proceso repetible, documentado y escalable.

## Que es Playwright y por que lo usamos

Playwright es una herramienta de testing automatizado para navegadores reales. Sirve para comprobar que una aplicacion web funciona como espera una persona usuaria.

Con Playwright se puede validar, por ejemplo:

- que una pantalla carga correctamente,
- que un formulario acepta datos validos,
- que una accion muestra el resultado esperado,
- que una regla de negocio se cumple,
- que la aplicacion se comporta bien en distintos navegadores.

En nuestro caso, la demo de Playwright se apoya en el proyecto de ejemplo de [demo-playwright](../demo-playwright), donde se simula un quiz gamificado con backend, interfaz y base de datos.

## Lo que fui construyendo paso a paso

### 1. Identifique el flujo que queria probar

Primero elegi un caso de negocio sencillo pero util para demostrar QA real:

- un usuario responde un quiz,
- la aplicacion calcula puntos y badge,
- el backend guarda la informacion,
- y el test verifica que la UI y la base de datos coinciden.

Este tipo de flujo es muy representativo porque conecta tres capas distintas:

- interfaz de usuario,
- logica de negocio,
- persistencia de datos.

### 2. Cree la demo de testing

Despues prepare la aplicacion de ejemplo con una arquitectura simple:

- backend en [demo-playwright/server.js](../demo-playwright/server.js),
- acceso a datos en [demo-playwright/db/database.js](../demo-playwright/db/database.js),
- configuracion de tests en [demo-playwright/playwright.config.js](../demo-playwright/playwright.config.js),
- pruebas E2E en [demo-playwright/tests](../demo-playwright/tests).

La idea era tener una demo que sirviera como modelo de prueba, no solo como ejemplo de codigo.

### 3. Hice que el entorno fuera reproducible

Uno de los problemas mas comunes en testing es que algo funciona en una maquina, pero falla en otra por diferencias de versiones, rutas o dependencias.

Para evitar eso, prepare Docker:

- [docker-compose.yml](../docker-compose.yml) para levantar la aplicacion y los tests.
- [demo-playwright/Dockerfile](../demo-playwright/Dockerfile) para ejecutar la demo.
- [demo-playwright/Dockerfile.tests](../demo-playwright/Dockerfile.tests) para correr Playwright en aislamiento.
- [demo-playwright/.dockerignore](../demo-playwright/.dockerignore) para reducir ruido y peso del build.

Con esto se consigue que cualquiera del equipo pueda ejecutar lo mismo sin depender de la configuracion local.

### 4. Converti el trabajo en una metodologia reusable

Cuando el proceso ya estaba claro, lo formalice en una skill llamada [testing-gestionet](../.github/skills/testing-gestionet/SKILL.md).

Esa skill sirve como guia de trabajo para futuras tareas de testing real. Incluye:

- cuando usarla,
- como ejecutar pruebas,
- como interpretar fallos,
- como validar que el resultado es fiable,
- y como cerrar con un informe QA.

Esto es importante porque deja de ser una prueba aislada y pasa a ser una forma de trabajo.

### 5. Diseñe agentes especializados

Despues cree tres agentes para dividir el trabajo de QA en roles concretos:

- [QA Executor](../.github/agents/qa-executor.agent.md)
- [QA Analyst](../.github/agents/qa-analyst.agent.md)
- [QA Reporter](../.github/agents/qa-reporter.agent.md)

Cada uno tiene una funcion distinta:

- **QA Executor**: corre las pruebas y recoge evidencias.
- **QA Analyst**: investiga el fallo, encuentra la causa raiz y propone o aplica el arreglo minimo.
- **QA Reporter**: resume resultados, riesgos y decision final.

Esto replica un flujo real de trabajo QA:

1. ejecutar,
2. analizar,
3. informar.

## Por que esto es util para cualquier departamento QA

La utilidad principal no esta solo en automatizar una prueba, sino en estandarizar una manera de trabajar.

### Beneficios operativos

- Reduce trabajo repetitivo.
- Hace mas facil detectar regresiones.
- Evita depender de la maquina concreta de cada persona.
- Facilita el traspaso entre miembros del equipo.
- Permite documentar mejor los fallos y sus causas.

### Beneficios de calidad

- Los tests tienen un flujo definido.
- Las ejecuciones dejan evidencia.
- Los fallos se clasifican con criterio.
- Se puede distinguir entre problema de UI, API, base de datos o configuracion.

### Beneficio para Empresas

En una empresa como Gestionet, donde puede haber productos digitales con logica de negocio, interfaces interactivas y validacion de datos, este enfoque ayuda a:

- comprobar cambios antes de liberar,
- reducir errores en produccion,
- acelerar revisiones de QA,
- y dejar una base tecnica para formar a otras personas.

## Como se conecta el testing con los agentes

La relacion entre ambas cosas es la siguiente:

- **Playwright** ejecuta la prueba real.
- **Docker** garantiza que la prueba se ejecute igual en cualquier entorno.
- **La skill** define el metodo de trabajo.
- **Los agentes** dividen ese metodo en tareas concretas y repetibles.

En otras palabras, primero resolvi el problema tecnico del testing, y despues lo converti en un proceso asistido por IA para hacerlo mas rapido y ordenado.

## Que aprende un departamento QA con esta propuesta

Este trabajo demuestra que la IA no sustituye el criterio del QA, sino que le da soporte.

El criterio humano sigue siendo necesario para:

- decidir que test ejecutar,
- interpretar un fallo,
- evaluar el impacto,
- y tomar una decision de liberacion.

La IA, en cambio, ayuda a:

- ejecutar mas rapido,
- organizar mejor la informacion,
- resumir evidencias,
- y repartir tareas entre roles.

## Ejemplo de flujo real de uso

Un flujo sencillo seria este:

1. QA Executor lanza `docker compose --profile tests run --rm demo-playwright-tests`.
2. Si falla algo, QA Analyst revisa el fallo y determina si es un problema de selector, API o persistencia.
3. Si se corrige el problema, se vuelve a ejecutar la suite.
4. QA Reporter recopila el resultado y emite una conclusion de tipo Go, Conditional Go o No-Go.

Ese circuito es muy parecido a como puede trabajar un equipo QA real en una empresa.

## Conclusiones

El valor de este trabajo no esta solo en la demo de Playwright ni solo en los agentes. El valor real esta en haber unido ambas cosas en un proceso utilizable por un equipo.

La evolucion fue esta:

- de una prueba automatizada,
- a un entorno reproducible,
- a una plantilla de trabajo QA con agentes especializados.

Eso permite presentar ante Gestionet que las practicas profesionales no consistieron solo en ejecutar tests, sino en asimilar una forma de trabajo profesional orientada a calidad, trazabilidad y eficiencia.

## Archivos clave del proyecto

- [demo-playwright/README.md](../demo-playwright/README.md)
- [demo-playwright/server.js](../demo-playwright/server.js)
- [demo-playwright/db/database.js](../demo-playwright/db/database.js)
- [demo-playwright/playwright.config.js](../demo-playwright/playwright.config.js)
- [docker-compose.yml](../docker-compose.yml)
- [.github/skills/testing-gestionet/SKILL.md](../.github/skills/testing-gestionet/SKILL.md)
- [.github/agents/qa-executor.agent.md](../.github/agents/qa-executor.agent.md)
- [.github/agents/qa-analyst.agent.md](../.github/agents/qa-analyst.agent.md)
- [.github/agents/qa-reporter.agent.md](../.github/agents/qa-reporter.agent.md)

## Mensaje final para la presentacion

"Durante mis practicas en QA no solo ejecute pruebas automatizadas. Primero construi una demo realista con Playwright, despues la hice reproducible con Docker para evitar errores de entorno y finalmente, converti el proceso en una plantilla de agentes de IA que permite ejecutar, analizar y reportar tareas de testing de forma rapida, ordenada y profesional"
