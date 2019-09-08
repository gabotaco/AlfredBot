const { google } = require("googleapis")
const authentication = require("../authentication")
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //Can't manage nicknames
    message.reply("You can't do that dummie");
    return;
  }

  if (!args[0] || !args[1]) { //if there isn't ID or reason
    return message.channel.send(".fire [member id] [reason]")
  }

  const Response = functions.GetIDAndSearchColumn(message, args);
  if (Response.length == 0) return message.channel.send("Please specify who you want to fire.")

  const SearchColumn = Response[0]
  const ID = Response[1]

  const leaveReason = args.join(" ").slice(ID.length); //Reason is everything after ID

  if (leaveReason.length > 120) return message.channel.send(`Please shorten the leave reason to 120 characters`)
  bot.con.query(`UPDATE members SET company = 'fired', fire_reason = '${leaveReason}' WHERE ${SearchColumn} = ${ID}`, function (err, result, fields) {
    if (err) console.log(err)
    if (result.affectedRows == 0) return message.channel.send("Unable to find that member")
    else message.channel.send("Fired.")
  })
}

module.exports.help = {
  name: "fire",
  usage: "[member id] [reason]",
  description: "Fire a member",
  permission: "MANAGE_NICKNAMES"
}