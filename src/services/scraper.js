const cheerio = require("cheerio");
const httpService = require("./http");

/** @typedef {{ name: String, code: String }} Department */
/** @typedef {{ name: String, code: String }} Period */
/** @typedef {{ name: String, code: "PR" | "PG" | "EC" | "EX" }} Level */
/** @typedef {{ name: String, departmentName: String, code: String, number: String }} Subject */
/** @typedef {{ name: String, lastname: String }} Professor */
/** @typedef {{ startDate: String, endDate: String, day: 'M' | 'T' | 'W' | 'R' | 'F' | 'S', time: { start: String, end: String }, place: String }} Schedule */
/** @typedef {{ subject: Subject, professors: Professor[], schedule: Schedule[], quota: { taken: Number, free: Number } }} Group */

/** @type {Period[]} */
const PERIODS = [
  {
    code: "202010",
    name: "Primer Semestre 2020"
  }
];

/** @type {Level[]} */
const LEVELS = [
  { code: "PR", name: "Pregrado" },
  { code: "PG", name: "Postgrado" },
  { code: "EC", name: "Educación Continua" },
  { code: "EX", name: "Extracurricular" }
];

/**
 * Get all the departments.
 *
 * @returns {Promise<Department[]>}
 */
async function getAllDepartments() {
  const html = await httpService.consultaHorarios();
  const $ = cheerio.load(html);

  return $("#departamento > option")
    .slice(1)
    .map((i, el) => {
      el = $(el);

      return {
        code: el.val(),
        name: el.text()
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

  return $("#nivel > option")
    .slice(1)
    .map((i, el) => {
      el = $(el);

      return {
        code: el.val(),
        name: el.text()
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

  return $("#periodo > option")
    .slice(1)
    .map((i, el) => {
      el = $(el);

      return {
        code: el.val(),
        name: el.text()
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

  const [subjectInfo, professors, [taken, free]] = await Promise.all([
    $("body > div > p:nth-child(3)")
      .text()
      .split("\t\t"),

    $("body > div > p.msg5")
      .html()
      .match(/>([^<>]|^>)*</gm)
      .slice(1)
      .map(elem => {
        name = elem.replace(/>\s*|\s*</g, "").split(",");

        return {
          firstname: name[1].trim(),
          lastname: name[0].trim()
        };
      }),

    $("body > div > p:nth-child(4)")
      .text()
      .match(/[0-9]+/g)
      .map(Number)
  ]);

  const subject = {
    name: $("body > div > p.msg1").text(),
    departmentName: ($("body > div > p:nth-child(2)").text() || "")
      .replace("Departamento:", "")
      .trim(),
    code: subjectInfo[0]
      .split(":")[1]
      .substring(0, 4)
      .trim(),
    number: subjectInfo[0]
      .split(":")[1]
      .substring(4)
      .trim()
  };

  const schedule = $(
    "#acreditaciones_resultado > div > div > table > tbody > tr"
  )
    .slice(1)
    .map((i, el) => {
      el = $(el);

      const [, startDate, endDate, day, time, place] = el
        .text()
        .replace(/\t+/g, "")
        .split("\n");

      const [start, end] = time.split(" - ");

      return {
        startDate,
        endDate,
        day,
        time: {
          start,
          end
        },
        place
      };
    })
    .get();

  return {
    group: subjectInfo[1].split(":")[1].trim(),
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
 * Get all the groups by Department.
 * @param {String} department_code
 * @param {String} period_code
 * @param {String} level_code
 *
 * @returns {Promise<{ name: String, nrc: String }[]>}
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

  return $("#programa > option")
    .map((i, el) => {
      el = $(el);

      return {
        name: el
          .text()
          .replace(/ - */g, " ")
          .trim(),
        nrc: el.val()
      };
    })
    .get();
}

module.exports = {
  getAllDepartments,
  getAllLevels,
  getAllPeriods,
  getGroupByNRC,
  getGroupsByDepartment
};
