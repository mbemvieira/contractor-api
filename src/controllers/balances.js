const { Job } = require('../models/Job');
const { Contract } = require('../models/Contract');
const { PROFILE_TYPE_CLIENT } = require('../repositories/constants');

const addFunds = async (req, res) => {
  const sequelize = req.app.get('sequelize');
  const { Profile } = req.app.get('models');
  const { userId } = req.params;
  let { value } = req.body;

  value = parseFloat(value);

  if (Number.isNaN(value)) {
    return res.status(422).json({ error: 'invalid parameters' });
  }

  try {
    const responseProfile = await sequelize.transaction(async (t) => {
      const profile = await Profile.findOne(
        {
          where: {
            id: userId,
            type: PROFILE_TYPE_CLIENT,
          },
        },
        {
          transaction: t,
          lock: true,
        }
      );
    
      if (!profile) {
        return res.status(404).json({ error: 'not found' });
      }

      const result = await Job.findOne(
        {
          attributes: [
            [sequelize.fn('SUM', sequelize.col('price')), 'total'],
          ],
          include: {
            model: Contract,
            attributes: [],
            where: {
              ClientId: userId,
            },
          },
        },
        {
          transaction: t,
        }
      );

      const totalDebit = result.dataValues?.total ?? 100;
    
      if (value > ((totalDebit) / 4)) {
        return res.status(422).json({ error: 'value too high' });
      }

      await profile.update(
        {
          balance: profile.balance + value,
        },
        { transaction: t }
      );

      return profile;
    });

    return res.json(responseProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

module.exports = {
  addFunds,
};
