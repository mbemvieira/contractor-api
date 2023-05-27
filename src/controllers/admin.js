const getBestProfession = async (req, res) => res.json(req.params);

const getBestClients = async (req, res) => res.json(req.params);

module.exports = {
  getBestProfession,
  getBestClients,
};
