const mysql2 = require("mysql2");

class DbConnection {
  constructor() {
    this.con_conf = {
      client: "mysql2",
      connection: {
        host: "eu-cdbr-west-02.cleardb.net",
        database: "heroku_894fe4745785d91",
        user: "b38fe9b8af3a69",
        password: "8d749356",
      },
    };
  }
}

module.exports = new DbConnection();
