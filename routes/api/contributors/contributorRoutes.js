const router = require('express').Router();
const { Contributor } = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/create', withAuth, async (req, res) => {
  try {
    if (!req.body) throw {
      error: "Not present",
      user: (req.body && req.body.user),
      password: (req.body && req.body.password)
    }
    const newContributor = await Contributor.create(req.body);
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
