//TODO: Get bugs related
const router = require('express').Router();
const { Bug } = require('../../../models/models');
const withAuth = require('../../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
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

module.exports = router;
