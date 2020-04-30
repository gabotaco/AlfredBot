const warzoneRole = "705247928125489212"

module.exports.run = async (bot, message, args) => {
    if (message.member.roles.cache.has(warzoneRole)) { //if they have the role by ID
        message.member.roles.remove(warzoneRole) //removes role
        message.channel.send("Took away the Warzone role")
        return;
    } else { //Do have it
        message.member.roles.add(warzoneRole) //adds role
        message.channel.send("Given the Warzone role!")
        return;
    }
}

module.exports.help = {
    name: "warzone",
    usage: "",
    description: "Gives or takes away the warzone role",
    permission: "SEND_MESSAGES"
}