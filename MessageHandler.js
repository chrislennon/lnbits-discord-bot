class MessageHandler {
  /**
   * Handles understanding an incoming message and passing it to the correct command handler.
   * @param {Message} Message The Discord message object
   */
  handleMessage(Message) {
    if (Message.system || Message.author.bot) return;
  }
}

module.exports = MessageHandler;
