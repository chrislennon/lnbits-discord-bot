module.exports = (sequelize, Sequelize) => {
  const Events = sequelize.define(`Events`, {
    // Model attributes are defined here
    creator: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
      // allowNull defaults to true
    }
  });

  return Events;
};