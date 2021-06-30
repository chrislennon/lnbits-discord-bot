const Command = require(`./Command.js`);
const fetch = require('node-fetch');

class Create extends Command {
  constructor() {
    super();
    this.name = `create`;
    this.description = `Create a wallet for a user.`;
    this.options = [{
      name: `user`,
      type: `USER`,
      description: `The user to create a wallet for`,
      required: true,
    }];
  }

  async execute(Interaction) {
    // This is a development test command 
    // Allows us to test creation of a wallet for a user.

    // TODO 
    // - this will be managed seamlessly by mapping of a Discord ID to a lnbits user ID, likely in an lnbits extension
    // - Could probably work around this temporarily with scanning a over GET /usermanager/api/v1/users

    // https://lnbits.com/usermanager/api/v1/users
    // POST
    // {"admin_id": <string>, "user_name": <string>, "wallet_name": <string>,"email": <Optional string> ,"password": <Optional string>}

    const target = Interaction.options.get(`user`) ? Interaction.options.get(`user`).user : Interaction.user;
    const member = await Interaction.guild.members.fetch(target.id);

    const body = {"admin_id": `${process.env.LNBITS_ADMIN_USER_ID}`, "user_name": `${target.username.toString()}`, "wallet_name": `${target.username.toString()}-main`, "email": `${member.toString()}`};
 
    fetch(`${process.env.LNBITS_HOST}/usermanager/api/v1/users`, {
            method: 'post',
            body:    JSON.stringify(body),
            headers: { 
              'Content-Type': 'application/json',
              'X-Api-Key': `${process.env.LNBITS_ADMIN_API_KEY}`
            },
        })
        .then(res => res.json())
        .then(json => {
          console.log(json);
          Interaction.reply(`Wallet Created! You can access the wallet at ${process.env.LNBITS_HOST}/wallet?usr=${json.id}`)
        });
    
  }
}

module.exports = Create;
