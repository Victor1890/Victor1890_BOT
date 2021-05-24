const SkipMusic = async ({ message, serverQueue }) => {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You need to be in voice channel to skip the music",
    );
  if (!serverQueue) return message.channel.send("There nothing playing");
  serverQueue.connection.dispatcher.end();
  message.channel.send("I have skipped to music for you");
};

module.exports = SkipMusic;
