const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        const member = bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id);

        if (member.roles.cache.has(botconfig.PIGSRoles.EdgyRole)) { //if they have the role by ID
            member.roles.remove(botconfig.PIGSRoles.EdgyRole) //removes role
            resolve("Took away the edgy role")
            return;
        } else { //Don't have the role
            member.roles.add(botconfig.PIGSRoles.EdgyRole) //adds role
            resolve("Given the edgy role!")
            return;
        }
    })
}

module.exports.help = {
    name: "kys",
    aliases: [],
    usage: "",
    description: "Gives or takes away the edgy role",
    args: [],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}