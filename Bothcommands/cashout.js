const Discord = require("discord.js")
const { google } = require('googleapis'); //allows you to use googles api
const authentication = require("../authentication"); //Imports functions from authentication file
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  const cashoutUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]) || message.member) //either first mention or member with the discord ID or the message author

  authentication.authenticate().then(async (auth) => { //authenticate the function
    const sheets = google.sheets({ version: 'v4', auth }); //defines sheets api version

    if (message.guild.id == botconfig.PIGSServer) { //PIGS server
      var SheetID = botconfig.PIGSVoucher //Voucher sheet
      var MainSheetID = botconfig.PIGSSheet //Main sheet with appsheet name
      var AppSheetNameRange = botconfig.PIGSAppSheetNameRange //App sheet name range
    }
    else if (message.guild.id == botconfig.RTSServer) { //RTS server
      var SheetID = botconfig.RTSVoucher //Voucher sheet
      var MainSheetID = botconfig.RTSSheet //main sheet with app sheet name
      var AppSheetNameRange = botconfig.RTSAppSheetNameRange //App sheet name range
    }

    const AppSheetName = await functions.GetAppSheetName(auth, MainSheetID, AppSheetNameRange, cashoutUser.id, message.channel) //Gets appsheet name
    if (!AppSheetName) return message.channel.send("Couldn't find your app sheet name")

    sheets.spreadsheets.values.get({
      spreadsheetId: SheetID,
      range: `${AppSheetName}!${botconfig.VoucherCashoutRange}`,
    }, (err, res) => {
      if (err) return message.channel.send('The API returned an ' + err);

      const rows = res.data.values;
      if (rows.length) {
        rows.map((row) => { //Still only 1 row but oh well
          let cashoutEmbed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle(`Cashout for ${cashoutUser.displayName}`)
            .addField("Vouchers", row[0])
            .addField("Cash", row[1])

          message.channel.send(cashoutEmbed)
        })
      }
    })
  });
}

module.exports.help = {
  name: "cashout",
  usage: "{in game id}",
  description: "Gets how many vouchers you owe rock and how much he owes you.",
  permission: "KICK_MEMBERS"
}