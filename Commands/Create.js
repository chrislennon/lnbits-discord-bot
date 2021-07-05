const Command = require(`./Command.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);

/*
This command will create a wallet link for the user or return an existing wallet if already created
*/

class Create extends Command {
  constructor() {
    super();
    this.name = `create`;
    this.description = `Create a wallet for user.`;
    this.options = [];
  }

  async execute(Interaction) {
    const member = await Interaction.guild.members.fetch(Interaction.user.id);
    const um = new UserManager();
    const userWallet = await um.getOrCreateWallet(member.user.username, Interaction.user.id);

    Interaction.reply({
      content: `You can access the wallet at ${process.env.LNBITS_HOST}wallet?usr=${userWallet.user}`,
      ephemeral: true
    });
  }
}

module.exports = Create;