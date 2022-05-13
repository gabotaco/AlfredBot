const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {       
        bot.con.query(`SELECT * FROM applications WHERE discord_id = '${args.author_id}' ORDER BY id DESC`, function (err, result, fields) {
            if (err) {
                console.log(err)
                return reject("Unable to get applications");
            }
            if (result.length < 1) {
                return resolve(`Unable to find <@${args.author_id}>'s application.`)
            } else {
                return resolve(`<@${args.author_id}>'s application status is: ${result[0].status} ${result[0].status_info ? `(${result[0].status_info})` : ""}`)
            }
        })
    })
}

module.exports.help = {
    name: "status",
    aliases: [],
    usage: "",
    description: "Get your application status",
    args: [],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}