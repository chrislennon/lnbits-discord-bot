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
      type: `STRING`,
      description: `The payment required for entry`,
      required: true,
    },{
      name: `description`,
      type: `STRING`,
      description: `Description of the event`,
      required: true,
    }];
  }

  async execute(Interaction) {
    const description = Interaction.options.get(`description`) ? Interaction.options.get(`description`) : { value: `${Interaction.user.username}[${Interaction.guild.name}] - ${new Date()}`} ;
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
      sparkles.emit(`createEvent`, { 
        Interaction,
        name: member 
      });

      const row = new Discord.MessageActionRow()
        .addComponents([
          new Discord.MessageButton({
            custom_id: `joinbet`,
            label: `Join Bet!`,
            emoji: { name: `➕` },
            style: `SECONDARY`
          }),
          new Discord.MessageButton({
            custom_id: `cancelbet`,
            label: `Cancel Bet (owner)`,
            emoji: { name: `❌` },
            style: `SECONDARY`
          })
        ]);

      const msgContent = dedent(`
        ${Interaction.user.username} started a coinflip! ${numOfPeople} can enter for ${amount.value} satoshis each!

        Description: ${description.value}
        `);

      Interaction.editReply({content: msgContent, components: [row]});
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = CoinFlip;