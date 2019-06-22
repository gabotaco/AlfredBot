const Discord = require("discord.js");
const fs = require('fs');
const botconfig = require("../botconfig.json")
module.exports.run = async (bot, message, args) => {
    if (message.guild.id == botconfig.PIGSServer) {
        var CommandFolder = "./PIGScommands/" //folder with pigs commands
    } else if (message.guild.id == botconfig.RTSServer) {
        var CommandFolder = "./RTScommands/" //folder with rts commands
    }

    fs.readdir(CommandFolder, (err, files) => { //reads all files in the commands folder
        if (err) message.channel.send(err);

        const jsfile = files.filter(f => f.split(".").pop() == "js") //Removes non js files from the array
        let help1 = new Discord.RichEmbed() //2 different embeds cause lots of commands
            .setTitle(`Alfreds Commands that ${message.member.displayName} can use`, bot.user.displayAvatarURL)
            .setDescription("Things in {} are optional. Things in [] are required")
            .setThumbnail(bot.user.displayAvatarURL)
            .setColor("RANDOM")  //random color
        let help2 = new Discord.RichEmbed()

        let i = 0 //track how many times i've added to an embed

        jsfile.forEach((f) => { //for each file in commands
            const command = require(`.${CommandFolder}${f}`);
            if (i < 25 && message.member.hasPermission(command.help.permission.toString())) { //If i haven't added 25 fields
                help1.addField(`.${command.help.name} ${command.help.usage}`, `${command.help.description}.`) //adds the command info to the embed
                i++ //adds 1 to I
            } else if (i < 50 && message.member.hasPermission(command.help.permission.toString())) { //need 2 because you can't have more than 25 fields in an embed or else it fails
                help2.addField(`.${command.help.name} ${command.help.usage}`, `${command.help.description}.`)
                i++
            }
        });

        fs.readdir("./Bothcommands", (err, files) => { //reads all files in the commands folder
            if (err) message.channel.send(err);
    
            const jsfile = files.filter(f => f.split(".").pop() == "js") //removes non js files from array
    
            jsfile.forEach((f) => { //for each file in commands
                const command = require(`../Bothcommands/${f}`);
                if (i < 25 && message.member.hasPermission(command.help.permission.toString())) { //Doesn't go over 25
                    help1.addField(`.${command.help.name} ${command.help.usage}`, `${command.help.description}.`) //adds the command info to the embed
                    i++ //adds 1 to I
                } else if (i < 50 && message.member.hasPermission(command.help.permission.toString())) { //need 2 because you can't have more than 25 fields in an embed or else it fails
                    help2.addField(`.${command.help.name} ${command.help.usage}`, `${command.help.description}.`)
                    i++
                }
            });
    
            
            if (!help2.fields[0]) { //if there aren't any fields in the help2 embed
                message.author.send(help1) //send only 1
                message.react('👍')
                return; //ends command
            } else { //are fields in help2
                message.author.send(help1)
                message.author.send(help2)
                message.react('👍')
                return;
            }
        });
    });


}


module.exports.help = {
    name: "help",
    usage: "",
    description: "Sends a list of commands",
    permission: "SEND_MESSAGES"
}