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

  if (message.guild.id == botconfig.PIGSServer) var SignmeUpIndex = botconfig.PIGSSignMeUpIndex //PIGS Server then use PIGS sign me up
  else if (message.guild.id == botconfig.RTSServer) var SignmeUpIndex = botconfig.RTSSignMeUpIndex //RTS Server then use RTS sign me up
  
  if (ID) { //if specified
    authentication.authenticate().then(async (auth) => {
      const today = new Date()
      functions.UpdateApplicantStatus(auth, message.channel, ID, SignmeUpIndex, `Contacted as of ${months[today.getMonth()]} ${today.getDay()}`) //Updates
    });
  } else { //If nobody specified
    authentication.authenticate().then(async (auth) => {
      let reqEmbed = new Discord.RichEmbed()
        .setTitle("Contacted Applications")
        .setColor("RANDOM")

      await functions.FindApplicant(auth, message.channel, "Contacted", 0, SignmeUpIndex, function (row) { //Finds all applicants that are Contacted
        reqEmbed.addField(row[4] + " (" + row[0] + ")", row[5]) //Adds them to embed
      })

      if (!reqEmbed.fields[0]) { //if there aren't any fields in the embed
        message.channel.send("Nobody is contacted")
      } else { //If there are fields
        message.channel.send(reqEmbed)
      }
    });
  }
}

module.exports.help = {
  name: "contacted",
  usage: "{in game id}",
  description: "Mark an applicant as contacted.",
  permission: "KICK_MEMBERS"
}