/* ══════════════════════════════════════════════════
   ESTADO GLOBAL
══════════════════════════════════════════════════ */

let eventos    = JSON.parse(localStorage.getItem("planner"))    || {};
let tareas     = JSON.parse(localStorage.getItem("tareas"))     || [];
let historial  = JSON.parse(localStorage.getItem("historial"))  || [];

let fechaCal        = new Date();
let diaSeleccionado = "";
let colorEvento     = "#ffe5ec";
let editandoEvento  = null;
let editandoTareaId = null;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */

function colorTexto(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return (0.299*r + 0.587*g + 0.114*b)/255 > 0.55 ? "#5a3a4a" : "#fff";
}

function guardarEventos()   { localStorage.setItem("planner",   JSON.stringify(eventos)); }
function guardarTareas()    { localStorage.setItem("tareas",    JSON.stringify(tareas)); }
function guardarHistorial() { localStorage.setItem("historial", JSON.stringify(historial)); }

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

    let ini = new Date(año, mes, 1).getDay();
    ini = ini === 0 ? 6 : ini - 1;
    const total = new Date(año, mes + 1, 0).getDate();

    for (let i = 0; i < ini; i++) {
        const v = document.createElement("div");
        v.className = "dia otro";
        grid.appendChild(v);
    }

    for (let d = 1; d <= total; d++) {
        const id    = `${año}-${mes}-${d}`;
        const celda = document.createElement("div");
        celda.className = "dia";
        celda.innerHTML = `<div class="numero">${d}</div>`;

        (eventos[id] || []).forEach((ev, idx) => {
            const bg  = ev.color || "#ffe5ec";
            const txt = colorTexto(bg);
            const chip = document.createElement("div");
            chip.className = "evento";
            chip.style.cssText = `background:${bg};color:${txt}`;
            chip.innerHTML = `
                <div class="ev-body">
                    🌸 <strong>${ev.titulo}</strong>
                    ${ev.hora        ? `<br>⏰ ${ev.hora}` : ""}
                    ${ev.descripcion ? `<br><span class="ev-desc">${ev.descripcion}</span>` : ""}
                </div>
                <div class="ev-acciones">
                    <button class="btn-ev-editar"   data-id="${id}" data-idx="${idx}" title="Editar">✏️</button>
                    <button class="btn-ev-eliminar" data-id="${id}" data-idx="${idx}" title="Eliminar">🗑️</button>
                </div>`;
            celda.appendChild(chip);
        });

        celda.addEventListener("click", (e) => {
            if (e.target.closest(".btn-ev-editar, .btn-ev-eliminar")) return;
            abrirModalEvento(id, null);
        });

        grid.appendChild(celda);
    }

    grid.querySelectorAll(".btn-ev-editar").forEach(btn =>
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            abrirModalEvento(btn.dataset.id, +btn.dataset.idx);
        })
    );

    grid.querySelectorAll(".btn-ev-eliminar").forEach(btn =>
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const { id, idx } = btn.dataset;
            eventos[id].splice(+idx, 1);
            if (!eventos[id].length) delete eventos[id];
            guardarEventos();
            dibujarCalendario();
        })
    );
}

document.getElementById("btnPrevMes").addEventListener("click", () => {
    fechaCal.setMonth(fechaCal.getMonth() - 1); dibujarCalendario();
});
document.getElementById("btnNextMes").addEventListener("click", () => {
    fechaCal.setMonth(fechaCal.getMonth() + 1); dibujarCalendario();
});

/* ══════════════════════════════════════════════════
   MODAL EVENTO
══════════════════════════════════════════════════ */

document.querySelectorAll(".color-ev").forEach(btn =>
    btn.addEventListener("click", () => {
        document.querySelectorAll(".color-ev").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        colorEvento = btn.dataset.color;
    })
);
document.querySelector(".color-ev")?.classList.add("active");

