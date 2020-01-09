module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
        return message.reply("You can't do that!")
    } 
    if (!args[0]) {
        return message.channel.send(".delete [in game id]")
    }
    bot.con.query(`DELETE FROM members WHERE in_game_id = '${args[0]}'`, function (err, result, fields) {
        if (result.affectedRows > 0) {
            message.channel.send(`Deleted ${result.affectedRows} rows`)
        } else {
            message.channel.send("Couldn't find anyone with that id")
        }
    })
}

module.exports.help = {
    name: "delete",
    usage: "[in game id]",
    description: "Delete people from database",
    permission: "KICK_MEMBERS"
}