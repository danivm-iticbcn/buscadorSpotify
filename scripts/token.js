import {clientId, clientSecret} from "../env/client.js";

export let tokenAccess = "";

const btnBuscar = document.querySelector('#btnBuscar');
const btnBorrar = document.querySelector('#btnBorrar');

const getSpotifyAccessToken = function (clientId, clientSecret) {
    // Url de l'endpont de spotify
    const url = "https://accounts.spotify.com/api/token";
    // ClientId i ClienSecret generat en la plataforma de spotify
    const credentials = btoa(`${clientId}:${clientSecret}`);
  
  
    //Es crear un header on se li passa les credencials
    const header = {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
  
  
    fetch(url, {
      method: "POST",
      headers: header,
      body: "grant_type=client_credentials", // Paràmetres del cos de la sol·licitud
    })
      .then((response) => {
      // Control de peticion
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Retornar la respuesta como JSON
      })
      .then((data) => {

        tokenAccess = data.access_token;
        btnBuscar.disabled = false;
        btnBorrar.disabled = false;
      })
      .catch((error) => {
        console.error("Error a l'obtenir el token:", error);
      });
  };

getSpotifyAccessToken(clientId, clientSecret);