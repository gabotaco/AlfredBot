const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    message.channel.send("How many vouchers do you want in total?").then(msg => msg.delete(10000)) //ask question and delete after 10000 ms
    const WantedCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 }); //make message collector that lasts 10000 ms and only accepts messages from orignal person
    WantedCollector.on('collect', message => { //when message is sent while its running
        WantedCollector.stop() //stop it

        const Wanted = message.content //save what user sent

        message.delete() //delete the users message

        message.channel.send("How many vouchers do you currently have?").then(msg => msg.delete(10000)) //ask question
        const currentCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        currentCollector.on('collect', message => {
            currentCollector.stop()

            const CurrentVouchers = message.content

            message.delete()

            message.channel.send("How much stolen money do you currently have?").then(msg => msg.delete(10000))
            const stolenCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
            stolenCollector.on('collect', message => {
                stolenCollector.stop()

                const StolenMoney = message.content

                message.delete()

                const vm = Wanted - CurrentVouchers;
                const gstolenMoney = Math.ceil(((vm / 75) * 10000 - StolenMoney)) //Get whole number
                const goodMessage = (gstolenMoney).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') //Adds commas
                const bestMessage = goodMessage.replace(/\.00$/, ''); //Removes the .00 at the end

                message.channel.send("For " + vm + " vouchers you will need: " + bestMessage + " stolen money.")
            })
        })
    })
}

module.exports.help = {
    name: "calculate",
    usage: "{wanted vouchers} {current vouchers} {current stolen money}",
    description: "Figure out how much stolen money you need to get some vouchers",
    permission: "SEND_MESSAGES"
}