const Discord = require("discord.js");
const superagent = require("superagent"); //read webpages

module.exports.run = async (bot, message, args) => {
    let { body } = await superagent //body of the webpage
        .get(`https://random.dog/woof.json`); //gets an online json file that will display a random url on load

    let dogembed = new Discord.RichEmbed()
        .setColor("#ff9900")
        .setTitle("woofer")
        .setImage(body.url) //the url under the body of the webpage

    message.channel.send(dogembed);
}

module.exports.help = {
    name: "doggo",
    usage: "",
    description: "Sends a random photo of a dog",
    permission: "SEND_MESSAGES"
}