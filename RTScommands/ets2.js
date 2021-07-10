const ETS2Role = "478393923656482827"
const botconfig = require("../botconfig")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        const member = bot.guilds.cache.get(args.guild_id).members.cache.get(args.author_id);

        if (member.roles.cache.has(ETS2Role)) { //if they have the role by ID
            member.roles.remove(ETS2Role) //removes role
            resolve("Took away the ETS2 role")
            return;
        } else { //Don't have the role
            member.roles.add(ETS2Role) //adds role
            resolve("Given the ETS2 role!")
            return;
        }
    })
}

module.exports.help = {
    name: "ets2",
    aliases: [],
    usage: "",
    args: [],
    description: "Gives or takes away the ETS2 role",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}