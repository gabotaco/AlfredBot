const Discord = require('discord.js');
const superagent = require('superagent');
const botconfig = require('../botconfig.json');

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		let { body } = await superagent.get(`https://aws.random.cat/meow`); //gets random cat pic

		let catembed = new Discord.MessageEmbed()
			.setColor('ff9900')
			.setTitle('Catto')
			.setImage(body.file); //sets image of embed to cat

		return resolve(catembed);
	});
};

module.exports.help = {
	name: 'catto',
	aliases: ['cat'],
	usage: '',
	description: 'Sends a random photo of a cat',
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
	args: [],
	slow: true,
};
