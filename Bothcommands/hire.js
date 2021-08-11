const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    let d = new Date()
    d.setDate(d.getDate() + 14) //add 14 days to deadline
    const date = d.toISOString().slice(0, 19).replace('T', ' ');

    if (args.guild_id == botconfig.PIGSServer) { //pigs server
      var CompanyName = "pigs"
    } else if (args.guild_id == botconfig.RTSServer) { //rts server
      var CompanyName = "rts"
    }

    if (args.in_game_id && (!args.discord && !args.name)) { //if they only have 1 arg
      bot.con.query(`SELECT discord_id, in_game_name, in_game_id FROM applications WHERE in_game_id = ${args.in_game_id}`, function (err, result) {
        if (err) {
          console.log(err)
          return reject("There was an error getting the applicant from the database.")
        } else {
          if (result.length > 0) {
            Hire(result[0].discord_id, result[0].in_game_name, result[0].in_game_id).then((res) => {
              return resolve(res);
            }).catch((err) => {
              return reject(err);
            }) //Hire em
          } else {
            return resolve("That user isn't an applicant")
          }
        }
      })
    } else { //privided either nothing or has more than 1 arg
      Hire(args.discord, args.name, args.in_game_id).then((res) => {
        return resolve(res);
      }).catch((err) => {
        return reject(err);
      }) //Hire em
    }

    function Hire(DiscordID, InGameName, InGameID) {
      return new Promise((resolve, reject) => {
        bot.con.query(`SELECT * FROM members WHERE (in_game_id = '${InGameID}' OR discord_id = '${DiscordID}') AND company != 'fired'`, function (err, result, field) {
          if (err) {
            console.log(err)
            return reject("There was an error verifying if this member already is hired.")
          }

          if (result.length != 0) return resolve("There is already an employee with that in game id or discord id")

          functions.UpdateApplicantStatus(bot.con, InGameID, "Hired").then(() => {
            const CurrentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
            bot.con.query(`UPDATE members SET in_game_id = '${InGameID}', discord_id = '${DiscordID}', in_game_name = '${InGameName}', deadline = '${date}', fire_reason = NULL, company = '${CompanyName}', last_turnin = '${CurrentDate}' WHERE in_game_id = '${InGameID}'`, function (err, result, fields) { //try to find if member was perviously hired and hire em back
              if (err) {
                if (err.errno == 1366) {
                  return resolve("Invalid characters.")
                } else {
                  console.log(err)
                  return reject("There was an error hiring that member.")
                }
              }
              if (result.affectedRows > 0) {
                return resolve("Hired!")
              } else { //if wasn't previously hired
                bot.con.query(`INSERT INTO members(in_game_id, discord_id, in_game_name, company, deadline, last_turnin) VALUES ('${InGameID}', '${DiscordID}', '${InGameName}', '${CompanyName}', '${date}', '${CurrentDate}');`, function (err, result, fields) { //add to members table
                  if (err) {
                    console.log(err)
                    return reject("There was an error creating the member row.")
                  }
                  bot.con.query(`INSERT INTO pigs(in_game_id) VALUES ('${InGameID}');`, function (err, result, fields) { //insert into pigs table
                    if (err) {
                      console.log(err)
                      return reject("There was an error creating the PIGS row.")
                    }
                    bot.con.query(`INSERT INTO rts(in_game_id) VALUES ('${InGameID}');`, function (err, result, fields) { //insert into rts table
                      if (err) {
                        console.log(err)
                        return reject("There was an error creating the RTS row.")
                      }
                      return resolve("Hired!")
                    })
                  })
                })
              }
            })
          }).catch((err) => {
            return reject(err);
          })
        })
      })
    }
  })
}

module.exports.help = {
  name: "hire",
  aliases: [],
  description: "Add another person to the PIGS family",
  usage: "<discord ID> \"<In game name>\" <in-game ID>",
  args: [{
      name: "id",
      description: "Hire a member using their discord id",
      type: 1,
      options: [{
          name: "discord",
          description: "Their discord id",
          type: 3,
          required: true,
          missing: "Please specify another employee",
          parse: (bot, message, args) => {
            return args[0]
          }
        },
        {
          name: "name",
          description: "Their in game name",
          type: 3,
          required: true,
          missing: "Please specify another employee",
          parse: (bot, message, args) => {
            const messageArray = message.content.split("\"") //Split up discord id, name, and id
            return messageArray[1];
          }
        },
        {
          name: "in_game_id",
          description: "Their in game ID",
          type: 4,
          required: true,
          missing: "Please specify another employee",
          parse: (bot, message, args) => {
            return args[args.length - 1];
          }
        }
      ],
    },
    {
      name: "discord",
      description: "Hire a member using their discord user",
      type: 1,
      options: [{
          name: "discord",
          description: "Their discord id",
          type: 6,
          required: true,
          missing: "Please specify another employee",
          parse: (bot, message, args) => {
            return args[0]
          }
        },
        {
          name: "name",
          description: "Their in game name",
          type: 3,
          required: true,
          missing: "Please specify another employee",
          parse: (bot, message, args) => {
            const messageArray = message.content.split("\"") //Split up discord id, name, and id
            return messageArray[1];
          }
        },
        {
          name: "in_game_id",
          description: "Their in game ID",
          type: 4,
          required: true,
          missing: "Please specify another employee",
          parse: (bot, message, args) => {
            return args[args.length - 1];
          }
        }
      ]
    }
  ],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  slash: true
}