const { PROFILE_TYPE_CLIENT } = require('../repositories/constants');

const isClient = (profile) => profile.type === PROFILE_TYPE_CLIENT;

module.exports = {
  isClient,
};
