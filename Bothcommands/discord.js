module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //If can't manage nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  const ID = args[0]
  if (!ID) return message.channel.send("You must specify their id")

  bot.con.query(`SELECT discord_id, discord_username FROM applications WHERE in_game_id = '${ID}'`, function (err, result) {
    if (err) {
      console.log(err)
      message.channel.send("There was an error")
    } else {
      if (result.length > 0) {
        message.channel.send(`<@${result[0].discord_id}> (${result[0].discord_username})`)
      } else {
        message.channel.send("Couldn't find that applicant")
      }
    }
  })
}

module.exports.help = {
  name: "discord",
  usage: "[in game id]",
  description: "Get the discord an applicant",
  permission: "KICK_MEMBERS"
}