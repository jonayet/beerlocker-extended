const { Router } = require('express');

const homeController = Router();
const indexRoute = homeController.route('/');
const aboutRoute = homeController.route('/about');
const dialogRoute = homeController.route('/dialog');

indexRoute.get((req, res) => {
  res.render('home/index', {
    title: 'Home',
  });
});

aboutRoute.get((req, res) => {
  res.render('home/about', {
    title: 'About us',
  });
});

dialogRoute.get((req, res) => {
  res.render('oauth2/dialog', {
    title: 'OAuth Dialog',
    user: {
      username: 'Jona',
    },
    client: {
      name: 'etv',
    },
  });
});

exports.homeController = homeController;
