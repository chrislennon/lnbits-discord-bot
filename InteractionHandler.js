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
   * Create slash commands
   */
  async createCommands() {
    // TODO: Loop over guilds?
    const data = [];

    this.commands.forEach(async cmd => {
      data.push({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options
      });
    });

    //console.log('Create - guilds', await this.client.guilds.cache);
    await this.client.guilds.cache.first()?.commands.set(data);
  }

  /**
   * Update slash commands
   */
  async updateCommands() {
    const data = [];

    this.commands.forEach(async cmd => {
      data.push({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options
      });
    });

    // Loop over guilds?
    this.client.guilds.cache.forEach(async guild => {
      await guild.commands.set(data);
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
