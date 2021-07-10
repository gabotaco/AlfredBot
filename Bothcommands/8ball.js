const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1); //capitalize first letter and then keep rest of string the same
}

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        let question = args.question.capitalize(); //Everything after the command into one string and first letter capitalized
        if (!question.endsWith("?")) { //if it doesn't end with a ?
            question += "?" //add a ?
        }

        if (Math.random() <= 0.5) { //50%
            var answer = botconfig.YesResponses[Math.floor(Math.random() * botconfig.YesResponses.length)] //answer is yes
        } else {
            var answer = botconfig.NoResponses[Math.floor(Math.random() * botconfig.NoResponses.length)] //answer is no
        }

        const ballembed = new Discord.MessageEmbed()
            .setColor("#FF9900")
            .addField("Question", question)
            .addField("Answer", answer) //pick a random response

        return resolve(ballembed);
    })
}

module.exports.help = {
    name: "8ball",
    aliases: ["8b"],
    usage: "<question>",
    args: [{
        type: 3,
        name: "question",
        description: "Question to ask Alfred",
        required: true,
        missing: "Please ask a full question ya dummie.",
        parse: (bot, message, args) => {
            return args.slice(0).join(" ");
        }
    }],
    description: "Ask the mighty Alfred any yes or no question",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true
}