const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const serverService = require("../services/serverService.js");

module.exports = new Command({
  name: "restart",
  description: "Restart the bot from maintenance mode.",
  permission: "ADMINISTRATOR",
  async run(message, args, client) {
    await serverService.updateServerMaintenanceMode(
      attendance.server_id,
      false
    );
    client.user.setStatus("online");
    client.user.setActivity(`Use => ${process.env.BOT_PREFIX}help`, {
      type: "WATCHING",
    });
    return message.reply({
      content: `${attendance.server} went out from maintenance mode.`,
    });
  },
});
