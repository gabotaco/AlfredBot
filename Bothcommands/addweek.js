const botconfig = require("../botconfig.json");
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("No can do.") //if can't kick members

    const Response = functions.GetIDAndSearchColumn(message, args);
    if (Response.length == 0) return message.channel.send("You didn't specify a valid member") //if no args
    const SearchColumn = Response[0]
    const ID = Response[1]

    authentication.authenticate().then(async (auth) => { //authenticate app 
        let MemberDetails = await functions.GetMemberDetails(auth, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, SearchColumn, ID, message.channel) //get member details for PIGS
        if (!MemberDetails) { //If no member details in PIGS
            MemberDetails = await functions.GetMemberDetails(auth, botconfig.RTSSheet, botconfig.RTSEmployeeRange, SearchColumn, ID, message.channel) //get member details for RTS
            if (!MemberDetails) return message.channel.send("Unable to find that member"); //if no member details in RTS stop

            let d = new Date(MemberDetails[botconfig.RTSEmployeeRangeDeadlineIndex]) //make date object with current deadline
            d.setDate(d.getDate() + 7) //add 7 days
            const newDeadline = `${botconfig.Months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` //in string

            functions.ChangeDeadline(auth, message.channel, botconfig.RTSSheet, botconfig.RTSEmployeeRange, botconfig.RTSEmployeeRangeStartingRow, SearchColumn, ID, newDeadline, botconfig.RTSDeadlineColumn) //change deadline in RTS
        } else {
            let d = new Date(MemberDetails[botconfig.PIGSEmployeeRangeDeadlineIndex]) //make date with current deadline
            d.setDate(d.getDate() + 7) //add 7 days
            const newDeadline = `${botconfig.Months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` //in string

            functions.ChangeDeadline(auth, message.channel, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, botconfig.PIGSEmployeeRangeStartingRow, SearchColumn, ID, newDeadline, botconfig.PIGSDeadlineColumn) //change deadline in PIGS
        }
    });
}

module.exports.help = {
    name: "addweek",
    usage: "[in game id or discord]",
    description: "Add a week to a person's deadline",
    permission: "KICK_MEMBERS"
}