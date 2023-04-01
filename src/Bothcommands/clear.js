const botconfig = require("../botconfig.json")
module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        try {
            bot.guilds.cache.get(args.guild_id).channels.cache.get(args.channel_id).bulkDelete(args.num).then(() => { //deletes the number of messages specified
                return resolve(`Cleared ${args.num} cancer cells`)
            });
        } catch (error) { //didn't work
            console.log(error);
            return resolve("these messages are so old not even the power of alfred can delete them")
        }
    })
}


module.exports.help = {
    name: "clear",
    aliases: [],
    usage: "<number of messages>",
    description: "Deletes a specified number of messages",
    args: [{
        type: 4,
        name: "num",
        description: "Number of messages to remove",
        required: true,
        missing: "Please specify the number of messages to remove",
        parse: (bot, message, args) => {
          return args[0]
        }
      }],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
    slash: true
}