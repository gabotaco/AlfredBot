const Discord = require('discord.js');
const botconfig = require('../botconfig');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		const guild = bot.guilds.cache.get(args.guild_id);

		const serverembed = new Discord.MessageEmbed()
			.setDescription('Server Information')
			.setColor('RANDOM')
			.setThumbnail(guild.iconURL())
			.addField('Server Name', guild.name)
			.addField('Created On', guild.createdAt)
			.addField('Owner', guild.owner)
			.addField('You Joined', guild.members.cache.get(args.author_id).joinedAt)
			.addField('Total members', guild.memberCount); //all of this is random info I found under Guild in discord.js

		return resolve(serverembed);
	});
};

module.exports.help = {
	name: 'serverinfo',
	aliases: [],
	usage: '',
	description: 'Get some handy info about the server',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
};
