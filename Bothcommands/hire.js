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
  const date = `${botconfig.Months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`

  if (message.guild.id == botconfig.PIGSServer) { //pigs server
    var SignMeUpIndex = botconfig.PIGSSignMeUpIndex
    var MainSheet = botconfig.PIGSSheet
    var FiredRange = botconfig.PIGSFiredEmployeeRange
    var FiredRangeStartingRow = botconfig.PIGSFiredEmployeeRangeStartingRow
    var InGameIDIndex = botconfig.PIGSEmployeeRangeInGameIDIndex
    var DiscordIndex = botconfig.PIGSEmployeeRangeDiscordIndex
    var DeadlineIndex = botconfig.PIGSEmployeeRangeDeadlineIndex
    var EmployeeRange = botconfig.PIGSEmployeeRange
    var EmployeeRangeStartingRow = botconfig.PIGSEmployeeRangeStartingRow
  } else if (message.guild.id == botconfig.RTSServer) { //rts server
    var SignMeUpIndex = botconfig.RTSSignMeUpIndex
    var MainSheet = botconfig.RTSSheet
    var FiredRange = botconfig.RTSFiredEmployeeRange
    var FiredRangeStartingRow = botconfig.RTSFiredEmployeeRangeStartingRow
    var InGameIDIndex = botconfig.RTSEmployeeRangeInGameIDIndex
    var DiscordIndex = botconfig.RTSEmployeeRangeDiscordIndex
    var DeadlineIndex = botconfig.RTSEmployeeRangeDeadlineIndex
    var EmployeeRange = botconfig.RTSEmployeeRange
    var EmployeeRangeStartingRow = botconfig.RTSEmployeeRangeStartingRow
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
            Hire(auth, DiscordID, InGameName, InGameID) //Hire em
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
      Hire(auth, DiscordID, InGameName, InGameID) //Hire em
    });
  }

  async function Hire(auth, DiscordID, InGameName, InGameID) {
    let MemberData = await functions.GetMemberDetails(auth, MainSheet, FiredRange, InGameIDIndex, InGameID, message.channel) //Try to see if they were hired before
    if (!MemberData) { //Not hired before
      if (message.guild.id == botconfig.PIGSServer) {
        MemberData = [DiscordID, InGameName, null, null, InGameID, "", null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null, null, null, date] //PIGS new member data
      } else if (message.guild.id == botconfig.RTSServer) {
        MemberData = [DiscordID, InGameName, null, null, InGameID, "", 0, 0, 0, 0, 0, 0, 0, 0, 0, null, 0, null, date] //RTS new member data
      }
    }
    else { //Hired before
      MemberData[DiscordIndex] = DiscordID; //Set discord id of old member to the current discord id
      MemberData[DeadlineIndex] = date //set date to the new deadline

      functions.RemoveMember(auth, message.channel, MainSheet, InGameIDIndex, FiredRange, FiredRangeStartingRow, InGameID) //remove from fired
    }
    functions.AddMember(auth, message.channel, MainSheet, EmployeeRange, EmployeeRangeStartingRow, MemberData, bot) //Hire
    
    functions.UpdateApplicantStatus(auth, message.channel, InGameID, SignMeUpIndex, "Hired") //set app to hired
  }
}

module.exports.help = {
  name: "hire",
  usage: "{Member ID} \"{In game name}\" [in-game ID]",
  description: "Add another person to the PIGS family",
  permission: "MANAGE_NICKNAMES"
}