const router = require('express').Router();
const { Contributor, User } = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/create', withAuth, async (req, res) => {
  try {
    const foundUser = await User.findOne({
      where: { username: req.body.name, email: req.body.email },
    });

    if (foundUser == undefined)
      throw {
        error: 'Not present',
      };
    const user = foundUser.get({ plain: true });
    if (user.id == req.session.loggedIn)
      throw {
        error: 'Cannot add self',
      };
    const newContributor = await Contributor.create({
      userid: user.id,
      projectid: req.body.projectid,
      name: req.body.name,
      email: req.body.email,
    });
    res.status(200).json(newContributor);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const contributorData = await Contributor.destroy({
      where: {
        id: req.params.id,
        projectid: req.body.projectid,
      },
    });
    if (!contributorData) {
      res.status(404).json({ message: 'No contributor found with this id!' });
      return;
    }
    res.status(200).json(contributorData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
