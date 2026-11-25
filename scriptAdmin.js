const API_ADMIN_URL = "https://localhost:7270";
const CORREO_ADMIN = "admin@quimera.com";

const usuarioAdmin = JSON.parse(localStorage.getItem("usuarioQuimera"));
if (!usuarioAdmin || usuarioAdmin.correo?.toLowerCase() !== CORREO_ADMIN.toLowerCase()) {
    alert("Acceso restringido al administrador.");
    window.location.href = "index.html";
}

const formAgregarLibro = document.getElementById("formAgregarLibro");
const selectCategoriaLibro = document.getElementById("categoriaLibro");
const inputNombreNuevaCategoria = document.getElementById("nombreNuevaCategoria");
const btnCrearCategoria = document.getElementById("btnCrearCategoria");
const listaCategoriasAdmin = document.getElementById("listaCategoriasAdmin");
const listaPedidosAdmin = document.getElementById("listaPedidosAdmin");
const listaLibrosAdmin = document.getElementById("listaLibrosAdmin");
const buscarLibroAdmin = document.getElementById("buscarLibroAdmin");
const filtroCategoriaAdmin = document.getElementById("filtroCategoriaAdmin");
const btnRecargarPedidos = document.getElementById("btnRecargarPedidos");
const btnRecargarLibros = document.getElementById("btnRecargarLibros");
const btnCerrarSesionAdmin = document.getElementById("btnCerrarSesionAdmin");

let todosLosLibrosAdmin = [];

function leerArchivoBase64(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCategoriasAdmin();
    cargarPedidosAdmin();
    cargarLibrosAdmin();
});

if (btnRecargarPedidos) {
    btnRecargarPedidos.addEventListener("click", cargarPedidosAdmin);
}

if (btnRecargarLibros) {
    btnRecargarLibros.addEventListener("click", cargarLibrosAdmin);
}

if (buscarLibroAdmin) {
    buscarLibroAdmin.addEventListener("input", renderizarLibrosFiltrados);
}

if (filtroCategoriaAdmin) {
    filtroCategoriaAdmin.addEventListener("change", renderizarLibrosFiltrados);
}

if (btnCerrarSesionAdmin) {
    btnCerrarSesionAdmin.addEventListener("click", () => {
        if (confirm("¿Deseas cerrar la sesión de administrador?")) {
            localStorage.removeItem("usuarioQuimera");
            window.location.href = "index.html";
        }
    });
}

async function cargarCategoriasAdmin() {
    if (!selectCategoriaLibro && !listaCategoriasAdmin) return;

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/categorias`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const categorias = await resp.json();
        if (!Array.isArray(categorias) || categorias.length === 0) {
            if (selectCategoriaLibro) {
                selectCategoriaLibro.innerHTML = `<option value="1">General</option>`;
            }
            if (listaCategoriasAdmin) {
                listaCategoriasAdmin.innerHTML = `<p>No hay categorías registradas.</p>`;
            }
            return;
        }

        if (selectCategoriaLibro) {
            selectCategoriaLibro.innerHTML =
                `<option value="">Selecciona una categoría...</option>` +
                categorias
                    .map(cat => `<option value="${cat.idCategoria}">${cat.nombre}</option>`)
                    .join("");
        }

        if (listaCategoriasAdmin) {
            listaCategoriasAdmin.innerHTML = categorias
                .map(cat => `
                    <div class="item-libro">
                        <div>
                            <strong>${cat.nombre}</strong>
                            <br>
                            <small>ID: ${cat.idCategoria}</small>
                        </div>
                        <button type="button" class="btn-admin btn-peligro btn-eliminar-categoria" data-id="${cat.idCategoria}" data-nombre="${cat.nombre}">
                            Eliminar
                        </button>
                    </div>
                `)
                .join("");

            document.querySelectorAll(".btn-eliminar-categoria").forEach(btn => {
                btn.addEventListener("click", () => {
                    eliminarCategoriaAdmin(btn.dataset.id, btn.dataset.nombre);
                });
            });
        }
    } catch (err) {
        console.error("Error cargando categorías:", err);
        if (selectCategoriaLibro) {
            selectCategoriaLibro.innerHTML = `<option value="1">Categoría 1</option>`;
        }
        if (listaCategoriasAdmin) {
            listaCategoriasAdmin.innerHTML = `<p>Error al cargar las categorías.</p>`;
        }
    }
}

async function eliminarCategoriaAdmin(idCategoria, nombre) {
    if (!confirm(`¿Seguro que deseas eliminar la categoría "${nombre}"?`)) {
        return;
    }

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/categorias/${encodeURIComponent(idCategoria)}`, {
            method: "DELETE"
        });

        const texto = await resp.text();
        let data = {};
        try {
            data = JSON.parse(texto);
        } catch {
            data = { mensaje: texto || `Error HTTP ${resp.status}` };
        }

        if (!resp.ok) {
            alert(data.mensaje || `No se pudo eliminar la categoría (HTTP ${resp.status}).`);
            return;
        }

        alert(data.mensaje || "Categoría eliminada.");
        await cargarCategoriasAdmin();
    } catch (err) {
        console.error("Error eliminando categoría:", err);
        alert("Error de conexión al eliminar la categoría.");
    }
}

