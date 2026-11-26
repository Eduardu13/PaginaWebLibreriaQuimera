const API_CONTACTO_URL = "https://localhost:7270";

const formContacto = document.getElementById('formContacto');
const btnVerComentarios = document.getElementById("btnVerComentarios");
const contenedorComentarios = document.getElementById("contenedorComentariosEnviados");

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

if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault();

        const sesionActual = JSON.parse(localStorage.getItem('usuarioQuimera'));
        if (!sesionActual) {
            alert("¡Atención! Necesitas iniciar sesión o crear una cuenta para poder enviarnos un mensaje.");
            window.location.href = "usuario.html";
            return;
        }

        const datos = {
            nombre: document.getElementById('contactoNombre').value,
            telefono: document.getElementById('contactoTelefono').value,
            correo: document.getElementById('contactoCorreo').value,
            mensaje: document.getElementById('contactoMensaje').value
        };

        try {
            const respuesta = await fetch(`${API_CONTACTO_URL}/enviar-contacto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (resultado.exito) {
                alert(resultado.mensaje);
                document.getElementById('contactoMensaje').value = "";
                document.getElementById('contactoTelefono').value = "";
                if (contenedorComentarios && contenedorComentarios.style.display === "block") {
                    await renderizarComentariosUsuario();
                }
                await verificarActividadRecienteComentarios();
            } else {
                alert("Hubo un problema: " + resultado.mensaje);
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo conectar con el servidor.");
        }
    });
}

function obtenerCorreoConsulta() {
    const correoInput =
        document.getElementById("contactoCorreo")?.value ||
        document.getElementById("email")?.value ||
        document.getElementById("correo")?.value ||
        "";
    const sesion = JSON.parse(localStorage.getItem("usuarioQuimera"));
    return (correoInput || sesion?.correo || "").trim();
}

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

async function verificarActividadRecienteComentarios() {
    const correo = obtenerCorreoConsulta();
    if (!btnVerComentarios || !correo) return;

    if (!btnVerComentarios.dataset.textoBase) {
        btnVerComentarios.dataset.textoBase = btnVerComentarios.textContent.trim();
    }

    try {
        const resp = await fetch(`${API_CONTACTO_URL}/mis-comentarios/${encodeURIComponent(correo)}`);
        if (!resp.ok) return;

        const comentarios = await resp.json();
        const sinLeer = Array.isArray(comentarios)
            ? comentarios.filter(c => c.respuestaAdmin && !c.leidoUsuario).length
            : 0;

        if (sinLeer > 0) {
            btnVerComentarios.innerHTML = `${btnVerComentarios.dataset.textoBase} <span style="background: #4f0802; color: #fffde7; padding: 2px 8px; border-radius: 999px; font-size: 12px; margin-left: 6px;">● ${sinLeer} nueva${sinLeer > 1 ? "s" : ""}</span>`;
        } else {
            btnVerComentarios.textContent = btnVerComentarios.dataset.textoBase;
        }
    } catch (e) {
        console.error("Error verificando actividad reciente:", e);
    }
}

async function marcarRespuestaLeida(idMensaje) {
    try {
        await fetch(`${API_CONTACTO_URL}/api/comentarios/${idMensaje}/leido`, {
            method: "PUT"
        });
        await renderizarComentariosUsuario();
        await verificarActividadRecienteComentarios();
    } catch (e) {
        console.error("Error marcando respuesta como leída:", e);
    }
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

    await renderizarComentariosUsuario();
    await verificarActividadRecienteComentarios();
}

async function renderizarComentariosUsuario() {
    if (!contenedorComentarios) return;

    contenedorComentarios.innerHTML = "<p>Cargando comentarios...</p>";

    const correoConsulta = obtenerCorreoConsulta();
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

    const sinLeer = comentarios.filter(c => c.respuestaAdmin && !c.leidoUsuario).length;
    const bannerActividad = sinLeer > 0
        ? `<div style="background-color: #d4a20f; color: #1f3541; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-weight: bold;">
               Actividad reciente: Tienes ${sinLeer} respuesta(s) nueva(s) de Librería Quimera.
           </div>`
        : "";

    contenedorComentarios.innerHTML = bannerActividad + comentarios.map((c, idx) => {
        const tieneRespuestaNueva = Boolean(c.respuestaAdmin && !c.leidoUsuario);

        return `
            <div style="background: #ffffff; border: 1px solid #d4d4d4; border-left: 5px solid ${tieneRespuestaNueva ? '#d4a20f' : '#728156'}; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px;">
                    <p style="margin: 0;">
                        <strong>${c.nombre || "Usuario"}</strong> — <span style="font-size: 13px; color: #555;">${c.correo || ""}</span>
                        ${tieneRespuestaNueva ? `<span style="background: #4f0802; color: #fffde7; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-left: 6px;">● Actividad reciente</span>` : ""}
                    </p>
                    <button type="button" class="btn-eliminar-comentario" data-id="${c.idMensaje || ""}" data-index="${idx}" style="background: #8b0000; color: #ffffff; border: none; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-family: 'Marcellus', serif; font-size: 13px;">
                        Eliminar
                    </button>
                </div>
                <p style="margin-bottom: 6px; font-size: 15px;">${c.mensaje}</p>
                ${c.fechaEnvio ? `<p style="margin-bottom: 6px; font-size: 12px; color: #666;">Fecha: ${c.fechaEnvio}</p>` : ""}

                ${c.respuestaAdmin ? `
                    <div style="background: #f5f8ec; border: 1px solid #c7d3b0; border-radius: 8px; padding: 10px 12px; margin-top: 8px;">
                        <p style="margin: 0 0 4px; font-size: 14px; color: #1f3541;"><strong>Respuesta de Librería Quimera:</strong></p>
                        <p style="margin: 0; font-size: 14px;">${c.respuestaAdmin}</p>
                        ${tieneRespuestaNueva ? `
                            <button type="button" class="btn-marcar-leido" data-id="${c.idMensaje}" style="margin-top: 8px; background: #1f3541; color: #fffde7; border: none; border-radius: 6px; padding: 5px 10px; cursor: pointer; font-family: 'Marcellus', serif; font-size: 12px;">
                                Marcar como leída
                            </button>
                        ` : `<small style="display: block; margin-top: 6px; color: #4c5d66;">✓ Leída</small>`}
                    </div>
                ` : `<small style="color: #777;">Sin respuesta todavía.</small>`}
            </div>
        `;
    }).join("");

    document.querySelectorAll(".btn-eliminar-comentario").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id ? Number(btn.dataset.id) : null;
            const idx = Number(btn.dataset.index);
            eliminarComentario(id, idx);
        });
    });

    document.querySelectorAll(".btn-marcar-leido").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            if (id) marcarRespuestaLeida(id);
        });
    });
}

if (btnVerComentarios && contenedorComentarios) {
    btnVerComentarios.addEventListener("click", async () => {
        if (contenedorComentarios.style.display === "block") {
            contenedorComentarios.style.display = "none";
            return;
        }

        contenedorComentarios.style.display = "block";
        await renderizarComentariosUsuario();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    verificarActividadRecienteComentarios();
});