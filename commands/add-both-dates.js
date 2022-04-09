const Discord = require("discord.js");

const Command = require("../structures/command.js");

const attendance = require("../config/attendance.json");

const datesHelper = require("../helpers/dates.js");

const attendanceService = require("../services/attendanceService.js");

module.exports = new Command({
  name: "add-b",
  description:
    "Add absence of guild user to guild absence users file by giving the start date, end date and reason.",
  permission: "SEND_MESSAGES",
  async run(message, args, client) {
    if (args[3] == undefined) {
      return message.reply(`Please provide reason.`);
    }
    let start_date = args[1];
    let end_date = args[2];
    let the_reason = args.slice(3).join(" ");
    let randColor = "#" + Math.random().toString(16).slice(-6); // six-number format aka #abc123

    if (start_date == undefined || end_date == undefined) {
      return message.reply(`Sorry you didn't insert date value.`);
    }

    if (
      datesHelper.checkValidDate(start_date) === false ||
      datesHelper.checkValidDate(end_date) === false ||
      start_date.length !== 10 ||
      end_date.length !== 10 ||
      datesHelper.checkMinusSplitInStringDate(start_date) === false ||
      datesHelper.checkMinusSplitInStringDate(end_date) === false
    ) {
      return message.reply(
        `Make sure that both dates are in format of ${attendance.date_formatter}`
      );
    }

    if (datesHelper.checkStartDateBeforeEnd(start_date, end_date) === false) {
      return message.reply(`${end_date} must be after ${start_date}.`);
    }

    if (
      datesHelper.totalDays(start_date, end_date) > attendance.maxDayToBeOffline
    ) {
      return message.reply({
        content: `Sorry can't insert ${datesHelper.totalDays(
          start_date,
          end_date
        )} max absence day to be offline is: ${attendance.maxDayToBeOffline}`,
      });
    }

    if (the_reason == undefined) {
      return message.channel.send(`Please give a reason of your absence.`);
    }

    // Getting the specific user from the file by his id.
    let checkUserExists = await attendanceService
      .getAttendanceOfUser(message.author.id, attendance.server_id)
      .then((res) => {
        return res;
      });
    let checkEndDateExists = [];

    // If there is data for that user, I will check if there is already same end date.
    if (checkUserExists.length > 0) {
      checkEndDateExists = checkUserExists.filter((u) => u.until === end_date);
    }

    // If there is a data with same end date, then I will update the reason.
    if (checkEndDateExists.length > 0) {
      attendanceService.updateEndDateReason(
        {
          user_id: message.author.id,
          until: end_date,
          server_id: attendance.server_id,
        },
        the_reason
      );
      message.reply({
        content: `Successfully update your reason inside ${end_date}.`,
      });
    }
    // Otherwise, I will insert the new data.
    else {
      attendanceService.newAttendance(
        message.author.id,
        message.author.username,
        start_date,
        end_date,
        datesHelper.totalDays(start_date, end_date),
        the_reason,
        attendance.server_id
      );
      const embed = new Discord.MessageEmbed()
        .setTitle("__**Successfully add this absence details:**__")
        .addFields(
          {
            name: "Username:",
            value: `${message.author.username}`,
            inline: true,
          },
          {
            name: "From:",
            value: `${start_date}`,
            inline: true,
          },
          {
            name: "Until:",
            value: `${end_date}`,
            inline: true,
          },
          {
            name: "Total:",
            value: `${datesHelper.totalDays(start_date, end_date)}`,
            inline: true,
          },
          {
            name: "Reason:",
            value: `${the_reason}`,
            inline: true,
          }
        )
        .setColor(randColor)
        .setFooter({ text: `${client.user.username}` })
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    }
  },
});
