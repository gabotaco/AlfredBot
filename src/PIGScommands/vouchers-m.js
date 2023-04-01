const Discord = require('discord.js');
const fs = require('fs');
const functions = require('../util/functions.js');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const templateCache = [];
const HTMLPath = './pigsVouchers.html';
const botconfig = require('../botconfig');

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		let ID = args.id || args.member;

		const SearchColumn = functions.GetSearchColumn(ID);

		const MemberDetails = await functions.GetMemberDetails(
			bot.con,
			SearchColumn,
			ID
		); //Get their member details
		if (!MemberDetails) return resolve("You aren't hired"); //Not hired

		const InGameName = MemberDetails.in_game_name;
		const InGameID = MemberDetails.in_game_id;

		const TotalVouchers = functions.numberWithCommas(
			MemberDetails.pigs_total_vouchers
		);
		if (MemberDetails.pigs_total_vouchers < 6000) {
			var Rank = 'Hustler';
			var RequiredVouchers = 6000 - MemberDetails.pigs_total_vouchers;
			var NextRank = 'Pickpocket';
			var RankVouchers = 6000;
			var CurrentVouchers = MemberDetails.pigs_total_vouchers;

			var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);
		} else if (MemberDetails.pigs_total_vouchers < 18000) {
			var Rank = 'PickPocket';
			var RequiredVouchers = 18000 - MemberDetails.pigs_total_vouchers;

			var NextRank = 'Thief';
			var RankVouchers = 12000;
			var CurrentVouchers = MemberDetails.pigs_total_vouchers - 6000;

			var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);
		} else if (MemberDetails.pigs_total_vouchers < 38000) {
			var Rank = 'Thief';
			var RequiredVouchers = 38000 - MemberDetails.pigs_total_vouchers;

			var NextRank = 'Lawless';
			var RankVouchers = 20000;
			var CurrentVouchers = MemberDetails.pigs_total_vouchers - 18000;

			var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);
		} else if (MemberDetails.pigs_total_vouchers < 68000) {
			var Rank = 'Lawless';
			var RequiredVouchers = 68000 - MemberDetails.pigs_total_vouchers;
			var NextRank = 'Criminal Mastermind';
			var RankVouchers = 30000;
			var CurrentVouchers = MemberDetails.pigs_total_vouchers - 38000;

			var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);
		} else if (MemberDetails.pigs_total_vouchers < 150000) {
			var Rank = 'Mastermind';
			var RequiredVouchers = 150000 - MemberDetails.pigs_total_vouchers;
			var NextRank = 'Overlord';
			var RankVouchers = 82000;
			var CurrentVouchers = MemberDetails.pigs_total_vouchers - 68000;

			var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);
		} else if (MemberDetails.pigs_total_vouchers < 1500000) {
			var Rank = 'Overlord';
			var RequiredVouchers = 1500000 - MemberDetails.pigs_total_vouchers;
			var NextRank = 'Swine';
			var RankVouchers = 1350000;
			var CurrentVouchers = MemberDetails.pigs_total_vouchers - 150000;

			var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);
		} else {
			var Rank = 'Swine';
			var CurrentVouchers = MemberDetails.pigs_total_vouchers - 1500000;
			var VoucherTextThing = 'vouchers in Swine';
			var RequiredVouchers = functions.numberWithCommas(CurrentVouchers);
			var Progress = 100;
		}

		RequiredVouchers = functions.numberWithCommas(RequiredVouchers);

		if (MemberDetails.company == 'fired') {
			var Deadline = 'Non-Employee';
		} else {
			var Deadline =
				'Deadline: ' + new Date(MemberDetails.deadline).toDateString();
		}

		let CompanyRank;
		bot.con.query(
			`SELECT * FROM members me, pigs p WHERE me.id = p.member_id`,
			async function (err, result, fields) {
				//get all data for member and link member with pigs data
				if (err) {
					console.log(err);
					return reject('Unable to get members and company');
				}
				var Ranking = [];

				result.forEach(member => {
					Ranking.push([member.vouchers, member.in_game_name]);
				});

				Ranking.sort(sortFunction); //Sort it from highest to least
				function sortFunction(a, b) {
					if (a[0] == b[0]) {
						return 0;
					} else {
						return a[0] > b[0] ? -1 : 1;
					}
				}

				Ranking.forEach(element => {
					// Go through all ranks
					if (element[1] == InGameName && !CompanyRank) {
						//If the member doesn't have a company rank yet and it finds their rank
						CompanyRank = Ranking.indexOf(element) + 1; //set their rank to the index of it plus 1
					}
				});

				let HTMLTemplate = templateCache[HTMLPath]; // try to load from memory cache

				// read html file from disk and save to memory cache
				if (!HTMLTemplate) {
					htmlSource = fs.readFileSync(HTMLPath, 'utf8'); // read html from source file
					templateCache[HTMLPath] = Handlebars.compile(htmlSource);
					HTMLTemplate = templateCache[HTMLPath];
				}

				const data = {
					name: InGameName,
					tycoonId: '#' + InGameID,
					vouchersLeft: RequiredVouchers,
					currentRank: Rank,
					nextRank: NextRank,
					progress: Progress,
					leaderboardsRank: CompanyRank,
					deadline: Deadline,
					VoucherText: VoucherTextThing || 'vouchers to next promotion',
					TotalVouchers: TotalVouchers,
				};

				// render html file with data, for example - will replace {{name}} with name value
				const HTMLContent = HTMLTemplate(data);

				// browser object - render html with chromium
				const browser = await puppeteer.launch({
					args: ['--no-sandbox'],
				});
				const page = await browser.newPage();

				// replace html
				await page.setContent(HTMLContent);

				// take a screenshot of div with id of "content"
				const inputElement = await page.$('#content');
				const image = await inputElement.screenshot();

				// send image reply to discord channel
				const localFileAttachment = new Discord.MessageAttachment(image);
				if (args.slash) {
					bot.guilds.cache
						.get(args.guild_id)
						.channels.cache.get(args.channel_id)
						.send(localFileAttachment);
					resolve('You should see their vouchers below :)');
				} else {
					resolve({ message: '', messageOptions: localFileAttachment });
				}

				await browser.close();
			}
		);
	});
};

module.exports.help = {
	name: 'vouchers-m',
	aliases: ['voucher-m', 'vouch-m', 'rank-m', 'progress-m'],
	usage: '<other member>',
	description: 'Check another employees voucher status',
	args: [
		{
			name: 'id',
			description: 'Get a persons vouchers using their ID',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'Their in game id or discord id',
					type: 4,
					required: true,
					parse: (bot, message, args) => {
						return args[0];
					},
				},
			],
		},
		{
			name: 'discord',
			description: 'Get a persons vouchers using their discord',
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
	slow: false,
	hidden: true,
};
