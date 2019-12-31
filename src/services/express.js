const app = require('express')();
const { UI } = require('bull-board');

app.use('/queues', UI);

module.exports = app;
