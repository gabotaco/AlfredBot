const Discord = require('discord.js');
const superagent = require('superagent'); //read webpages
const botconfig = require('../botconfig.json');

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		const { body } = await superagent //body of the webpage
			.get(`https://random.dog/woof.json`); //gets an online json file that will display a random url on load

		const dogembed = new Discord.MessageEmbed()
			.setColor('#ff9900')
			.setTitle('woofer')
			.setImage(body.url); //the url under the body of the webpage

		return resolve(dogembed);
	});
};

module.exports.help = {
	name: 'doggo',
	aliases: ['dog'],
	usage: '',
	description: 'Sends a random photo of a dog',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
	slow: true,
};
