const express = require('express');
const api = require('./api/apiRoutes');
const moment = require("moment")
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
    res.redirect('/');
    return;
  }
  let user = await User.findByPk(req.session.loggedIn);
  if (!user.emailCode) {
    res.redirect('/dashboard');
    return;
  }
  let context = {
    email: user.email
  }
  res.render('verify', context);
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
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
    let created = new Set()
    const projects = projectData.map((project) => {
      let r = project.get({ plain: true })
      created.add(r.id)
      return r
    });
    const contributorProjects = contributorProjectData.map((project) => project.get({ plain: true })).filter(e => !created.has(e.id));
    let result = projects.concat(contributorProjects)
    result.sort((e, e1) => {
      let t1 = moment(e.createdAt), t2 = moment(e1.createdAt)
      if (t1 > t2) return -1
      if (t1 < t2) return 1
      return 0
    })
    for (let i=0; i < result.length; i++) result[i].number = i + 1

    let context = {
      page: 'Dashboard',
      loggedIn: req.session.loggedIn,
      user: req.session.loggedIn,
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
    const projectData = await Project.findByPk(req.params.id);
    console.log(await projectData.hasAccess(req.session.loggedIn), req.session.loggedIn, projectData.get({plain: true}))
    if (!projectData || !await projectData.hasAccess(req.session.loggedIn)) {
      res.redirect("/dashboard")
      return
    }
    const project = projectData.get({ plain: true });
    const contributorData = await Contributor.findAll({
      where: { projectid: project.id },
    });
    let i = 0
    const contributors = contributorData.map((contributor) => {
      let obj = contributor.get({ plain: true })
      obj.number = i + 1
      i++
      return obj
    });

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
    i = 0
    const bugs = bugData.map((bug) => {
      let obj = bug.get({ plain: true })
      obj.number = i + 1
      i++
      return obj
    });
    const userData = await User.findOne({
      where: { id: req.session.loggedIn },
    });
    const user = userData.get({ plain: true });

    const context = {
      page: `${project.name}'s Bugs`,
      bugs,
      project,
      contributors,
      user,
    };
    res.render('project', context);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/bugs/history/:id', withAuth, async (req, res) => {
  try {
    const bugData = await Bug.findByPk(req.params.id);
    if (!bugData) throw 'Not a valid bug!';
    const bug = bugData.get({ plain: true });
    const projectData = await Project.findByPk(bug.projectid);
    if (!projectData || !await projectData.hasAccess(req.session.loggedIn)) throw "No access"
    const project = projectData.get({ plain: true });

    const bugHistoryData = await History.findAll({
      include: [{ model: Bug }],
      where: { bugid: req.params.id },
    });

    const bugHistory = bugHistoryData.map((bug) => bug.get({ plain: true }));

    let context = {
      page: `${bug.title}'s History`,
      bugList: bugHistory,
      isContributor: true,
      project,
    };
    return res.render('history', context);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
