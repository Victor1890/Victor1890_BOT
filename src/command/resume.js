const ResumeMusic = ({ serverQueue, message }) => {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You need to be in a voice channel to use music command",
    );
  if (!serverQueue) return message.channel.send("There is nothing playing");
  if (!serverQueue.playing)
    return message.channel.send("The music is already paused");

  serverQueue.playing = true;
  serverQueue.connection.dispatcher.resume();
  message.channel.send("I have resumed the music for you");
};

module.exports = ResumeMusic;
