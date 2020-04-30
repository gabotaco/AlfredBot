const WarThogsID = "572838338470346757"

module.exports.run = async (bot, message, args) => {
    if (message.member.roles.cache.has(WarThogsID)) { //if they have the role by ID
        message.member.roles.remove(WarThogsID) //removes role
        message.channel.send("Took away the warthogs role")
        return;
    } else { //They don't have the role
        message.member.roles.add(WarThogsID) //adds role
        message.channel.send("Given the warthogs role!")
        return;
    }
}

module.exports.help = {
    name: "warthogs",
    usage: "",
    description: "Gives or takes away the warthog role",
    permission: "SEND_MESSAGES"
}