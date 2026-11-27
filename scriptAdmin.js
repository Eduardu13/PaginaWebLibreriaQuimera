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
const subtabOfertasAdmin = document.getElementById("subtabOfertasAdmin");
const subtabNovedadesAdmin = document.getElementById("subtabNovedadesAdmin");
const subtabCatalogoAdmin = document.getElementById("subtabCatalogoAdmin");
const subtabPedidosMensajesAdmin = document.getElementById("subtabPedidosMensajesAdmin");
const subtabContactoAdmin = document.getElementById("subtabContactoAdmin");

const subseccionInicioAdmin = document.getElementById("subseccionInicioAdmin");
const subseccionOfertasAdmin = document.getElementById("subseccionOfertasAdmin");
const subseccionNovedadesAdmin = document.getElementById("subseccionNovedadesAdmin");
const subseccionCatalogoAdmin = document.getElementById("subseccionCatalogoAdmin");
const subseccionPedidosMensajesAdmin = document.getElementById("subseccionPedidosMensajesAdmin");
const subseccionContactoAdmin = document.getElementById("subseccionContactoAdmin");

const formCentroRecoleccion = document.getElementById("formCentroRecoleccion");
const listaCentrosRecoleccionAdmin = document.getElementById("listaCentrosRecoleccionAdmin");
const filtroEstadoCentroAdmin = document.getElementById("filtroEstadoCentroAdmin");
const buscarCentroAdmin = document.getElementById("buscarCentroAdmin");

const selectSeccionInicio = document.getElementById("selectSeccionInicio");
const filtroCategoriaInicio = document.getElementById("filtroCategoriaInicio");
const selectLibroInicio = document.getElementById("selectLibroInicio");
const btnAgregarLibroSeccion = document.getElementById("btnAgregarLibroSeccion");

const filtroCategoriaOferta = document.getElementById("filtroCategoriaOferta");
const selectLibroOferta = document.getElementById("selectLibroOferta");
const precioOriginalOfertaLibro = document.getElementById("precioOriginalOfertaLibro");
const descuentoOfertaLibro = document.getElementById("descuentoOfertaLibro");
const precioOfertaLibro = document.getElementById("precioOfertaLibro");
const resumenCalculoOferta = document.getElementById("resumenCalculoOferta");
const btnAgregarLibroOferta = document.getElementById("btnAgregarLibroOferta");
const listaLibrosOfertasAdmin = document.getElementById("listaLibrosOfertasAdmin");

const filtroCategoriaNovedad = document.getElementById("filtroCategoriaNovedad");
const selectLibroNovedad = document.getElementById("selectLibroNovedad");
const etiquetaNovedadLibro = document.getElementById("etiquetaNovedadLibro");
const descripcionNovedadLibro = document.getElementById("descripcionNovedadLibro");
const btnAgregarLibroNovedad = document.getElementById("btnAgregarLibroNovedad");
const listaLibrosNovedadesAdmin = document.getElementById("listaLibrosNovedadesAdmin");

const filtroCategoriaBuscado = document.getElementById("filtroCategoriaBuscado");
const selectLibroBuscado = document.getElementById("selectLibroBuscado");
const btnAgregarLibroBuscado = document.getElementById("btnAgregarLibroBuscado");
const listaLibrosBuscadosAdmin = document.getElementById("listaLibrosBuscadosAdmin");

const vistaPreviaBannerActual = document.getElementById("vistaPreviaBannerActual");
const inputArchivoBannerPopup = document.getElementById("inputArchivoBannerPopup");
const inputUrlBannerPopup = document.getElementById("inputUrlBannerPopup");
const inputEnlaceBannerPopup = document.getElementById("inputEnlaceBannerPopup");
const btnGuardarBannerPopup = document.getElementById("btnGuardarBannerPopup");
const btnQuitarBannerActual = document.getElementById("btnQuitarBannerActual");

let todosLosLibrosAdmin = [];
let todosLosCentrosAdmin = [];
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
        { btn: subtabOfertasAdmin, panel: subseccionOfertasAdmin, onOpen: cargarOfertasAdmin },
        {
            btn: subtabNovedadesAdmin,
            panel: subseccionNovedadesAdmin,
            onOpen: async () => {
                await cargarNovedadesAdmin();
                await cargarBuscadosQuincenaAdmin();
            }
        },
        { btn: subtabCatalogoAdmin, panel: subseccionCatalogoAdmin, onOpen: cargarLibrosAdmin },
        {
            btn: subtabPedidosMensajesAdmin,
            panel: subseccionPedidosMensajesAdmin,
            onOpen: async () => {
                await cargarPedidosAdmin();
                await cargarMensajesAdmin();
            }
        },
        { btn: subtabContactoAdmin, panel: subseccionContactoAdmin, onOpen: cargarCentrosRecoleccionAdmin }
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
    cargarOfertasAdmin();
    cargarNovedadesAdmin();
    cargarBuscadosQuincenaAdmin();
    cargarCentrosRecoleccionAdmin();
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

if (filtroCategoriaOferta) {
    filtroCategoriaOferta.addEventListener("change", () => {
        llenarSelectLibrosOferta(todosLosLibrosAdmin);
        autocompletarPrecioLibroOferta();
    });
}

if (selectLibroOferta) {
    selectLibroOferta.addEventListener("change", autocompletarPrecioLibroOferta);
}

if (filtroCategoriaNovedad) {
    filtroCategoriaNovedad.addEventListener("change", () => {
        llenarSelectLibrosNovedad(todosLosLibrosAdmin);
    });
}

if (filtroCategoriaBuscado) {
    filtroCategoriaBuscado.addEventListener("change", () => {
        llenarSelectLibrosBuscado(todosLosLibrosAdmin);
    });
}

function autocompletarPrecioLibroOferta() {
    const libro = todosLosLibrosAdmin.find(l => String(l.id) === String(selectLibroOferta?.value || ""));
    if (precioOriginalOfertaLibro) {
        precioOriginalOfertaLibro.value = libro ? Number(libro.precio || 0).toFixed(2) : "";
    }
    if (descuentoOfertaLibro && descuentoOfertaLibro.value) {
        calcularPrecioDesdeDescuento();
    } else if (precioOfertaLibro) {
        precioOfertaLibro.value = "";
    }
    actualizarCalculoOfertaEnVivo();
}

