const Discord = require('discord.js');
const fs = require('fs');
const functions = require('../util/functions.js');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const templateCache = [];
const HTMLPath = './html/rtsVouchers.html';
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
			MemberDetails.rts_total_vouchers
		);

		let Rank = '';
		let RequiredVouchers = 0;
		let NextRank = '';
		let RankVouchers = 0;
		let CurrentVouchers = 0;
		let Progress = 0;

		if (MemberDetails.rts_total_vouchers < 9600) {
			NextRank = 'Lead Foot';
			RankVouchers = 9600;
			CurrentVouchers = MemberDetails.rts_total_vouchers;
			Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);

			Rank = 'Initiate';
			RequiredVouchers = 9600 - MemberDetails.rts_total_vouchers;
		} else if (MemberDetails.rts_total_vouchers < 24000) {
			NextRank = 'Wheelman';
			RankVouchers = 14400;
			CurrentVouchers = MemberDetails.rts_total_vouchers - 9600;
			Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);

			Rank = 'Lead Foot';
			RequiredVouchers = 24000 - MemberDetails.rts_total_vouchers;
		} else if (MemberDetails.rts_total_vouchers < 52800) {
			NextRank = 'Legendary Wheelman';
			RankVouchers = 28800;
			CurrentVouchers = MemberDetails.rts_total_vouchers - 24000;
			Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);

			Rank = 'Wheelman';
			RequiredVouchers = 52800 - MemberDetails.rts_total_vouchers;
		} else if (MemberDetails.rts_total_vouchers < 117600) {
			NextRank = 'Speed Demon';
			RankVouchers = 64800;
			CurrentVouchers = MemberDetails.rts_total_vouchers - 52800;
			Progress = Math.floor((CurrentVouchers / RankVouchers) * 100);

			Rank = 'Legendary Wheelman';
			RequiredVouchers = 117600 - MemberDetails.rts_total_vouchers;
		} else {
			CurrentVouchers = MemberDetails.rts_total_vouchers - 117600;
			Progress = 100;
			RequiredVouchers = CurrentVouchers;
			VoucherTextThing = 'vouchers in Speed Demon';

			Rank = 'Speed Demon';
			RequiredVouchers = 'Max';
		}

		RequiredVouchers = functions.numberWithCommas(RequiredVouchers);

		let Deadline = '';
		if (MemberDetails.company == 'fired') {
			Deadline = 'Non-Employee';
		} else {
			Deadline = 'Deadline: ' + new Date(MemberDetails.deadline).toDateString();
		}

		bot.con.query(
			`SELECT * FROM members me, rts r WHERE me.id = r.member_id`,
			async function (err, result, fields) {
				let CompanyRank;
				if (err) {
					console.log(err);
					return reject('Unable to get members and company');
				}
				let Ranking = [];
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
	name: 'voucher-m',
	aliases: ['vouchers-m', 'vouch-m', 'rank-m', 'progress-m'],
	usage: '<other member>',
	description: 'Check voucher status',
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
