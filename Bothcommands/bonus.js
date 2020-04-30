const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")
const Discord = require("discord.js")
module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //If can't manage nicknames
    message.channel.send("You aren't allowed to do that")
    return;
  }

  let EligiblePeople = []

  authentication.authenticate().then(async (auth) => {
    await functions.ProcessAllInRange(auth, botconfig.Applications, botconfig.ApplicationRange, message.channel, function (row) { //go through all applicants
      if (row[botconfig.ApplicationRefferalStatus] == "Eligible") {
        for (let i = 0; i < EligiblePeople.length; i++) {
          if (EligiblePeople[i].in_game_id == row[botconfig.ApplicationRefferalCode]) {
            EligiblePeople[i].refferals++;
            return;
          }
        }
        EligiblePeople.push({
          "in_game_id": row[botconfig.ApplicationRefferalCode],
          "refferals": 1
        })
      }
    })
    if (EligiblePeople.length < 1) return message.channel.send("No eligible people for money!")
    let RefferEmbed = new Discord.MessageEmbed()
      .setTitle("Unpaid Bonus'")
      .setColor("RANDOM")
    for (let i = 0; i < EligiblePeople.length; i++) {
      Member = await functions.GetMemberDetails(bot, "in_game_id", EligiblePeople[i].in_game_id)
      if (Member) RefferEmbed.addField(`${Member.in_game_name} (${Member.discord_id}) ${Member.in_game_id}`, "$" + functions.numberWithCommas(10000000 * EligiblePeople[i].refferals))
    }
    message.channel.send(RefferEmbed)
  });
}

module.exports.help = {
  name: "bonus",
  usage: "",
  description: "Sends a list of unpaid bonus'",
  permission: "KICK_MEMBERS"
}