const ETS2Role = "478393923656482827"

module.exports.run = async (bot, message, args) => {
    if (message.member.roles.cache.has(ETS2Role)) { //If they have the role
        message.member.roles.remove(ETS2Role) //remove it
        message.channel.send("Took away the ETS2 role")
        return;
    } else { //if they don't have the role
        message.member.roles.add(ETS2Role) //add it
        message.channel.send("Given the ETS2 role!")
        return;
    }
}

module.exports.help = {
    name: "ets2",
    usage: "",
    description: "Gives or takes away the ETS2 role",
    permission: "SEND_MESSAGES"
}