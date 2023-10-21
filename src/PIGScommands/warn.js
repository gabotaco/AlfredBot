const Discord = require('discord.js');
const functions = require('../util/functions.js');
const botconfig = require('../botconfig');
const date_diff_indays = function (date1, date2) {
	//gets the difference in days between 2 dates
	dt1 = new Date(date1);
	dt2 = new Date(date2);
	return Math.floor(
		(Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
			Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
			(1000 * 60 * 60 * 24)
	);
};

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		const ID = args.id || args.member;
		const SearchColumn = functions.GetSearchColumn(ID);

		const MemberData = await functions.GetMemberDetails(
			bot.con,
			SearchColumn,
			ID
		); //Get member details
		if (!MemberData) return resolve('Unable to find that applicant');

		const DiscordID = MemberData.discord_id;
		const Deadline = MemberData.deadline;
		const InGameName = MemberData.in_game_name;
		const Reason = args.reason;
		let warns = MemberData.warnings;

		warns++; //increase warns by 1
		const manager = bot.guilds.cache
			.get(args.guild_id)
			.members.cache.get(args.author_id).user;

		console.log(warns, Reason);

		let WarnEmbed = new Discord.MessageEmbed() //make embed
			.setDescription('Warned')
			.setAuthor({ name: manager.username, iconURL: manager.avatarURL() })
			.setColor('RANDOM')
			.addFields([
				{ name: 'Warned User', value: `<@${DiscordID}>` },
				{ name: 'Number of Warnings', value: warns.toString() },
				{ name: 'Reason', value: Reason },
			]);

		const WarnChannel = bot.channels.cache.get(botconfig.PIGSWarnChannel);

		WarnChannel.send({ embeds: [WarnEmbed] }); //send embed

		const DeadlineDate = new Date(Deadline);

		const HalfDate = Math.floor(date_diff_indays(Date.now(), DeadlineDate) / 2); //Get the difference in days between now and half their deadline

		let DaysToRemove;
		if (HalfDate > 7) DaysToRemove = HalfDate;
		//If half the date is longer than a week then half their deadline
		else DaysToRemove = 7; //if half the date is shorter than a week then remove a week

		DeadlineDate.setDate(DeadlineDate.getDate() - DaysToRemove); //Set the deadline date to the new date

		const NewDeadline = DeadlineDate.toISOString()
			.slice(0, 19)
			.replace('T', ' ');

		functions.ChangeDeadline(bot.con, NewDeadline, SearchColumn, ID); //Change their deadline

		functions.CheckForActive(bot, SearchColumn, ID);

		const warned = bot.guilds.cache
			.get(args.guild_id)
			.members.cache.get(DiscordID); //get discord member and then inform if in discord
		if (warned)
			warned.send(
				`Hello ${InGameName}, It has come to our attention that you've broken a rule: ${Reason}\nAs a result, you've been issued a formal warning. Your voucher deadline has been reduced. \nMultiple warnings could lead to removal from the company.\nAlfred.`
			);

		bot.con.query(
			`UPDATE members SET warnings = '${warns}' WHERE ${SearchColumn} = '${ID}'`,
			function (err, fields, result) {
				//set warnings to add one
				if (err) {
					console.log(err);
					return reject('Unable to alter member warnings.');
				}

				bot.con.query(
					`INSERT INTO warnings (member_id, reason) VALUES ('${MemberData.id}', '${Reason}')`,
					function (err, fields, result) {
						//insert warning into database
						if (err) {
							console.log(err);
							return reject('Unable to insert warning.');
						}
						return resolve('Warned');
					}
				);
			}
		);
	});
};

module.exports.help = {
	name: 'warn',
	aliases: [],
	usage: '<person> <reason>',
	description: 'Warn a member',
	args: [
		{
			name: 'id',
			description: 'Warn an employee using their id',
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
				{
					name: 'reason',
					description: 'Why they are getting warned.',
					type: 3,
					required: true,
					missing: 'Please specify a reason',
					parse: (bot, message, args) => {
						return args.join(' ').slice(args[0].length);
					},
				},
			],
		},
		{
			name: 'discord',
			description: 'Warn an employee using their discord',
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
				{
					name: 'reason',
					description: 'Why they are getting warn.',
					type: 3,
					required: true,
					missing: 'Please specify a reason',
					parse: (bot, message, args) => {
						return args.join(' ').slice(args[0].length);
					},
				},
			],
		},
	],
	permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
	slash: true,
};
