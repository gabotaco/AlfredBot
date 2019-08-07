const botconfig = require("../botconfig.json");
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Ask a manager to do this for you") //If can't kick members

    if (!args[0]) return message.channel.send("You must specify who you are transferring")

    const Response = functions.GetIDAndSearchColumn(message, args);
    const SearchColumn = Response[0]
    const ID = Response[1]
    
    const leaveReason = "Transitioned to RTS";
    
    const d = new Date()
    const date = `${botconfig.Months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`

    async function rts(auth) {
        const RTSRow = await functions.GetMemberRow(auth, SearchColumn, ID, botconfig.RTSSheet, botconfig.RTSEmployeeRange, botconfig.RTSEmployeeRangeStartingRow); //Get RTS row
        if (RTSRow) return message.channel.send("They are already in RTS"); //If they have row then in RTS

        const PIGSMemberData = await functions.GetMemberDetails(auth, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, SearchColumn, ID, message.channel) //Get PIGS data
        if (!PIGSMemberData) return message.channel.send("They aren't hired in either company") //If has no PIGS data then not in either company
        botconfig.RTSStaffChannel.send(`Copy/paste \`add_rts ${PIGSMemberData[botconfig.PIGSEmployeeRangeDiscordIndex]}\` into TT discord`) //Tell RTS staff to change TT roles
        
        const RTSMemberData = await functions.GetMemberDetails(auth, botconfig.RTSSheet, botconfig.RTSFiredEmployeeRange, SearchColumn, ID, message.channel) //Get RTS member data from fired range
        if (RTSMemberData) { //If previously in RTS
            botconfig.RTSStaffChannel.send(`Hire ${PIGSMemberData[botconfig.PIGSEmployeeRangeInGameNameIndex]} as ${RTSMemberData[botconfig.RTSEmployeeRangeRankIndex]}`) //Tell RTS managers to rehire as old rank

            functions.RemoveMember(auth, message.channel, botconfig.RTSSheet, SearchColumn, botconfig.RTSFiredEmployeeRange, botconfig.RTSFiredEmployeeRangeStartingRow, ID) //Remove from fired

            RTSMemberData[botconfig.RTSEmployeeRangeNotesIndex] = "" //remove fired reason
            RTSMemberData[botconfig.RTSEmployeeRangeDeadlineIndex] = PIGSMemberData[botconfig.PIGSEmployeeRangeDeadlineIndex] //set RTS deadline to PIGS deadline
            RTSMemberData[botconfig.RTSEmployeeRangeDiscordIndex] = PIGSMemberData[botconfig.PIGSEmployeeRangeDiscordIndex] //Adds discord ID

            functions.AddMember(auth, message.channel, botconfig.RTSSheet, botconfig.RTSEmployeeRange, botconfig.RTSEmployeeRangeStartingRow, RTSMemberData, bot) //Add member to hired RTS
        } else { //If not previously in RTS
            const MemberData = [PIGSMemberData[botconfig.PIGSEmployeeRangeDiscordIndex], PIGSMemberData[botconfig.PIGSEmployeeRangeInGameNameIndex], null, null, PIGSMemberData[botconfig.PIGSEmployeeRangeInGameIDIndex], "", 0, 0, 0, 0, 0, 0, 0, 0, 0, null, 0, null, PIGSMemberData[botconfig.PIGSEmployeeRangeDeadlineIndex]] //RTS member data with PIGS info
            functions.AddMember(auth, message.channel, botconfig.RTSSheet, botconfig.RTSEmployeeRange, botconfig.RTSEmployeeRangeStartingRow, MemberData, bot) //Hire in RTS
        }
        functions.RemoveMember(auth, message.channel, botconfig.PIGSSheet, SearchColumn, botconfig.PIGSEmployeeRange, botconfig.PIGSEmployeeRangeStartingRow, ID) //Remove from PIGS hired

        PIGSMemberData[botconfig.PIGSEmployeeRangeNotesIndex] = leaveReason //Set leave reason
        PIGSMemberData[botconfig.PIGSEmployeeRangeDeadlineIndex] = date //set deadline to transition date
        console.log(botconfig.PIGSSheet, botconfig.PIGSFiredEmployeeRange, botconfig.PIGSFiredEmployeeRangeStartingRow, PIGSMemberData) //Add to PIGS fired

        functions.AddMember(auth, message.channel, botconfig.PIGSSheet, botconfig.PIGSFiredEmployeeRange, botconfig.PIGSFiredEmployeeRangeStartingRow, PIGSMemberData, bot) //Add to PIGS fired
    }

    authentication.authenticate().then((auth) => {
        rts(auth);
    });
}

module.exports.help = {
    name: "rts",
    usage: "[person]",
    description: "Move someone to rts",
    permission: "KICK_MEMBERS"
}