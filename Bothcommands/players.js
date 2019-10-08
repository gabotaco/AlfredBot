const botconfig = require("../botconfig.json");
const request = require("request")
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  let CompanyMembers = [] //Company members
  let ServerPoints = [] //Keeps num of players in each server

  if (message.guild.id == botconfig.PIGSServer) { //PIGS server

    var CompanyName = "pigs"
  } else if (message.guild.id == botconfig.RTSServer) { //RTS server

    var CompanyName = "rts"
  }
  bot.con.query(`SELECT (in_game_id) FROM members WHERE company = '${CompanyName}'`, function (err, result, fields) { //get all members
    if (err) return console.log(err)
    result.forEach(member => {
      CompanyMembers.push(member.in_game_id.toString())
    });
    checkServer(0); //Check server 1

  })

  function checkServer(index) { //Find people heisting in server
    if (index < botconfig.ActiveServers.length - 1) { //if its not the last server
      setTimeout(() => {
        checkServer(index + 1) //check next one after 500 ms
      }, 500);
    } else { //last one
      setTimeout(() => { //after 1000 ms
        const ServerPlayersMessage = functions.SortPlayersOnServers(ServerPoints) //sort it into array
        message.channel.send(ServerPlayersMessage) //send array
      }, 1000);
    }

    request(`http://${botconfig.ActiveServers[index][0]}:${botconfig.ActiveServers[index][1]}/status/map/positions.json`, function (error, response, body) { //url to get all players
      if (error) { //server is offline
        return;
      }

      const jsonBody = JSON.parse(body); //convert to json so we can use it

      let CurrentServerPoints = 0 //start at 0 people playing

      jsonBody.players.forEach(player => { //loop through all players
        if (CompanyMembers.includes(player[2].toString())) CurrentServerPoints++ //if player is in company increase score
      });

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
    });
  }

}

module.exports.help = {
  name: "players",
  usage: "",
  description: "Get how many players are on every server",
  permission: "SEND_MESSAGES"
}