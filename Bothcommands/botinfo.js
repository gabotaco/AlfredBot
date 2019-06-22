const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    const bicon = bot.user.displayAvatarURL; //bot profile pic

    const used = process.memoryUsage().heapUsed / 1024 / 1024; //get used
    const memberused = Math.round(used * 100) / 100 //then round

    const lastWords = bot.user.lastMessage.content

    const botembed = new Discord.RichEmbed()
        .setDescription("***Bot Information***")
        .setColor("#15f153")
        .setThumbnail(bicon)
        .addField("Created By", "Gabo")
        .addField("Created On", bot.user.createdAt)
        .addField("Memery Used in MB", memberused)
        .addField("Ping", bot.ping)
        .addField("Minutes online", Math.round((bot.uptime / 60) / 60))

    if (lastWords) botembed.addField("Last message", lastWords)

    return message.channel.send(botembed);
}

module.exports.help = {
    name: "botinfo",
    usage: "",
    description: "Get some handy info about Alfred",
    permission: "SEND_MESSAGES"
}