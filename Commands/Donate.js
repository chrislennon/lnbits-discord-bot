const Discord = require(`discord.js`);
const Command = require(`./Command.js`);
const Extensions = require(`../lnbitsAPI/Extensions.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);
const LNURLw = require(`../lnbitsAPI/LNURLw.js`);
const dedent = require(`dedent-js`);

/*
This command will create an invoice for a user allowing anyone to claim it.
*/

class Donate extends Command {
  constructor() {
    super();
    this.name = `donate`;
    this.description = `Create an open invoice for anyone to claim.`;
    this.options = [{
      name: `amount`,
      type: `INTEGER`,
      description: `The amount of satoshis payable in the invoice`,
      required: true,
    },{
      name: `description`,
      type: `STRING`,
      description: `Description of the donation`,
      required: false,
    }];
  }

  async execute(Interaction) {
    const description = Interaction.options.get(`description`) ? Interaction.options.get(`description`) : { value: `${Interaction.user.username}[${Interaction.guild.name}] - ${new Date()}`} ;
    const amount = Interaction.options.get(`amount`);
    let member;

    if (amount.value <= 0) {
      Interaction.reply({
        content: `Negative balances are not permitted`,
        ephemeral: true
      });
      return;
    }
    
    await Interaction.deferReply();
    try {
      member = await Interaction.guild.members.fetch(Interaction.user.id);
    } catch(err) {
      console.log(err);
    }

    try {
      const um = new UserManager();
      const userWallet = await um.getUserWallet(member.user.id);
      console.log(`userWallet`, userWallet);
      
      const ext = new Extensions(userWallet.user);
      await ext.enable(`withdraw`);

      const lnurlw = new LNURLw(userWallet.adminkey);
      const withdrawlLink = await lnurlw.createWithdrawlLink(description.value, amount.value);
      console.log(withdrawlLink);

      // const uw = new UserWallet(userWallet.adminkey);
      // const invoiceDetails = await uw.createInvote(amount.value, description.value);
  
      const row = new Discord.MessageActionRow()
        .addComponents([
          new Discord.MessageButton({
            custom_id: `claim`,
            label: `Claim Money!`,
            emoji: { name: `💸` },
            style: `SECONDARY`
          })
        ]);

      const msgContent = dedent(`
        ${Interaction.user.username} is donating ${amount.value} satoshis!

        Description: ${description.value}
        LNURL: \`${withdrawlLink.lnurl}\`
        `);

      Interaction.editReply({content: msgContent, components: [row]});
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = Donate;