const Discord = require("discord.js")
const botconfig = require("../botconfig.json")
const functions = require("../functions")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        const bicon = bot.user.displayAvatarURL(); //bot profile pic

        const used = process.memoryUsage().heapUsed / 1024 / 1024; //get used
        const memberused = Math.round(used * 100) / 100 //then round

        const botembed = new Discord.MessageEmbed()
            .setDescription("***Bot Information***")
            .setColor("#15f153")
            .setThumbnail(bicon)
            .addField("Created By", "Gabo")
            .addField("Created On", bot.user.createdAt)
            .addField("Memery Used in MB", functions.numberWithCommas(memberused))
            .addField("Ping", bot.ws.ping)
            .addField("Minutes online", functions.numberWithCommas(Math.round(bot.uptime / 60000))) //Convert to minutes
            .addField("GitHub", "https://github.com/Gabolicious/AlfredBot")

        return resolve(botembed);
    })
}

module.exports.help = {
    name: "botinfo",
    aliases: ["bi"],
    usage: "",
    description: "Get some handy info about Alfred",
    args: [],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}