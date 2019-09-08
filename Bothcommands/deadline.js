const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
        return message.channel.send("You aren't allowed to do that")
    }

    if (!args[0]) args[0] = message.member.id

    const Response = functions.GetIDAndSearchColumn(message, args);
    if (Response.length == 0) return message.channel.send("Please specify who you want to check the deadline of.")

    const SearchColumn = Response[0]
    const ID = Response[1]


    const MemberInfo = await functions.GetMemberDetails(bot, message.channel, SearchColumn, ID) //get the member data from the right sheet
    if (!MemberInfo) return message.channel.send("Couldn't find that user") //no member data

    message.channel.send("Deadline: " + MemberInfo.deadline) //get the deadline and send it
}
module.exports.help = {
    name: "deadline",
    usage: "[id]",
    description: "Tells the user when was the last time they turned in vouchers",
    permission: "KICK_MEMBERS"
}