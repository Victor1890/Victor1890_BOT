const { MessageEmbed } = require("discord.js");

const MsgEmbed = (title, author, description) => {
  const _MsgEmbed = new MessageEmbed()
    .setTitle(title || "Welcome to the Server")
    .setAuthor(author || "Victor1890")
    .setColor("#0EEAFF")
    .setDescription(description || "Description");
  return _MsgEmbed;
};

module.exports = MsgEmbed;
