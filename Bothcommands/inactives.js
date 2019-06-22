const Discord = require("discord.js")
const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
        return message.channel.send("You aren't allowed to do that")
    }

    if (message.channel.parentID != botconfig.PIGSManagementCatagoryID && message.channel.parentID != botconfig.RTSManagementCatagoryID) return message.channel.send("Wrong channel") //Not in a staff room

    const D2 = new Date()

    if (message.guild.id == botconfig.PIGSServer) { //Pigs server
        var MainSheet = botconfig.PIGSSheet
        var Range = botconfig.PIGSEmployeeRange
        var DeadlineIndex = botconfig.PIGSEmployeeRangeDeadlineIndex
        var DiscordIndex = botconfig.PIGSEmployeeRangeDiscordIndex;
        var InactiveRole = botconfig.PIGSInactiveRole
        var InGameNameIndex = botconfig.PIGSEmployeeRangeInGameNameIndex
    } else if (message.guild.id == botconfig.RTSServer) { //rts server
        var MainSheet = botconfig.RTSSheet
        var Range = botconfig.RTSEmployeeRange
        var DeadlineIndex = botconfig.RTSEmployeeRangeDeadlineIndex
        var DiscordIndex = botconfig.RTSEmployeeRangeDiscordIndex;
        var InactiveRole = botconfig.RTSInactiveRole
        var InGameNameIndex = botconfig.RTSEmployeeRangeInGameNameIndex
    }

    authentication.authenticate().then(async (auth) => {
        const discordIDS = []; //all discords of inavtive users

        const last = new Discord.RichEmbed()
            .setTitle("List of inactive users")
            .setColor("RANDOM")
        const last2 = new Discord.RichEmbed().setColor("RANDOM")
        const last3 = new Discord.RichEmbed().setColor("RANDOM")
        const last4 = new Discord.RichEmbed().setColor("RANDOM")

        let FieldsAdded = 0

        await functions.ProcessAllInRange(auth, MainSheet, Range, message.channel, function (row) { //get all employees
            if (row[DeadlineIndex]) { //if they have a deadline
                const D1 = new Date(row[DeadlineIndex]) //make date out of deadline
                const D3 = D2 - D1 //difference between two dates
                if (D3 > 0) { //if its past their deadline
                    const member = message.guild.members.get(row[DiscordIndex]) //find member in discord
                    if (member && !member.roles.has(InactiveRole)) member.addRole(InactiveRole) //if the member is in discord and doesn't have inactive role then add inactive role
                    else if (!member) message.channel.send("Couldn't find member with id " + row[DiscordIndex] + " in this discord") //If member isn't in discord

                    if (FieldsAdded < 25) { //Less than 25 fields
                        FieldsAdded++ //add field
                        last.addField(`${row[InGameNameIndex]} (${row[DiscordIndex]})`, row[DeadlineIndex], false) //embed 1

                        discordIDS.push(row[DiscordIndex]) //push discord id's
                    } else if (FieldsAdded >= 25 && FieldsAdded < 50) { //25 or more and less than 50
                        FieldsAdded++
                        last2.addField(`${row[InGameNameIndex]} (${row[DiscordIndex]})`, row[DeadlineIndex], false) //embed 2

                        discordIDS.push(row[DiscordIndex])
                    } else if (FieldsAdded >= 50 && FieldsAdded < 75) { //50 or more and less than 75
                        FieldsAdded++
                        last3.addField(`${row[InGameNameIndex]} (${row[DiscordIndex]})`, row[DeadlineIndex], false) //embed 3

                        discordIDS.push(row[DiscordIndex])
                    } else if (FieldsAdded >= 75) { //75 or more
                        FieldsAdded++
                        last4.addField(`${row[InGameNameIndex]} (${row[DiscordIndex]})`, row[DeadlineIndex], false) //embed 4

                        discordIDS.push(row[DiscordIndex])
                    }
                }
            }
        })

        if (!args[0]) { //If no args
            if (last.fields[0]) { //If there are fields in embed 1
                message.channel.send(last) //send 1
            } else { //No fields in embed 1
                message.channel.send("No inactves")
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
    });
}

module.exports.help = {
    name: "inactives",
    usage: "{notify}",
    description: "Sends a list of members who haven't turned in over the past 2 weeks",
    permission: "KICK_MEMBERS"
}