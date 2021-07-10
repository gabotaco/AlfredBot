const botconfig = require("../botconfig.json")
const functions = require("../functions.js")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        let user = args.id || args.member;
        const SearchColumn = functions.GetSearchColumn(user); //check if they used discord id or ingame id
    
        bot.con.query(`SELECT in_game_id FROM members WHERE ${SearchColumn} = '${user}'`, function (err, results, fields) {
            if (err) {
                console.log(err)
                return reject("Problem selecting form mebers table.")
            }

            if (results.length == 0) return resolve("Couldn't find that member.")

            results.forEach(result => {
                bot.con.query(`DELETE FROM members WHERE in_game_id = '${result.in_game_id}'`, function (err, res, fields) {
                    if (err) {
                        console.log(err)
                        return reject("Couldn't delete the member.")
                    }
    
                    bot.con.query(`DELETE FROM pigs WHERE in_game_id = '${result.in_game_id}'`, function (err, res, fields) {
                        if (err) {
                            console.log(err)
                            return reject("Couldn't delete the PIGS member.")
                        }
    
                        bot.con.query(`DELETE FROM rts WHERE in_game_id = '${result.in_game_id}'`, function (err, res, fields) {
                            if (err) {
                                console.log(err)
                                return reject("Couldn't delete the RTS member.")
                            }
    
                            resolve(`Deleted`)
                        })
                    })
                })
            });
        })
    })
}

module.exports.help = {
    name: "delete",
    aliases: [],
    usage: "<in game id>",
    description: "Delete a member from database",
    args: [{
            name: "id",
            description: "Delete a person using their id",
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
            description: "Delete a person using their discord",
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