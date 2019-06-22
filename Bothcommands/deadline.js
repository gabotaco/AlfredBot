const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
        return message.channel.send("You aren't allowed to do that")
    }

    if (!args[0]) args[0] = message.member.id

    const Response = functions.GetIDAndSearchColumn(message, args);
    const SearchColumn = Response[0]
    const ID = Response[1]

    if (message.guild.id == botconfig.PIGSServer) { //PIGS server
        var SheetID = botconfig.PIGSSheet //use pigs range and sheet and index
        var Range = botconfig.PIGSEmployeeRange
        var DeadlineIndex = botconfig.PIGSEmployeeRangeDeadlineIndex
    } else if (message.guild.id == botconfig.RTSServer) { //rts server
        var SheetID = botconfig.RTSSheet; //use rts range and sheet and index
        var Range = botconfig.RTSEmployeeRange
        var DeadlineIndex = botconfig.RTSEmployeeRangeDeadlineIndex
    }
    authentication.authenticate().then(async (auth) => {
        const MemberInfo = await functions.GetMemberDetails(auth, SheetID, Range, SearchColumn, ID, message.channel) //get the member data from the right sheet
        if (!MemberInfo) return message.channel.send("Couldn't find that user") //no member data

        message.channel.send("Deadline: " + MemberInfo[DeadlineIndex]) //get the deadline and send it
    });






}
module.exports.help = {
    name: "deadline",
    usage: "[id]",
    description: "Tells the user when was the last time they turned in vouchers",
    permission: "KICK_MEMBERS"
}