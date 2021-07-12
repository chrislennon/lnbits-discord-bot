const Discord = require(`discord.js`);
const Command = require(`./Command.js`);
const dedent = require(`dedent-js`);

/*
This command will show the help message
*/

class Help extends Command {
  constructor() {
    super();
    this.name = `help`;
    this.description = `Get help`;
    this.options = [];
  }

  async execute(Interaction, commands) {

    let cmdOutput = ``;
    commands.forEach(async cmd => {
      if (cmd.name != `help`) {
        let params = ``;
        cmd.options.forEach(async opt => {
          params += `${opt.name}: <${opt.type}> `;
        });
        cmdOutput += `
          - ${cmd.name}: ${cmd.description} \`/${cmd.name} ${params}\`
        `;
      }
      cmdOutput = dedent(cmdOutput);

    });

    const embed = new Discord.MessageEmbed()
      .setColor(`#0099ff`)
      .setTitle(`Lightning.bot`)
      .setURL(`https://lightning.bot`)
      .setDescription(dedent(`
    Source code: https://github.com/chrislennon/lnbits-discord-bot

    This bot allows you to interact with others users using the power of Bitcoins lightning network.

    You can learn more at https://lightning.how
    `))
      .addFields(
        { name: `\u200B`, value: `\u200B` },
        { name: `IMPORTANT INFORMATION`, value: `This is a custodial service, you do not control your money until you withdrawn it!` },
        { name: `\u200B`, value: `\u200B` },
        { name: `Commands`, value: cmdOutput},
      );

    Interaction.reply({ embeds: [embed], ephemeral: true});
  }
}

module.exports = Help;