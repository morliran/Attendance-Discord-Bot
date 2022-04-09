const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const displayHelper = require("../helpers/display.js");

const datesHelper = require("../helpers/dates.js");

const attendanceService = require("../services/attendanceService.js");

module.exports = new Command({
  name: "search",
  description: `Search the absence file content by specific key\n(me, user id, date value in ${attendance.date_formatter} format).`,
  permission: "SEND_MESSAGES",
  async run(message, args, client) {
    let to_search_by = args[1];

    if (to_search_by == undefined) {
      return message.reply({
        content: `Sorry, can't find that ID in ${attendance.server} absence data.`,
      });
    }

    // If the user don't want to display absence until specific date.
    if (datesHelper.checkValidDate(to_search_by) === false) {
      // If the user want to see his absence data.
      if (to_search_by.toLowerCase() === "me" && to_search_by.length === 2) {
        let myAbsences = await attendanceService
          .getAttendanceOfUser(message.author.id, attendance.server_id)
          .then((res) => {
            return res;
          });
        if (myAbsences.length > 0) {
          displayHelper.displaySplitMessageEmbed(
            myAbsences,
            message,
            client,
            `__**${message.author.username} absence data:**__`
          );
        } else {
          return message.reply({
            content: `There isn't absence data for you at this moment in ${attendance.server} server.`,
          });
        }
      }
      // Search by specific id.
      else if (to_search_by.length === 18) {
        if (message.member.roles.cache.find((r) => r.name === "Staff")) {
          let userAbsences = await attendanceService
            .getAttendanceOfUser(to_search_by, attendance.server_id)
            .then((res) => {
              return res;
            });
          console.log(userAbsences);
          if (userAbsences.length > 0) {
            displayHelper.displaySplitMessageEmbed(
              userAbsences,
              message,
              client,
              `__**${userAbsences[0].user_name} absence data:**__`
            );
          } else {
            if (
              userAbsences.user_name === undefined ||
              userAbsences.user_name === null
            ) {
              return message.reply({
                content: `There isn't absence data for this user at this moment in ${attendance.server} server.`,
              });
            } else {
              return message.reply({
                content: `There isn't absence data for ${userAbsences[0].user_name} at this moment in ${attendance.server} server.`,
              });
            }
          }
        } else {
          return message.reply({
            content: `Sorry, it's seems like you don't have the permission to use this key value search.`,
          });
        }
      } else {
        return message.reply({
          content: `Please put a valid search value (me, or user id).`,
        });
      }
    }
    // Otherwise, show by specific date.
    else {
      if (
        to_search_by.length !== 10 ||
        datesHelper.checkMinusSplitInStringDate(to_search_by) === false
      ) {
        return message.reply({
          content: `Sorry, ${to_search_by} must be in ${attendance.date_formatter} format.`,
        });
      }
      let absenceWithSpecificDate = await attendanceService
        .getAttendanceByEndDate(to_search_by, attendance.server_id)
        .then((res) => {
          return res;
        });
      if (absenceWithSpecificDate.length > 0) {
        displayHelper.displaySplitMessageEmbed(
          absenceWithSpecificDate,
          message,
          client,
          `__**Absence data until ${to_search_by}:**__`
        );
      } else {
        return message.reply({
          content: `There isn't absence data with ending date ${to_search_by} for ${attendance.server} server.`,
        });
      }
    }
  },
});
