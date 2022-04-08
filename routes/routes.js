const express = require('express');
const api = require('./api/apiRoutes');
var router = express.Router();
const withAuth = require('../utils/auth');
const {
  Project,
  User,
  Contributor,
  Bug,
  History,
} = require('../models/models');

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
      res.redirect('/');
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
    let projectCount = 1;
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
    for (let eachProject of projects) {
      eachProject.number = projectCount;
      projectCount++;
      finalProjects.push(eachProject);
    }

    for (let eachProject of contributorProjects) {
      eachProject.number = projectCount;
      projectCount++;
      finalProjects.push(eachProject);
    }
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
      finalProjects,
    };
    res.render('dashboard', context);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/projects/:id', withAuth, async (req, res) => {
  try {
    let isContributor = false;
    const projectData = await Project.findByPk(req.params.id);

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
        isHistory: false,
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
    let context = {
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

router.get('/bugs/history/:id', withAuth, async (req, res) => {
  try {
    const bugList = [];
    const bugData = await Bug.findByPk(req.params.id);
    if (!bugData) throw 'Not a valid bug!';
    const bug = bugData.get({ plain: true });
    let isContributor = false;
    const projectData = await Project.findByPk(bug.projectid);

    const project = projectData.get({ plain: true });

    const contributorData = await Contributor.findAll({
      where: { projectid: project.id },
    });
    const contributors = contributorData.map((contributor) =>
      contributor.get({ plain: true })
    );

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
    const bugHistoryData = await History.findAll({
      include: [{ model: Bug }],
      where: { bugid: req.params.id },
    });

    const bugHistory = bugHistoryData.map((bug) => bug.get({ plain: true }));

    for (let eachBug of bugHistory) {
      bugList.push(eachBug);
    }

    let context = {
      page: `${bug.title} History`,
      bugList,
      isContributor,
      project,
    };
    return res.render('history', context);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
