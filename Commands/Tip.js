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
    const sender = Interaction;
    const receiver = Interaction.options.get(`user`);
    const amount = Interaction.options.get(`amount`);
    const message = Interaction.options.get(`message`) ? Interaction.options.get(`message`) : {value: `null`};

    if (amount.value <= 0) {
      Interaction.reply({
        content: `Negative balances are not permitted`,
        ephemeral: true
      });
      return;
    }

    const sats = amount.value;
    const btc = (sats/100000000).toFixed(8).replace(/\.?0+$/,``);
    const valueString =  `${sats} Satoshis / ฿${btc}`;

    const senderData = await Interaction.guild.members.fetch(sender.user.id);
    const receiverData = await Interaction.guild.members.fetch(receiver.user.id);

    const _ = new UserManager();
    const senderWalletData = await _.getUserWallet(sender.user.id);
    const receiverWalletData = await _.getOrCreateWallet(receiverData.user.username, receiver.user.id);

    if (!senderWalletData.id) {
      Interaction.reply({
        content:`You do not currently have a wallet you can use /create`,
        ephemeral: true
      });
      return;
    }
    const senderWallet = new UserWallet(senderWalletData.adminkey);
    const senderWalletDetails = await senderWallet.getWalletDetails();
    const receiverWallet = new UserWallet(receiverWalletData.adminkey);

    if ((senderWalletDetails.balance/1000) - sats < 0) {
      Interaction.reply({
        content:`You do not have the balance to do this.`,
        ephemeral: true
      });
      return;
    }
    
    try {
      await Interaction.deferReply();
      const invoiceDetails = await receiverWallet.createInvote(amount.value, message.value);   
      const invoicePaymentDetails = await senderWallet.payInvoice(invoiceDetails.payment_request);
  
      console.log({
        sender: sender.user.id,
        receiver: receiver.user.id,
        amount: amount.value,
        message: message.value,
        invoiceDetails: invoicePaymentDetails
      });
        
      await Interaction.editReply({
        content:`${senderData.toString()} sent ${valueString} to ${receiverData.toString()}`,
      });
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = Tip;
