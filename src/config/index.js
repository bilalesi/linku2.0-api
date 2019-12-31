module.exports = {
  server: {
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
    secret: process.env.SECRET
  },

  database: {
    url: process.env.DATABASE_URL
  },

  scraper: {
    baseURL: "https://guayacan.uninorte.edu.co/4PL1CACI0N35/registro"
  },

  actualPeriod: process.env.ACTUAL_PERIOD || "202010"
};
