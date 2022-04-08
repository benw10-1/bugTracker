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
class Project extends Model {
  async hasAccess(user_id) {
    if (this.owner === user_id) return true;
    const contributors = await Contributor.findAll({
      where: {
        projectid: this.id,
        userid: user_id,
      },
    });
    return contributors && contributors.length >= 1;
  }
}
class Bug extends Model {}

class History extends Model {}
// requires at least one uppercase letter, one number, one special character, one lowercase letter, and a length of at least 8.
const validate = {
  username: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
  name: /[a-z]/gi,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'contributor',
  }
);
Bug.init(
  {
    username: {
      type: DataTypes.STRING,
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contributorid: {
      type: DataTypes.UUID,
    },
    isHistory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    date_created: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'bug',
  }
);

History.init(
  {
    username: {
      type: DataTypes.STRING,
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contributorid: {
      type: DataTypes.UUID,
    },
    bugid: {
      type: DataTypes.UUID,
    },
    isHistory: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    date_created: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'history',
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
User.hasMany(Bug, {
  foreignKey: 'contributorid',
});
Bug.belongsTo(User, {
  foreignKey: 'contributorid',
});
Contributor.belongsTo(Project, {
  foreignKey: 'projectid',
});
Bug.hasMany(History, {
  foreignKey: 'bugid',
});
History.belongsTo(Bug, {
  foreignKey: 'bugid',
});

module.exports = { User, Project, Contributor, Bug, History };
