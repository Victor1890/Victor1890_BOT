const getMusicPlay = ({ guild, song, queue, ytdl }) => {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      if (!serverQueue.loop) serverQueue.songs.shift();
      getMusicPlay({ guild, song: serverQueue.songs[0] });
    });

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
};

module.exports = getMusicPlay;
