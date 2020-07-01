const urban = require("relevant-urban"); //search urban dictionary api
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (!args[0]) { //If no words
    message.channel.send("You need to enter a word dummy")
    return;
  }

  const res = await urban(args.join(" ")).catch(e => { //search urban dictionary and if there is an error then that means there were no responses
    message.channel.send("Did you make that up or something because its not even on urban dictionary");
    return;
  });

  if (!res) {
    message.channel.send("Did you make that up or something because its not even on urban dictionary");
    return;
  }
  const urbanDefinition = res.definition.replace(/\[/g, '') //removes all the [] from the message. Looks stupid.
  const bestUrbanDefinition = urbanDefinition.replace(/\]/g, '')
  const urbanExample = res.example.replace(/\[/g, '')
  const bestUrbanExample = urbanExample.replace(/\]/g, '')

  const urbanEmbed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(res.word) //uses the word returned because sometimes it will return the definition of a sorta similar word
    .setURL(res.urbanURL)
    .addField("Definition", bestUrbanDefinition)
    if (bestUrbanExample) urbanEmbed.addField("Example", bestUrbanExample)

  message.channel.send(urbanEmbed);
}

module.exports.help = {
  name: "ud",
  usage: "[word]",
  description: "Search urban dictionary",
  permission: "SEND_MESSAGES"
}