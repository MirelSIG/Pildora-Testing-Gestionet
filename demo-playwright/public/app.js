// Logica de front-end del quiz gamificado: preguntas, estado y renderizado del DOM.

// Banco de preguntas del quiz, con el indice de la opcion correcta
const PREGUNTAS = [
  {
    texto: '¿Que herramienta se usa para pruebas E2E multinavegador?',
    opciones: ['PHPUnit', 'Playwright', 'Navicat'],
    correcta: 1,
  },
  {
    texto: '¿Que herramienta permite validar visualmente los datos en la BBDD?',
    opciones: ['Navicat', 'Jest', 'Vitest'],
    correcta: 0,
  },
  {
    texto: '¿Que libreria se usa para testing unitario de logica en Vue?',
    opciones: ['Cypress', 'Selenium', 'Vitest'],
    correcta: 2,
  },
];

// Estado mutable del quiz en curso
const state = {
  usuario: '',
  preguntaActual: 0,
  aciertos: 0,
};

// Referencias a las tres pantallas (login, quiz, resultado) que se muestran/ocultan
const pantallaLogin = document.getElementById('pantalla-login');
const pantallaQuiz = document.getElementById('pantalla-quiz');
const pantallaResultado = document.getElementById('pantalla-resultado');

// Listeners de los botones principales
document.getElementById('btn-empezar').addEventListener('click', empezarQuiz);
document.getElementById('btn-reiniciar').addEventListener('click', () => location.reload());

// Valida el nombre de usuario, reinicia el estado y arranca el quiz
function empezarQuiz() {
  const nombre = document.getElementById('input-usuario').value.trim();
  if (!nombre) return; // No se permite continuar sin nombre de usuario

  state.usuario = nombre;
  state.preguntaActual = 0;
  state.aciertos = 0;

  pantallaLogin.hidden = true;
  pantallaQuiz.hidden = false;
  document.getElementById('total-preguntas').textContent = PREGUNTAS.length;

  renderPregunta();
}

// Pinta en el DOM la pregunta actual, la barra de progreso y sus opciones
function renderPregunta() {
  const pregunta = PREGUNTAS[state.preguntaActual];
  document.getElementById('num-pregunta').textContent = state.preguntaActual + 1;
  document.getElementById('texto-pregunta').textContent = pregunta.texto;

  const progresoPct = Math.round((state.preguntaActual / PREGUNTAS.length) * 100);
  document.getElementById('progreso-bar').style.width = `${progresoPct}%`;

  // Genera dinamicamente un boton por cada opcion de respuesta
  const contenedor = document.getElementById('opciones');
  contenedor.innerHTML = '';
  pregunta.opciones.forEach((opcion, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opcion;
    btn.className = 'opcion-btn';
    btn.dataset.testid = `opcion-${idx}`; // Facilita la localizacion del elemento en los tests E2E
    btn.addEventListener('click', () => responder(idx));
    contenedor.appendChild(btn);
  });
}

// Procesa la respuesta seleccionada, actualiza puntuacion y avanza de pregunta
function responder(idxSeleccionado) {
  const pregunta = PREGUNTAS[state.preguntaActual];
  if (idxSeleccionado === pregunta.correcta) {
    state.aciertos += 1;
  }

  const puntosParciales = Math.round((state.aciertos / PREGUNTAS.length) * 100);
  document.getElementById('puntos-actuales').textContent = `Puntos: ${puntosParciales}`;

  state.preguntaActual += 1;

  if (state.preguntaActual < PREGUNTAS.length) {
    renderPregunta();
  } else {
    finalizarQuiz();
  }
}

// Envia el resultado al backend y muestra la pantalla final con puntos y badge obtenida
async function finalizarQuiz() {
  document.getElementById('progreso-bar').style.width = '100%';

  const respuesta = await fetch('/api/quiz/completar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: state.usuario,
      modulo: 'fundamentos-testing',
      aciertos: state.aciertos,
      totalPreguntas: PREGUNTAS.length,
    }),
  });
  const data = await respuesta.json();

  pantallaQuiz.hidden = true;
  pantallaResultado.hidden = false;
  document.getElementById('resultado-puntos').textContent = `Puntuacion final: ${data.puntos} puntos`;
  document.getElementById('resultado-badge').textContent = `Badge obtenida: ${data.badge}`;
}
