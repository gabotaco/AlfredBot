const botconfig = require("../botconfig.json");
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("No") //If can't kick members

    const Response = functions.GetIDAndSearchColumn(message, args);
    if (Response.length == 0) return message.channel.send("Please specify who you want to check the fire reason of.")
    const SearchColumn = Response[0]
    const ID = Response[1]


    bot.con.query(`SELECT fire_reason, company FROM members WHERE ${SearchColumn} = '${ID}'`, function (err, result, fields) {
        if (err) console.log(err);
        if (!result) message.channel.send("Unable to find that member")
        else if (result[0].company != "fired") message.channel.send("That person isn't fired")
        else message.channel.send(result[0].fire_reason)
    })
}

module.exports.help = {
    name: "firereason",
    usage: "[in game id]",
    description: "Get the reason why someone was fired",
    permission: "KICK_MEMBERS"
}