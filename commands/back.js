const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const datesHelper = require("../helpers/dates.js");

const attendanceService = require("../services/attendanceService.js");

module.exports = new Command({
  name: "back",
  description:
    "Remove the absence file content of user by his id and start date.",
  permission: "SEND_MESSAGES",
  async run(message, args, client) {
    let theDate = args[1];

    if (theDate == undefined) {
      return message.reply(`Sorry, you didn't insert your start date absence.`);
    }

    if (
      theDate.length !== 10 ||
      datesHelper.checkMinusSplitInStringDate(theDate) === false ||
      datesHelper.checkValidDate(theDate) === false
    ) {
      return message.reply({
        content: `Sorry, date must be in ${attendance.date_formatter} format.`,
      });
    }
    let userAbsences = await attendanceService
      .getAttendanceOfUserByStartDate(
        message.author.id,
        theDate,
        attendance.server_id
      )
      .then((res) => {
        return res;
      });
    // If there is a data inside userAbsences, delete her.
    if (Object.keys(userAbsences).length !== 0) {
      attendanceService.deleteAttendanceByStartDateOfUser(
        message.author.id,
        theDate,
        attendance.server_id
      );
      message.reply({
        content: `Your absence data in start date ${theDate} removed successfully.`,
      });
    }
    // Otherwise, display message.
    else {
      message.reply({
        content: `Sorry, it's seems like you don't have an absence data in ${theDate} as starting date`,
      });
    }
  },
});
