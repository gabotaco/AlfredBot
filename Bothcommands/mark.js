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

  const InGameID = await functions.GetInGameID(bot, args[0]);
  if (!InGameID) return message.channel.send("Invalid Discord ID");

  authentication.authenticate().then(async (auth) => {
    functions.ProcessAllInRange(auth, botconfig.Applications, botconfig.ApplicationRange, message.channel, function (row) { //go through all applicants
      if (parseInt(row[botconfig.ApplicationRefferalCode]) == InGameID) { //if there is a refferal code that is valid int
        functions.UpdateApplicantStatus(auth, message.channel, row[botconfig.ApplicationInGameIDIndex], SignMeUpIndex, "Paid", botconfig.ApplicationRefferalStatusColumn);
      }
    })
  });
}

module.exports.help = {
  name: "mark",
  usage: "",
  description: "Marks referal as paid",
  permission: "ADMINISTRATOR"
}