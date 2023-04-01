const authentication = require('../util/authentication');
const botconfig = require('../botconfig.json');
const functions = require('../util/functions.js');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		const ID = args.id || args.member;
		const SearchColumn = functions.GetSearchColumn(args.id || args.member);

		const LeaveReason = args.reason;

		bot.con.query(
			`SELECT * FROM applications WHERE ${SearchColumn} = '${ID}'`,
			function (err, result) {
				if (err) {
					console.log(err);
					reject('Unable to get applicants from DB.');
				} else {
					if (result.length > 0) {
						functions.UpdateApplicantStatus(
							bot.con,
							ID,
							`Rejected`,
							LeaveReason
						); //update status
						const user = bot.guilds.cache
							.get(args.guild_id)
							.members.cache.get(result[0].discord_id); //get server member
						if (user) {
							//if in server the message
							user
								.send(
									`Hello,

This message is in regards to your recent application to RC. We'd like to thank you for your interest in our company and what we do.
                          
Here at the Rockwell Corporation, we strive to maintain a tight-knit community of helpful, happy, and active members. As such, we perform background checks with Transport Tycoon staff and check for everything from player reports, to kicks and bans, as well as general attitude, communication skills, and overall state of activity. 
                          
In the case of your candidacy, this background check has raised a red flag to our management team and, as a result, your application has been rejected. If you feel this decision has been made in error, you may appeal by @mentioning Rock in <#560917748184776736> channel of the company's Discord.
                          
Once again, thank you for your interest; we wish you the best of luck in your future endeavors. Reason for fire: '${LeaveReason}'`
								)
								.then(msg => {
									resolve('Marked as rejected an notified.');
								});
						} else {
							resolve('Marked as rejected.');
						}
					} else {
						resolve("Couldn't find that applicant");
					}
				}
			}
		);
	});
};

module.exports.help = {
	name: 'rejected',
	aliases: [],
	usage: '<in game id | discord> <reason>',
	description: 'Mark an applicant as rejected',
	args: [
		{
			name: 'id',
			description: 'Reject an applicant using their ID',
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

				{
					name: 'reason',
					description: 'Why they are getting rejected.',
					type: 3,
					required: true,
					missing: 'Please specify a reason',
					parse: (bot, message, args) => {
						return args.join(' ').slice(args[0].length + 1);
					},
				},
			],
		},
		{
			name: 'discord',
			description: 'Reject a person using their discord',
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
				{
					name: 'reason',
					description: 'Why they are getting rejected.',
					type: 3,
					required: true,
					missing: 'Please specify a reason',
					parse: (bot, message, args) => {
						return args.join(' ').slice(args[0].length + 1);
					},
				},
			],
		},
	],
	permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
	slash: true,
};
