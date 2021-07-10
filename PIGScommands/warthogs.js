const WarThogsID = "572838338470346757"
const botconfig = require("../botconfig")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        const member = bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id);

        if (member.roles.cache.has(WarThogsID)) { //if they have the role by ID
            member.roles.remove(WarThogsID) //removes role
            resolve("Took away the warthogs role")
            return;
        } else { //Don't have the role
            member.roles.add(WarThogsID) //adds role
            resolve("Given the warthogs role!")
            return;
        }
    })
}

module.exports.help = {
    name: "warthogs",
    aliases: [],
    usage: "",
    args: [],
    description: "Gives or takes away the warthog role",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}