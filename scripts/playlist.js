import {clientId} from "../env/client.js";

const accessToken = window.location.href.split('access_token=')[1];
const API_URL_SEVERAL_TRACKS = "https://api.spotify.com/v1/tracks";

const selecionadasContainer = document.querySelector('#selecionadas');
const playlistsContainer = document.querySelector('#playlists');
const cancionesContainer = document.querySelector('#canciones-container');
const volverBtn = document.querySelector('#volver');

//********Volver
volverBtn.addEventListener('click', ()=> {
    window.location.assign('http://127.0.0.1:5500/index.html');
});

//********CANCIONES LOCALSTORAGE

const getIdTracksLocalStorage = function (){
    return localStorage.getItem("canciones");
}

//Renderizar canciones del localStorage
const renderTracksSelecteds = function (tracks){
    for (let track of tracks){
        //Contenedor
        const contenedorCancion = document.createElement("div");
        contenedorCancion.className = "cancionSelLocal";
        //Texto
        const titulo = document.createElement("span");
        titulo.className = "txt-sel";
        titulo.textContent = `${track.name} - ${track.artists[0].name}`;
        contenedorCancion.appendChild(titulo);
        //Botones
        const addBtn = document.createElement("button");
        addBtn.classList = "add boton boton-sel";
        addBtn.textContent = "ADD";
        addBtn.id = track.artists[0].uri;
        contenedorCancion.appendChild(addBtn);
        const delBtn = document.createElement("button");
        delBtn.classList = "del boton boton-sel";
        delBtn.textContent = "DEL";
        delBtn.id = track.artists[0].uri;
        contenedorCancion.appendChild(delBtn);

        selecionadasContainer.appendChild(contenedorCancion);
    }
    escucharBotones();
    
}

function escucharBotones(){
    const addBotones = document.querySelectorAll('.add');
    const delBotones = document.querySelectorAll('.del');

    addBotones.forEach((element)=> {
        element.addEventListener('click', function(){
            agregarCancionLs(element.id);
        });
    })

    delBotones.forEach((element)=> {
        element.addEventListener('click', function(){
            eliminarCancionLs(element.id);
        });
    })
}

async function agregarCancionLs(uriCancion){
    let confirmacion = confirm('¿Seguro que deseas añadir la cancion a tu playlist?');
    if(confirmacion){
        let idPlaylist = document.querySelector('.editar').id;
        if (idPlaylist != ''){
            
            const url = `https://api.spotify.com/v1/playlists/${idPlaylist}/tracks`;
    
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    uris: [uriCancion], // Agregar cancion a traves de uri
                }),
            });
            selecionarPlaylist(idPlaylist, '');
            
        } else{
            alert('Debes tener una playlist selecionada.')
        }
    } 
}

function eliminarCancionLs(id){
    let confirmacion = confirm('¿Seguro que deseas eliminar esta cancion de tu playlist?');
    if(confirmacion){

    }
}

//********OBTENER PLAYLISTS

//Conseguir las canciones guardadas al localstorage
const getTrack = async function (listaTracks){
    const urlEndpoint = `${API_URL_SEVERAL_TRACKS}?ids=${listaTracks}`;
    const respuesta = await fetch(urlEndpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!respuesta.ok){
        throw Error("Error al fer la consulta", respuesta.status);
    } else{
        const tracks = await respuesta.json();
        console.log(tracks);
        renderTracksSelecteds(tracks.tracks);
    }
}

//Devuelve las canciones guardadas al localstorage
function getTrackSelected(){
    const listaTracks = getIdTracksLocalStorage();
    try{
        getTrack(listaTracks);
    } catch(Error){
        console.log(Error);
    }
    
}

const getPlayLists = function (){
    getIdUsuario();
}

async function getIdUsuario(){
    const URL =  `https://api.spotify.com/v1/me`;
    const respuesta = await fetch(URL, {
        method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
    })

    if (!respuesta.ok){
        throw Error("Error al fer la consulta", respuesta.status);
    } else{
        const usuario = await respuesta.json();
        getPlayListsPorIdUsuario(usuario.id);
    }
}

