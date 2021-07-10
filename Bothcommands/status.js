const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        let ID = args.author_id
        if (bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id).hasPermission("KICK_MEMBERS")) {
            if (args.member) ID = args.member;
        }

        bot.con.query(`SELECT * FROM applications WHERE discord_id = '${ID}' ORDER BY app_id DESC`, function (err, result, fields) {
            if (err) {
                console.log(err)
                return reject("Unable to get applications");
            }
            if (result.length < 1) {
                return resolve(`Unable to find <@${ID}>'s application.`)
            } else {
                return resolve(`<@${ID}>'s application status is: ${result[0].status} ${result[0].reason ? `(${result[0].reason})` : ""}`)
            }
        })
    })
}

module.exports.help = {
    name: "status",
    aliases: [],
    usage: "[discord member]",
    description: "Get your application status",
    args: [{
        name: "id",
        description: "Get an applicant status using their ID",
        type: 1,
        options: [{
            name: "id",
            description: "Their in game id or discord id",
            type: 4,
            required: true,
            missing: "Please specify another applicant",
            parse: (bot, message, args) => {
              if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
              return args[0]
            }
          }
        ],
      },
      {
        name: "discord",
        description: "Get an applicant status using their discord",
        type: 1,
        options: [{
            name: "member",
            description: "the other discord user",
            type: 6,
            required: true,
            missing: "Please specify another applicant",
            parse: (bot, message, args) => {
              if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
              return args[0]
            }
          }
        ]
      },
      {
        name: "self",
        description: "Get your own application status",
        type: 1,
        options: []
      }
    ],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}