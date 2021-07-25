module.exports = (sequelize, Sequelize) => {
  const Flips = sequelize.define(`CoinFlips`, {
    creator: {
      type: Sequelize.STRING,
      allowNull: false
    },
    commandId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    entryFee: {
      type: Sequelize.INTEGER,
      default: 0
    },
    maxPlayers: {
      type: Sequelize.INTEGER,
      default: 0
    }
  });
  return Flips;
};