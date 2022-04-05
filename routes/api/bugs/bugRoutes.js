const router = require('express').Router();
const { Bug, Project } = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    req.body.id = undefined
    const newBug = await Bug.create({
      ...req.body,
      user_id: req.session.loggedIn,
    });
    res.status(200).json(newBug);
  } catch (err) {
    res.status(400).json(err);
  }
});
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const bugData = await Bug.destroy({
      where: {
        id: req.params.id,
        contributorid: req.session.loggedIn,
      },
    });
    if (!bugData) {
      res.status(404).json({ message: 'No bug found with this id!' });
      return;
    }
    res.status(200).json(bugData);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put('/:id', withAuth, async (req, res) => {
  try {
    const bugData = await Bug.update(
      {
        description: req.body.description,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.loggedIn,
        },
      }
    );
    if (!bugData) {
      res.status(404).json({ message: 'No bug found with this id!' });
      return;
    }
    res.status(200).json(bugData);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/:id", withAuth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw 'Not a valid project!';
    if (!project.endpoint && !project.hasAccess(req.session.loggedIn)) throw "Not a contributor for this project!"
    return res.render("submitbug")
  } catch (err) {
    res.status(400).json(err);
  }
})
router.post("/:id", withAuth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw 'Not a valid project!';
    if (!project.endpoint && !project.hasAccess(req.session.loggedIn)) throw "Not a contributor for this project!"
    if (!req.session.loggedIn && !body.email) throw "No email"
    else if (req.session.loggedIn) req.body.contributorid = req.session.loggedIn
    const newBug = await Bug.create(...req.body)
    res.status(200).json(newBug);
  } catch (err) {
    res.status(400).json(err);
  }
})

module.exports = router;
