const { isClient } = require('../services/profile');

const isClientProfile = async (req, res, next) => {
  if (!isClient(req.profile)) {
    return res.status(401).end();
  }

  return next();
};

module.exports = {
  isClientProfile,
};
