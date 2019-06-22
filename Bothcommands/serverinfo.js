const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    const sicon = message.guild.iconURL;

    const serverembed = new Discord.RichEmbed()
        .setDescription("Server Information")
        .setColor("RANDOM")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created On", message.guild.createdAt)
        .addField("Owner", message.guild.owner)
        .addField("You Joined", message.member.joinedAt)
        .addField("Total members", message.guild.memberCount) //all of this is random info I found under Guild in discord.js
    
    return message.channel.send(serverembed);
}

module.exports.help = {
    name: "serverinfo",
    usage: "",
    description: "Get some handy info about the server",
    permission: "SEND_MESSAGES"
}