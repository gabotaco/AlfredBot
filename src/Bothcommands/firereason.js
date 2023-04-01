const functions = require('../util/functions.js');
const botconfig = require('../botconfig.json'); //handy info

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		const SearchColumn = functions.GetSearchColumn(args.id || args.member);

		bot.con.query(
			`SELECT fire_reason, company FROM members WHERE ${SearchColumn} = '${
				args.id || args.member
			}'`,
			function (err, result, fields) {
				//get fire reason and company for the specified person
				if (err) {
					console.log(err);
					return reject('Unable to get the fire reason');
				}
				if (!result || !result[0])
					return resolve('Unable to find that member'); //no result
				else if (result[0].company != 'fired')
					return resolve("That person isn't fired"); //if company isn't fired
				else return resolve(result[0].fire_reason); //send fire reason if fired
			}
		);
	});
};

module.exports.help = {
	name: 'firereason',
	aliases: [],
	usage: '<member id>',
	args: [
		{
			name: 'id',
			description: 'Get the firereason of a member using their id',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'Their in game id or discord id',
					type: 4,
					required: true,
					missing: 'Please specify another employee',
					parse: (bot, message, args) => {
						if (message.mentions.members.first())
							args[0] = message.mentions.members.first().id;
						return args[0];
					},
				},
			],
		},
		{
			name: 'discord',
			description: 'Get the firereason of a member using their discord',
			type: 1,
			options: [
				{
					name: 'member',
					description: 'the other discord user',
					type: 6,
					required: true,
					missing: 'Please specify another employee',
					parse: (bot, message, args) => {
						if (message.mentions.members.first())
							args[0] = message.mentions.members.first().id;
						return args[0];
					},
				},
			],
		},
	],
	description: 'Get the reason why someone was fired',
	permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
	slash: true,
};
