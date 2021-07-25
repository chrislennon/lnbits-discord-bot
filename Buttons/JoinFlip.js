const Button = require(`./Button.js`);
const sparkles = require(`sparkles`)();
const db = require(`../Database`);

/*
This command will enroll a user in a coinflip
*/

class JoinFlip extends Button {
  constructor() {
    super();
    this.name = `joinflip`;
    this.description = `Joins a CoinFlip.`;
    this.options = [];
  }

  async execute(Interaction) {
    console.log(`button click by ${Interaction.user.id}`);
    console.log(Interaction.message.content);
    //console.log(`Join Interaction`, Interaction);
    console.log(`Join Interaction`, Interaction.message.interaction.id);


    // TODO if going to use the db directly here likely no need for events from sparkles here.
    const coinFlipDetails = await db.coinflips.findAll({ where: { commandId: `${Interaction.message.interaction.id}` }});
    const currentlyEntered = await db.coinflipentry.findAll({ where: { coinFlipId: `${Interaction.message.interaction.id}` }});

    if (coinFlipDetails[0].maxPlayers > currentlyEntered.length) {
      console.log(`there is space in the event`);
      // Join Event
      sparkles.emit(`joinCoinFlip`, { 
        Interaction,
        userId: Interaction.user.id,
        coinFlipId: Interaction.message.interaction.id
      });  

    } else {
      console.log(`There is no more space in the event!!`);
    }

    /* Update the current command body */
    
    const allEnteredUsers = await db.coinflipentry.findAll({ where: { coinFlipId: `${Interaction.message.interaction.id}` }});
    let currentPot = parseInt(allEnteredUsers.length) * parseInt(coinFlipDetails[0].entryFee);

    let entrantsText = `Entrants: `;
    allEnteredUsers.forEach(element => {
      console.log(`entry`, element.userId);
      entrantsText += `${element.userId},`;
    });

    console.log(`entrantsText`, entrantsText);
    let content = Interaction.message.content;
    content = content.replace(/Current Pot:.*/, `Current Pot: ${currentPot}`);
    content = content.replace(/Entrants:.*/, entrantsText);
    console.log(content);

    Interaction.update({content: content});
  }
}

module.exports = JoinFlip;