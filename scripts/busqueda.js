import { tokenAccess } from "./token.js";
import { eschucharBotonesCancion } from "./info_artista.js";

const MAX_LENGTH = 15;

const btnBuscar = document.querySelector('#btnBuscar');
const btnBorrar = document.querySelector('#btnBorrar');
const inputBusqueda = document.querySelector('#entradaCancion');
const cancionesContainer = document.querySelector('#canciones-container');
const infoArtistaContainer = document.querySelector('#info-artista-container');

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
    //Obtenermos el resultado y lo agregamos
    obtenerBusqueda(urlBuscar, metodo, header);
}

//Escucha de busqueda
btnBuscar.addEventListener('click', search);

//Metodo para realizar fetch y obtener el resultado
function obtenerBusqueda(url, metodo, headerSearch){
    fetch(url, {
        method: metodo,
        headers: headerSearch
    })
    .then((response) => {
        // Controlar  la petición
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Devolver la respuesta como JSON
    })
    .then((data) => {
        agregarTarjetas(data, headerSearch)        
    })
    .catch((Error) => {
        console.log('Error: ' + Error);
    })
}

//Funcion para crear las tarjetas de las canciones
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
        artista.className = "artista";
        artista.textContent = "Artista: " + canciones[i].artists[0].name;
        info.appendChild(artista);

        //Album
        const album = document.createElement("span");
        album.className = "album";
        let nombreAlbum = recortarTexto(canciones[i].album.name)
        album.textContent = "Album: " + nombreAlbum;
        info.appendChild(album);

        //Agregamos el div de la info
        cancion.appendChild(info);

        //Boton playlist
        const botonAgregar = document.createElement("button");
        botonAgregar.type = "button";
        botonAgregar.className = "btnAdd";
        botonAgregar.id = canciones[i].id;
        botonAgregar.textContent = "+ Añadir cancion";
        cancion.appendChild(botonAgregar);

        //Boton info artista
        const botonInfoArtista = document.createElement("button");
        botonInfoArtista.type = "button";
        botonInfoArtista.className = "btnArtista";
        botonInfoArtista.id = canciones[i].artists[0].id;
        botonInfoArtista.textContent = "Info Artista";
        cancion.appendChild(botonInfoArtista);

        //Cargamos la escucha de botones
        eschucharBotonesCancion();

        //Agregamos la tarjeta cancion
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

/** BORRAR **/

btnBorrar.addEventListener('click', borrarResultados);

function borrarResultados(){
    cancionesContainer.innerHTML = '';
    infoArtistaContainer.innerHTML = '';
}