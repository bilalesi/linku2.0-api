require('./src/initialize');
const server = require('./src/server');
const express = require('./src/services/express');

server
  .listen({
    port: process.env.PORT || 4000
  })
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });

express.listen(4004, () =>
  console.log('Express App running at http://localhost:4004')
);
