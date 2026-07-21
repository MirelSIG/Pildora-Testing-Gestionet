// Backend Express de la demo: sirve el frontend estatico y expone la API del quiz.
const path = require('path');
const express = require('express');
const { getDb } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 4173;

app.use(express.json()); // Parseo automatico de bodies JSON
app.use(express.static(path.join(__dirname, 'public'))); // Sirve index.html, app.js, styles.css

// Umbrales de puntos para cada badge, ordenados de mayor a menor
const REGLAS_BADGE = [
  { minPuntos: 100, nombre: 'Oro' },
  { minPuntos: 60, nombre: 'Plata' },
  { minPuntos: 0, nombre: 'Bronce' },
];

// Devuelve el nombre de la primera badge cuyo umbral se cumple
function calcularBadge(puntos) {
  return REGLAS_BADGE.find((r) => puntos >= r.minPuntos).nombre;
}

// Busca un usuario por nombre; si no existe, lo crea (upsert manual)
function obtenerOCrearUsuario(db, nombre) {
  const existente = db.prepare('SELECT * FROM usuarios WHERE nombre = ?').get(nombre);
  if (existente) return existente;
  const info = db.prepare('INSERT INTO usuarios (nombre) VALUES (?)').run(nombre);
  return { id: info.lastInsertRowid, nombre };
}

// Guarda el resultado del quiz gamificado: puntos, aciertos y badge otorgada.
app.post('/api/quiz/completar', (req, res) => {
  const { usuario, modulo, aciertos, totalPreguntas } = req.body;

  if (!usuario || !modulo || typeof aciertos !== 'number' || typeof totalPreguntas !== 'number') {
    return res.status(400).json({ error: 'Datos de entrada invalidos' });
  }

  const puntos = Math.round((aciertos / totalPreguntas) * 100);
  const badge = calcularBadge(puntos);
  const ahora = new Date().toISOString();

  const db = getDb();
  try {
    const user = obtenerOCrearUsuario(db, usuario);

    db.prepare(`
      INSERT INTO progreso_modulo (usuario_id, modulo, puntos, aciertos, total_preguntas, completado, actualizado_en)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `).run(user.id, modulo, puntos, aciertos, totalPreguntas, ahora);

    db.prepare(`
      INSERT INTO badges (usuario_id, nombre_badge, modulo, otorgado_en)
      VALUES (?, ?, ?, ?)
    `).run(user.id, badge, modulo, ahora);

    res.json({ usuario: user.nombre, modulo, puntos, badge });
  } finally {
    db.close();
  }
});

// Devuelve el progreso (modulos completados) y las badges de un usuario dado
app.get('/api/usuario/:nombre/progreso', (req, res) => {
  const db = getDb();
  try {
    const user = db.prepare('SELECT * FROM usuarios WHERE nombre = ?').get(req.params.nombre);
    if (!user) return res.json({ modulos: [], badges: [] }); // Usuario inexistente: sin progreso

    const modulos = db.prepare('SELECT * FROM progreso_modulo WHERE usuario_id = ?').all(user.id);
    const badges = db.prepare('SELECT * FROM badges WHERE usuario_id = ?').all(user.id);
    res.json({ modulos, badges });
  } finally {
    db.close();
  }
});

// Arranca el servidor solo si el fichero se ejecuta directamente (no al importarlo desde los tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Demo Gestionet corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
