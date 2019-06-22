const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //Can't manage nicknames
        message.channel.send("You aren't allowed to do that")
        return;
    }
    
    if (message.guild.id == botconfig.PIGSServer) { //PIGS server
        var SheetID = botconfig.PIGSSheet //pigs sheet stuff
        var Range = botconfig.PIGSEmployeeRange
        var InGameNameIndex = botconfig.PIGSEmployeeRangeInGameNameIndex
    } else if (message.guild.id == botconfig.RTSServer) { //rts server
        var SheetID = botconfig.RTSSheet //rts sheet stuff
        var Range = botconfig.RTSEmployeeRange
        var InGameNameIndex = botconfig.RTSEmployeeRangeInGameNameIndex
    }

    authentication.authenticate().then(async (auth) => {
        let employees = 0 //Start at 0

        await functions.ProcessAllInRange(auth, SheetID, Range, message.channel, function (row) {
            if (row[InGameNameIndex]) employees++; //Increase count if theres an in game name
        })

        message.channel.send(`There are currently ${employees} employees in PIGS`)
    });
}

module.exports.help = {
    name: "employees",
    usage: "",
    description: "Gets the number of employees",
    permission: "MANAGE_NICKNAMES"
}