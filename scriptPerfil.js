const API_URL_PERFIL = "https://localhost:7270";

// 1. Verificamos que el usuario esté logueado
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioQuimera'));

if (!usuarioActivo) {
    window.location.href = "usuario.html";
} else {
    const saludoInicial = document.getElementById('saludoPerfil');
    if (saludoInicial) {
        saludoInicial.innerText = "Bienvenido, " + usuarioActivo.nombre;
    }
}




// 2. Botón para Cerrar Sesión
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
        let confirmacion = confirm("¿Estás seguro de que quieres cerrar sesión?");
        if (confirmacion) {
            localStorage.removeItem('usuarioQuimera');
            window.location.href = "index.html";
        }
    });
}

// 3. Botón para Cambiar Contraseña
const btnCambiarPass = document.getElementById('btnCambiarPass');
if (btnCambiarPass) {
    btnCambiarPass.addEventListener('click', async (e) => {
        e.preventDefault();
        const nuevaPass = document.getElementById('nuevaPassword').value;

        if (!nuevaPass) {
            alert("Por favor escribe una nueva contraseña.");
            return;
        }

        const datos = {
            correo: usuarioActivo.correo,
            nuevaPassword: nuevaPass
        };

        try {
            let respuesta = await fetch(`${API_URL_PERFIL}/api/cambiar-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            let resultado = await respuesta.json();
            alert(resultado.mensaje);
            document.getElementById('nuevaPassword').value = "";
        } catch (error) {
            console.error(error);
            alert("No se pudo conectar con el servidor.");
        }
    });
}

// 4. Botón para Eliminar Cuenta
const btnEliminarCuenta = document.getElementById('btnEliminarCuenta');
if (btnEliminarCuenta) {
    btnEliminarCuenta.addEventListener('click', async () => {
        const pass = document.getElementById('passEliminar').value;

        if (!pass) {
            alert("Por favor escribe tu contraseña para confirmar.");
            return;
        }

        let confirmacionSegura = confirm("¿ESTÁS TOTALMENTE SEGURO? Esta acción no se puede deshacer.");
        if (!confirmacionSegura) {
            return;
        }

        const datos = {
            correo: usuarioActivo.correo,
            password: pass
        };

        try {
            let respuesta = await fetch(`${API_URL_PERFIL}/eliminar-cuenta`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            let resultado = await respuesta.json();

            if (resultado.exito) {
                alert(resultado.mensaje);
                localStorage.removeItem('usuarioQuimera');
                window.location.href = "index.html";
            } else {
                alert(resultado.mensaje);
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo conectar con el servidor.");
        }
    });
}

// 5. Cargar y guardar Datos Personales y de Envío
function obtenerSesionQuimera() {
    return JSON.parse(localStorage.getItem("usuarioQuimera"));
}

async function inicializarDatosPerfil() {
    const sesion = obtenerSesionQuimera();
    const idUsuario = sesion?.id_usuario ?? sesion?.id;
    if (!sesion || !idUsuario) return;

    let datos = { ...sesion };

    try {
        const resp = await fetch(`${API_URL_PERFIL}/api/perfil/${idUsuario}`);
        if (resp.ok) {
            const apiData = await resp.json();
            datos = { ...datos, ...apiData };
            localStorage.setItem("usuarioQuimera", JSON.stringify({
                ...sesion,
                ...apiData,
                id: idUsuario,
                id_usuario: idUsuario
            }));
        }
    } catch (err) {
        console.error("Error cargando perfil desde API:", err);
    }

    const saludo = document.getElementById("saludoPerfil");
    if (saludo && datos.nombre) {
        saludo.textContent = `Bienvenido, ${datos.nombre}`;
    }

    if (document.getElementById("perfilCorreo")) document.getElementById("perfilCorreo").value = datos.correo || "";
    if (document.getElementById("perfilNombre")) document.getElementById("perfilNombre").value = datos.nombre || "";
    if (document.getElementById("perfilApellido")) document.getElementById("perfilApellido").value = datos.apellido || "";
    if (document.getElementById("perfilTelefono")) document.getElementById("perfilTelefono").value = datos.telefono || "";
    if (document.getElementById("perfilDireccion")) document.getElementById("perfilDireccion").value = datos.direccion || "";
    if (document.getElementById("perfilCiudad")) document.getElementById("perfilCiudad").value = datos.ciudad || "";
    if (document.getElementById("perfilCP")) document.getElementById("perfilCP").value = datos.codigo_postal || "";
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarDatosPerfil();

    const formDatosPerfil = document.getElementById("formDatosPerfil");
    if (formDatosPerfil) {
        formDatosPerfil.addEventListener("submit", async (e) => {
            e.preventDefault();

            const sesion = obtenerSesionQuimera();
            const idUsuario = sesion?.id_usuario ?? sesion?.id;
            if (!idUsuario) return;

            const nombre = document.getElementById("perfilNombre")?.value.trim() || "";
            const apellido = document.getElementById("perfilApellido")?.value.trim() || "";
            const telefono = document.getElementById("perfilTelefono")?.value.trim() || "";
            const direccion = document.getElementById("perfilDireccion")?.value.trim() || "";
            const ciudad = document.getElementById("perfilCiudad")?.value.trim() || "";
            const codigoPostal = document.getElementById("perfilCP")?.value.trim() || "";

            try {
                const resp = await fetch(`${API_URL_PERFIL}/api/perfil/${idUsuario}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Nombre: nombre,
                        Apellido: apellido,
                        Contrasena: "",
                        Telefono: telefono,
                        Direccion: direccion,
                        Ciudad: ciudad,
                        CodigoPostal: codigoPostal
                    })
                });

                const data = await resp.json();
                if (!resp.ok) {
                    alert(data.mensaje || "No se pudieron guardar los cambios.");
                    return;
                }

                const actualizada = {
                    ...sesion,
                    id: idUsuario,
                    id_usuario: idUsuario,
                    nombre,
                    apellido,
                    telefono,
                    direccion,
                    ciudad,
                    codigo_postal: codigoPostal
                };
                localStorage.setItem("usuarioQuimera", JSON.stringify(actualizada));

                const saludo = document.getElementById("saludoPerfil");
                if (saludo) saludo.textContent = `Bienvenido, ${nombre}`;

                alert("Datos actualizados correctamente.");
            } catch (err) {
                console.error("Error guardando datos del perfil:", err);
                alert("Error de conexión al guardar tus datos.");
            }
        });
    }

    // Autocompletado en formularios de otras páginas si existen esos IDs
    const u = obtenerSesionQuimera();
    if (!u) return;

    const asignaciones = [
        [["nombre", "inputNombre", "txtNombre"], u.nombre],
        [["apellido", "inputApellido", "txtApellido"], u.apellido],
        [["correo", "email", "inputEmail", "txtCorreo"], u.correo],
        [["telefono", "inputTelefono", "txtTelefono"], u.telefono],
        [["direccion", "inputDireccion", "txtDireccion"], u.direccion],
        [["ciudad", "municipio", "inputCiudad", "txtCiudad"], u.ciudad],
        [["codigoPostal", "cp", "codigo_postal", "inputCP"], u.codigo_postal]
    ];

    asignaciones.forEach(([ids, valor]) => {
        if (!valor) return;
        ids.forEach(id => {
            const campo = document.getElementById(id);
            if (campo && !campo.value) {
                campo.value = valor;
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioQuimera"));
    const esAdmin = usuarioActual?.correo?.toLowerCase() === "admin@quimera.com";
    const btnIrAdmin = document.getElementById("btnIrAdmin");

    if (esAdmin && btnIrAdmin) {
        btnIrAdmin.style.display = "inline-block";
    }
});