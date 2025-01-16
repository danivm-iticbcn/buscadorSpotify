import {clientId} from "../env/client.js";

console.log(clientId);

const numElementos = document.querySelector('#num-elementos-busqueda');
const btnPlaylists = document.querySelector('#btnPlaylist');

const URL = "https://accounts.spotify.com/authorize";
const redirectUri = "http://127.0.0.1:5500/playlist.html";
const scopes =
  "playlist-modify-private user-library-modify playlist-modify-public";

const elementosArray = [8, 12, 16, 20, 24];

for (let num of elementosArray){
    const elemento = document.createElement('option');
    elemento.value = num;
    elemento.textContent = num;
    numElementos.appendChild(elemento);
}

const autoritzar = function () {
    const authUrl =
      URL +
      `?client_id=${clientId}` +
      `&response_type=token` +
      `&redirect_uri=${redirectUri}` +
      `&scope=${scopes}`;
  
    window.location.assign(authUrl);
  };

btnPlaylists.addEventListener('click', autoritzar);