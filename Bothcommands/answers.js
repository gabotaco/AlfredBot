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

  let AnswersEmbed = new Discord.MessageEmbed()
    .setColor("RANDOM")

  bot.con.query(`SELECT in_game_name, why, anything, play_per_week, app_id, status WHERE in_game_id = '${ID}'`, function (err, result, fields) {
    if (err) {
      console.log(err)
      message.channel.send("There was an error")
    }
    result.forEach(applicant => {
      AnswersEmbed.setTitle(`Answers for ${applicant.in_game_name}`) //Add answers
      AnswersEmbed.addField("This sounds serious but it's totally not! Why should we choose you?", applicant.why)
      if (applicant.anything) AnswersEmbed.addField("Say anything! (Hobbies, interests, field of work, whatever makes you, you!)", applicant.anything)
      AnswersEmbed.addField("How much do you play per week right now?", applicant.play_per_week)
      if (applicant.status == "Received") functions.UpdateApplicantStatus(bot.con, message.channel, applicant.app_id, "Under review") //Set it to Under review

    });
  })

  if (!AnswersEmbed.fields[0]) { //no added fields
    message.channel.send("Couldn't find that applicant")
    return;
  }
  message.channel.send(AnswersEmbed)

}

module.exports.help = {
  name: "answers",
  usage: "[in game id]",
  description: "Get long answers for a member",
  permission: "KICK_MEMBERS"
}