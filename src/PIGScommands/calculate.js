const Discord = require("discord.js")
const botconfig = require("../botconfig")

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        const Wanted = args.wanted_vouchers
        const CurrentVouchers = args.current_vouchers
        const StolenMoney = args.stolen_money

        const vm = Wanted - CurrentVouchers;
        const gstolenMoney = Math.ceil(((vm / 75) * 10000 - StolenMoney)) //Get whole number
        const goodMessage = (gstolenMoney).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') //Adds commas
        const bestMessage = goodMessage.replace(/\.00$/, ''); //Removes the .00 at the end

        resolve(`To get your remaining ${vm} vouchers you will need: ${bestMessage} stolen money.`)
    })
}

module.exports.help = {
    name: "calculate",
    aliases: ["calc"],
    usage: "<wanted vouchers> <current vouchers> <current stolen money>",
    description: "Figure out how much stolen money you need to get some vouchers",
    args: [{
        type: 4,
        name: "wanted_vouchers",
        description: "How many vouchers do you want in total?",
        required: true,
        missing: "Please specify how many vouchers you want.",
        parse: (bot, message, args) => {
            return args[0]
        }
    }, {
        type: 4,
        name: "current_vouchers",
        description: "How many vouchers do you currently have?",
        required: true,
        missing: "Please specify how many vouchers you have.",
        parse: (bot, message, args) => {
            return args[1]
        }
    }, {
        type: 4,
        name: "stolen_money",
        description: "How much stolen money do you currently have?",
        required: true,
        missing: "Please specify how much stolen money you have.",
        parse: (bot, message, args) => {
            return args[2]
        }
    }, ],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES],
    slash: true
}