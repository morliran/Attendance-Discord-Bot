const dbConnectionService = require("./dbConnectionService");

class KnexConnection {
  constructor() {
    this.knex = require("knex")(dbConnectionService.con_conf);
  }

  async newAttendance(
    user_id,
    user_name,
    from,
    until,
    total,
    reason,
    serverId
  ) {
    try {
      const res = await this.knex("attendance").insert({
        user_id,
        user_name,
        from,
        until,
        total,
        reason,
        serverId,
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  async deleteAllAttendanceOfUser(userId, serverId) {
    try {
      return await this.knex("attendance")
        .where({ user_id: userId, server_id: serverId })
        .del();
    } catch (error) {
      throw error;
    }
  }

  async deleteAttendanceByEndDateOfUser(userId, endDate, serverId) {
    try {
      return await this.knex("attendance")
        .where({ user_id: userId, until: endDate, server_id: serverId })
        .del();
    } catch (error) {
      throw error;
    }
  }

  async deleteAttendanceByStartDateOfUser(userId, startDate, serverId) {
    try {
      return await this.knex("attendance")
        .where({ user_id: userId, from: startDate, server_id: serverId })
        .del();
    } catch (error) {
      throw error;
    }
  }

  async updateEndDate(theAttendance, attendanceNewEndDate) {
    try {
      return await this.knex("attendance")
        .where({
          user_id: theAttendance.user_id,
          until: theAttendance.until,
          server_id: theAttendance.server_id,
        })
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
        .where({
          user_id: theAttendance.user_id,
          until: theAttendance.until,
          server_id: theAttendance.server_id,
        })
        .update({
          reason: attendanceNewReason,
        });
    } catch (error) {
      throw error;
    }
  }

  async getAllAttendance(serverId) {
    try {
      return await this.knex.select().table("attendance").where({
        server_id: serverId,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceOfUser(userId, serverId) {
    try {
      return await this.knex("attendance").where({
        user_id: userId,
        server_id: serverId,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceOfUserByEndDate(userId, endDate, serverId) {
    try {
      return await this.knex("attendance")
        .where({
          user_id: userId,
          until: endDate,
          server_id: serverId,
        })
        .first();
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceOfUserByStartDate(userId, startDate, serverId) {
    try {
      return await this.knex("attendance")
        .where({
          user_id: userId,
          from: startDate,
          server_id: serverId,
        })
        .first();
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceByEndDate(endDate, serverId) {
    try {
      return await this.knex("attendance").where({
        until: endDate,
        server_id: serverId,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAttendanceByStartDate(startDate, serverId) {
    try {
      return await this.knex("attendance").where({
        from: startDate,
        server_id: serverId,
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new KnexConnection();
