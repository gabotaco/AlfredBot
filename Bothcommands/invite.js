const botconfig = require("../botconfig.json")

module.exports.run = async (bot, message, args) => {
    if (message.guild.id == botconfig.PIGSServer) { 
        message.author.send("https://discord.gg/9WRV87P") //RTS invite
    } else if (message.guild.id == botconfig.RTSServer) {
        message.author.send("https://discord.gg/JTkbVmE") //PIGS invite
    }
    message.react('👍')
}

module.exports.help = {
    name: "invite",
    usage: "",
    description: "Get invited to RTS' server",
    permission: "SEND_MESSAGES"
}