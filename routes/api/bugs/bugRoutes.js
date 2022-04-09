const router = require('express').Router();
const {
  Bug,
  Project,
  User,
  Contributor,
  History,
} = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    let isContributor = false;
    const foundUser = await User.findOne({
      where: { id: req.session.loggedIn },
    });

    if (foundUser == undefined)
      throw {
        error: 'Not present',
      };
    const user = foundUser.get({ plain: true });

    const projectData = await Project.findByPk(req.body.projectid);

    const project = projectData.get({ plain: true });

    const contributorData = await Contributor.findAll({
      where: { projectid: project.id },
    });

    const contributors = contributorData.map((contributor) =>
      contributor.get({ plain: true })
    );

    if (user.id == project.creator) isContributor = true;

    for (let eachContributor of contributors) {
      if (eachContributor.userid == user.id) {
        isContributor = true;
      }
    }
    if (isContributor) {
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
    } else {
      throw {
        error: 'Not a contributor',
      };
    }
  } catch (err) {
    res.status(400).json(err);
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
    res.status(500).json(err);
  }
});
router.put('/:id', withAuth, async (req, res) => {
  try {
    let isContributor = false;
    const foundUser = await User.findOne({
      where: { id: req.session.loggedIn },
    });

    if (foundUser == undefined)
      throw {
        error: 'Not present',
      };
    const user = foundUser.get({ plain: true });
    console.log('>>>>>>PROJECTID', req.body.projectid);
    const projectData = await Project.findByPk(req.body.projectid);
    const project = projectData.get({ plain: true });

    const contributorData = await Contributor.findAll({
      where: { projectid: project.id },
    });
    console.log(contributorData);
    const contributors = contributorData.map((contributor) =>
      contributor.get({ plain: true })
    );

    if (user.id == project.creator) isContributor = true;

    for (let eachContributor of contributors) {
      if (eachContributor.userid == user.id) {
        isContributor = true;
      }
    }
    if (isContributor) {
      console.log('>>>>>>>USERNAME', user.username);
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
      if (!bugData) {
        res.status(404).json({ message: 'No bug found with this id!' });
        return;
      }
      res.status(200).json(bugData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/:id', withAuth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw 'Not a valid project!';
    if (!project.endpoint && !project.hasAccess(req.session.loggedIn))
      throw 'Not a contributor for this project!';
    return res.render('submitbug');
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/:id', withAuth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw 'Not a valid project!';
    if (!project.endpoint && !project.hasAccess(req.session.loggedIn))
      throw 'Not a contributor for this project!';
    if (!req.session.loggedIn && !body.email) throw 'No email';
    else if (req.session.loggedIn)
      req.body.contributorid = req.session.loggedIn;
    const newBug = await Bug.create(...req.body);
    res.status(200).json(newBug);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
