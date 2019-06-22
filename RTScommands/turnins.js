const turninrole = "475393112915574821"

module.exports.run = async (bot, message, args) => {
    if (message.member.roles.has(turninrole)) { //if they have the role
        await message.member.removeRole(turninrole) //remove it
        await message.channel.send("Took away the voucher role")
        return;
    } else { //if they don't have the role
        await message.member.addRole(turninrole) //add it
        await message.channel.send("Given the voucher role!")
        return;
    }
}

module.exports.help = {
    name: "turnins",
    usage: "",
    description: "Gives or takes away the voucher role",
    permission: "SEND_MESSAGES"
}