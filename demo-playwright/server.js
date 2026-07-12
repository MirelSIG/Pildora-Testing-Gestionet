const path = require('path');
const express = require('express');
const { getDb } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 4173;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const REGLAS_BADGE = [
  { minPuntos: 100, nombre: 'Oro' },
  { minPuntos: 60, nombre: 'Plata' },
  { minPuntos: 0, nombre: 'Bronce' },
];

function calcularBadge(puntos) {
  return REGLAS_BADGE.find((r) => puntos >= r.minPuntos).nombre;
}

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

app.get('/api/usuario/:nombre/progreso', (req, res) => {
  const db = getDb();
  try {
    const user = db.prepare('SELECT * FROM usuarios WHERE nombre = ?').get(req.params.nombre);
    if (!user) return res.json({ modulos: [], badges: [] });

    const modulos = db.prepare('SELECT * FROM progreso_modulo WHERE usuario_id = ?').all(user.id);
    const badges = db.prepare('SELECT * FROM badges WHERE usuario_id = ?').all(user.id);
    res.json({ modulos, badges });
  } finally {
    db.close();
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Demo Gestionet corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
