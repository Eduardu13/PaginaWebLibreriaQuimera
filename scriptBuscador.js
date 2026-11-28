const API_BUSCADOR_URL = "https://apilibreriaquimera.onrender.com";
let librosParaBuscar = [];

function normalizarTextoBuscador(texto) {
    return (texto || "")
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function obtenerCategoriaTextoLibro(libro) {
    if (!libro) return "";
    if (typeof libro.categoria === "string") return libro.categoria;
    if (libro.categoria && typeof libro.categoria === "object") {
        return libro.categoria.nombre || libro.categoria.Nombre || "";
    }
    return (
        libro.categoriaNombre ||
        libro.CategoriaNombre ||
        libro.nombreCategoria ||
        libro.Categoria ||
        libro.genero ||
        libro.Genero ||
        ""
    );
}

async function cargarLibrosParaBuscador(forzarRecarga = false) {
    if (!forzarRecarga && Array.isArray(window.LibrosArray) && window.LibrosArray.length > 0) {
        librosParaBuscar = window.LibrosArray;
        return librosParaBuscar;
    }

    if (!forzarRecarga && librosParaBuscar.length > 0) {
        return librosParaBuscar;
    }

    try {
        const resp = await fetch(`${API_BUSCADOR_URL}/obtener-productos`);
        if (!resp.ok) return Array.isArray(window.LibrosArray) ? window.LibrosArray : [];
        const data = await resp.json();
        librosParaBuscar = Array.isArray(data) ? data : [];
        return librosParaBuscar;
    } catch {
        return Array.isArray(window.LibrosArray) ? window.LibrosArray : [];
    }
}

function coincideTermino(candidato, query) {
    const c = normalizarTextoBuscador(candidato);
    if (!c || !query) return false;
    if (c.includes(query) || query.includes(c)) return true;

    // Soporta diferencias simples de plural/singular (ej. fantasia / fantasias)
    const cSingular = c.replace(/es$/, "").replace(/s$/, "");
    const qSingular = query.replace(/es$/, "").replace(/s$/, "");
    return cSingular.length >= 3 && qSingular.length >= 3 && cSingular.includes(qSingular);
}

function filtrarLibrosPorTexto(libros, texto) {
    const query = normalizarTextoBuscador(texto);
    if (!query) return [];

    return (libros || []).filter(libro => {
        const titulo = libro.titulo || libro.Titulo || "";
        const autor = libro.autor || libro.Autor || "";
        const id = libro.id || libro.Id || libro.idLibro || "";
        const categoria = obtenerCategoriaTextoLibro(libro);

        return (
            coincideTermino(titulo, query) ||
            coincideTermino(autor, query) ||
            coincideTermino(id, query) ||
            coincideTermino(categoria, query)
        );
    });
}

async function aplicarFiltroEnCatalogo(texto, mostrarMensajeSiNoHay = true) {
    const query = normalizarTextoBuscador(texto);
    const contenedorCatalogo = document.getElementById("contenedor-productos");
    if (!contenedorCatalogo || !query) return false;

    const libros = await cargarLibrosParaBuscador(true);
    const coincidencias = filtrarLibrosPorTexto(libros, texto);

    const idsCoincidentes = new Set(
        coincidencias.map(l => normalizarTextoBuscador(l.id || l.Id || l.idLibro))
    );
    const titulosCoincidentes = new Set(
        coincidencias.map(l => normalizarTextoBuscador(l.titulo || l.Titulo))
    );

    const tarjetas = Array.from(contenedorCatalogo.children).filter(
        el => el.id !== "mensajeSinResultadosBuscador"
    );

    if (tarjetas.length === 0) {
        return false;
    }

    let visibles = 0;

    tarjetas.forEach(tarjeta => {
        const idTarjeta = normalizarTextoBuscador(tarjeta.id);
        const textoTarjeta = normalizarTextoBuscador(tarjeta.textContent);
        const coincidePorId = Array.from(idsCoincidentes).some(id => id && idTarjeta.includes(id));
        const coincidePorTitulo = Array.from(titulosCoincidentes).some(tit => tit && textoTarjeta.includes(tit));
        const coincide = coincidePorId || coincidePorTitulo || coincideTermino(textoTarjeta, query);

        tarjeta.style.display = coincide ? "" : "none";
        if (coincide) visibles++;
    });

    let msgVacio = document.getElementById("mensajeSinResultadosBuscador");
    if (visibles === 0 && mostrarMensajeSiNoHay) {
        if (!msgVacio) {
            msgVacio = document.createElement("p");
            msgVacio.id = "mensajeSinResultadosBuscador";
            msgVacio.style.cssText = "grid-column: 1 / -1; text-align: center; padding: 24px;";
            contenedorCatalogo.appendChild(msgVacio);
        }
        msgVacio.textContent = `No se encontraron libros para "${texto}".`;
        msgVacio.style.display = "block";
    } else if (msgVacio) {
        msgVacio.style.display = "none";
    }

    return true;
}

function esperarYFiltrarCatalogo(texto) {
    const contenedorCatalogo = document.getElementById("contenedor-productos");
    if (!contenedorCatalogo || !texto) return;

    aplicarFiltroEnCatalogo(texto, false);

    const observer = new MutationObserver(async () => {
        const aplicado = await aplicarFiltroEnCatalogo(texto, false);
        if (aplicado) {
            observer.disconnect();
            await aplicarFiltroEnCatalogo(texto, true);
        }
    });

    observer.observe(contenedorCatalogo, { childList: true, subtree: false });

    const reintentos = [400, 900, 1600];
    reintentos.forEach(ms => {
        setTimeout(async () => {
            await aplicarFiltroEnCatalogo(texto, ms === 1600);
            if (ms === 1600) observer.disconnect();
        }, ms);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const buscadorForm = document.querySelector(".BuscadorHeader form");
    const buscadorInput = document.querySelector('.BuscadorHeader input[type="search"]');
    if (!buscadorForm || !buscadorInput) return;

    const contenedorBuscador = document.querySelector(".BuscadorHeader");
    contenedorBuscador.style.position = "relative";

    const cajaResultados = document.createElement("div");
    cajaResultados.id = "resultadosBuscadorRapido";
    cajaResultados.style.cssText = `
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fffde7;
        color: #1f3541;
        border: 1px solid #c7d3b0;
        border-radius: 10px;
        margin-top: 6px;
        max-height: 320px;
        overflow-y: auto;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
        z-index: 999;
    `;
    contenedorBuscador.appendChild(cajaResultados);

    await cargarLibrosParaBuscador(true);

    const params = new URLSearchParams(window.location.search);
    const qInicial = params.get("q");
    if (qInicial) {
        buscadorInput.value = qInicial;
        esperarYFiltrarCatalogo(qInicial);
    }

    buscadorInput.addEventListener("input", async () => {
        const texto = buscadorInput.value.trim();
        if (!texto) {
            cajaResultados.style.display = "none";
            cajaResultados.innerHTML = "";
            if (window.location.pathname.endsWith("catalogo.html")) {
                const contenedorCatalogo = document.getElementById("contenedor-productos");
                if (contenedorCatalogo) {
                    Array.from(contenedorCatalogo.children).forEach(el => {
                        if (el.id !== "mensajeSinResultadosBuscador") el.style.display = "";
                    });
                    const msgVacio = document.getElementById("mensajeSinResultadosBuscador");
                    if (msgVacio) msgVacio.style.display = "none";
                }
            }
            return;
        }

        const libros = await cargarLibrosParaBuscador();
        const matches = filtrarLibrosPorTexto(libros, texto);

        if (matches.length === 0) {
            cajaResultados.innerHTML = `<div style="padding: 10px 14px; font-size: 0.9rem;">Sin resultados para "${texto}".</div>`;
            cajaResultados.style.display = "block";
            return;
        }

        const vistaPrevia = matches.slice(0, 8);
        const enlaceTodos = matches.length > 8
            ? `<a href="catalogo.html?q=${encodeURIComponent(texto)}" style="
                display: block;
                text-align: center;
                padding: 8px 12px;
                background: #f5f8ec;
                color: #1f3541;
                font-weight: bold;
                text-decoration: none;
                font-size: 0.85rem;
            ">Ver los ${matches.length} resultados en el catálogo</a>`
            : "";

        cajaResultados.innerHTML = vistaPrevia.map(l => {
            const titulo = l.titulo || l.Titulo || "";
            const autor = l.autor || l.Autor || "";
            const precio = Number(l.precio || l.Precio || 0).toFixed(2);
            const imagen = l.imagen || l.Imagen || "";
            const cat = obtenerCategoriaTextoLibro(l);

            return `
                <a href="catalogo.html?q=${encodeURIComponent(texto)}" style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 12px;
                    text-decoration: none;
                    color: #1f3541;
                    border-bottom: 1px solid #e4edd0;
                    font-size: 0.9rem;
                ">
                    <img src="${imagen}" alt="${titulo}" style="width: 34px; height: 48px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <strong>${titulo}</strong><br>
                        <small>${autor}${cat ? ` · ${cat}` : ""} · $${precio}</small>
                    </div>
                </a>
            `;
        }).join("") + enlaceTodos;

        cajaResultados.style.display = "block";
    });

    buscadorForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const texto = buscadorInput.value.trim();
        if (!texto) return;

        cajaResultados.style.display = "none";

        if (window.location.pathname.endsWith("catalogo.html")) {
            await aplicarFiltroEnCatalogo(texto, true);
        } else {
            window.location.href = `catalogo.html?q=${encodeURIComponent(texto)}`;
        }
    });

    document.addEventListener("click", (e) => {
        if (!contenedorBuscador.contains(e.target)) {
            cajaResultados.style.display = "none";
        }
    });
});