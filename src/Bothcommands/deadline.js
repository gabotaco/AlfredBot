const functions = require('../util/functions.js');
const botconfig = require('../botconfig.json');

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		const SearchColumn = functions.GetSearchColumn(args.author_id); //check if they used discord id or ingame id

		const MemberInfo = await functions.GetMemberDetails(
			bot.con,
			SearchColumn,
			args.author_id
		); //Get their member info
		if (!MemberInfo) return resolve("Couldn't find that user"); //no member data

		return resolve(`Your deadline: ${MemberInfo.deadline}`); //get the deadline and send it
	});
};

module.exports.help = {
	name: 'deadline',
	aliases: [],
	usage: '',
	description: 'Get when your deadline is',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
	],
	slash: true,
};
