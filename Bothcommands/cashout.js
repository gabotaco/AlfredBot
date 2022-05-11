const Discord = require("discord.js")
const functions = require("../functions.js")
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    if (args.author_id == "404650985529540618") { //if its rock doing a cashout and nobody is specified
      bot.con.query(`SELECT discord_id, rts_cashout, rts_cashout_worth, pigs_cashout, pigs_cashout_worth FROM managers`, function (err, result, fields) { //get every managers cashout
        if (err) {
          console.log(err)
          return reject("There was an error getting cashouts.")
        }

        let PIGSEmbed = new Discord.MessageEmbed() //pigs managers
          .setColor("LUMINOUS_VIVID_PINK")
        let RTSEmbed = new Discord.MessageEmbed() //rts managers
          .setColor("ORANGE")

        let RTSTotalVouchers = 0; //track total vouchers not collected per company
        let PIGSTotalVouchers = 0;

        result.forEach(manager => { //go through each manager
          const managerMember = bot.guilds.cache.get(args.guild_id).members.cache.get(manager.discord_id)
          if (manager.rts_cashout > 0) RTSEmbed.addField(`${managerMember ? managerMember.displayName : ""} (${manager.discord_id})`, `${functions.numberWithCommas(manager.rts_cashout)} ($${functions.numberWithCommas(manager.rts_cashout_worth)})`) //if they have collected at least one voucher add them to rts embed
          if (manager.pigs_cashout > 0) PIGSEmbed.addField(`${managerMember ? managerMember.displayName : ""} (${manager.discord_id})`, `${functions.numberWithCommas(manager.pigs_cashout)} ($${functions.numberWithCommas(manager.pigs_cashout_worth)})`) //if they have collected at least one voucher add them to pigs embed

          RTSTotalVouchers += manager.rts_cashout; //add their vouchers to the total
          PIGSTotalVouchers += manager.pigs_cashout
        });

        RTSEmbed.setTitle(`RTS Managers (${functions.numberWithCommas(RTSTotalVouchers)} total)`) //set the title to include the total vouchers
        PIGSEmbed.setTitle(`PIGS Managers (${functions.numberWithCommas(PIGSTotalVouchers)} total)`)

        return resolve([RTSEmbed, PIGSEmbed]) //send both
      })
    } else {
      //Someone is specified and it isn't rock

      if (args.guild_id == botconfig.RTSServer) var CompanyName = "rts" //get company name depending on discord server
      else if (args.guild_id == botconfig.PIGSServer) var CompanyName = "pigs"

      const SearchColumn = functions.GetSearchColumn(args.author_id)
      if (SearchColumn == "in_game_id") return resolve("You can't supply an in game id.")

      bot.con.query(`SELECT ${CompanyName}_cashout, ${CompanyName}_cashout_worth FROM managers ma, members me WHERE me.${SearchColumn}='${args.author_id}' AND ma.member_id = me.id`, function (err, result, fields) { //get the cashout for the specified company for the manager
        if (err) {
          console.log(err)
          return reject("Unable to get manager cashouts.")
        }

        if (result.length == 0) return resolve(`Unable to find that manager!`) //if there isn't a result
        //there is a result
        let cashoutEmbed = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`Cashout for ${SearchColumn == 'discord_id' ? bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id).displayName : args.author_id}`)
          .addField("Cashout Value", "$" + functions.numberWithCommas(result[0][`${CompanyName}_cashout_worth`]), true)
          .addField("Total Vouchers", functions.numberWithCommas(result[0][`${CompanyName}_cashout`]), true)
          .addField("Total Value", "$" + functions.numberWithCommas(result[0][`${CompanyName}_cashout`] * 10000), true)
          .addField("Manager's Pay", "$" + functions.numberWithCommas(Math.floor(((result[0][`${CompanyName}_cashout`] * 10000) - result[0][`${CompanyName}_cashout_worth`]) * 0.5)), true)
          .addField("Rock Owes You", "$" + functions.numberWithCommas(Math.floor(((result[0][`${CompanyName}_cashout`] * 10000) - result[0][`${CompanyName}_cashout_worth`]) * 0.5) + result[0][`${CompanyName}_cashout_worth`]), true)

        return resolve(cashoutEmbed) //send
      })
    }
  })
}

module.exports.help = {
  name: "cashout",
  aliases: [],
  usage: "[in game id or discord]",
  description: "Gets how many vouchers you owe rock and how much he owes you.",
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  args: [],
  slash: true
}