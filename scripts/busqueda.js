import { tokenAccess } from "./token.js";
import { eschucharBotonesCancion } from "./info_artista.js";

const MAX_LENGTH = 15;

const btnBuscar = document.querySelector('#btnBuscar');
const btnBorrar = document.querySelector('#btnBorrar');
const inputBusqueda = document.querySelector('#entradaCancion');
const cancionesContainer = document.querySelector('#canciones-container');
const infoArtistaContainer = document.querySelector('#info-artista-container');
const numElementos = document.querySelector('#num-elementos-busqueda');

let cancionesMostradas = 0;
let totalCanciones = 0;
let botonAgregar = false;
//*** BUSCAR ***/

//Controlamos el submit y tratamos el evento de buscar
const search = function(event){
    if (typeof event != "undefined"){
        event.preventDefault();
    }
    if (inputBusqueda.value){
        //Variables necesarias para el fetch
        const urlBuscar = `https://api.spotify.com/v1/search?q=${encodeURIComponent(inputBusqueda.value)}&type=track&offset=${cancionesMostradas}&limit=${numElementos.value}`;
        const metodo = 'GET';
        const header = {
            Authorization: `Bearer ${tokenAccess}`,
            "Content-Type": "application/json"
        };
        //Obtenermos el resultado y lo agregamos
        agregarBotonMasCanciones();
        escucharAgregarMas();
        obtenerBusqueda(urlBuscar, metodo, header);
    } else{
        alert('Introdueix un nom per buscar');
    }
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
        agregarTarjetas(data, headerSearch);
        totalCanciones = data.tracks.total;
        actualizarAgregarMas(); 
    })
    .catch((Error) => {
        console.log('Error: ' + Error);
    })
}

//Funcion para crear las tarjetas de las canciones
const agregarTarjetas = function(data, headerSearch){
    const canciones = data.tracks.items;
    for (let i=0; i< canciones.length; i++){
        cancionesMostradas++;
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

        //Agregamos la tarjeta cancion
        cancionesContainer.appendChild(cancion);

        //Cargamos la escucha de botones
        eschucharBotonesCancion();
    }
}

function agregarBotonMasCanciones(){
    if (!botonAgregar){
        botonAgregar = true;
        const botonAgregarMas = document.createElement('button');
        botonAgregarMas.textContent = 'Agregar ' + numElementos.value + ' canciones más de ' + totalCanciones;
        botonAgregarMas.className = 'agregar-mas';
        botonAgregarMas.type = 'submit';
        document.body.appendChild(botonAgregarMas);
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
    cancionesMostradas = 0;
    totalCanciones = 0;
}


/* Boton agregar más canciones */

function escucharAgregarMas(){
    const btnAgregarMas = document.querySelector('.agregar-mas');
    btnAgregarMas.addEventListener('click', search);
}

function actualizarAgregarMas(){
    const btnAgregarMas = document.querySelector('.agregar-mas');
    btnAgregarMas.textContent = 'Agregar ' + numElementos.value + ' canciones más de ' + totalCanciones;
}
