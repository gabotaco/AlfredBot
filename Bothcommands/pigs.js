const botconfig = require("../botconfig.json");
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Ask a manager to do this for you") //If can't kick members

    if (!args[0]) return message.channel.send("You must specify who you are transferring") //if no args

    const Response = functions.GetIDAndSearchColumn(message, args);
    if (Response.length == 0) return message.channel.send("Please specify who you are transferring")
    const SearchColumn = Response[0]
    const ID = Response[1];

    bot.con.query(`UPDATE members SET company = 'pigs' WHERE ${SearchColumn} = '${ID}'`, function (err, result, fields) {
        if (err) console.log(err)
        message.channel.send("Transferred to PIGS")
    })
}

module.exports.help = {
    name: "pigs",
    usage: "[member id]",
    description: "Transfer someone to pigs",
    permission: "KICK_MEMBERS"
}