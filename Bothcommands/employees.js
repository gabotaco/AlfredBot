const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) { //Can't manage nicknames
        message.channel.send("You aren't allowed to do that")
        return;
    }
    
    if (message.guild.id == botconfig.PIGSServer) { //PIGS server
        var CompanyName = "pigs"
    } else if (message.guild.id == botconfig.RTSServer) { //rts server
        var CompanyName = "rts"
    }

    bot.con.query(`SELECT company FROM members`, function (err, result, fields) { //get the company for every member
        if (err) return console.log(err)

        let employees = 0; //start at 0

        result.forEach(member => { //go through each member
            if (member.company == CompanyName) { //if their company is the company name
                employees++;
            }
        });
        message.channel.send(`${employees} employees in ${CompanyName.toUpperCase()}`)
    })
}

module.exports.help = {
    name: "employees",
    usage: "",
    description: "Gets the number of employees",
    permission: "MANAGE_NICKNAMES"
}