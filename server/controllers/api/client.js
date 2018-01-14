const { Router } = require('express');
const { Client } = require('../../models/client');
const { ensureAuthenticated } = require('../../authentication');

const clientController = Router();
const clientsRoute = clientController.route('/');

/* eslint-disable no-underscore-dangle */
clientsRoute.get(ensureAuthenticated, async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.user._id });
    res.json(clients);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

clientsRoute.post(ensureAuthenticated, async (req, res) => {
  const client = new Client();
  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.userId = req.user._id;
  try {
    await client.save();
    res.json({ message: 'Client added to the locker!', data: client });
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

exports.clientController = clientController;
