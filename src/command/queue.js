const QueueMusic = ({ serverQueue, message }) => {
  if (!serverQueue) return message.channel.send("There is nothing playing");
  message.channel.send(
    `__**Song Queue**__
    ${serverQueue.songs.map((song) => `**-** ${song.title}`).join("\n")}

    **Now Playing:** ${serverQueue.songs[0].title}
    `,
    { split: true },
  );
};

module.exports = QueueMusic;
