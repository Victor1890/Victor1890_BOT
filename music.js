const Youtube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const config = require("./src/config/config");
const handleVideo = require("./src/utils/handleVideo");
const queue = new Map();

const youtube = new Youtube(config.Y_TOKEN);

const Play = async (message, PREFIX) => {
  console.log(message.content);

  if (!message.content.startsWith(PREFIX)) return;

  if (!message.channel.name.includes("music"))
    return message.channel.send(`Please go to the __**music**__ channel`);

  const args = message.content.substring(PREFIX.length).split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${PREFIX}np`)) {
    if (!serverQueue) return message.channel.send("There is nothing playing");
    message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
  }
};

module.exports = Play;
