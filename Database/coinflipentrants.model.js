module.exports = (sequelize, Sequelize) => {
  const Entrants = sequelize.define(`Entrants`, {
    // Model attributes are defined here
    userId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    coinFlipId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  return Entrants;
};
