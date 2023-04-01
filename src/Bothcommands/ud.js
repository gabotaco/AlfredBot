const urban = require('relevant-urban'); //search urban dictionary api
const Discord = require('discord.js');
const botconfig = require('../botconfig');

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		const res = await urban(args.word).catch(e => {
			//search urban dictionary and if there is an error then that means there were no responses
			resolve(
				'Did you make that up or something because its not even on urban dictionary'
			);
			return;
		});

		if (!res) {
			resolve(
				'Did you make that up or something because its not even on urban dictionary'
			);
			return;
		}
		const urbanDefinition = res.definition.replace(/\[/g, ''); //removes all the [] from the message. Looks stupid.
		const bestUrbanDefinition = urbanDefinition.replace(/\]/g, '');
		const urbanExample = res.example.replace(/\[/g, '');
		const bestUrbanExample = urbanExample.replace(/\]/g, '');

		const urbanEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(res.word) //uses the word returned because sometimes it will return the definition of a sorta similar word
			.setURL(res.urbanURL)
			.addField('Definition', bestUrbanDefinition);
		if (bestUrbanExample) urbanEmbed.addField('Example', bestUrbanExample);

		resolve(urbanEmbed);
	});
};

module.exports.help = {
	name: 'ud',
	aliases: [],
	usage: '<word>',
	description: 'Search urban dictionary',
	args: [
		{
			type: 3,
			name: 'word',
			description: 'What word or phrase do you want to search',
			required: true,
			missing: 'Please specify a word',
			parse: (bot, message, args) => {
				return args.join(' ');
			},
		},
	],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
	slow: true,
};
