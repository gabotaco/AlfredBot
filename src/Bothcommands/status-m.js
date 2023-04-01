const authentication = require('../util/authentication');
const botconfig = require('../botconfig.json');
const functions = require('../util/functions.js');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		const ID = args.member || args.id;
		const SearchColumn = functions.GetSearchColumn(ID);

		bot.con.query(
			`SELECT * FROM applications WHERE ${SearchColumn} = '${ID}' ORDER BY id DESC`,
			function (err, result, fields) {
				if (err) {
					console.log(err);
					return reject('Unable to get applications');
				}
				if (result.length < 1) {
					return resolve(`Unable to find <@${ID}>'s application.`);
				} else {
					return resolve(
						`<@${ID}>'s application status is: ${result[0].status} ${
							result[0].status_info ? `(${result[0].status_info})` : ''
						}`
					);
				}
			}
		);
	});
};

module.exports.help = {
	name: 'status-m',
	aliases: [],
	usage: '<discord|in game id>',
	description: 'Get an employees application status',
	args: [
		{
			name: 'id',
			description: 'Get an applicant status using their ID',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'Their in game id or discord id',
					type: 4,
					required: true,
					missing: 'Please specify another applicant',
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
			description: 'Get an applicant status using their discord',
			type: 1,
			options: [
				{
					name: 'member',
					description: 'the other discord user',
					type: 6,
					required: true,
					missing: 'Please specify another applicant',
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
