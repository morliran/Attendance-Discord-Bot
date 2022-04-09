const attendance = require("../config/attendance.json");

var moment = require("moment");

function checkMinusSplitInStringDate(strDate) {
  let count = 0;
  if (strDate.length > 0) {
    for (let index = 0; index < strDate.length; index++) {
      if (strDate.charAt(index) === "-") {
        count++;
      }
    }
  }
  return count === 2;
}

function checkValidDate(theDate) {
  return moment(theDate, attendance.date_formatter, true).isValid();
}

function checkStartDateBeforeEnd(start, end) {
  var mStart = moment(start, attendance.date_formatter);
  var mEnd = moment(end, attendance.date_formatter);
  return mStart.isBefore(mEnd);
}

function totalDays(start, end) {
  var mStart = moment(start, attendance.date_formatter);
  var mEnd = moment(end, attendance.date_formatter);
  return mEnd.diff(mStart, "days");
}

module.exports = {
  checkMinusSplitInStringDate,
  checkValidDate,
  checkStartDateBeforeEnd,
  totalDays,
};
