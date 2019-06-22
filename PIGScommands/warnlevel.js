const fs = require("fs")
const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"))

module.exports.run = async (bot, message, args) => {
    const employee = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])) || message.member

    if (warns[employee.id]) { //if they have warnings
        return message.channel.send(`${warns[employee.id].warns} warnings`) //send num of warnings
    } else { //no warnings
        return message.channel.send("0 warnings")
    }

}

module.exports.help = {
    name: "warnlevel",
    usage: "",
    description: "Check how many warns you have",
    permission: "SEND_MESSAGES"
}