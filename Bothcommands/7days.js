const functions = require("../functions.js");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("No can do.") //if can't kick members

    const response = functions.GetIDAndSearchColumn(message, args)
    if (response.length == 0) return message.channel.send("Please specify someone") //if no args

    const ID = response[1]
    const SearchColumn = response[0]

    let d = new Date()
    d.setDate(d.getDate() + 7) //add 7 days to date
    const newDeadline = d.toISOString().slice(0, 19).replace('T', ' ');
    
    functions.ChangeDeadline(bot, newDeadline, SearchColumn, ID, message.channel)
}

module.exports.help = {
    name: "7days",
    usage: "[in game id or discord]",
    description: "Set a person's deadline to next week",
    permission: "KICK_MEMBERS"
}