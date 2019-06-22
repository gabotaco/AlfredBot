const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //If can't manage nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  if (message.guild.id == botconfig.RTSServer) var DefaultSignMeUp = botconfig.RTSSignMeUpIndex //Get the default sign me up in case there are no valid args
  else if (message.guild.id == botconfig.PIGSServer) var DefaultSignMeUp = botconfig.PIGSSignMeUpIndex

  if (args[0] && args[0].toLowerCase() == "rts") {
    var SignMeUpIndex = botconfig.RTSSignMeUpIndex
  } else if (args[0] && args[0].toLowerCase() == "pigs") {
    var SignMeUpIndex = botconfig.PIGSSignMeUpIndex
  } else {
    var SignMeUpIndex = DefaultSignMeUp
  }

  let FoundOne = false //Keep track of if there is at least one applicant

  authentication.authenticate().then(async (auth) => {
    await functions.FindApplicant(auth, message.channel, "", 0, SignMeUpIndex, function (row, index) { //Find applicant
      FoundOne = true

      if (row[8]) { //If they have a cooldown
        message.channel.send(`In-Game Name: "${row[4]}". In Game ID: "${row[5]}". Country: "${row[15]}". Cooldown: "${row[8]}"`, { //send their basic app info
          code: "ml"
        })
      } else { //If they don't have a cooldown
        message.channel.send(`In-Game Name: "${row[4]}". In Game ID: "${row[5]}". Country: "${row[15]}".`, { //send their basic app info without cooldown
          code: "ml"
        })
      }
    })

    if (!FoundOne) { //If didn't find one
      message.channel.send("No new applicants")
      return;
    }
  });
}

module.exports.help = {
  name: "applicants",
  usage: "",
  description: "Sends a list of un processed applicants",
  permission: "KICK_MEMBERS"
}