const { Router } = require('express');
const { v1Router } = require('./v1');

const apiRouter = Router();

apiRouter.use('/v1', v1Router);

exports.apiRouter = apiRouter;
