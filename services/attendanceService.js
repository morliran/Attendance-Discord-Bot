const dbConnectionService = require("./dbConnectionService");

class KnexConnection {
  constructor() {
    this.knex = require("knex")(dbConnectionService.con_conf);
  }

  async newAttendance(user_id, user_name, from, until, total, reason) {
    try {
      const res = await this.knex("attendance").insert({
        user_id,
        user_name,
        from,
        until,
        total,
        reason,
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  async deleteAllAttendanceOfUser(userId) {
    try {
      return await this.knex("attendance").where({ user_id: userId }).del();
    } catch (error) {
      throw error;
    }
  }

  async deleteAttendanceByEndDateOfUser(userId, endDate) {
    try {
      return await this.knex("attendance")
        .where({ user_id: userId, until: endDate })
        .del();
    } catch (error) {
      throw error;
    }
  }

  async deleteAttendanceByStartDateOfUser(userId, startDate) {
    try {
      return await this.knex("attendance")
        .where({ user_id: userId, from: startDate })
        .del();
    } catch (error) {
      throw error;
    }
  }

  async updateEndDate(theAttendance, attendanceNewEndDate) {
    try {
      return await this.knex("attendance")
        .where({ user_id: theAttendance.user_id, until: theAttendance.until })
        .update({
          until: attendanceNewEndDate,
        });
    } catch (error) {
      throw error;
    }
  }

  async updateEndDateReason(theAttendance, attendanceNewReason) {
    try {
      return await this.knex("attendance")
        .where({ user_id: theAttendance.user_id, until: theAttendance.until })
        .update({
          reason: attendanceNewReason,
        });
    } catch (error) {
      throw error;
    }
  }

  async getAllAttendance() {
    try {
      return await this.knex.select().table("attendance");
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceOfUser(userId) {
    try {
      return await this.knex("attendance").where({
        user_id: userId,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceOfUserByEndDate(userId, endDate) {
    try {
      return await this.knex("attendance")
        .where({
          user_id: userId,
          until: endDate,
        })
        .first();
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceOfUserByStartDate(userId, startDate) {
    try {
      return await this.knex("attendance")
        .where({
          user_id: userId,
          from: startDate,
        })
        .first();
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceByEndDate(endDate) {
    try {
      return await this.knex("attendance").where({
        until: endDate,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceByStartDate(startDate) {
    try {
      return await this.knex("attendance").where({
        from: startDate,
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new KnexConnection();
