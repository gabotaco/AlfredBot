const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  bot.con.query(`SELECT * FROM applications WHERE discord_id = '${message.author.id}' ORDER BY app_id DESC`, function (err, result, fields) {
    if (err) {
        console.log(err)
        return;
    }
    if (result.length < 1) {
       message.channel.send("Unable to find your application.")
    } else {
        message.channel.send(`Your application status is: ${result[0].status} ${result[0].reason ? `(${result[0].reason})` : ""}`)
    }
})
}

module.exports.help = {
  name: "status",
  usage: "[in game id]",
  description: "Get application status for a member",
  permission: "KICK_MEMBERS"
}