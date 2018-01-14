const { apiRouter } = require('./api');
const { homeRouter } = require('./home');

function registerRoutes(server) {
  server.get('*', (req, res, next) => {
    console.log(`Request was made to: ${req.originalUrl}`);
    return next();
  });

  server.use('/', homeRouter);
  server.use('/api', apiRouter);
}

exports.registerRoutes = registerRoutes;
