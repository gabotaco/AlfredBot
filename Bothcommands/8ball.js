const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
String.prototype.capitalize = function () { 
    return this.charAt(0).toUpperCase() + this.slice(1); //capitalize first letter and then keep rest of string the same
}

module.exports.run = async (bot, message, args) => {
    if (!args[1]) return message.reply("please ask a full question ya dummie."); //if question isn't at least 2 words long

    let question = args.slice(0).join(" ").capitalize(); //Everything after the command into one string and first letter capitalized
    if (!question.endsWith("?")) { //if it doesn't end with a ?
        question += "?" //add a ?
    }
    
    if (Math.random() <= 0.5) { //50%
        var answer = botconfig.YesResponses[Math.floor(Math.random() * botconfig.YesResponses.length)] //answer is yes
    } else {
        var answer = botconfig.NoResponses[Math.floor(Math.random() * botconfig.NoResponses.length)] //answer is no
    }

    const ballembed = new Discord.RichEmbed() 
            .setColor("#FF9900") 
            .addField("Question", question) 
            .addField("Answer", answer) //pick a random response

    return await message.channel.send(ballembed); 
}


module.exports.help = {
    name: "8ball",
    usage: "[question]",
    description: "Ask the mighty Alfred any yes or no question",
    permission: "SEND_MESSAGES"
}