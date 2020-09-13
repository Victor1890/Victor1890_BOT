require("dotenv").config();

const { Client } = require("discord.js");
const ytdl = require("ytdl-core");
const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = `!`;

const client = new Client();
// const msgEmbed = require("./utils/MsgEmbed");
// const rules = require("./utils/rules.json");

client.on("message", async (message) => {
  console.log(message.content);

  if (message.author.bot) return;

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.substring(PREFIX.length).split(" ");

  if (message.content.startsWith(`${PREFIX}play`)) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send("You need to be in a voice channel to play");
    const permission = voiceChannel.permissionsFor(message.client.user);
    if (!permission.has("CONNECT"))
      return message.channel.send(
        `I don't have permissions to connect to the voice channel`
      );
    if (!permission.has("SPEAK"))
      return message.channel.send(
        `I don't have permissions to 'Speak' in the voice channel`
      );

    try {
      var connection = await voiceChannel.join();
    } catch (error) {
      return message.channel.send(
        "There was an error connecting to the voice channel"
      );
    }

    const dispatcher = connection.play(ytdl(args[1])).on("finish", () => {
      voiceChannel.leave();
    });
    dispatcher.setVolumeLogarithmic(5 / 5);
  } else if (message.content.startsWith(`${PREFIX}stop`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to stop music"
      );

    message.member.voice.channel.leave();
    return undefined;
  }
  // if (message.content.toLocaleLowerCase() === "!rules") {
  //   message.channel.send(
  //     msgEmbed({
  //       authorName: message.author.username,
  //       title: rules.customMessage,
  //       content: rules.rules,
  //     })
  //   );
  // }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(TOKEN);
