const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const authentication = require("../authentication"); //Imports functions from authentication file
const request = require("request")
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
  if (!args[0]) return message.channel.send("You must provide the server number") //No first arg

  const Response = functions.GetServerIPandPort(args[0]);
  const ServerIP = Response[0]
  const ServerPort = Response[1]
  
  let CompanyMembers = []

  let SentMessage = false;

  let playerNames = []
  let playerID = []
  let playerJobs = []
  
  if (message.guild.id == botconfig.PIGSServer) { //PIGS server
    var MainSheet = botconfig.PIGSSheet
    var Range = botconfig.PIGSEmployeeRange
    var InGameIDIndex = botconfig.PIGSEmployeeRangeInGameIDIndex
  } else if (message.guild.id == botconfig.RTSServer) { //RTS server
    var MainSheet = botconfig.RTSSheet
    var Range = botconfig.RTSEmployeeRange
    var InGameIDIndex = botconfig.RTSEmployeeRangeInGameIDIndex
  }

  async function GetPlayers(auth) {
    await functions.ProcessAllInRange(auth, MainSheet, Range, message.channel, function (row) {
      if (row[InGameIDIndex]) { //If they have an in game id
        CompanyMembers.push(row[InGameIDIndex]) //add ingame id to company members
      }
    })

    setTimeout(() => { //wait 5000 ms
      if (!SentMessage) { //if not sent message after 5 seconds
        return message.channel.send("Server isn't online.")
      }
    }, 5000);

    request(`http://${ServerIP}:3012${ServerPort}/status/map/positions.json`, function (error, response, body) { //get server players
      if (!error) { //If no error
        SentMessage = true; //sent message
        body = JSON.parse(body) //parse body
        body.players.forEach(player => { //go thorugh all players
          if (CompanyMembers.includes(player[2].toString())) { //if the player is in company
            playerNames.push(player[0]) //add player name
            playerID.push(player[2].toString()) //add player ID
            playerJobs.push(player[5].name) //add player job
          }
        });

        if (playerNames.length < 1) return message.channel.send("No players on that server.") //if less than 1 player then no players
        let nameEmbed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle(`Players on server ${args[0]}`) 

        let index = 0;
        playerNames.forEach(element => { //whats a for loop
          nameEmbed.addField(`${element} (${playerID[index]})`, playerJobs[index], true) //add player to embed
          index++
        });
        message.channel.send(nameEmbed)
      }
    });

  }
  authentication.authenticate().then((auth) => {
    GetPlayers(auth);
  });
}

module.exports.help = {
  name: "names",
  usage: "[server]",
  description: "Get the in game name, id, and job of people in a server",
  permission: "SEND_MESSAGES"
}