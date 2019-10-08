const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!args[0]) args[0] = message.member.id;

    const Response = await functions.GetIDAndSearchColumn(message, args)
    const ID = Response[1]
    const SearchColumn = Response[0]

    bot.con.query(`SELECT warnings FROM members WHERE ${SearchColumn} = '${ID}'`, function (err, result, fields) { //get the warning number for the member
        if (err) return console.log(err)
        if (result.length == 0) return message.channel.send("Not hired") //not hired
        message.channel.send(`${result[0].warnings} warnings`) //hired
    })
}

module.exports.help = {
    name: "warnlevel",
    usage: "",
    description: "Check how many warns you have",
    permission: "SEND_MESSAGES"
}