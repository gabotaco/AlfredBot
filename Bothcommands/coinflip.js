const Discord = require("discord.js")
const coin = ['https://www.dhresource.com/0x0s/f2-albu-g4-M01-CB-6B-rBVaEFf172SADIH4AAxRIyzuR3s387.jpg/united-states-of-america-coins-liberty-head.jpg', 'https://images-na.ssl-images-amazon.com/images/I/51NyMaKLydL.jpg'] //2 different coin pics
const botconfig = require("../botconfig.json")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        const flip = Math.floor((Math.random() * coin.length)); //gets what coin to flip
        const coinembed = new Discord.MessageEmbed()
            .setImage(coin[flip]) //sets embed image to pic of correct coin
        return resolve(coinembed)
    })

}

module.exports.help = {
    name: "coinflip",
    aliases: ["cf"],
    usage: "",
    description: "Flips a coin",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true,
    args: []
}