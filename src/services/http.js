/* eslint-disable camelcase */
const axios = require('axios').default;

const { scraper: config } = require('../config');

axios.defaults.baseURL = config.baseURL;

/**
 * Parse an object to form-urencoded body.
 *
 * @param {Object} params
 * @returns {String}
 */
function parseParams(params) {
  return Object.keys(params)
    .map(k => `${k}=${encodeURIComponent(params[k])}`)
    .join('&');
}

/**
 * GET request to `/consulta_horarios.php`
 */
async function consultaHorarios() {
  return axios('/consulta_horarios.php').then(res => res.data);
}

/**
 * POST request to `/resultado_nrc1.php`
 * @param {Object} params
 * @param {String} params.nrc
 * @param {String} params.datos_periodo
 * @param {String} params.datos_nivel
 */
async function resultadoNRC1({ nrc, datos_periodo, datos_nivel }) {
  return axios('/resultado_nrc1.php', {
    method: 'POST',
    data: parseParams({ nrc, datos_periodo, datos_nivel }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => res.data);
}

/**
 * POST request to `/resultado_departamento1.php`
 * @param {Object} params
 * @param {String} params.departamento
 * @param {String} params.datos_periodo
 * @param {String} params.datos_nivel
 */
async function resultadoDepartamento1({
  departamento,
  datos_periodo,
  datos_nivel
}) {
  return axios('/resultado_departamento1.php', {
    method: 'POST',
    data: parseParams({ departamento, datos_periodo, datos_nivel }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => res.data);
}

/**
 * POST request to `/resultado_codigo1.php`
 * @param {Object} params
 * @param {String} params.mat
 * @param {String} params.datos_periodo
 * @param {String} params.datos_nivel
 */
async function resultadoCodigo1({ mat, datos_periodo, datos_nivel }) {
  return axios('/resultado_codigo1.php', {
    method: 'POST',
    data: parseParams({ mat, datos_periodo, datos_nivel }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => res.data);
}

module.exports = {
  consultaHorarios,
  resultadoNRC1,
  resultadoDepartamento1,
  resultadoCodigo1
  // TODO resultado_curso1
};
