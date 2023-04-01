const Discord = require('discord.js');
const request = require('request');
const botconfig = require('../botconfig.json');
const functions = require('../util/functions.js');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		if (!args.server) {
			//If no args then search all servers
			let ServerPoints = [];

			function checkServer(index) {
				//Find people heisting in server
				if (index < botconfig.ActiveServers.length - 1) {
					//if its not the last server
					setTimeout(() => {
						checkServer(index + 1); //check next one after 200 ms
					}, 500);
				} else {
					//last one
					setTimeout(() => {
						resolve(functions.SortPlayersOnServers(ServerPoints));
					}, 1000);
				}

				request(
					`http://${botconfig.ActiveServers[index].api}/widget/players.json`,
					{ json: true },
					function (error, response, body) {
						//url to get all players
						if (error || !body) {
							//server is offline
							return;
						}

						let CurrentServerPoints = 0; //start at 0 people playing
						body.players.forEach(player => {
							if (player[5] == 'P.I.G.S. Robberrery') CurrentServerPoints++; //if theres someone with a pigs job increase points
						});

						ServerPoints.push([
							CurrentServerPoints,
							botconfig.ActiveServers[index].name,
						]);
					}
				);
			}

			checkServer(0); //Run recursive function starting at index 0
		} else {
			//specified server
			const Server = functions.GetServerURL(args.server);
			if (!Server)
				return resolve('Invalid server. [1 or OS, 2, 3, 4, 5, 6, 7, 8, 9, A]');

			request(
				`http://${Server}/status/map/positions.json`,
				{ headers: { 'X-Tycoon-Key': process.env.TYCOON_KEY }, json: true },
				function (error, response, body) {
					//get server ip and port
					if (error || !body) return resolve('Server is offline');

					let PlayersHeighsting = new Discord.MessageEmbed()
						.setTitle(`Players currently heisting on server ${args.server}`)
						.setColor('RANDOM');

					body.players.forEach(player => {
						//Go thorugh all players
						if (player[5].group == 'pigs_job') {
							//if pigs job
							PlayersHeighsting.addField(player[0], player[5].name, true); //add id and name
						}
					});

					if (PlayersHeighsting.fields[0]) {
						//if there is at least one person
						resolve(PlayersHeighsting);
					} else return resolve(`Nobody heisting on server ${args.server}.`); //if nobody
				}
			);
		}
	});
};

module.exports.help = {
	name: 'active',
	aliases: [],
	usage: '[server]',
	description:
		'Shows how many people are heisting on each (or specified) server',
	args: [
		{
			type: 3,
			name: 'server',
			description: 'The server number',
			required: false,
			parse: (bot, message, args) => {
				return args[0];
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
