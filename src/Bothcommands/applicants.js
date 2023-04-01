const botconfig = require("../botconfig.json")
module.exports.run = async (bot, args) => {
  return new Promise((resolve, reject) => {
    let FoundOne = false //Keep track of if there is at least one applicant
    let messages = []
    bot.con.query(`SELECT in_game_name, in_game_id, country, cooldown FROM applications WHERE status = 'Received'`, function (err, result, fields) {
      if (err) {
        console.log(err)
        return reject("There was an error getting applicants.")
      } else {
        result.forEach(applicant => {
          FoundOne = true

          if (applicant.cooldown) { //If they have a cooldown
            messages.push({
              message: `In-Game Name: "${applicant.in_game_name}". In Game ID: "${applicant.in_game_id}". Country: "${applicant.country}". Cooldown: "${applicant.cooldown}"`, //send their basic app info
              messageOptions: {
                code: "ml"
              }
            })
          } else { //If they don't have a cooldown
            messages.push({
              message: `In-Game Name: "${applicant.in_game_name}". In Game ID: "${applicant.in_game_id}". Country: "${applicant.country}".`, //send their basic app info without cooldown
              messageOptions: {
                code: "ml"
              }
            })
          }
        });

        if (!FoundOne) { //If didn't find one
          resolve("No new applicants")
          return;
        } else {
          resolve(messages)
        }
      }
    })

  })

}

module.exports.help = {
  name: "applicants",
  aliases: ["apps"],
  usage: "",
  args: [],
  description: "Sends a list of unprocessed applicants",
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  slash: true
}