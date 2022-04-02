const express = require('express');
const api = require('./api/apiRoutes');
var router = express.Router();
const { Project, User, Contributor, Bug } = require('../models/models');
const contributorList = [];
router.get('', async (req, res) => {
  if (!req.session) {
    res.render('home', { page: 'Home' });
    return;
  }
  let context = { page: 'Home', loggedIn: req.session.loggedIn };
  if (req.session.loggedIn) res.redirect('/dashboard');
  else res.render('home', context);
});

router.use('/api', api);

router.get('/login', async (req, res) => {
  try {
    res.render('login');
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});
router.get("/verifyEmail", async (req, res) => {
    if (!req.session || !req.session.loggedIn) res.redirect("/")
    let user = await User.findByPk(req.session.loggedIn).get({ plain:true })
    let context = {
        mail: user.email
    }
    res.render("verify", context)
})
router.get('/dashboard', async (req, res) => {
  // TODO: IF NOT LOGGED IN REDIRECT)
  try {
    // if (!req.session.loggedIn) {
    //   res.redirect('/');
    //   return;
    // }
    req.session.home = false;
    // const projectData = await Project.findAll({
    //   include: [
    //     {
    //       model: User,
    //       attributes: ['username'],
    //       where: { id: req.sessions.loggedIn },
    //     },
    //   ],
    // });

    // const projects = projectData.map((project) => project.get({ plain: true }));

    // for (let each of projects) {
    //   const contributorData = await Contributor.findAll({
    //     where: { projectid: each.id },
    //   });
    //   const contributors = contributorData.map((contributor) => {
    //     contributor.get({ plain: true });
    //   });
    //   contributorList.push(contributors);
    // }

    // const userData = await User.findOne({
    //   where: { id: req.session.loggedIn },
    // });

    // const user = userData.get({ plain: true });
    let context = {
      page: 'Dashboard',
      loggedIn: req.session.loggedIn,
      // projects,
      // user,
      // contributorList,
    };
    res.render('dashboard', context);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/bugs', (req, res) => {
  res.render('bugs');
});

module.exports = router;
