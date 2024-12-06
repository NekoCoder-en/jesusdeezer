let pagina = 1;
const cancionesPorPagina = 25;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const query = 'rock';

// Función para esperar un tiempo
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para cargar canciones
const cargarCanciones = async () => {
    try {
        const respuesta = await fetch(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${query}&index=${(pagina - 1) * cancionesPorPagina}&limit=${cancionesPorPagina}`);

        if (respuesta.ok) {
            const datos = await respuesta.json();
            let canciones = '';

            // Generar HTML dinámico para mostrar las canciones
            datos.data.forEach(cancion => {
                canciones += `
                    <div class="cancion">
                        <img class="cover" src="${cancion.album.cover_medium}" alt="${cancion.title}">
                        <h3 class="titulo">${cancion.title}</h3>
                        <p class="artista">${cancion.artist.name}</p>
                    </div>
                `;
            });

            // Mostrar las canciones en el contenedor
            document.getElementById('contenedor').innerHTML = canciones;

            // Deshabilitar el botón "Anterior" si estamos en la primera página
            btnAnterior.disabled = pagina === 1;

            // Deshabilitar el botón "Siguiente" si no hay más canciones
            btnSiguiente.disabled = datos.data.length < cancionesPorPagina;
        } else {
            console.log(`Error: ${respuesta.status}`);
        }
    } catch (error) {
        console.log('Error al conectar con la API:', error);
    }
};

// Botón "Siguiente"
btnSiguiente.addEventListener('click', async () => {
    pagina += 1;
    await esperar(1000); // Espera 1 segundo entre cada solicitud
    cargarCanciones();
});

// Botón "Anterior"
btnAnterior.addEventListener('click', async () => {
    if (pagina > 1) {
        pagina -= 1;
        await esperar(1000); // Espera 1 segundo entre cada solicitud
        cargarCanciones();
    }
});

// Cargar canciones al inicio
cargarCanciones();
