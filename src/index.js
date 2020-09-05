require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const MsgEmbed = require("./utils/MsgEmbed");

const TOKEN = process.env.DISCORD_TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  console.log(msg.content);
  if (msg.content.toLocaleLowerCase() === "hola") msg.reply("hola");
  if (msg.content.toLocaleLowerCase() === "avatar")
    msg.reply(msg.author.displayAvatarURL());

  msg.channel.send(MsgEmbed());
});

client.login(TOKEN);
