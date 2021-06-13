const botconfig = require("../botconfig.json");
const request = require("request")
const Discord = require("discord.js")
function toTimeFormat(ms_num) {
        var sec_num = ms_num / 1000
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        seconds = Math.round(seconds)
        return hours + 'h ' + minutes + 'm ' + seconds + 's';
}
module.exports.run = async (bot, message, args) => {
    if (!message.member.roles.cache.has("562991083882151937") && !message.member.roles.cache.has("483297370482933760")) {
        return message.channel.send("Must be a company member to use this command.")
    }
    let ServerPoints = [] //Keeps double xp status in each server
    
    checkServer(0); //Check server 1

    function checkServer(index) {
        function addServerPoint(CurrentServerPoints) {
            ServerPoints.push([CurrentServerPoints, botconfig.ActiveServers[index][2]]);
        }
        
        if (index < botconfig.ActiveServers.length - 1) { //if its not the last server
            setTimeout(() => {
                checkServer(index + 1) //check next one after 500 ms
            }, 500);
        } else { //last one
            setTimeout(() => { //after 1000 ms
                let PlayersEmbed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Double EXP")

                for (let i = 0; i < ServerPoints.length; i++) { //go through all of them
                    PlayersEmbed.addField(`Server ${ServerPoints[i][1]}`, `${ServerPoints[i][0]}`, true) //Adds the server
                }
                message.channel.send(PlayersEmbed) //send array
            }, 1000);
        }

        request(`http://${botconfig.ActiveServers[index][0]}:${botconfig.ActiveServers[index][1]}/status/widget/players.json`, function (error, response, body) { //url to get all players
            if (error) { //server is offline
                console.log(error)
                addServerPoint("OFFLINE")
                return;
            }

            try {
                var jsonBody = JSON.parse(body); //convert to json so we can use it
            } catch (e) {
                //Handle or naw
                console.log(body)
                addServerPoint("OFFLINE")
                return
            }

            if (!jsonBody.server.dxp[0]) {
                addServerPoint("No")
            } else {
                addServerPoint(`**${toTimeFormat(jsonBody.server.dxp[2] + jsonBody.server.dxp[3])}**`)
            }
        });
    }

}

module.exports.help = {
    name: "dxp",
    usage: "",
    description: "Get servers with double XP",
    permission: "SEND_MESSAGES"
}