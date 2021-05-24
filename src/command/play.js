const handleVideo = require("../utils/handleVideo");

const PlayMusic = async ({
  message,
  youtube,
  searchString,
  url,
  ytdl,
  queue,
}) => {
  //Play music
  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel)
    return message.channel.send("You need to be in a voice channel to play");

  const permission = voiceChannel.permissionsFor(message.client.user);

  if (!permission.has("CONNECT"))
    return message.channel.send(
      `I don't have permissions to connect to the voice channel`,
    );

  if (!permission.has("SPEAK"))
    return message.channel.send(
      `I don't have permissions to 'Speak' in the voice channel`,
    );

  if (
    url.match(/https?:\/\/(www.youtube.com | youtube.com) \/ playlist(.*)$/)
  ) {
    const playList = await youtube.getPlaylist(url);
    const videos = await playList.getVideos();

    for (const video of Object.values(videos)) {
      const videos2 = await youtube.getVideoByID(video);
      await handleVideo({
        videos2,
        message,
        voiceChannel,
        playList: true,
        queue,
        ytdl,
      });
    }
    message.channel.send(
      `Playlist **${playList.title}** has been added to the queue`,
    );
  } else {
    try {
      var video = await youtube.getVideoByID(url);
    } catch (error) {
      try {
        var videos = await youtube.searchVideos(searchString, 10);
        var index = 0;
        message.channel.send(`
                __**Song Selection**__
                ${videos
                  .map((videos2) => `**${++index} -** ${videos2.title}`)
                  .join("\n")}

                Please select one for the song ranging from 1-10`);

        try {
          var response = await message.channel.awaitMessages(
            (msg) => msg.content > 0 && msg.content < 11,
            {
              max: 1,
              time: 30000,
              errors: ["time"],
            },
          );
        } catch (error) {
          message.channel.send(`No or invalid song selection was provided`);
        }
        const videoIndex = parseInt(response.first().content);
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      } catch (error) {
        message.channel.send(`I couldn't find any search results`);
      }
    }
    return handleVideo({ video, message, voiceChannel, queue, ytdl });
  }
};

module.exports = PlayMusic;
