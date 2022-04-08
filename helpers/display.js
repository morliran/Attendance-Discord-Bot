const Discord = require("discord.js");

function displaySplitMessageEmbed(the_array, message, client, embedTitle) {
  let randColor = "#" + Math.random().toString(16).slice(-6); // six-number format aka #abc123
  for (let i = 0; i < the_array.length; i++) {
    let embed = new Discord.MessageEmbed()
      .setTitle(embedTitle)
      .setColor(randColor)
      .setFooter({ text: `${client.user.username}` });
    embed.addFields([
      {
        name: "Username:",
        value: `${the_array[i].user_name}`,
      },
      {
        name: "From:",
        value: `${the_array[i].from}`,
      },
      {
        name: "Until:",
        value: `${the_array[i].until}`,
      },
      {
        name: "Total:",
        value: `${the_array[i].total}`,
      },
      {
        name: "Reason:",
        value: `${the_array[i].reason}`,
      },
    ]);
    message.channel.send({ embeds: [embed] });
  }
}

module.exports = { displaySplitMessageEmbed };
