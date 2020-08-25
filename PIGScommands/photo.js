const photoRole = "743968134016401510"

module.exports.run = async (bot, message, args) => {
    // if they have the role, remove it
    if (message.member.roles.cache.has(photoRole)) {
        message.member.roles.remove(photoRole);
        return message.channel.send("Took away the photo challenge role");
    }

    // if they don't have the role, add it
    else {
        message.member.roles.add(photoRole);
        return message.channel.send("Enjoy your pings!");
    }
}

module.exports.help = {
    name: "photo",
    usage: "",
    description: "Gives or takes away the photo challenge pings role",
    permission: "SEND_MESSAGES"
}