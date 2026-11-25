const formEnvio = document.getElementById('formEnvio');
const API_ENVIO_URL = 'https://localhost:7270';

// =======================================================
// 1. CALCULAR TOTAL Y AUTOCOMPLETAR DATOS AL ABRIR LA PÁGINA
// =======================================================
document.addEventListener('DOMContentLoaded', async () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("libros-en-carrito"));
    let totalCalculado = 0;

    if (carritoGuardado && carritoGuardado.length > 0) {
        carritoGuardado.forEach(libro => {
            totalCalculado += libro.precio * libro.cantidad;
        });
    } else {
        alert("Tu carrito está vacío, te regresaremos al catálogo.");
        window.location.href = "index.html";
        return;
    }

    const etiquetaTotal = document.getElementById('totalEnvio');
    if (etiquetaTotal) {
        etiquetaTotal.innerText = `Total a pagar: $${totalCalculado.toFixed(2)}`;
    }

    // Autocompletar dirección, ciudad, código postal y teléfono
    let usuarioActivo = JSON.parse(localStorage.getItem('usuarioQuimera'));
    const idUsuario = usuarioActivo?.id_usuario ?? usuarioActivo?.id;

    if (idUsuario && (!usuarioActivo?.direccion || !usuarioActivo?.ciudad || !usuarioActivo?.codigo_postal || (!usuarioActivo?.telefono && !usuarioActivo?.telefoo_envio))) {
        try {
            const resp = await fetch(`${API_ENVIO_URL}/api/perfil/${idUsuario}`);
            if (resp.ok) {
                const perfil = await resp.json();
                usuarioActivo = { ...usuarioActivo, ...perfil };
                localStorage.setItem('usuarioQuimera', JSON.stringify(usuarioActivo));
            }
        } catch (err) {
            console.error("Error obteniendo datos de envío:", err);
        }
    }

    if (usuarioActivo) {
        const inputDireccion = document.getElementById('direccion');
        const inputCiudad = document.getElementById('ciudad');
        const inputCP = document.getElementById('codigo_postal');
        const inputTelefono = document.getElementById('telefono_envio');

        if (inputDireccion && !inputDireccion.value) {
            inputDireccion.value = usuarioActivo.direccion || "";
        }
        if (inputCiudad && !inputCiudad.value) {
            inputCiudad.value = usuarioActivo.ciudad || "";
        }
        if (inputCP && !inputCP.value) {
            inputCP.value = usuarioActivo.codigo_postal || "";
        }
        if (inputTelefono && !inputTelefono.value) {
            inputTelefono.value = usuarioActivo.telefono || usuarioActivo.telefoo_envio || "";
        }
    }
});

// =======================================================
// 2. ENVIAR EL FORMULARIO A LA BASE DE DATOS
// =======================================================
if (formEnvio) {
    formEnvio.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioQuimera'));

        const carritoGuardado = JSON.parse(localStorage.getItem("libros-en-carrito")) || [];
        let totalCalculado = 0;
        let carritoFormateado = [];

        carritoGuardado.forEach(libro => {
            totalCalculado += libro.precio * libro.cantidad;
            carritoFormateado.push({
                IdLibro: libro.id,
                Cantidad: libro.cantidad,
                PrecioUnitario: libro.precio
            });
        });

        const idUsuario = usuarioActivo?.id_usuario ?? usuarioActivo?.id;
        const datosEnvio = {
            IdUsuario: idUsuario ? parseInt(idUsuario) : 1,
            Total: totalCalculado,
            Direccion: document.getElementById('direccion').value,
            Ciudad: document.getElementById('ciudad').value,
            CodigoPostal: document.getElementById('codigo_postal').value,
            TelefonoEnvio: document.getElementById('telefono_envio').value,
            Carrito: carritoFormateado
        };

        try {
            let respuesta = await fetch(`${API_ENVIO_URL}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosEnvio)
            });

            let resultado = await respuesta.json();

            if (respuesta.ok) {
                alert("¡Compra exitosa! Tus libros van en camino.");
                localStorage.removeItem("libros-en-carrito");
                window.location.href = "index.html";
            } else {
                alert("Error al procesar: " + (resultado.mensaje || "Error desconocido"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor. Verifica que Visual Studio esté corriendo.");
        }
    });
}