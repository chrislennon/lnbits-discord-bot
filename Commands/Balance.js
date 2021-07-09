const Command = require(`./Command.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);
const UserWallet = require(`../lnbitsAPI/User.js`);

/*
This command will show the balance of the mentioned user
*/

class Balance extends Command {
  constructor() {
    super();
    this.name = `balance`;
    this.description = `Returns the users wallet balance.`;
    this.options = [];
  }

  async execute(Interaction) {
    const um = new UserManager();
    const userWallet = await um.getUserWallet(Interaction.user.id);

    if (userWallet.adminkey) {
      const uw = new UserWallet(userWallet.adminkey);
      const userWalletDetails = await uw.getWalletDetails();
      
      const walletUrl = `${process.env.LNBITS_HOST}/wallet?usr=${userWallet.user}`;

      const sats = userWalletDetails.balance/1000;
      const btc = (sats/100000000).toFixed(8).replace(/\.?0+$/,``);
      
      Interaction.reply({
        content:`Balance: ${sats} Satoshis / ฿${btc} \nAccess wallet here: ${walletUrl}`,
        ephemeral: true,
      });
    }
    else {
      Interaction.reply({
        content:`You do not currently have a wallet you can use /create`,
        ephemeral: true,
      });
    }
  }
}

module.exports = Balance;