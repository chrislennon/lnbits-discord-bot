module.exports = (sequelize, Sequelize) => {
  const Entrants = sequelize.define(`Entrants`, {
    // Model attributes are defined here
    eventId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  return Entrants;
};
