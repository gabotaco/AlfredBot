const photoRole = "743968134016401510"
const botconfig = require("../botconfig")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        const member = bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id);

        if (member.roles.cache.has(photoRole)) { //if they have the role by ID
            member.roles.remove(photoRole) //removes role
            resolve("Took away the photo challenge role")
            return;
        } else { //Don't have the role
            member.roles.add(photoRole) //adds role
            resolve("Added the phot challenge role")
            return;
        }
    })
}

module.exports.help = {
    name: "photo",
    aliases: [],
    usage: "",
    args: [],
    description: "Gives or takes away the photo challenge pings role",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}