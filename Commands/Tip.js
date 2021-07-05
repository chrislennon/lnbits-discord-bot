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

    const sats = amount.value;
    const btc = (sats/100000000).toFixed(8).replace(/\.?0+$/,``);
    const valueString =  `${sats} Satoshis / ฿${btc}`;

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
      
      receiverData.user.send(`${senderData.toString()} on ${receiverData.guild.toString()} sent you ${valueString}\nYou can access the wallet at ${process.env.LNBITS_HOST}wallet?usr=${receiverWalletData.user}`);
      Interaction.editReply({
        content:`${senderData.toString()} sent ${valueString} to ${receiverData.toString()}`,
      });
    }
    else {
      // TODO decide how/when best to create a wallet for a user when not user initiated
      const um = new UserManager();
      const userWallet = await um.createUserWalletIfNotExist(receiverData.user.username, receiver.user.id);

      receiverData.user.send(`${senderData.toString()} on ${receiverData.guild.toString()} tried to send you ${valueString}. 🚨But you didnt have a wallet!🚨\nI have set one up for you, it can be accessed at ${process.env.LNBITS_HOST}wallet?usr=${userWallet.user}`);
      Interaction.editReply({
        content:`${receiverData.toString()} has currently not set up a wallet. I have set one up please retry...`,
      });
    }
  }
}

module.exports = Tip;
