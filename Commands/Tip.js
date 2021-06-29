const Command = require(`./Command.js`);

class Tip extends Command {
  constructor() {
    super();
    this.name = `tip`;
    this.description = `Tip a user.`;
    this.options = [{
      name: `user`,
      type: `USER`,
      description: `The user to tip`,
      required: true,
    }];
  }

  async execute(Interaction) {
    const target = Interaction.options.get(`user`) ? Interaction.options.get(`user`).user : Interaction.user;

    const member = await Interaction.guild.members.fetch(target.id);

    Interaction.reply(`${member.toString()} tip message`);
  }
}

module.exports = Tip;
