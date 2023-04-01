const botconfig = require('../botconfig.json');
const request = require('request');
const Discord = require('discord.js');

function toTimeFormat(ms_num) {
	var sec_num = ms_num / 1000;
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - hours * 3600) / 60);
	var seconds = sec_num - hours * 3600 - minutes * 60;

	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	seconds = Math.round(seconds);
	return hours + 'h ' + minutes + 'm ' + seconds + 's';
}

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		let ServerPoints = []; //Keeps double xp status in each server

		checkServer(0); //Check server 1

		function checkServer(index) {
			function addServerPoint(CurrentServerPoints) {
				ServerPoints.push([
					CurrentServerPoints,
					botconfig.ActiveServers[index].name,
				]);
			}

			if (index < botconfig.ActiveServers.length - 1) {
				//if its not the last server
				setTimeout(() => {
					checkServer(index + 1); //check next one after 500 ms
				}, 500);
			} else {
				//last one
				setTimeout(() => {
					//after 1000 ms
					let PlayersEmbed = new Discord.MessageEmbed()
						.setColor('RANDOM')
						.setTitle('Double EXP');

					for (let i = 0; i < ServerPoints.length; i++) {
						//go through all of them
						PlayersEmbed.addField(
							`Server ${ServerPoints[i][1]}`,
							`${ServerPoints[i][0]}`,
							true
						); //Adds the server
					}
					return resolve(PlayersEmbed); //send array
				}, 1000);
			}

			request(
				`http://${botconfig.ActiveServers[index].api}/widget/players.json`,
				{ json: true },
				function (error, response, body) {
					//url to get all players
					if (error || !body) {
						//server is offline
						// console.log(error)
						addServerPoint('OFFLINE');
						return;
					}

					if (!body.server.dxp[0]) {
						addServerPoint('No');
					} else {
						addServerPoint(
							`**${toTimeFormat(body.server.dxp[2] + body.server.dxp[3])}**`
						);
					}
				}
			);
		}
	});
};

module.exports.help = {
	name: 'dxp',
	aliases: [],
	usage: '',
	description: 'Get servers with double XP',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
	],
	slash: true,
	slow: true,
};
