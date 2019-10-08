module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //can't manage nicknames
    message.reply("You can't do that dummie");
    return;
  }

  const messageArray = message.content.split("\"") //Split up discord id, name, and id
  const DiscordID = args[0] //discord id is first arg
  const InGameName = messageArray[1] //in game name is in between quotes
  const InGameID = args[args.length - 1] //in game ID is last arg

  if (!DiscordID || !InGameName || !InGameID) { //Invalid use of command
    return message.channel.send(".fix [discord id] \"in game id\" [in game id]")
  }


  if (!message.guild.members.has(DiscordID)) return message.channel.send("That person isn't in the discord!") //check if they are in the discord

  bot.con.query(`UPDATE members SET in_game_id = '${InGameID}', discord_id = '${DiscordID}', in_game_name = '${InGameName}' WHERE in_game_id = '${InGameID}' OR discord_id = '${DiscordID}'`, function (err, result, fields) { //change persons info without changing deadline
    if (err) {
      if (err.errno == 1366) {
        return message.channel.send("Invalid characters.")
      } else {
        return console.log(err)
      }
    }

    if (result.affectedRows > 0) {
      return message.channel.send("Fixed!")
    } else {
      return message.channel.send("They aren't hired")
    }
  })
}

module.exports.help = {
  name: "fix",
  usage: "{discord ID} \"{In game name}\" [in-game ID]",
  description: "Add another person to the PIGS family",
  permission: "MANAGE_NICKNAMES"
}