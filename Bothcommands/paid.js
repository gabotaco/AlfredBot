const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    if (args.guild_id == botconfig.PIGSServer) { //if pigs server
      var CompanyName = "pigs"
    } else {
      var CompanyName = "rts"
    }

    functions.PayManager(bot.con, args.manager, CompanyName).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports.help = {
  name: "paid",
  aliases: [],
  usage: "<discord id>",
  description: "Clears all pending payouts",
  args: [{
    type: 6,
    name: "manager",
    description: "The manager you are paying",
    required: true,
    missing: "Please specify a manager",
    parse: (bot, message, args) => {
      const user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
      if (user) {
        return user.id;
      }
    }
  }],
  permission: [...botconfig.OWNERS],
  slash: true
}