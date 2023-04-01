const botconfig = require("../botconfig.json")
module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        if (args.guild_id == botconfig.PIGSServer) { //pigs server
            return resolve("https://docs.google.com/document/d/1NTAP7AkkNBiQehwCn8A-OTAExUVsIUbpXjNXAYmGmsk/edit?usp=sharing") //pigs handbook
        } else if (args.guild_id == botconfig.RTSServer) { //rts server
            return resolve("https://docs.google.com/document/d/1FWgrc_7kowBbWLx2Ce0WHOIXy-vAcUCROe6UTMOszjM/edit?usp=sharing")  //rts handbook
        }
    })
}

module.exports.help = {
    name: "handbook",
    aliases: ["hb"],
    usage: "",
    description: "Get the employee handbook",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true,
    args: []
}