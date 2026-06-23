/* =============================================
   APP.JS - Proyecto Contador Spiderman
   ============================================= */

/* -----------------------------------------------
   MENSAJES DE CADA FLOR
   -----------------------------------------------
   Escribe aquí el mensaje que verá el usuario
   al tocar cada flor. Puedes usar saltos de línea
   escribiendo \n dentro del texto.
   ----------------------------------------------- */

const MENSAJES = {
  superiorIzquierda: "No ha pasado demasiado tiempo desde volvimos a hablar, a vernos, a decirnos te amo 💖(buen par de intensos)",
  superiorDerecha:   "no quiero perder mas oportunidades contigo, eres a quien amo y con quiero estar",
  inferiorDerecha:   "te amo demasiado, tu carita, tu sonrisa, tu baile de comida rica, tu mirada nerviosa, todo tu ser",
  inferiorIzquierda: "hay algo que quiero preguntarte, quise hacerlo de una manera entretenida con las cosas nuevas que aprendi",
  central:           "¿Quieres ser mi novia? 💖"
};

/* -----------------------------------------------
   FECHA OBJETIVO DEL CONTADOR
   ----------------------------------------------- */
const FECHA_OBJETIVO = new Date("2026-07-29T20:00:00");

/* -----------------------------------------------
   COLORES DE FLORES DE ESQUINA (aleatorio, sin repetir)
   ----------------------------------------------- */
const COLORES_DISPONIBLES = ["#FF69B4", "#FFD700", "#1E90FF", "#9B59B6"]; // rosa, amarillo, azul, púrpura
const COLOR_CENTRAL = "#CC0000"; // rojo

/* =============================================
   INICIALIZACIÓN
   ============================================= */
window.addEventListener("DOMContentLoaded", () => {
  iniciarContador();
  construirFlores();
});

/* =============================================
   PANTALLA 1 - CONTADOR REGRESIVO
   ============================================= */
let contadorTerminado = false;
let intervaloContador = null;

function iniciarContador() {
  actualizarContador();
  intervaloContador = setInterval(actualizarContador, 1000);
}

function actualizarContador() {
  const ahora = new Date();
  const diferencia = FECHA_OBJETIVO - ahora;

  if (diferencia <= 0) {
    clearInterval(intervaloContador);
    document.getElementById("horas").textContent = "00";
    document.getElementById("minutos").textContent = "00";
    document.getElementById("segundos").textContent = "00";
    mostrarTocaContinuar();
    return;
  }

  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  document.getElementById("horas").textContent = String(horas).padStart(2, "0");
  document.getElementById("minutos").textContent = String(minutos).padStart(2, "0");
  document.getElementById("segundos").textContent = String(segundos).padStart(2, "0");
}

function mostrarTocaContinuar() {
  contadorTerminado = true;
  document.getElementById("toca-continuar").classList.remove("oculto");
  document.getElementById("pantalla1").addEventListener("click", iniciarTransicion);
}

function iniciarTransicion() {
  if (!contadorTerminado) return;

  document.getElementById("pantalla1").removeEventListener("click", iniciarTransicion);

  // Fundir directamente a negro
  document.getElementById("overlay-negro").classList.add("fundiendo");

  // Cambiar a pantalla 2
  setTimeout(() => {
    document.getElementById("pantalla1").classList.add("oculto");
    document.getElementById("pantalla2").classList.remove("oculto");
    document.getElementById("pantalla2").classList.add("activa");
    iniciarSecuenciaFlores();
  }, 600);
}


/* =============================================
   PANTALLA 2 - FLORES ASTER
   ============================================= */

const ORDEN_FLORES = [
  "flor-sup-izq",
  "flor-sup-der",
  "flor-inf-der",
  "flor-inf-izq",
  "flor-central"
];

let indiceActual = 0;
let secuenciaCompleta = false;
let mensajeAbierto = false;
let coloresAsignados = {};

