const Sequelize = require('sequelize');
const { CONTRACT_STATUS_NEW, CONTRACT_STATUS_IN_PROGRESS, CONTRACT_STATUS_TERMINATED } = require('../repositories/constants');

class Contract extends Sequelize.Model {
  static initModel(sequelize) {
    Contract.init(
      {
        terms: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM(
            CONTRACT_STATUS_NEW,
            CONTRACT_STATUS_IN_PROGRESS,
            CONTRACT_STATUS_TERMINATED,
          ),
        },
      },
      {
        sequelize,
        modelName: 'Contract',
      },
    );
  }
}

module.exports = {
  Contract,
};
