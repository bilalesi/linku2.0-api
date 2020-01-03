/**
 * Scrapper Service
 * @version 1.0.0
 * @author krthr
 */

/* eslint-disable camelcase */
const cheerio = require('cheerio');
const httpService = require('./http');

/** @typedef {import('../types').Department} Department */
/** @typedef {import('../types').Period} Period */
/** @typedef {import('../types').Level} Level */
/** @typedef {import('../types').Group} Group */

/** @type {Period[]} */
const PERIODS = [
  {
    code: '202010',
    name: 'Primer Semestre 2020'
  }
];

/** @type {Level[]} */
const LEVELS = [
  { code: 'PR', name: 'Pregrado' },
  { code: 'PG', name: 'Postgrado' },
  { code: 'EC', name: 'Educación Continua' },
  { code: 'EX', name: 'Extracurricular' }
];

/**
 * Get all the departments.
 *
 * @returns {Promise<Department[]>}
 */
async function getAllDepartments() {
  const html = await httpService.consultaHorarios();
  const $ = cheerio.load(html);

  return $('#departamento > option')
    .slice(1)
    .map((i, el) => {
      const parsedEl = $(el);

      return {
        code: parsedEl.val(),
        name: parsedEl.text()
      };
    })
    .get();
}

/**
 * Get all the levels.
 *
 * @returns {Promise<Level[]>}
 */
async function getAllLevels() {
  const html = await httpService.consultaHorarios();
  const $ = cheerio.load(html);

  return $('#nivel > option')
    .slice(1)
    .map((i, el) => {
      const parsedEl = $(el);

      return {
        code: parsedEl.val(),
        name: parsedEl.text()
      };
    })
    .get();
}

/**
 * Get all periods.
 *
 * @returns {Promise<Period[]>}
 */
async function getAllPeriods() {
  const html = await httpService.consultaHorarios();
  const $ = cheerio.load(html);

  return $('#periodo > option')
    .slice(1)
    .map((i, el) => {
      const parsedEl = $(el);

      return {
        code: parsedEl.val(),
        name: parsedEl.text()
      };
    })
    .get();
}

/**
 * Get a group by NRC.
 * @param {String} nrc
 * @param {String} period
 * @param {String} level
 *
 * @returns {Promise<Group>}
 */
async function getGroupByNRC(
  nrc,
  period = PERIODS[0].code,
  level = LEVELS[0].code
) {
  const html = await httpService.resultadoNRC1({
    nrc,
    datos_nivel: level,
    datos_periodo: period
  });

  const $ = cheerio.load(html);

  const subjectInfo = $('body > div > p:nth-child(3)')
    .text()
    .split('\t\t');

  if (!$('body > div > p.msg1').text()) {
    return null;
  }

  let subject = {
    name: $('body > div > p.msg1').text(),
    departmentName: ($('body > div > p:nth-child(2)').text() || '')
      .replace('Departamento:', '')
      .trim(),
    code: subjectInfo[0]
      .split(':')[1]
      .substring(0, 4)
      .trim(),
    number: subjectInfo[0]
      .split(':')[1]
      .substring(4)
      .trim()
  };

  subject = {
    ...subject,
    mat: `${subject.code}${subject.number}`
  };

  const [professors, [taken, free]] = await Promise.all([
    $('body > div > p.msg5')
      .html()
      .match(/>([^<>]|^>)*</gm)
      .slice(1)
      .map(elem => {
        let [firstname, lastname] = elem
          .replace(/>\s*|\s*</g, '')
          .toLowerCase()
          .split(',');

        firstname = firstname
          ? firstname
              .trim()
              .split(' ')
              .map((word, i) => {
                return `${word[0].toUpperCase()}${word.slice(1)}`;
              })
              .join(' ')
          : '';

        lastname = lastname
          ? lastname
              .trim()
              .split(' ')
              .map(word => {
                word = word.trim();
                return `${word[0].toUpperCase()}${word.slice(1)}`;
              })
              .join(' ')
          : '';

        return `${firstname} ${lastname}`;
      }),

    $('body > div > p:nth-child(4)')
      .text()
      .match(/[0-9]+/g)
      .map(Number)
  ]);

  const schedule = $(
    '#acreditaciones_resultado > div > div > table > tbody > tr'
  )
    .slice(1)
    .map((i, el) => {
      const parsedEl = $(el);

      const [, startDate, endDate, day, time, place] = parsedEl
        .text()
        .replace(/\t+/g, '')
        .split('\n');

      const [start, end] = time.split(' - ');

      return {
        startDate,
        endDate,
        day,
        time: { start, end },
        place
      };
    })
    .get();

  return {
    nrc,
    group: subjectInfo[1].split(':')[1].trim(),
    subject,
    professors,
    schedule,
    quota: {
      free,
      taken
    }
  };
}

/**
 * Get all groups by their NRCs.
 *
 * @param {String[]} nrcs
 *
 * @returns {Promise<Group[]>}
 */
async function getGroupsByNRCs(nrcs) {
  return (await Promise.all(nrcs.map(nrc => getGroupByNRC(nrc)))).filter(
    group => !!group
  );
}

/**
 * Get all the groups by Department.
 * @param {String} department_code
 * @param {String} period_code
 * @param {String} level_code
 *
 */
async function getGroupsByDepartment(
  department_code,
  period_code = PERIODS[0].code,
  level_code = LEVELS[0].code
) {
  const html = await httpService.resultadoDepartamento1({
    departamento: department_code,
    datos_nivel: level_code,
    datos_periodo: period_code
  });

  const $ = cheerio.load(html);

  const NRCs = $('#programa > option')
    .map((i, el) => $(el).val())
    .get();

  return getGroupsByNRCs(NRCs);
}

/**
 * Get all the groups using a subject code.
 *
 * @param {String} subject_code
 * @param {String} period_code
 * @param {String} level_code
 */
async function getGroupsBySubjectCode(
  subject_code,
  period_code = PERIODS[0].code,
  level_code = LEVELS[0].code
) {
  const html = await httpService.resultadoCodigo1({
    mat: subject_code,
    datos_nivel: level_code,
    datos_periodo: period_code
  });

  const $ = cheerio.load(html);

  const NRCs = $('body > div')
    .map((i, el) =>
      $(el)
        .find('p:nth-child(3)')
        .text()
        .replace(/\t+/g, '\t')
        .split('\t')[2]
        .slice(5)
    )
    .get();

  return getGroupsByNRCs(NRCs);
}

module.exports = {
  LEVELS,
  PERIODS,
  getAllDepartments,
  getAllLevels,
  getAllPeriods,
  getGroupByNRC,
  getGroupsByDepartment,
  getGroupsBySubjectCode
};