//Devuelve la lista de playlist del usuario
async function getPlayListsPorIdUsuario(id){
    const URL = `https://api.spotify.com/v1/users/${id}/playlists`;
    const respuesta = await fetch(URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
    });

    if (!respuesta.ok){
        throw Error("Error al fer la consulta", respuesta.status);
    } else{
        const playlists = await respuesta.json();
        cargarPlaylists(playlists.items);
        cargarEscuchaPlaylist();
    }

}

function cargarPlaylists(playlists){
    console.log(playlists);
    for (let playlist of playlists){
        const container = document.createElement('div');
        container.className = 'playlist';
        container.id = playlist.id;
        const nombrePlaylist = document.createElement('span');
        nombrePlaylist.className = 'nombre-playlist';
        nombrePlaylist.textContent = playlist.name;
        container.appendChild(nombrePlaylist);
        //Agregar al html
        playlistsContainer.appendChild(container);
    }
    cargarEditorDePlaylist();
}

function cargarEscuchaPlaylist(){
    const playlists = document.querySelectorAll('.playlist');

    playlists.forEach((element) =>{
        element.addEventListener('click', function(){
            selecionarPlaylist(element.id, element.textContent);
        });
    })
}

async function selecionarPlaylist(id, nom){
    if (nom){
        const editor = document.querySelector('.editor-playlist');
        const editarBtn = document.querySelector('.editar');
        editor.value = nom;
        editarBtn.id = id;
    }

    const URL = `https://api.spotify.com/v1/playlists/${id}/tracks`;
    const respuesta = await fetch(URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!respuesta.ok){
        throw Error("Error al fer la consulta", respuesta.status);
    } else{
        const playlistTracks = await respuesta.json();
        console.log(playlistTracks.items);
        cargarCanciones(id, playlistTracks.items);
    }
}

function cargarCanciones(idPlaylist, canciones){
    cancionesContainer.innerHTML = '';
    for (let cancion of canciones){
        const contenedor = document.createElement('div');
        contenedor.className = 'cancion';

        const nombre = document.createElement('span');
        nombre.className = 'nombreCancion';
        nombre.textContent = cancion.track.name;
        contenedor.appendChild(nombre);

        const delBtn = document.createElement('button');
        delBtn.classList = 'del boton can-del'
        delBtn.id = `${idPlaylist};${cancion.track.uri}`;
        delBtn.textContent = 'DEL';
        contenedor.appendChild(delBtn);

        cancionesContainer.appendChild(contenedor);
    }
    escucharEliminarCanciones();
}

function escucharEliminarCanciones(){
    const botones = document.querySelectorAll('.can-del');
    botones.forEach((element) => {
        element.addEventListener('click', function(){
            eliminarCancion(element.id);
        });
    })
}

async function eliminarCancion(infoPlaylist){
    const idPlaylist = infoPlaylist.split(';')[0];
    const uriPlaylist = infoPlaylist.split(';')[1];

    const url = `https://api.spotify.com/v1/playlists/${idPlaylist}/tracks`;

    // Realizar la solicitud a la API
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        tracks: [{ uri: uriPlaylist }] // Agregar URIs que queremos eliminar
      })
    });

    selecionarPlaylist(idPlaylist, '');
}

function cargarEditorDePlaylist(){
    const editorContainer = document.createElement('div');
    editorContainer.className = 'editor-container';

    const editorNombrePlaylist = document.createElement('input');
    editorNombrePlaylist.className = 'editor-playlist';
    editorContainer.appendChild(editorNombrePlaylist);
    const editarBtn = document.createElement('button');
    editarBtn.classList = 'boton editar';
    editarBtn.textContent = 'Editar';
    editorContainer.appendChild(editarBtn);

    playlistsContainer.appendChild(editorContainer);

    escucharEditor();
}

function escucharEditor(){
    const editarBtn = document.querySelector('.editar');
    editarBtn.addEventListener('click', function(){
        let confirmacion = confirm('Seguro que quieres modificar el nombre de la playlist?');
        confirmacion ? modificarNombrePlaylist(editarBtn.id):'';
    });
}

function modificarNombrePlaylist(idPlaylist){
    console.log(idPlaylist);
}



getPlayLists();
getTrackSelected();