function abrirModalEvento(id, idx) {
    diaSeleccionado = id || "";
    editandoEvento  = (idx !== null && idx !== undefined) ? { id, idx } : null;
    const ev        = editandoEvento ? eventos[id][idx] : null;

    document.querySelector("#modalEvento .form-header h2").textContent =
        ev ? "✏️ Editar evento" : "🗓️ Nuevo evento";
    document.getElementById("btnGuardarEvento").textContent =
        ev ? "Actualizar 🌷" : "Guardar 🌷";

    if (id) {
        const [y, m, d] = id.split("-").map(Number);
        document.getElementById("eventoFecha").value = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        document.getElementById("eventoFechaLabel").textContent =
            new Date(y, m, d).toLocaleDateString("es-ES", { day:"numeric", month:"long", year:"numeric" });
    } else {
        document.getElementById("eventoFecha").value = "";
        document.getElementById("eventoFechaLabel").textContent = "Elige la fecha del evento";
    }

    document.getElementById("eventoTitulo").value      = ev?.titulo      ?? "";
    document.getElementById("eventoHora").value        = ev?.hora        ?? "";
    document.getElementById("eventoDescripcion").value = ev?.descripcion ?? "";

    colorEvento = ev?.color ?? "#ffe5ec";
    document.querySelectorAll(".color-ev").forEach(b =>
        b.classList.toggle("active", b.dataset.color === colorEvento)
    );

    document.getElementById("modalEvento").classList.add("active");
}

function cerrarModalEvento() {
    document.getElementById("modalEvento").classList.remove("active");
    editandoEvento = null;
}

document.getElementById("btnAgregarEvento").addEventListener("click", () => abrirModalEvento(null, null));
document.getElementById("closeEvento").addEventListener("click", cerrarModalEvento);
document.getElementById("btnCancelarEvento").addEventListener("click", cerrarModalEvento);
window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalEvento")) cerrarModalEvento();
});

document.getElementById("btnGuardarEvento").addEventListener("click", () => {
    const tituloVal = document.getElementById("eventoTitulo").value.trim();
    if (!tituloVal) { document.getElementById("eventoTitulo").focus(); return; }

    const fechaInput = document.getElementById("eventoFecha").value;
    let idFinal = diaSeleccionado;
    if (fechaInput) {
        const [y, m, d] = fechaInput.split("-").map(Number);
        idFinal = `${y}-${m-1}-${d}`;
    }
    if (!idFinal) { document.getElementById("eventoFecha").focus(); return; }

    const datos = {
        titulo:      tituloVal,
        hora:        document.getElementById("eventoHora").value,
        descripcion: document.getElementById("eventoDescripcion").value.trim(),
        color:       colorEvento
    };

    if (editandoEvento) {
        const { id: idOrig, idx } = editandoEvento;
        if (idOrig !== idFinal) {
            eventos[idOrig].splice(idx, 1);
            if (!eventos[idOrig].length) delete eventos[idOrig];
            (eventos[idFinal] = eventos[idFinal] || []).push(datos);
        } else {
            eventos[idOrig][idx] = datos;
        }
    } else {
        (eventos[idFinal] = eventos[idFinal] || []).push(datos);
    }

    guardarEventos();
    cerrarModalEvento();
    dibujarCalendario();
});

/* ══════════════════════════════════════════════════
   HISTORIAL DE COMPLETADAS
══════════════════════════════════════════════════ */

const btnHistorial  = document.getElementById("btnHistorial");
const historialPanel = document.getElementById("historialPanel");
const historialBadge = document.getElementById("historialBadge");
const historialLista = document.getElementById("historialLista");

function actualizarBadge() {
    historialBadge.textContent = historial.length;
    historialBadge.style.display = historial.length > 0 ? "flex" : "none";
}

