const botconfig = require("../botconfig.json");
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("No") //If can't kick members

    const InGameID = args[0] //Gets in game ID
    if (!InGameID) return message.channel.send(".firereason [in game id]")
    
    if (message.guild.id == botconfig.PIGSServer) { //pigs server
        var SheetID = botconfig.PIGSSheet
        var FiredRange = botconfig.PIGSFiredEmployeeRange //fired range
        var InGameIDIndex = botconfig.PIGSEmployeeRangeInGameIDIndex
        var NotesIndex = botconfig.PIGSEmployeeRangeNotesIndex
    } else if (message.guild.id == botconfig.RTSServer) { //rts server
        var SheetID = botconfig.RTSSheet
        var FiredRange = botconfig.RTSFiredEmployeeRange //fired range
        var InGameIDIndex = botconfig.RTSEmployeeRangeInGameIDIndex
        var NotesIndex = botconfig.RTSEmployeeRangeNotesIndex
    }
    async function applicants(auth) {
        const MemberData = await functions.GetMemberDetails(auth, SheetID, FiredRange, InGameIDIndex, InGameID, message.channel) //get member data
        if (!MemberData) return message.channel.send("Couldn't find that user") //no fired member
        message.channel.send(MemberData[NotesIndex]) //send their notes
    }
    authentication.authenticate().then((auth) => {
        applicants(auth);
    });

}

module.exports.help = {
    name: "firereason",
    usage: "[in game id]",
    description: "Get the reason why someone was fired",
    permission: "KICK_MEMBERS"
}