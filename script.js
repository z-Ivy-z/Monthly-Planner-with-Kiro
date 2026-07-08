/* ══════════════════════════════════════════════════
   ESTADO GLOBAL
══════════════════════════════════════════════════ */

// Eventos del calendario: { "2026-6-7": [ {titulo, hora, descripcion}, ... ] }
let eventos = JSON.parse(localStorage.getItem("planner")) || {};

let fechaCal = new Date();          // mes visible en el calendario
let diaSeleccionado = "";           // "YYYY-M-D" del día en el que se abrió el modal

/* ══════════════════════════════════════════════════
   CALENDARIO
══════════════════════════════════════════════════ */

function dibujarCalendario() {
    const grid = document.getElementById("calendario");
    grid.innerHTML = "";

    const año = fechaCal.getFullYear();
    const mes  = fechaCal.getMonth();

    document.getElementById("calMes").textContent =
        fechaCal.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

    // Hueco inicial (semana empieza en lunes)
    let inicioSemana = new Date(año, mes, 1).getDay();
    inicioSemana = inicioSemana === 0 ? 6 : inicioSemana - 1;

    const totalDias = new Date(año, mes + 1, 0).getDate();

    // Celdas vacías antes del día 1
    for (let i = 0; i < inicioSemana; i++) {
        const vacio = document.createElement("div");
        vacio.className = "dia otro";
        grid.appendChild(vacio);
    }

    // Días del mes
    for (let d = 1; d <= totalDias; d++) {
        const id = `${año}-${mes}-${d}`;
        const celda = document.createElement("div");
        celda.className = "dia";

        // Número del día
        celda.innerHTML = `<div class="numero">${d}</div>`;

        // Eventos de ese día
        const lista = eventos[id];
        if (lista && lista.length > 0) {
            lista.forEach((ev, idx) => {
                celda.innerHTML += `
                    <div class="evento">
                        🌸 <strong>${ev.titulo}</strong>
                        ${ev.hora ? `<br>⏰ ${ev.hora}` : ""}
                        ${ev.descripcion ? `<br><span class="ev-desc">${ev.descripcion}</span>` : ""}
                        <button class="btn-ev-eliminar" data-id="${id}" data-idx="${idx}" title="Eliminar evento">🗑️</button>
                    </div>`;
            });
        }

        // Clic en la celda → abrir modal evento con ese día preseleccionado
        celda.addEventListener("click", (e) => {
            // No disparar si se pulsó el botón eliminar
            if (e.target.closest(".btn-ev-eliminar")) return;
            abrirModalEvento(id);
        });

        grid.appendChild(celda);
    }

    // Delegar eliminación de eventos en el grid
    grid.querySelectorAll(".btn-ev-eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id  = btn.dataset.id;
            const idx = parseInt(btn.dataset.idx);
            eventos[id].splice(idx, 1);
            if (eventos[id].length === 0) delete eventos[id];
            guardarEventos();
            dibujarCalendario();
        });
    });
}

function guardarEventos() {
    localStorage.setItem("planner", JSON.stringify(eventos));
}

/* Navegación del mes */
document.getElementById("btnPrevMes").addEventListener("click", () => {
    fechaCal.setMonth(fechaCal.getMonth() - 1);
    dibujarCalendario();
});
document.getElementById("btnNextMes").addEventListener("click", () => {
    fechaCal.setMonth(fechaCal.getMonth() + 1);
    dibujarCalendario();
});

/* ══════════════════════════════════════════════════
   MODAL EVENTO
══════════════════════════════════════════════════ */

function abrirModalEvento(id) {
    diaSeleccionado = id || "";

    // Pre-rellenar la fecha si viene de una celda
    if (id) {
        const [y, m, d] = id.split("-").map(Number);
        // input[type=date] necesita formato YYYY-MM-DD con ceros
        const mm = String(m + 1).padStart(2, "0");
        const dd = String(d).padStart(2, "0");
        document.getElementById("eventoFecha").value = `${y}-${mm}-${dd}`;
        document.getElementById("eventoFechaLabel").textContent =
            new Date(y, m, d).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    } else {
        document.getElementById("eventoFecha").value = "";
        document.getElementById("eventoFechaLabel").textContent = "Elige la fecha del evento";
    }

    document.getElementById("eventoTitulo").value = "";
    document.getElementById("eventoHora").value   = "";
    document.getElementById("eventoDescripcion").value = "";
    document.getElementById("modalEvento").classList.add("active");
}

