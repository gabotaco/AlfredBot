const authentication = require("../authentication")
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //can't manage nicknames
    message.reply("You can't do that dummie");
    return;
  }
  const InGameID = args[0]
  const NewDiscord = args[1]
  if (!InGameID || !NewDiscord) return message.channel.send(".fix [in game id] [discord id]")

  if (message.guild.id == botconfig.PIGSServer) { //pigs server
    var MainSheet = botconfig.PIGSSheet
    var InGameIDIndex = botconfig.PIGSEmployeeRangeInGameIDIndex
    var DiscordIndex = botconfig.PIGSEmployeeRangeDiscordIndex
    var EmployeeRange = botconfig.PIGSEmployeeRange
    var EmployeeRangeStartingRow = botconfig.PIGSEmployeeRangeStartingRow
  } else if (message.guild.id == botconfig.RTSServer) { //rts server
    var MainSheet = botconfig.RTSSheet
    var InGameIDIndex = botconfig.RTSEmployeeRangeInGameIDIndex
    var DiscordIndex = botconfig.RTSEmployeeRangeDiscordIndex
    var EmployeeRange = botconfig.RTSEmployeeRange
    var EmployeeRangeStartingRow = botconfig.RTSEmployeeRangeStartingRow
  }

  authentication.authenticate().then((auth) => {
    Hire(auth, InGameID, NewDiscord) //Hire em
  });


  async function Hire(auth, InGameID, NewDiscord) {
    let MemberData = await functions.GetMemberDetails(auth, MainSheet, EmployeeRange, InGameIDIndex, InGameID, message.channel) //Try to see if they were hired before
    if (!MemberData) { //Not hired before
      return message.channel.send("Couldn't find that member")
    }
    MemberData[DiscordIndex] = NewDiscord; //Set discord id of old member to the current discord id

    functions.RemoveMember(auth, message.channel, MainSheet, InGameIDIndex, EmployeeRange, EmployeeRangeStartingRow, InGameID) //remove from fired

    functions.AddMember(auth, message.channel, MainSheet, EmployeeRange, EmployeeRangeStartingRow, MemberData, bot) //Hire
  }
}

module.exports.help = {
  name: "fix",
  usage: "[in game id] [discord id]",
  description: "Changes Discord ID",
  permission: "MANAGE_NICKNAMES"
}