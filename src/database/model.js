const Sequelize = require('sequelize');
const { Profile } = require('../models/Profile');
const { Contract } = require('../models/Contract');
const { Job } = require('../models/Job');

const initModels = () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3',
  });

  Profile.initModel(sequelize);
  Contract.initModel(sequelize);
  Job.initModel(sequelize);

  Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
  Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
  Contract.belongsTo(Profile, { as: 'Contractor' });
  Contract.belongsTo(Profile, { as: 'Client' });
  Contract.hasMany(Job);
  Job.belongsTo(Contract);

  return sequelize;
};

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
const insertMany = async (model, dataset) => {
  await model.sync({ force: true });

  const promises = [];

  for (let i = 0; i < dataset.length; i += 1) {
    promises.push(model.create(dataset[i]));
  }

  return Promise.all(promises);
};

module.exports = {
  initModels,
  insertMany,
};
