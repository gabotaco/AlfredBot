const botconfig = require('../botconfig.json');
const { google } = require('googleapis'); //allows you to use googles api
const Discord = require('discord.js');

module.exports = {
	/**
	 * @summary Takes a string and converts it to a number even if it has commas or dollar signs
	 * @param {String} number The string you want to turn into an int
	 * @returns {Number} Converted number
	 */
	ConvertNumber: function (number) {
		if (typeof number === 'number') return number;
		if (!number) number = '0'; //if its null then set to "0"

		if (number.includes(',')) {
			//if it has a comma
			number = number.replace(/,/g, ''); //replace all commas with nothing
		}

		if (number.includes('$')) {
			//if it has a dollar sign
			number = number.replace(/\$/g, ''); //replace all dollar signs with nothing
		}

		number = parseInt(number); //Parse the string into a Number

		return number;
	},

	/**
	 * @summary Gets the search column
	 * @param {String} id ID of the user
	 * @returns {String} Search Column
	 */
	GetSearchColumn: function (id) {
		if (id.length > 6) {
			//if the ID is longer than 6 characters
			return 'discord_id'; //it's a discord id
		} else {
			//otherwise
			return 'in_game_id'; //it's an in game id
		}
	},

	/**
	 * @summary Changes the deadline for a member
	 * @param {} con The query connection
	 * @param {String} Deadline New deadline for the user
	 * @param {String} column The column with the ID
	 * @param {String} ID The ID of the user
	 */
	ChangeDeadline: function (con, Deadline, column, id) {
		return new Promise((resolve, reject) => {
			con.query(
				`UPDATE members SET deadline = '${Deadline}' WHERE ${column}='${id}'`,
				function (err, result, fields) {
					//set the deadline to specified deadline for the member
					if (err) {
						console.log(err);
						return reject('There was an error updating the database.');
					} else if (result.affectedRows == 0)
						return resolve('Unable to find that employee.'); //not found member
					else {
						//found
						return resolve(`Set deadline to ${Deadline} for user ${id}`);
					}
				}
			);
		});
	},

	/**
	 * @summary Gets the server IP and port number when a user types in a server number
	 * @param {String} ServerNumber Specified server number
	 * @returns {[String, Number]} [Server IP, Last server Port number]
	 */
	GetServerURL: function (ServerNumber) {
		if (
			!ServerNumber ||
			(ServerNumber.toLowerCase() != 'a' &&
				ServerNumber.toLowerCase() != 'os' &&
				(isNaN(parseInt(ServerNumber)) || ServerNumber < 1 || ServerNumber > 9))
		)
			return null;

		let server = parseInt(ServerNumber); //convert the string to an int

		if (ServerNumber.toLowerCase() == 'a') {
			//if the server number is A
			return 'tycoon-wxjpge.users.cfx.re';
		} else if (server == 1 || ServerNumber.toLowerCase() == 'os') {
			return 'tycoon-w8r4q4.users.cfx.re';
		} else if (server == 2) {
			return 'tycoon-2epova.users.cfx.re';
		} else if (server == 3) {
			return 'tycoon-2epovd.users.cfx.re';
		} else if (server == 4) {
			return 'tycoon-wdrypd.users.cfx.re';
		} else if (server == 5) {
			return 'tycoon-njyvop.users.cfx.re';
		} else if (server == 6) {
			return 'tycoon-2r4588.users.cfx.re';
		} else if (server == 7) {
			return 'tycoon-npl5oy.users.cfx.re';
		} else if (server == 8) {
			return 'tycoon-2vzlde.users.cfx.re';
		} else if (server == 9) {
			return 'tycoon-wmapod.users.cfx.re';
		} else {
			return null;
		}
	},

	/**
	 * @summary Takes all the number of players on each server and makes it into a message. technically they are already sorted
	 * @param {[[String,String]]} PlayersArray [[Num of players, server port]]
	 * @returns {String} Sentence about how many players are on
	 */
	SortPlayersOnServers: function (PlayersArray) {
		let PlayersEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Players');

		for (let i = 0; i < PlayersArray.length; i++) {
			//go through all of them
			PlayersEmbed.addField(
				`Server ${PlayersArray[i][1]}`,
				`${PlayersArray[i][0]} ${
					PlayersArray[i][0] == '1' ? 'player' : 'players'
				}`,
				true
			); //Adds the server
		}

		return PlayersEmbed;
	},
	/**
	 * @callback RowCallback
	 * @param {Array<String>} row The row
	 */

	/**
	 * @summary Loop through all rows in range and run a function
	 * @param {OAuth2Client} auth Google auth
	 * @param {String} SpreadsheetID The spreadsheet
	 * @param {String} Range Range
	 * @param {Discord.GuildChannel} channel The channel
	 * @param {RowCallback} callback What to do for each row
	 */
	ProcessAllInRange: function (auth, SpreadsheetID, Range, channel, callback) {
		return new Promise(resolve => {
			const sheets = google.sheets({
				version: 'v4',
				auth,
			});

			sheets.spreadsheets.values.get(
				{
					//get spreadsheet range
					spreadsheetId: SpreadsheetID,
					range: Range,
				},
				async (err, res) => {
					if (err) {
						channel.send(`The API returned an ${err}`);
						return;
					}

					const rows = res.data.values;
					if (rows.length) {
						rows.map(async row => {
							//for each row in rows run the callback function with the row
							await callback(row);
						});
						resolve();
					}
				}
			);
		});
	},

	/**
	 * @summary Gets the details for the member with the ID in the search column
	 * @param {} con Database connection
	 * @param {String} Column discord iD or in game id
	 * @param {String} ID the id
	 * @returns {Array<String>} All their info
	 */
	GetMemberDetails: function (con, Column, ID) {
		return new Promise(resolve => {
			con.query(
				`SELECT me.*, r.vouchers as rts_total_vouchers, r.worth as rts_total_worth, p.vouchers as pigs_total_vouchers, p.worth as pigs_total_worth FROM members me, rts r, pigs p WHERE me.${Column} = '${ID}' AND me.id = p.member_id AND me.id = r.member_id`,
				function (err, result, fields) {
					//get all their info into one array
					if (err) return console.log(err);
					resolve(result[0]); //return first found member
				}
			);
		});
	},

	/**
	 * @callback ApplicantCallback
	 * @param {Array<String>} row Row with all applicant data
	 * @param {Number} rowIndex Row number in the appsheet
	 */
	/**
	 * @summary Finds all the info about an applicant
	 * @param {OAuth2Client} auth Sheets
	 * @param {Discord.GuildChannel} channel Discord channel
	 * @param {String} ID Member ID
	 * @param {Number} SearchColumn Column with the ID
	 * @param {Number} CompanyIndex Index of the sign me up column
	 * @param {ApplicantCallback} callback What to run when finding member
	 */
	FindApplicant: function (
		auth,
		channel,
		ID,
		SearchColumn,
		CompanyIndex,
		callback
	) {
		return new Promise(resolve => {
			const sheets = google.sheets({
				version: 'v4',
				auth,
			});

			sheets.spreadsheets.values.get(
				{
					//get range
					spreadsheetId: process.env.APPLICATIONS_SHEET,
					range: botconfig.ApplicationRange,
				},
				(err, res) => {
					if (err) return channel.send(`The API returned an ${err}`);

					const rows = res.data.values;
					if (rows.length) {
						rows.map(async row => {
							if (ID == '') {
								//If they don't specify an ID
								if (
									(row[SearchColumn] == 'Under review' ||
										row[SearchColumn] == '') &&
									row[CompanyIndex] == 'Sign me up!'
								) {
									//If their status is Under review or no status and the applicant applied for the company
									await callback(
										row,
										rows.indexOf(row) + botconfig.ApplicationStartingRow
									);
								}
							} else {
								if (
									row[SearchColumn].startsWith(ID) &&
									row[CompanyIndex] == 'Sign me up!'
								) {
									//If its the right applicant for the right company
									await callback(
										row,
										rows.indexOf(row) + botconfig.ApplicationStartingRow
									);
								}
							}
						});
						resolve();
					}
				}
			);
		});
	},

	/**
	 * @summary Updates the status of an applicant
	 * @param {import("mysql").Connection} con Con
	 * @param {String} ID The ID of the applicant
	 * @param {String} Status What to change their status too
	 */
	UpdateApplicantStatus: function (con, ID, Status, Reason = '') {
		return new Promise((resolve, reject) => {
			con.query(
				`UPDATE applications SET status = '${Status}', status_info = '${Reason}' WHERE id = '${ID}' OR in_game_id = '${ID}' OR discord_id = '${ID}'`,
				function (err, result, fields) {
					if (err) {
						console.log(err);
						return reject('There was an error updating the applicants status.');
					} else {
						return resolve(`Updated status to **${Status}**`);
					}
				}
			);
		});
	},

	/**
	 * @summary Gets the discord of an applicant
	 * @param {OAuth2Client} auth Sheets Auth
	 * @param {Discord.GuildChannel} channel Discord channel
	 * @param {String} ID Member ID
	 * @param {Number} SignMeUpIndex Index of Sign Me Up! in application sheet
	 * @returns {String} Either discord ID or the string they typed in application if not found
	 */
	GetDiscordFromID: async function (auth, channel, ID, SignMeUpIndex) {
		return new Promise(async resolve => {
			let Discord;
			await this.FindApplicant(
				auth,
				channel,
				ID,
				botconfig.ApplicationInGameIDIndex,
				SignMeUpIndex,
				async function (row) {
					//Find applicant
					return new Promise(res => {
						let Discriminator =
							row[botconfig.ApplicationDiscordIndex].split('#')[1]; //Gets the discrim number
						let Username = row[botconfig.ApplicationDiscordIndex]
							.split('#')[0]
							.replace(/\s/g, ''); //Gets the username without any spaces
						Discord = row[botconfig.ApplicationDiscordIndex]; //sets discord variable
						channel.guild.members.cache.forEach(element => {
							//search in server members
							if (
								element.user.discriminator == Discriminator &&
								element.user.username.replace(/\s/g, '').toLowerCase() ==
									Username.toLowerCase()
							) {
								//if the member discrim = app discrim and the username without spaces and lowercase = username lowercase
								resolve(element.id); //resolves with ID
							}
						});
						res();
					});
				}
			);
			resolve(Discord);
		});
	},

	/**
	 * @summary Replaces all pending payouts with clear so that it doesn't show up in .cashout
	 * @param {} con Database connection
	 * @param {String} ID Member ID
	 * @param {String} CompanyName Name of the company to cashout for
	 */
	PayManager: async function (con, ID, CompanyName) {
		return new Promise((resolve, reject) => {
			con.query(
				`UPDATE managers SET total_money = total_money + FLOOR(((${CompanyName}_cashout * 10000) - ${CompanyName}_cashout_worth) * 0.5) WHERE member_id = '${ID}'`,
				function (err, result, fields) {
					//add total money
					if (err) {
						console.log(err);
						return reject('Unable to update total money for the manager.');
					}
					con.query(
						`UPDATE managers SET ${CompanyName}_cashout = '0', ${CompanyName}_cashout_worth = '0' WHERE member_id = '${ID}'`,
						function (err, result, fields) {
							//reset to 0
							if (err) {
								console.log(err);
								return reject(
									'Unable to remove cashout BUT calculated new total money'
								);
							}
							if (result.affectedRows == 1) {
								//1 row
								resolve('Paid.');
							} else {
								//no row
								resolve("Couldn't find that manager");
							}
						}
					);
				}
			);
		});
	},

	/**
	 * @summary Returns the number but with handy commas
	 * @param {Number} num The big number
	 * @returns {String} Number with commas
	 */
	numberWithCommas: function (num) {
		if (!num) return '0';
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); //fancy regex
	},

	/**
     * @summary Gets the distance between two coords
     * @param {Number} x1 x1
     * @param {Number} y1 y1
     * @param {Number} x2 x2
     * @param {Number} y2 y2

     * @returns {Number} The distance between the two coords
     */
	distanceBetweenCoords: function (x1, y1, x2, y2) {
		//Get the distance between two x,y coords
		const differenceInX = x2 - x1; //difference in x
		const differenceInY = y2 - y1; //difference in y

		const whatToSqrt =
			differenceInX * differenceInX + differenceInY * differenceInY; //distance formula
		const answer = Math.sqrt(whatToSqrt); //sqrt it

		return answer;
	},

	GetInGameID: function (bot, DiscordID) {
		return new Promise(async resolve => {
			bot.con.query(
				`SELECT in_game_id FROM members WHERE discord_id = '${DiscordID}'`,
				function (err, result, fields) {
					if (err) resolve(console.log(err));
					else if (result.length < 1) resolve(undefined);
					else resolve(result[0].in_game_id);
				}
			);
		});
	},

	CheckForActive: function (bot, SearchColumn, ID) {
		return new Promise((resolve, reject) => {
			resolve();
		});
	},
};
