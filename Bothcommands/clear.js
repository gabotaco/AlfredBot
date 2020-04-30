module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) { //if can't manage messages
        message.channel.send("You don't have permission to delete other messages")
        return;
    }

    if (!args[0]) { //if no args
        return message.channel.send(".clear [number of messages]")
    }

    try {
        message.channel.bulkDelete(args[0]).then(() => { //deletes the number of messages specified
            message.channel.send(`Cleared ${args[0]} cancer cells`).then(msg => msg.delete({ timeout: 1000 })) //then sends a message saying that it deleted the cancer cells. Then deletes the message after 1000 milliseconds
        });
    } catch (error) { //didn't work
        message.channel.send("these messages are so old not even the power of alfred can delete them")
    }
}


module.exports.help = {
    name: "clear",
    usage: "[number of messages]",
    description: "Deletes a specified number of messages",
    permission: "MANAGE_MESSAGES"
}