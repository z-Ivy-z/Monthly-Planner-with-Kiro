# 📔 Planner & TO DO

Tu organizador personal con calendario integrado · hecho con HTML, CSS y JavaScript puro

---

## 🌷 ¿Qué es esto?

**Planner & TO DO** es una aplicación web de página única que combina un **calendario mensual interactivo** con un **tablero de tareas estilo post-it**. Todo corre directamente en el navegador, sin servidor ni base de datos — los datos se guardan automáticamente en el `localStorage` de tu navegador.

La interfaz está dividida en dos mitades: el calendario a la izquierda y la lista de tareas a la derecha, para que puedas planear y organizar sin cambiar de pantalla.

---

## ⭐ Funcionalidades

- 🗓️ **Calendario mensual** con navegación y múltiples eventos por día
- 🎨 **Color personalizable** para cada evento y cada tarjeta de tarea
- ✏️ **Edita o elimina** eventos y tareas en cualquier momento
- ✅ **Marca tareas como completadas** con animación de brillo
- 🏆 **Historial de completadas** en panel flotante con fecha de cierre
- 💾 **Persistencia automática** en localStorage — sin cuenta ni servidor

---

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript ES6+
- localStorage API
- Sin frameworks 🎉

---

## 📥 Cómo clonar el repositorio

Necesitas tener **Git** instalado en tu computadora. Si no lo tienes, descárgalo desde [git-scm.com](https://git-scm.com).

1. **Abre una terminal** (CMD, PowerShell, Git Bash o la terminal de tu IDE).

2. **Navega a la carpeta** donde quieras guardar el proyecto:
   ```bash
   cd ~/Desktop
   ```

3. **Clona el repositorio** con el siguiente comando:
   ```bash
   git clone https://github.com/tu-usuario/monthly-planner.git
   ```

4. **Entra a la carpeta** del proyecto:
   ```bash
   cd monthly-planner
   ```

5. **Abre el archivo `index.html`** directamente en tu navegador (doble clic) o usa la extensión **Live Server** de VS Code para verlo con recarga automática.

💡 **No se requiere npm, node ni ningún proceso de build.** El proyecto es 100% estático.

---

## 🗺️ Cómo usar la app

### Panel izquierdo — Calendario

- Usa las flechas **⬅️ ➡️** para navegar entre meses.
- Haz **clic en cualquier casilla** del calendario para agregar un nuevo evento en ese día.
- Cada evento muestra botones **✏️ Editar** y **🗑️ Eliminar**.
- Al editar puedes cambiar la fecha y el evento se moverá al nuevo día automáticamente.
- Puedes agregar **tantos eventos como quieras** en el mismo día.

### Panel derecho — TO DO

- Pulsa **➕ Agregar tarea** para crear una nueva nota.
- Pulsa **🗓️ Agregar evento** para crear un evento desde el lado del TO DO, eligiendo la fecha manualmente.
- Haz clic en una nota (o en ✏️ Editar) para modificar sus datos.
- Pulsa **✔ Completar** en una nota para marcarla como terminada: la tarjeta brillará en dorado durante 5 segundos y luego pasará al historial.
- Usa 🗑️ Eliminar para borrar la tarea sin archivarla.

### Botón flotante ✅ — Historial

- Aparece en la **esquina inferior derecha**. El número en rojo indica cuántas tareas has completado.
- Haz clic para abrir el panel de historial con todas las tareas archivadas, su fecha de completado y su color original.
- Pulsa 🗑️ en cada ítem para **borrarlo definitivamente** del historial.

---

## 📁 Estructura del proyecto

```
monthly-planner/
├── index.html        # App principal (layout + modales)
├── style.css         # Todos los estilos
├── script.js         # Lógica completa (calendario, tareas, historial)
├── calendario.html   # Versión independiente del calendario (legado)
├── README.html       # Versión visual del README con la estética de la app
└── README.md         # Este archivo
```

---

## 💡 Tips y notas

- Los datos se guardan en **localStorage** del navegador, así que persisten aunque cierres la pestaña.
- Si limpias el caché o el almacenamiento del sitio, los datos se borrarán. Considera exportar tus notas si son importantes.
- Para la mejor experiencia visual usa **Chrome, Edge o Firefox** en su versión más reciente.
- En pantallas pequeñas (< 860 px) el layout cambia a una sola columna vertical.

---

## 📸 Vista previa

Abre `README.html` en tu navegador para ver una versión interactiva con la misma estética de la app.

---

## 📄 Licencia

Este proyecto es de uso libre. Siéntete libre de usarlo, modificarlo y compartirlo.

---

**Hecho con 💗 · Planner & TO DO · HTML + CSS + JS puro**
