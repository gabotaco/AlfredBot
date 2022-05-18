const functions = require("../functions.js")
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
  return new Promise(async (resolve, reject) => {
    let user = args.id || args.member

    const SearchColumn = functions.GetSearchColumn(user); //check if they used discord id or ingame id

    const MemberInfo = await functions.GetMemberDetails(bot.con, SearchColumn, user) //Get their member info
    if (!MemberInfo) return resolve("Couldn't find that user") //no member data

    return resolve(`<@${MemberInfo.discord_id}>'s deadline: ${MemberInfo.deadline}`) //get the deadline and send it
  })
}

module.exports.help = {
  name: "deadline-m",
  aliases: [],
  usage: "<discord id or in game id>",
  description: "Gets the deadline of another user",
  args: [{
      name: "id",
      description: "Get a persons deadline using their id",
      type: 1,
      options: [{
        name: "id",
        description: "Their in game id or discord id",
        type: 4,
        required: true,
        missing: "Please specify another employee",
        parse: (bot, message, args) => {
          if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
          return args[0]
        }
      }],
    },
    {
      name: "discord",
      description: "Get a persons deadline using their discord",
      type: 1,
      options: [{
        name: "member",
        description: "the other discord user",
        type: 6,
        required: true,
        missing: "Please specify another employee",
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