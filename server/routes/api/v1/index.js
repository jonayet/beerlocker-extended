const { Router } = require('express');
const { beerController } = require('../../../controllers/api/beer');
const { userController } = require('../../../controllers/api/user');
const { clientController } = require('../../../controllers/api/client');
const { oauth2Controller } = require('../../../controllers/api/oauth2');

const v1Router = Router();

v1Router.use('/beers', beerController);
v1Router.use('/users', userController);
v1Router.use('/clients', clientController);
v1Router.use('/oauth2', oauth2Controller);

exports.v1Router = v1Router;
