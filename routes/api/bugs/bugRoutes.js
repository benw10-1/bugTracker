const router = require('express').Router();
const {
  Bug,
  Project,
  User,
  History,
} = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const foundUser = await User.findOne({
      where: { id: req.session.loggedIn },
    });
    const user = foundUser.get({ plain: true });

    const projectData = await Project.findByPk(req.body.projectid);
    if (!await projectData.hasAccess(req.session.loggedIn)) throw "No access to this project"

    const newBug = await Bug.create({
      title: req.body.title,
      description: req.body.description,
      contributorid: req.session.loggedIn,
      projectid: req.body.projectid,
      status: req.body.status,
      username: user.username,
    });
    await History.create({
      title: req.body.title,
      description: req.body.description,
      contributorid: req.session.loggedIn,
      projectid: req.body.projectid,
      bugid: newBug.id,
      status: req.body.status,
      username: user.username,
    });
    res.status(200).json(newBug);
  } catch (err) {
    if (err.sql) err = err.errors.map(e => e.message)
    else err = [err]
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const proj = await Project.findByPk(req.body.projectid)
    if (!proj || !await proj.hasAccess(req.session.loggedIn)) throw "No access!"
    const bugData = await Bug.destroy({
      where: {
        id: req.params.id,
        projectid: req.body.projectid,
      },
    });
    if (!bugData) throw "No bug found with this id"
    res.status(200).json(bugData);
  } catch (err) {
    if (err.sql) err = err.errors.map(e => e.message)
    else err = [err]
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});
router.put('/:id', withAuth, async (req, res) => {
  try {
    const user = User.findByPk(req.session.loggedIn)
    const projectData = await Project.findByPk(req.body.projectid);
    if (!projectData || !await projectData.hasAccess(req.session.loggedIn) || !user) throw "No access!"
    const bugData = await Bug.update(
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        contributorid: req.session.loggedIn,
        username: user.username,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    await History.create({
      title: req.body.title,
      description: req.body.description,
      contributorid: req.session.loggedIn,
      projectid: req.body.projectid,
      bugid: req.params.id,
      status: req.body.status,
      username: user.username,
    });
    if (!bugData) throw "Incorrect bug ID"
    res.status(200).json(bugData);
  } catch (err) {
    if (err.sql) err = err.errors.map(e => e.message)
    else err = [err]
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});

router.post('/:id', withAuth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw 'Not a valid project!';
    if (!project.endpoint && !await project.hasAccess(req.session.loggedIn)) throw 'Not a contributor for this project!';
    if (!body.email) throw 'No email';
    const newBug = await Bug.create(...req.body);
    res.status(200).json(newBug);
  } catch (err) {
    if (err.sql) err = err.errors.map(e => e.message)
    else err = [err]
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});

module.exports = router;
