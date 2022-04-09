const Discord = require("discord.js");

const Command = require("./command.js");

const Event = require("./event.js");

require("dotenv").config();

const fs = require("fs");

class Client extends Discord.Client {
  constructor() {
    super({
      intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"],
      allowedMentions: { parse: ["everyone"] },
    });

    /**
     * @type {Discord.Collection<string, Command>}
     */
    this.commands = new Discord.Collection();

    this.help_commands = [];

    this.prefix = process.env.BOT_PREFIX;
  }

  start(token) {
    // Command Handler
    let commandFiles = fs
      .readdirSync("./commands/")
      .filter((file) => file.endsWith(".js"));
    /**
     * @type {Command[]}
     */
    let commands = commandFiles.map((file) => require(`../commands/${file}`));

    commands.forEach((cmd) => {
      this.commands.set(cmd.name, cmd);
      if (cmd.name !== "restart" && cmd.name !== "shutdown") {
        this.help_commands.push({
          name: cmd.name,
          description: cmd.description,
        });
      }
    });

    // Event Handler

    this.removeAllListeners();

    fs.readdirSync("./events/")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /**
         * @type {Event}
         */
        const event = require(`../events/${file}`);
        this.on(event.event, event.run.bind(null, this));
      });
    this.login(token);
  }
}

module.exports = Client;
