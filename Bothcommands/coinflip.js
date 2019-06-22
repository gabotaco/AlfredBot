const Discord = require("discord.js")
const coin = ['https://www.dhresource.com/0x0s/f2-albu-g4-M01-CB-6B-rBVaEFf172SADIH4AAxRIyzuR3s387.jpg/united-states-of-america-coins-liberty-head.jpg', 'https://images-na.ssl-images-amazon.com/images/I/51NyMaKLydL.jpg'] //2 different coin pics

module.exports.run = async (bot, message, args) => {
    let flip = Math.floor((Math.random() * coin.length)); //gets what coin to flip
    let coinembed = new Discord.RichEmbed()
        .setImage(coin[flip]) //sets embed image to pic of correct coin
    message.channel.send(coinembed)
}

module.exports.help = {
    name: "coinflip",
    usage: "",
    description: "Flips a coin",
    permission: "MANAGE_MESSAGES"
}