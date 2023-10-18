const functions = require('../util/functions.js');
const Discord = require('discord.js');
const botconfig = require('../botconfig');
module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		const ID = args.id || args.member;
		const SearchColumn = functions.GetSearchColumn(ID);

		const WarnID = args.warnid;
		if (!WarnID) return resolve('Please provide a warn id');

		const MemberData = await functions.GetMemberDetails(
			bot.con,
			SearchColumn,
			ID
		);
		if (!MemberData) return resolve('Unable to find that applicant');

		bot.con.query(
			`SELECT id FROM warnings WHERE member_id = '${MemberData.id}' AND id = '${WarnID}'`,
			function (err, result, fields) {
				if (err) {
					console.log(err);
					return reject('Unable to get warnings table.');
				}
				if (result.length != 1)
					return resolve('Invalid warn id for that member');

				bot.con.query(
					`DELETE FROM warnings WHERE id = '${WarnID}'`,
					function (err, result, fields) {
						if (err) {
							console.log(err);
							return reject('Unable to delete warning.');
						}
						return resolve('Deleted warning');
					}
				);

				resolve('Deleted warning');
			}
		);
	});
};

module.exports.help = {
	name: 'warndelete',
	aliases: ['wd'],
	usage: '<member>',
	description: 'Delete a warn from an employee',
	args: [
		{
			name: 'id',
			description: 'Delete a warn from an employee using their id',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'Their in game id or discord id',
					type: 4,
					required: true,
					parse: (bot, message, args) => {
						if (message.mentions.members.first())
							args[0] = message.mentions.members.first().id;
						return args[0];
					},
				},
				{
					name: 'warnid',
					description: 'The id of the warn',
					type: 4,
					required: true,
					parse: (bot, message, args) => {
						return args[1];
					},
				},
			],
		},
		{
			name: 'discord',
			description: 'Delete a warn from an employee using their discord',
			type: 1,
			options: [
				{
					name: 'member',
					description: 'the other discord user',
					type: 6,
					required: true,
					parse: (bot, message, args) => {
						if (message.mentions.members.first())
							args[0] = message.mentions.members.first().id;
						return args[0];
					},
				},
				{
					name: 'warnid',
					description: 'The id of the warn',
					type: 4,
					required: true,
					parse: (bot, message, args) => {
						return args[1];
					},
				},
			],
		},
	],
	permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
	slash: true,
};
