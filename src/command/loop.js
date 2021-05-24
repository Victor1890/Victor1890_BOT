const LoopMusic = ({ serverQueue, message }) => {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You need to be in a voice channel to use music command",
    );
  if (!serverQueue) return message.channel.send("There is nothing playing");
  serverQueue.loop = !serverQueue.loop;
  return message.channel.send(
    `I have now ${serverQueue.loop ? `**Enabled**` : `**Disabled**`} loop`,
  );
};

module.exports = LoopMusic;
