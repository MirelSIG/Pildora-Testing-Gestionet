# Pildora-Testing-Gestionet

## Descripcion del proyecto

Este repositorio reúne una píldora formativa especializada en las herramientas de testing empleadas en entornos profesionales, alineada con estándares de calidad. Está relacionado con soluciones de formación telemática con recursos audiovisuales interactivos, donde la excelencia no se mide únicamente por el correcto funcionamiento del código, sino por la estabilidad, accesibilidad y consistencia de la experiencia de usuario.

El contenido ofrece una visión estructurada y estratégica del catálogo de herramientas de testing utilizadas por los equipos de QA y desarrollo en general, y por supuesto, de Gestionet, abarcando prácticas de validación en backend, frontend, lógica de interacción y control de datos. Este material está concebido como un recurso corporativo de apoyo útil para la contextualización técnica de las prácticas profesionales del Bootcamp en Desarrollo Web Fullstack de Peñascal F5, reforzando la comprensión del propósito social y tecnológico que define la actividad de Gestionet.
La introduccion del contenido aborda de forma resumida los principales bloques de aprendizaje de la pildora:

- Introduccion al testing aplicado a productos de formacion telematica interactiva.
- Herramientas para testing en PHP/Symfony: PHPUnit, Pest PHP, Codeception y Selenium WebDriver.
- Herramientas para testing en Vue.js: Vitest, Vue Testing Library, Cypress y Playwright.
- Herramientas para testing en JavaScript: Jest y DOM Testing Library.
- Herramientas para testing en bases de datos: Navicat, utPLSQL, pgTAP y tSQLt.
- Comparativa del tipo de prueba, uso habitual y modelo de acceso de cada herramienta.

## Objetivo

El objetivo de esta pildora es mostrar de forma clara para que sirve cada familia de herramientas de testing y en que contexto aporta mas valor. En este tipo de producto digital es necesario validar varios niveles al mismo tiempo:

- Logica de negocio y servicios del backend.
- Componentes visuales e interacciones del frontend.
- Flujos completos de usuario en navegador.
- Estados, progreso, recompensas y mecanicas de gamificacion.
- Integridad de datos y reglas almacenadas en base de datos.

## Estructura del contenido

El material se organiza alrededor de varios bloques tecnologicos:

- PHP/Symfony: pruebas unitarias, de integracion, API y automatizacion de flujos completos.
- Vue.js: validacion de componentes, interacciones visuales y comportamiento desde la perspectiva del usuario.
- JavaScript: comprobacion de funciones, estados, calculos y logica interactiva.
- Bases de datos: verificacion de persistencia, reglas internas, triggers y consistencia de la informacion.

## Herramientas incluidas

La siguiente tabla resume las herramientas mencionadas en el proyecto, su enfoque principal y si se trata de una herramienta de acceso libre, freemium o de pago.

| Herramienta | Area principal | Tipo de pruebas | Uso habitual | Acceso/licencia |
| --- | --- | --- | --- | --- |
| PHPUnit | PHP / Symfony | Unitarias e integracion | Validar servicios, controladores y logica de negocio | Libre / Open source |
| Pest PHP | PHP / Symfony | Unitarias e integracion | Escribir tests mas legibles y rapidos de mantener | Libre / Open source |
| Codeception | PHP / Symfony | E2E, API e integracion | Cubrir flujos completos entre capas | Libre / Open source |
| Selenium WebDriver | Automatizacion UI | End-to-End | Probar navegadores reales y flujos visuales complejos | Libre / Open source |
| Vitest | Vue.js | Unitarias e integracion | Validar componentes y logica reactiva | Libre / Open source |
| Vue Testing Library | Vue.js | Unitarias e integracion | Comprobar comportamiento desde la perspectiva del usuario | Libre / Open source |
| Cypress | Frontend web | End-to-End | Automatizar recorridos reales de usuario en navegador | Freemium |
| Playwright | Frontend web | End-to-End avanzado | Validar escenarios multinavegador y multidispositivo | Libre / Open source |
| Jest | JavaScript | Unitarias | Probar funciones, reglas y estados internos | Libre / Open source |
| DOM Testing Library | JavaScript / UI | Unitarias e integracion | Verificar accesibilidad e interaccion real con la interfaz | Libre / Open source |
| Navicat | Bases de datos | Validacion manual y automatizacion ligera | Revisar tablas, registros y consistencia de datos | De pago |
| utPLSQL | Base de datos Oracle | Unitarias SQL | Probar procedimientos, funciones y logica en Oracle | Libre / Open source |
| pgTAP | PostgreSQL | Unitarias SQL | Validar funciones, consultas y reglas en PostgreSQL | Libre / Open source |
| tSQLt | SQL Server | Unitarias SQL | Probar objetos y logica almacenada en SQL Server | Libre / Open source |

## Como interpretar la tabla

No todas las herramientas resuelven el mismo problema. Elegir bien depende del nivel que se quiere validar:

- Si se necesita comprobar logica interna, suelen encajar mejor PHPUnit, Pest, Vitest o Jest.
- Si el objetivo es validar comportamiento de interfaz, accesibilidad e interaccion, suelen aportar mas valor Vue Testing Library o DOM Testing Library.
- Si se quiere recorrer la aplicacion como un usuario real, las opciones habituales son Cypress, Playwright o Selenium.
- Si el riesgo esta en la persistencia o en las reglas del motor de base de datos, conviene apoyarse en herramientas como utPLSQL, pgTAP o tSQLt.

## Valor para un entorno de formacion gamificada

En plataformas de formacion con contenido interactivo, el testing tiene un impacto directo en la experiencia final. No basta con validar formularios o respuestas de API. Tambien hay que asegurar que los alumnos puedan avanzar sin bloqueos, que las animaciones no rompan la navegacion, que el progreso se guarde correctamente y que la experiencia sea consistente en distintos dispositivos y navegadores.

Por eso este proyecto resulta util como material introductorio: conecta cada herramienta con una necesidad real del producto y ayuda a entender por que los equipos combinan varios tipos de pruebas en lugar de depender de una sola solucion.

## Archivos del repositorio

- `index.html`: contenido principal de la pildora formativa.
- `style.css`: estilos visuales de la pagina.
- `README.md`: documentacion general del proyecto.

## Conclusiones

La idea principal del repositorio es ofrecer una vision ordenada y practica del ecosistema de testing mas habitual en proyectos web modernos. La combinacion de herramientas libres, freemium y de pago permite adaptar la estrategia de calidad al presupuesto, al nivel tecnico del equipo y a la complejidad del producto.

Como referencia general, las herramientas libres suelen cubrir la mayor parte de las necesidades tecnicas, mientras que las opciones de pago suelen aportar capas adicionales de productividad, soporte comercial o experiencia visual para perfiles menos tecnicos.
