const Bot = require('./Bot');

const DiscordBot = new Bot();

// Handle graceful shutdowns
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function cleanup() {
  DiscordBot.destroy();
  process.exit();
}

DiscordBot.connect();
