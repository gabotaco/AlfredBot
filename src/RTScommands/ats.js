const ATSRole = '478393609540861952';
const botconfig = require('../botconfig');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		const member = bot.guilds.cache
			.get(args.guild_id)
			.members.cache.get(args.author_id);

		if (member.roles.cache.has(ATSRole)) {
			//if they have the role by ID
			member.roles.remove(ATSRole); //removes role
			resolve('Took away the ATS role');
			return;
		} else {
			//Don't have the role
			member.roles.add(ATSRole); //adds role
			resolve('Given the ATS role!');
			return;
		}
	});
};

module.exports.help = {
	name: 'ats',
	aliases: [],
	usage: '',
	args: [],
	description: 'Gives or takes away the ATS role',
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
};
