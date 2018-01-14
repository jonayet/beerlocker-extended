const { Router } = require('express');
const { User } = require('../../models/user');
const { ensureAuthenticated } = require('../../authentication');

const userController = Router();
const usersRoute = userController.route('/');
const userRoute = userController.route('/:id');

usersRoute.get(ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

usersRoute.post(async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  try {
    await user.save();
    res.json({ message: 'New beer drinker added to the locker room!' });
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

userRoute.delete(ensureAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.json({ message: `User(${req.params.id}) removed` });
  } catch (err) {
    console.log(err);
    res.json({ message: 'Error occured' });
  }
});

exports.userController = userController;
