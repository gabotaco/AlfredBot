const Discord = require("discord.js")
const botconfig = require("../botconfig.json");
const request = require("request")
const functions = require("../functions.js")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    const Server = functions.GetServerURL(args.server); //get server ip and port
    if (!Server) return resolve("Invalid server. [1 or OS, 2, 3, 4, 5, 6, 7, 8, 9, A]")

    let CompanyMembers = [] //track company members

    let SentMessage = false;

    let playerNames = []
    let playerID = []
    let playerJobs = []

    if (args.guild_id == botconfig.PIGSServer) { //PIGS server

      var CompanyName = "pigs"
    } else if (args.guild_id == botconfig.RTSServer) { //RTS server

      var CompanyName = "rts"
    }

    bot.con.query(`SELECT (in_game_id) FROM members WHERE company = '${CompanyName}'`, function (err, result, fields) { //get hired members in game ids
      if (err) {
        console.log(err)
        return reject("Unable to get company members.")
      }
      result.forEach(member => {
        CompanyMembers.push(member.in_game_id.toString()) //add each id to array
      });

      setTimeout(() => { //wait 5000 ms
        if (!SentMessage) { //if not sent message after 5 seconds
          return resolve("Server isn't online.")
        }
      }, 5000);

      request(`http://${Server}/status/widget/players.json`, {json: true}, function (error, response, body) { //get server players
        if (!error && body) { //If no error
          SentMessage = true; //sent message
          body.players.forEach(player => { //go thorugh all players
            if (CompanyMembers.includes(player[2].toString())) { //if the player is in company
              playerNames.push(player[0]) //add player name
              playerID.push(player[2].toString()) //add player ID
              playerJobs.push(player[5]) //add player job
            }
          });

          if (playerNames.length < 1) return resolve("No players on that server.") //if less than 1 player then no players
          let nameEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Players on server ${args.server}`)

          let index = 0;
          playerNames.forEach(element => { //whats a for loop
            nameEmbed.addField(`${element} (${playerID[index]})`, playerJobs[index], true) //add player to embed
            index++
          });
          return resolve(nameEmbed)
        }
      });
    })
  })
}

module.exports.help = {
  name: "names",
  aliases: [],
  usage: "<server>",
  description: "Get the in game name, id, and job of people in a server",
  args: [{
    type: 3,
    name: "server",
    description: "The server number",
    required: true,
    missing: "Please specify a server number [1 or OS, 2, 3, 4, 5, 6, 7, 8, 9, A]",
    parse: (bot, message, args) => {
      return args[0]
    }
  }],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
  slash: true,
  slow: true
}
