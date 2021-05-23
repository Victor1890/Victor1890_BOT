const getMusicPlay = require("./getMusicPlay");

const handleVideo = async ({
  video,
  message,
  voiceChannel,
  playList = false,
  queue,
  ytdl,
}) => {
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
      loop: false,
    };
    queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      getMusicPlay({
        guild: message.guild,
        song: queueConstruct.songs[0],
        queue,
        ytdl,
      });
    } catch (error) {
      queue.delete(message.guild.id);
      return message.channel.send(
        "There was an error connecting to the voice channel",
      );
    }
  } else {
    serverQueue.songs.push(song);
    if (playList) return undefined;
    return message.channel.send(`**${song.title}** has been added the queue`);
  }
};

module.exports = handleVideo;
