const Discord = require("discord.js")
const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //If can't manage nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  const ID = args[0]

  if (ID) { //if specified
    const today = new Date()
    functions.UpdateApplicantStatus(bot.con, message.channel, ID, `Contacted`, `${message.author.displayName}: ${today.toDateString()}`) //Updates

  } else { //If nobody specified
    bot.con.query(`SELECT * FROM applications WHERE status = 'Contacted'`, function (err, result, fields) {
      if (err) {
        console.log(err)
        message.channel.send("An error occured")
      } else {
        let reqEmbed = new Discord.MessageEmbed()
          .setTitle("Contacted Applications")
          .setColor("RANDOM")

        result.forEach(applicant => {
          reqEmbed.addField(applicant.in_game_name + " (" + applicant.in_game_id + ")", applicant.reason) //Adds them to embed

        });
        if (!reqEmbed.fields[0]) { //if there aren't any fields in the embed
          message.channel.send("Nobody is contacted")
        } else { //If there are fields
          message.channel.send(reqEmbed)
        }
      }
    })
  }
}

module.exports.help = {
  name: "contacted",
  usage: "{in game id}",
  description: "Mark an applicant as contacted.",
  permission: "KICK_MEMBERS"
}