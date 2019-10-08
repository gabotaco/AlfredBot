const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (message.guild.id == botconfig.PIGSServer) {
        var CompanyName = "pigs"

    } else if (message.guild.id == botconfig.RTSServer) {
        var CompanyName = "rts"
    }

    const MemberInfo = await functions.GetMemberDetails(bot, "discord_id", message.author.id) //get member info

    bot.con.query(`SELECT * FROM members, ${CompanyName} WHERE members.in_game_id = ${CompanyName}.in_game_id`, function (err, result, fields) { //get all company members and link their vouchers with their in game name
        if (err) return console.log(err)

        let vouchers = [] //track vouchers

        result.forEach(member => { //go through each member
            vouchers.push([member[`${CompanyName}_total_vouchers`], member.in_game_name]) //add their vouchers and name
        });

        vouchers.sort(sortFunction); //Sort it from highest to least
        function sortFunction(a, b) {
            if (a[0] == b[0]) { //same return 0
                return 0;
            } else {
                return (a[0] > b[0]) ? -1 : 1; //if a is more than b return -1 else return 1
            }
        }

        const top10 = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("__*Top 10 Voucher Handins*__")
            .setThumbnail(message.author.avatarURL)
            .setFooter(`Your total vouchers: ${functions.numberWithCommas(MemberInfo[`${CompanyName}_total_vouchers`])}`) //add total vouchers

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