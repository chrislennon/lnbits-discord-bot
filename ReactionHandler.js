const Discord = require(`discord.js`);

class ReactionHandler {
  handleReaction(Reaction, User, type) {
    if (Reaction.me) return;
  }
}

module.exports = ReactionHandler;
