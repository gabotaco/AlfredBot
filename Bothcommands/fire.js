const { google } = require("googleapis")
const authentication = require("../authentication")
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //Can't manage nicknames
    message.reply("You can't do that dummie");
    return;
  }

  if (!args[0] || !args[1]) { //if there isn't ID or reason
    return message.channel.send(".fire [member id] [reason]")
  }

  const Response = functions.GetIDAndSearchColumn(message, args);
  const SearchColumn = Response[0]
  const ID = Response[1]

  const leaveReason = args.join(" ").slice(ID.length); //Reason is everything after ID

  if (message.guild.id == botconfig.PIGSServer) { //PIGS server
    var MainSheet = botconfig.PIGSSheet
    var MainRange = botconfig.PIGSEmployeeRange
    var MainRangeStartingRow = botconfig.PIGSEmployeeRangeStartingRow
    var MainNotesIndex = botconfig.PIGSEmployeeRangeNotesIndex
    var MainDiscordIndex = botconfig.PIGSEmployeeRangeDiscordIndex
    var FiredRange = botconfig.PIGSFiredEmployeeRange
    var FiredRangeStartingRow = botconfig.PIGSFiredEmployeeRangeStartingRow
    var OtherSheet = botconfig.RTSSheet
    var OtherSheetRange = botconfig.RTSFiredEmployeeRange
    var OtherSheetRangeStartingRow = botconfig.RTSFiredEmployeeRangeStartingRow
    var OtherSheetDiscordIndex = botconfig.RTSEmployeeRangeDiscordIndex
  } else if (message.guild.id == botconfig.RTSServer) { //RTS server
    var MainSheet = botconfig.RTSSheet
    var MainRange = botconfig.RTSEmployeeRange
    var MainRangeStartingRow = botconfig.RTSEmployeeRangeStartingRow
    var MainNotesIndex = botconfig.RTSEmployeeRangeNotesIndex
    var MainDiscordIndex = botconfig.RTSEmployeeRangeDiscordIndex
    var FiredRange = botconfig.RTSFiredEmployeeRange
    var FiredRangeStartingRow = botconfig.RTSFiredEmployeeRangeStartingRow
    var OtherSheet = botconfig.PIGSSheet
    var OtherSheetRange = botconfig.PIGSFiredEmployeeRange
    var OtherSheetRangeStartingRow = botconfig.PIGSFiredEmployeeRangeStartingRow
    var OtherSheetDiscordIndex = botconfig.PIGSEmployeeRangeDiscordIndex
  }

  async function fire(auth) {
    const MemberData = await functions.GetMemberDetails(auth, MainSheet, MainRange, SearchColumn, ID, message.channel); //Gets member 
    if (!MemberData) return message.channel.send("Couldn't find that member") //No member

    functions.RemoveMember(auth, message.channel, MainSheet, SearchColumn, MainRange, MainRangeStartingRow, ID); //Remove him from top of sheet

    MemberData[MainNotesIndex] = leaveReason; //Add to notes
    MemberData[MainDiscordIndex] = ''; //Remove discord ID

    functions.AddMember(auth, message.channel, MainSheet, FiredRange, FiredRangeStartingRow, MemberData, bot) //Add to fired Range

    removeDiscordID(auth, MemberData[MainDiscordIndex]) //Remove discord ID from other sheet in case of switching companys
  }
  authentication.authenticate().then((auth) => {
    fire(auth);
  });



  function removeDiscordID(auth, discordID) { //remove id from other company sheet
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
      spreadsheetId: OtherSheet,
      range: OtherSheetRange,
    }, (err, res) => {
      if (err) return message.channel.send('The API returned an ' + err);
      const rows = res.data.values;
      if (rows.length) {
        let currentRow = OtherSheetRangeStartingRow
        rows.map((row) => {
          if (row[OtherSheetDiscordIndex] == discordID) { //if matching discord id
            sheets.spreadsheets.values.batchClear({
              auth: auth,
              spreadsheetId: OtherSheet,
              resource: {
                ranges: [
                  [`B${currentRow}:B${currentRow}`] //remove discord column
                ]
              }
            })
          }
          currentRow++;
        })
      }

    })
  }
}

module.exports.help = {
  name: "fire",
  usage: "[member id] [reason]",
  description: "Fire a member",
  permission: "MANAGE_NICKNAMES"
}