const Discord = require("discord.js")
const request = require("request")
const botconfig = require("../botconfig.json")
const functions = require("../functions.js");

module.exports.run = async (bot, message, args) => {
       const ServerStatus = new Discord.MessageEmbed()
       .setTitle("Uptime of all servers")
       .setColor("RANDOM")

        function checkServer(index) { //Find people heisting in server
            if (index < botconfig.ActiveServers.length - 1) { //if its not the last server
                setTimeout(() => {
                    checkServer(index + 1) //check next one after 200 ms
                }, 500);
            } else { //last one
                setTimeout(() => {
                    message.channel.send(ServerStatus)
                }, 1000);
            }

            request(`http://${botconfig.ActiveServers[index][0]}:${botconfig.ActiveServers[index][1]}/info.json`, function (error, response, body) { //url to get all players
                if (error) { //server is offline
                    ServerStatus.addField(functions.GetServerNumber(botconfig.ActiveServers[index][0], botconfig.ActiveServers[index][1]), "OFFLINE", true)
                    return;
                }

                const JSONBody = JSON.parse(body); //convert to json so we can use it

                ServerStatus.addField(functions.GetServerNumber(botconfig.ActiveServers[index][0], botconfig.ActiveServers[index][1]), JSONBody.vars.Uptime, true)
              
            });
        }

        checkServer(0); //Run recursive function starting at index 0

    
}

module.exports.help = {
    name: "uptime",
    usage: "{server}",
    description: "Shows how many people are heisting",
    permission: "SEND_MESSAGES"
}