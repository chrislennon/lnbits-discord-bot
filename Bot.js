const Discord = require(`discord.js`);
const InteractionHandler = require(`./InteractionHandler`);
const MessageHandler = require(`./MessageHandler`);
const ReactionHandler = require(`./ReactionHandler`);

const dotenv = require(`dotenv`);
dotenv.config();

class Bot {
  /**
   * Initializes all modules, a Discord client, binds events.
   * @constructor
   */
  constructor() {
    this.client = new Discord.Client({ 
      partials: [`CHANNEL`, `MESSAGE`, `REACTION`, `USER`],
      intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES, 
        Discord.Intents.FLAGS.GUILD_MEMBERS
      ]
    });
    this.InteractionHandler = new InteractionHandler(this.client);
    this.MessageHandler = new MessageHandler();
    this.ReactionHandler = new ReactionHandler();
    this.bindEvents();
  }

  /**
   * Bind event functions.
   */
  bindEvents() {
    this.client.on(`ready`, this.onReady.bind(this));
    this.client.on(`guildCreate`, this.onGuildJoin.bind(this));
    this.client.on(`interactionCreate`, this.onInteraction.bind(this));
    this.client.on(`messageCreate`, this.onMessage.bind(this));
    this.client.on(`messageReactionAdd`, this.onMessageReactionAdd.bind(this));
    this.client.on(`messageReactionRemove`, this.onMessageReactionRemove.bind(this));
  }

  /**
   * Login client to Discord.
   */
  connect() {
    this.client.login(process.env.AUTH_TOKEN);
  }

  /**
   * Destroy Discord client.
   */
  destroy() {
    console.log(`Shutting down.`);
    this.client.destroy();
  }

  /**
   * Passes interaction events to the InteractionHandler.
   * @param {Interaction} Interaction The Discord interaction object.
   */
  onInteraction(Interaction) {
    this.InteractionHandler.handleInteraction(Interaction);
  }


  /**
   * Passes message events to the MessageHandler.
   * @param {Message} Message The Discord message object.
   */
  onMessage(Message) {
    if (
      Message.content.toLowerCase() === `!deploy` && 
      Message.author.id === `177898294939222016`
    ) {
      this.InteractionHandler.createCommands();
      return;
    }

    this.MessageHandler.handleMessage(Message);
  }

  /**
   * Passes reaction add events to the ReactionHandler.
   * @param {Reaction} Reaction The Discord reaction object.
   * @param {User} User The Discord user that added the reaction.
   */
  onMessageReactionAdd(Reaction, User) {
    this.ReactionHandler.handleReaction(Reaction, User, `ADD`);
  }

  /**
   * Passes reaction remove events to the ReactionHandler.
   * @param {Reaction} Reaction The Discord reaction object.
   * @param {User} User The Discord user that removed the reaction.
   */
  onMessageReactionRemove(Reaction, User) {
    this.ReactionHandler.handleReaction(Reaction, User, `REMOVE`);
  }

  onGuildJoin() {
    console.log(`joined new guild`);
    this.InteractionHandler.updateCommands();
  }

  /**
   * Bot is connected to Discord.
   */
  onReady() {
    this.InteractionHandler.updateCommands();
    console.log(`Connected to Discord as ${this.client.user.username}#${this.client.user.discriminator} <@${this.client.user.id}>`);
    console.log(`Using lnbits host: ${process.env.LNBITS_HOST}`);
  }
}

module.exports = Bot;
