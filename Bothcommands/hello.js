const Discord = require("discord.js") //discord
const botconfig = require("../botconfig.json"); //handy info
const { google } = require('googleapis'); //allows you to use googles api
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js") //Handy functions

module.exports.run = async (bot, message, args) => {
    return message.channel.send("Hola!") //sends hello and then ends the command
}

module.exports.help = {
    name: "hello",
    usage: "",
    description: "Say Hi",
    permission: "SEND_MESSAGES"
}