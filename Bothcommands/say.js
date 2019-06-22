module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("no."); //if can't manage messages
    
    message.delete().catch(); //Deletes your message and catches whatever happens
    message.channel.send(args.join(" ")); //sends whatever you said
}


module.exports.help = {
    name: "say",
    usage: "[message]",
    description: "Make the bot say something",
    permission: "MANAGE_MESSAGES"
}