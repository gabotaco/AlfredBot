const botconfig = require("../botconfig.json");
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("No can do.") //if can't kick members

    const response = functions.GetIDAndSearchColumn(message, args)
    if (response.length == 0) return message.channel.send("Please specify someone") //if no args

    const ID = response[1]
    const SearchColumn = response[0]

    let d = new Date() 
    d.setDate(d.getDate() + 7) //add 7 days to date
    const newDeadline = `${botconfig.Months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` //convert to string we want

    function ChangePIGS(auth) { //change deadline in PIGS sheet
        functions.ChangeDeadline(auth, message.channel, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, botconfig.PIGSEmployeeRangeStartingRow, SearchColumn, ID, newDeadline, botconfig.PIGSDeadlineColumn)
    }

    function ChangeRTS(auth) { //change deadline in RTS sheet
       functions.ChangeDeadline(auth, message.channel, botconfig.RTSSheet, botconfig.RTSEmployeeRange, botconfig.RTSEmployeeRangeStartingRow, SearchColumn, ID, newDeadline, botconfig.RTSDeadlineColumn)
    }

    authentication.authenticate().then((auth) => { //authenticate app 
        ChangePIGS(auth); //run both functions
        ChangeRTS(auth);
    });
}

module.exports.help = {
    name: "7days",
    usage: "[in game id or discord]",
    description: "Set a person's deadline to next week",
    permission: "KICK_MEMBERS"
}