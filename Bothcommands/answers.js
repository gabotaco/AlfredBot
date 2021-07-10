const Discord = require("discord.js")
const functions = require("../functions.js")
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    let AnswersEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")

    const SearchColumn = functions.GetSearchColumn(args.id || args.member);

    bot.con.query(`SELECT in_game_name, why, anything, play_per_week, app_id, status FROM applications WHERE ${SearchColumn} = '${args.id || args.member}'`, function (err, result, fields) {
      if (err) {
        console.log(err)
        return reject("There was an error getting the answers")
      }
      result.forEach(applicant => {
        AnswersEmbed.setTitle(`Answers for ${applicant.in_game_name}`) //Add answers
        AnswersEmbed.addField("This sounds serious but it's totally not! Why should we choose you?", applicant.why)
        if (applicant.anything) AnswersEmbed.addField("Say anything! (Hobbies, interests, field of work, whatever makes you, you!)", applicant.anything)
        AnswersEmbed.addField("How much do you play per week right now?", applicant.play_per_week)
        if (applicant.status == "Received") functions.UpdateApplicantStatus(bot.con, applicant.app_id, "Under review") //Set it to Under review
      });
      if (!AnswersEmbed.fields[0]) { //no added fields
        return resolve("Couldn't find that applicant")
      }
      return resolve(AnswersEmbed)
    })
  })
}

module.exports.help = {
  name: "answers",
  aliases: ["ans"],
  usage: "<in game id|Discord>",
  description: "Get long answers for a member",
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
    }
  ],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  slash: true
}