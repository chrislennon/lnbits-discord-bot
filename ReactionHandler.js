
class ReactionHandler {
  handleReaction(Reaction, User, type) {
    if (Reaction.me) return;

    if (type === `ADD`) {
      this.handleStarReaction(Reaction, User);
      return;
    }
  }

  async handleStarReaction(Reaction, User) {
    await Reaction.fetch();
    console.log(Reaction);
    console.log(User);
  }

}

module.exports = ReactionHandler;
