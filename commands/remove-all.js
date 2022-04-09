const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const attendanceService = require("../services/attendanceService.js");

module.exports = new Command({
  name: "del-a",
  description: "Remove the absence file content of user by his id.",
  permission: "SEND_MESSAGES",
  async run(message, args, client) {
    let to_search_by = args[1];
    if (to_search_by == undefined) {
      return message.reply({
        content: `Sorry, can't find that ID in ${attendance.server} absence data.`,
      });
    }
    if (to_search_by.length === 18 && !isNaN(Number(to_search_by))) {
      if (message.member.roles.cache.find((r) => r.name === "Staff")) {
        const theUser = client.users.cache
          .map((user) => {
            if (user.id === to_search_by) {
              return user;
            }
          })
          .filter((x) => x !== undefined);
        // If there is data inside theUser.
        if (theUser.length > 0) {
          await attendanceService.deleteAllAttendanceOfUser(
            to_search_by,
            attendance.server_id
          );
          message.reply({
            content: `The absence data of ${theUser[0].username} removed successfully.`,
          });
        }
        // Otherwise, display message.
        else {
          message.reply({ content: `Sorry can't found that user.` });
        }
      } else {
        message.reply({
          content: `Sorry, it's seems like you don't have the permission to do this command.`,
        });
      }
    } else {
      message.reply({
        content: `Sorry, can't find that ID in ${attendance.server} absence data.`,
      });
    }
  },
});
