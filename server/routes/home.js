const { Router } = require('express');
const { homeController } = require('../controllers/home');

const homeRouter = Router();

homeRouter.use('/', homeController);

exports.homeRouter = homeRouter;
