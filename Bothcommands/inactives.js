const Discord = require("discord.js")
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        const errors = []
        const D2 = new Date() //curent date

        if (args.guild_id == botconfig.PIGSServer) { //Pigs server
            var InactiveRole = botconfig.PIGSRoles.InactiveRole
            var guild = bot.guilds.cache.get(botconfig.PIGSServer)
            var CompanyName = "pigs"

        } else if (args.guild_id == botconfig.RTSServer) { //rts server
            var InactiveRole = botconfig.RTSRoles.InactiveRole
            var guild = bot.guilds.cache.get(botconfig.RTSServer)
            var CompanyName = "rts"
        }
        bot.con.query(`SELECT discord_id, deadline, in_game_name, last_turnin, company FROM members WHERE company = '${CompanyName}'`, function (err, result, fields) { //get all hired members
            if (err) {
                console.log(err)
                return reject("There was an error getting members");
            }
            const discordIDS = []; //all discords of inavtive users
            let notified = 0; //track how many notified

            const last = new Discord.MessageEmbed()
                .setTitle("List of inactive users")
                .setColor("RANDOM")
            const last2 = new Discord.MessageEmbed().setColor("RANDOM")
            const last3 = new Discord.MessageEmbed().setColor("RANDOM")
            const last4 = new Discord.MessageEmbed().setColor("RANDOM")

            let FieldsAdded = 0
            result.forEach(member => {
                const DiscordMember = guild.members.cache.get((member.discord_id).toString()) //find member in discord
                const D3 = D2 - new Date(member.deadline) //difference between deadline and today
                if (!DiscordMember) {
                    errors.push(`<@${member.discord_id}> ${member.in_game_name} is no longer in the server...`)
                    return;
                }
                if (D3 >= 0) { //if past deadline
                    if (!DiscordMember.roles.cache.has(InactiveRole)) DiscordMember.roles.add(InactiveRole) //if the member is in discord and doesn't have inactive role then add inactive role
                    if (args.notify) {
                        notified++ //Increase notify
                        DiscordMember.send("Greetings. \n \n It's come to my attention that you have not met your required voucher deadline. I'm reaching out to notify you that you have 7 days left until you're removed for inactivity. \n \n If you have any questions, please reach out to RC Management. \n \n Have a wonderful day")
                            .catch(() => errors.push(`Couldn't dm <@${DiscordMember.id}>. They probably disabled it.`)); //notify and if can't tell us
                    }

                    if (FieldsAdded < 25) { //Less than 25 fields
                        FieldsAdded++ //add field
                        last.addField(`${member.in_game_name} (${(member.discord_id)})`, `Last turnin: ${member.last_turnin}`, false) //embed 1

                        discordIDS.push((member.discord_id)) //push discord id's
                    } else if (FieldsAdded >= 25 && FieldsAdded < 50) { //25 or more and less than 50
                        FieldsAdded++
                        last2.addField(`${member.in_game_name} (${(member.discord_id)})`, `Last turnin: ${member.last_turnin}`, false) //embed 2

                        discordIDS.push((member.discord_id))
                    } else if (FieldsAdded >= 50 && FieldsAdded < 75) { //50 or more and less than 75
                        FieldsAdded++
                        last3.addField(`${member.in_game_name} (${(member.discord_id)})`, `Last turnin: ${member.last_turnin}`, false) //embed 3

                        discordIDS.push((member.discord_id))
                    } else if (FieldsAdded >= 75) { //75 or more
                        FieldsAdded++
                        last4.addField(`${member.in_game_name} (${(member.discord_id)})`, `Last turnin: ${member.last_turnin}`, false) //embed 4

                        discordIDS.push((member.discord_id))
                    }
                }
            });

            const response = []

            if (!args.notify) { //If no args
                if (last.fields[0]) { //If there are fields in embed 1
                    response.push(last) //send 1
                } else { //No fields in embed 1
                    response.push("No inactives")
                }
                if (last2.fields[0]) { //fields in embed 2
                    response.push(last2) //send 2
                }
                if (last3.fields[0]) { //fields in embed 3
                    response.push(last3) //send 3
                }
                if (last4.fields[0]) { //fields in embed 4
                    response.push(last4) //send 4
                }
            } else if (args.notify) { //If first arg is notify
                response.push(`DM'd ${notified} people`) //inform
            }
            if (errors.length > 0) {
                return resolve(response)
            } else {
                return resolve([errors.join("\n"), ...response])
            }
        })
    })
}

module.exports.help = {
    name: "inactives",
    aliases: [],
    usage: "[notify]",
    description: "Sends a list of members who haven't turned in over the past 2 weeks",
    args: [{
      type: 5,
      name: "notify",
      description: "Whether to notify inactive people or not",
      required: false,
      parse: (bot, message, args) => {
        return args[0] && args[0].toLowerCase() === "notify"
      }
    }],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
    slash: true
}
