const {
  google
} = require('googleapis');
const authentication = require("../authentication");
const Discord = require("discord.js")
const botconfig = require("../botconfig.json")

function RandomNumber(Min, Max) {
  return Math.floor(Math.random() * Max - Min) + Min;
}

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    const car = args.car; //The car name is everything after the command

    if (car.length < 2) return resolve("You gotta be more specific than that") //If the car name is less than 2 chars

    //if (args.channel_id != "472410321475338246") return resolve("Do this in <#472410321475338246>") //If its said not in bennys channel

    function appendData(auth) {
      const sheets = google.sheets({
        version: 'v4',
        auth
      });

      if (car.toLowerCase() == "random") {
        return resolve(`{"mods":{"1":${RandomNumber(-1, 2)},"2":${RandomNumber(-1, 2)},"3":${RandomNumber(-1, 2)},"4":${RandomNumber(-1, 2)},"5":${RandomNumber(-1, 1)},"6":${RandomNumber(-1, 1)},"7":${RandomNumber(-1, 1)},"8":${RandomNumber(-1, 1)},"9":${RandomNumber(-1, 1)},"10":${RandomNumber(-1,1)},"11":3,"12":2,"13":2,"14":${RandomNumber(0, 26)},"15":3,"16":4,"17":-1,"18":1,"19":-1,"20":1,"21":-1,"22":${RandomNumber(0, 1)},"23":${RandomNumber(0, 51)},"24":${RandomNumber(0, 20)},"25":${RandomNumber(0, 5)},"26":${RandomNumber(0, 15)},"27":${RandomNumber(0, 4)},"28":${RandomNumber(0, 44)},"29":-1,"30":${RandomNumber(0, 13)},"31":-1,"32":-1,"33":${RandomNumber(0, 15)},"34":${RandomNumber(0, 14)},"35":${RandomNumber(0, 21)},"36":${RandomNumber(0, 1)},"37":${RandomNumber(0, 6)},"38":-1,"39":${RandomNumber(0, 3)},"40":${RandomNumber(0, 4)},"41":-1,"42":-1,"43":-1,"44":-1,"45":-1,"46":${RandomNumber(-0, 10)},"47":-1,"48":${RandomNumber(0, 5)},"0":${RandomNumber(0, 3)}}}`)
      } else {
        sheets.spreadsheets.values.update({ //Puts what they typed into the search bar
          auth: auth,
          spreadsheetId: process.env.RTS_MODS_SHEET,
          range: "Search Engine!D21:G22",
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [
              [car]
            ]
          }
        }, (err, response) => {
          if (err) {
            console.log(err);
            reject(`There was an error filling in the google sheet.`);
            return;
          } else { //no error
            sheets.spreadsheets.values.get({ //gets the search results
              spreadsheetId: process.env.RTS_MODS_SHEET,
              range: "Search Engine!E26:H35",
            }, (err, res) => {
              if (err) {
                console.log(err);
                return reject(`Unable to get data from the google sheet.`);
              }

              const rows = res.data.values;
              if (!rows) { //if there aren't any values for the data
                return resolve("Couldn't find any mods for that car!")
              } else if (rows.length) { //there are rows
                let carEmbed = new Discord.MessageEmbed()
                carEmbed.setTitle(`Mod results for "${car}"`)
                carEmbed.setColor("RANDOM")
                carEmbed.setThumbnail("https://cdn.discordapp.com/attachments/472135396407509024/476516142563852288/unknown.png") //RTS logo

                rows.map((row) => { //for each row 
                  carEmbed.addField("Car Name:", row[0]) //adds the car name
                  carEmbed.addField("Class", row[1]) //class
                  carEmbed.addField("Code", row[2]) //code
                  if (!row[3]) { //if the 4th column is empty
                    carEmbed.addField("Made By:", "Rock") //Made by Rock
                  } else { //if there is something
                    carEmbed.addField("Made By:", row[3]) //set it to who made it
                  }
                });
                return resolve(carEmbed)
              }
            })
          }
        });
      }

    }
    authentication.authenticate().then((auth) => {
      appendData(auth);
    });
  })
}

module.exports.help = {
  name: "mods",
  aliases: [],
  usage: "<car>",
  description: "Get the mod code of a car",
  args: [{
    type: 3,
    name: "car",
    description: "The car to get mods for",
    required: true,
    missing: "Please specify a car.",
    parse: (bot, message, args) => {
      return args.join(" ");
    }
  }],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES],
  slash: true,
  slow: true,
  hidden: true
}