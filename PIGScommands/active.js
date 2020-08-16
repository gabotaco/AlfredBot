const Discord = require("discord.js")
const request = require("request")
const botconfig = require("../botconfig.json")
const functions = require("../functions.js");

module.exports.run = async (bot, message, args) => {
    if (!args[0]) { //If no args then search all servers
        let ServerPoints = []

        function checkServer(index) { //Find people heisting in server
            if (index < botconfig.ActiveServers.length - 1) { //if its not the last server
                setTimeout(() => {
                    checkServer(index + 1) //check next one after 200 ms
                }, 500);
            } else { //last one
                setTimeout(() => {
                    message.channel.send(functions.SortPlayersOnServers(ServerPoints))
                }, 1000);
            }

            request(`http://${botconfig.ActiveServers[index][0]}:${botconfig.ActiveServers[index][1]}/status/widget/players.json`, function (error, response, body) { //url to get all players
                if (error) { //server is offline
                    return;
                }

                try {
                    var JSONBody = JSON.parse(body); //convert to json so we can use it
                } catch (e) {
                    //Handle or naw
                    return
                }

                let CurrentServerPoints = 0 //start at 0 people playing
                JSONBody.players.forEach(player => {
                    if (player[5] == "P.I.G.S. Robberrery") CurrentServerPoints++ //if theres someone with a pigs job increase points
                });

                if (botconfig.ActiveServers[index][0] == "na.tycoon.community") { //If its na
                    if (botconfig.ActiveServers[index][1].endsWith("0")) { //if the port ends with 0
                        ServerPoints.push([CurrentServerPoints, "6"]) //Server 6
                    } else if (botconfig.ActiveServers[index][1].endsWith("5")) { //if port ends with 5
                        ServerPoints.push([CurrentServerPoints, "A"]) //server 5
                    } else {
                        ServerPoints.push([CurrentServerPoints, 5 + parseInt(botconfig.ActiveServers[index][1].charAt(botconfig.ActiveServers[index][1].length - 1))]) //Server num is last num of port + 5
                    }
                } else { //if not na
                    if (botconfig.ActiveServers[index][1].endsWith("0")) { //if the port ends with 0
                        ServerPoints.push([CurrentServerPoints, "1"]) //Server 1
                    } else {
                        ServerPoints.push([CurrentServerPoints, botconfig.ActiveServers[index][1].charAt(botconfig.ActiveServers[index][1].length - 1)]) //Server num is last num of port
                    }
                }
            });
        }

        checkServer(0); //Run recursive function starting at index 0

    } else { //specified server
        const Response = functions.GetServerIPandPort(args[0])
        const ServerIP = Response[0]
        const ServerPort = Response[1]

        request(`http://${ServerIP}:3012${ServerPort}/status/map/positions.json`, function (error, response, body) { //get server ip and port
            if (error) return message.channel.send("Server is offline");

            body = JSON.parse(body)

            let PlayersHeighsting = new Discord.MessageEmbed()
                .setTitle(`Players currently heisting on server ${args[0]}`)
                .setColor("RANDOM")

            body.players.forEach(player => { //Go thorugh all players
                if (player[5].group == "pigs_job") { //if pigs job
                    PlayersHeighsting.addField(player[0], player[5].name, true) //add id and name
                }
            })

            if (PlayersHeighsting.fields[0]) { //if there is at least one person
                message.channel.send(PlayersHeighsting)
            } else return message.channel.send("Nobody heisting.") //if nobody
        })
    }
}

module.exports.help = {
    name: "active",
    usage: "{server}",
    description: "Shows how many people are heisting",
    permission: "SEND_MESSAGES"
}