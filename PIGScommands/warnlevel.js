const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!args[0]) args[0] = message.member.id;

    const Response = await functions.GetIDAndSearchColumn(message, args)
    const ID = Response[1]
    const SearchColumn = Response[0]

    bot.con.query(`SELECT warnings FROM members WHERE ${SearchColumn} = '${ID}'`, function (err, result, fields) {
        if (err) console.log(err)
        message.channel.send(`${result[0].warnings} warnings`)
    })
}

module.exports.help = {
    name: "warnlevel",
    usage: "",
    description: "Check how many warns you have",
    permission: "SEND_MESSAGES"
}