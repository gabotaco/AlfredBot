const functions = require('../util/functions.js');
const botconfig = require('../botconfig');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		const ID = args.id || args.member;
		const SearchColumn = functions.GetSearchColumn(ID);

		bot.con.query(
			`UPDATE members SET company = 'pigs' WHERE ${SearchColumn} = '${ID}' AND company != 'fired'`,
			function (err, result, fields) {
				//set company
				if (err) {
					console.log(err);
					return reject('Unable to update the members table.');
				}
				if (result.affectedRows > 0) {
					functions.CheckForActive(bot, SearchColumn, ID).then(() => {
						return resolve('Transferred to PIGS');
					});
				} else {
					resolve("Couldn't find a hired member with that id.");
				}
			}
		);
	});
};

module.exports.help = {
	name: 'pigs',
	aliases: [],
	usage: '<member>',
	description: 'Transfer someone to pigs',
	args: [
		{
			name: 'id',
			description: 'Transfer an employee using their id',
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
			description: 'Transfer an employee using their discord',
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
	permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
	slash: true,
};