function calcularPrecioDesdeDescuento() {
    const original = parseFloat(precioOriginalOfertaLibro?.value || "");
    const desc = parseFloat(descuentoOfertaLibro?.value || "");
    if (Number.isNaN(original) || original <= 0) return;

    if (!Number.isNaN(desc) && desc > 0 && desc < 100) {
        const finalCalc = original * (1 - desc / 100);
        if (precioOfertaLibro) precioOfertaLibro.value = finalCalc.toFixed(2);
    } else if (precioOfertaLibro) {
        precioOfertaLibro.value = "";
    }
}

function calcularDescuentoDesdePrecio() {
    const original = parseFloat(precioOriginalOfertaLibro?.value || "");
    const finalManual = parseFloat(precioOfertaLibro?.value || "");
    if (Number.isNaN(original) || original <= 0 || Number.isNaN(finalManual) || finalManual < 0) return;

    if (finalManual < original) {
        const pct = Math.round(((original - finalManual) / original) * 100);
        if (descuentoOfertaLibro) descuentoOfertaLibro.value = pct;
    }
}

function actualizarCalculoOfertaEnVivo() {
    if (!resumenCalculoOferta) return;

    const original = parseFloat(precioOriginalOfertaLibro?.value || "");
    const final = parseFloat(precioOfertaLibro?.value || "");
    const desc = parseFloat(descuentoOfertaLibro?.value || "");

    if (Number.isNaN(original) || original <= 0) {
        resumenCalculoOferta.textContent = "Selecciona un libro y escribe el % de descuento para ver el cálculo automático.";
        return;
    }

    if (!Number.isNaN(final) && final >= 0 && final < original) {
        const ahorro = original - final;
        const pct = !Number.isNaN(desc) && desc > 0 ? desc : Math.round((ahorro / original) * 100);
        resumenCalculoOferta.innerHTML =
            `Antes: <del>$${original.toFixed(2)}</del> → Ahora: <strong>$${final.toFixed(2)}</strong> · Descuento: <strong>-${pct}%</strong> (ahorro de <strong>$${ahorro.toFixed(2)}</strong>)`;
    } else {
        resumenCalculoOferta.innerHTML =
            `Precio original del libro: <strong>$${original.toFixed(2)}</strong>. Escribe el % de descuento para calcular el nuevo precio.`;
    }
}

if (descuentoOfertaLibro) {
    descuentoOfertaLibro.addEventListener("input", () => {
        calcularPrecioDesdeDescuento();
        actualizarCalculoOfertaEnVivo();
    });
}

