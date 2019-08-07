const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const authentication = require("../authentication");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (message.guild.id == botconfig.PIGSServer) {
        var MainSheet = botconfig.PIGSSheet
        var EntireRange = botconfig.PIGSEntireSheetRange
        var TotalVouchersIndex = botconfig.PIGSEmployeeRangeTotalVouchersIndex
        var DiscordIndex = botconfig.PIGSEmployeeRangeDiscordIndex
        var InGameNameIndex = botconfig.PIGSEmployeeRangeInGameNameIndex
    } else if (message.guild.id == botconfig.RTSServer) {
        var MainSheet = botconfig.RTSSheet
        var EntireRange = botconfig.RTSEntireSheetRange
        var TotalVouchersIndex = botconfig.RTSEmployeeRangeTotalVouchersIndex
        var InGameNameIndex = botconfig.RTSEmployeeRangeInGameNameIndex
        var DiscordIndex = botconfig.RTSEmployeeRangeDiscordIndex
    }

    async function getTop10(auth) {
        const vouchers = await functions.GetRanks(auth, MainSheet, EntireRange, TotalVouchersIndex, InGameNameIndex, message.channel) //Ge4t total vouchers for each member in the entire company including fired
        
        const MemberDetails = await functions.GetMemberDetails(auth, MainSheet, EntireRange, DiscordIndex, message.member.id, message.channel);

        if (MemberDetails) {
            var Rank = MemberDetails[TotalVouchersIndex]
        } else {
            var Rank = "Bad"
        }

        const top10 = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("__*Top 10 Voucher Handins*__")
            .setThumbnail(message.author.avatarURL)
            .setFooter(`Your total vouchers: ${Rank}`, message.author.avatarURL)
        for (let i = 0; i < 10; i++) { //loop through first 10 items in array
            top10.addField(vouchers[i][1], vouchers[i][0])
        }
        message.channel.send(top10)
    }
    authentication.authenticate().then((auth) => { //authenticate the function
        getTop10(auth); 
    });

}

module.exports.help = {
    name: "top10",
    usage: "",
    description: "Get the top 10 voucher turn ins",
    permission: "SEND_MESSAGES"
}