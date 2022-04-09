const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const serverService = require("../services/serverService.js");

module.exports = new Command({
  name: "shutdown",
  description: "Shutdown the bot for maintenance mode.",
  permission: "ADMINISTRATOR",
  async run(message, args, client) {
    if (message.author.id === "581511328779337728") {
      await serverService.updateServerMaintenanceMode(
        attendance.server_id,
        true
      );
      client.user.setStatus("idle");
      client.user.setActivity("Maintenance mode 🛠️", { type: "PLAYING" });
      return message.reply({
        content: `${client.user.username} Inside: ${attendance.server} went to maintenance mode.`,
      });
    } else {
      return message.reply({
        content: `Sorry you are not allowed to use this command.`,
      });
    }
  },
});