function construirFlores() {
  // Mezclar colores aleatoriamente sin repetir
  const coloresMezclados = [...COLORES_DISPONIBLES].sort(() => Math.random() - 0.5);
  const idsEsquina = ["flor-sup-izq", "flor-sup-der", "flor-inf-der", "flor-inf-izq"];

  idsEsquina.forEach((id, i) => {
    coloresAsignados[id] = coloresMezclados[i];
    dibujarAster(id, coloresMezclados[i], false);
  });

  coloresAsignados["flor-central"] = COLOR_CENTRAL;
  dibujarAster("flor-central", COLOR_CENTRAL, true);

  // Eventos de clic en flores
  ORDEN_FLORES.forEach(id => {
    document.getElementById(id).addEventListener("click", (e) => {
      e.stopPropagation();
      manejarClicFlor(id);
    });
  });

  // Clic en fondo para cerrar modal
  document.getElementById("pantalla2").addEventListener("click", () => {
    if (mensajeAbierto) cerrarMensaje();
  });
}

function dibujarAster(idContenedor, color, esCentral) {
  const numPetalos = 22;
  const cx = esCentral ? 90 : 60;
  const cy = esCentral ? 90 : 60;
  const largoP = esCentral ? 62 : 44;
  const anchoP = esCentral ? 7 : 5;
  const idGrupo = "petalos-" + idContenedor.replace("flor-", "");

  const g = document.getElementById(idGrupo);
  if (!g) return;

  for (let i = 0; i < numPetalos; i++) {
    const angulo = (360 / numPetalos) * i;
    const elipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    elipse.setAttribute("cx", cx);
    elipse.setAttribute("cy", cy - largoP / 2);
    elipse.setAttribute("rx", anchoP);
    elipse.setAttribute("ry", largoP / 2);
    elipse.setAttribute("fill", color);
    elipse.setAttribute("opacity", "0.92");
    elipse.setAttribute("transform", `rotate(${angulo}, ${cx}, ${cy})`);
    g.appendChild(elipse);
  }
}

function iniciarSecuenciaFlores() {
  indiceActual = 0;
  activarFlor(ORDEN_FLORES[indiceActual]);
}

function activarFlor(id) {
  ORDEN_FLORES.forEach(fid => {
    document.getElementById(fid).classList.remove("flor-parpadeando");
  });
  document.getElementById(id).classList.add("flor-parpadeando");
}

function manejarClicFlor(id) {
  if (mensajeAbierto) return;

  if (!secuenciaCompleta) {
    // Solo responde si es la flor correcta
    if (id !== ORDEN_FLORES[indiceActual]) return;

    document.getElementById(id).classList.remove("flor-parpadeando");
    abrirMensaje(id);

    indiceActual++;
    if (indiceActual >= ORDEN_FLORES.length) {
      secuenciaCompleta = true;
    }
  } else {
    // Secuencia completa: cualquier flor abre su mensaje
    abrirMensaje(id);
  }
}

function abrirMensaje(idFlor) {
  const color = coloresAsignados[idFlor];
  const modal = document.getElementById("modal-mensaje");
  const texto = document.getElementById("texto-mensaje");

  texto.textContent = obtenerMensaje(idFlor);
  modal.style.borderColor = color;
  modal.classList.remove("oculto");
  mensajeAbierto = true;
}

function cerrarMensaje() {
  document.getElementById("modal-mensaje").classList.add("oculto");
  mensajeAbierto = false;

  // Si la secuencia no terminó, activar la siguiente flor
  if (!secuenciaCompleta && indiceActual < ORDEN_FLORES.length) {
    activarFlor(ORDEN_FLORES[indiceActual]);
  }
}

function obtenerMensaje(idFlor) {
  const mapa = {
    "flor-sup-izq":  MENSAJES.superiorIzquierda,
    "flor-sup-der":  MENSAJES.superiorDerecha,
    "flor-inf-der":  MENSAJES.inferiorDerecha,
    "flor-inf-izq":  MENSAJES.inferiorIzquierda,
    "flor-central":  MENSAJES.central
  };
  return mapa[idFlor] || "";
}