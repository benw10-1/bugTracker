const express = require('express');
const api = require('./api/apiRoutes');
const moment = require("moment")
var router = express.Router();
const withAuth = require('../utils/auth');
const { Project, User, Contributor, Bug } = require('../models/models');

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
    if (req.session.loggedIn) {
      res.redirect('/dashboard');
      return;
    }
    res.render('login');
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});
router.get('/verifyEmail', async (req, res) => {
  if (!req.session.loggedIn) {
    console.log('no login');
    res.redirect('/');
    return;
  }
  let user = await User.findByPk(req.session.loggedIn);
  if (!user.emailCode) {
    res.redirect('/dashboard');
    return;
  }
  res.render('verify');
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // let projectCount = 1;
    const finalProjects = [];
    if (!req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    req.session.home = false;
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'id'],
        },
      ],
      where: { creator: req.session.loggedIn },
    });

    const contributorProjectData = await Project.findAll({
      include: [
        {
          model: Contributor,
          attributes: ['name', 'userid'],
          where: { userid: req.session.loggedIn },
        },
      ],
    });

    const projects = projectData.map((project) => project.get({ plain: true }));
    const contributorProjects = contributorProjectData.map((project) =>
      project.get({ plain: true })
    );
    let result = projects.concat(contributorProjects)
    result.sort((e, e1) => moment(e.createdAt).valueOf() > moment(e1.createdAt).valueOf())
    for (let i=0; i < result.length; i++) result[i].number = i + 1
    // for (let eachProject of projects) {
    //   eachProject.number = projectCount;
    //   projectCount++;
    //   finalProjects.push(eachProject);
    // }

    // for (let eachProject of contributorProjects) {
    //   eachProject.number = projectCount;
    //   projectCount++;
    //   finalProjects.push(eachProject);
    // }
    const userData = await User.findOne({
      where: { id: req.session.loggedIn },
    });
    const user = userData.get({ plain: true });

    if (user.emailCode != null) {
      res.render('home');
      return;
    }
    let context = {
      page: 'Dashboard',
      loggedIn: req.session.loggedIn,
      user,
      finalProjects: result,
    };
    res.render('dashboard', context);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/projects/:id', withAuth, async (req, res) => {
  try {
    let isContributor = false;
    const projectData = await Project.findByPk(req.params.id);
    if (!projectData) {
      res.redirect("/dashboard")
      return
    }
    const project = projectData.get({ plain: true });
    const contributorData = await Contributor.findAll({
      where: { projectid: project.id },
    });
    const contributors = contributorData.map((contributor) =>
      contributor.get({ plain: true })
    );

    const bugData = await Bug.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      where: {
        projectid: req.params.id,
      },
    });
    const bugs = bugData.map((bug) => bug.get({ plain: true }));
    const userData = await User.findOne({
      where: { id: req.session.loggedIn },
    });
    const user = userData.get({ plain: true });

    for (let eachContributor of contributors) {
      if (eachContributor.userid == user.id) isContributor = true;
    }

    if (user.id == project.creator) {
      isContributor = true;
    }

    if (user.emailCode != null) {
      res.render('home');
      return;
    }
    const context = {
      page: `${project.name} Bugs`,
      bugs,
      project,
      contributors,
      user,
      isContributor,
    };
    res.render('project', context);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/projects/:id/submitBug', withAuth, async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id);
    if (projectData.endpoint) {
      res.render('bugform');
    } else throw 'Error';
  } catch (err) {
    res.redirect('/');
  }
});

module.exports = router;
