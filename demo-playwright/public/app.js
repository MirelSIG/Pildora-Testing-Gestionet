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

const state = {
  usuario: '',
  preguntaActual: 0,
  aciertos: 0,
};

const pantallaLogin = document.getElementById('pantalla-login');
const pantallaQuiz = document.getElementById('pantalla-quiz');
const pantallaResultado = document.getElementById('pantalla-resultado');

document.getElementById('btn-empezar').addEventListener('click', empezarQuiz);
document.getElementById('btn-reiniciar').addEventListener('click', () => location.reload());

function empezarQuiz() {
  const nombre = document.getElementById('input-usuario').value.trim();
  if (!nombre) return;

  state.usuario = nombre;
  state.preguntaActual = 0;
  state.aciertos = 0;

  pantallaLogin.hidden = true;
  pantallaQuiz.hidden = false;
  document.getElementById('total-preguntas').textContent = PREGUNTAS.length;

  renderPregunta();
}

function renderPregunta() {
  const pregunta = PREGUNTAS[state.preguntaActual];
  document.getElementById('num-pregunta').textContent = state.preguntaActual + 1;
  document.getElementById('texto-pregunta').textContent = pregunta.texto;

  const progresoPct = Math.round((state.preguntaActual / PREGUNTAS.length) * 100);
  document.getElementById('progreso-bar').style.width = `${progresoPct}%`;

  const contenedor = document.getElementById('opciones');
  contenedor.innerHTML = '';
  pregunta.opciones.forEach((opcion, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opcion;
    btn.className = 'opcion-btn';
    btn.dataset.testid = `opcion-${idx}`;
    btn.addEventListener('click', () => responder(idx));
    contenedor.appendChild(btn);
  });
}

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
