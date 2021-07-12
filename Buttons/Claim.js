const Discord = require(`discord.js`);
const Button = require(`./Button.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);
const LNURL = require(`../lnbitsAPI/LNURLw`);

/*
This command will claim a LNurl
*/

class Claim extends Button {
  constructor() {
    super();
    this.name = `claim`;
    this.description = `Claims a LNURL.`;
    this.options = [];
  }

  async execute(Interaction) {
    console.log(`button click by ${Interaction.user.id}`);
    console.log(`want to pay ${Interaction.message.content}`);

    const payUrl = Interaction.message.content.split(`LNURL: `)[1].replace(/`/g, ``);

    const u = new UserManager();
    const user = await u.getOrCreateWallet(Interaction.user.username, Interaction.user.id);
    const lnurl = new LNURL(user.adminkey);
    const lnurlParts = await lnurl.scanLNURL(payUrl);
    const redeemInvoice = await lnurl.doCallback(lnurlParts);
    console.log(redeemInvoice);

    const row = new Discord.MessageActionRow()
      .addComponents([
        new Discord.MessageButton({
          custom_id: `claim`,
          label: `Claimed by @${Interaction.user.username}`,
          emoji: { name: `💸` },
          style: `SECONDARY`,
          disabled: true
        })
      ]);

    Interaction.update({components: [row]});
  }
}

module.exports = Claim;