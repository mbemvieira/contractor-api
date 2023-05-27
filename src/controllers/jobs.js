const { Op } = require('sequelize');
const { profileTypeClient } = require('../models/constants');

const getUnpaid = async (req, res) => {
  const { Contract, Job } = req.app.get('models');
  const profileType = req.profile.type === profileTypeClient ? 'ClientId' : 'ContractorId';

  const results = await Job.findAll({
    include: {
      model: Contract,
      where: {
        [profileType]: req.profile.id,
        status: 'in_progress',
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
  const { Job } = req.app.get('models');
  const { id } = req.params;

  const job = await Job.findOne({
    where: {
      id,
    },
  });

  if (!job) {
    return res.status(404).end();
  }

  // Pay for a job, a client can only pay if his balance >= the amount to pay.
  //   The amount should be moved from the client's balance to the contractor balance.

  if (req.profile.balance < job.price) {
    return res.status(422).send('insuficient funds').end();
  }

  // subtract from client balance
  // add to contractor balance
  // change contract status?
  // job status -> paid, payment date

  return res.json('');
};

module.exports = {
  getUnpaid,
  pay,
};
