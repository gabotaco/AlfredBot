const botconfig = require("../botconfig.json")
const functions = require("../functions.js")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    const SearchColumn = functions.GetSearchColumn(args.id);

    bot.con.query(`SELECT discord_id FROM applications WHERE ${SearchColumn} = '${args.id}'`, function (err, result) {
      if (err) {
        console.log(err)
        return reject("There was an error")
      }

      if (result.length > 0) {
        return resolve(`<@${result[0].discord_id}>`)
      } else {
        return resolve("Couldn't find that applicant")
      }
    })
  })
}

module.exports.help = {
  name: "discord",
  aliases: [],
  usage: "<in game id>",
  description: "Get the discord an applicant",
  args: [{
    type: 4,
    name: "id",
    description: "Id of an employee",
    required: true,
    missing: "Please specify the id of an employee",
    parse: (bot, message, args) => {
      return args[0]
    }
  }],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  slash: true
}