'use strict';

module.exports = (sequelize, DataTypes) => {
  const FacebookUser = sequelize.define('FacebookUser', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    token: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate(models) {
        FacebookUser.belongsTo(models.User);
      },
    }
  });

  return FacebookUser;
};
