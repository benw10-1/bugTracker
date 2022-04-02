const express = require('express');
var router = express.Router();
const projects = require('./projects/projectRoutes');
const users = require('./users/userRoutes');
const verify = require('./verifyEmail/verify.js');

router;

router.get('/', async (req, res) => {
  res.redirect('/');
});
router.get('/dashboard', async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.json({ HI: 'asd' });
});
router.use('/verify', verify);
router.use('/user', users);
router.use('/projects', projects);

module.exports = router;
