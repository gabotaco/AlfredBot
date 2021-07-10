
const botconfig = require("../botconfig.json")
const Discord = require("discord.js")
/*
'use strict';

const path = require('path');
const GoogleAssistant = require('../google');
const config = {
    auth: {
        keyFilePath: path.resolve(__dirname, "../" + botconfig.GoogleAssistantKeyFile),
        savedTokensPath: "/root/Dropbox/JavaScript/discordBots/alfredBot/tokens.json", // where you want the tokens to be saved
    },
    conversation: {
        lang: 'en-US', // defaults to en-US, but try other ones, it's fun!
    },
};


const assistant = new GoogleAssistant(config.auth); //makes a google assistant to use
assistant
    .on('ready', function () {
        console.log("Asisstant is ready!")
    })
    .on('error', (error) => {
        console.log('Assistant Error:', error);
    });*/

module.exports.run = async (bot, message, args) => {
    return message.channel.send(`I don't wanna talk to you anymore`)
    const startConversation = (conversation) => {
        // setup the conversation
        conversation
            .on('response', text => {
                if (!text || text.length <= 1) message.channel.send("Sorry, I don't understand")
                else {
                    message.channel.send(text)
                }
            })
            // if we've requested a volume level change, get the percentage of the new level
            .on('volume-percent', percent => message.channel.send(`I can't change my volume to ${percent}% cause I'm a Discord bot`))
            // the device needs to complete an action
            .on('device-action', action => console.log('Device Action:', action))
            // once the conversation is ended, see if we need to follow up
            .on('ended', (error, continueConversation) => {
                if (error) {
                    console.log('Conversation Ended Error:', error);
                } else if (continueConversation) {
                    const ResponseCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                        time: 10000
                    });
                    ResponseCollector.on('collect', message => {
                        ResponseCollector.stop() //stop looking for responses
    
                        config.conversation.textQuery = message.content 
                        assistant.start(config.conversation, startConversation); //re run this command but with the response
                    })
                } else {
                    console.log('Conversation Complete');
                    conversation.end();
                }
            })
            // catch any errors
            .on('error', (error) => {
                console.log('Conversation Error:', error);
            });
    };
    
    if (!args[0]) return message.channel.send("Hey") //didn't say anything
    config.conversation.textQuery = args.join(" "); //set the text to what they said
    assistant.start(config.conversation, startConversation); //star the assistant
}

module.exports.help = {
    disabled: true,

    name: "ask",
    aliases: [],
    usage: "<question>",
    args: [{
        type: 3,
        name: "question",
        description: "Question to ask Alfred",
        required: true,
        missing: "Hey",
        parse: (bot, message, args) => {
            return args.join(" ");
        }
    }],
    description: "ask Alfred a question",
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES, ...botconfig.MEMBERS],
    slash: false
}