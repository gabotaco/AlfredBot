const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) { //if can't kick members
        return message.channel.send("You aren't allowed to do that")
    }

    if (!args[0]) args[0] = message.member.id //if nobody specified do themselves

    const Response = functions.GetIDAndSearchColumn(message, args); //check if they used discord id or ingame id
    const SearchColumn = Response[0]
    const ID = Response[1]


    const MemberInfo = await functions.GetMemberDetails(bot, SearchColumn, ID) //Get their member info
    if (!MemberInfo) return message.channel.send("Couldn't find that user") //no member data

    message.channel.send(`Deadline: ${MemberInfo.deadline}`) //get the deadline and send it
}
module.exports.help = {
    name: "deadline",
    usage: "[id]",
    description: "Tells the user when was the last time they turned in vouchers",
    permission: "KICK_MEMBERS"
}