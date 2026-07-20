---
name: testing-gestionet
user-invocable: true
description: "Workflow de testing real para Grupo Gestionet. Use when: ejecutar testing E2E en Docker, investigar fallos Playwright, validar UI-API-BBDD, estabilizar tests flaky, generar reporte QA con evidencias y riesgos. Keywords: testing real, qa, playwright, docker compose, e2e, regresion, badge, quiz, gestionet"
---

# Testing Gestionet (Skill de QA en Condiciones Reales)

## Proposito

Usa este skill para ejecutar, depurar y reportar testing end-to-end en un entorno reproducible para Grupo Gestionet.

Objetivos principales:
- Ejecutar pruebas en contenedores aislados.
- Detectar y explicar causas raiz con rapidez.
- Corregir regresiones con cambios minimos de codigo.
- Producir evidencias de QA y resumenes accionables.

## Alcance

Usar cuando el usuario pida:
- ejecutar testing real en condiciones similares a las de la empresa
- validar flujos E2E y reglas de negocio
- investigar pruebas Playwright que fallan o son inestables (flaky)
- verificar consistencia entre UI, API y datos SQLite
- preparar reportes de testing de preparacion para release

No usar para:
- rediseno de arquitectura amplio no vinculado a pruebas
- implementacion de funcionalidades sin objetivo de QA

## Convenciones del Repositorio

Contexto de proyecto esperado:
- Servicio de la app via Docker Compose
- Pruebas Playwright en demo-playwright/tests
- Logica de backend en demo-playwright/server.js
- Capa de base de datos en demo-playwright/db/database.js
- Configuracion de Playwright en demo-playwright/playwright.config.js

## Flujo de Trabajo Estandar

### 1. Linea Base y Entorno

1. Validar configuracion de compose:
   - docker compose config
   - docker compose --profile tests config
2. Si el daemon no esta disponible, detenerse y reportar el bloqueo de entorno.

### 2. Ejecutar E2E Aislado

Ejecutar pruebas en modo contenerizado:
- docker compose --profile tests run --rm demo-playwright-tests

Si es necesario, ejecutar comparacion local:
- cd demo-playwright && npm test

### 3. Capturar Evidencia

Recopilar y resumir:
- salida de terminal (nombres de pruebas fallidas, stack traces)
- demo-playwright/playwright-report
- demo-playwright/test-results

Nunca afirmar que una prueba paso si no fue ejecutada.

### 4. Analisis de Causa Raiz

Para cada fallo, mapear el sintoma con su fuente probable:
- interaccion UI/selectores/tiempos -> demo-playwright/public/app.js o localizadores de la prueba
- contrato/validacion de API -> demo-playwright/server.js
- inconsistencia de persistencia -> demo-playwright/db/database.js
- problemas de arranque/baseURL/webServer -> demo-playwright/playwright.config.js

### 5. Aplicar Fix Minimo

Reglas:
- preferir el parche seguro mas pequeno
- evitar refactors no relacionados
- mantener el comportamiento publico existente salvo que el fix lo requiera
- agregar comentarios concisos solo donde la logica no sea obvia

### 6. Reejecutar y Confirmar

Reejecutar primero el alcance fallido, luego la suite completa:
- docker compose --profile tests run --rm demo-playwright-tests

Confirmar que los artefactos se generan y son consistentes con los resultados reportados.

### 7. Entregar Reporte de QA

Incluir siempre:
- Que fallo y por que
- Que cambio (archivos)
- Que paso tras el fix
- Riesgos residuales y proximas verificaciones recomendadas

## Heuristicas de Triage Rapido

- Tiempos inestables: reemplazar esperas fragiles por esperas basadas en eventos/estado.
- Fragilidad de selectores: preferir role/label/test-id sobre cadenas CSS profundas.
- Condiciones de carrera de datos: verificar orden de transacciones y supuestos de timestamp.
- Deriva entre navegadores: confirmar diferencias entre chromium/firefox/webkit.

## Plantilla de Salida

Usar este esqueleto de respuesta:

1. Resumen de ejecucion de pruebas
2. Fallos por severidad con referencias a archivos
3. Causa raiz por fallo
4. Fixes implementados
5. Resultados de la reejecucion de validacion
6. Riesgos residuales
7. Proxima accion recomendada

## Quality Gate (Debe Cumplirse Antes de Cerrar)

- Configuracion de compose valida
- Comando de pruebas ejecutado en el modo objetivo (Docker profile tests)
- Sin afirmaciones no verificadas
- Resumen de cambios a nivel de archivo proporcionado
- Recomendacion clara de go/no-go para la confianza del release
