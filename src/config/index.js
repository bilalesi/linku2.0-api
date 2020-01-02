module.exports = {
  server: {
    origin: process.env.ORIGIN,
    port: process.env.PORT,
    secret: process.env.SECRET,
    pagination: {
      limit: 15,
      defaultPage: 1,
    }
  },

  database: {
    url: process.env.DATABASE_URL
  },

  redis: {
    url: process.env.REDIS_URL
  },

  scraper: {
    baseURL: process.env.SCRAPER_BASE_URL
  },

  actualPeriod: process.env.ACTUAL_PERIOD
};
