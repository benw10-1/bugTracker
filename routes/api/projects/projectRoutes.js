const router = require('express').Router();
const { Project, Contributor, Bug } = require('../../../models/models'); 
const withAuth = require('../../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    req.body.id = undefined
    const newProject = await Project.create({
      ...req.body,
      creator: req.session.loggedIn,
    });

    res.status(200).json(newProject);
  } catch (err) {
    if (err.sql) err = err.errors.map(e => e.message)
    else err = [err]
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});

router.get('/:id/contributors', withAuth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw 'Not a valid project!';
    if (!await project.hasAccess(req.session.loggedIn)) throw "Not a contributor for this project!"
    const contributors = Contributor.findAll({
      where: {
        projectid: project.id,
      },
    });
    
    res.status(200).json(contributors);
  } catch (err) {
    if (err.sql) err = err.errors.map(e => e.message)
    else err = [err]
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});
router.get('/:id/bugs', withAuth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw 'Not a valid project!';
    if (!await project.hasAccess(req.session.loggedIn)) throw "Not a contributor for this project!"
    const bugs = Bug.findAll({
      where: {
        projectid: project.id,
      },
    });
    res.status(200).json(bugs);
  } catch (err) {
    if (err.sql) err = err.errors.map(e => e.message)
    else err = [err]
    res.status(400).json({
      status: 'error',
      data: err,
    });
  }
});
router.get('/:id', withAuth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw 'Not a valid project!';
    if (!await project.hasAccess(req.session.loggedIn)) throw "Not a contributor for this project!"

    res.status(200).json(project);
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
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        creator: req.session.loggedIn,
      },
    });

    if (!projectData) throw 'No project found with this id!'

    res.status(200).json(projectData);
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