if (precioOfertaLibro) {
    precioOfertaLibro.addEventListener("input", () => {
        calcularDescuentoDesdePrecio();
        actualizarCalculoOfertaEnVivo();
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

function obtenerCategoriasUnicas(libros) {
    return [...new Set(
        (libros || []).map(l => (l.categoria || "").trim()).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, "es"));
}

function poblarSelectCategoriaGenerico(selectEl, libros) {
    if (!selectEl) return;
    const valorActual = selectEl.value;
    const categoriasUnicas = obtenerCategoriasUnicas(libros);

    selectEl.innerHTML =
        `<option value="todas">Todas las categorías</option>` +
        categoriasUnicas.map(cat => `<option value="${cat}">${cat}</option>`).join("");

    if (categoriasUnicas.includes(valorActual)) {
        selectEl.value = valorActual;
    }
}

function poblarSelectLibroGenerico(selectEl, filtroEl, libros, incluirPrecio = false) {
    if (!selectEl) return;

    const categoriaElegida = filtroEl?.value || "todas";
    const listaBase = Array.isArray(libros) ? libros : [];

    const filtrados = categoriaElegida === "todas"
        ? listaBase
        : listaBase.filter(l => (l.categoria || "").trim().toLowerCase() === categoriaElegida.toLowerCase());

    if (filtrados.length === 0) {
        selectEl.innerHTML = `<option value="">No hay libros en esta categoría</option>`;
        return;
    }

    selectEl.innerHTML =
        `<option value="">Selecciona un libro...</option>` +
        filtrados.map(l => {
            const extraPrecio = incluirPrecio ? ` ($${Number(l.precio || 0).toFixed(2)})` : "";
            return `<option value="${l.id}">${l.titulo} — ${l.autor}${extraPrecio}</option>`;
        }).join("");
}

function llenarFiltroCategorias(libros) {
    poblarSelectCategoriaGenerico(filtroCategoriaAdmin, libros);
}

function llenarFiltroCategoriasInicio(libros) {
    poblarSelectCategoriaGenerico(filtroCategoriaInicio, libros);
}

function llenarSelectLibrosInicio(libros) {
    poblarSelectLibroGenerico(selectLibroInicio, filtroCategoriaInicio, libros, false);
}

function llenarFiltroCategoriasOferta(libros) {
    poblarSelectCategoriaGenerico(filtroCategoriaOferta, libros);
}

function llenarSelectLibrosOferta(libros) {
    poblarSelectLibroGenerico(selectLibroOferta, filtroCategoriaOferta, libros, true);
}

function llenarFiltroCategoriasNovedad(libros) {
    poblarSelectCategoriaGenerico(filtroCategoriaNovedad, libros);
}

function llenarSelectLibrosNovedad(libros) {
    poblarSelectLibroGenerico(selectLibroNovedad, filtroCategoriaNovedad, libros, false);
}

function llenarFiltroCategoriasBuscado(libros) {
    poblarSelectCategoriaGenerico(filtroCategoriaBuscado, libros);
}

function llenarSelectLibrosBuscado(libros) {
    poblarSelectLibroGenerico(selectLibroBuscado, filtroCategoriaBuscado, libros, false);
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
        llenarFiltroCategoriasOferta(todosLosLibrosAdmin);
        llenarSelectLibrosOferta(todosLosLibrosAdmin);
        autocompletarPrecioLibroOferta();
        llenarFiltroCategoriasNovedad(todosLosLibrosAdmin);
        llenarSelectLibrosNovedad(todosLosLibrosAdmin);
        llenarFiltroCategoriasBuscado(todosLosLibrosAdmin);
        llenarSelectLibrosBuscado(todosLosLibrosAdmin);
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

async function cargarOfertasAdmin() {
    if (!listaLibrosOfertasAdmin) return;

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/secciones-libros`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const items = await resp.json();
        const ofertas = (Array.isArray(items) ? items : []).filter(x => x.seccion === "ofertas");

        if (ofertas.length === 0) {
            listaLibrosOfertasAdmin.innerHTML = `<p style="margin:0;color:var(--texto-suave);">No hay libros en ofertas todavía.</p>`;
            return;
        }

        listaLibrosOfertasAdmin.innerHTML = ofertas.map(x => {
            const precioNormal = Number(x.precio || 0);
            const precioOfertaBD = x.precioOferta != null && x.precioOferta !== "" ? Number(x.precioOferta) : null;
            const descuentoBD = x.descuento != null && x.descuento !== "" ? Number(x.descuento) : null;

            let precioFinal = precioNormal;
            let pctMostrar = 0;

            if (descuentoBD != null && !Number.isNaN(descuentoBD) && descuentoBD > 0) {
                pctMostrar = descuentoBD;
                precioFinal = precioOfertaBD != null && !Number.isNaN(precioOfertaBD)
                    ? precioOfertaBD
                    : precioNormal * (1 - descuentoBD / 100);
            } else if (precioOfertaBD != null && !Number.isNaN(precioOfertaBD)) {
                precioFinal = precioOfertaBD;
                if (precioNormal > 0 && precioOfertaBD < precioNormal) {
                    pctMostrar = Math.round(((precioNormal - precioOfertaBD) / precioNormal) * 100);
                }
            }

            const tieneDescuento = precioFinal < precioNormal;
            const ahorro = tieneDescuento ? precioNormal - precioFinal : 0;

            const detallePrecio = tieneDescuento
                ? `<del style="color:var(--texto-suave);">$${precioNormal.toFixed(2)}</del> <strong>$${precioFinal.toFixed(2)}</strong> · <strong>-${pctMostrar}%</strong> (descuento de $${ahorro.toFixed(2)})`
                : `<strong>$${precioNormal.toFixed(2)}</strong>`;

            return `
                <div class="item-libro" style="padding: 10px 12px; gap: 12px;">
                    <img src="${x.imagen || ""}" alt="Portada de ${x.titulo}" style="width: 48px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid var(--verde-borde); flex-shrink: 0;">
                    <div style="flex: 1; min-width: 0;">
                        <strong>${x.titulo}</strong>
                        <br>
                        <small>${x.autor}</small>
                        <br>
                        <small>${detallePrecio} · ID: ${x.idLibro}</small>
                    </div>
                    <button type="button" class="btn-admin btn-peligro btn-quitar-oferta" data-id="${x.idSeccionLibro}" style="padding: 6px 12px;">
                        Quitar
                    </button>
                </div>
            `;
        }).join("");

        document.querySelectorAll(".btn-quitar-oferta").forEach(btn => {
            btn.addEventListener("click", async () => {
                await quitarLibroDeSeccion(btn.dataset.id);
                await cargarOfertasAdmin();
            });
        });
    } catch (err) {
        console.error("Error cargando ofertas:", err);
        listaLibrosOfertasAdmin.innerHTML = `<p style="margin:0;color:var(--texto-suave);">Error al cargar los libros en oferta.</p>`;
    }
}

if (btnAgregarLibroOferta) {
    btnAgregarLibroOferta.addEventListener("click", async () => {
        const idLibro = selectLibroOferta?.value || "";
        if (!idLibro) {
            alert("Selecciona un libro para agregar a ofertas.");
            return;
        }

        const original = parseFloat(precioOriginalOfertaLibro?.value || "0");
        let valorDescuento = descuentoOfertaLibro?.value ? parseInt(descuentoOfertaLibro.value, 10) : null;
        let valorPrecioOferta = precioOfertaLibro?.value ? parseFloat(precioOfertaLibro.value) : null;

        if (valorDescuento !== null && (Number.isNaN(valorDescuento) || valorDescuento <= 0 || valorDescuento >= 100)) {
            alert("Ingresa un porcentaje de descuento entre 1 y 99.");
            return;
        }

        if (valorDescuento !== null && original > 0 && valorPrecioOferta === null) {
            valorPrecioOferta = Number((original * (1 - valorDescuento / 100)).toFixed(2));
        }

        if (valorPrecioOferta !== null && (Number.isNaN(valorPrecioOferta) || valorPrecioOferta < 0)) {
            alert("Ingresa un precio de oferta válido.");
            return;
        }

        const payload = {
            Seccion: "ofertas",
            IdLibro: idLibro
        };
        if (valorPrecioOferta !== null) payload.PrecioOferta = valorPrecioOferta;
        if (valorDescuento !== null) payload.Descuento = valorDescuento;

        try {
            const resp = await fetch(`${API_ADMIN_URL}/api/admin/secciones-libros`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await resp.json();
            if (!resp.ok) {
                alert(data.mensaje || "No se pudo agregar el libro a ofertas.");
                return;
            }

            alert(data.mensaje || "Libro agregado a ofertas.");
            if (precioOfertaLibro) precioOfertaLibro.value = "";
            if (descuentoOfertaLibro) descuentoOfertaLibro.value = "";
            actualizarCalculoOfertaEnVivo();
            await cargarOfertasAdmin();
        } catch (err) {
            console.error("Error agregando libro a ofertas:", err);
            alert("Error de conexión al agregar el libro a ofertas.");
        }
    });
}

async function cargarNovedadesAdmin() {
    if (!listaLibrosNovedadesAdmin) return;

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/secciones-libros`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const items = await resp.json();
        const novedades = (Array.isArray(items) ? items : []).filter(x => x.seccion === "pagina_novedades");

        if (novedades.length === 0) {
            listaLibrosNovedadesAdmin.innerHTML = `<p style="margin:0;color:var(--texto-suave);">No hay libros en la página de Novedades todavía.</p>`;
            return;
        }

        listaLibrosNovedadesAdmin.innerHTML = novedades.map(x => `
            <div class="item-libro" style="padding: 10px 12px; gap: 12px;">
                <img src="${x.imagen || ""}" alt="Portada de ${x.titulo}" style="width: 48px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid var(--verde-borde); flex-shrink: 0;">
                <div style="flex: 1; min-width: 0;">
                    <strong>${x.titulo}</strong> — ${x.autor}
                    ${x.etiqueta ? `<span style="margin-left:6px;background:var(--dorado);color:#fff;padding:2px 8px;border-radius:999px;font-size:0.78rem;">${x.etiqueta}</span>` : ""}
                    <br>
                    <small><strong>$${Number(x.precio || 0).toFixed(2)}</strong> · ID: ${x.idLibro}</small>
                    ${x.descripcion ? `<br><small>${x.descripcion}</small>` : ""}
                </div>
                <button type="button" class="btn-admin btn-peligro btn-quitar-novedad" data-id="${x.idSeccionLibro}" style="padding: 6px 12px;">
                    Quitar
                </button>
            </div>
        `).join("");

        document.querySelectorAll(".btn-quitar-novedad").forEach(btn => {
            btn.addEventListener("click", async () => {
                await quitarLibroDeSeccion(btn.dataset.id);
                await cargarNovedadesAdmin();
            });
        });
    } catch (err) {
        console.error("Error cargando novedades:", err);
        listaLibrosNovedadesAdmin.innerHTML = `<p style="margin:0;color:var(--texto-suave);">Error al cargar novedades.</p>`;
    }
}

if (btnAgregarLibroNovedad) {
    btnAgregarLibroNovedad.addEventListener("click", async () => {
        const idLibro = selectLibroNovedad?.value || "";
        if (!idLibro) {
            alert("Selecciona un libro para agregar a novedades.");
            return;
        }

        const etiqueta = (etiquetaNovedadLibro?.value || "").trim();
        const descripcion = (descripcionNovedadLibro?.value || "").trim();

        try {
            const resp = await fetch(`${API_ADMIN_URL}/api/admin/secciones-libros`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Seccion: "pagina_novedades",
                    IdLibro: idLibro,
                    Etiqueta: etiqueta || null,
                    Descripcion: descripcion || null
                })
            });

            const data = await resp.json();
            if (!resp.ok) {
                alert(data.mensaje || "No se pudo agregar el libro a novedades.");
                return;
            }

            alert(data.mensaje || "Libro agregado a novedades.");
            if (etiquetaNovedadLibro) etiquetaNovedadLibro.value = "";
            if (descripcionNovedadLibro) descripcionNovedadLibro.value = "";
            await cargarNovedadesAdmin();
        } catch (err) {
            console.error("Error agregando libro a novedades:", err);
            alert("Error de conexión al agregar a novedades.");
        }
    });
}

