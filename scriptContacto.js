const formContacto = document.getElementById('formContacto');

// MÁGIA EXTRA: Si el usuario ya inició sesión, le rellenamos su nombre y correo automáticamente
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioQuimera'));

if (usuarioActivo) {
    if (document.getElementById('contactoNombre')) {
        document.getElementById('contactoNombre').value = usuarioActivo.nombre || "";
        document.getElementById('contactoCorreo').value = usuarioActivo.correo || "";

        const tel = document.getElementById('contactoTelefono') || document.getElementById('telefono');
        if (tel) {
            tel.value = usuarioActivo.telefono || usuarioActivo.telefoo_envio || "";
        }

        const dir = document.getElementById('contactoDireccion') || document.getElementById('direccion');
        if (dir) {
            dir.value = usuarioActivo.direccion || "";
        }

        const ciu = document.getElementById('contactoCiudad') || document.getElementById('ciudad');
        if (ciu) {
            ciu.value = usuarioActivo.ciudad || "";
        }

        const cp = document.getElementById('contactoCP') || document.getElementById('cp');
        if (cp) {
            cp.value = usuarioActivo.codigo_postal || "";
        }
    }
}

// LÓGICA DEL FORMULARIO
if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos que la página se recargue de golpe

        // 1. VALIDACIÓN: ¿Tiene sesión iniciada?
        if (!usuarioActivo) {
            alert("¡Atención! Necesitas iniciar sesión o crear una cuenta para poder enviarnos un mensaje.");
            // Lo mandamos a la página de login para que entre
            window.location.href = "usuario.html"; 
            return; // Cortamos el proceso aquí para que no envíe nada
        }

        // 2. Si sí tiene sesión, recolectamos los datos escritos
        const datos = {
            nombre: document.getElementById('contactoNombre').value,
            telefono: document.getElementById('contactoTelefono').value,
            correo: document.getElementById('contactoCorreo').value,
            mensaje: document.getElementById('contactoMensaje').value
        };

        // 3. Enviamos el mensaje al "mesero" (C#)
        try {
            let respuesta = await fetch('https://localhost:7270/enviar-contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            let resultado = await respuesta.json();

            if (resultado.exito) {
                // Mostramos alerta de éxito y borramos lo que escribió en la cajita
                alert(resultado.mensaje);
                document.getElementById('contactoMensaje').value = ""; 
                document.getElementById('contactoTelefono').value = ""; 
            } else {
                alert("Hubo un problema: " + resultado.mensaje);
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo conectar con el servidor.");
        }
    });
}




