const VolumenMusic = ({ serverQueue, args, message }) => {
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
  serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
  message.channel.send(`I have changed the volume to: **${args[1]}**`);
};

module.exports = VolumenMusic;
