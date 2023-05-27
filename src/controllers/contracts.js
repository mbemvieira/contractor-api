const { Op } = require('sequelize');
const { PROFILE_TYPE_CLIENT, CONTRACT_STATUS_NEW, CONTRACT_STATUS_IN_PROGRESS } = require('../repositories/constants');

const get = async (req, res) => {
  const { Contract } = req.app.get('models');
  const profileType = req.profile.type === PROFILE_TYPE_CLIENT ? 'ClientId' : 'ContractorId';

  const contracts = await Contract.findAll({
    where: {
      [profileType]: req.profile.id,
      status: {
        [Op.in]: [CONTRACT_STATUS_NEW, CONTRACT_STATUS_IN_PROGRESS],
      },
    },
  });

  return res.json(contracts);
};

const getById = async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const profileType = req.profile.type === PROFILE_TYPE_CLIENT ? 'ClientId' : 'ContractorId';

  const contract = await Contract.findOne({
    where: {
      id,
      [profileType]: req.profile.id,
    },
  });

  if (!contract) {
    return res.status(404).end();
  }

  return res.json(contract);
};

module.exports = {
  get,
  getById,
};
