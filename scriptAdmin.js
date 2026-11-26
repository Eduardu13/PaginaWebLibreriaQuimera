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

const modalEditarLibro = document.getElementById("modalEditarLibro");
const tituloModalEditar = document.getElementById("tituloModalEditar");
const editarIdLibro = document.getElementById("editarIdLibro");
const editarPrecioLibro = document.getElementById("editarPrecioLibro");
const editarStockLibro = document.getElementById("editarStockLibro");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
const btnGuardarEdicionLibro = document.getElementById("btnGuardarEdicionLibro");

const listaMensajesAdmin = document.getElementById("listaMensajesAdmin");
const btnRecargarMensajes = document.getElementById("btnRecargarMensajes");

const tabGestionAdmin = document.getElementById("tabGestionAdmin");
const tabDisenoAdmin = document.getElementById("tabDisenoAdmin");
const seccionGestionAdmin = document.getElementById("seccionGestionAdmin");
const seccionDisenoAdmin = document.getElementById("seccionDisenoAdmin");

const subtabInicioAdmin = document.getElementById("subtabInicioAdmin");
const subtabCatalogoAdmin = document.getElementById("subtabCatalogoAdmin");
const subtabPedidosMensajesAdmin = document.getElementById("subtabPedidosMensajesAdmin");
const subseccionInicioAdmin = document.getElementById("subseccionInicioAdmin");
const subseccionCatalogoAdmin = document.getElementById("subseccionCatalogoAdmin");
const subseccionPedidosMensajesAdmin = document.getElementById("subseccionPedidosMensajesAdmin");

const selectSeccionInicio = document.getElementById("selectSeccionInicio");
const filtroCategoriaInicio = document.getElementById("filtroCategoriaInicio");
const selectLibroInicio = document.getElementById("selectLibroInicio");
const btnAgregarLibroSeccion = document.getElementById("btnAgregarLibroSeccion");

const vistaPreviaBannerActual = document.getElementById("vistaPreviaBannerActual");
const inputArchivoBannerPopup = document.getElementById("inputArchivoBannerPopup");
const inputUrlBannerPopup = document.getElementById("inputUrlBannerPopup");
const inputEnlaceBannerPopup = document.getElementById("inputEnlaceBannerPopup");
const btnGuardarBannerPopup = document.getElementById("btnGuardarBannerPopup");
const btnQuitarBannerActual = document.getElementById("btnQuitarBannerActual");

let todosLosLibrosAdmin = [];
let imagenBannerTemporal = "";
const temporalesBannersIntermedios = {
    contacto: "",
    ofertas: ""
};

