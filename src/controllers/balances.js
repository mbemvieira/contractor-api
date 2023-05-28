const { PROFILE_TYPE_CLIENT } = require('../repositories/constants');
const { getTotalDebit } = require('../repositories/profile');

const addFunds = async (req, res) => {
  const sequelize = req.app.get('sequelize');
  const { Profile } = req.app.get('models');
  const { userId } = req.params;
  let { value } = req.body;

  console.log(req.body);

  value = parseFloat(value);

  if (Number.isNaN(value)) {
    return res.status(422).json({ error: 'invalid parameters' });
  }

  const profile = await Profile.findOne({
    where: {
      id: userId,
      type: PROFILE_TYPE_CLIENT,
    },
  });

  if (!profile) {
    return res.status(404).json({ error: 'not found' });
  }

  const totalDebit = await getTotalDebit(sequelize, userId);

  if (value > (totalDebit / 4)) {
    return res.status(422).json({ error: 'value too high' });
  }

  profile.balance += value;

  profile.save();

  return res.json(profile);
};

module.exports = {
  addFunds,
};
