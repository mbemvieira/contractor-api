const { Op } = require('sequelize');
const { PROFILE_TYPE_CLIENT, CONTRACT_STATUS_IN_PROGRESS } = require('../repositories/constants');

const getUnpaid = async (req, res) => {
  const { Contract, Job } = req.app.get('models');
  const profileType = req.profile.type === PROFILE_TYPE_CLIENT ? 'ClientId' : 'ContractorId';

  const results = await Job.findAll({
    include: {
      model: Contract,
      where: {
        [profileType]: req.profile.id,
        status: CONTRACT_STATUS_IN_PROGRESS,
      },
    },
    where: {
      paid: {
        [Op.not]: true,
      },
    },
  });

  return res.json(results);
};

const pay = async (req, res) => {
  const sequelize = req.app.get('sequelize');
  const { Contract, Job, Profile } = req.app.get('models');
  const { id } = req.params;
  const { profile } = req;

  try {
    const responseJob = await sequelize.transaction(async (t) => {
      const job = await Job.findOne({
        include: {
          model: Contract,
          include: {
            model: Profile,
            as: 'Contractor',
          },
          where: {
            ClientId: req.profile.id,
            status: CONTRACT_STATUS_IN_PROGRESS,
          },
        },
        where: {
          id,
        },
      }, {
        transaction: t,
        lock: true,
      });

      if (!job) {
        return res.status(404).end();
      }

      if (job.paid) {
        return res.status(422).end();
      }

      if (req.profile.balance < job.price) {
        return res.status(422).send('insuficient funds').end();
      }

      await profile.update({ balance: profile.balance - job.price }, { transaction: t });

      await job.Contract.Contractor.update({
        balance: job.Contract.Contractor.balance + job.price,
      }, { transaction: t });

      await job.update({
        paid: true,
        paymentDate: (new Date()).toISOString(),
      }, { transaction: t });

      return job;
    });

    return res.json(responseJob);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

module.exports = {
  getUnpaid,
  pay,
};
