const Sequelize = require(`sequelize`);
const sparkles = require(`sparkles`)();
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

db.events = require(`./events.model.js`)(sequelize, Sequelize);
db.entrants = require(`./entrants.model.js`)(sequelize, Sequelize);

sparkles.on(`createEvent`, function(e){
  createEvent(e);
});

function createEvent(event) {
  console.log(`create event fired`);
  console.log(`Interaction`, event.Interaction);
}

module.exports = db;
