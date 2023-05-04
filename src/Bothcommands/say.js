const botconfig = require('../botconfig');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		bot.guilds.cache
			.get(args.guild_id)
			.channels.cache.get(args.channel_id)
			.send(args.message);
		resolve(`Sent ${args.message}.`); //sends whatever you said
	});
};

module.exports.help = {
	name: 'say',
	aliases: [],
	usage: '<message>',
	description: 'Make the bot say something',
	args: [
		{
			name: 'message',
			description: 'What Alfred should say',
			type: 3,
			required: true,
			missing: 'Please specify a message',
			parse: (bot, message, args) => {
				return args.join(' ');
			},
		},
	],
	permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
	slash: true,
	hidden: true,
};
