const Command = require(`./Command.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);

/*
This command will create a wallet link for a mentioned user or return an existing wallet if already created

TODO:
- This command should only allow for users to create a wallet for themselves, or at least not exposese the user link to others
- Mainly this is here for testing of UserManager().createUserWalletIfNotExist()
*/

class Create extends Command {
  constructor() {
    super();
    this.name = `create`;
    this.description = `Create a wallet for a user.`;
    this.options = [{
      name: `user`,
      type: `USER`,
      description: `The user to create a wallet for`,
      required: true,
    }];
  }

  async execute(Interaction) {
    const target = Interaction.options.get(`user`) ? Interaction.options.get(`user`) : Interaction;
    const member = await Interaction.guild.members.fetch(target.user.id);
    const um = new UserManager();
    const userWallet = await um.createUserWalletIfNotExist(member.user.username, target.user.id);

    Interaction.reply(`You can access the wallet at ${process.env.LNBITS_HOST}/wallet?usr=${userWallet.id}`, {"ephemeral": true})
  }
}

module.exports = Create;