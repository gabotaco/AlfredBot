const functions = require('../util/functions.js');
const Discord = require('discord.js');
const botconfig = require('../botconfig');
module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		const ID = args.id || args.member;
		const SearchColumn = functions.GetSearchColumn(ID);

		const MemberData = await functions.GetMemberDetails(
			bot.con,
			SearchColumn,
			ID
		);
		if (!MemberData) return resolve(`Unable to find that player: ${ID}`);

		bot.con.query(
			`SELECT id, reason, createdAt FROM warnings WHERE member_id = '${MemberData.id}'`,
			function (err, result, fields) {
				//get the warning number for the member
				if (err) {
					console.log(err);
					return reject('Unable to get warnings table.');
				}

				bot.con.query(
					`SELECT warnings FROM members WHERE id = '${MemberData.id}'`,
					function (err, memberResult, fields) {
						if (err) {
							console.log(err);
							return reject('Unable to get members table.');
						}

						if (memberResult[0].warnings == 0)
							return resolve(`${MemberData.in_game_name} has no warnings`);

						const embed = new Discord.MessageEmbed()
							.setTitle(
								`${MemberData.in_game_name}'s (${MemberData.in_game_id}) Warnings`
							)
							.setColor(memberResult[0].warnings * 0x00ff00)

							.addFields({
								name: `${memberResult[0].warnings} warning${
									memberResult[0].warnings > 1 ? 's' : ''
								}:`,
								value:
									memberResult[0].warnings - result.length > 0
										? `${MemberData.in_game_name} has ${
												memberResult[0].warnings - result.length
										  } warnings before <t:1697670000>`
										: '\u200b',
							});

						for (let i = 0; i < result.length; i++) {
							embed.addFields([
								{
									name: `Warning ID: ${result[i].id}`,
									value: `${result[i].reason} - ${result[i].createdAt}`,
								},
							]);
						}

						return resolve(embed);
					}
				);
			}
		);
	});
};

module.exports.help = {
	name: 'warnings-m',
	aliases: ['wg-m'],
	usage: '<member>',
	description: 'Check how many warnings a member has',
	args: [
		{
			name: 'id',
			description: "Get a member's warnlevel using their in game or discord id",
			type: 1,
			options: [
				{
					name: 'id',
					description: 'Their in game or discord id',
					type: 4,
					required: true,
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
			description: "Get a member's warnlevel using their discord",
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
			],
		},
	],
	permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
	slash: true,
};
