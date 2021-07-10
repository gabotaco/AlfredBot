const owoRole = "472023222674784259"
const botconfig = require("../botconfig")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        const member = bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id);

        if (member.roles.cache.has(owoRole)) { //if they have the role by ID
            member.roles.remove(owoRole) //removes role
            resolve("Took away the NSFW role")
            return;
        } else { //Don't have the role
            member.roles.add(owoRole) //adds role
            resolve("Given the NSFW role!")
            return;
        }
    })
}

module.exports.help = {
    name: "owo",
    aliases: [],
    usage: "",
    args: [],
    description: "Gives or takes away the NSFW role",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}