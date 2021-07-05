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
    const sender = Interaction.user;
    const receiver = Interaction.options.get(`user`).user;
    const amount = Interaction.options.get(`amount`);
    const message = Interaction.options.get(`message`) ? Interaction.options.get(`message`) : 'null';

    const senderData = await Interaction.guild.members.fetch(sender.id);
    const receiverData = await Interaction.guild.members.fetch(receiver.id);
    
    const _ = new UserManager();
    const senderWalletData = await _.getUserWallet(sender.id);
    const receiverWalletData = await _.getUserWallet(receiver.id);

    const senderWallet = new UserWallet(senderWalletData.adminkey);
    const receiverWallet = new UserWallet(receiverWalletData.adminkey);

    const invoiceDetails = await receiverWallet.createInvote(amount.value, message);   
    const invoicePaymentDetails = await senderWallet.payInvoice(invoiceDetails.payment_request);

    Interaction.editReply(`${senderData.user.username} transferred ${amount.value} sats to ${receiverData.user.username}`);
  }
}

module.exports = Tip;
