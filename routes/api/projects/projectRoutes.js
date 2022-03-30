const router = require('express').Router();
const { Project, Contributor } = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      creator: req.session.user_id,
    });

    res.status(200).json(newProject);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id', withAuth, async (req, res) => {
  try {
    const contributor = await Contributor.findOne({
      where: {
        projectid: req.params.id,
        userid: req.session.loggedIn
      }
    });
    if (!contributor) throw "Not a contributor of this project!"
    const project = await Project.findByPk(req.params.id)
    if (!project) throw "Not a valid project!"

    res.status(200).json(newProject);
  } catch (err) {
    res.status(400).json(err);
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

    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const projectData = await Project.update(
      {
        description: req.body.description,
        name: req.body.name,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.loggedIn,
        },
      }
    );
    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }
    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;