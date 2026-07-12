const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// Este fichero .db es el mismo que se abriria en Navicat para validacion
// manual (tablas usuarios, progreso_modulo, badges) descrito en la pildora.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'gestionet_demo.db');

function getDb() {
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA busy_timeout = 5000;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS progreso_modulo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      modulo TEXT NOT NULL,
      puntos INTEGER NOT NULL DEFAULT 0,
      aciertos INTEGER NOT NULL DEFAULT 0,
      total_preguntas INTEGER NOT NULL DEFAULT 0,
      completado INTEGER NOT NULL DEFAULT 0,
      actualizado_en TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      nombre_badge TEXT NOT NULL,
      modulo TEXT NOT NULL,
      otorgado_en TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
  `);

  return db;
}

function resetDb() {
  const db = getDb();
  db.exec('DELETE FROM badges; DELETE FROM progreso_modulo; DELETE FROM usuarios;');
  db.close();
}

module.exports = { getDb, resetDb, DB_PATH };
