const Discord = require("discord.js")
const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //If can't manage nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  const ID = args[0]
  if (!ID) return message.channel.send("Must specify their id") //if no id

  authentication.authenticate().then(async (auth) => {
    let AnswersEmbed = new Discord.RichEmbed()
      .setColor("RANDOM")

    if (message.guild.id == botconfig.PIGSServer) var SignMeUpIndex = botconfig.PIGSSignMeUpIndex //Get the index of signmeup based on the guild the message is in
    else if (message.guild.id == botconfig.RTSServer) var SignMeUpIndex = botconfig.RTSSignMeUpIndex

    await functions.FindApplicant(auth, message.channel, ID, botconfig.ApplicationInGameIDIndex, SignMeUpIndex, function (row) { //Find the applicant
      AnswersEmbed.setTitle(`Answers for ${row[botconfig.ApplicationInGameNameIndex]}`) //Add answers
      AnswersEmbed.addField("This sounds serious but it's totally not! Why should we choose you?", row[botconfig.ApplicationWhyIndex])
      if (row[botconfig.ApplicationAnythingIndex]) AnswersEmbed.addField("Say anything! (Hobbies, interests, field of work, whatever makes you, you!)", row[botconfig.ApplicationAnythingIndex])
      AnswersEmbed.addField("How much do you play per week right now?", row[botconfig.ApplicationPlayTimeIndex])
      if (row[0] == "") { //If they don't have a status
        functions.UpdateApplicantStatus(auth, message.channel, ID, SignMeUpIndex, "Under review") //Set it to Under review
      }
    })


    if (!AnswersEmbed.fields[0]) { //no added fields
      message.channel.send("Couldn't find that applicant")
      return;
    }
    message.channel.send(AnswersEmbed)
  });

}

module.exports.help = {
  name: "answers",
  usage: "[in game id]",
  description: "Get long answers for a member",
  permission: "KICK_MEMBERS"
}