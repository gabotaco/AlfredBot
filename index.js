let LastPerson = "439959655448313866"; //Last person to send a message to the one word story channel in PIGS discord
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true }) //declares new bot that can't @ everyone

bot.RTSCommands = new Discord.Collection(); //Store all commands inside a discord collection
bot.PIGSCommands = new Discord.Collection();
bot.BothCommands = new Discord.Collection();

bot.login(botconfig.token)//logs in the bot with the token found in botconfig.json

fs.readdir("./Bothcommands/", (err, files) => { //Gets all files in the Bothcommands folder
    if (err) console.log(err);
    const jsfile = files.filter(f => f.split(".").pop() == "js") //only finds files that are .js
    if (jsfile.length <= 0) { //if there aren't any files in folder
        console.log("Couldn't find any BOTH commands");
        return;
    }

    jsfile.forEach((f, i) => { //For each js file in the folder
        const props = require(`./Bothcommands/${f}`); //loads the file (module.exports)
        console.log(`BOTH ${f} loaded!`); //Logs that it got the file correctly
        bot.BothCommands.set(props.help.name, props); //adds to the discord collection with key props.help.name and then value props
    });
})
fs.readdir("./RTScommands/", (err, files) => { //Gets all files in the RTScommands folder
    if (err) console.log(err);
    const jsfile = files.filter(f => f.split(".").pop() == "js") //only finds files that are .js
    if (jsfile.length <= 0) { //if there aren't any files in folder
        console.log("Couldn't find RTS commands");
        return;
    }

    jsfile.forEach((f, i) => { //For each js file in the folder
        const props = require(`./RTScommands/${f}`); //loads the file (module.exports)
        console.log(`RTS ${f} loaded!`) //logs that it got the file correctly
        bot.RTSCommands.set(props.help.name, props); //adds to the discord collection with key props.help.name and then value props
    });
});

fs.readdir("./PIGScommands/", (err, files) => {
    if (err) console.log(err);
    const jsfile = files.filter(f => f.split(".").pop() == "js") //Only finds files that are .js
    if (jsfile.length <= 0) { //if there aren't any files in folder
        console.log("Couldn't find PIGS commands");
        return;
    }

    jsfile.forEach((f, i) => { //For each js file in the folder
        const props = require(`./PIGScommands/${f}`); //Loads the file (module.exports)
        console.log(`PIGS ${f} loaded!`) //Logs that it got the file correctly
        bot.PIGSCommands.set(props.help.name, props); //adds to the discord collection with key props.help.name and then value props
    });
});

bot.on("ready", async () => { //When the bot logs in
    bot.user.setActivity("Transport Tycoon", { type: "PLAYING" }); //sets the current game. Can be PLAYING STREAMING WATCHING LISTENING

    // botconfig.RTSWelcome = bot.channels.get(botconfig.RTSWelcome); //sets the channels in botconfig to actual discord channels instead of just their ID's
    // botconfig.PIGSWelcome = bot.channels.get(botconfig.PIGSWelcome);
    // botconfig.RTSStaffChannel = bot.channels.get(botconfig.RTSStaffChannel)
    // botconfig.PIGSStaffChannel = bot.channels.get(botconfig.PIGSStaffChannel)
    // botconfig.PIGSLogs = bot.channels.get(botconfig.PIGSLogs);
    // botconfig.RTSLogs = bot.channels.get(botconfig.RTSLogs);
    // botconfig.PIGSOneWordStory = bot.channels.get(botconfig.PIGSOneWordStory)
    // botconfig.RTSCEOSpamChannel = bot.channels.get(botconfig.RTSCEOSpamChannel);
    // botconfig.RTSPublicBotCommandsChannel = bot.channels.get(botconfig.RTSPublicBotCommandsChannel)
    // botconfig.RTSBotCommandsChannel = bot.channels.get(botconfig.RTSBotCommandsChannel)
    // botconfig.RTSBennysChannel = bot.channels.get(botconfig.RTSBennysChannel)
    // botconfig.PIGSBotCommandsChannel = bot.channels.get(botconfig.PIGSBotCommandsChannel)
    // botconfig.PIGSVoucherChannel = bot.channels.get(botconfig.PIGSVoucherChannel)

    bot.channels.get(botconfig.RTSCEOSpamChannel).send("Restarted."); //Send a message to a channel

    console.clear(); //Remove all the loaded console logs
    console.log(`${bot.user.username} is online!`); //logs that the bot is online
});

bot.on("messageDeleteBulk", async messages => { //When multiple messages are deleted (.clear)
    let DeletedMessages = new Discord.RichEmbed()
        .setTitle("Deleted Messages")
        .setColor("RANDOM")
    messages.forEach(message => { //loop through all the deleted messages
        DeletedMessages.addField(message.member.displayName, message.content, true)
    });

    if (messages.array()[0].guild.id == botconfig.PIGSServer) { //if the first message is in the PIGS server (then all messages are in pigs server)
        botconfig.PIGSLogs.send(DeletedMessages); //send to pigs logs channel
    } else if (messages.array()[0].guild.id == botconfig.RTSServer) { //rts server
        botconfig.RTSLogs.send(DeletedMessages); //send to rts logs channel
    }
})

