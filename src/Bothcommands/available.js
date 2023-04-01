const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        if (args.guild_id == botconfig.PIGSServer) { //Get correct unavailable role
            var UnavailableRole = botconfig.PIGSRoles.UnavailableRole
        } else if (args.guild_id == botconfig.RTSServer) {
            var UnavailableRole = botconfig.RTSRoles.UnavailableRole
        }
    
        const member = bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id)
        if (member.roles.cache.has(UnavailableRole)) { //if they have the role by ID
            member.roles.remove(UnavailableRole) //removes role
            return resolve("Woop Woop")
        } else { //If they don't have the role
            return resolve("You are already available")
        }
    })
}

module.exports.help = {
    disabled: true,
    name: "available",
    aliases: ["avail"],
    usage: "",
    args: [],
    description: "Marks you as available",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
    slash: true
}