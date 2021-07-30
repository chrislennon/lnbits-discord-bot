const Discord = require(`discord.js`);
const Command = require(`./Command.js`);
const sparkles = require(`sparkles`)();
const dedent = require(`dedent-js`);
const db = require(`../Database`);

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
    
    
    try {
      member = await Interaction.guild.members.fetch(Interaction.user.id);
    } catch(err) {
      console.log(err);
    }

    /* Check if User has an active flip already */

    const coinFlipDetails = await db.coinflips.findAll({ where: { creator: `${Interaction.user.id}`, status: `open` }});

    if (coinFlipDetails.length > 0) {
      await Interaction.defer({ephemeral: true});
      console.log(`CoinFlip already active for this user`, coinFlipDetails);
      Interaction.editReply({content: `You already have an active flip, please cancel that first.`, ephemeral: true});
    } else {
      await Interaction.defer();
      sparkles.emit(`createCoinFlip`, { 
        Interaction,
        member,
        numOfPeople: numOfPeople.value,
        amount: amount.value
      });

      try {
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
  
        Interaction.editReply({content: msgContent, components: [row], ephemeral:false });
      } catch(err) {
        console.log(err);
      }
    }
  }
}

module.exports = CoinFlip;