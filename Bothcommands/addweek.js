const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("No can do.") //if can't kick members

    const Response = functions.GetIDAndSearchColumn(message, args);
    if (Response.length == 0) return message.channel.send("You didn't specify a valid member") //if no args
    const SearchColumn = Response[0]
    const ID = Response[1]

    bot.con.query(`UPDATE members SET deadline = DATE_ADD(deadline, INTERVAL 7 DAY) WHERE ${SearchColumn}='${ID}'`, function (err, result, fields) { //adds 7 days to deadline
        if (err) console.log(err)
        else message.channel.send(`Updated deadline.`)
    })
}

module.exports.help = {
    name: "addweek",
    usage: "[in game id or discord]",
    description: "Add a week to a person's deadline",
    permission: "KICK_MEMBERS"
}