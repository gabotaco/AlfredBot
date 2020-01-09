const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")
const Discord = require("discord.js")
module.exports.run = async (bot, message, args) => {
  const InGameID = await functions.GetInGameID(bot, message.member.id);
  if (!InGameID) return message.channel.send("You weren't ever hired!");

  authentication.authenticate().then(async (auth) => {
    await functions.ProcessAllInRange(auth, botconfig.Applications, botconfig.ApplicationRange, message.channel, function (row) { //go through all applicants
        if (parseInt(row[botconfig.ApplicationRefferalCode]) == InGameID) { //if there is a refferal code that is valid int
          bot.con.query(`SELECT rts_total_vouchers, pigs_total_vouchers FROM rts, pigs WHERE pigs.in_game_id = rts.in_game_id AND pigs.in_game_id = '${row[botconfig.ApplicationInGameIDIndex]}'`, function (err, result, fields) { //get the applicants voucher num
            if (result.length > 0) { //if he's hired
              var TotalVouchers = functions.numberWithCommas(result[0].pigs_total_vouchers + result[0].rts_total_vouchers) + " vouchers!"
            } else {
              var TotalVouchers = "Not Hired."
            }

            message.author.send(`${row[botconfig.ApplicationInGameNameIndex]} (${row[botconfig.ApplicationInGameIDIndex]}): ${TotalVouchers}`)            
          })
        }
      })
    message.react('👍')
  });
}

module.exports.help = {
  name: "refers",
  usage: "",
  description: "Get a list and progress of all people you've refered",
  permission: "SEND_MESSAGES"
}