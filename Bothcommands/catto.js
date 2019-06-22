const Discord = require("discord.js");
const superagent = require("superagent");

module.exports.run = async (bot, message, args) => {
  let { body } = await superagent
    .get(`https://aws.random.cat/meow`); //gets random cat pic

  let catembed = new Discord.RichEmbed()
    .setColor("ff9900")
    .setTitle("Catto")
    .setImage(body.file); //sets image of embed to cat

  message.channel.send(catembed);
}

module.exports.help = {
  name: "catto",
  usage: "",
  description: "Sends a random photo of a cat",
  permission: "SEND_MESSAGES"
}