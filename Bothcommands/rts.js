const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Ask a manager to do this for you") //If can't kick members

    if (!args[0]) return message.channel.send("You must specify who you are transferring") //gotta specify

    const Response = functions.GetIDAndSearchColumn(message, args);
    if (Response.length == 0) return message.channel.send("Please specify who you are transferring")
    const SearchColumn = Response[0]
    const ID = Response[1];

    bot.con.query(`UPDATE members SET company = 'rts' WHERE ${SearchColumn} = '${ID}'`, function (err, result, fields) { //set company
        if (err) console.log(err)
        message.channel.send("Transferred to RTS")
    })
}

module.exports.help = {
    name: "rts",
    usage: "[person]",
    description: "Move someone to rts",
    permission: "KICK_MEMBERS"
}