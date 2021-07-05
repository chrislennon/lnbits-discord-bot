const Discord = require(`discord.js`);
const Command = require(`./Command.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);
const UserWallet = require(`../lnbitsAPI/User.js`);
const QRCode = require('qrcode');

/*
This command will create an invoice for a user. 
Provides an embed for 

TODO:
- Currently you can specify an optional user to create an invoice under
*/

class PayMe extends Command {
  constructor() {
    super();
    this.name = `payme`;
    this.description = `Creates an invoice for the users wallet`;
    this.options = [{
      name: `amount`,
      type: `INTEGER`,
      description: `The amount of satoshis payable in the invoice`,
      required: true,
    },{
      name: `description`,
      type: `STRING`,
      description: `The description of the invoice`,
      required: true,
    },{
      name: `user`,
      type: `USER`,
      description: `The user to show wallet balance of`,
      required: false,
    }];
  }

  async execute(Interaction) {
    await Interaction.defer();
    const target = Interaction.options.get(`user`) ? Interaction.options.get(`user`) : Interaction;
    const amount = Interaction.options.get(`amount`);
    const description = Interaction.options.get(`description`);
    const member = await Interaction.guild.members.fetch(target.user.id);
    
    const um = new UserManager();
    const userWallet = await um.getUserWallet(member.user.id);
    
    const uw = new UserWallet(userWallet.adminkey);
    const invoiceDetails = await uw.createInvote(amount.value, description.value);
 
    const qrData = await QRCode.toDataURL(invoiceDetails.payment_request);
    const buffer = new Buffer.from(qrData.split(',')[1], 'base64');
    const file = new Discord.MessageAttachment(buffer, 'image.png');
    const embed = new Discord.MessageEmbed().setImage('attachment://image.png').addField(`Payment Request`, `${invoiceDetails.payment_request}`, true);

    const row = new Discord.MessageActionRow()
    .addComponents([
        new Discord.MessageButton({
            custom_id: 'pay',
            label: 'Pay Now!',
            emoji: { name: '💸' },
            style: 'SECONDARY'
        })
    ]);
          
    Interaction.editReply({ embeds: [embed], files: [file], components: [row]});
  }
}

module.exports = PayMe;