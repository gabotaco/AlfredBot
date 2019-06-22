const botconfig = require("../botconfig.json")

module.exports.run = async (bot, message, args) => {
    if (message.member.roles.has(botconfig.PIGSEdgyRole)) { //if they have the role by ID
        message.member.removeRole(botconfig.PIGSEdgyRole) //removes role
        message.channel.send("Took away the edgy role")
        return;
    } else { //Don't have the role
        message.member.addRole(botconfig.PIGSEdgyRole) //adds role
        message.channel.send("Given the edgy role!")
        return;
    }
}

module.exports.help = {
    name: "kys",
    usage: "",
    description: "Gives or takes away the edgy role",
    permission: "SEND_MESSAGES"
}