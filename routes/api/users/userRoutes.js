const express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
const mailer = require('../../../email/mailer');

const { User } = require('../../../models/models');

router.post('/create', async (req, res) => {
  try {
    // if (!req.session.home) throw "Incorrect origin!"
    // TODO: FILTER ALLOWED CHARACTERS
    if (!req.body || !req.body.password) throw 'Data not found!';
    req.body.id = undefined;
    let newUser = await User.create(req.body);
    req.session.loggedIn = newUser.id;
    delete newUser.password;
    res.status(200).json({
      status: 'ok',
      action: 'created account',
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      data: err.fields ?? err,
    });
  }
});
router.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    // if (!req.session.home) throw "Incorrect origin!"
    if (!req.body || !req.body.password || !req.body.user)
      throw {
        error: 'Not present',
        user: req.body && req.body.user,
        password: req.body && req.body.password,
      };

    let foundUser = await User.findOne({
      where: {
        [Op.or]: {
          email: req.body.user,
          username: req.body.user,
        },
      },
    });

    if (!foundUser) throw 'User not found!';
    let correctPass = foundUser.checkPassword(req.body.password);
    if (!correctPass) throw 'Incorrect password!';
    if (foundUser.emailCode != null) throw 'User not verified!';
    req.session.save(() => {
      req.session.loggedIn = foundUser.id;
      res.status(200).json({
        status: 'ok',
        action: 'logged in',
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});
router.post('/logout', async (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else res.status(404).end();
});
router.get('/resendVerification', async (req, res) => {
  try {
    if (!req.session.loggedIn) throw 'Not logged in!';
    let foundUser = await User.findByPk(req.session.loggedIn);
    if (!foundUser) throw 'User not found!';
    if (!foundUser.emailCode) throw 'User verified!';
    mailer.verificationEmail(foundUser.emailCode, foundUser.email);
    res.status(200).json({
      status: 'ok',
      action: 'email verification sent',
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});

module.exports = router;
