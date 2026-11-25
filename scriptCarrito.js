const API_URL = "https://localhost:7270"; // Cambia 7270 si tu API corre en otro puerto

let LibrosEnCarrito = localStorage.getItem("libros-en-carrito");
LibrosEnCarrito = LibrosEnCarrito ? JSON.parse(LibrosEnCarrito) : [];

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

const btnVerCompras = document.getElementById("btnVerCompras");
const contenedorCompras = document.getElementById("contenedorCompras");

function cargarProductosCarrito() {
    if (LibrosEnCarrito && LibrosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disable");
        contenedorCarritoProductos.classList.remove("disable");
        contenedorCarritoAcciones.classList.remove("disable");
        contenedorCarritoComprado.classList.add("disable");

        contenedorCarritoProductos.innerHTML = "";

        LibrosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");

            div.innerHTML = `
                <img class="carrito-producto-img" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Titulo</small>
                    <h3>${producto.titulo}</h3>
                </div>

                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <div class="carrito-producto-contador">
                        <button type="button" class="carrito-sustraer" id="${producto.id}">-</button>
                        <p>${producto.cantidad}</p>
                        <button type="button" class="carrito-agregar" id="${producto.id}">+</button>
                    </div>
                </div>

                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>

                <div class="carrito-producto-subtotal">
                    <small>Subtototal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>

                <button type="button" class="carrito-producto-eliminar" id="${producto.id}">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            `;

            contenedorCarritoProductos.append(div);
        });
    } else {
        contenedorCarritoVacio.classList.remove("disable");
        contenedorCarritoProductos.classList.add("disable");
        contenedorCarritoAcciones.classList.add("disable");
        contenedorCarritoComprado.classList.add("disable");
    }

    actualizarBotonesEliminar();
    actualizarBotonesCantidad();
    actualizarTotal();
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = LibrosEnCarrito.findIndex(producto => producto.id === idBoton);
    if (index !== -1) {
        LibrosEnCarrito.splice(index, 1);
        localStorage.setItem("libros-en-carrito", JSON.stringify(LibrosEnCarrito));
        cargarProductosCarrito();
    }
}

if (botonVaciar) {
    botonVaciar.addEventListener("click", vaciarCarrito);
}

function vaciarCarrito() {
    LibrosEnCarrito.length = 0;
    localStorage.setItem("libros-en-carrito", JSON.stringify(LibrosEnCarrito));
    cargarProductosCarrito();
}

function actualizarTotal() {
    const totalCalculado = LibrosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    if (contenedorTotal) {
        contenedorTotal.innerText = `$${totalCalculado}`;
    }
}

if (botonComprar) {
    botonComprar.addEventListener("click", comprarCarrito);
}

function comprarCarrito() {
    if (!LibrosEnCarrito || LibrosEnCarrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioQuimera"));
    if (!usuarioActivo) {
        alert("¡Hola! Necesitas iniciar sesión o crear una cuenta para poder finalizar tu compra.");
        window.location.href = "usuario.html";
        return;
    }

    window.location.href = "envio.html";
}

function disminuirCantidad(e) {
    const idBoton = e.currentTarget.id;
    const producto = LibrosEnCarrito.find(prod => prod.id === idBoton);
    if (!producto) return;

    if (producto.cantidad > 1) {
        producto.cantidad--;
    }

    localStorage.setItem("libros-en-carrito", JSON.stringify(LibrosEnCarrito));
    cargarProductosCarrito();
}

function aumentarCantidad(e) {
    const idBoton = e.currentTarget.id;
    const producto = LibrosEnCarrito.find(prod => prod.id === idBoton);
    if (!producto) return;

    producto.cantidad++;

    localStorage.setItem("libros-en-carrito", JSON.stringify(LibrosEnCarrito));
    cargarProductosCarrito();
}

function actualizarBotonesCantidad() {
    const botonesSustraer = document.querySelectorAll(".carrito-sustraer");
    const botonesAgregar = document.querySelectorAll(".carrito-agregar");

    botonesSustraer.forEach(boton => {
        boton.addEventListener("click", disminuirCantidad);
    });

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", aumentarCantidad);
    });
}




// --- VER Y CANCELAR COMPRAS ---
if (btnVerCompras) {
    btnVerCompras.addEventListener("click", cargarCompras);
}

async function cargarCompras() {
    const usuario = JSON.parse(localStorage.getItem("usuarioQuimera"));
    if (!usuario) {
        alert("Inicia sesión para ver tus compras.");
        return;
    }

    const idUsuario = usuario.id_usuario || usuario.id;
    contenedorCompras.style.display = "block";
    contenedorCompras.innerHTML = "<p>Cargando compras...</p>";

    try {
        const idUsuario = usuario.id_usuario ?? usuario.id;
        const urlConsulta = idUsuario
            ? `${API_URL}/mis-compras/${idUsuario}`
            : `${API_URL}/mis-compras-correo/${encodeURIComponent(usuario.correo)}`;

        const respuesta = await fetch(urlConsulta);
        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}`);
        }

        const compras = await respuesta.json();

        if (!Array.isArray(compras) || compras.length === 0) {
            contenedorCompras.innerHTML = "<p>No tienes compras registradas todavía.</p>";
            return;
        }

        contenedorCompras.innerHTML = "";
        compras.forEach(compra => {
            const esCancelado = compra.estado === "Cancelado";
            const librosConSalto = (compra.libros || "").split(" | ").join("<br>");

            contenedorCompras.innerHTML += `
                <div style="border: 1px solid #ccc; padding: 14px; border-radius: 8px; margin-bottom: 10px; background: #fff; color: #111;">
                    <p><strong>Pedido #${compra.idPedido}</strong> — <span style="color: ${esCancelado ? "red" : "green"};">${compra.estado}</span></p>
                    <p><strong>Lo que pediste:</strong><br>${librosConSalto}</p>
                    <p><strong>Ciudad / Municipio:</strong> ${compra.ciudad}</p>
                    <p><strong>Dirección:</strong> ${compra.direccion}</p>
                    <p><strong>Total pagado:</strong> $${Number(compra.total).toFixed(2)}</p>
                    <p><strong>Estimado de llegada:</strong> ${compra.estimadoLlegada}</p>
                    ${!esCancelado ? `<button type="button" class="btn-cancelar-compra" data-id="${compra.idPedido}" style="background: #8b0000; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer;">Cancelar compra</button>` : ""}
                </div>
            `;
        });

        document.querySelectorAll(".btn-cancelar-compra").forEach(btn => {
            btn.addEventListener("click", () => cancelarCompra(btn.dataset.id));
        });
    } catch (error) {
        console.error("Error en cargarCompras:", error);
        contenedorCompras.innerHTML = "<p>Error al consultar tus compras.</p>";
    }
}

async function cancelarCompra(idPedido) {
    if (!confirm("¿Seguro que quieres cancelar esta compra?")) return;

    try {
        const respuesta = await fetch(`${API_URL}/cancelar-compra/${idPedido}`, {
            method: "POST"
        });
        const resultado = await respuesta.json();
        alert(resultado.mensaje);
        if (resultado.exito) {
            cargarCompras();
        }
    } catch (error) {
        console.error("Error en cancelarCompra:", error);
        alert("No se pudo conectar con el servidor.");
    }
}




