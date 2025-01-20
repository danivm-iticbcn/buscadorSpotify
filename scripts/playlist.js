const accessToken = window.location.href.split('access_token=')[1];
const API_URL_SEVERAL_TRACKS = "https://api.spotify.com/v1/tracks";

const selecionadasContainer = document.querySelector('#selecionadas');

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
        contenedorCancion.appendChild(addBtn);
        const delBtn = document.createElement("button");
        delBtn.classList = "del boton boton-sel";
        delBtn.textContent = "DEL";
        contenedorCancion.appendChild(delBtn);

        selecionadasContainer.appendChild(contenedorCancion);
    }
}

//Conseguir las canciones guardadas al localstorage
const getTrack = async function (listaTracks){
    const urlEndpoint = `${API_URL_SEVERAL_TRACKS}?ids=${listaTracks}`;
    console.log(urlEndpoint);
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

//Devuelve la lista de playlist del usuario
function getPlayLists(){
    console.log("getPlayList");
}

getPlayLists();
getTrackSelected();