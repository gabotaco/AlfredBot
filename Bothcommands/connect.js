const Discord = require("discord.js")
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!args[0] || (args[0].toLowerCase() != 'a' && (args[0] < 1 || args[0] > 9))) return message.channel.send("You must provide a valid server number")

  const Response = functions.GetServerIPandPort(args[0]) //get server ip and port
  const ServerIP = Response[0]
  const ServerPort = Response[1]

  const ConnectEmbed = new Discord.MessageEmbed()
  .setTitle(`Connect to Server ${args[0]}`)
  .setColor("RANDOM")
  .setDescription(`<fivem:\//connect/${ServerIP}:3012${ServerPort}>`)
  message.channel.send(ConnectEmbed)
}

module.exports.help = {
  name: "connect",
  usage: "[server port]",
  description: "Get a direct connect link for a server",
  permission: "SEND_MESSAGES"
}