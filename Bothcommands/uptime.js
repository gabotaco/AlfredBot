const Discord = require("discord.js")
const request = require("request")
const botconfig = require("../botconfig.json")
const functions = require("../functions.js");

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
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
                    resolve(ServerStatus)
                }, 1000);
            }

            request(`https://${botconfig.ActiveServers[index].url}/info.json`, function (error, response, body) { //url to get all players
                if (error) { //server is offline
                    ServerStatus.addField(botconfig.ActiveServers[index].name, "OFFLINE", true)
                    return;
                }

                const JSONBody = JSON.parse(body); //convert to json so we can use it

                ServerStatus.addField(botconfig.ActiveServers[index].name, JSONBody.vars.Uptime, true)
              
            });
        }

        checkServer(0); //Run recursive function starting at index 0
    })
}

module.exports.help = {
    name: "uptime",
    aliases: [],
    usage: "",
    description: "Shows the uptime of each server",
    args: [],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true,
    slow: true
}