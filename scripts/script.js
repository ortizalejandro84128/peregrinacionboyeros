// script.js


function contarAsientosDisponibles() {
  // Selecciona todas las celdas que tengan la clase asiento-vacio
  const libres = document.querySelectorAll(".asiento-vacio");
  return libres.length;
}

// script.js

function asignarAsientos(grupos) {
  const ocupados = new Set();   // Asientos ya ocupados
  const nombres = new Set();    // Nombres ya usados
  const errores = [];           // Mensajes de error

  grupos.forEach(grupo => {
    // Validar nombre duplicado
    if (nombres.has(grupo.nombre)) {
      errores.push(`⚠️ El nombre "${grupo.nombre}" está repetido`);
      return; // no asignar este grupo
    }
    nombres.add(grupo.nombre);

    grupo.asientos.forEach(cod => {
      // Validar asiento duplicado
      if (ocupados.has(cod)) {
        errores.push(`⚠️ El asiento ${cod} ya fue asignado`);
        return; // no asignar este asiento
      }

      const celda = document.getElementById(cod);
      if (celda) {
        celda.textContent = grupo.nombre;
        celda.classList.remove("asiento-vacio");
        celda.classList.add("ocupado");
        ocupados.add(cod);
      } else {
        errores.push(`⚠️ El asiento ${cod} no existe en la tabla`);
      }
    });
  });

  // Mostrar resumen de errores
  if (errores.length > 0) {
    const resumen = errores.join("<br>");
    const contenedorErrores = document.getElementById("errores");
    if (contenedorErrores) {
      contenedorErrores.innerHTML = resumen;
    } else {
      document.body.insertAdjacentHTML("beforeend", `<div id="errores" style="color:red">${resumen}</div>`);
    }
  }
}


async function cargarGruposDesdeCSV(url) {
  const response = await fetch(url);
  const text = await response.text();

  // Dividir en filas y quitar encabezado
  const filas = text.trim().split("\n").slice(1);

  const grupos = filas.map(linea => {
    // Dividir solo en dos columnas: nombre y asientos
    const [nombre, asientosRaw] = linea.split(/,(.+)/); // divide en la primera coma
    // Quitar comillas y espacios
    const limpio = asientosRaw.replace(/"/g, "").trim();
    // Separar los asientos por coma
    const asientos = limpio.split(",").map(s => s.trim());

    return { nombre: nombre.trim(), asientos };
  });

  return grupos;
}
