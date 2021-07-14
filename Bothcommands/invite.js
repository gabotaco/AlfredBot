const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        if (args.guild_id == botconfig.PIGSServer) { 
            resolve("https://discord.gg/9WRV87P") //RTS invite
        } else if (args.guild_id == botconfig.RTSServer) {
            resolve("https://discord.gg/JTkbVmE") //PIGS invite
        }
    })
}

module.exports.help = {
    name: "invite",
    aliases: [],
    usage: "",
    description: "Get invited to RC' servers",
    args: [],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true,
    hidden: true
}