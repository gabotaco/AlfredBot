const functions = require("../functions.js")
const botconfig = require("../botconfig.json"); //handy info

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    const FireMember = args.id || args.member
    const SearchColumn = functions.GetSearchColumn(FireMember);

    if (args.reason.length > 120) return resolve(`Please shorten the leave reason to 120 characters`) //limit is 120 characters

    if (args.reason.includes("'")) return resolve("Please no ' characters") //can't have lil quotes

    bot.con.query(`UPDATE members SET company = 'fired', fire_reason = '${args.reason}', deadline = '${new Date().toISOString().slice(0, 19).replace('T', ' ')}' WHERE ${SearchColumn} = '${FireMember}'`, function (err, result, fields) { //update their company to fired and add fire reason and set deadline to the fired date
      if (err) {
        console.log(err)
        return reject("Couldn't update member.")
      }
      if (result.affectedRows == 0) return resolve("Unable to find that member")
      else {
        resolve("Fired.")
        bot.con.query(`SELECT discord_id FROM members WHERE ${SearchColumn} = '${FireMember}'`, function (err, result, fields) {
          if (err) {
            return console.log(err)
          }
          const roleArgs = {
            "guild_id": args.guild_id,
            "channel_id": args.channel_id,
            "author_id": args.author_id,
            "slash": args.slash,
            "member": result[0].discord_id
          }
          bot.BothCommands.get("roles").run(bot, roleArgs)
        })
      }
    })
  })
}

module.exports.help = {
  name: "fire",
  aliases: [],
  usage: "<member id> <reason>",
  description: "Fire a member",
  args: [{
      name: "id",
      description: "Fire an employee using their id",
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
      },
      {
        name: "reason",
        description: "Why they are getting fired.",
        type: 3,
        required: true,
        missing: "Please specify a reason",
        parse: (bot, message, args) => {
          return args.join(" ").slice(args[0].length); 
        }
      }],
    },
    {
      name: "discord",
      description: "Fire an employee using their discord",
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
      },
      {
        name: "reason",
        description: "Why they are getting fired.",
        type: 3,
        required: true,
        missing: "Please specify a reason",
        parse: (bot, message, args) => {
          return args.join(" ").slice(args[0].length); 
        }
      }]
    }
  ],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  slash: true
}