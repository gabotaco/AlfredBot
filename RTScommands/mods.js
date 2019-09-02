const {
  google
} = require('googleapis');
const authentication = require("../authentication");
const Discord = require("discord.js")
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, message, args) => {
  if (!args[0]) return message.channel.send("You have to specify the car you want")

  const car = args.join(" "); //The car name is everything after the command

  if (car.length < 2) return message.channel.send("You gotta be more specific than that") //If the car name is less than 2 chars

  if (message.channel.id != "472410321475338246") return message.channel.send("Do this in <#472410321475338246>") //If its said not in bennys channel

  function appendData(auth) {
    const sheets = google.sheets({
      version: 'v4',
      auth
    });

    if (car.toLowerCase() == "random") {
      let Code = {
        "mods": {}
      }
      Code.mods["0"] = RandomNumber(1, 5)
      Code.mods["1"] = RandomNumber(0, 4)
      Code.mods["2"] = RandomNumber(0, 4)
      Code.mods["3"] = RandomNumber(0, 4)
      Code.mods["4"] = RandomNumber(0, 3)
      Code.mods["5"] = RandomNumber(0, 1)
      Code.mods["6"] = RandomNumber(0, 3)
      Code.mods["7"] = RandomNumber(0, 5)
      Code.mods["8"] = RandomNumber(0, 3)
      Code.mods["9"] = RandomNumber(0, 3)
      Code.mods["10"] = 1
      Code.mods["11"] = 3
      Code.mods["12"] = 2
      Code.mods["13"] = 2
      Code.mods["14"] = RandomNumber(0, 26)
      Code.mods["15"] = 3
      Code.mods["16"] = 4
      Code.mods["18"] = 1
      Code.mods["20"] = 1
      Code.mods["22"] = RandomNumber(0, 1)
      Code.mods["23"] = RandomNumber(0, 51)
      Code.mods["24"] = RandomNumber(0, 20)
      Code.mods["25"] = RandomNumber(0, 5)
      Code.mods["26"] = RandomNumber(0, 15)
      Code.mods["27"] = RandomNumber(0, 4)
      Code.mods["28"] = RandomNumber(0, 44)
      Code.mods["30"] = RandomNumber(0, 13)
      Code.mods["33"] = RandomNumber(0, 15)
      Code.mods["34"] = RandomNumber(0, 14)
      Code.mods["35"] = RandomNumber(0, 21)
      Code.mods["36"] = RandomNumber(0, 1)
      Code.mods["37"] = RandomNumber(0, 6)
      Code.mods["39"] = RandomNumber(0, 3)
      Code.mods["40"] = RandomNumber(0, 4)
      Code.mods["46"] = RandomNumber(1, 5)
      message.channel.send(JSON.stringify(Code))
    } else {
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

  }
  authentication.authenticate().then((auth) => {
    appendData(auth);
  });
}

function RandomNumber(Min, Max) {
  return Math.floor(Math.random() * Max - Min) + Min;
}


module.exports.help = {
  name: "mods",
  usage: "[car]",
  description: "Get the mod code of a car",
  permission: "SEND_MESSAGES"
}