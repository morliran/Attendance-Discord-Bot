require("dotenv").config();
const Client = require("./structures/client.js");

const client = new Client();

client.start(process.env.TOKEN);
