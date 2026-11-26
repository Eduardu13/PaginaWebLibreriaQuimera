const bloqueadoCarrusel = new Set();

function siguiente(idContenedor) {
    const banner = document.getElementById(idContenedor);
    if (!banner || banner.children.length <= 5 || bloqueadoCarrusel.has(idContenedor)) return;

    bloqueadoCarrusel.add(idContenedor);

    const primeraTarjeta = banner.firstElementChild;
    const estilos = getComputedStyle(banner);
    const gap = parseFloat(estilos.gap) || 20;
    const desplazamiento = primeraTarjeta.offsetWidth + gap;

    banner.style.transition = "transform 0.4s ease-in-out";
    banner.style.transform = `translateX(-${desplazamiento}px)`;

    setTimeout(() => {
        banner.style.transition = "none";
        banner.appendChild(primeraTarjeta);
        banner.style.transform = "translateX(0)";
        bloqueadoCarrusel.delete(idContenedor);
    }, 400);
}

function anterior(idContenedor) {
    const banner = document.getElementById(idContenedor);
    if (!banner || banner.children.length <= 5 || bloqueadoCarrusel.has(idContenedor)) return;

    bloqueadoCarrusel.add(idContenedor);

    const ultimaTarjeta = banner.lastElementChild;
    const primeraTarjeta = banner.firstElementChild;
    const estilos = getComputedStyle(banner);
    const gap = parseFloat(estilos.gap) || 20;
    const desplazamiento = primeraTarjeta.offsetWidth + gap;

    banner.style.transition = "none";
    banner.prepend(ultimaTarjeta);
    banner.style.transform = `translateX(-${desplazamiento}px)`;

    setTimeout(() => {
        banner.style.transition = "transform 0.4s ease-in-out";
        banner.style.transform = "translateX(0)";
        setTimeout(() => {
            bloqueadoCarrusel.delete(idContenedor);
        }, 400);
    }, 10);
}