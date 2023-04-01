const Discord = require('discord.js');
const botconfig = require('../botconfig.json');
const functions = require('../util/functions.js');

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		let CompanyName;
		if (args.guild_id == botconfig.PIGSServer) {
			CompanyName = 'pigs';
		} else if (args.guild_id == botconfig.RTSServer) {
			CompanyName = 'rts';
		}

		const MemberInfo = await functions.GetMemberDetails(
			bot.con,
			'discord_id',
			args.author_id
		); //get member info

		bot.con.query(
			`SELECT * FROM members me, ${CompanyName} c WHERE me.id = c.member_id`,
			function (err, result, fields) {
				//get all company members and link their vouchers with their in game name
				if (err) {
					console.log(err);
					return reject('Unable to get members and company vouchers.');
				}

				let vouchers = []; //track vouchers

				result.forEach(member => {
					//go through each member
					vouchers.push([member.vouchers, member.in_game_name]); //add their vouchers and name
				});

				vouchers.sort(sortFunction); //Sort it from highest to least
				function sortFunction(a, b) {
					if (a[0] == b[0]) {
						//same return 0
						return 0;
					} else {
						return a[0] > b[0] ? -1 : 1; //if a is more than b return -1 else return 1
					}
				}

				const top10 = new Discord.MessageEmbed()
					.setColor('RANDOM')
					.setTitle('__*Top 10 Voucher Handins*__')
					.setThumbnail(
						bot.guilds.cache
							.get(args.guild_id)
							.members.cache.get(args.author_id)
							.user.avatarURL()
					)
					.setFooter(
						`Your total vouchers: ${functions.numberWithCommas(
							MemberInfo.rts_total_vouchers + MemberInfo.pigs_total_vouchers
						)}`
					); //add total vouchers

				for (let i = 0; i < 10 && i < vouchers.length; i++) {
					//loop through first 10 items in array
					top10.addField(
						vouchers[i][1],
						functions.numberWithCommas(vouchers[i][0])
					);
				}

				return resolve(top10);
			}
		);
	});
};

module.exports.help = {
	name: 'top10',
	aliases: [],
	usage: '',
	description: 'Get the top 10 voucher turn ins',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
	],
	slash: true,
};
