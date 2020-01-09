const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) { //If can't manage nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  if (message.guild.id == botconfig.RTSServer) {
    var SignMeUpIndex = botconfig.RTSSignMeUpIndex //Get the default sign me up in case there are no valid args
  } else if (message.guild.id == botconfig.PIGSServer) {
    var SignMeUpIndex = botconfig.PIGSSignMeUpIndex
  }
  if (!args[1]) return message.channel.send(".addrefer [applicant in game id] [referer in game id]")

  authentication.authenticate().then(async (auth) => {
    functions.ProcessAllInRange(auth, botconfig.Applications, botconfig.ApplicationRange, message.channel, async function (row) { //go through all applicants
      if (row[botconfig.ApplicationInGameIDIndex] == args[0]) {
        await functions.UpdateApplicantStatus(auth, message.channel, row[botconfig.ApplicationInGameIDIndex], SignMeUpIndex, args[1], botconfig.ApplicationRefferalCodeColumn);
      }
    })
  });
}

module.exports.help = {
  name: "addrefer",
  usage: "",
  description: "Marks referal as paid",
  permission: "ADMINISTRATOR"
}