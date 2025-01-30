const accessToken = window.location.href.split('access_token=')[1];
const API_URL_SEVERAL_TRACKS = "https://api.spotify.com/v1/tracks";

const selecionadasContainer = document.querySelector('#selecionadas');
const playlistsContainer = document.querySelector('#playlists');
const cancionesContainer = document.querySelector('#canciones-container');
const volverBtn = document.querySelector('#volver');
let editor;
let idusuario;

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
    selecionadasContainer.innerHTML = '';
    const titulo = document.createElement('h2');
    titulo.textContent = "Canciones Selecionadas";
    selecionadasContainer.appendChild(titulo);
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
        addBtn.addEventListener("click", () =>{
            agregarCancionLs(track.uri);
        });
        contenedorCancion.appendChild(addBtn);

        const delBtn = document.createElement("button");
        delBtn.classList = "del boton boton-sel";
        delBtn.textContent = "DEL";
        delBtn.addEventListener("click",() =>{
            eliminarCancionLs(track.id);
        });

        contenedorCancion.appendChild(delBtn);

        selecionadasContainer.appendChild(contenedorCancion);
    }
}

async function agregarCancionLs(uriCancion){
    if(lanzarConfirmacion('¿Seguro que deseas añadir la cancion a tu playlist?')){
        let idPlaylist = document.querySelector('.editar').id;
        if (idPlaylist != ''){
            
            const url = `https://api.spotify.com/v1/playlists/${idPlaylist}/tracks`;
    
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    uris: [uriCancion] // Agregar cancion a traves de uri
                }),
            });
            selecionarPlaylist(idPlaylist, '');
            
        } else{
            alert('Debes tener una playlist selecionada.')
        }
    } 
}

function eliminarCancionLs(id){
    if(lanzarConfirmacion('¿Seguro que deseas eliminar esta cancion de tu playlist?')){
        let canciones = getIdTracksLocalStorage().split(',');
        for (let [i, cancion] of canciones.entries()){
            if (id === cancion){
                canciones.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("canciones", canciones);
        getTrackSelected();
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
        idusuario = usuario.id
        getPlayListsPorIdUsuario(idusuario);
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
    }
}

function cargarPlaylists(playlists){
    playlistsContainer.innerHTML = '';
    const titulo = document.createElement('h2');
    titulo.textContent = "Playlists";
    playlistsContainer.appendChild(titulo);
    for (let playlist of playlists){
        const container = document.createElement('div');
        container.className = 'playlist';
        container.addEventListener("click", ()=>{
            selecionarPlaylist(playlist.id, playlist.name);
        })
        const nombrePlaylist = document.createElement('span');
        nombrePlaylist.className = 'nombre-playlist';
        nombrePlaylist.textContent = playlist.name;
        container.appendChild(nombrePlaylist);
        //Agregar al html
        playlistsContainer.appendChild(container);
    }
    cargarEditorDePlaylist();
}



async function selecionarPlaylist(id, nom){
    editor = document.querySelector('.editor-playlist');
    if (nom){
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
        delBtn.classList = 'del boton can-del';
        delBtn.addEventListener("click", ()=>{
            eliminarCancion(idPlaylist, cancion.track.uri)
        })
        delBtn.textContent = 'DEL';
        contenedor.appendChild(delBtn);
        cancionesContainer.appendChild(contenedor);
    };
}

async function eliminarCancion(idPlaylist, uriPlaylist){
    if (lanzarConfirmacion("¿Seguro que quieres eliminar la cancion?")){
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

    const refeshBtn = document.createElement('button');
    refeshBtn.classList = 'boton refresh';
    refeshBtn.textContent = 'Refrescar';
    refeshBtn.addEventListener("click", function(){
        getPlayListsPorIdUsuario(idusuario);
    })
    playlistsContainer.appendChild(refeshBtn);

    escucharEditor();
}

function escucharEditor(){
    const editarBtn = document.querySelector('.editar');
    editarBtn.addEventListener('click', function(){
        lanzarConfirmacion('Seguro que quieres modificar el nombre de la playlist?') ? modificarNombrePlaylist(editarBtn.id):'';
    });
}

async function modificarNombrePlaylist(idPlaylist){
    if (idPlaylist){
        const nuevoNombre = editor.value;
        const url = `https://api.spotify.com/v1/playlists/${idPlaylist}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name: nuevoNombre
            }),
        });
    } else{
        alert("Debes tener una playlist selecionada");
    }
    
}

function lanzarConfirmacion(texto){
    let respuesta = confirm(texto);
    return respuesta;
}

getPlayLists();
getTrackSelected();