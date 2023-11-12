const { QueryTypes } = require('sequelize');

const getTotalDebit = async (sequelize, clientId) => {
  const results = await sequelize.query(
    'SELECT SUM(`j`.`price`) as total'
      + ' FROM `Jobs` as `j`'
      + ' JOIN `Contracts` as `c` ON `c`.`id` = `j`.`ContractId`'
      + ` WHERE \`c\`.\`ClientId\` = ${clientId}`,
    { type: QueryTypes.SELECT },
  );

  return results[0].total;
};

module.exports = {
  getTotalDebit,
};
