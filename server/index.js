const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const { registerRoutes } = require('./routes');

const server = express();

server.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/beer-locker', { useMongoClient: true });

exports.create = (config) => {
  server.set('env', config.env);
  server.set('port', config.port);
  server.set('hostname', config.hostname);

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({
    extended: true,
  }));
  server.use(passport.initialize());
  server.use(session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true,
  }));

  server.engine('hbs', expressHandlebars({
    defaultLayout: 'default',
    layoutsDir: `${config.viewDir}/layouts`,
    extname: '.hbs',
  }));
  server.set('views', config.viewDir);
  server.set('view engine', 'pug');

  registerRoutes(server);
};

exports.start = () => {
  const hostname = server.get('hostname');
  const port = server.get('port');

  server.listen(port, () => {
    console.log(`Express server listening on - http://${hostname}:${port}`);
  });
};
