require("dotenv").config();

const { Client } = require("discord.js");
const ytdl = require("ytdl-core");
const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = `!`;

const queue = new Map();

const client = new Client();
// const msgEmbed = require("./utils/MsgEmbed");
// const rules = require("./utils/rules.json");

client.on("message", async (message) => {
  console.log(message.content);

  if (message.author.bot) return;

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.substring(PREFIX.length).split(" ");
  const serverQueue = queue.get(message.guild.id);

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

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url,
    };

    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
      };
      queue.set(message.guild.id, queueConstruct);
      queueConstruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();

        queueConstruct.connection = connection;

        play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        queue.delete(message.guild.id);

        return message.channel.send(
          "There was an error connecting to the voice channel"
        );
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`**${song.title}** has been added the queue`);
    }

    return;

    //
  } else if (message.content.startsWith(`${PREFIX}stop`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to stop music"
      );

    if (!serverQueue) return message.channel.send("There is nothing playing");

    serverQueue.songs = [];

    serverQueue.connection.dispatcher.end();

    message.channel.send("I have stoped the music for you");

    return undefined;

    //
  } else if (message.content.startsWith(`${PREFIX}skip`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in voice channel to skip the music"
      );

    if (!serverQueue) return message.channel.send("There nothing playing");
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

const play = (guild, song) => {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    });

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(TOKEN);
