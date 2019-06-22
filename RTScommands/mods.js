const { google } = require('googleapis');
const authentication = require("../authentication");
const Discord = require("discord.js")
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, message, args) => {
  if (!args[0]) return message.channel.send("You have to specify the car you want")

  const car = args.join(" "); //The car name is everything after the command

  if (car.length < 2) return message.channel.send("You gotta be more specific than that") //If the car name is less than 2 chars

  if (message.channel.id != "472410321475338246") return message.channel.send("Do this in <#472410321475338246>") //If its said not in bennys channel

  function appendData(auth) {
    const sheets = google.sheets({version: 'v4', auth});

    sheets.spreadsheets.values.update({ //Puts what they typed into the search bar
      auth: auth, 
      spreadsheetId: botconfig.RTSModsSheet,
      range: "Search Engine!D21:G22",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [car]
        ]
      }
    }, (err, response) => {
      if (err) {
        message.channel.send('The API returned an error: ' + err);
        return;
      } else { //no error
        sheets.spreadsheets.values.get({ //gets the search results
          spreadsheetId: botconfig.RTSModsSheet,
          range: "Search Engine!E26:H35",
        }, (err, res) => {
          if (err) return message.channel.send('The API returned an ' + err);

          const rows = res.data.values;
          if (!rows) { //if there aren't any values for the data
            message.channel.send("Couldn't find any mods for that car!")
          } else if (rows.length) { //there are rows
            let carEmbed = new Discord.RichEmbed()
            carEmbed.setTitle(`Mod results for "${car}"`)
            carEmbed.setColor("RANDOM")
            carEmbed.setThumbnail("https://cdn.discordapp.com/attachments/472135396407509024/476516142563852288/unknown.png") //RTS logo

            rows.map((row) => { //for each row 
              carEmbed.addBlankField() //adds a space to make it easier to read
              carEmbed.addField("Car Name:", row[0]) //adds the car name
              carEmbed.addField("Class", row[1]) //class
              carEmbed.addField("Code", row[2]) //code
              if (!row[3]) { //if the 4th column is empty
                carEmbed.addField("Made By:", "Rock") //Made by Rock
              } else { //if there is something
                carEmbed.addField("Made By:", row[3]) //set it to who made it
              }
            });
            message.channel.send(carEmbed)
          }
        })
      }
    });
  }
  authentication.authenticate().then((auth) => {
    appendData(auth);
  });
}




module.exports.help = {
  name: "mods",
  usage: "[car]",
  description: "Get the mod code of a car",
  permission: "SEND_MESSAGES"
}