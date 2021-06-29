const Command = require(`./Command.js`);

class Withdraw extends Command {
  constructor() {
    super();
    this.name = `withdraw`;
    this.description = `Withdraw from your wallet.`;
    this.options = [];
  }

  async execute(Interaction) {
    Interaction.reply(`Withdraw message`);
  }
}

module.exports = Withdraw;
