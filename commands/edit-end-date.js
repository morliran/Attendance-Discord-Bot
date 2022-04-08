const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const datesHelper = require("../helpers/dates.js");

const attendanceService = require("../services/attendanceService.js");

module.exports = new Command({
  name: "edit-e",
  description:
    "Edit the absence file end date content of user by old end date and his id.",
  permission: "SEND_MESSAGES",
  async run(message, args, client) {
    let oldEndDate = args[1];
    let newEndDate = args[2];

    if (oldEndDate == undefined || newEndDate == undefined) {
      return message.reply(`Sorry you didn't insert date value.`);
    }

    // Check if oldEndDate and newEndDate are valid dates.
    if (
      datesHelper.checkValidDate(oldEndDate) === false ||
      datesHelper.checkValidDate(newEndDate) === false ||
      oldEndDate.length !== 10 ||
      newEndDate.length !== 10 ||
      datesHelper.checkMinusSplitInStringDate(oldEndDate) === false ||
      datesHelper.checkMinusSplitInStringDate(newEndDate) === false
    ) {
      message.reply({
        content: `Please make sure your both dates are in this format: ${attendance.date_formatter}`,
      });
    }
    // Otherwise, update his new end date, if this date is after the start date of the absence.
    else {
      let prevAttendance = await attendanceService
        .getAttendanceOfUserByEndDate(message.author.id, oldEndDate)
        .then((res) => {
          return res;
        });
      if (Object.keys(prevAttendance).length !== 0) {
        // If the new end date is before the starting date, then display a message.
        if (
          datesHelper.checkStartDateBeforeEnd(
            prevAttendance.from,
            newEndDate
          ) === false
        ) {
          message.reply({
            content: `${newEndDate} must be after your saved start date: ${prevAttendance.from}`,
          });
        }
        // Otherwise, update the new end date.
        else {
          await attendanceService.updateEndDate(
            { user_id: message.author.id, until: oldEndDate },
            newEndDate
          );
          message.reply({
            content: `${newEndDate} has been saved successfully as your new end date, this absence start at ${prevAttendance.from}`,
          });
        }
      } else {
        message.reply({
          content: `There isn't absence data for you with ${oldEndDate} as ending date.`,
        });
      }
    }
  },
});
