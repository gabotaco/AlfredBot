const botconfig = require("../botconfig.json")
module.exports.run = async (bot, message, args) => {
    if (message.guild.id == botconfig.PIGSServer) { //pigs server
        return message.channel.send("https://docs.google.com/document/d/1NTAP7AkkNBiQehwCn8A-OTAExUVsIUbpXjNXAYmGmsk/edit?usp=sharing") //pigs handbook
    } else if (message.guild.id == botconfig.RTSServer) { //rts server
        return message.channel.send("https://docs.google.com/document/d/1FWgrc_7kowBbWLx2Ce0WHOIXy-vAcUCROe6UTMOszjM/edit?usp=sharing")  //rts handbook
    }
}

module.exports.help = {
    name: "handbook",
    usage: "",
    description: "Get the employee handbook",
    permission: "SEND_MESSAGES"
}