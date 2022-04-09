const dbConnectionService = require("./dbConnectionService");

class KnexConnection {
  constructor() {
    this.knex = require("knex")(dbConnectionService.con_conf);
  }

  async newServer(server_id, server_name) {
    try {
      const res = await this.knex("servers").insert({
        server_id,
        server_name,
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  async deleteServerById(serverId) {
    try {
      return await this.knex("servers").where({ server_id: serverId }).del();
    } catch (error) {
      throw error;
    }
  }

  async updateServerName(theServer, serverNewName) {
    try {
      return await this.knex("servers")
        .where({
          server_id: theServer.server_id,
          server_name: theServer.server_name,
        })
        .update({
          server_name: serverNewName,
        });
    } catch (error) {
      throw error;
    }
  }

  async getAllServers() {
    try {
      return await this.knex.select().table("servers");
    } catch (error) {
      throw error;
    }
  }

  async getServerId(serverName) {
    try {
      return await this.knex("servers")
        .where({
          server_name: serverName,
        })
        .first();
    } catch (error) {
      throw error;
    }
  }

  async getServerName(serverId) {
    try {
      return await this.knex("servers")
        .where({
          server_id: serverId,
        })
        .first();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new KnexConnection();
