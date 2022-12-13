const botconfig = require("../botconfig.json");
const request = require("request")
const functions = require("../functions.js")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    let CompanyMembers = [] //Company members
    let ServerPoints = [] //Keeps num of players in each server

    if (args.guild_id == botconfig.PIGSServer) { //PIGS server

      var CompanyName = "pigs"
    } else if (args.guild_id == botconfig.RTSServer) { //RTS server

      var CompanyName = "rts"
    }
    bot.con.query(`SELECT (in_game_id) FROM members WHERE company = '${CompanyName}'`, function (err, result, fields) { //get all members
      if (err) {
        console.log(err)
        return reject("Unable to get all company members.")
      }
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
          resolve(ServerPlayersMessage) //send array
        }, 1000);
      }

      request(`http://${botconfig.ActiveServers[index].url}/status/widget/players.json`, function (error, response, body) { //url to get all players
        if (error) { //server is offline
          return;
        }

        try {
          var jsonBody = JSON.parse(body); //convert to json so we can use it
        } catch (e) {
          //Handle or naw
          return
        }
        let CurrentServerPoints = 0 //start at 0 people playing

        jsonBody.players.forEach(player => { //loop through all players
          if (CompanyMembers.includes(player[2].toString())) CurrentServerPoints++ //if player is in company increase score
        });

        ServerPoints.push([CurrentServerPoints, botconfig.ActiveServers[index].name]) //Add array into array [points, server num]
      });
    }
  })
}

module.exports.help = {
  name: "players",
  aliases: [],
  usage: "",
  description: "Get how many players are on every server",
  args: [],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
  slash: true,
  slow: true
}
