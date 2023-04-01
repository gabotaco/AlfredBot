const warzoneRole = '705247928125489212';
const botconfig = require('../botconfig');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		const member = bot.guilds.cache
			.get(args.guild_id)
			.members.cache.get(args.author_id);

		if (member.roles.cache.has(warzoneRole)) {
			//if they have the role by ID
			member.roles.remove(warzoneRole); //removes role
			resolve('Took away the Warzone role');
			return;
		} else {
			//Don't have the role
			member.roles.add(warzoneRole); //adds role
			resolve('Given the Warzone role!');
			return;
		}
	});
};

module.exports.help = {
	name: 'warzone',
	aliases: [],
	usage: '',
	args: [],
	description: 'Gives or takes away the warzone role',
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
};
