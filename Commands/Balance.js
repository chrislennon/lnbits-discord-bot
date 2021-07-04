const Command = require(`./Command.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);
const UserWallet = require(`../lnbitsAPI/User.js`);

/*
This command will show the balance of the mentioned user

TODO:
- Probably not the best of ideas to show the balance of others, remains for testing/demo purposes.
*/

class Balance extends Command {
  constructor() {
    super();
    this.name = `balance`;
    this.description = `Returns the users wallet balance.`;
    this.options = [{
      name: `user`,
      type: `USER`,
      description: `The user to show wallet balance of`,
      required: true,
    }];
  }

  async execute(Interaction) {
    const target = Interaction.options.get(`user`) ? Interaction.options.get(`user`).user : Interaction.user;
    const member = await Interaction.guild.members.fetch(target.id);
    
    const um = new UserManager();
    const userWallet = await um.getUserWallet(member.toString());
    
    const uw = new UserWallet(userWallet.adminkey);
    const userWalletDetails = await uw.getWalletDetails();
    
    Interaction.reply(`The wallet for ${target.username.toString()} has ${userWalletDetails.balance} sats`, {"ephemeral": true})
  }
}

module.exports = Balance;