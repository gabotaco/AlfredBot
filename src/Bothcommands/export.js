const botconfig = require('../botconfig.json'); //handy info
const { google } = require('googleapis'); //allows you to use googles api
const authentication = require('../util/authentication'); //Imports functions from authentication file

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		authentication.authenticate().then(async auth => {
			bot.con.query(
				`SELECT me.company, me.in_game_name, me.in_game_id, p.vouchers as pigs_total_vouchers, p.worth as pigs_total_money, r.vouchers as rts_total_vouchers, r.worth as rts_total_money, me.deadline FROM members me, rts r, pigs p WHERE me.id = p.member_id AND me.id = r.member_id`,
				function (err, result, fields) {
					//get everything from all tables
					if (err) {
						console.log(err);
						return reject("Couldn't get all employees");
					}

					let HiredValues = []; //store hired people
					let FiredValues = []; //store fired people

					result.forEach(member => {
						//go through all members
						if (member.company == 'fired') {
							FiredValues.push([
								member.in_game_name,
								member.in_game_id,
								member.pigs_total_vouchers,
								member.pigs_total_money,
								member.rts_total_vouchers,
								member.rts_total_money,
								new Date(member.deadline).toDateString(),
							]); //if fired add to array to add to spreadsheet later
						} else {
							HiredValues.push([
								member.in_game_name,
								member.in_game_id,
								member.company,
								member.rts_total_vouchers,
								member.rts_total_money,
								member.pigs_total_vouchers,
								member.pigs_total_money,
								new Date(member.deadline).toDateString(),
							]); //hired add their data to array to be added to spreadsheet later
						}
					});

					const sheets = google.sheets({
						//specify sheets
						version: 'v4',
						auth,
					});

					sheets.spreadsheets.values.batchClear(
						{
							//clear the range
							auth: auth,
							spreadsheetId: process.env.RC_SHEET,
							resource: {
								ranges: [[`B5:I244`], [`L5:R733`]],
							},
						},
						function (err, response) {
							//done
							if (err) {
								console.log(err);
								return reject("Couldn't clear the google sheet.");
							}
							sheets.spreadsheets.values.append(
								{
									//append all the hired people
									auth: auth,
									spreadsheetId: process.env.RC_SHEET,
									range: 'B5:I244',
									valueInputOption: 'RAW',
									insertDataOption: 'OVERWRITE',
									includeValuesInResponse: false,
									resource: {
										majorDimension: 'ROWS',
										values: HiredValues,
									},
								},
								function (err, response) {
									if (err) {
										console.log(err);
										return reject("Couldn't add hired member data");
									}

									sheets.spreadsheets.values.append(
										{
											//append all the fired people
											auth: auth,
											spreadsheetId: process.env.RC_SHEET,
											range: 'L5:R733',
											valueInputOption: 'RAW',
											insertDataOption: 'OVERWRITE',
											includeValuesInResponse: false,
											resource: {
												majorDimension: 'ROWS',
												values: FiredValues,
											},
										},
										function (err, response) {
											if (err) {
												console.log(err);
												return reject(
													"Couldn't add fired member data BUT did add hired member data."
												);
											}
											return resolve('Updated company sheet.');
										}
									);
								}
							);
						}
					);
				}
			);
		});
	});
};

module.exports.help = {
	name: 'export',
	aliases: ['exp'],
	usage: '',
	description: 'Update the company sheet with current DB data.',
	args: [],
	permission: [...botconfig.OWNERS],
	slash: true,
	slow: true,
};