async function cargarBuscadosQuincenaAdmin() {
    if (!listaLibrosBuscadosAdmin) return;

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/secciones-libros`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const items = await resp.json();
        const buscados = (Array.isArray(items) ? items : []).filter(x => x.seccion === "mas_buscados_quincena");

        if (buscados.length === 0) {
            listaLibrosBuscadosAdmin.innerHTML = `<p style="margin:0;color:var(--texto-suave);">No hay libros en Los Más Buscados de la Quincena todavía.</p>`;
            return;
        }

        listaLibrosBuscadosAdmin.innerHTML = buscados.map((x, i) => `
            <div class="item-libro" style="padding: 10px 12px; gap: 12px;">
                <strong>#${String(i + 1).padStart(2, "0")}</strong>
                <img src="${x.imagen || ""}" alt="Portada de ${x.titulo}" style="width: 46px; height: 68px; object-fit: cover; border-radius: 6px; border: 1px solid var(--verde-borde); flex-shrink: 0;">
                <div style="flex: 1; min-width: 0;">
                    <strong>${x.titulo}</strong> — ${x.autor}
                    <br>
                    <small><strong>$${Number(x.precio || 0).toFixed(2)}</strong> · ID: ${x.idLibro}</small>
                </div>
                <button type="button" class="btn-admin btn-peligro btn-quitar-buscado" data-id="${x.idSeccionLibro}" style="padding: 6px 12px;">
                    Quitar
                </button>
            </div>
        `).join("");

        document.querySelectorAll(".btn-quitar-buscado").forEach(btn => {
            btn.addEventListener("click", async () => {
                await quitarLibroDeSeccion(btn.dataset.id);
                await cargarBuscadosQuincenaAdmin();
            });
        });
    } catch (err) {
        console.error("Error cargando más buscados:", err);
        listaLibrosBuscadosAdmin.innerHTML = `<p style="margin:0;color:var(--texto-suave);">Error al cargar más buscados.</p>`;
    }
}

if (btnAgregarLibroBuscado) {
    btnAgregarLibroBuscado.addEventListener("click", async () => {
        const idLibro = selectLibroBuscado?.value || "";
        if (!idLibro) {
            alert("Selecciona un libro para agregar a Los Más Buscados de la Quincena.");
            return;
        }

        try {
            const resp = await fetch(`${API_ADMIN_URL}/api/admin/secciones-libros`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Seccion: "mas_buscados_quincena",
                    IdLibro: idLibro
                })
            });

            const data = await resp.json();
            if (!resp.ok) {
                alert(data.mensaje || "No se pudo agregar el libro.");
                return;
            }

            alert(data.mensaje || "Libro agregado a Los Más Buscados de la Quincena.");
            await cargarBuscadosQuincenaAdmin();
        } catch (err) {
            console.error("Error agregando a más buscados:", err);
            alert("Error de conexión al agregar el libro.");
        }
    });
}

async function quitarLibroDeSeccion(idSeccionLibro) {
    if (!confirm("¿Deseas quitar este libro del apartado?")) return;

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
        await cargarOfertasAdmin();
        await cargarNovedadesAdmin();
        await cargarBuscadosQuincenaAdmin();
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
        await cargarOfertasAdmin();
        await cargarNovedadesAdmin();
        await cargarBuscadosQuincenaAdmin();
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

// =======================================================
// CONTACTO — CENTROS DE RECOLECCIÓN
// =======================================================

const CENTROS_BASE_CONTACTO = [
    { estado: "Aguascalientes", nombre: "Quimera Aguascalientes Centro", lat: 21.8818, lng: -102.2960, direccion: "Av. Francisco I. Madero #215, Zona Centro, Aguascalientes", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Presenta tu folio de pedido e identificación." },
    { estado: "Aguascalientes", nombre: "Quimera Aguascalientes Norte", lat: 21.9260, lng: -102.2885, direccion: "Av. Universidad #1002, Bosques del Prado Norte", horario: "Lun a Dom 10:00 - 21:00", instrucciones: "Resguardo disponible hasta por 5 días hábiles." },
    { estado: "Baja California", nombre: "Quimera Tijuana Zona Río", lat: 32.5290, lng: -117.0220, direccion: "Paseo de los Héroes #940, Zona Urbana Río, Tijuana", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Disponible 24 horas tras intento de entrega." },
    { estado: "Baja California", nombre: "Quimera Mexicali Centro Cívico", lat: 32.6467, lng: -115.4694, direccion: "Calz. Independencia #1120, Centro Cívico, Mexicali", horario: "Lun a Vie 9:00 - 19:00", instrucciones: "Presenta identificación oficial y número de pedido." },
    { estado: "Baja California Sur", nombre: "Quimera La Paz Malecón", lat: 24.1426, lng: -110.3128, direccion: "Paseo Álvaro Obregón #450, Zona Centro, La Paz", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Entrega directa en mostrador de paquetes." },
    { estado: "Baja California Sur", nombre: "Quimera Cabo San Lucas Marina", lat: 22.8905, lng: -109.9167, direccion: "Blvd. Paseo de la Marina #310, Centro, Cabo San Lucas", horario: "Lun a Dom 10:00 - 20:00", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Campeche", nombre: "Quimera Campeche Centro", lat: 19.8454, lng: -90.5356, direccion: "Calle 59 #12, Zona Centro, San Francisco de Campeche", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Presenta tu número de pedido e identificación." },
    { estado: "Campeche", nombre: "Quimera Ciudad del Carmen", lat: 18.6400, lng: -91.8340, direccion: "Calle 22 #85, Col. Centro, Ciudad del Carmen", horario: "Lun a Sáb 9:30 - 19:30", instrucciones: "Disponible tras notificación de entrega pendiente." },
    { estado: "Chiapas", nombre: "Quimera Tuxtla Gutiérrez Centro", lat: 16.7516, lng: -93.1161, direccion: "Av. Central Pte. #540, Col. Centro, Tuxtla Gutiérrez", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Presenta folio de compra e identificación." },
    { estado: "Chiapas", nombre: "Quimera San Cristóbal", lat: 16.7370, lng: -92.6376, direccion: "Real de Guadalupe #68, Barrio de Guadalupe, San Cristóbal", horario: "Lun a Dom 10:00 - 20:00", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Chihuahua", nombre: "Quimera Chihuahua Centro", lat: 28.6353, lng: -106.0889, direccion: "Av. Independencia #1204, Zona Centro, Chihuahua", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Entrega con folio y credencial vigente." },
    { estado: "Chihuahua", nombre: "Quimera Ciudad Juárez", lat: 31.7400, lng: -106.4800, direccion: "Av. Tomás Fernández #8420, Partido Iglesias, Cd. Juárez", horario: "Lun a Sáb 9:30 - 19:30", instrucciones: "Disponible 24 horas después del aviso de visita." },
    { estado: "Ciudad de México", nombre: "Quimera CDMX Centro Histórico", lat: 19.4326, lng: -99.1332, direccion: "Av. 5 de Mayo #34, Centro Histórico, Cuauhtémoc", horario: "Lun a Dom 10:00 - 20:00", instrucciones: "Módulo de recolección con número de pedido." },
    { estado: "Ciudad de México", nombre: "Quimera CDMX Roma / Condesa", lat: 19.4150, lng: -99.1650, direccion: "Av. Álvaro Obregón #185, Col. Roma Norte, Cuauhtémoc", horario: "Lun a Sáb 9:30 - 20:30", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Coahuila", nombre: "Quimera Saltillo Centro", lat: 25.4232, lng: -101.0053, direccion: "Calle Victoria #412, Zona Centro, Saltillo", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Presenta tu folio e identificación oficial." },
    { estado: "Coahuila", nombre: "Quimera Torreón Morelos", lat: 25.5428, lng: -103.4068, direccion: "Av. Morelos #1350 Pte., Col. Centro, Torreón", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Disponible tras intento de entrega en domicilio." },
    { estado: "Colima", nombre: "Quimera Colima Jardín Libertad", lat: 19.2433, lng: -103.7240, direccion: "Portal Medellín #78, Centro, Colima", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Entrega con número de pedido e identificación." },
    { estado: "Colima", nombre: "Quimera Manzanillo Centro", lat: 19.0522, lng: -104.3160, direccion: "Av. México #240, Col. Centro, Manzanillo", horario: "Lun a Sáb 9:30 - 19:00", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Durango", nombre: "Quimera Durango Centro", lat: 24.0277, lng: -104.6532, direccion: "Calle 20 de Noviembre #310 Ote., Zona Centro, Durango", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Presenta tu folio de pedido e identificación." },
    { estado: "Durango", nombre: "Quimera Gómez Palacio", lat: 25.5610, lng: -103.4980, direccion: "Av. Hidalgo #405 Nte., Zona Centro, Gómez Palacio", horario: "Lun a Vie 9:00 - 19:00", instrucciones: "Disponible 24 horas tras aviso de entrega." },
    { estado: "Estado de México", nombre: "Quimera Toluca Centro", lat: 19.2826, lng: -99.6557, direccion: "Av. Sebastián Lerdo de Tejada #210, Centro, Toluca", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Muestra tu folio e identificación oficial." },
    { estado: "Estado de México", nombre: "Quimera Satélite / Naucalpan", lat: 19.5100, lng: -99.2340, direccion: "Circuito Centro Comercial #120, Cd. Satélite, Naucalpan", horario: "Lun a Dom 10:00 - 20:30", instrucciones: "Resguardo disponible hasta por 5 días hábiles." },
    { estado: "Guanajuato", nombre: "Quimera Guanajuato Centro", lat: 21.0190, lng: -101.2574, direccion: "Calle Alonso #45, Zona Centro, Guanajuato", horario: "Lun a Sáb 9:30 - 20:00", instrucciones: "Entrega directa con número de pedido." },
    { estado: "Guanajuato", nombre: "Quimera León Zona Centro", lat: 21.1221, lng: -101.6826, direccion: "Blvd. Adolfo López Mateos #512, Centro, León", horario: "Lun a Dom 10:00 - 20:30", instrucciones: "Presenta identificación oficial y folio." },
    { estado: "Guerrero", nombre: "Quimera Chilpancingo Centro", lat: 17.5506, lng: -99.5024, direccion: "Calle Ignacio Zaragoza #28, Centro, Chilpancingo", horario: "Lun a Sáb 9:00 - 19:00", instrucciones: "Disponible tras notificación de entrega." },
    { estado: "Guerrero", nombre: "Quimera Acapulco Costera", lat: 16.8636, lng: -99.8824, direccion: "Av. Costera Miguel Alemán #1420, Fracc. Magallanes, Acapulco", horario: "Lun a Sáb 9:30 - 20:00", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Hidalgo", nombre: "Quimera Pachuca Centro", lat: 20.1200, lng: -98.7330, direccion: "Calle Vicente Guerrero #118, Centro, Pachuca", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Presenta tu número de pedido e identificación." },
    { estado: "Hidalgo", nombre: "Quimera Pachuca Zona Plateada", lat: 20.1020, lng: -98.7620, direccion: "Blvd. Felipe Ángeles #2100, Zona Plateada, Pachuca", horario: "Lun a Dom 10:00 - 20:00", instrucciones: "Entrega con folio de compra vigente." },
    { estado: "Jalisco", nombre: "Quimera Guadalajara Centro", lat: 20.6767, lng: -103.3475, direccion: "Av. Juárez #320, Zona Centro, Guadalajara", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Presenta folio e identificación oficial." },
    { estado: "Jalisco", nombre: "Quimera Zapopan / Providencia", lat: 20.6920, lng: -103.3820, direccion: "Av. Terranova #640, Col. Providencia, Guadalajara / Zapopan", horario: "Lun a Dom 10:00 - 20:30", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Michoacán", nombre: "Quimera Morelia Centro", lat: 19.7060, lng: -101.1950, direccion: "Av. Francisco I. Madero Pte. #490, Centro, Morelia", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Entrega con número de pedido e identificación." },
    { estado: "Michoacán", nombre: "Quimera Uruapan Centro", lat: 19.4140, lng: -102.0560, direccion: "Portal Carrillo #22, Centro, Uruapan", horario: "Lun a Sáb 9:30 - 19:00", instrucciones: "Disponible 24 horas después del aviso." },
    { estado: "Morelos", nombre: "Quimera Cuernavaca Centro", lat: 18.9242, lng: -99.2216, direccion: "Calle Guerrero #104, Centro, Cuernavaca", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Presenta folio de compra e identificación." },
    { estado: "Morelos", nombre: "Quimera Cuernavaca Norte", lat: 18.9580, lng: -99.2340, direccion: "Av. Emiliano Zapata #720, Col. Tlaltenango, Cuernavaca", horario: "Lun a Dom 10:00 - 20:00", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Nayarit", nombre: "Quimera Tepic Centro", lat: 21.5042, lng: -104.8946, direccion: "Av. México Nte. #265, Zona Centro, Tepic", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Entrega con número de pedido e identificación." },
    { estado: "Nayarit", nombre: "Quimera Tepic Forum / Sur", lat: 21.4820, lng: -104.8760, direccion: "Blvd. Luis Donaldo Colosio #1520, Tepic", horario: "Lun a Dom 10:00 - 20:00", instrucciones: "Disponible tras notificación de entrega." },
    { estado: "Nuevo León", nombre: "Quimera Monterrey Centro", lat: 25.6714, lng: -100.3095, direccion: "Calle Morelos #580, Zona Centro, Monterrey", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Presenta tu folio de pedido e identificación." },
    { estado: "Nuevo León", nombre: "Quimera San Pedro / Valle", lat: 25.6570, lng: -100.3680, direccion: "Av. Vasconcelos #410 Ote., Del Valle, San Pedro Garza García", horario: "Lun a Dom 10:00 - 20:30", instrucciones: "Resguardo disponible hasta por 5 días hábiles." },
    { estado: "Oaxaca", nombre: "Quimera Oaxaca Centro", lat: 17.0654, lng: -96.7236, direccion: "Calle Macedonio Alcalá #305, Centro, Oaxaca de Juárez", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Entrega con folio e identificación oficial." },
    { estado: "Oaxaca", nombre: "Quimera Oaxaca Jalatlaco", lat: 17.0710, lng: -96.7120, direccion: "Calle Aldama #118, Barrio de Jalatlaco, Oaxaca", horario: "Lun a Dom 10:00 - 19:30", instrucciones: "Disponible 24 horas después del intento de entrega." },
    { estado: "Puebla", nombre: "Quimera Puebla Centro Histórico", lat: 19.0414, lng: -98.2063, direccion: "Calle 5 de Mayo #412, Centro Histórico, Puebla", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Presenta tu número de pedido e identificación." },
    { estado: "Puebla", nombre: "Quimera Puebla Angelópolis", lat: 19.0180, lng: -98.2480, direccion: "Blvd. del Niño Poblano #2510, Reserva Territorial Atlixcáyotl, Puebla", horario: "Lun a Dom 10:00 - 20:30", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Querétaro", nombre: "Quimera Querétaro Centro", lat: 20.5888, lng: -100.3899, direccion: "Calle 5 de Mayo #76, Centro Histórico, Santiago de Querétaro", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Entrega con folio e identificación oficial." },
    { estado: "Querétaro", nombre: "Quimera Querétaro Juriquilla", lat: 20.7130, lng: -100.4480, direccion: "Blvd. Villas del Mesón #890, Juriquilla, Querétaro", horario: "Lun a Dom 10:00 - 20:00", instrucciones: "Disponible tras notificación de entrega." },
    { estado: "Quintana Roo", nombre: "Quimera Cancún Centro", lat: 21.1619, lng: -86.8515, direccion: "Av. Tulum #220, Supermanzana 22, Cancún", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Presenta folio de pedido e identificación." },
    { estado: "Quintana Roo", nombre: "Quimera Playa del Carmen", lat: 20.6296, lng: -87.0739, direccion: "Av. 10 entre Calles 12 y 14, Centro, Playa del Carmen", horario: "Lun a Dom 10:00 - 20:30", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "San Luis Potosí", nombre: "Quimera SLP Centro", lat: 22.1565, lng: -100.9855, direccion: "Calle Zaragoza #340, Zona Centro, San Luis Potosí", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Entrega directa con número de pedido." },
    { estado: "San Luis Potosí", nombre: "Quimera SLP Lomas", lat: 22.1380, lng: -101.0240, direccion: "Av. Himno Nacional #4120, Lomas 2da Sección, SLP", horario: "Lun a Sáb 9:30 - 19:30", instrucciones: "Disponible 24 horas tras aviso de visita." },
    { estado: "Sinaloa", nombre: "Quimera Culiacán Centro", lat: 24.8091, lng: -107.3940, direccion: "Av. Álvaro Obregón #610 Nte., Centro, Culiacán", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Presenta folio e identificación oficial." },
    { estado: "Sinaloa", nombre: "Quimera Mazatlán Zona Dorada", lat: 23.2494, lng: -106.4111, direccion: "Av. Camarón Sábalo #520, Zona Dorada, Mazatlán", horario: "Lun a Dom 10:00 - 20:00", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Sonora", nombre: "Quimera Hermosillo Centro", lat: 29.0729, lng: -110.9559, direccion: "Blvd. Luis Encinas #280, Col. Centro, Hermosillo", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Entrega con número de pedido e identificación." },
    { estado: "Sonora", nombre: "Quimera Ciudad Obregón", lat: 27.4828, lng: -109.9304, direccion: "Calle Miguel Alemán #415 Nte., Centro, Cd. Obregón", horario: "Lun a Sáb 9:00 - 19:00", instrucciones: "Disponible tras notificación de entrega." },
    { estado: "Tabasco", nombre: "Quimera Villahermosa Tabasco 2000", lat: 17.9940, lng: -92.9310, direccion: "Av. Paseo Tabasco #1204, Tabasco 2000, Villahermosa", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Presenta tu folio e identificación oficial." },
    { estado: "Tabasco", nombre: "Quimera Villahermosa Centro", lat: 17.9892, lng: -92.9175, direccion: "Calle Juárez #312, Zona Centro, Villahermosa", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Resguardo disponible hasta por 5 días hábiles." },
    { estado: "Tamaulipas", nombre: "Quimera Tampico Centro", lat: 22.2153, lng: -97.8569, direccion: "Calle Salvador Díaz Mirón #210 Ote., Zona Centro, Tampico", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Entrega con folio de pedido e identificación." },
    { estado: "Tamaulipas", nombre: "Quimera Ciudad Victoria", lat: 23.7369, lng: -99.1411, direccion: "Calle 17 Hidalgo y Juárez #145, Zona Centro, Cd. Victoria", horario: "Lun a Vie 9:00 - 19:00", instrucciones: "Disponible 24 horas después del aviso." },
    { estado: "Tlaxcala", nombre: "Quimera Tlaxcala Centro", lat: 19.3182, lng: -98.2375, direccion: "Plaza de la Constitución #14, Centro, Tlaxcala", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Presenta número de pedido e identificación." },
    { estado: "Tlaxcala", nombre: "Quimera Apizaco Centro", lat: 19.4136, lng: -98.1419, direccion: "Av. Cuauhtémoc #308, Centro, Apizaco", horario: "Lun a Sáb 9:30 - 19:00", instrucciones: "Resguardo hasta por 5 días hábiles." },
    { estado: "Veracruz", nombre: "Quimera Xalapa Centro", lat: 19.5438, lng: -96.9102, direccion: "Calle Enríquez #92, Zona Centro, Xalapa", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Entrega con folio e identificación oficial." },
    { estado: "Veracruz", nombre: "Quimera Veracruz Puerto / Boca", lat: 19.1738, lng: -96.1342, direccion: "Av. Salvador Díaz Mirón #1540, Moderno, Veracruz", horario: "Lun a Dom 10:00 - 20:00", instrucciones: "Disponible tras notificación de entrega." },
    { estado: "Yucatán", nombre: "Quimera Mérida Centro", lat: 20.9674, lng: -89.6243, direccion: "Calle 60 #482, Centro, Mérida, Yucatán", horario: "Lun a Sáb 9:00 - 20:00", instrucciones: "Presenta tu número de pedido e identificación." },
    { estado: "Yucatán", nombre: "Quimera Mérida Norte / Montejo", lat: 21.0120, lng: -89.6150, direccion: "Paseo de Montejo #465, Itzimná, Mérida, Yucatán", horario: "Lun a Dom 10:00 - 20:30", instrucciones: "Resguardo disponible hasta por 5 días hábiles." },
    { estado: "Zacatecas", nombre: "Quimera Zacatecas Centro", lat: 22.7709, lng: -102.5832, direccion: "Av. Hidalgo #422, Centro Histórico, Zacatecas", horario: "Lun a Sáb 9:00 - 19:30", instrucciones: "Entrega con folio e identificación oficial." },
    { estado: "Zacatecas", nombre: "Quimera Guadalupe Zacatecas", lat: 22.7520, lng: -102.5100, direccion: "Av. Colegio Militar #215, Centro, Guadalupe, Zacatecas", horario: "Lun a Sáb 9:30 - 19:00", instrucciones: "Disponible 24 horas después del aviso." }
];

function llenarFiltroEstadoCentros(centros) {
    if (!filtroEstadoCentroAdmin) return;
    const valorActual = filtroEstadoCentroAdmin.value;
    const estados = [...new Set(
        (centros || []).map(c => (c.estado || "").trim()).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, "es"));

    filtroEstadoCentroAdmin.innerHTML =
        `<option value="todos">Todos los estados</option>` +
        estados.map(est => `<option value="${est}">${est}</option>`).join("");

    if (estados.includes(valorActual)) {
        filtroEstadoCentroAdmin.value = valorActual;
    }
}

function renderizarCentrosFiltradosAdmin() {
    if (!listaCentrosRecoleccionAdmin) return;

    const estadoElegido = filtroEstadoCentroAdmin?.value || "todos";
    const texto = (buscarCentroAdmin?.value || "").trim().toLowerCase();

    const filtrados = todosLosCentrosAdmin.filter(c => {
        const coincideEstado =
            estadoElegido === "todos" ||
            (c.estado || "").trim().toLowerCase() === estadoElegido.toLowerCase();

        const coincideTexto =
            !texto ||
            (c.nombre || "").toLowerCase().includes(texto) ||
            (c.direccion || "").toLowerCase().includes(texto) ||
            (c.estado || "").toLowerCase().includes(texto);

        return coincideEstado && coincideTexto;
    });

    if (filtrados.length === 0) {
        listaCentrosRecoleccionAdmin.innerHTML = `<p style="margin:0;color:var(--texto-suave);">No hay centros que coincidan con el filtro.</p>`;
        return;
    }

    listaCentrosRecoleccionAdmin.innerHTML = filtrados.map(c => `
        <div class="item-libro">
            <div>
                <strong>${c.nombre}</strong> (${c.estado})
                <br>
                <small>Dirección: ${c.direccion}</small>
                <br>
                <small>Coords: ${c.lat}, ${c.lng}</small>
                ${c.horario ? `<br><small>Horario: ${c.horario}</small>` : ""}
                ${c.instrucciones ? `<br><small>Instrucciones: ${c.instrucciones}</small>` : ""}
            </div>
            ${c.idCentro ? `
                <button type="button" class="btn-admin btn-peligro btn-eliminar-centro" data-id="${c.idCentro}" data-nombre="${c.nombre}">
                    Eliminar
                </button>
            ` : `
                <small style="color:var(--texto-suave);">Base</small>
            `}
        </div>
    `).join("");

    document.querySelectorAll(".btn-eliminar-centro").forEach(btn => {
        btn.addEventListener("click", () => {
            eliminarCentroRecoleccionAdmin(btn.dataset.id, btn.dataset.nombre);
        });
    });
}

async function cargarCentrosRecoleccionAdmin() {
    if (!listaCentrosRecoleccionAdmin) return;
    listaCentrosRecoleccionAdmin.innerHTML = "<p>Cargando centros...</p>";

    let centrosBD = [];
    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/centros-recoleccion`);
        if (resp.ok) {
            const data = await resp.json();
            centrosBD = Array.isArray(data) ? data : [];
        }
    } catch (err) {
        console.error("Error cargando centros desde API:", err);
    }

    const clavesBD = new Set(
        centrosBD.map(c => `${(c.estado || "").trim().toLowerCase()}|${(c.nombre || "").trim().toLowerCase()}`)
    );

    const baseSinDuplicar = CENTROS_BASE_CONTACTO
        .filter(c => !clavesBD.has(`${c.estado.toLowerCase()}|${c.nombre.toLowerCase()}`));

    todosLosCentrosAdmin = [...centrosBD, ...baseSinDuplicar];
    llenarFiltroEstadoCentros(todosLosCentrosAdmin);
    renderizarCentrosFiltradosAdmin();
}

