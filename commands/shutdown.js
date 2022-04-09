const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const serverService = require("../services/serverService.js");

module.exports = new Command({
  name: "shutdown",
  description: "Shutdown the bot for maintenance mode.",
  permission: "ADMINISTRATOR",
  async run(message, args, client) {
    await serverService.updateServerMaintenanceMode(attendance.server_id, true);
    client.user.setStatus("idle");
    client.user.setActivity(`Maintenance mode <962242109811851305>`, {
      type: "WATCHING",
    });
    return message.reply({
      content: `${client.user.username} Inside: ${attendance.server} went to maintenance mode.`,
    });
  },
});
