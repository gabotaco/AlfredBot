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
		if (!MemberData) return resolve('Unable to find that applicant');

		bot.con.query(
			`SELECT id, reason FROM warnings WHERE member_id = '${MemberData.id}'`,
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

						if (
							result.length == 0 ||
							memberResult.length == 0 ||
							!memberResult[0].warnings
						)
							return resolve('No warnings'); //no warnings

						const embed = new Discord.MessageEmbed()
							.setTitle('Warnings')
							.setColor('#ff0000')
							.setDescription(
								`<@${MemberData.discord_id}> has ${memberResult[0].warnings} warnings:`
							);

						if (memberResult[0].warnings - result.length > 0)
							embed.setFooter(
								`<@${MemberData.discord_id}> has ${
									memberResult[0].warnings - result.length
								} warnings before 18/10/2023`
							);

						for (let i = 0; i < result.length; i++) {
							embed.addField(
								`Warning ID: ${result[i].id}`,
								`${result[i].reason} - ${result[i].createdAt}`
							);
						}

						return resolve(embed);
					}
				);
			}
		);
	});
};

module.exports.help = {
	name: 'warnlevel-m',
	aliases: ['wl-m'],
	usage: '<member>',
	description: 'Check how many warns an employee has',
	args: [
		{
			name: 'id',
			description: 'Get the warnlevels of an employee using their id',
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
			],
		},
		{
			name: 'discord',
			description: 'Get the warnlevels of an employee using their discord',
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
