const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("KICK_MEMBERS")) { //If can't manage nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  if (args[0] && args[0].toLowerCase() == "rts") {
    var SignMeUpIndex = botconfig.RTSSignMeUpIndex
  } else if (args[0] && args[0].toLowerCase() == "pigs") {
    var SignMeUpIndex = botconfig.PIGSSignMeUpIndex
  } else {
    if (message.guild.id == botconfig.RTSServer) {
      var SignMeUpIndex = botconfig.RTSSignMeUpIndex //Get the default sign me up in case there are no valid args
    } else if (message.guild.id == botconfig.PIGSServer) {
      var SignMeUpIndex = botconfig.PIGSSignMeUpIndex
    }
  }

  authentication.authenticate().then(async (auth) => {
    functions.ProcessAllInRange(auth, botconfig.Applications, botconfig.ApplicationRange, message.channel, function (row) { //go through all applicants
      if (parseInt(row[botconfig.ApplicationRefferalCode]) != null) { //if there is a refferal code that is valid int
        if (row[botconfig.ApplicationRefferalStatus] != "Eligible" && row[botconfig.ApplicationRefferalStatus] != "Paid") { //Not marked as "Eligible"
          bot.con.query(`SELECT rts_total_vouchers, pigs_total_vouchers FROM rts, pigs WHERE pigs.in_game_id = rts.in_game_id AND pigs.in_game_id = '${row[botconfig.ApplicationInGameIDIndex]}'`, function (err, result, fields) { //get the applicants voucher num
            if (err) return console.log(err)
            if (result.length > 0) { //if he's hired
              if (result[0].pigs_total_vouchers + result[0].rts_total_vouchers >= 10000) { //If they have turned in more than 10,000
                functions.UpdateApplicantStatus(auth, message.channel, row[botconfig.ApplicationInGameIDIndex], SignMeUpIndex, "Eligible", botconfig.ApplicationRefferalStatusColumn);
              }
            }
          })
        }
      }
    })
  });
}

module.exports.help = {
  name: "referral",
  usage: "",
  description: "Checks for refferals",
  permission: "KICK_MEMBERS"
}