const express = require('express');
var router = express.Router();
const projects = require('./projects/projectRoutes');
const users = require('./users/userRoutes');
const verify = require('./verifyEmail/verify.js');

router;

router.get('/', async (req, res) => {
  res.redirect('/');
});
router.use('/verify', verify);
router.use('/user', users);
router.use('/projects', projects);

module.exports = router;
