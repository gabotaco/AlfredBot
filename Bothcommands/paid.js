const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!message.author.id == botconfig.RockID && !message.author.id == botconfig.GaboID) { //if not rock or gabo
    message.reply("You can't do that")
    return;
  }

  if (!args[0]) { //no discord id
    return message.channel.send(".paid [discord id]")
  }

  const User = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])); //get the member @'d or by discord id

  if (message.guild.id == botconfig.PIGSServer) { //pigs server
    var VoucherSheet = botconfig.PIGSVoucher
  } else if (message.guild.id == botconfig.RTSServer) { //rts server
    var VoucherSheet = botconfig.RTSVoucher
  }

  authentication.authenticate().then((auth) => {
    functions.PayManager(auth, User.id, message.channel, VoucherSheet) //pay manager
  });
}

module.exports.help = {
  name: "paid",
  usage: "[discord id]",
  description: "Clears all pending payouts",
  permission: "ADMINISTRATOR"
}