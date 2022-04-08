const fs = require("fs");

const Event = require("../structures/event.js");

require("dotenv").config();

module.exports = new Event("ready", (client) => {
  console.log(`${client.user.username} is online`);
  client.user.setActivity(`Use => ${process.env.BOT_PREFIX}help`, {
    type: "WATCHING",
  });
});
