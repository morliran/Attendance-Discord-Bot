const Discord = require("discord.js");

const Command = require("../structures/command.js");

require("dotenv").config();

module.exports = new Command({
  name: "help",
  description: "Show the commands for the users.",
  permission: "SEND_MESSAGES",
  async run(message, args, client) {
    let theCommand = client.help_commands
      .filter((cmd) => cmd.name === args[1])
      .map((c) => {
        return c.name !== "restart" && c.name !== "shutdown";
      });
    let randColor = "#" + Math.random().toString(16).slice(-6); // six-number format aka #abc123
    if (theCommand.length > 0) {
      const embed = new Discord.MessageEmbed()
        .addFields({
          name: "Description",
          value: theCommand[0].description,
        })
        .setColor(randColor)
        .setFooter({ text: `${client.user.username}` })
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    } else {
      let commandNames = client.help_commands.map((cmd) => cmd.name).join("\n");
      let embed = new Discord.MessageEmbed()
        .setColor(randColor)
        .setDescription(
          `__**Prefix:**__ ${process.env.BOT_PREFIX}\n
          __**Commands name:**__\n${commandNames}\n
          __**Notice:**__\nTo get help for specific command use:\n
          ${process.env.BOT_PREFIX}help [command] without the [].\n
          __**For example:**__\n${process.env.BOT_PREFIX}help add`
        )
        .setFooter({ text: `${client.user.username}` })
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    }
  },
});
