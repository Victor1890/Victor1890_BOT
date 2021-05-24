const VolumenMusic = ({ serverQueue, args, message }) => {
  console.log(args[1]);
  if (!message.member.voice.channel)
    return message.channel.send(
      "You need to be in a voice channel to use music command",
    );
  if (!serverQueue) return message.channel.send("There is nothing playing");
  if (!args[1])
    return message.channel.send(`That volume is: **${serverQueue.volume}**`);
  if (isNaN(args[1]))
    return message.channel.send(
      `That is not valid amount to change the volume to`,
    );
  serverQueue.volume = args[1];
  try {
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
  } catch (error) {
    console.log(error.message);
  }
  console.log(serverQueue.connection);
  message.channel.send(`I have changed the volume to: **${args[1]}**`);
};

module.exports = VolumenMusic;
