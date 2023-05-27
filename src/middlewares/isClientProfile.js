const isClientProfile = async (req, res, next) => {
  if (req.profile.type !== 'client') {
    return res.status(401).end();
  }

  return next();
};

module.exports = {
  isClientProfile,
};
