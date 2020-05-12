import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

let token;

/**
 * Positionne le Jwt sur axios
 * @param {string} token 
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Suppression du Jwt du localStorage et d'axios
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
  console.log("Suppression de l'autorisation dans axios");
}

/**
 * Requête http d'authentification et stockage du Jwt dans le localStorage et dans axios
 * @param {object} credentials 
 */
function authenticate(credentials) {
  return axios
    .post(LOGIN_API, credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // On place le Jwt dans le localStorage mais il faudrait le mettre dans un cookie Httponly
      window.localStorage.setItem("authToken", token);
      setAxiosToken(token)
      return true;
    });
}

/**
 * Mise en place du token Jwt
 */
function setUp() {

  // 1. Vérification de la présence d'un Jwt
  const token = window.localStorage.getItem("authToken");

  // 2. Vérification de la validité du Jwt
  // la date d'expiration du token est dans jwtData.exp, timestamp exprimé en secondes
  if (token) {
    const jwtData = jwtDecode(token);
    if (jwtData.exp*1000 > new Date().getTime()) {
      // Le token est encore valide
      setAxiosToken(token)
      console.log("Connexion établie avec axios");
    }
  }
}

/**
 * Permet de savoir si l'on est authentifié
 * @returns boolean
 */
function isAuthenticated() {
  // 1. Vérification de la présence d'un Jwt
  const token = window.localStorage.getItem("authToken");

  // 2. Vérification de la validité du Jwt
  // la date d'expiration du token est dans jwtData.exp, timestamp exprimé en secondes
  if (token) {
    const jwtData = jwtDecode(token);
    if (jwtData.exp*1000 > new Date().getTime()) {
      return true;
    }
  }

  return false;

}

// Utilisation des fonctions en dehors de ce script
export default {
  authenticate: authenticate,
  logout: logout,
  setUp: setUp,
  isAuthenticated: isAuthenticated
};