document.addEventListener("DOMContentLoaded", () => {
    const mapaEl = document.getElementById("mapaRecoleccion");
    if (!mapaEl || typeof L === "undefined") return;

    const centrosRecoleccion = [
        {
            nombre: "Centro Quimera - Malecón / Centro",
            lat: 19.8454,
            lng: -90.5356,
            direccion: "Calle 59 #12, Zona Centro, Campeche",
            horario: "Lun a Sáb de 9:00 a 20:00 hrs",
            instrucciones: "Presenta tu número de pedido e identificación oficial."
        },
        {
            nombre: "Centro Quimera - Plaza / Norte",
            lat: 19.8650,
            lng: -90.5180,
            direccion: "Av. Gobernadores #240, Col. Sascalum",
            horario: "Lun a Dom de 10:00 a 21:00 hrs",
            instrucciones: "Disponible 24 horas después de notificación de entrega fallida."
        },
        {
            nombre: "Centro Quimera - Sur",
            lat: 19.8180,
            lng: -90.5320,
            direccion: "Av. Miguel Alemán #88, Col. San José",
            horario: "Lun a Vie de 9:00 a 19:00 hrs",
            instrucciones: "Resguardo del paquete hasta por 5 días hábiles."
        }
    ];

    const map = L.map("mapaRecoleccion").setView([centrosRecoleccion[0].lat, centrosRecoleccion[0].lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    const botonesContenedor = document.getElementById("botonesCentros");
    const detalleContenedor = document.getElementById("detalleCentro");
    const marcadores = [];

    function seleccionarCentro(centro, marcador) {
        map.setView([centro.lat, centro.lng], 15);
        marcador.openPopup();
        detalleContenedor.innerHTML = `
            <p style="margin-bottom: 4px;"><strong>${centro.nombre}</strong></p>
            <p style="margin-bottom: 4px;"><strong>Dirección:</strong> ${centro.direccion}</p>
            <p style="margin-bottom: 4px;"><strong>Horario:</strong> ${centro.horario}</p>
            <p style="margin-bottom: 0;"><strong>Indicaciones:</strong> ${centro.instrucciones}</p>
        `;
    }

    centrosRecoleccion.forEach(centro => {
        const marcador = L.marker([centro.lat, centro.lng]).addTo(map);
        marcador.bindPopup(`<strong>${centro.nombre}</strong><br>${centro.direccion}`);

        marcador.on("click", () => seleccionarCentro(centro, marcador));
        marcadores.push({ centro, marcador });

        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = centro.nombre;
        btn.style.cssText = "padding: 8px 14px; background: #1f3541; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-family: 'Marcellus', serif; font-size: 13px;";
        btn.addEventListener("click", () => seleccionarCentro(centro, marcador));
        botonesContenedor.appendChild(btn);
    });
});






const API_CONTACTO_URL = "https://localhost:7270";

function guardarComentarioLocal(datos) {
    const actuales = JSON.parse(localStorage.getItem("comentariosQuimera")) || [];
    actuales.unshift({
        nombre: datos.Nombre || "",
        telefono: datos.Telefono || "",
        correo: datos.Correo || "",
        mensaje: datos.Mensaje || "",
        fechaEnvio: new Date().toLocaleString("es-MX")
    });
    localStorage.setItem("comentariosQuimera", JSON.stringify(actuales));
}

async function eliminarComentario(idMensaje, indiceLocal) {
    if (!confirm("¿Quieres eliminar este comentario?")) return;

    if (idMensaje) {
        try {
            await fetch(`${API_CONTACTO_URL}/eliminar-comentario/${idMensaje}`, {
                method: "DELETE"
            });
        } catch (e) {
            console.error("Error eliminando en API:", e);
        }
    }

    const locales = JSON.parse(localStorage.getItem("comentariosQuimera")) || [];
    if (typeof indiceLocal === "number" && indiceLocal >= 0) {
        locales.splice(indiceLocal, 1);
        localStorage.setItem("comentariosQuimera", JSON.stringify(locales));
    }

    document.getElementById("btnVerComentarios").click();
    document.getElementById("btnVerComentarios").click();
}

const btnVerComentarios = document.getElementById("btnVerComentarios");
const contenedorComentarios = document.getElementById("contenedorComentariosEnviados");

if (btnVerComentarios && contenedorComentarios) {
    btnVerComentarios.addEventListener("click", async () => {
        if (contenedorComentarios.style.display === "block") {
            contenedorComentarios.style.display = "none";
            return;
        }

        contenedorComentarios.style.display = "block";
        contenedorComentarios.innerHTML = "<p>Cargando comentarios...</p>";

        const correoInput = document.getElementById("email")?.value || document.getElementById("correo")?.value || "";
        const sesion = JSON.parse(localStorage.getItem("usuarioQuimera"));
        const correoConsulta = (correoInput || sesion?.correo || "").trim();

        let comentarios = [];
        let vieneDeApi = false;

        if (correoConsulta) {
            try {
                const resp = await fetch(`${API_CONTACTO_URL}/mis-comentarios/${encodeURIComponent(correoConsulta)}`);
                if (resp.ok) {
                    const dataApi = await resp.json();
                    if (Array.isArray(dataApi) && dataApi.length > 0) {
                        comentarios = dataApi;
                        vieneDeApi = true;
                    }
                }
            } catch (e) {
                console.error("Error consultando comentarios en API:", e);
            }
        }

        if (!vieneDeApi) {
            comentarios = JSON.parse(localStorage.getItem("comentariosQuimera")) || [];
        }

        if (!comentarios.length) {
            contenedorComentarios.innerHTML = "<p>Aún no has enviado comentarios con este correo.</p>";
            return;
        }

        contenedorComentarios.innerHTML = comentarios.map((c, idx) => `
            <div style="background: #ffffff; border: 1px solid #d4d4d4; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 4px;">
                    <p style="margin: 0;"><strong>${c.nombre || "Usuario"}</strong> — <span style="font-size: 13px; color: #555;">${c.correo || ""}</span></p>
                    <button type="button" class="btn-eliminar-comentario" data-id="${c.idMensaje || ""}" data-index="${idx}" style="background: #8b0000; color: #ffffff; border: none; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-family: 'Marcellus', serif; font-size: 13px;">
                        Eliminar
                    </button>
                </div>
                <p style="margin-bottom: 6px; font-size: 15px;">${c.mensaje}</p>
                ${c.fechaEnvio ? `<p style="margin-bottom: 0; font-size: 12px; color: #666;">Fecha: ${c.fechaEnvio}</p>` : ""}
            </div>
        `).join("");

        document.querySelectorAll(".btn-eliminar-comentario").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id ? Number(btn.dataset.id) : null;
                const idx = Number(btn.dataset.index);
                eliminarComentario(id, idx);
            });
        });
    });
}