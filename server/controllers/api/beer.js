const { Router } = require('express');
const { Beer } = require('../../models/beer');
const { ensureAuthenticated } = require('../../authentication');

const beerController = Router();
const beersRoute = beerController.route('/');
const beerRoute = beerController.route('/:id');

/* eslint-disable no-underscore-dangle */
beersRoute.get(ensureAuthenticated, async (req, res) => {
  try {
    const beers = await Beer.find({ userId: req.user._id });
    res.json(beers);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

beersRoute.post(ensureAuthenticated, async (req, res) => {
  const beer = new Beer();
  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;
  beer.userId = req.user._id;
  try {
    const result = await beer.save();
    res.json({ message: 'Beer added to the locker!', data: result });
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

beerRoute.get(ensureAuthenticated, async (req, res) => {
  try {
    const beer = await Beer.find({ _id: req.params.id, userId: req.user._id });
    res.json(beer);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

beerRoute.put(ensureAuthenticated, async (req, res) => {
  try {
    let beer = await Beer.find({ _id: req.params.id, userId: req.user._id });
    beer.quantity = req.body.quantity;
    beer = await beer.save();
    res.json(beer);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

beerRoute.delete(ensureAuthenticated, async (req, res) => {
  try {
    await Beer.remove({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Beer removed from the locker!' });
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

exports.beerController = beerController;
