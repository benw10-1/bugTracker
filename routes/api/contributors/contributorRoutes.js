const router = require('express').Router();
const { Contributor, User } = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/create', withAuth, async (req, res) => {
  try {
    const foundUser = await User.findOne({
      where: { username: req.body.name, email: req.body.email },
    });

    if (foundUser == undefined)
      throw 'User not found!';
    const user = foundUser.get({ plain: true });
    if (user.id == req.session.loggedIn)
      throw "Can't add yourself!";
    const newContributor = await Contributor.create({
      userid: user.id,
      projectid: req.body.projectid,
      name: req.body.name,
      email: req.body.email,
    });
    res.status(200).json(newContributor);
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
    const contributorData = await Contributor.destroy({
      where: {
        id: req.params.id,
        projectid: req.body.projectid,
      },
    });
    if (!contributorData) throw 'No contributor found with this id!'
    res.status(200).json(contributorData);
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
