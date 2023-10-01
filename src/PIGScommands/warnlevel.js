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
		if (!MemberData) return resolve('Unable to find that user');

		bot.con.query(
			`SELECT id, reason FROM warnings WHERE member_id = '${MemberData.id}'`,
			function (err, result, fields) {
				//get the warning number for the member
				if (err) {
					console.log(err);
					return reject('Unable to get warnings table.');
				}
				if (result.length == 0) return resolve('No warnings'); //no warnings

				const embed = new Discord.MessageEmbed()
					.setTitle('Warnings')
					.setColor('#ff0000')
					.setDescription(`You have ${result.length} warnings:`);

				for (let i = 0; i < result.length; i++) {
					embed.addField(`Warning ID: ${result[i].id}`, result[i].reason);
				}

				return resolve(embed);
			}
		);
	});
};

module.exports.help = {
	name: 'warnlevel',
	aliases: ['wl'],
	usage: '',
	description: 'Check how many warns you have',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
};
