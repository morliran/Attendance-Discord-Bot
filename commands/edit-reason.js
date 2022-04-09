const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const datesHelper = require("../helpers/dates.js");

const attendanceService = require("../services/attendanceService.js");

module.exports = new Command({
  name: "edit-r",
  description:
    "Edit the absence file reason content of user by end date and his id.",
  permission: "SEND_MESSAGES",
  async run(message, args, client) {
    if (args[2] == undefined) {
      return message.reply(`Please provide reason.`);
    }
    let endDate = args[1];
    let theReason = args[2].replace("-", " ");

    // Check if the enDate is valid.
    if (
      datesHelper.checkValidDate(endDate) === false ||
      endDate.length !== 10 ||
      datesHelper.checkMinusSplitInStringDate(endDate) === false
    ) {
      message.reply({
        content: `Please make sure your end date in this format: ${attendance.date_formatter}`,
      });
    }
    // Otherwise, update his new reason, if this reason is not undefined.
    else {
      let prevAttendance = await attendanceService
        .getAttendanceOfUserByEndDate(
          message.author.id,
          endDate,
          attendance.server_id
        )
        .then((res) => {
          return res;
        });
      if (Object.keys(prevAttendance).length !== 0) {
        // If the new reason is equal to undefined then display an error message.
        if (theReason == undefined) {
          message.reply({ content: `Please give a reason of your absence.` });
        }
        // Otherwise, update the new reason.
        else {
          await attendanceService.updateEndDateReason(
            {
              user_id: message.author.id,
              until: endDate,
              server_id: attendance.server_id,
            },
            theReason
          );
          message.reply({
            content: `Your new reason has been saved successfully.`,
          });
        }
      } else {
        message.reply({
          content: `There isn't absence data for you with ${endDate} as ending date.`,
        });
      }
    }
  },
});
