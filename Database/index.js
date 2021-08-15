const Sequelize = require(`sequelize`);
// const sparkles = require(`sparkles`)();
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   operatorsAliases: false,

//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   }
// });

const sequelize = new Sequelize({
  dialect: `sqlite`,
  storage: `data/database.sqlite`
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.coinflip = require(`./CoinFlip`);
db.coinflips = require(`./CoinFlip/coinflips.model.js`)(sequelize, Sequelize);
db.coinflipentry = require(`./CoinFlip/coinflipentrants.model.js`)(sequelize, Sequelize);
// db.coinflip.setup();

module.exports = db;