async function crearCategoriaNueva() {
    const nombre = (inputNombreNuevaCategoria?.value || "").trim();
    if (!nombre) {
        alert("Escribe un nombre para la categoría.");
        return;
    }

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/categorias`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Nombre: nombre })
        });

        const texto = await resp.text();
        let data = {};
        try {
            data = JSON.parse(texto);
        } catch {
            data = { mensaje: texto };
        }

        if (!resp.ok) {
            alert(data.mensaje || `Error ${resp.status} al crear la categoría.`);
            return;
        }

        alert(data.mensaje || "Categoría creada correctamente.");
        if (inputNombreNuevaCategoria) inputNombreNuevaCategoria.value = "";
        await cargarCategoriasAdmin();
    } catch (err) {
        console.error("Error creando categoría:", err);
        alert("Error de conexión al crear la categoría.");
    }
}

if (btnCrearCategoria) {
    btnCrearCategoria.addEventListener("click", crearCategoriaNueva);
}

if (inputNombreNuevaCategoria) {
    inputNombreNuevaCategoria.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            crearCategoriaNueva();
        }
    });
}

if (formAgregarLibro) {
    formAgregarLibro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputTitulo = document.getElementById("tituloLibro");
        const inputAutor = document.getElementById("autorLibro");
        const inputPrecio = document.getElementById("precioLibro");
        const inputStock = document.getElementById("stockLibro");
        const inputCategoria = document.getElementById("categoriaLibro");
        const inputArchivo = document.getElementById("archivoImagenLibro");

        if (!inputTitulo || !inputAutor || !inputPrecio || !inputStock || !inputCategoria) {
            alert("Revisa que existan todos los campos del formulario en admin.html.");
            return;
        }

        const idCategoriaSeleccionada = parseInt(inputCategoria.value, 10);
        if (!idCategoriaSeleccionada) {
            alert("Por favor selecciona una categoría.");
            return;
        }

        let imagenBase64 = "";
        if (inputArchivo && inputArchivo.files && inputArchivo.files[0]) {
            imagenBase64 = await leerArchivoBase64(inputArchivo.files[0]);
        }

        if (!imagenBase64) {
            alert("Por favor selecciona una imagen para el libro.");
            return;
        }

        const nuevoLibro = {
            Titulo: inputTitulo.value.trim(),
            Autor: inputAutor.value.trim(),
            Precio: parseFloat(inputPrecio.value),
            Stock: parseInt(inputStock.value, 10),
            Imagen: imagenBase64,
            IdCategoria: idCategoriaSeleccionada
        };

        try {
            const resp = await fetch(`${API_ADMIN_URL}/api/admin/libros`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoLibro)
            });

            const textoRespuesta = await resp.text();
            let data = {};
            try {
                data = JSON.parse(textoRespuesta);
            } catch {
                data = { mensaje: textoRespuesta };
            }

            if (!resp.ok) {
                alert(data.mensaje || `Error ${resp.status} al guardar el libro.`);
                return;
            }

            alert(data.mensaje || "Libro agregado correctamente.");
            formAgregarLibro.reset();
            cargarLibrosAdmin();
        } catch (err) {
            console.error("Error al guardar libro:", err);
            alert("No se pudo conectar con la API en https://localhost:7270. Verifica que Visual Studio esté corriendo.");
        }
    });
}

function llenarFiltroCategorias(libros) {
    if (!filtroCategoriaAdmin) return;

    const valorActual = filtroCategoriaAdmin.value;
    const categoriasUnicas = [...new Set(
        libros.map(l => (l.categoria || "").trim()).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, "es"));

    filtroCategoriaAdmin.innerHTML = `<option value="todas">Todas las categorías</option>` +
        categoriasUnicas.map(cat => `<option value="${cat}">${cat}</option>`).join("");

    if (categoriasUnicas.includes(valorActual)) {
        filtroCategoriaAdmin.value = valorActual;
    }
}

function renderizarLibrosFiltrados() {
    if (!listaLibrosAdmin) return;

    const texto = (buscarLibroAdmin?.value || "").trim().toLowerCase();
    const categoriaSeleccionada = filtroCategoriaAdmin?.value || "todas";

    const filtrados = todosLosLibrosAdmin.filter(libro => {
        const coincideCategoria =
            categoriaSeleccionada === "todas" ||
            (libro.categoria || "").toLowerCase() === categoriaSeleccionada.toLowerCase();

        const coincideTexto =
            !texto ||
            (libro.titulo || "").toLowerCase().includes(texto) ||
            (libro.autor || "").toLowerCase().includes(texto) ||
            (libro.id || "").toLowerCase().includes(texto);

        return coincideCategoria && coincideTexto;
    });

    if (filtrados.length === 0) {
        listaLibrosAdmin.innerHTML = "<p>No hay libros que coincidan con el filtro.</p>";
        return;
    }

    listaLibrosAdmin.innerHTML = filtrados.map(libro => `
        <div class="item-libro">
            <div>
                <strong>${libro.titulo}</strong> — ${libro.autor}
                <br>
                <small>ID: ${libro.id} | ${libro.categoria} | $${Number(libro.precio).toFixed(2)} | Stock: ${libro.stock}</small>
            </div>
            <button type="button" class="btn-admin btn-peligro btn-eliminar-libro" data-id="${libro.id}" data-titulo="${libro.titulo}">
                Eliminar
            </button>
        </div>
    `).join("");

    document.querySelectorAll(".btn-eliminar-libro").forEach(btn => {
        btn.addEventListener("click", () => {
            eliminarLibroAdmin(btn.dataset.id, btn.dataset.titulo);
        });
    });
}

async function cargarLibrosAdmin() {
    if (!listaLibrosAdmin) return;
    listaLibrosAdmin.innerHTML = "<p>Cargando libros...</p>";

    try {
        const resp = await fetch(`${API_ADMIN_URL}/obtener-productos`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const libros = await resp.json();
        todosLosLibrosAdmin = Array.isArray(libros) ? libros : [];

        llenarFiltroCategorias(todosLosLibrosAdmin);
        renderizarLibrosFiltrados();
    } catch (err) {
        console.error("Error cargando libros admin:", err);
        listaLibrosAdmin.innerHTML = "<p>Error al cargar los libros.</p>";
    }
}

async function eliminarLibroAdmin(idLibro, titulo) {
    if (!confirm(`¿Seguro que deseas eliminar "${titulo}" (${idLibro})?`)) {
        return;
    }

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/libros/${encodeURIComponent(idLibro)}`, {
            method: "DELETE"
        });

        const texto = await resp.text();
        let data = {};
        try {
            data = JSON.parse(texto);
        } catch {
            data = { mensaje: texto || `Error HTTP ${resp.status}` };
        }

        if (!resp.ok) {
            alert(data.mensaje || `No se pudo eliminar el libro (HTTP ${resp.status}).`);
            return;
        }

        alert(data.mensaje || "Libro eliminado.");
        cargarLibrosAdmin();
    } catch (err) {
        console.error("Error eliminando libro:", err);
        alert(`Fallo de red/API: ${err.message}. Revisa que el backend esté corriendo en ${API_ADMIN_URL}`);
    }
}

