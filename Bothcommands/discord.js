const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //If can't manage nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  const ID = args[0]
  if (!ID) return message.channel.send("You must specify their id")

  if (message.guild.id == botconfig.PIGSServer) { //pigs
    var SignMeUpIndex = botconfig.PIGSSignMeUpIndex
  } if (message.guild.id == botconfig.RTSServer) { //rts
    var SignMeUpIndex = botconfig.RTSSignMeUpIndex
  }

  authentication.authenticate().then(async (auth) => {
    const Discord = await functions.GetDiscordFromID(auth, message.channel, ID, SignMeUpIndex) //Gets discord ID or what they entered
    if (Discord) { //Found applicant
      const user = message.guild.members.cache.get(Discord) //Check if valid ID
      if (user) message.channel.send("<@" + Discord + ">") //if valid ID send the discord as an @
      else message.channel.send(Discord) //If not valid ID just send what they typed
    } else { //Didn't find applicant
      message.channel.send("Couldn't find that applicant")
    }
  });
}

module.exports.help = {
  name: "discord",
  usage: "[in game id]",
  description: "Get the discord an applicant",
  permission: "KICK_MEMBERS"
}