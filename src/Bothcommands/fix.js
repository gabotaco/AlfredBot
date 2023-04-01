const botconfig = require('../botconfig.json'); //handy info

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		bot.con.query(
			`UPDATE members SET in_game_id = '${args.in_game_id}', discord_id = '${args.discord}', in_game_name = '${args.name}' WHERE in_game_id = '${args.in_game_id}' OR discord_id = '${args.discord}'`,
			function (err, result, fields) {
				//change persons info without changing deadline
				if (err) {
					if (err.errno == 1366) {
						return resolve('Invalid characters.');
					} else {
						console.log(err);
						return reject('There was an error updating the database.');
					}
				}

				if (result.affectedRows > 0) {
					return resolve('Fixed!');
				} else {
					return resolve("They aren't hired");
				}
			}
		);
	});
};

module.exports.help = {
	name: 'fix',
	aliases: [],
	usage: '<discord ID> "<In game name>" <in-game ID>',
	description: 'Reset in game name',
	args: [
		{
			name: 'id',
			description: 'Fix a member using their discord id',
			type: 1,
			options: [
				{
					name: 'discord',
					description: 'Their discord id',
					type: 3,
					required: true,
					missing: 'Please specify another employee',
					parse: (bot, message, args) => {
						return args[0];
					},
				},
				{
					name: 'name',
					description: 'Their in game name',
					type: 3,
					required: true,
					missing: 'Please specify another employee',
					parse: (bot, message, args) => {
						const messageArray = message.content.split('"'); //Split up discord id, name, and id
						return messageArray[1];
					},
				},
				{
					name: 'in_game_id',
					description: 'Their in game ID',
					type: 4,
					required: true,
					missing: 'Please specify another employee',
					parse: (bot, message, args) => {
						return args[args.length - 1];
					},
				},
			],
		},
		{
			name: 'discord',
			description: 'Fix a member using their discord user',
			type: 1,
			options: [
				{
					name: 'discord',
					description: 'Their discord',
					type: 6,
					required: true,
					missing: 'Please specify another employee',
					parse: (bot, message, args) => {
						return args[0];
					},
				},
				{
					name: 'name',
					description: 'Their in game name',
					type: 3,
					required: true,
					missing: 'Please specify another employee',
					parse: (bot, message, args) => {
						const messageArray = message.content.split('"'); //Split up discord id, name, and id
						return messageArray[1];
					},
				},
				{
					name: 'in_game_id',
					description: 'Their in game ID',
					type: 4,
					required: true,
					missing: 'Please specify another employee',
					parse: (bot, message, args) => {
						return args[args.length - 1];
					},
				},
			],
		},
	],
	permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
	slash: true,
};
