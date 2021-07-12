const Discord = require(`discord.js`);
const Command = require(`./Command.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);

/*
This command will create a wallet link for the user or return an existing wallet if already created
*/

class Create extends Command {
  constructor() {
    super();
    this.name = `create`;
    this.description = `Create a wallet for user.`;
    this.options = [];
  }

  async execute(Interaction) {
    let member;
    try {
      member = await Interaction.guild.members.fetch(Interaction.user.id);
    } catch (err) {
      console.log(err);
    }
    
    try {
      const um = new UserManager();
      const userWallet = await um.getOrCreateWallet(member.user.username, Interaction.user.id);
      const walletUrl = `${process.env.LNBITS_HOST}/wallet?usr=${userWallet.user}`;

      const row = new Discord.MessageActionRow()
        .addComponents([
          new Discord.MessageButton({
            label: `Go to my wallet`,
            emoji: { name: `💰` },
            style: `LINK`,
            url: `${walletUrl}`,
          })
        ]);
      Interaction.reply({
        content: `You have a wallet!`,
        ephemeral: true,
        components: [row]
      });
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = Create;