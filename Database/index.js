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

db.coinflips = require(`./coinflips.model.js`)(sequelize, Sequelize);
db.coinflipentry = require(`./coinflipentrants.model.js`)(sequelize, Sequelize);

sparkles.on(`createCoinFlip`, function(e){
  createCoinFlip(e);
});

function createCoinFlip(event) {
  console.log(`create event fired`);

  const flip = {
    creator: event.member.id,
    commandId: event.Interaction.id,
    entryFee: event.amount,
    maxPlayers: event.numOfPeople,
    status: `open`
  };
  console.log(`create flip`, flip);
  db.coinflips.create(flip);
}

sparkles.on(`joinCoinFlip`, function(e){
  joinCoinFlip(e);
});

function joinCoinFlip(event) {
  console.log(`join event fired`);

  const flip = {
    userId: event.userId,
    coinFlipId: event.coinFlipId
  };
  console.log(`create flip`, flip);
  db.coinflipentry.create(flip);
}


module.exports = db;
