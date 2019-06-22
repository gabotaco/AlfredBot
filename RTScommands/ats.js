const ATSRole = "478393609540861952"

module.exports.run = async (bot, message, args) => {
    if (message.member.roles.has(ATSRole)) { //if they have the role by ID
        message.member.removeRole(ATSRole) //removes role
        message.channel.send("Took away the ATS role")
        return;
    } else { //If they don't have the role
        message.member.addRole(ATSRole) //adds role
        message.channel.send("Given the ATS role!")
        return;
    }
}

module.exports.help = {
    name: "ats",
    usage: "",
    description: "Gives or takes away the ATS role",
    permission: "SEND_MESSAGES"
}