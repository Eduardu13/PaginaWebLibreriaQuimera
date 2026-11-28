document.addEventListener("DOMContentLoaded", async () => {
    const modal = document.getElementById("ModalOferta");
    const botonCerrar = document.getElementById("CerrarModal");
    if (!modal || !botonCerrar) return;

    const imgBanner = modal.querySelector("img");
    const linkBanner = modal.querySelector("a");

    botonCerrar.addEventListener("click", () => {
        modal.style.display = "none";
        sessionStorage.setItem("popupMostrado", "true");
    });

    if (sessionStorage.getItem("popupMostrado")) return;

    try {
        const resp = await fetch("https://apilibreriaquimera.onrender.com/api/banner-popup");
        if (!resp.ok) return;

        const data = await resp.json();
        if (!data.activo || !data.imagenUrl) return;

        if (imgBanner) {
            imgBanner.onerror = () => {
                modal.style.display = "none";
            };
            imgBanner.src = data.imagenUrl;
        }

        if (linkBanner && data.enlaceUrl) {
            linkBanner.href = data.enlaceUrl;
        }

        setTimeout(() => {
            modal.style.display = "flex";
        }, 1000);
    } catch (err) {
        console.error("Error cargando banner popup:", err);
    }
});