bot.on("messageDelete", async (message) => { //When a single message is deleted
    let DeletedMessage = new Discord.RichEmbed() //same as messageDeleteBulk except don't have to loop through multiple messages
        .setTitle("Deleted Message")
        .setColor("RANDOM")
        .addField("Author", message.author)
        .addField("Content", message.content)
        .addField("Channel", message.channel)

    if (message.guild.id == botconfig.PIGSServer) {
        botconfig.PIGSLogs.send(DeletedMessage)
    } else if (message.guild.id == botconfig.RTSServer) {
        botconfig.RTSLogs.send(DeletedMessage)
    }
})

bot.on("guildMemberAdd", async member => { //When someone joins the guild
    if (member.user.bot) { //if its a bot
        if (member.guild.id == botconfig.RTSServer) { //joined rts server
            return member.addRole(botconfig.RTSBotRole) //Adds the rts bot role and ends
        } else if (member.guild.id == botconfig.PIGSServer) { //joined pigs server
            return member.addRole(botconfig.PIGSBotRole) //adds pigs bot role and ends
        }
    }
    if (member.guild.id == botconfig.RTSServer) { //rts server and not bot
        botconfig.RTSWelcome.send(`Welcome to ${member.guild.name} ${member}!`) //Says welcome in the rts server
        bot.BothCommands.get("roles").run(bot, null, [member.id]) //gets the roles command and runs it for the new member
    } else if (member.guild.id == botconfig.PIGSServer) { //pigs commands
        botconfig.PIGSWelcome.send(`Welcome to ${member.guild.name} ${member}!`) //Says welcome in the pigs server
        bot.BothCommands.get("roles").run(bot, null, [member.id]) //gets the roles command and runs it for the new member
    }
})

bot.on("guildMemberRemove", async member => { //When someone leaves the server
    if (member.guild.id == botconfig.RTSServer) { //rts server
        botconfig.RTSWelcome.send(`${member.displayName} has left the server.`); //says that the username has left. Doesn't @ in case they change their name and also is glitchy sometimes
    } else if (member.guild.id == botconfig.PIGSServer) {
        botconfig.PIGSWelcome.send(`${member.displayName} has left the server.`); //says that the username has left. Doesn't @ in case they change their name and also is glitchy sometimes
    }
})

bot.on("message", async message => { //Someone sends a message in a channel
    if (message.author.bot || message.channel.type == "dm") return; //if message is from a bot or is in a DM with the bot
    if (message.channel.id == botconfig.PIGSOneWordStory) { //If its in the one word story channel
        if ((message.content.split(" ").length > 1 || message.content.split("-").length > 1 || message.content.split("_").length > 1) || message.content.includes(":")) { //if the message contains an emoji or is more than one word
            message.delete() //deletes it
        } else if (LastPerson == message.member.id) message.delete() //if the last person to send a message is also the person then delete it
        else LastPerson = message.member.id; //if its one word and a new person then don't delete it and set the last person to the new person
    }
    if (message.content.includes("https://discord.gg/") && !message.member.hasPermission("KICK_MEMBERS")) { //if the message has a discord invite and its not from a manager
        message.delete() //delete it
        message.channel.send("No invites plz and thx")
    }

    if (message.guild.id == botconfig.PIGSServer) var prefix = botconfig.prefix.PIGS //in case of a different prefix for each server
    else if (message.guild.id == botconfig.RTSServer) var prefix = botconfig.prefix.RTS
    const messageArray = message.content.split(' '); //splits the message into an array for every space into an array
    const cmd = messageArray[0].toLowerCase(); //command is first word in lowercase
    const args = messageArray.slice(1); //args is everything after the first word
    if (message.mentions.members.size > 0 && message.mentions.members.first().id == "472060657081122818") {
        message.channel.startTyping(); //start type in the channel
        await bot.BothCommands.get("ask").run(bot, message, args)
        message.channel.stopTyping(true) //stops typing in the channel after the command finishes
    }
    if (!message.content.startsWith(prefix)) return; //if it doesn't start with the prefix

    if (message.guild.id == botconfig.RTSServer) { //if said in the rts server
        var commandfile = bot.RTSCommands.get(cmd.slice(prefix.length)); //Trys to get a rts command with the specified cmd without the prefix
        if (commandfile && (message.channel.id != botconfig.RTSPublicBotCommandsChannel && message.channel.id != botconfig.RTSBotCommandsChannel && message.channel.id != botconfig.RTSBennysChannel) && !message.member.hasPermission("KICK_MEMBERS") && cmd != ".status") return message.channel.send(`Do this in ${botconfig.RTSPublicBotCommandsChannel} or ${botconfig.RTSBotCommandsChannel}`) //if theres a command but its not in one of the allowed channels
        if (commandfile) console.log("RTS", commandfile.help.name, args) //if theres a command file then log that its rts and then the name and args
    } else if (message.guild.id == botconfig.PIGSServer) {//if said in the pigs server
        var commandfile = bot.PIGSCommands.get(cmd.slice(prefix.length)); // try to get a pigs command with the specified cmd without the prefix
        if (commandfile && (message.channel.id != "511853214858084364" && message.channel.id != botconfig.PIGSBotCommandsChannel && message.channel.id != botconfig.PIGSVoucherChannel) && !message.member.hasPermission("KICK_MEMBERS") && cmd != ".status") return message.channel.send("Do this in <#" + botconfig.PIGSBotCommandsChannel + "> instead") //if theres a command but its said in the wrong channel
        if (commandfile) console.log("PIGS", commandfile.help.name, args) //if theres a command file then log that its pigs and then the name and args
    }
    if (!commandfile) { //if theres isn't a pigs or rts command
        var commandfile = bot.BothCommands.get(cmd.slice(prefix.length)) //try to get a both server command with the specified cmd without the prefix
        if (commandfile) console.log("BOTH", commandfile.help.name, args) //logs that theres a command file
    }
    if (commandfile) { //if theres a command file in both, rts, or pigs
        message.channel.startTyping(); //start type in the channel
        await commandfile.run(bot, message, args); //if there is a command in the bot it runs the module.exports.run part of the file.
        message.channel.stopTyping(true) //stops typing in the channel after the command finishes
    }
});

