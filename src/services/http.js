const axios = require("axios").default;

const { scraper: config } = require("../config");

axios.defaults.baseURL = config.baseURL;

function parseParams(params) {
  return Object.keys(params)
    .map(k => `${k}=${encodeURIComponent(params[k])}`)
    .join("&");
}

async function consultaHorarios() {
  return axios("/consulta_horarios.php").then(res => res.data);
}

async function resultadoNRC1({ nrc, datos_periodo, datos_nivel }) {
  return axios("/resultado_nrc1.php", {
    method: "POST",
    data: parseParams({ nrc, datos_periodo, datos_nivel }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(res => res.data);
}

module.exports = {
  consultaHorarios,
  resultadoNRC1
};