function leerArchivoBase64(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

function configurarSeccionesAdmin() {
    if (!tabGestionAdmin || !tabDisenoAdmin || !seccionGestionAdmin || !seccionDisenoAdmin) return;

    tabGestionAdmin.addEventListener("click", () => {
        seccionGestionAdmin.style.display = "block";
        seccionDisenoAdmin.style.display = "none";
        tabGestionAdmin.classList.add("activa");
        tabDisenoAdmin.classList.remove("activa");
    });

    tabDisenoAdmin.addEventListener("click", async () => {
        seccionGestionAdmin.style.display = "none";
        seccionDisenoAdmin.style.display = "block";
        tabDisenoAdmin.classList.add("activa");
        tabGestionAdmin.classList.remove("activa");
        await cargarBannerPopupAdmin();
        await cargarBannersIntermediosAdmin();
    });
}

function configurarSubseccionesGestion() {
    const tabs = [
        { btn: subtabInicioAdmin, panel: subseccionInicioAdmin, onOpen: cargarSeccionesInicioAdmin },
        { btn: subtabCatalogoAdmin, panel: subseccionCatalogoAdmin, onOpen: cargarLibrosAdmin },
        { btn: subtabPedidosMensajesAdmin, panel: subseccionPedidosMensajesAdmin, onOpen: async () => {
            await cargarPedidosAdmin();
            await cargarMensajesAdmin();
        }}
    ];

    tabs.forEach(item => {
        if (!item.btn || !item.panel) return;
        item.btn.addEventListener("click", async () => {
            tabs.forEach(t => {
                if (t.panel) t.panel.style.display = "none";
                if (t.btn) t.btn.classList.remove("activa");
            });
            item.panel.style.display = "block";
            item.btn.classList.add("activa");
            if (item.onOpen) await item.onOpen();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    configurarSeccionesAdmin();
    configurarSubseccionesGestion();
    configurarBannerIntermedioAdmin("contacto", "contacto.html");
    configurarBannerIntermedioAdmin("ofertas", "ofertas.html");

    cargarCategoriasAdmin();
    cargarPedidosAdmin();
    cargarLibrosAdmin();
    cargarMensajesAdmin();
    cargarSeccionesInicioAdmin();
    cargarBannerPopupAdmin();
    cargarBannersIntermediosAdmin();
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

if (filtroCategoriaInicio) {
    filtroCategoriaInicio.addEventListener("change", () => {
        llenarSelectLibrosInicio(todosLosLibrosAdmin);
    });
}

if (btnRecargarMensajes) {
    btnRecargarMensajes.addEventListener("click", cargarMensajesAdmin);
}

if (btnCerrarSesionAdmin) {
    btnCerrarSesionAdmin.addEventListener("click", () => {
        if (confirm("¿Deseas cerrar la sesión de administrador?")) {
            localStorage.removeItem("usuarioQuimera");
            window.location.href = "index.html";
        }
    });
}

if (btnCancelarEdicion) {
    btnCancelarEdicion.addEventListener("click", cerrarModalEditarLibro);
}

if (modalEditarLibro) {
    modalEditarLibro.addEventListener("click", (e) => {
        if (e.target === modalEditarLibro) cerrarModalEditarLibro();
    });
}

function abrirModalEditarLibro(idLibro) {
    const libro = todosLosLibrosAdmin.find(l => String(l.id) === String(idLibro));
    if (!libro || !modalEditarLibro) return;

    editarIdLibro.value = libro.id;
    editarPrecioLibro.value = libro.precio;
    editarStockLibro.value = libro.stock;
    if (tituloModalEditar) {
        tituloModalEditar.textContent = `Editar: ${libro.titulo}`;
    }

    modalEditarLibro.classList.add("abierto");
}

function cerrarModalEditarLibro() {
    if (modalEditarLibro) {
        modalEditarLibro.classList.remove("abierto");
    }
}

if (btnGuardarEdicionLibro) {
    btnGuardarEdicionLibro.addEventListener("click", async () => {
        const id = editarIdLibro.value;
        const nuevoPrecio = parseFloat(editarPrecioLibro.value);
        const nuevoStock = parseInt(editarStockLibro.value, 10);

        if (Number.isNaN(nuevoPrecio) || nuevoPrecio < 0) {
            alert("Ingresa un precio válido.");
            return;
        }

        if (Number.isNaN(nuevoStock) || nuevoStock < 0) {
            alert("Ingresa un stock válido (0 o mayor).");
            return;
        }

        try {
            const resp = await fetch(`${API_ADMIN_URL}/api/admin/libros/${encodeURIComponent(id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Precio: nuevoPrecio,
                    Stock: nuevoStock
                })
            });

            const texto = await resp.text();
            let data = {};
            try {
                data = JSON.parse(texto);
            } catch {
                data = { mensaje: texto || `Error HTTP ${resp.status}` };
            }

            if (!resp.ok) {
                alert(data.mensaje || `No se pudo actualizar el libro (HTTP ${resp.status}).`);
                return;
            }

            alert(data.mensaje || "Libro actualizado correctamente.");
            cerrarModalEditarLibro();
            cargarLibrosAdmin();
        } catch (err) {
            console.error("Error editando libro:", err);
            alert("Error de conexión al actualizar el libro.");
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
            await cargarLibrosAdmin();
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

function llenarFiltroCategoriasInicio(libros) {
    if (!filtroCategoriaInicio) return;

    const valorActual = filtroCategoriaInicio.value;
    const categoriasUnicas = [...new Set(
        (libros || []).map(l => (l.categoria || "").trim()).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, "es"));

    filtroCategoriaInicio.innerHTML =
        `<option value="todas">Todas las categorías</option>` +
        categoriasUnicas.map(cat => `<option value="${cat}">${cat}</option>`).join("");

    if (categoriasUnicas.includes(valorActual)) {
        filtroCategoriaInicio.value = valorActual;
    }
}

function llenarSelectLibrosInicio(libros) {
    if (!selectLibroInicio) return;

    const categoriaElegida = filtroCategoriaInicio?.value || "todas";
    const listaBase = Array.isArray(libros) ? libros : [];

    const filtrados = categoriaElegida === "todas"
        ? listaBase
        : listaBase.filter(l => (l.categoria || "").trim().toLowerCase() === categoriaElegida.toLowerCase());

    if (filtrados.length === 0) {
        selectLibroInicio.innerHTML = `<option value="">No hay libros en esta categoría</option>`;
        return;
    }

    selectLibroInicio.innerHTML =
        `<option value="">Selecciona un libro...</option>` +
        filtrados.map(l => `<option value="${l.id}">${l.titulo} — ${l.autor}</option>`).join("");
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
            <div class="acciones-libro">
                <button type="button" class="btn-admin btn-oscuro btn-editar-libro" data-id="${libro.id}">
                    Editar
                </button>
                <button type="button" class="btn-admin btn-peligro btn-eliminar-libro" data-id="${libro.id}" data-titulo="${libro.titulo}">
                    Eliminar
                </button>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".btn-editar-libro").forEach(btn => {
        btn.addEventListener("click", () => {
            abrirModalEditarLibro(btn.dataset.id);
        });
    });

    document.querySelectorAll(".btn-eliminar-libro").forEach(btn => {
        btn.addEventListener("click", () => {
            eliminarLibroAdmin(btn.dataset.id, btn.dataset.titulo);
        });
    });
}

async function cargarLibrosAdmin() {
    try {
        if (listaLibrosAdmin) {
            listaLibrosAdmin.innerHTML = "<p>Cargando libros...</p>";
        }

        const resp = await fetch(`${API_ADMIN_URL}/obtener-productos`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const libros = await resp.json();
        todosLosLibrosAdmin = Array.isArray(libros) ? libros : [];

        llenarFiltroCategorias(todosLosLibrosAdmin);
        llenarFiltroCategoriasInicio(todosLosLibrosAdmin);
        llenarSelectLibrosInicio(todosLosLibrosAdmin);
        renderizarLibrosFiltrados();
    } catch (err) {
        console.error("Error cargando libros admin:", err);
        if (listaLibrosAdmin) {
            listaLibrosAdmin.innerHTML = "<p>Error al cargar los libros.</p>";
        }
    }
}

async function cargarSeccionesInicioAdmin() {
    const contenedores = {
        recomendaciones: document.getElementById("listaInicioRecomendaciones"),
        novedades: document.getElementById("listaInicioNovedades"),
        mas_vendido: document.getElementById("listaInicioMasVendido")
    };

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/secciones-libros`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const items = await resp.json();
        const lista = Array.isArray(items) ? items : [];

        Object.entries(contenedores).forEach(([clave, cont]) => {
            if (!cont) return;
            const delApartado = lista.filter(x => x.seccion === clave);

            if (delApartado.length === 0) {
                cont.innerHTML = `<p style="margin:0;color:var(--texto-suave);">Sin libros asignados.</p>`;
                return;
            }

            cont.innerHTML = delApartado.map(x => `
                <div class="item-libro" style="padding: 10px 12px; gap: 10px;">
                    <img src="${x.imagen || ""}" alt="Portada de ${x.titulo}" style="width: 46px; height: 68px; object-fit: cover; border-radius: 6px; border: 1px solid var(--verde-borde); flex-shrink: 0;">
                    <div style="flex: 1; min-width: 0;">
                        <strong>${x.titulo}</strong>
                        <br>
                        <small>${x.autor}</small>
                        <br>
                        <small><strong>$${Number(x.precio || 0).toFixed(2)}</strong> · ID: ${x.idLibro}</small>
                    </div>
                    <button type="button" class="btn-admin btn-peligro btn-quitar-seccion" data-id="${x.idSeccionLibro}" style="padding: 6px 10px;">
                        Quitar
                    </button>
                </div>
            `).join("");
        });

        document.querySelectorAll(".btn-quitar-seccion").forEach(btn => {
            btn.addEventListener("click", async () => {
                await quitarLibroDeSeccion(btn.dataset.id);
            });
        });
    } catch (err) {
        console.error("Error cargando secciones de inicio:", err);
    }
}

if (btnAgregarLibroSeccion) {
    btnAgregarLibroSeccion.addEventListener("click", async () => {
        const seccion = selectSeccionInicio?.value || "recomendaciones";
        const idLibro = selectLibroInicio?.value || "";

        if (!idLibro) {
            alert("Selecciona un libro del catálogo.");
            return;
        }

        try {
            const resp = await fetch(`${API_ADMIN_URL}/api/admin/secciones-libros`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Seccion: seccion, IdLibro: idLibro })
            });

            const data = await resp.json();
            if (!resp.ok) {
                alert(data.mensaje || "No se pudo agregar el libro al apartado.");
                return;
            }

            alert(data.mensaje || "Libro agregado al apartado.");
            await cargarSeccionesInicioAdmin();
        } catch (err) {
            console.error("Error asignando libro a sección:", err);
            alert("Error de conexión al asignar el libro.");
        }
    });
}

async function quitarLibroDeSeccion(idSeccionLibro) {
    if (!confirm("¿Deseas quitar este libro del apartado de Inicio?")) return;

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/secciones-libros/${encodeURIComponent(idSeccionLibro)}`, {
            method: "DELETE"
        });

        const data = await resp.json();
        if (!resp.ok) {
            alert(data.mensaje || "No se pudo quitar el libro.");
            return;
        }

        await cargarSeccionesInicioAdmin();
    } catch (err) {
        console.error("Error quitando libro de sección:", err);
        alert("Error de conexión al quitar el libro.");
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
        await cargarLibrosAdmin();
        await cargarSeccionesInicioAdmin();
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

async function cargarMensajesAdmin() {
    if (!listaMensajesAdmin) return;
    listaMensajesAdmin.innerHTML = "<p>Cargando mensajes...</p>";

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/mensajes`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const mensajes = await resp.json();
        if (!Array.isArray(mensajes) || mensajes.length === 0) {
            listaMensajesAdmin.innerHTML = "<p>No hay mensajes de contacto aún.</p>";
            return;
        }

        listaMensajesAdmin.innerHTML = mensajes.map(m => {
            const yaRespondido = m.respuestaAdmin && m.respuestaAdmin.trim() !== "";
            const badgeEstado = yaRespondido
                ? `<span style="background: var(--verde-oliva); color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem;">Respondido</span>`
                : `<span style="background: var(--dorado); color: #1f3541; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: bold;">Pendiente</span>`;

            return `
                <div class="item-pedido" style="border-left-color: ${yaRespondido ? 'var(--verde-oliva)' : 'var(--guinda)'};">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                        <p><strong>${m.nombre}</strong> (${m.correo}) ${m.telefono ? `| Tel: ${m.telefono}` : ""}</p>
                        ${badgeEstado}
                    </div>
                    <p><small>Enviado el: ${m.fechaEnvio}</small></p>
                    <p style="background: #fff; padding: 10px; border-radius: 8px; border: 1px solid var(--verde-borde); margin: 8px 0;">
                        "${m.mensaje}"
                    </p>

                    ${yaRespondido ? `
                        <div style="background: #eef4e1; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 0.9rem;">
                            <strong>Tu respuesta (${m.fechaRespuesta || ""}):</strong><br>
                            ${m.respuestaAdmin}
                        </div>
                    ` : ""}

                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                        <input type="text" id="inputRespuesta-${m.idMensaje}" placeholder="Escribe una respuesta para el cliente..." style="flex: 1; min-width: 220px;" value="${yaRespondido ? m.respuestaAdmin.replace(/"/g, '&quot;') : ''}">
                        <button type="button" class="btn-admin btn-primario btn-enviar-respuesta" data-id="${m.idMensaje}">
                            ${yaRespondido ? "Actualizar respuesta" : "Enviar respuesta"}
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        document.querySelectorAll(".btn-enviar-respuesta").forEach(btn => {
            btn.addEventListener("click", () => {
                enviarRespuestaMensaje(btn.dataset.id);
            });
        });
    } catch (err) {
        console.error("Error cargando mensajes admin:", err);
        listaMensajesAdmin.innerHTML = "<p>Error al cargar mensajes.</p>";
    }
}

async function enviarRespuestaMensaje(idMensaje) {
    const input = document.getElementById(`inputRespuesta-${idMensaje}`);
    const respuesta = (input?.value || "").trim();

    if (!respuesta) {
        alert("Escribe una respuesta antes de enviar.");
        return;
    }

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/mensajes/${idMensaje}/responder`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Respuesta: respuesta })
        });

        const data = await resp.json();
        if (!resp.ok) {
            alert(data.mensaje || "No se pudo enviar la respuesta.");
            return;
        }

        alert("Respuesta enviada al usuario.");
        cargarMensajesAdmin();
    } catch (err) {
        console.error("Error enviando respuesta:", err);
        alert("Error de conexión al enviar respuesta.");
    }
}

async function cargarBannerPopupAdmin() {
    if (!vistaPreviaBannerActual) return;

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/banner-popup`);
        if (!resp.ok) {
            vistaPreviaBannerActual.innerHTML = `<p style="margin:0;color:var(--texto-suave);">No se pudo consultar el banner actual.</p>`;
            return;
        }

        const data = await resp.json();
        imagenBannerTemporal = data.imagenUrl || "";

        if (inputUrlBannerPopup) {
            inputUrlBannerPopup.value = data.imagenUrl && !data.imagenUrl.startsWith("data:") ? data.imagenUrl : "";
        }
        if (inputEnlaceBannerPopup) {
            inputEnlaceBannerPopup.value = data.enlaceUrl || "ofertas.html";
        }

        if (data.activo && data.imagenUrl) {
            vistaPreviaBannerActual.innerHTML = `
                <img src="${data.imagenUrl}" alt="Banner emergente actual">
                <p style="margin:0;font-size:0.92rem;color:var(--texto-suave);">
                    <strong>Enlace:</strong> ${data.enlaceUrl || "ofertas.html"}
                </p>
            `;
        } else {
            vistaPreviaBannerActual.innerHTML = `<p style="margin:0;color:var(--texto-suave);">No hay banner activo actualmente.</p>`;
        }
    } catch (err) {
        console.error("Error cargando banner popup:", err);
        vistaPreviaBannerActual.innerHTML = `<p style="margin:0;color:var(--texto-suave);">Error al cargar el banner.</p>`;
    }
}

if (inputArchivoBannerPopup) {
    inputArchivoBannerPopup.addEventListener("change", async (e) => {
        const archivo = e.target.files?.[0];
        if (!archivo) return;

        imagenBannerTemporal = await leerArchivoBase64(archivo);
        if (inputUrlBannerPopup) inputUrlBannerPopup.value = "";

        if (vistaPreviaBannerActual) {
            vistaPreviaBannerActual.innerHTML = `
                <img src="${imagenBannerTemporal}" alt="Vista previa del nuevo banner">
                <p style="margin:0;font-size:0.9rem;color:var(--texto-suave);">
                    Imagen lista para guardar: <strong>${archivo.name}</strong>
                </p>
            `;
        }
    });
}

if (btnGuardarBannerPopup) {
    btnGuardarBannerPopup.addEventListener("click", async () => {
        const urlEscrita = (inputUrlBannerPopup?.value || "").trim();
        const imagenFinal = imagenBannerTemporal || urlEscrita;
        const enlaceFinal = (inputEnlaceBannerPopup?.value || "").trim() || "ofertas.html";

        if (!imagenFinal) {
            alert("Selecciona una imagen desde tu equipo o escribe la ruta del banner.");
            return;
        }

        try {
            const resp = await fetch(`${API_ADMIN_URL}/api/banner-popup`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ImagenUrl: imagenFinal,
                    EnlaceUrl: enlaceFinal,
                    Activo: true
                })
            });

            const data = await resp.json();
            if (!resp.ok) {
                alert(data.mensaje || "No se pudo guardar el banner.");
                return;
            }

            alert(data.mensaje || "Banner actualizado correctamente.");
            imagenBannerTemporal = "";
            if (inputArchivoBannerPopup) inputArchivoBannerPopup.value = "";
            await cargarBannerPopupAdmin();
        } catch (err) {
            console.error("Error guardando banner:", err);
            alert("Error al guardar: " + err.message);
        }
    });
}

if (btnQuitarBannerActual) {
    btnQuitarBannerActual.addEventListener("click", async () => {
        if (!confirm("¿Deseas quitar el banner emergente actual?")) return;

        try {
            const resp = await fetch(`${API_ADMIN_URL}/api/banner-popup`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ImagenUrl: null,
                    EnlaceUrl: (inputEnlaceBannerPopup?.value || "").trim() || "ofertas.html",
                    Activo: false
                })
            });

            const data = await resp.json();
            if (!resp.ok) {
                alert(data.mensaje || "No se pudo quitar el banner.");
                return;
            }

            alert(data.mensaje || "Banner quitado.");
            imagenBannerTemporal = "";
            if (inputUrlBannerPopup) inputUrlBannerPopup.value = "";
            if (inputArchivoBannerPopup) inputArchivoBannerPopup.value = "";
            await cargarBannerPopupAdmin();
        } catch (err) {
            console.error("Error quitando banner:", err);
            alert("Error de conexión al quitar el banner.");
        }
    });
}

async function cargarBannersIntermediosAdmin() {
    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/banners-intermedios`);
        if (!resp.ok) return;

        const banners = await resp.json();
        if (!Array.isArray(banners)) return;

        banners.forEach(b => {
            const vista = document.getElementById(
                b.claveBanner === "contacto" ? "vistaPreviaBannerContacto" : "vistaPreviaBannerOfertas"
            );
            const inputEnlace = document.getElementById(
                b.claveBanner === "contacto" ? "inputEnlaceBannerContacto" : "inputEnlaceBannerOfertas"
            );
            const enlaceDefecto = b.claveBanner === "contacto" ? "contacto.html" : "ofertas.html";

            if (inputEnlace) inputEnlace.value = b.enlaceUrl || enlaceDefecto;

            if (vista) {
                if (b.activo && b.imagenUrl) {
                    vista.innerHTML = `
                        <img src="${b.imagenUrl}" alt="Banner intermedio actual">
                        <p style="margin:0;font-size:0.92rem;color:var(--texto-suave);">
                            <strong>Enlace:</strong> ${b.enlaceUrl || enlaceDefecto}
                        </p>
                    `;
                } else {
                    vista.innerHTML = `<p style="margin:0;color:var(--texto-suave);">No hay banner activo actualmente.</p>`;
                }
            }
        });
    } catch (err) {
        console.error("Error cargando banners intermedios:", err);
    }
}

function configurarBannerIntermedioAdmin(clave, enlaceDefecto) {
    const sufijo = clave === "contacto" ? "Contacto" : "Ofertas";
    const inputArchivo = document.getElementById(`inputArchivoBanner${sufijo}`);
    const inputEnlace = document.getElementById(`inputEnlaceBanner${sufijo}`);
    const btnGuardar = document.getElementById(`btnGuardarBanner${sufijo}`);
    const btnQuitar = document.getElementById(`btnQuitarBanner${sufijo}`);
    const vista = document.getElementById(`vistaPreviaBanner${sufijo}`);

    if (inputArchivo) {
        inputArchivo.addEventListener("change", async (e) => {
            const archivo = e.target.files?.[0];
            if (!archivo) return;

            temporalesBannersIntermedios[clave] = await leerArchivoBase64(archivo);
            if (vista) {
                vista.innerHTML = `
                    <img src="${temporalesBannersIntermedios[clave]}" alt="Vista previa">
                    <p style="margin:0;font-size:0.9rem;color:var(--texto-suave);">
                        Imagen lista para guardar: <strong>${archivo.name}</strong>
                    </p>
                `;
            }
        });
    }

    if (btnGuardar) {
        btnGuardar.addEventListener("click", async () => {
            const imagenFinal = temporalesBannersIntermedios[clave];
            if (!imagenFinal) {
                alert("Primero selecciona una imagen desde tu equipo.");
                return;
            }

            try {
                const resp = await fetch(`${API_ADMIN_URL}/api/banners-intermedios/${clave}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ImagenUrl: imagenFinal,
                        EnlaceUrl: (inputEnlace?.value || "").trim() || enlaceDefecto,
                        Activo: true
                    })
                });

                const data = await resp.json();
                if (!resp.ok) {
                    alert(data.mensaje || "No se pudo guardar el banner.");
                    return;
                }

                alert(data.mensaje || "Banner actualizado correctamente.");
                temporalesBannersIntermedios[clave] = "";
                if (inputArchivo) inputArchivo.value = "";
                await cargarBannersIntermediosAdmin();
            } catch (err) {
                console.error("Error guardando banner intermedio:", err);
                alert("Error al guardar: " + err.message);
            }
        });
    }

    if (btnQuitar) {
        btnQuitar.addEventListener("click", async () => {
            if (!confirm("¿Deseas quitar este banner intermedio?")) return;

            try {
                const resp = await fetch(`${API_ADMIN_URL}/api/banners-intermedios/${clave}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ImagenUrl: null,
                        EnlaceUrl: (inputEnlace?.value || "").trim() || enlaceDefecto,
                        Activo: false
                    })
                });

                const data = await resp.json();
                if (!resp.ok) {
                    alert(data.mensaje || "No se pudo quitar el banner.");
                    return;
                }

                alert(data.mensaje || "Banner quitado.");
                temporalesBannersIntermedios[clave] = "";
                if (inputArchivo) inputArchivo.value = "";
                await cargarBannersIntermediosAdmin();
            } catch (err) {
                console.error("Error quitando banner intermedio:", err);
                alert("Error al quitar: " + err.message);
            }
        });
    }
}