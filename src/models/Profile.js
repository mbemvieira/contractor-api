const Sequelize = require('sequelize');
const { PROFILE_TYPE_CLIENT, PROFILE_TYPE_CONTRACTOR } = require('../repositories/constants');

class Profile extends Sequelize.Model {
  static initModel(sequelize) {
    Profile.init(
      {
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        profession: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        balance: {
          type: Sequelize.DECIMAL(12, 2),
        },
        type: {
          type: Sequelize.ENUM(PROFILE_TYPE_CLIENT, PROFILE_TYPE_CONTRACTOR),
        },
      },
      {
        sequelize,
        modelName: 'Profile',
        version: true,
      },
    );
  }
}

module.exports = {
  Profile,
};
