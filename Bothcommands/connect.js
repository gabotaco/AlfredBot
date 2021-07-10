const Discord = require("discord.js")
const functions = require("../functions.js")
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    const Server = functions.GetServerIPandPort(args.server) //get server ip and port
    if (!Server) return resolve("Invalid server. [1 or OS, 2, 3, 4, 5, 6, 7, 8, 9, A]")


    const ConnectEmbed = new Discord.MessageEmbed()
      .setTitle(`Connect to Server ${args.server}`)
      .setColor("RANDOM")
      .setDescription(`<fivem:\//connect/${Server.ip}:${Server.port}>`)
    return resolve(ConnectEmbed)
  })
}

module.exports.help = {
  name: "connect",
  aliases: ["con"],
  usage: "<server number>",
  description: "Get a direct connect link for a server",
  args: [{
      type: 3,
      name: "server",
      description: "The server number",
      required: true,
      missing: "Please specify a server number [1 or OS, 2, 3, 4, 5, 6, 7, 8, 9, A]",
      parse: (bot, message, args) => {
          return args[0]
      }
  }],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
  slash: true
}