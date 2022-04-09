require("dotenv").config();
const Client = require("./structures/client.js");

const client = new Client();

console.log(client);

client.start(process.env.TOKEN);
