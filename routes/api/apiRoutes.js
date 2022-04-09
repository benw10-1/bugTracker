const express = require('express');
var router = express.Router();
const projects = require('./projects/projectRoutes');
const users = require('./users/userRoutes');
const verify = require('./verifyEmail/verify.js');
const bugs = require('./bugs/bugRoutes');
const contributors = require('./contributors/contributorRoutes');

router.get('/', async (req, res) => {
  res.redirect('/');
});
router.use('/bugs', bugs);
router.use('/verify', verify);
router.use('/user', users);
router.use('/projects', projects);
router.use('/contributors', contributors);

module.exports = router;
