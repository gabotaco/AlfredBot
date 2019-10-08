const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const fs = require("fs")
const functions = require("../functions.js")
const date_diff_indays = function (date1, date2) { //gets the difference in days between 2 dates
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("I might have to give you a warning for trying to do that") //If can't kick members

    if (!args[0]) return message.channel.send(".warn [id] [reason]") //if no args

    const Response = await functions.GetIDAndSearchColumn(message, args)
    const ID = Response[1]
    const SearchColumn = Response[0]
    
    const Reason = args.join(" ").slice(ID.length); //reason is everything after ID
    if (!Reason) return message.channel.send("You must specify what you are warning them for")

        const MemberData = await functions.GetMemberDetails(bot, message.channel, SearchColumn, ID) //Get member details
        if (!MemberData) return message.channel.send("Unable to find that applicant")

        const DiscordID = MemberData.discord_id
        const Deadline = MemberData.deadline
        const InGameName = MemberData.in_game_name

        let warns = MemberData.warnings;

        warns++; //increase warns by 1

        let WarnEmbed = new Discord.RichEmbed() //make embed
            .setDescription("Warned")
            .setAuthor(message.author.username)
            .setColor("RANDOM")
            .addField("Warned User", `<@${DiscordID}>`)
            .addField("Warned In", message.channel)
            .addField("Number of Warnings", warns)
            .addField("Reason", Reason)
        const WarnChannel = message.guild.channels.get("527602243743252550") //get channel and send
        WarnChannel.send(WarnEmbed)

        const DeadlineDate = new Date(Deadline)

        const HalfDate = Math.floor((date_diff_indays(Date.now(), DeadlineDate)) / 2) //Get the difference in days between now and half their deadline

        if (HalfDate > 7) var DaysToRemove = HalfDate //If half the date is longer than a week then half their deadline
        else var DaysToRemove = 7 //if half the date is shorter than a week then remove a week

        DeadlineDate.setDate(DeadlineDate.getDate() - DaysToRemove) //Set the deadline date to the new date

        const NewDeadline = DeadlineDate.toISOString().slice(0, 19).replace('T', ' ');

        functions.ChangeDeadline(bot, NewDeadline, SearchColumn, ID, message.channel) //Change their deadline
        message.channel.send(`This is warning number ${warns} for ${InGameName}`)

        const warned = message.guild.members.get(DiscordID) //get discord member and then inform if in discord
        if (warned) warned.send(`Hello ${InGameName}, It has come to our attention that you've broken a rule and as a result, you've been issued a formal warning. Your voucher deadline has been reduced. Multiple warnings could lead to removal from the company.`)
        
        bot.con.query(`UPDATE members SET warnings = '${warns}' WHERE ${SearchColumn} = '${ID}'`, function (err, fields, result) {
            if (err) console.log(err)
        })

}

module.exports.help = {
    name: "warn",
    usage: "[person] [reason]",
    description: "Warn a member",
    permission: "KICK_MEMBERS"
}