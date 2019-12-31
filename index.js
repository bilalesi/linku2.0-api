// require('./src/initialize');

const config = require('./src/config');
const app = require('./src/app');

const { port } = config.server;

/** 
 
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

*/

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}`)
);
