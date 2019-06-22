const botconfig = require("../botconfig.json")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You are an employee. You are always available")

    if (message.guild.id == botconfig.PIGSServer) { //Get correct unavailable role
        var UnavailableRole = botconfig.PIGSUnavailableRole
    } else if (message.guild.id == botconfig.RTSServer) {
        var UnavailableRole = botconfig.RTSUnavailableRole
    }

    if (message.member.roles.has(UnavailableRole)) { //if they have the role by ID
        message.member.removeRole(UnavailableRole) //removes role
        message.channel.send("Woop Woop")
    } else { //If they don't have the role
        message.channel.send("You are already available")
    }
}

module.exports.help = {
    name: "available",
    usage: "",
    description: "Marks you as available",
    permission: "KICK_MEMBERS"
}