const { User } = require('../models/models');

const withAuth = async (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    // let user = await User.findByPk(req.session.loggedIn);
    // if (user.emailCode) res.redirect('/verifyEmail');
    next();
  }
};

module.exports = withAuth;
