const authentication = require("../authentication")
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //can't manage nicknames
    message.reply("You can't do that dummie");
    return;
  }

  let d = new Date()
  d.setDate(d.getDate() + 14) //add 14 days to deadline
  const date = d.toISOString().slice(0, 19).replace('T', ' ');

  if (message.guild.id == botconfig.PIGSServer) { //pigs server
    var SignMeUpIndex = botconfig.PIGSSignMeUpIndex
    var CompanyName = "pigs"
  } else if (message.guild.id == botconfig.RTSServer) { //rts server
    var SignMeUpIndex = botconfig.RTSSignMeUpIndex
    var CompanyName = "rts"
  }

  if (args[0] && !args[1]) { //if they only have 1 arg
    authentication.authenticate().then(async (auth) => {
      const InGameID = args[0] //in game id is first arg

      const response = await functions.GetDiscordFromID(auth, message.channel, InGameID, SignMeUpIndex)
      const Discord = message.guild.members.get(response); //get discord member from id

      if (Discord) { //if its a valid discord member
        const DiscordID = response

        let NotHired = true //not hired
        await functions.FindApplicant(auth, message.channel, InGameID, botconfig.ApplicationInGameIDIndex, SignMeUpIndex, function (row) { //Find applicant with that ID
          if (NotHired) { //haven't hired one yet
            NotHired = false; //yes i have
            const InGameName = row[botconfig.ApplicationInGameNameIndex] //get in game name from app
            Hire(DiscordID, InGameName, InGameID) //Hire em
          }
        })
      } else { //Not in the server
        return message.channel.send("That user isn't in this discord or doesn't exist")
      }
    });
  } else { //privided either nothing or has more than 1 arg
    //.hire discord_id "In game name" in_game_id
    const messageArray = message.content.split("\"") //Split up discord id, name, and id
    const DiscordID = args[0] //discord id is first arg
    const InGameName = messageArray[1] //in game name is in between quotes
    const InGameID = args[args.length - 1] //in game ID is last arg

    if (!DiscordID || !InGameName || !InGameID) { //Invalid use of command
      return message.channel.send(".hire [discord id] \"in game id\" [in game id]")
    }


    authentication.authenticate().then((auth) => {
      Hire(DiscordID, InGameName, InGameID) //Hire em
    });
  }

  async function Hire(DiscordID, InGameName, InGameID) {
    if (!message.guild.members.has(DiscordID)) return message.channel.send("That person isn't in the discord!")

    bot.con.query(`UPDATE members SET in_game_id = '${InGameID}', discord_id = '${DiscordID}', in_game_name = '${InGameName}' WHERE in_game_id = '${InGameID}' OR discord_id = '${DiscordID}'`, function (err, result, fields) {
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
    /*bot.con.query(``, function (err, result, fields) {
      if (err) console.log(err)
      console.log(result, fields)
    })*/
  }
}

module.exports.help = {
  name: "fix",
  usage: "{discord ID} \"{In game name}\" [in-game ID]",
  description: "Add another person to the PIGS family",
  permission: "MANAGE_NICKNAMES"
}