function renderHistorial() {
    historialLista.innerHTML = "";
    if (historial.length === 0) {
        historialLista.innerHTML = `<li class="historial-vacio">¡Aún no hay tareas completadas! 🌱</li>`;
        return;
    }
    [...historial].reverse().forEach((t, iRev) => {
        const i   = historial.length - 1 - iRev;   // índice real
        const li  = document.createElement("li");
        li.className = "historial-item";
        li.style.borderLeft = `4px solid ${t.color || "#ccc"}`;
        li.innerHTML = `
            <div class="hi-info">
                <strong>${t.titulo}</strong>
                <span class="hi-meta">
                    ${t.categoria ? `📂 ${t.categoria}` : ""}
                    ${t.fecha     ? ` · � ${t.fecha}` : ""}
                    ${t.prioridad ? ` · ⚡ ${t.prioridad}` : ""}
                </span>
                ${t.descripcion ? `<span class="hi-desc">${t.descripcion}</span>` : ""}
                <span class="hi-completada">✅ Completada el ${t.fechaCompletada}</span>
            </div>
            <button class="btn-hi-borrar" data-idx="${i}" title="Borrar definitivamente">🗑️</button>`;

        li.querySelector(".btn-hi-borrar").addEventListener("click", (e) => {
            e.stopPropagation();
            historial.splice(+e.currentTarget.dataset.idx, 1);
            guardarHistorial();
            actualizarBadge();
            renderHistorial();
        });

        historialLista.appendChild(li);
    });
}

btnHistorial.addEventListener("click", () => {
    historialPanel.classList.toggle("open");
    if (historialPanel.classList.contains("open")) renderHistorial();
});

document.getElementById("historialCerrar").addEventListener("click", () =>
    historialPanel.classList.remove("open")
);

/* Completar una tarea: brillo → esperar 5 s → mover al historial */
function completarTarea(id, notaEl) {
    const idx = tareas.findIndex(t => t._id === id);
    if (idx === -1) return;

    const tarea = tareas[idx];

    // 1. Añadir clase de brillo
    notaEl.classList.add("nota-completada");

    // 2. Después de 5 s, archivar
    setTimeout(() => {
        // Guardar en historial
        historial.push({
            ...tarea,
            fechaCompletada: new Date().toLocaleDateString("es-ES",
                { day:"numeric", month:"long", year:"numeric" })
        });
        guardarHistorial();
        actualizarBadge();

        // Quitar de tareas activas
        tareas.splice(idx, 1);
        guardarTareas();

        // Animar salida
        notaEl.classList.add("nota-salida");
        notaEl.addEventListener("animationend", () => notaEl.remove(), { once: true });
    }, 5000);
}

/* ══════════════════════════════════════════════════
   MODAL TAREA
══════════════════════════════════════════════════ */

const modalTarea = document.getElementById("modalTarea");
const formulario = document.getElementById("taskForm");

function setSelectValue(id, valor) {
    const sel = document.getElementById(id);
    if (!sel) return;
    for (const opt of sel.options) {
        if (opt.value === valor || opt.text === valor) { sel.value = opt.value; return; }
    }
}

function abrirModalTarea(tarea = null) {
    editandoTareaId = tarea?._id ?? null;
    const esEd = tarea !== null;

    document.querySelector("#modalTarea .form-header h2").textContent =
        esEd ? "✏️ Editar tarea" : "✨ Nueva tarea";
    document.querySelector("#modalTarea .form-header p").textContent =
        esEd ? "Modifica los datos de tu tarea." : "Organiza tu día de una forma sencilla.";
    document.getElementById("btnGuardar").textContent = esEd ? "Actualizar" : "Guardar";

    if (esEd) {
        document.getElementById("titulo").value      = tarea.titulo;
        document.getElementById("descripcion").value = tarea.descripcion;
        document.getElementById("fecha").value       = tarea.fecha;
        document.getElementById("hora").value        = tarea.hora;
        document.getElementById("etiquetas").value   = tarea.etiquetas;
        setSelectValue("categoria", tarea.categoria);
        setSelectValue("prioridad", tarea.prioridad);
        colorSeleccionado = tarea.color || "#F0D9EF";
        document.querySelectorAll(".color").forEach(b =>
            b.classList.toggle("active", b.dataset.color === colorSeleccionado)
        );
    } else {
        formulario.reset();
        colorSeleccionado = "#F0D9EF";
        document.querySelectorAll(".color").forEach(b => b.classList.remove("active"));
    }

    modalTarea.classList.add("active");
}

