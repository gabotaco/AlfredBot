const Discord = require("discord.js")
const functions = require("../functions.js")
const botconfig = require("../botconfig.json")
module.exports.run = async (bot, message, args) => {
  const cashoutUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]) || message.member) //either first mention or member with the discord ID or the message author
  if (cashoutUser == message.member && message.member.id == "404650985529540618") {
    bot.con.query(`SELECT discord_id, rts_cashout, rts_cashout_worth, pigs_cashout, pigs_cashout_worth FROM managers`, function (err, result, fields) {
      if (err) console.log(err)
      let PIGSEmbed = new Discord.RichEmbed()
      .setColor("LUMINOUS_VIVID_PINK")
      let RTSEmbed = new Discord.RichEmbed()
      .setColor("ORANGE")
      let RTSTotalVouchers = 0;
      let PIGSTotalVouchers = 0;
      result.forEach(manager => {
        if (manager.rts_cashout > 0) RTSEmbed.addField(`${message.guild.members.get(manager.discord_id).displayName} (${manager.discord_id})`, `${functions.numberWithCommas(manager.rts_cashout)} ($${functions.numberWithCommas(manager.rts_cashout_worth)})`)
        if (manager.pigs_cashout > 0) PIGSEmbed.addField(`${message.guild.members.get(manager.discord_id).displayName} (${manager.discord_id})`, `${functions.numberWithCommas(manager.pigs_cashout)} ($${functions.numberWithCommas(manager.pigs_cashout_worth)})`)
        RTSTotalVouchers += manager.rts_cashout;
        PIGSTotalVouchers += manager.pigs_cashout
      });
      RTSEmbed.setTitle(`RTS Managers (${functions.numberWithCommas(RTSTotalVouchers)} total)`)
      PIGSEmbed.setTitle(`PIGS Managers (${functions.numberWithCommas(PIGSTotalVouchers)} total)`)

      message.channel.send(RTSEmbed)
      message.channel.send(PIGSEmbed)
    })

    return;
  }
  if (message.guild.id == botconfig.RTSServer) var CompanyName = "rts" //Get the default sign me up in case there are no valid args
  else if (message.guild.id == botconfig.PIGSServer) var CompanyName ="pigs"

  bot.con.query(`SELECT ${CompanyName}_cashout, ${CompanyName}_cashout_worth FROM managers WHERE discord_id='${cashoutUser.id}'`, function (err, result, fields) {
    if (err) console.log(err)
    if (result.length == 0) return message.channel.send(`Unable to find that manager!`)
    let cashoutEmbed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setTitle(`Cashout for ${cashoutUser.displayName}`)
      .addField("Vouchers", functions.numberWithCommas(result[0][`${CompanyName}_cashout`]))
      .addField("Cash", "$" + functions.numberWithCommas(result[0][`${CompanyName}_cashout_worth`]))

    message.channel.send(cashoutEmbed)
  })
}

module.exports.help = {
  name: "cashout",
  usage: "{in game id}",
  description: "Gets how many vouchers you owe rock and how much he owes you.",
  permission: "KICK_MEMBERS"
}