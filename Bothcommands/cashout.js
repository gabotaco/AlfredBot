const Discord = require("discord.js")
const functions = require("../functions.js")
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    const cashoutUser = args.member || args.author_id //either first mention or member with the discord ID or the message author

    if (cashoutUser == args.author_id && args.author_id == "404650985529540618") { //if its rock doing a cashout and nobody is specified
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

      const SearchColumn = functions.GetSearchColumn(cashoutUser)
      if (SearchColumn == "in_game_id") return resolve("You can't supply an in game id.")

      bot.con.query(`SELECT ${CompanyName}_cashout, ${CompanyName}_cashout_worth FROM managers WHERE ${SearchColumn}='${cashoutUser}'`, function (err, result, fields) { //get the cashout for the specified company for the manager
        if (err) {
          console.log(err)
          return reject("Unable to get manager cashouts.")
        }

        if (result.length == 0) return resolve(`Unable to find that manager!`) //if there isn't a result
        //there is a result
        let cashoutEmbed = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`Cashout for ${SearchColumn == 'discord_id' ? bot.guilds.cache.get(args.guild_id).members.cache.get(cashoutUser).displayName : cashoutUser}`)
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
  args: [
    {
      name: "discord",
      description: "Get the cashout of another user",
      type: 1,
      options: [{
        name: "member",
        description: "the other discord user",
        type: 6,
        required: true,
        parse: (bot, message, args) => {
          if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
          return args[0]
        }
      }]
    },
    {
      name: "self",
      description: "Get your own cashout",
      type: 1,
      options: []
    }
  ],
  slash: true
}