const Command = require(`./Command.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);
const UserWallet = require(`../lnbitsAPI/User.js`);

class Tip extends Command {
  constructor() {
    super();
    this.name = `tip`;
    this.description = `Tip a user.`;
    this.options = [{
      name: `user`,
      type: `USER`,
      description: `The user to tip`,
      required: true,
    },{
      name: `amount`,
      type: `INTEGER`,
      description: `The amount of satoshis to transfer`,
      required: true,
    },{
      name: `message`,
      type: `STRING`,
      description: `A message of the transfer`,
      required: false,
    }];
  }

  async execute(Interaction) {
    await Interaction.defer();
    const sender = Interaction;
    const receiver = Interaction.options.get(`user`);
    const amount = Interaction.options.get(`amount`);
    const message = Interaction.options.get(`message`) ? Interaction.options.get(`message`) : `null`;

    const senderData = await Interaction.guild.members.fetch(sender.user.id);
    const receiverData = await Interaction.guild.members.fetch(receiver.user.id);
    
    const _ = new UserManager();
    const senderWalletData = await _.getUserWallet(sender.user.id);
    const receiverWalletData = await _.getUserWallet(receiver.user.id);

    if (receiverWalletData.id) {

      const senderWallet = new UserWallet(senderWalletData.adminkey);
      const receiverWallet = new UserWallet(receiverWalletData.adminkey);
      
      const invoiceDetails = await receiverWallet.createInvote(amount.value, message);   
      const invoicePaymentDetails = await senderWallet.payInvoice(invoiceDetails.payment_request);
      console.log(`invoice details`,invoicePaymentDetails);

      const sats = amount.value;
      const btc = (sats/100000000).toFixed(8).replace(/\.?0+$/,``);
      
      Interaction.editReply({
        content:`${senderData.toString()} sent ${sats} Satoshis / ฿${btc} to ${receiverData.toString()}`,
      });
    }
    else {
      // TODO decide how/when best to create a wallet for a user when not user initiated
      const um = new UserManager();
      const userWallet = await um.createUserWalletIfNotExist(receiverData.user.username, receiver.user.id);

      console.log(userWallet);
      Interaction.editReply({
        content:`${receiverData.toString()} has currently not set up a wallet. I have set one up please retry...`,
      });
    }
  }
}

module.exports = Tip;
