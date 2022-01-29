const fs = require(`fs`);
const Discord = require(`discord.js`);

class InteractionHandler {
  constructor(client) {
    // Dynamically load commands
    this.commands = new Discord.Collection();
    this.buttons = new Discord.Collection();
    this.client = client;

    fs.readdirSync(`./Commands`)
      .filter(file => file.endsWith(`.js`))
      .filter(file => file !== `Command.js`)
      .map(file => require(`./Commands/${file}`))
      .filter(cmd => cmd.name)
      .forEach(cmd => this.commands.set(cmd.name.toLowerCase(), new cmd()), this);

    fs.readdirSync(`./Buttons`)
      .filter(file => file.endsWith(`.js`))
      .filter(file => file !== `Button.js`)
      .map(file => require(`./Buttons/${file}`))
      .filter(cmd => cmd.name)
      .forEach(cmd => this.buttons.set(cmd.name.toLowerCase(), new cmd()), this);
  }

  /**
   * Update slash commands
   */
  async updateCommands() {
    const locals = [];
    const globals = [];

    this.commands.forEach(async cmd => {
      const data = {
        name: cmd.name,
        description: cmd.description,
        options: cmd.options
      };
      if(cmd.global) {
        globals.push(data);
      }
      else {
        locals.push(data);
      }
    });

    await this.client.application.commands.set(globals);
    this.client.guilds.cache.forEach( async guild => {
      await guild.commands.set(locals)  
    });
  }

  /**
   * Handles understanding an incoming interaction and passing it to the correct command handler.
   * @param {Interaction} Interaction The Discord interaction object
   */
  handleInteraction(Interaction) {
    if (Interaction.commandName == `help`){
      const command = this.commands.get(`help`);
      command.execute(Interaction, this.commands);
    } else if (Interaction.isCommand()) {
      const command = this.commands.get(Interaction.commandName);
      command.execute(Interaction);
    } else if (Interaction.isButton()) {
      const button = this.buttons.get(Interaction.customId);
      button.execute(Interaction);
    } else {
      return;
    }
  }
}

module.exports = InteractionHandler;