if (filtroEstadoCentroAdmin) {
    filtroEstadoCentroAdmin.addEventListener("change", renderizarCentrosFiltradosAdmin);
}

if (buscarCentroAdmin) {
    buscarCentroAdmin.addEventListener("input", renderizarCentrosFiltradosAdmin);
}

if (formCentroRecoleccion) {
    formCentroRecoleccion.addEventListener("submit", async (e) => {
        e.preventDefault();

        const estado = (document.getElementById("estadoCentroRecoleccion")?.value || "").trim();
        const nombre = (document.getElementById("nombreCentroRecoleccion")?.value || "").trim();
        const lat = parseFloat(document.getElementById("latCentroRecoleccion")?.value || "");
        const lng = parseFloat(document.getElementById("lngCentroRecoleccion")?.value || "");
        const horario = (document.getElementById("horarioCentroRecoleccion")?.value || "").trim();
        const direccion = (document.getElementById("direccionCentroRecoleccion")?.value || "").trim();
        const instrucciones = (document.getElementById("instruccionesCentroRecoleccion")?.value || "").trim();

        if (!estado || !nombre || !direccion || Number.isNaN(lat) || Number.isNaN(lng)) {
            alert("Completa estado, nombre, latitud, longitud y dirección.");
            return;
        }

        try {
            const resp = await fetch(`${API_ADMIN_URL}/api/admin/centros-recoleccion`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Estado: estado,
                    Nombre: nombre,
                    Lat: lat,
                    Lng: lng,
                    Direccion: direccion,
                    Horario: horario || null,
                    Instrucciones: instrucciones || null
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
                alert(data.mensaje || `No se pudo agregar el centro (HTTP ${resp.status}).`);
                return;
            }

            alert(data.mensaje || "Centro de recolección agregado correctamente.");
            formCentroRecoleccion.reset();
            await cargarCentrosRecoleccionAdmin();
        } catch (err) {
            console.error("Error guardando centro de recolección:", err);
            alert("Error de conexión al guardar el centro de recolección.");
        }
    });
}

async function eliminarCentroRecoleccionAdmin(idCentro, nombre) {
    if (!confirm(`¿Seguro que deseas eliminar "${nombre}"?`)) return;

    try {
        const resp = await fetch(`${API_ADMIN_URL}/api/admin/centros-recoleccion/${encodeURIComponent(idCentro)}`, {
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
            alert(data.mensaje || `No se pudo eliminar el centro (HTTP ${resp.status}).`);
            return;
        }

        alert(data.mensaje || "Centro de recolección eliminado.");
        await cargarCentrosRecoleccionAdmin();
    } catch (err) {
        console.error("Error eliminando centro de recolección:", err);
        alert("Error de conexión al eliminar el centro de recolección.");
    }
}

// =======================================================
// DISEÑO Y APARIENCIA — BANNERS
// =======================================================

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