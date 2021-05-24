const PlayMusic = require("./play");
const PauseMusic = require("./pause");
const LoopMusic = require("./loop");
const QueueMusic = require("./queue");
const ResumeMusic = require("./resume");
const SkipMusic = require("./skip");
const StopMusic = require("./stop");
const VolumeMusic = require("./volumen");
const config = require("../config/config");

const Youtube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const queue = new Map();
const youtube = new Youtube(config.Y_TOKEN);

const command = (message, { PREFIX = "!" }) => {
  if (!message.content.startsWith(PREFIX)) return;

  if (!message.channel.name.includes("music"))
    return message.channel.send(`Please go to the __**music**__ channel`);

  const args = message.content.substring(PREFIX.length).split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${PREFIX}play`)) {
    PlayMusic({ message, youtube, searchString, url, ytdl });
  } else if (message.content.startsWith(`${PREFIX}pause`)) {
    PauseMusic({ message, serverQueue });
  } else if (message.content.startsWith(`${PREFIX}stop`)) {
    StopMusic({ message, serverQueue });
  } else if (message.content.startsWith(`${PREFIX}skip`)) {
    SkipMusic({ message, serverQueue });
  } else if (message.content.startsWith(`${PREFIX}loop`)) {
    LoopMusic({ serverQueue, message });
  } else if (message.content.startsWith(`${PREFIX}resume`)) {
    ResumeMusic({ serverQueue, message });
  } else if (message.content.startsWith(`${PREFIX}queue`)) {
    QueueMusic({ serverQueue, message });
  } else if (message.content.startsWith(`${PREFIX}volume`)) {
    VolumeMusic({ serverQueue, message, args });
  } else if (message.content.startsWith(`${PREFIX}rules`)) {
    return;
  }
};

module.exports = { command };