async function cargarPedidosAdmin() {
    if (!listaPedidosAdmin) return;
    listaPedidosAdmin.innerHTML = "<p>Cargando pedidos...</p>";

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/pedidos`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const pedidos = await resp.json();
        if (!Array.isArray(pedidos) || pedidos.length === 0) {
            listaPedidosAdmin.innerHTML = "<p>No hay pedidos por mostrar.</p>";
            return;
        }

        listaPedidosAdmin.innerHTML = pedidos.map(pedido => {
            const librosTexto = (pedido.libros || "").split(" | ").join("<br>");
            return `
                <div class="item-pedido">
                    <p><strong>Pedido #${pedido.idPedido}</strong> — Cliente: <strong>${pedido.cliente}</strong> (${pedido.correo})</p>
                    <p><strong>Estado actual:</strong> <strong>${pedido.estado}</strong></p>
                    <p><strong>Libros:</strong><br>${librosTexto}</p>
                    <p><strong>Dirección:</strong> ${pedido.direccion} (${pedido.ciudad})</p>
                    <p><strong>Total:</strong> $${Number(pedido.total).toFixed(2)}</p>
                    <div class="fila-estado">
                        <label>Cambiar estado:</label>
                        <select data-id="${pedido.idPedido}" class="select-estado-pedido">
                            <option value="Pendiente" ${pedido.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                            <option value="Enviado" ${pedido.estado === "Enviado" ? "selected" : ""}>Enviado</option>
                            <option value="Entregado" ${pedido.estado === "Entregado" ? "selected" : ""}>Entregado</option>
                            <option value="Cancelado" ${pedido.estado === "Cancelado" ? "selected" : ""}>Cancelado</option>
                        </select>
                    </div>
                </div>
            `;
        }).join("");

        document.querySelectorAll(".select-estado-pedido").forEach(select => {
            select.addEventListener("change", (e) => {
                actualizarEstadoPedido(e.target.dataset.id, e.target.value);
            });
        });
    } catch (err) {
        console.error("Error cargando pedidos admin:", err);
        listaPedidosAdmin.innerHTML = "<p>Error al cargar pedidos. Verifica que la API esté ejecutándose.</p>";
    }
}

async function actualizarEstadoPedido(idPedido, nuevoEstado) {
    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/pedidos/${idPedido}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Estado: nuevoEstado })
        });

        const data = await resp.json();
        if (!resp.ok) {
            alert(data.mensaje || "No se pudo actualizar el estado.");
            return;
        }

        alert(`Pedido #${idPedido} actualizado a "${nuevoEstado}".`);
        cargarPedidosAdmin();
    } catch (err) {
        console.error("Error actualizando estado:", err);
        alert("Error de conexión al actualizar el estado.");
    }
}