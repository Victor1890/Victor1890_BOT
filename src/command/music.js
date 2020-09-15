const Youtube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const config = require("../config/config");
const queue = new Map();

const youtube = new Youtube(config.Y_TOKEN);

const Play = async (message, PREFIX) => {
  console.log(message.content);

  if (!message.content.startsWith(PREFIX)) return;

  if (!message.channel.name.includes("music"))
    return message.channel.send(`Please go to the _**music**_ channel`);

  const args = message.content.substring(PREFIX.length).split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${PREFIX}play`)) {
    //Play music
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

    if (
      url.match(/https?:\/\/(www.youtube.com | youtube.com) \/ playlist(.*)$/)
    ) {
      const playList = await youtube.getPlaylist(url);
      const videos = await playList.getVideos();

      for (const video of Object.values(videos)) {
        const videos2 = await youtube.getVideoByID(video);
        await handleVideo(videos2, message, voiceChannel, true);
      }
      message.channel.send(
        `Playlist **${playList.title}** has been added to the queue`
      );
    } else {
      try {
        var video = await youtube.getVideoByID(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 1);
          var video = await youtube.getVideoByID(videos[0].id);
        } catch (error) {
          message.channel.send(`I couldn't find any search results`);
        }
      }
      return handleVideo(video, message, voiceChannel);
    }
  } else if (message.content.startsWith(`${PREFIX}stop`)) {
    //Stop music
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to stop music"
      );
    if (!serverQueue) return message.channel.send("There is nothing playing");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    message.channel.send("I have stoped the music for you");
  } else if (message.content.startsWith(`${PREFIX}skip`)) {
    //Skip music
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in voice channel to skip the music"
      );
    if (!serverQueue) return message.channel.send("There nothing playing");
    serverQueue.connection.dispatcher.end();
    message.channel.send("I have skipped to music for you");
  } else if (message.content.startsWith(`${PREFIX}volumen`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to use music command"
      );
    if (!serverQueue) return message.channel.send("There is nothing playing");
    if (!args[1])
      return message.channel.send(`That volume is: **${serverQueue.volume}**`);
    if (isNaN(args[1]))
      return message.channel.send(
        `That is not valid amount to change the volume to`
      );
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    message.channel.send(`I have changed the volume to: **${args[1]}**`);
  } else if (message.content.startsWith(`${PREFIX}np`)) {
    if (!serverQueue) return message.channel.send("There is nothing playing");
    message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
  } else if (message.content.startsWith(`${PREFIX}queue`)) {
    if (!serverQueue) return message.channel.send("There is nothing playing");
    message.channel.send(
      `__**Song Queue**__
    ${serverQueue.songs.map((song) => `**-** ${song.title}`).join("\n")}

    **Now Playing:** ${serverQueue.songs[0].title}
    `,
      { split: true }
    );
  } else if (message.content.startsWith(`${PREFIX}pause`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to use music command"
      );
    if (!serverQueue) return message.channel.send("There is nothing playing");
    if (!serverQueue.playing)
      return message.channel.send("The music is already paused");
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    message.channel.send("I have paused the music for you");
  } else if (message.content.startsWith(`${PREFIX}resume`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to use music command"
      );
    if (!serverQueue) return message.channel.send("There is nothing playing");
    if (!serverQueue.playing)
      return message.channel.send("The music is already paused");

    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    message.channel.send("I have resumed the music for you");
  }
};

const handleVideo = async (video, message, voiceChannel, playList = false) => {
  const serverQueue = queue.get(message.guild.id);

  const song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
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
      musicPlay(message.guild, queueConstruct.songs[0]);
    } catch (error) {
      queue.delete(message.guild.id);
      return message.channel.send(
        "There was an error connecting to the voice channel"
      );
    }
  } else {
    serverQueue.songs.push(song);
    if (playList) return undefined;
    return message.channel.send(`**${song.title}** has been added the queue`);
  }
};

const musicPlay = (guild, song) => {
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
      musicPlay(guild, serverQueue.songs[0]);
    });

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
};

module.exports = Play;
