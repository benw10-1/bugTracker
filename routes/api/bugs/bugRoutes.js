const router = require('express').Router();
const { Bug, Project, User, Contributor } = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const foundUser = await User.findByPk(req.session.loggedIn);
    if (!foundUser) throw 'Not present'
    const projectData = await Project.findByPk(req.body.projectid);

    if (!projectData.hasAccess(req.session.loggedIn)) throw "No access!"

    const newBug = await Bug.create({
        title: req.body.title,
        description: req.body.description,
        contributorid: req.session.loggedIn,
        projectid: req.body.projectid,
        status: req.body.status,
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
    const bugData = await Bug.destroy({
      where: {
        id: req.params.id,
        projectid: req.body.projectid,
      },
    });
    if (!bugData) {
      res.status(404).json({ message: 'No bug found with this id!' });
      return;
    }
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
    const bugData = await Bug.update(
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
      },
      {
        where: {
          id: req.params.id,
          contributorid: req.session.loggedIn,
        },
      }
    );
    if (!bugData) throw "No bug found!"
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

module.exports = router;