require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const msgEmbed = require("./utils/MsgEmbed");
const rules = require("./utils/rules.json");

const TOKEN = process.env.DISCORD_TOKEN;

client.on("message", (msg) => {
  console.log(msg.content);
  if (msg.content.toLocaleLowerCase() === "!rules") {
    msg.channel.send(
      msgEmbed({
        authorName: msg.author.username,
        title: rules.customMessage,
        content: rules.rules,
      })
    );
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(TOKEN);
