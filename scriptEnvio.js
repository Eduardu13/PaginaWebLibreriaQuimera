const formEnvio = document.getElementById('formEnvio');
const API_ENVIO_URL = 'https://apilibreriaquimera.onrender.com';
const TASA_IVA = 0.16;

function calcularResumenCarrito(carrito) {
    let subtotal = 0;
    const carritoFormateado = [];

    (carrito || []).forEach(libro => {
        const precio = Number(libro.precio) || 0;
        const cantidad = Number(libro.cantidad) || 0;
        subtotal += precio * cantidad;

        carritoFormateado.push({
            IdLibro: libro.id,
            Cantidad: cantidad,
            PrecioUnitario: precio
        });
    });

    const iva = subtotal * TASA_IVA;
    const totalFinal = subtotal + iva;

    return { subtotal, iva, totalFinal, carritoFormateado };
}

function mostrarResumenEnPantalla(subtotal, iva, totalFinal) {
    const etiquetaTotal = document.getElementById('totalEnvio');
    const elSubtotal = document.getElementById('subtotalLibros');
    const elIva = document.getElementById('montoIva');
    const elTotalTexto = document.getElementById('totalConIvaTexto');
    const elTransferencia = document.getElementById('montoTransferencia');

    if (etiquetaTotal) etiquetaTotal.innerText = `Total a pagar: $${totalFinal.toFixed(2)}`;
    if (elSubtotal) elSubtotal.innerText = `$${subtotal.toFixed(2)}`;
    if (elIva) elIva.innerText = `$${iva.toFixed(2)}`;
    if (elTotalTexto) elTotalTexto.innerText = `$${totalFinal.toFixed(2)}`;
    if (elTransferencia) elTransferencia.innerText = `$${totalFinal.toFixed(2)}`;
}

function actualizarPanelPago() {
    const metodo = document.getElementById('metodoPago')?.value || 'tarjeta';
    const panelTarjeta = document.getElementById('panelTarjeta');
    const panelTransferencia = document.getElementById('panelTransferencia');

    if (panelTarjeta) {
        panelTarjeta.style.display = metodo === 'tarjeta' ? 'block' : 'none';
    }
    if (panelTransferencia) {
        panelTransferencia.style.display = metodo === 'transferencia' ? 'block' : 'none';
    }
}

// =======================================================
// 1. CALCULAR TOTAL, IVA, PAGO Y AUTOCOMPLETAR DATOS
// =======================================================
document.addEventListener('DOMContentLoaded', async () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("libros-en-carrito"));

    if (!carritoGuardado || carritoGuardado.length === 0) {
        alert("Tu carrito está vacío, te regresaremos al catálogo.");
        window.location.href = "index.html";
        return;
    }

    const { subtotal, iva, totalFinal } = calcularResumenCarrito(carritoGuardado);
    mostrarResumenEnPantalla(subtotal, iva, totalFinal);

    const selectMetodoPago = document.getElementById('metodoPago');
    if (selectMetodoPago) {
        selectMetodoPago.addEventListener('change', actualizarPanelPago);
        actualizarPanelPago();
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

        const metodoPago = document.getElementById('metodoPago')?.value || 'tarjeta';

        if (metodoPago === 'tarjeta') {
            const num = document.getElementById('campoDigitosPago')?.value.trim() || "";
            const titular = document.getElementById('campoTitularPago')?.value.trim() || "";
            const vigencia = document.getElementById('campoMesAnoPago')?.value.trim() || "";
            const codigo = document.getElementById('campoCodigoSeguridad')?.value.trim() || "";

            if (!num || !titular || !vigencia || !codigo) {
                alert("Por favor completa todos los datos de pago.");
                return;
            }
        }

        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioQuimera'));
        const carritoGuardado = JSON.parse(localStorage.getItem("libros-en-carrito")) || [];
        const { totalFinal, carritoFormateado } = calcularResumenCarrito(carritoGuardado);

        const idUsuario = usuarioActivo?.id_usuario ?? usuarioActivo?.id;
        const datosEnvio = {
            IdUsuario: idUsuario ? parseInt(idUsuario) : 1,
            Total: Number(totalFinal.toFixed(2)),
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