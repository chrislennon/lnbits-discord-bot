const Command = require(`./Command.js`);

class Deposit extends Command {
  constructor() {
    super();
    this.name = `deposit`;
    this.description = `Deposit to a your wallet.`;
    this.options = [];
  }

  async execute(Interaction) {
    Interaction.reply(`Deposit message`);
  }
}

module.exports = Deposit;
