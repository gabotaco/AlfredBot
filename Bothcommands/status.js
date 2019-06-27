const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (message.member.hasPermission("KICK_MEMBERS") && args[0]) { //if they can kick members and provides an ID
    var ID = args[0]
  } else if (args[0]) { //can't kick members but provides ID
    message.channel.send("You can't check someone elses application. Searching for yours instead...")
  }

  if (message.guild.id == botconfig.PIGSServer) {
    var SignMeUpIndex = botconfig.PIGSSignMeUpIndex
  } else if (message.guild.id == botconfig.RTSServer) {
    var SignMeUpIndex = botconfig.RTSSignMeUpIndex
  }

  authentication.authenticate().then(async (auth) => {
    let FoundMember = false; //haven't found member
    if (!ID) {
      await functions.FindApplicant(auth, message.channel, message.member.user.tag, botconfig.ApplicationDiscordIndex, SignMeUpIndex, function (row) { //Find member by discord
        FoundMember = true;
        if (!row[0]) message.channel.send("We have received your application.") //Nothing in status
        else message.channel.send(`Your current application status is: ${row[0]}`) //Send status
      })
    } else { //Provided ID
      await functions.FindApplicant(auth, message.channel, ID, botconfig.ApplicationInGameIDIndex, SignMeUpIndex, function (row) { //Find member by ID
        FoundMember = true;
        if (!row[0]) message.channel.send("We have received your application.") //Nothing in status
        else message.channel.send(`Your current application status is: ${row[0]}`) //Send status
      })
    }
  
    if (!FoundMember) { //Didn't find an application
      message.channel.send("Couldn't find that applicant")
      return;
    }
  });

}

module.exports.help = {
  name: "status",
  usage: "[in game id]",
  description: "Get application status for a member",
  permission: "KICK_MEMBERS"
}