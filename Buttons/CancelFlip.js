const Button = require(`./Button.js`);
const db = require(`../Database`);

/*
This command will cancel an existing coinflip, only the creator can cancel
*/

class CancelFlip extends Button {
  constructor() {
    super();
    this.name = `cancelflip`;
    this.description = `Cancel a CoinFlip.`;
    this.options = [];
  }

  async execute(Interaction) {

    const coinFlipDetails = await db.coinflips.findAll({ where: { commandId: `${Interaction.message.interaction.id}` }});

    if (coinFlipDetails[0].creator == Interaction.user.id) {
      console.log(`Will Cancel the event`);
      coinFlipDetails[0].update({ status: `closed` }); 
      Interaction.update({content: `Coin Flip was cancelled`});
    } else {
      console.log(`Wrong user attempted to cancel the event`);
    }
  }
}

module.exports = CancelFlip;