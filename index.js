const { config } = require('./server/config');
const { create, start } = require('./server');

create(config);
start();
