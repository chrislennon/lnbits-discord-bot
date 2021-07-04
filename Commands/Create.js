const Command = require(`./Command.js`);
const userManager = require(`../lnbitsAPI/UserManager.js`);

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

    const target = Interaction.options.get(`user`) ? Interaction.options.get(`user`).user : Interaction.user;
    const member = await Interaction.guild.members.fetch(target.id);
    const um = new userManager();
    const userWallet = await um.createUserWalletIfNotExist(target.username.toString(), member.toString());

    Interaction.reply(`You can access the wallet at ${process.env.LNBITS_HOST}/wallet?usr=${userWallet.id}`, {"ephemeral": true})
  }
}

module.exports = Create;
