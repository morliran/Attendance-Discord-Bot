const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const displayHelper = require("../helpers/display.js");

const attendanceService = require("../services/attendanceService.js");

module.exports = new Command({
  name: "list",
  description: "List the absence file content of guild users.",
  permission: "SEND_MESSAGES",
  async run(message, args, client) {
    const guildUsers = await attendanceService
      .getAllAttendance()
      .then((res) => {
        return res;
      });

    if (guildUsers.length > 0) {
      displayHelper.displaySplitMessageEmbed(
        guildUsers,
        message,
        client,
        "__**Absence data:**__"
      );
    } else {
      message.reply({
        content: `There isn't absence data at this moment in ${attendance.server} server.`,
      });
    }
  },
});