function cerrarModalEvento() {
    document.getElementById("modalEvento").classList.remove("active");
}

document.getElementById("btnAgregarEvento").addEventListener("click", () => {
    abrirModalEvento(null);
});

document.getElementById("closeEvento").addEventListener("click", cerrarModalEvento);
document.getElementById("btnCancelarEvento").addEventListener("click", cerrarModalEvento);

document.getElementById("btnGuardarEvento").addEventListener("click", () => {
    const tituloVal = document.getElementById("eventoTitulo").value.trim();
    if (!tituloVal) {
        document.getElementById("eventoTitulo").focus();
        return;
    }

    // Leer la fecha del input (puede haberse editado manualmente)
    const fechaInput = document.getElementById("eventoFecha").value;
    let idFinal = diaSeleccionado;

    if (fechaInput) {
        const [y, m, d] = fechaInput.split("-").map(Number);
        idFinal = `${y}-${m - 1}-${d}`;
    }

    if (!idFinal) {
        document.getElementById("eventoFecha").focus();
        return;
    }

    const nuevo = {
        titulo:      tituloVal,
        hora:        document.getElementById("eventoHora").value,
        descripcion: document.getElementById("eventoDescripcion").value.trim()
    };

    if (!eventos[idFinal]) eventos[idFinal] = [];
    eventos[idFinal].push(nuevo);

    guardarEventos();
    cerrarModalEvento();
    dibujarCalendario();
});

// Cerrar modal evento al hacer clic fuera
window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalEvento")) {
        cerrarModalEvento();
    }
});

/* ══════════════════════════════════════════════════
   MODAL TAREA (TO DO)
══════════════════════════════════════════════════ */

const modalTarea   = document.getElementById("modalTarea");
const closeTarea   = document.getElementById("closeTarea");
const btnCancelar  = document.getElementById("btnCancelarTarea");
const formulario   = document.getElementById("taskForm");

document.getElementById("btnAgregarTarea").addEventListener("click", () => {
    modalTarea.classList.add("active");
});

closeTarea.addEventListener("click", () => {
    modalTarea.classList.remove("active");
});

btnCancelar.addEventListener("click", () => {
    modalTarea.classList.remove("active");
    formulario.reset();
});

window.addEventListener("click", (e) => {
    if (e.target === modalTarea) {
        modalTarea.classList.remove("active");
    }
});

/* Selector de color */
let colorSeleccionado = "#F0D9EF";

document.querySelectorAll(".color").forEach(boton => {
    boton.addEventListener("click", () => {
        document.querySelectorAll(".color").forEach(b => b.classList.remove("active"));
        boton.classList.add("active");
        colorSeleccionado = boton.dataset.color;
    });
});

/* Guardar tarea */
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo      = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const categoria   = document.getElementById("categoria").value;
    const fecha       = document.getElementById("fecha").value;
    const hora        = document.getElementById("hora").value;
    const prioridad   = document.getElementById("prioridad").value;
    const estado      = document.getElementById("estado").value;
    const etiquetas   = document.getElementById("etiquetas").value;

    const nota = document.createElement("div");
    nota.className = "nota";
    nota.style.background = colorSeleccionado;
    nota.innerHTML = `
        <h3>${titulo}</h3>
        <p>${descripcion}</p>
        <hr>
        <p>📂 ${categoria}</p>
        <p>📅 ${fecha}</p>
        <p>🕐 ${hora}</p>
        <p>⚡ ${prioridad}</p>
        <p>📌 ${estado}</p>
        <p>🏷️ ${etiquetas}</p>
        <button class="btn-eliminar">🗑️ Eliminar</button>
    `;

    nota.querySelector(".btn-eliminar").addEventListener("click", () => nota.remove());

    document.getElementById("pizarron").appendChild(nota);

    modalTarea.classList.remove("active");
    formulario.reset();
});

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
dibujarCalendario();
