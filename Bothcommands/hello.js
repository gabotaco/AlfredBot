const Discord = require("discord.js") //discord
const botconfig = require("../botconfig.json"); //handy info
const {
    google
} = require('googleapis'); //allows you to use googles api
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js") //Handy functions

const Hellos = ["hallo", "Përshëndetje", "ሰላም", "مرحبا", "Բարեւ Ձեզ", "Salam", "Kaixo", "добры дзень", "হ্যালো", "Здравейте", "Hola", "Kumusta", "Moni", "你好", "Bonghjornu", "zdravo", "Ahoj", "Hej", "Hello", "Saluton", "Tere", "Kamusta", "Hei", "Salut", "Hoi", "Ola", "გამარჯობა", "γεια σας", "નમસ્તે", "Bonjou", "Sannu", "aloha", "שלום", "नमस्ते", "Nyob zoo", "Szia", "Halló", "Nnọọ", "Halo", "Dia dhuit", "Ciao", "こんにちは", "ಹಲೋ", "Сәлеметсіз бе", "សួស្តី។", "여보세요", "Slav", "салам", "ສະບາຍດີ", "Salve", "Sveiki", "Здраво", "Salama", "ഹലോ", "Bongu", "Kia ora", "नमस्कार", "Сайн уу", "ဟယ်လို", "سلام", "cześć", "Olá", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "Привет", "talofa", "Halò", "Lumela", "Mhoro", "هيلو", "හෙලෝ", "Salaan", "Habari", "Салом", "வணக்கம்", "హలో", "สวัสดี", "Merhaba", "Здравствуйте", "ہیلو", "Salom", "xin chào", "Helo", "Mholweni", "העלא", "Pẹlẹ o", "Sawubona"]
module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        return resolve(Hellos[Math.floor(Math.random() * Hellos.length)]) //Picks a random hello to send and sends it
    })
}

module.exports.help = {
    name: "hello",
    aliases: [],
    usage: "",
    description: "Say Hi",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: true,
    args: []
}