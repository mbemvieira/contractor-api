const { Op } = require('sequelize');
const { PROFILE_TYPE_CLIENT, PROFILE_TYPE_CONTRACTOR } = require('../repositories/constants');

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;
  const sequelize = req.app.get('sequelize');
  const { Profile, Contract, Job } = req.app.get('models');

  if (!start || !end) {
    return res.status(422).end();
  }

  const result = await Profile.findOne({
    attributes: [
      'profession',
      [sequelize.fn('SUM', sequelize.col('price')), 'totalEarned'],
    ],
    include: {
      model: Contract,
      as: 'Contractor',
      attributes: [],
      include: {
        model: Job,
        attributes: [],
        where: {
          paid: true,
          paymentDate: {
            [Op.gte]: start,
            [Op.lt]: end,
          },
        },
      },
    },
    where: {
      type: PROFILE_TYPE_CONTRACTOR,
    },
    order: [
      ['totalEarned', 'DESC'],
    ],
    group: 'profession',
    subQuery: false,
  });

  return res.json(result);
};

const getBestClients = async (req, res) => {
  const { start, end } = req.query;
  let { limit = 2 } = req.query;
  const sequelize = req.app.get('sequelize');
  const { Profile, Contract, Job } = req.app.get('models');

  limit = parseInt(limit, 10);

  if (!start || !end || Number.isNaN(limit) || limit < 1) {
    return res.status(422).end();
  }

  const result = await Profile.findAll({
    attributes: {
      include: [
        [sequelize.fn('SUM', sequelize.col('price')), 'totalSpent'],
      ],
    },
    include: {
      model: Contract,
      as: 'Client',
      required: true,
      attributes: [],
      include: {
        model: Job,
        required: true,
        attributes: [],
        where: {
          paid: true,
          paymentDate: {
            [Op.gte]: start,
            [Op.lt]: end,
          },
        },
      },
    },
    where: {
      type: PROFILE_TYPE_CLIENT,
    },
    order: [
      ['totalSpent', 'DESC'],
    ],
    group: 'Profile.id',
    limit,
    subQuery: false,
  });

  return res.json(result);
};

module.exports = {
  getBestProfession,
  getBestClients,
};
