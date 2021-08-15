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
      allowNull: false,
      default: 0
    },
    maxPlayers: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 0
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      default: `open`
    } 
  });
  return Flips;
};