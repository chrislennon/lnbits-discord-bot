const Discord = require(`discord.js`);
const Command = require(`./Command.js`);
const UserManager = require(`../lnbitsAPI/UserManager.js`);
const UserWallet = require("../lnbitsAPI/User.js");

/*
This command will send a specified amount of sats to random users
*/

class Rain extends Command {
  constructor() {
    super();
    this.name = `rain`;
    this.description = `Send an amount of sats to multiple random users.`;
    this.options = [
      {
        'name': 'amount',
        'description': 'Amount of sats to give to each user',
        'type': 'INTEGER',
        'required': true
      },
      {
        'name': 'users',
        'description': 'To how much users do you want to give sats?',
        'type': 'INTEGER',
        'required': true
      }
    ];
  }

  async execute(Interaction) {
    const amount = Interaction.options.get('amount').value
    let users = Interaction.options.get('users').value

    if (amount <= 0) {
      Interaction.reply({
        content: `Negative amounts are not permitted`,
        ephemeral: true
      });
      return;
    }

    if (users <= 0) {
      Interaction.reply({
        content: `Negative counts are not permitted`,
        ephemeral: true
      });
      return;
    }
    
    try {

      const um = new UserManager();
      let senderWallet = await um.getUserWallet(Interaction.user.id)

      if(senderWallet.adminkey) {
        senderWallet = new UserWallet(senderWallet.adminkey)
        const senderDetails = await senderWallet.getWalletDetails()
        if (senderDetails.balance/1000 < amount * users) {
          await Interaction.reply({
            content: 'You do not have enough balance',
            ephemeral: true
          })
          return;
        }

        Interaction.deferReply();

        let member;
        try {
          member = await Interaction.guild.members.fetch(Interaction.user.id);
        } catch (err) {
          console.log(err);
        }
        
        const randomInteger = (maxNumber) => {
          return Math.floor(Math.random() * maxNumber)
        }

        let rawMembers = await Interaction.channel.members
        let members = [];
        rawMembers.forEach((guildMember, id) => {
          if(id != Interaction.user.id && guildMember.user.bot == false) {
            members.push(guildMember)
          }
        })

        let reply = `Sent ${amount} Sats to\n`

        while(users > 0 && members.length > 0) {
          const index = randomInteger(members.length)
          let receiverWallet = await um.getOrCreateWallet(members[index].user.username, members[index].user.id)
          
          if(receiverWallet.adminkey) {
            receiverWallet = new UserWallet(receiverWallet.adminkey)
            const invoice = await receiverWallet.createInvoice(amount, `Rain by ${member.user.username}`)
            const payment = await senderWallet.payInvoice(invoice.payment_request)
            
            try {
              members[index].send(`You received ${amount} Satoshis from ${member.toString()}.\nYour new Balance: ${await receiverWallet.getBalanceString()}`);
            }
            catch(err) {
              console.log(err)
            }

            reply += `${members[index].toString()}\n`
            members.splice(index, 1)
            users--;
          }
        }

        await Interaction.editReply({
          content: reply
        })

      }
      else {
        await Interaction.editReply({
          content: 'You do not have a wallet',
          ephemeral: true
        })
        return;
      }

    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = Rain;