const config = require('./src/config');
const app = require('./src/app');

const { port } = config.server;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}`),
);
