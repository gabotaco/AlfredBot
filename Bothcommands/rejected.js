const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //Can't manager nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  const ID = args[0] //first arg

  const LeaveReason = args.join(" ").slice(ID.length + 1); //Everything after ID

  if (!ID || !LeaveReason) { //no id or leave reason
    message.channel.send(".rejected [in game id] [reason]")
    return;
  }

  bot.con.query(`SELECT * FROM applications WHERE in_game_id = '${ID}'`, function (err, result) {
    if (err) {
      console.log(err)
      message.channel.send("There was an error")
    } else {
      if (result.length > 0) {
        functions.UpdateApplicantStatus(bot.con, message.channel, ID, `Rejected`, LeaveReason) //update status
        const user = message.guild.members.cache.get(Discord) //get server member
        if (user) { //if in server the message
          user.send(`Hello,

This message is in regards to your recent application to PIGS. We'd like to thank you for your interest in our company and what we do.
                          
Here at the Rockwell Corporation, we strive to maintain a tight-knit community of helpful, happy, and active members. As such, we perform background checks with Transport Tycoon staff and check for everything from player reports, to kicks and bans, as well as general attitude, communication skills, and overall state of activity. 
                          
In the case of your candidacy, this background check has raised a red flag to our management team and, as a result, your application has been rejected. If you feel this decision has been made in error, you may appeal by @mentioning Rock in <#560917748184776736> channel of the company's Discord.
                          
Once again, thank you for your interest; we wish you the best of luck in your future endeavors. Reason for fire: '${LeaveReason}'`).then(msg => {
            message.channel.send("Notified.")
          })
        }
      } else {
        message.channel.send("Couldn't find that applicant")

      }
    }
  })
}

module.exports.help = {
  name: "rejected",
  usage: "[in game id]",
  description: "Mark an applicant as rejected",
  permission: "KICK_MEMBERS"
}