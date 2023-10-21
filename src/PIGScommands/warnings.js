const Discord = require('discord.js');
const botconfig = require('../botconfig');
const functions = require('../util/functions.js');
module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		const MemberData = await functions.GetMemberDetails(
			bot.con,
			'discord_id',
			args.author_id
		);

		if (!MemberData) return resolve('Unable to find your warnings');

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
							return resolve('You have no warnings'); //no warnings

						const embed = new Discord.MessageEmbed()
							.setTitle(
								`${MemberData.in_game_name}'s (${MemberData.in_game_id}) Warnings`
							)
							.setColor('#ff0000')

							.addFields({
								name: `${memberResult[0].warnings} warning${
									memberResult[0].warnings > 1 ? 's' : ''
								}:`,
								value: `You have ${memberResult[0].warnings} warnings before <t:1697670000>`,
							});

						for (let i = 0; i < result.length; i++) {
							embed.addFields({
								name: `Warning ID: ${result[i].id}`,
								value: `${result[i].reason} - ${result[i].createdAt}`,
							});
						}

						return resolve(embed);
					}
				);
			}
		);
	});
};

module.exports.help = {
	name: 'warnings',
	aliases: ['wg'],
	usage: '',
	description: 'Check how many warnings you have',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
};