function cerrarModalTarea() {
    modalTarea.classList.remove("active");
    editandoTareaId = null;
    formulario.reset();
}

document.getElementById("btnAgregarTarea").addEventListener("click", () => abrirModalTarea(null));
document.getElementById("closeTarea").addEventListener("click", cerrarModalTarea);
document.getElementById("btnCancelarTarea").addEventListener("click", cerrarModalTarea);
window.addEventListener("click", (e) => { if (e.target === modalTarea) cerrarModalTarea(); });

let colorSeleccionado = "#F0D9EF";
document.querySelectorAll(".color").forEach(btn =>
    btn.addEventListener("click", () => {
        document.querySelectorAll(".color").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        colorSeleccionado = btn.dataset.color;
    })
);

/* ══════════════════════════════════════════════════
   NOTA DOM
══════════════════════════════════════════════════ */

function crearNotaDOM(t) {
    const nota = document.createElement("div");
    nota.className = "nota";
    nota.dataset.id = t._id;
    nota.style.background = t.color;

    nota.innerHTML = `
        <h3>${t.titulo}</h3>
        <p>${t.descripcion}</p>
        <hr>
        <p>📂 ${t.categoria}</p>
        <p>📅 ${t.fecha}</p>
        <p>🕐 ${t.hora}</p>
        <p>⚡ ${t.prioridad}</p>
        <p>🏷️ ${t.etiquetas}</p>
        <div class="nota-acciones">
            <button class="btn-completar">✔ Completar</button>
            <button class="btn-editar-nota">✏️ Editar</button>
            <button class="btn-eliminar">🗑️ Eliminar</button>
        </div>`;

    nota.querySelector(".btn-completar").addEventListener("click", (e) => {
        e.stopPropagation();
        completarTarea(t._id, nota);
    });

    nota.querySelector(".btn-editar-nota").addEventListener("click", (e) => {
        e.stopPropagation();
        const tarea = tareas.find(x => x._id === t._id);
        if (tarea) abrirModalTarea(tarea);
    });

    nota.querySelector(".btn-eliminar").addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = tareas.findIndex(x => x._id === t._id);
        if (idx !== -1) tareas.splice(idx, 1);
        guardarTareas();
        nota.remove();
    });

    nota.addEventListener("click", () => {
        const tarea = tareas.find(x => x._id === t._id);
        if (tarea) abrirModalTarea(tarea);
    });

    return nota;
}

/* Submit formulario */
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const datos = {
        titulo:      document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        categoria:   document.getElementById("categoria").value,
        fecha:       document.getElementById("fecha").value,
        hora:        document.getElementById("hora").value,
        prioridad:   document.getElementById("prioridad").value,
        etiquetas:   document.getElementById("etiquetas").value,
        color:       colorSeleccionado
    };

    if (editandoTareaId !== null) {
        const idx = tareas.findIndex(x => x._id === editandoTareaId);
        if (idx !== -1) {
            tareas[idx] = { ...tareas[idx], ...datos };
            guardarTareas();
            const vieja = document.querySelector(`.nota[data-id="${editandoTareaId}"]`);
            if (vieja) vieja.replaceWith(crearNotaDOM(tareas[idx]));
        }
    } else {
        const tarea = { _id: Date.now(), ...datos };
        tareas.push(tarea);
        guardarTareas();
        document.getElementById("pizarron").appendChild(crearNotaDOM(tarea));
    }

    cerrarModalTarea();
});

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */

dibujarCalendario();
actualizarBadge();

const pizarron = document.getElementById("pizarron");
tareas.forEach(t => pizarron.appendChild(crearNotaDOM(t)));
