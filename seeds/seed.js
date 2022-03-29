const sequelize = require('../config/connection');
const { User, Project, Contributor, Bug } = require('../models/models');

const userData = require('./userData.json');
const projectData = require('./projectData.json');
const bugData = require('./bugData.json');
const contributorData = require('./contributorData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  let count = 1;
  for (const project of projectData) {
    await Project.create({
      ...project,
      creator: users[Math.floor(Math.random() * users.length)].id,
    });

    for (const bug of bugData) {
      await Bug.create({
        ...bug,
        userid: users[Math.floor(Math.random() * users.length)].id,
        projectid: count,
      });
    }
    count++;
  }

  process.exit(0);
};

seedDatabase();
