const botconfig = require("../botconfig.json");

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        if (args.guild_id == botconfig.PIGSServer) { //PIGS server
            var CompanyName = "pigs"
        } else if (args.guild_id == botconfig.RTSServer) { //rts server
            var CompanyName = "rts"
        }
    
        bot.con.query(`SELECT company FROM members`, function (err, result, fields) { //get the company for every member
            if (err) {
                console.log(err)
                return reject("There was an error getting employees.");
            }
    
            let employees = 0; //start at 0
    
            result.forEach(member => { //go through each member
                if (member.company == CompanyName) { //if their company is the company name
                    employees++;
                }
            });
            return resolve(`${employees} employees in ${CompanyName.toUpperCase()}`)
        })
    })
}

module.exports.help = {
    name: "employees",
    aliases: ["emps"],
    usage: "",
    description: "Gets the number of employees",
    args: [],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
    slash: true
}