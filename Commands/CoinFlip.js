const Discord = require(`discord.js`);
const Command = require(`./Command.js`);
const sparkles = require(`sparkles`)();
const dedent = require(`dedent-js`);

/*
This command will create a coin flip event allowing n users to contribute to a pool with one winner.
*/

class CoinFlip extends Command {
  constructor() {
    super();
    this.name = `coinflip`;
    this.description = `Create a coin flip between a number of entrants.`;
    this.options = [{
      name: `numofpeople`,
      type: `INTEGER`,
      description: `Number of people in the event (including you)`,
      required: true,
    },{
      name: `entryamount`,
      type: `INTEGER`,
      description: `Number of Satoshis required for entry`,
      required: true,
    }];
  }

  async execute(Interaction) {
    const amount = Interaction.options.get(`entryamount`);
    const numOfPeople = Interaction.options.get(`numofpeople`);

    let member;

    if (amount.value <= 0) {
      Interaction.reply({
        content: `Negative balances are not permitted`,
        ephemeral: true
      });
      return;
    }
    
    await Interaction.defer();
    try {
      member = await Interaction.guild.members.fetch(Interaction.user.id);
    } catch(err) {
      console.log(err);
    }

    try {
      sparkles.emit(`createCoinFlip`, { 
        Interaction,
        member,
        numOfPeople: numOfPeople.value,
        amount: amount.value
      });

      const row = new Discord.MessageActionRow()
        .addComponents([
          new Discord.MessageButton({
            custom_id: `joinflip`,
            label: `Join Flip!`,
            emoji: { name: `➕` },
            style: `SECONDARY`
          }),
          new Discord.MessageButton({
            custom_id: `cancelflip`,
            label: `Cancel Flip [creator]`,
            emoji: { name: `❌` },
            style: `SECONDARY`
          })
        ]);

      const msgContent = dedent(`
        ${Interaction.user.username} started a coinflip! ${numOfPeople.value} can enter for ${amount.value} satoshis each!
          Current Pot:
          Entrants:
        `);

      Interaction.editReply({content: msgContent, components: [row]});
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = CoinFlip;