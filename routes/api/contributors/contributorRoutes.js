const router = require('express').Router();
const { Contributor } = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newContributor = await Contributor.create({
      //Body should contain projectid
      ...req.body,
      userid: req.session.loggedIn,
    });
    res.status(200).json(newContributor);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const contributorData = await Contributor.destroy({
      where: {
        id: req.params.id,
        projectid: req.params.projectid,
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
