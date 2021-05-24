const { Client } = require("discord.js");
const { command } = require("./command");
const config = require("./config/config");
const client = new Client();
const msgEmbed = require("./utils/MsgEmbed");
const rules = require("./utils/rules.json");

const PREFIX = "!";

client.on("message", (message) => {
  if (message.author.bot) return;

  command({ message });

  if (message.content.toLocaleLowerCase() === "!rules") {
    message.channel.send(
      msgEmbed({
        authorName: message.author.username,
        title: rules.customMessage,
        content: rules.rules,
      }),
    );
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.D_TOKEN);
