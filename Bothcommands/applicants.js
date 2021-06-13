module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //If can't manage nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  let FoundOne = false //Keep track of if there is at least one applicant

  bot.con.query(`SELECT in_game_name, in_game_id, country, cooldown FROM applications WHERE status = 'Received'`, function (err, result, fields) {
    if (err) {
      console.log(err)
      message.channel.send("There was an error")
    } else {
      result.forEach(applicant => {
        FoundOne = true

        if (applicant.cooldown) { //If they have a cooldown
          message.channel.send(`In-Game Name: "${applicant.in_game_name}". In Game ID: "${applicant.in_game_id}". Country: "${applicant.country}". Cooldown: "${applicant.cooldown}"`, { //send their basic app info
            code: "ml"
          })
        } else { //If they don't have a cooldown
          message.channel.send(`In-Game Name: "${applicant.in_game_name}". In Game ID: "${applicant.in_game_id}". Country: "${applicant.country}".`, { //send their basic app info without cooldown
            code: "ml"
          })
        }
      });
    }
  })

  if (!FoundOne) { //If didn't find one
  message.channel.send("No new applicants")
  return;
}
}

module.exports.help = {
  name: "applicants",
  usage: "",
  description: "Sends a list of un processed applicants",
  permission: "KICK_MEMBERS"
}