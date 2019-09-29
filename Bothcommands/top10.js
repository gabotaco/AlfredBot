const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const authentication = require("../authentication");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (message.guild.id == botconfig.PIGSServer) {
        var CompanyName = "pigs"

    } else if (message.guild.id == botconfig.RTSServer) {
        var CompanyName = "rts"
    }

    const MemberInfo = await functions.GetMemberDetails(bot, message.channel, "discord_id", message.author.id)

    bot.con.query(`SELECT * FROM members, ${CompanyName} WHERE members.in_game_id = ${CompanyName}.in_game_id`, function (err, result, fields) {
        if (err) console.log(err)
        let vouchers = []
        result.forEach(member => {
            vouchers.push([member[`${CompanyName}_total_vouchers`], member.in_game_name])
        });
        vouchers.sort(sortFunction); //Sort it from highest to least
        function sortFunction(a, b) {
            if (a[0] == b[0]) {
                return 0;
            } else {
                return (a[0] > b[0]) ? -1 : 1;
            }
        }
        const top10 = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("__*Top 10 Voucher Handins*__")
            .setThumbnail(message.author.avatarURL)
            .setFooter(`Your total vouchers: ${functions.numberWithCommas(MemberInfo[`${CompanyName}_total_vouchers`])}`)
        for (let i = 0; i < 10 && i < vouchers.length; i++) { //loop through first 10 items in array
            top10.addField(vouchers[i][1], functions.numberWithCommas(vouchers[i][0]))
        }
        message.channel.send(top10)
    })

}

module.exports.help = {
    name: "top10",
    usage: "",
    description: "Get the top 10 voucher turn ins",
    permission: "SEND_MESSAGES"
}