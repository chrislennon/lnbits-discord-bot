const Bot = require(`./Bot`);
const App = require(`./App`);
const winston = require(`winston`);
const dotenv = require(`dotenv`);
dotenv.config();

if (process.env.LOG_TO_FILE == `true`){
  const logDate = new Date().toISOString();
  var fs = require( `fs` );
  var logDir = `logs`;
  if ( !fs.existsSync( logDir ) ) {
    fs.mkdirSync( logDir );
  }
  const logger = winston.createLogger({
    level: `info`,
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: `./${logDir}/${logDate}_error.log`, level: `error` }),
      new winston.transports.File({ filename: `./${logDir}/${logDate}_combined.log` }),
    ],
  });

  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));


  console.log = function(){
    return logger.info.apply(logger, arguments);
  };
  console.error = function(){
    return logger.error.apply(logger, arguments);
  };
  console.info = function(){
    return logger.warn.apply(logger, arguments);
  };
}

const DiscordBot = new Bot();

// Handle graceful shutdowns
// process.on(`SIGINT`, cleanup);
// process.on(`SIGTERM`, cleanup);

// function cleanup() {
//   DiscordBot.destroy();
//   process.exit();
// }

DiscordBot.connect();

const DiscordApp = App;
DiscordApp.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.APP_PORT}`);
});