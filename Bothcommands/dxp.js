const botconfig = require("../botconfig.json");
const request = require("request")
const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    let ServerPoints = [] //Keeps double xp status in each server
    
    checkServer(0); //Check server 1

    function checkServer(index) {
        function addServerPoint(CurrentServerPoints) {
            if (botconfig.ActiveServers[index][0] == "na.tycoon.community") { //if the ip starts with na
                if (botconfig.ActiveServers[index][1].endsWith("0")) { //if port ends with 0
                    ServerPoints.push([CurrentServerPoints, "6"]) //Add array into array [points, server num]
                } else if (botconfig.ActiveServers[index][1].endsWith("5")) { //port ends with 5
                    ServerPoints.push([CurrentServerPoints, "A"]) //Server A
                } else { //port ends with whatever is
                    ServerPoints.push([CurrentServerPoints, 5 + parseInt(botconfig.ActiveServers[index][1].charAt(botconfig.ActiveServers[index][1].length - 1))]) //Server num is last port num + 5
                }
            } else { //not na
                if (botconfig.ActiveServers[index][1].endsWith("0")) { //port ends with 0
                    ServerPoints.push([CurrentServerPoints, "1"]) //server 1
                } else { //port ends with something else
                    ServerPoints.push([CurrentServerPoints, botconfig.ActiveServers[index][1].charAt(botconfig.ActiveServers[index][1].length - 1)]) //server num is last num of port
                }
            }
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

            if (jsonBody.players.length < 1) {
                addServerPoint("No")
            } else {
                const options = {
                    url: `http://${botconfig.ActiveServers[index][0]}:${botconfig.ActiveServers[index][1]}/status/dataadv/${jsonBody.players[0][2]}`,
                    headers: botconfig.TTHeaders
                }
                request(options, function (err, res, html) {
                    if (err) {
                        console.log(err)
                        addServerPoint("OFFLINE")
                    } else {
                        try {
                            var response = JSON.parse(html)
                        } catch (e) {

                        }

                        if (!response || response.code == "408") {
                            console.log(response, html)
                            addServerPoint("OFFLINE")
                            return;
                        }

                        if (response.data.licenses.exp_week) {
                            addServerPoint("**Yes**")
                        } else {
                            addServerPoint("No")
                        }
                    }
                })
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