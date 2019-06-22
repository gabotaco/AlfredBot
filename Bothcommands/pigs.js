const botconfig = require("../botconfig.json");
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Ask a manager to do this for you") //If can't kick members

    if (!args[0]) return message.channel.send("You must specify who you are transferring") //if no args

    const Response = functions.GetIDAndSearchColumn(message, args);
    const SearchColumn = Response[0]
    const ID = Response[1];

    const d = new Date()
    const date = `${botconfig.Months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` //Curent date

    const leaveReason = "Transitioned to PIGS";

    async function pigs(auth) {
        const PIGSRow = await functions.GetMemberRow(auth, SearchColumn, ID, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, botconfig.PIGSEmployeeRangeStartingRow) //Gets what row the member is in PIGS sheet
        if (PIGSRow) return message.channel.send("They are already in pigs") //If theres a pigs row then don't do anythin cause already in pigs

        const RTSMemberData = await functions.GetMemberDetails(auth, botconfig.RTSSheet, botconfig.RTSEmployeeRange, SearchColumn, ID, message.channel) //Get that members details in RTS
        if (!RTSMemberData) return message.channel.send("This person isn't hired in either companys") //If there aren't rts details then they aren't hired

        botconfig.PIGSStaffChannel.send(`Copy/paste \`add_pigs ${RTSMemberData[botconfig.RTSEmployeeRangeDiscordIndex]}\` into TT`) //Tell pigs managers to change TT roles

        const PIGSMemberData = await functions.GetMemberDetails(auth, botconfig.PIGSSheet, botconfig.PIGSFiredEmployeeRange, SearchColumn, ID, message.channel) //get Pigs member data from fired range
        if (PIGSMemberData) { //If they were previously in pigs
            botconfig.PIGSStaffChannel.send(`Hire ${PIGSMemberData[botconfig.PIGSEmployeeRangeInGameNameIndex]} as a ${PIGSMemberData[botconfig.PIGSEmployeeRangeRankIndex]}`) //Tell PIGS managers to hire as their old role

            functions.RemoveMember(auth, message.channel, botconfig.PIGSSheet, SearchColumn, botconfig.PIGSFiredEmployeeRange, botconfig.PIGSFiredEmployeeRangeStartingRow, ID) //Remove member from fired

            PIGSMemberData[botconfig.PIGSEmployeeRangeNotesIndex] = ""; //Remove notes
            PIGSMemberData[botconfig.PIGSEmployeeRangeDeadlineIndex] = RTSMemberData[botconfig.RTSEmployeeRangeDeadlineIndex] //Change PIGS deadline to RTS deadline
            PIGSMemberData[botconfig.PIGSEmployeeRangeDiscordIndex] = RTSMemberData[botconfig.RTSEmployeeRangeDiscordIndex]; //Sets the discord ID to the member

            functions.AddMember(auth, message.channel, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, botconfig.PIGSEmployeeRangeStartingRow, PIGSMemberData, bot) //Hire member
        } else { //Weren't previously in PIGS
            const MemberData = [RTSMemberData[botconfig.RTSEmployeeRangeDiscordIndex], RTSMemberData[botconfig.RTSEmployeeRangeInGameNameIndex], null, null, RTSMemberData[botconfig.RTSEmployeeRangeInGameIDIndex], "", null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null, null, null, RTSMemberData[botconfig.RTSEmployeeRangeDeadlineIndex]] //Create new member with RTS details
            functions.AddMember(auth, message.channel, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, botconfig.PIGSEmployeeRangeStartingRow, MemberData, bot) //Hire them in PIGS
        }
        functions.RemoveMember(auth, message.channel, botconfig.RTSSheet, SearchColumn, botconfig.RTSEmployeeRange, botconfig.RTSEmployeeRangeStartingRow, ID) //Remove from RTS hired

        RTSMemberData[botconfig.RTSEmployeeRangeNotesIndex] = leaveReason //Set leave reason
        RTSMemberData[botconfig.RTSEmployeeRangeDeadlineIndex] = date //Set change date

        functions.AddMember(auth, message.channel, botconfig.RTSSheet, botconfig.RTSFiredEmployeeRange, botconfig.RTSFiredEmployeeRangeStartingRow, RTSMemberData, bot) //Add to fired RTS members
    }

    authentication.authenticate().then((auth) => {
        pigs(auth);
    });
}

module.exports.help = {
    name: "pigs",
    usage: "[member id]",
    description: "Transfer someone to pigs",
    permission: "KICK_MEMBERS"
}