bot.on("presenceUpdate", (oldMember, newMember) => { //When a guild member's presence changes (online/offline or games)
    if (botconfig.PIGSManagers.includes(oldMember.id) && newMember.guild.id == botconfig.PIGSServer) { //if its a pigs manager and the update is triggered in the pigs server
        if (newMember.presence.status == "offline" && !newMember.roles.has(botconfig.PIGSUnavailableRole)) return newMember.addRole(botconfig.PIGSUnavailableRole)// if they are now offline and don't have the pigs unavailable role, add the unavailable role
        else if (newMember.presence.status == "online" && newMember.roles.has(botconfig.PIGSUnavailableRole) && (newMember.id == botconfig.AltTabsID || newMember.id == "330015505211457551")) return newMember.removeRole(botconfig.PIGSUnavailableRole) //If they are now online and have the unavailable role and are alt tabs or solid 2 hours it will auto make em available
    } else if (botconfig.RTSManagers.includes(oldMember.id) && newMember.guild.id == botconfig.RTSServer) { //if its a rts manager and the update is triggered in the rts server
        if (newMember.presence.status == "offline" && !newMember.roles.has(botconfig.RTSUnavailableRole)) return newMember.addRole(botconfig.RTSUnavailableRole) //If they are offline now and don't have the unavailable role it adds it
    }

    if (oldMember.roles.has(botconfig.RTSGuestRole) || oldMember.guild.id == botconfig.PIGSServer) return; //if its a guest or is in the pigs server stop the command

    if (newMember.user.presence.game && newMember.user.presence.game.name == "Transport Tycoon") { //If they are playing a game and the games name is Transport Tycoon
        oldMember.addRole(botconfig.RTSFiveMRole); //adds the fivem role
    } else if (!newMember.user.presence.game && newMember.roles.has(botconfig.RTSFiveMRole)) { //If they aren't playing a game but have the fivem role
        newMember.removeRole(botconfig.RTSFiveMRole); //removes role
    }
});

bot.on("message", async message => { //When a message is sent to a channel. Not in the other bot.on message because its easier to read
    if (message.author.bot || message.author.id == botconfig.GlitchDetectorID) return; //if its from a bot or is from glitch himself

    message.mentions.members.forEach(function (Mention) { //go through all the mentions in the message
        if (Mention.user.id == botconfig.GlitchDetectorID) { //if they mentioned glitch
            message.delete() //delete the message

            let GlitchEmbed = new Discord.RichEmbed() //make an embed with info about the message
                .setColor("#bc0000")
                .setTitle("Pinged Glitch")
                .addField("Author", message.member.displayName)
                .addField("Message", message.content)
                .addField("Date", message.createdAt)
                .addField("In Channel", message.channel)

            if (message.guild.id == botconfig.RTSServer) botconfig.RTSLogs.send(GlitchEmbed) //if its in rts send to rts logs
            else if (message.guild.id == botconfig.PIGSServer) botconfig.PIGSLogs.send(GlitchEmbed) //if its in pigs send to pigs logs
        }
    })
})

bot.on("error", (error) => { //when theres a discord error
    console.log(error)
})

bot.on("disconnect", () => { //when the bot disconnects
    bot.login(botconfig.token) //reconnect
})