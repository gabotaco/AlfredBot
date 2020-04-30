const Discord = require("discord.js")
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) { //can't kick members
        return message.channel.send("You aren't allowed to do that")
    }

    if (message.channel.parentID != botconfig.PIGSManagementCatagoryID && message.channel.parentID != botconfig.RTSManagementCatagoryID) return message.channel.send("Wrong channel") //Not in a staff room

    const D2 = new Date() //curent date

    if (message.guild.id == botconfig.PIGSServer) { //Pigs server
        var InactiveRole = botconfig.PIGSInactiveRole

        var CompanyName = "pigs"

    } else if (message.guild.id == botconfig.RTSServer) { //rts server
        var InactiveRole = botconfig.RTSInactiveRole

        var CompanyName = "rts"
    }
    bot.con.query(`SELECT discord_id, deadline, in_game_name, last_turnin FROM members WHERE company = '${CompanyName}'`, function (err, result, fields) { //get all hired members
        if (err) return console.log(err)
        const discordIDS = []; //all discords of inavtive users

        const last = new Discord.MessageEmbed()
            .setTitle("List of inactive users")
            .setColor("RANDOM")
        const last2 = new Discord.MessageEmbed().setColor("RANDOM")
        const last3 = new Discord.MessageEmbed().setColor("RANDOM")
        const last4 = new Discord.MessageEmbed().setColor("RANDOM")

        let FieldsAdded = 0
        result.forEach(member => {
            const D3 = D2 - new Date(member.deadline) //difference between deadline and today

            const D4 = D2 - new Date(member.last_turnin) //different between today and last turnin
            if (D4 >= 5184000000 || D3 >= 0) { //if past deadline or been 2 months since last turnin
                const DiscordMember = message.guild.members.cache.get((member.discord_id).toString()) //find member in discord
                if (DiscordMember && !DiscordMember.roles.cache.has(InactiveRole)) DiscordMember.roles.add(InactiveRole) //if the member is in discord and doesn't have inactive role then add inactive role
                else if (!DiscordMember) message.channel.send("Couldn't find member with id <@" + (member.discord_id) + "> in this discord") //If member isn't in discord

                if (FieldsAdded < 25) { //Less than 25 fields
                    FieldsAdded++ //add field
                    last.addField(`${member.in_game_name} (${(member.discord_id)})`, member.last_turnin, false) //embed 1

                    discordIDS.push((member.discord_id)) //push discord id's
                } else if (FieldsAdded >= 25 && FieldsAdded < 50) { //25 or more and less than 50
                    FieldsAdded++
                    last2.addField(`${member.in_game_name} (${(member.discord_id)})`, member.last_turnin, false) //embed 2

                    discordIDS.push((member.discord_id))
                } else if (FieldsAdded >= 50 && FieldsAdded < 75) { //50 or more and less than 75
                    FieldsAdded++
                    last3.addField(`${member.in_game_name} (${(member.discord_id)})`, member.last_turnin, false) //embed 3

                    discordIDS.push((member.discord_id))
                } else if (FieldsAdded >= 75) { //75 or more
                    FieldsAdded++
                    last4.addField(`${member.in_game_name} (${(member.discord_id)})`, member.last_turnin, false) //embed 4

                    discordIDS.push((member.discord_id))
                }
            }
        });

        if (!args[0]) { //If no args
            if (last.fields[0]) { //If there are fields in embed 1
                message.channel.send(last) //send 1
            } else { //No fields in embed 1
                message.channel.send("No inactives")
            }
            if (last2.fields[0]) { //fields in embed 2
                message.channel.send(last2) //send 2
            }
            if (last3.fields[0]) { //fields in embed 3
                message.channel.send(last3) //send 3
            }
            if (last4.fields[0]) { //fields in embed 4
                message.channel.send(last4) //send 4
            }
        } else if (args[0].toLowerCase() == "notify") { //If first arg is notify
            let notified = 0; //track how many notified

            message.guild.members.forEach(element => { //go through all members in discord
                if (discordIDS.includes(element.id)) { //If member is in array
                    notified++ //Increase notify
                    element.send("Greetings. \n \n It's come to my attention that you have not met your required voucher deadline. I'm reaching out to notify you that you have 7 days left until you're removed for inactivity. \n \n If you have any questions, please reach out to Rock or Gabo. \n \n Have a wonderful day")
                        .catch(() => message.reply(`Couldn't dm <@${element.id}>`)); //notify and if can't tell us
                }
            });
            message.channel.send(`DM'd ${notified} people`) //inform
        }
    })
}

module.exports.help = {
    name: "inactives",
    usage: "{notify}",
    description: "Sends a list of members who haven't turned in over the past 2 weeks",
    permission: "KICK_MEMBERS"
}