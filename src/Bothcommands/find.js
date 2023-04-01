const botconfig = require('../botconfig.json');
const request = require('request');
const functions = require('../util/functions.js');
const Discord = require('discord.js');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		if (args.sub_command == 'manager') {
			const Managers = {};
			bot.con.query(
				`SELECT me.in_game_id, me.company FROM members me, managers ma WHERE me.id = ma.member_id AND ma.active = '1'`,
				function (err, result, fields) {
					if (err) {
						console.log(err);
						return reject('Unable to get active managers');
					}
					result.forEach(manager => {
						Managers[manager.in_game_id.toString()] = manager.company;
					});
					const ActiveManagerEmbed = new Discord.MessageEmbed()
						.setColor('random')
						.setTitle('Active Managers');
					checkServer(0);

					function checkServer(index) {
						//Find people heisting in server
						if (index >= botconfig.ActiveServers.length)
							return resolve(ActiveManagerEmbed);

						request(
							`http://${botconfig.ActiveServers[index].api}/widget/players.json`,
							{
								timeout: 1500,
								json: true,
							},
							function (error, response, body) {
								//url to get all players
								if (error || !body) {
									//server is offline
									checkServer(index + 1); //check next one
									return;
								}
								body.players.forEach(player => {
									//loop through all players
									if (Object.keys(Managers).includes(player[2].toString())) {
										ActiveManagerEmbed.addField(
											`${player[0]} (${Managers[
												player[2].toString()
											].toUpperCase()})`,
											`Server ${botconfig.ActiveServers[index].name}`,
											true
										);
									}
								});
								setTimeout(() => {
									checkServer(index + 1); //check next one
								}, 500);
							}
						);
					}
				}
			);
		} else {
			const SearchColumn = functions.GetSearchColumn(args.id || args.member);
			let InGameId = args.id;
			bot.con.query(
				`SELECT (in_game_id) FROM members WHERE ${SearchColumn} = '${
					args.id || args.member
				}'`,
				function (err, result, fields) {
					//get all members
					if (err) {
						console.log(err);
						return reject('Unable to get all company members.');
					}
					if (result.length == 0 && SearchColumn == 'discord_id') {
						tryGetInGame(0);

						function tryGetInGame(index) {
							if (index >= botconfig.ActiveServers.length)
								return resolve('Unable to get the in game id for that user');
							request(
								`https://${botconfig.ActiveServers[index].api}/snowflake2user/${
									args.member || args.id
								}`,
								{
									headers: {
										'X-Tycoon-Key': process.env.TYCOON_KEY,
									},
								},
								function (err, response, html) {
									if (err) {
										tryGetInGame(index + 1);
										return;
									}

									try {
										var response = JSON.parse(
											new DOMParser()
												.parseFromString(html, 'text/html')
												.body.innerHTML.replace(/<\/?[^>]+>/gi, '')
										);
									} catch (e) {}

									if (!response || response.code == '408') {
										tryGetInGame(index + 1);
										return;
									}

									if (response.user_id) {
										InGameId = response.user_id;
										checkServer(0);
									} else {
										return resolve(
											'That user does not have their discord linked.'
										);
									}
								}
							);
						}
					} else if (result.length > 0) {
						InGameId = result[0].in_game_id;
						checkServer(0); //Check server 1
					} else {
						checkServer(0); //Check server 1
					}
				}
			);

			const foundPlayers = [];

			function checkServer(index) {
				//Find people heisting in server
				if (index >= botconfig.ActiveServers.length) {
					if (foundPlayers.length == 0) {
						return resolve("Couldn't find that player online.");
					}
					return resolve(foundPlayers);
				}

				request(
					`https://${botconfig.ActiveServers[index].api}/widget/players.json`,
					{
						timeout: 1500,
						json: true,
					},
					function (error, response, body) {
						//url to get all players
						if (error || !body) {
							//server is offline
							checkServer(index + 1); //check next one
							return;
						}

						body.players.forEach(player => {
							//loop through all players
							if (
								InGameId == player[2] ||
								player[0].toLowerCase().includes(args.name.toLowerCase())
							) {
								foundPlayers.push(
									`Player ${player[0]} (${player[2]}) is online on server ${botconfig.ActiveServers[index].name}`
								);
							}
						});
						setTimeout(() => {
							checkServer(index + 1); //check next one
						}, 500);
					}
				);
			}
		}
	});
};

module.exports.help = {
	name: 'find',
	aliases: [],
	usage: '<in game id | Discord>',
	description: 'Find what server a player is on.',
	args: [
		{
			name: 'id',
			description: 'Find a player using their id',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'Their in game id or discord id',
					type: 4,
					required: true,
					missing: 'Please specify another player',
					parse: (bot, message, args) => {
						if (message.mentions.members.first())
							args[0] = message.mentions.members.first().id;
						return args[0];
					},
				},
			],
		},
		{
			name: 'name',
			description: 'Find a player using their name',
			type: 1,
			options: [
				{
					name: 'name',
					description: 'Their in game name',
					type: 3,
					required: true,
					missing: 'Please specify another player',
					parse: (bot, message, args) => {
						return args[0];
					},
				},
			],
		},
		{
			name: 'discord',
			description: 'Find a player using their discord',
			type: 1,
			options: [
				{
					name: 'member',
					description: 'the other discord user',
					type: 6,
					required: true,
					missing: 'Please specify another player',
					parse: (bot, message, args) => {
						if (message.mentions.members.first())
							args[0] = message.mentions.members.first().id;
						return args[0];
					},
				},
			],
		},
		{
			name: 'manager',
			description: 'Find all managers currently online.',
			type: 1,
			options: [],
			parse: (bot, message, args) => {
				if (!args[0]) return null;
				return args[0].toLowerCase().startsWith('manager') ? 'manager' : null;
			},
		},
	],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
	slow: true,
};
