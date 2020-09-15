const { Client } = require("discord.js");
const config = require("./config/config");
const client = new Client();
const Play = require("./command/music");
const msgEmbed = require("./utils/MsgEmbed");
const rules = require("./utils/rules.json");

const PREFIX = "!";

client.on("message", async (message) => {
  if (message.author.bot) return;

  Play(message, PREFIX);

  if (message.content.toLocaleLowerCase() === "!rules") {
    message.channel.send(
      msgEmbed({
        authorName: message.author.username,
        title: rules.customMessage,
        content: rules.rules,
      })
    );
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.D_TOKEN);
