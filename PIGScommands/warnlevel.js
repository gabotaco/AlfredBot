const functions = require("../functions.js")
const botconfig = require("../botconfig")
module.exports.run = async (bot, args) => {
    return new Promise(async (resolve, reject) => {
        const ID = args.id || args.member
        if (!bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id).hasPermission("KICK_MEMBERS") && ID) {
            return resolve("You aren't allowed to specify another member.")
        }
        if (!ID) ID = args.author_id;

        const SearchColumn = functions.GetSearchColumn(ID)

        bot.con.query(`SELECT warnings, discord_id FROM members WHERE ${SearchColumn} = '${ID}'`, function (err, result, fields) { //get the warning number for the member
            if (err) {
                console.log(err)
                return reject("Unable to get warnings table.")
            }
            if (result.length == 0) return resolve("Not hired") //not hired
            resolve(`<@${result[0].discord_id}> has ${result[0].warnings} warnings`) //hired
        })
    })
}

module.exports.help = {
    name: "warnlevel",
    aliases: ["wl"],
    usage: "[member]",
    description: "Check how many warns you have",
    args: [{
            name: "id",
            description: "Get the warnlevels of an employee using their id",
            type: 1,
            options: [{
                name: "id",
                description: "Their in game id or discord id",
                type: 4,
                required: true,
                parse: (bot, message, args) => {
                    if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
                    return args[0]
                }
            }],
        },
        {
            name: "discord",
            description: "Get the warnlevels of an employee using their discord",
            type: 1,
            options: [{
                name: "member",
                description: "the other discord user",
                type: 6,
                required: true,
                parse: (bot, message, args) => {
                    if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
                    return args[0]
                }
            }]
        },
        {
          name: "self",
          description: "Get your own warnlevel",
          type: 1,
          options: []
        }
    ],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}