const StopMusic = ({ message, serverQueue }) => {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You need to be in a voice channel to stop music",
    );
  if (!serverQueue) return message.channel.send("There is nothing playing");
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  message.channel.send("I have stoped the music for you");
};

module.exports = StopMusic;
