const Discord = require("discord.js")
const functions = require("../functions.js")
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    if (args.id) { //if specified
      const today = new Date()
      functions.UpdateApplicantStatus(bot.con, args.id || args.member, `Contacted`, `${bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id).displayName}: ${today.toDateString()}`).then((res) => {
        return resolve(res)
      })
    } else { //If nobody specified
      bot.con.query(`SELECT * FROM applications WHERE status = 'Contacted'`, function (err, result, fields) {
        if (err) {
          console.log(err)
          return reject("Couldn't get applicants.")
        }
        let reqEmbed = new Discord.MessageEmbed()
          .setTitle("Contacted Applications")
          .setColor("RANDOM")
  
        result.forEach(applicant => {
          reqEmbed.addField(applicant.in_game_name + " (" + applicant.in_game_id + ")", applicant.reason) //Adds them to embed
        });
        if (!reqEmbed.fields[0]) { //if there aren't any fields in the embed
          return resolve("Nobody is contacted")
        } else { //If there are fields
          return resolve(reqEmbed)
        }
      })
    }
  })
}

module.exports.help = {
  name: "contacted",
  aliases: [],
  usage: "[in game id]",
  description: "Mark an applicant as contacted.",
  args: [{
    name: "id",
    description: "The ID of the applicant",
    type: 1,
    options: [{
      name: "id",
      description: "Their in game id or discord id",
      type: 4,
      required: true,
      missing: "Please specify an applicant",
      parse: (bot, message, args) => {
        if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
        return args[0]
      }
    }],
  },
  {
    name: "discord",
    description: "The applicants Discord",
    type: 1,
    options: [{
      name: "member",
      description: "the other discord user",
      type: 6,
      required: true,
      missing: "Please specify an applicant",
      parse: (bot, message, args) => {
        if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
        return args[0]
      }
    }]
  }],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  slash: true
}