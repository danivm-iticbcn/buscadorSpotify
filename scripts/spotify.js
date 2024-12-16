import { tokenAccess } from "./token.js";

const MAX_LENGTH = 15;

const btnBuscar = document.querySelector('#btnBuscar');
const btnBorrar = document.querySelector('#btnBorrar');
const inputBusqueda = document.querySelector('#entradaCancion');
const cancionesContainer = document.querySelector('#canciones-container');

//*** BUSCAR ***/

//Controlamos el submit y tratamos el evento de buscar
const search = function(event){
    event.preventDefault();

    //Variables necesarias para el fetch
    const urlBuscar = `https://api.spotify.com/v1/search?q=${encodeURIComponent(inputBusqueda.value)}&type=track&limit=12`;
    const metodo = 'GET';
    const header = {
        Authorization: `Bearer ${tokenAccess}`,
        "Content-Type": "application/json"
    };

    obtenerBusqueda(urlBuscar, metodo, header);
}

//Escucha de busqueda
btnBuscar.addEventListener('click', search);


const agregarTarjetas = function(data, headerSearch){
    const canciones = data.tracks.items;
    console.log(canciones);
    for (let i=0; i< canciones.length; i++){
        //Div cancion
        const cancion = document.createElement("div");
        cancion.className = "cancion";
        //Contenido canciones
        //Imagen container
        const imgContainer = document.createElement("div");
        imgContainer.className = "img-cancion-container";
        const img = document.createElement("img");

        //Imagen
        img.src = canciones[i].album.images[0].url;
        //Agregar imagen a container
        imgContainer.appendChild(img);
        //Agregar container imagen a cancion
        cancion.appendChild(imgContainer);

        //Titol
        const titol = document.createElement("h2");
        titol.className = "titulo-cancion";
        titol.textContent = canciones[i].name;
        cancion.appendChild(titol);

        //Div para la info de artista y album (reverse)
        const info = document.createElement("div");
        info.className = "info";

        //Artista
        const artista = document.createElement("span");
        //Fetch para obtener el nombre del artista
        let urlArtista = canciones[i].artists[0].href;
        fetch(urlArtista, {
            method: "GET",
            headers: headerSearch
        })
        .then((response) => {
            // Controlar peticion
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json(); // Retornar la respuesta como JSON
        })
        .then((dataArtista) => {
            //Artista
            artista.className = "artista";
            artista.textContent = "Artista: " + dataArtista.name;
            info.appendChild(artista);

            //Boton
            const botonAgregar = document.createElement("button");
            botonAgregar.type = "button";
            botonAgregar.className = "btnAdd";
            botonAgregar.textContent = "+ Añadir cancion";
            cancion.appendChild(botonAgregar);
        })
        .catch((Error) => {
            console.log('Error: ' + Error);
        })

        const album = document.createElement("span");
        album.className = "album";
        let nombreAlbum = recortarTexto(canciones[i].album.name)
        album.textContent = "Album: " + nombreAlbum;
        info.appendChild(album);

        cancion.appendChild(info);

        cancionesContainer.appendChild(cancion);
    }
}

function recortarTexto(texto){
    if (texto.length > MAX_LENGTH){
        return texto.slice(0, MAX_LENGTH) + '...';
    } else {
        return texto;
    }
}

//Metodo para realizar fetch y obtener el resultado
function obtenerBusqueda(url, metodo, headerSearch){
    fetch(url, {
        method: metodo,
        headers: headerSearch
    })
    .then((response) => {
        // Controlar si la petició ha anat bé o hi ha alguna error.
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Retorna la resposta com JSON
    })
    .then((data) => {
        agregarTarjetas(data, headerSearch)        
    })
    .catch((Error) => {
        console.log('Error: ' + Error);
    })
}