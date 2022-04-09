const Event = require("../structures/event.js");

const attendance = require("../config/attendance.json");

const serverService = require("../services/serverService.js");

require("dotenv").config();

module.exports = new Event("messageCreate", async (client, message) => {
  // So the bot will know in which server he got message.
  attendance.server = message.guild.name;
  attendance.server_id = message.guild.id;

  // Getting the specific user from the file by his id.
  let checkServerExists = await serverService
    .getServerName(attendance.server_id)
    .then((res) => {
      return res;
    });

  // If there is already server with that id, update his name.
  if (Object.keys(checkServerExists).length !== 0) {
    console.log(checkServerExists);
    if (checkServerExists.server_name !== attendance.server) {
      serverService.updateServerName(
        {
          server_id: checkServerExists.server_id,
          server_name: checkServerExists.server_name,
        },
        attendance.server
      );
    }
  }
  // Otherwise, I will insert the new data.
  else {
    serverService.newServer(attendance.server_id, attendance.server);
  }

  if (message.author.bot) return;

  if (!message.content.startsWith(client.prefix)) return;

  const args = message.content.substring(client.prefix.length).split(/ +/);

  const command = client.commands.find((cmd) => cmd.name == args[0]);

  if (!command) return message.reply(`${args[0]} is not a valid command!`);

  const permission = message.member.permissions.has(command.permission, true);

  // Get all the channels of the specific server.
  let textChannels = message.guild.channels.cache.filter(
    (ch) => (ch.type = "text")
  );
  // Get the reason-of-absence channels in that server
  let reason_of_absence_ch = textChannels
    .map((ch) => {
      if (ch.name.includes("reason-of-absence")) {
        return ch.id;
      }
    })
    .filter((x) => x !== undefined);
  // Check if the message is not the help command.
  if (message.content.toLowerCase() !== `${process.env.BOT_PREFIX}help`) {
    // If there is reason-of-absence channels.
    // Then display message that said the other commands can only be used at the first channel that received.
    if (
      reason_of_absence_ch.length > 0 &&
      !reason_of_absence_ch.includes(message.channel.id)
    ) {
      return message.channel.send(
        `My commands can only be used at <#${reason_of_absence_ch[0]}>`
      );
    }
  }

  if (!permission)
    return message.reply(
      `You do not have the permission \`${command.permission}\` to run this command!`
    );

  command.run(message, args, client);
});
