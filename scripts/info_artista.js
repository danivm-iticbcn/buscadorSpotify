import { tokenAccess } from "./token.js";

const MAX_TOPCANCIONES = 3;
const infoArtistaContainer = document.querySelector('#info-artista-container');
let cancionesAgregadas = [];

//Funcion para cargar la escucha de los botones
export function eschucharBotonesCancion(){
    const btnAgregar = document.querySelectorAll('.btnAdd');
    const btnInfoArtista = document.querySelectorAll('.btnArtista');

    btnAgregar.forEach((element) => {
        if (!element.hasAttribute('data-listener')) {   //Para regular que solo se ejecute una vez
            element.addEventListener("click", function(){
                agregarCancionAPlaylist(element.id);
            });
        }
        element.setAttribute('data-listener', 'true'); //Reseteamos el valor para poder volver a ejecutarlo con otra entrada
    })
    //btnAgregar[btnAgregar.length-1].setAttribute('data-listener', 'true');

    btnInfoArtista.forEach((element) => {
        if (!element.hasAttribute('data-listener')) {   //Para regular que solo se ejecute una vez
            element.addEventListener("click", function(){
                agregarInfoArtista(element.id);
            });
        }
        element.setAttribute('data-listener', 'true'); //Reseteamos el valor para poder volver a ejecutarlo con otra entrada
    })
}


function agregarCancionAPlaylist(idCancion){
    let arrayCanciones = []
    try{
        let cancionesExistentes = localStorage.getItem('canciones').split(',');
        for (let cancion of cancionesExistentes){
            arrayCanciones.push(cancion);
        }
    } catch(Error){
        console.log(Error);
    }

    if (!arrayCanciones.includes(idCancion)){
        arrayCanciones.push(idCancion);
        localStorage.setItem('canciones', arrayCanciones);
        cancionesAgregadas = arrayCanciones;
    }
}

function agregarInfoArtista(idArtista){

    const urlArtista = `https://api.spotify.com/v1/artists/${idArtista}`;
    const metodo = 'GET';
    const headerInfoArtista = {
        Authorization: `Bearer ${tokenAccess}`,
        "Content-Type": "application/json"
    };

    fetch(urlArtista, {
        method: metodo,
        headers: headerInfoArtista
    })    
    .then((response) => {
        // Controlar  la petición
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Devolver la respuesta como JSON
    })
    .then((data) => {
        crearTarjetaInfoArtista(data);
    })
    .catch((Error) => {
        console.log('Error: ' + Error);
    })
}

function crearTarjetaInfoArtista(artista){
    //Vaciamos la informacion actual
    infoArtistaContainer.innerHTML = '';

    //Introducimos la parte superior (info artista)
    const infoPrincipal = document.createElement("div");
    infoPrincipal.className = "info-principal";
    //Imagen container
    const imgInfoContainer = document.createElement("div");
    imgInfoContainer.className = "img-info-container";
    //Imagen
    const imgInfo = document.createElement("img");
    imgInfo.src = artista.images[0].url;
    imgInfoContainer.appendChild(imgInfo);
    infoPrincipal.appendChild(imgInfoContainer);
    //Titulo
    const nombreArtista = document.createElement("h3");
    nombreArtista.textContent = artista.name;
    infoPrincipal.appendChild(nombreArtista);

    //Info extra
    //Popularidad
    const popularidad = document.createElement("span");
    popularidad.className = "pupularidad";
    popularidad.textContent = "Popularidad: " + artista.popularity;
    infoPrincipal.appendChild(popularidad);
    //Generos
    const generos = document.createElement("span");
    generos.className = "generos";
    generos.textContent = cargarGeneros(artista.genres);
    infoPrincipal.appendChild(generos);
    //Seguidores
    const seguidores = document.createElement("span");
    seguidores.className = "seguidores";
    seguidores.textContent = "Seguidores: " + artista.followers.total;
    infoPrincipal.appendChild(seguidores);
    //Agregar al contenedor padre
    infoArtistaContainer.appendChild(infoPrincipal);

    //Cargar las canciones top del artista
    cargarTopCanciones(artista.id);


}

function cargarGeneros(generos){
    let resultado = "Generos: ";
    for (const genero of generos){
        resultado += genero + ", ";
    }
    return resultado.slice(0, resultado.length-2);
}

function cargarTopCanciones(idArtista){

    const urlTopCanciones = `https://api.spotify.com/v1/artists/${idArtista}/top-tracks`;
    const metodo = 'GET';
    const headerTopCanciones =  {
        Authorization: `Bearer ${tokenAccess}`,
        "Content-Type": "application/json"
    };

    fetch(urlTopCanciones, {
        method: metodo,
        headers: headerTopCanciones
    })    
    .then((response) => {
        // Controlar  la petición
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Devolver la respuesta como JSON
    })
    .then((data) => {
        //Introduciomos la parte inferior (canciones)
        const listaCancionesContainer = document.createElement("div");
        listaCancionesContainer.className = "lista-canciones";
        //Titulo
        const tituloListaCanciones = document.createElement("h4");
        tituloListaCanciones.textContent = "TOP 3 Canciones";
        listaCancionesContainer.appendChild(tituloListaCanciones);
        //Lista canciones
        const listaCanciones = document.createElement("ol");
        for (let i=0; i<MAX_TOPCANCIONES; i++){
            const cancion = document.createElement("li");
            cancion.textContent = data.tracks[i].name;
            listaCanciones.appendChild(cancion);
        }
        //Agregamos la lista
        listaCancionesContainer.appendChild(listaCanciones);

        //Agregar al contenedor padre
        infoArtistaContainer.append(listaCancionesContainer);
    })
    .catch((Error) => {
        console.log('Error: ' + Error);
    })


}