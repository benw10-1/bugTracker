const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/connection');
const mailer = require('../email/mailer');
const bcrypt = require('bcrypt');
const salt = 10;

class User extends Model {
  checkPassword(pw) {
    return bcrypt.compareSync(pw, this.password);
  }
}
class Contributor extends Model {}
class Project extends Model {}
class Bug extends Model {}

const validate = {
  username: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
  name: /[a-z]/gi,
  password: /^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,}$/,
};

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [2, 100],
        is: validate.name,
      },
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: validate.username,
        },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 60],
        is: validate.password,
      },
    },
    emailCode: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'user',
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, salt);
        return newUserData;
      },
      async afterCreate(newUserData) {
        const id = newUserData.emailCode;
        mailer.verificationEmail(id, newUserData.email);
        return newUserData;
      },
    },
  }
);
Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: validate.name,
      },
    },
    creator: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(5000),
    },
    endpoint: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'project',
  }
);
Contributor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    projectid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'contributor',
  }
);
Bug.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: validate.username,
      },
    },
    contributorid: {
      type: DataTypes.UUID,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    projectid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(5000),
    },
  },
  {
    sequelize,
    modelName: 'bug',
  }
);

User.hasMany(Project, {
  foreignKey: 'creator',
});
Project.hasMany(Contributor, {
  foreignKey: 'projectid',
});
Project.hasMany(Bug, {
  foreignKey: 'projectid',
});
Project.belongsTo(User, {
  foreignKey: 'creator',
});
Bug.belongsTo(Project, {
  foreignKey: 'projectid',
});
Contributor.belongsTo(Project, {
  foreignKey: 'projectid',
});

module.exports = { User, Project, Contributor, Bug };
