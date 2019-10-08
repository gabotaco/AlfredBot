const Discord = require("discord.js")
const functions = require("../functions.js")
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, message, args) => {
  const cashoutUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]) || message.member) //either first mention or member with the discord ID or the message author
  
  if (cashoutUser == message.member && message.member.id == "404650985529540618") { //if its rock doing a cashout and nobody is specified
    
    bot.con.query(`SELECT discord_id, rts_cashout, rts_cashout_worth, pigs_cashout, pigs_cashout_worth FROM managers`, function (err, result, fields) { //get every managers cashout
      
      if (err) return console.log(err)

      let PIGSEmbed = new Discord.RichEmbed() //pigs managers
      .setColor("LUMINOUS_VIVID_PINK")
      let RTSEmbed = new Discord.RichEmbed() //rts managers
      .setColor("ORANGE")

      let RTSTotalVouchers = 0; //track total vouchers not collected per company
      let PIGSTotalVouchers = 0;

      result.forEach(manager => { //go through each manager
        if (manager.rts_cashout > 0) RTSEmbed.addField(`${message.guild.members.get(manager.discord_id).displayName} (${manager.discord_id})`, `${functions.numberWithCommas(manager.rts_cashout)} ($${functions.numberWithCommas(manager.rts_cashout_worth)})`) //if they have collected at least one voucher add them to rts embed
        if (manager.pigs_cashout > 0) PIGSEmbed.addField(`${message.guild.members.get(manager.discord_id).displayName} (${manager.discord_id})`, `${functions.numberWithCommas(manager.pigs_cashout)} ($${functions.numberWithCommas(manager.pigs_cashout_worth)})`) //if they have collected at least one voucher add them to pigs embed
        
        RTSTotalVouchers += manager.rts_cashout; //add their vouchers to the total
        PIGSTotalVouchers += manager.pigs_cashout
      });

      RTSEmbed.setTitle(`RTS Managers (${functions.numberWithCommas(RTSTotalVouchers)} total)`) //set the title to include the total vouchers
      PIGSEmbed.setTitle(`PIGS Managers (${functions.numberWithCommas(PIGSTotalVouchers)} total)`)

      message.channel.send(RTSEmbed) //send both
      message.channel.send(PIGSEmbed)
    })

    return;
  }
  //Someone is specified and it isn't rock

  if (message.guild.id == botconfig.RTSServer) var CompanyName = "rts" //get company name depending on discord server
  else if (message.guild.id == botconfig.PIGSServer) var CompanyName ="pigs"

  bot.con.query(`SELECT ${CompanyName}_cashout, ${CompanyName}_cashout_worth FROM managers WHERE discord_id='${cashoutUser.id}'`, function (err, result, fields) { //get the cashout for the specified company for the manager
    if (err) return console.log(err)

    if (result.length == 0) return message.channel.send(`Unable to find that manager!`) //if there isn't a result
    //there is a result
    let cashoutEmbed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setTitle(`Cashout for ${cashoutUser.displayName}`)
      .addField("Vouchers", functions.numberWithCommas(result[0][`${CompanyName}_cashout`])) //add their cashout data
      .addField("Cash", "$" + functions.numberWithCommas(result[0][`${CompanyName}_cashout_worth`]))

    message.channel.send(cashoutEmbed) //send
  })
}

module.exports.help = {
  name: "cashout",
  usage: "{in game id}",
  description: "Gets how many vouchers you owe rock and how much he owes you.",
  permission: "KICK_MEMBERS"
}