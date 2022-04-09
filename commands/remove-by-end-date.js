const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const datesHelper = require("../helpers/dates.js");

const attendanceService = require("../services/attendanceService.js");

module.exports = new Command({
  name: "del-e",
  description:
    "Remove the absence file content of user by his id and end date.",
  permission: "SEND_MESSAGES",
  async run(message, args, client) {
    let to_search_by = args[1];
    let theDate = args[2];

    if (theDate == undefined) {
      return message.reply(`Sorry, you didn't insert a date value.`);
    }

    if (
      theDate.length !== 10 ||
      datesHelper.checkMinusSplitInStringDate(theDate) === false
    ) {
      return message.reply(
        `Sorry, date must be in ${attendance.date_formatter} format.`
      );
    }

    if (to_search_by == undefined) {
      return message.reply({
        content: `Sorry, can't find that ID in ${attendance.server} absence data.`,
      });
    }

    if (to_search_by.length === 18 && !isNaN(Number(to_search_by))) {
      if (datesHelper.checkValidDate(theDate) === false) {
        return message.reply({
          content: `Please insert date in format ${attendance.date_formatter}`,
        });
      } else {
        // If the user that doing this command have Staff role, then continue.
        if (message.member.roles.cache.find((r) => r.name === "Staff")) {
          let userAbsences = await attendanceService
            .getAttendanceOfUserByEndDate(
              to_search_by,
              theDate,
              attendance.server_id
            )
            .then((res) => {
              return res;
            });
          let theUser = client.users.cache
            .map((user) => {
              if (user.id === to_search_by) {
                return user;
              }
            })
            .filter((x) => x !== undefined);
          // If there is a data inside userAbsences, delete her.
          if (Object.keys(userAbsences).length !== 0) {
            await attendanceService.deleteAttendanceByEndDateOfUser(
              to_search_by,
              theDate,
              attendance.server_id
            );
            message.reply({
              content: `The absence data of ${theUser[0].username} in end date ${theDate} removed successfully.`,
            });
          }
          // Otherwise, display message.
          else {
            message.reply({
              content: `Sorry, it's seems like ${theUser[0].username} doesn't have an absence data in ${theDate}`,
            });
          }
        }
        // Otherwise, display message.
        else {
          return message.reply({
            content: `Sorry, it's seems like you don't have the permission to do this command.`,
          });
        }
      }
    } else {
      return message.reply({
        content: `Sorry, can't find that ID in ${attendance.server} absence data.`,
      });
    }
  },
});
