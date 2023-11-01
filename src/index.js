let LastPerson = '439959655448313866'; //Last person to send a message to the one word story channel in PIGS discord
const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
const request = require('request');
const fs = require('fs');
const mysql = require('mysql');
const authentication = require('./util/authentication');
const slashCommands = require('./slash');
const { google } = require('googleapis'); //allows you to use googles api
const con = mysql.createConnection({
	//connect to database
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});
const express = require('express');
const app = express();

con.connect(function (err) {
	//perform connection
	if (err) throw err;
	console.log('Connected to SQL!');
});

const bot = new Discord.Client({
	partials: ['REACTION', 'MESSAGE'], //emit these events
	presence: {
		status: 'online',
		activity: {
			application: {
				id: '487059411001540618',
			},
			name: 'Transport Tycoon',
			type: 'PLAYING',
		},
	},
	shards: 'auto',
	messageCacheMaxSize: -1, //Infinite messages
	messageCacheLifetime: 86400, //1 day
	messageSweepInterval: 3600, //every hour
	messageEditHistoryMaxSize: 0, //don't hold past message edits
	fetchAllMembers: process.env.NODE_ENV == 'development' ? false : true, //fetch all members on startup
});

bot.con = con; //save connection to bot so i can access in commands

bot.RTSCommands = new Discord.Collection(); //Store all commands inside a discord collection
bot.PIGSCommands = new Discord.Collection();
bot.BothCommands = new Discord.Collection();

bot.login(process.env.BOT_TOKEN); //logs in the bot with the token found in botconfig.json

app.get('/roles/update', function (req, res) {
	if (!req.query.access_token) {
		res.json({
			code: 404,
		});
		return;
	}

	if (req.query.access_token != process.env.SERVER_PASSWORD) {
		res.json({
			code: 404,
		});
		return;
	}

	if (!req.query.server || !req.query.member) {
		res.json({
			code: 404,
		});
		return;
	}

	const roleArgs = {
		guild_id: req.query.server,
		channel_id: '727993411461841038',
		author_id: req.query.member,
		slash: false,
		member: null,
	};

	bot.BothCommands.get('roles')
		.run(bot, roleArgs)
		.then(res => {
			bot.channels.cache.get('727993411461841038').send(res);
			res.json({
				success: 'Yes',
			});
		})
		.catch(err => {
			res.json({
				error: err,
			});
		});
});

app.patch('/roles/update', function (req, res) {
	if (!req.query.access_token) {
		res.json({
			code: 404,
		});
		return;
	}

	if (req.query.access_token != process.env.SERVER_PASSWORD) {
		res.json({
			code: 404,
		});
		return;
	}

	if (!req.query.server || !req.query.member) {
		res.json({
			code: 404,
		});
		return;
	}

	const roleArgs = {
		guild_id: req.query.server,
		channel_id: '727993411461841038',
		author_id: req.query.member,
		slash: false,
		member: null,
	};

	bot.BothCommands.get('roles')
		.run(bot, roleArgs)
		.then(res => {
			bot.channels.cache.get('727993411461841038').send(res);
			res.json({
				success: 'Yes',
			});
		})
		.catch(err => {
			res.json({
				error: err,
			});
		});
});

app.get('/member/message', function (req, res) {
	if (!req.query.access_token) {
		res.json({
			code: 404,
		});
		return;
	}

	if (req.query.access_token != process.env.SERVER_PASSWORD) {
		res.json({
			code: 404,
		});
		return;
	}

	if (!req.query.member || !req.query.name) {
		res.json({
			code: 404,
		});
		return;
	}

	let member = null;
	member = bot.guilds.cache
		.get('447157938390433792')
		.members.cache.get(req.query.member);
	if (member == null) {
		member = bot.guilds.cache
			.get('487285826544205845')
			.members.cache.get(req.query.member);
	}
	if (!member) {
		res.json({
			Error: "Couldn't find member",
		});
		return;
	}
	member.send(`
***Great news ${req.query.name}! You’re the newest member of RC!***

**Getting Started Guide**
We’ve compiled a few tips to help get you started.

**Vouchers**
-Completing company runs will give you vouchers.
-Heavy, Aviator, and RTS Vouchers all have equal value.
-Meet a manager in-game and give them your vouchers - they will pay you.
-Check http://payout.rockwelltransport.com to calculate how much you’ll make.

**Useful tools and links**
Your profile: http://profile.rockwelltransport.com
Contains:
-Progress to the next rank in each company
-Your past turnins

**Live map** of all current RC employees, including ongoing heists!
http://map.rockwelltransport.com
-PIGS = Pink
-RTS = Orange
-Management = Green
Use the toggles on the left side to see points of interest for both companies.

**Dual enrollment**
Also know that you can switch between PIGS and RTS any time. Find a manager from the company you’d like to change to in-game and ask. It’s really no trouble! Use the map to see all managers online.
    `);

	res.json({
		success: 'Yes',
	});
});

app.patch('/member/message/hired', function (req, res) {
	if (!req.query.access_token) {
		res.json({
			code: 404,
		});
		return;
	}

	if (req.query.access_token != process.env.SERVER_PASSWORD) {
		res.json({
			code: 404,
		});
		return;
	}

	if (!req.query.member || !req.query.name) {
		res.json({
			code: 404,
		});
		return;
	}

	let member = null;
	member = bot.guilds.cache
		.get('447157938390433792')
		.members.cache.get(req.query.member);
	if (member == null) {
		member = bot.guilds.cache
			.get('487285826544205845')
			.members.cache.get(req.query.member);
	}
	if (!member) {
		res.json({
			Error: "Couldn't find member",
		});
		return;
	}
	member.send(`
***Great news ${req.query.name}! You’re the newest member of RC!***

**Getting Started Guide**
We’ve compiled a few tips to help get you started.

**Vouchers**
-Completing company runs will give you vouchers.
-Heavy, Aviator, and RTS Vouchers all have equal value.
-Meet a manager in-game and give them your vouchers - they will pay you.
-Check http://payout.rockwelltransport.com to calculate how much you’ll make.

**Useful tools and links**
Your profile: http://profile.rockwelltransport.com
Contains:
-Progress to the next rank in each company
-Your past turnins

**Live map** of all current RC employees, including ongoing heists!
http://map.rockwelltransport.com
-PIGS = Pink
-RTS = Orange
-Management = Green
Use the toggles on the left side to see points of interest for both companies.

**Dual enrollment**
Also know that you can switch between PIGS and RTS any time. Find a manager from the company you’d like to change to in-game and ask. It’s really no trouble! Use the map to see all managers online.
    `);

	res.json({
		success: 'Yes',
	});
});

app.patch('/member/message/rejected', function (req, res) {
	if (!req.query.access_token) {
		res.json({
			code: 404,
		});
		return;
	}

	if (req.query.access_token != process.env.SERVER_PASSWORD) {
		res.json({
			code: 404,
		});
		return;
	}

	if (!req.query.member || !req.query.reason) {
		res.json({
			code: 404,
		});
		return;
	}

	let member = null;
	member = bot.guilds.cache
		.get('447157938390433792')
		.members.cache.get(req.query.member);
	if (member == null) {
		member = bot.guilds.cache
			.get('487285826544205845')
			.members.cache.get(req.query.member);
	}
	if (!member) {
		res.json({
			Error: "Couldn't find member",
		});
		return;
	}
	member.send(`Hello,

    This message is in regards to your recent application to RC. We'd like to thank you for your interest in our company and what we do.

    Here at the Rockwell Corporation, we strive to maintain a tight-knit community of helpful, happy, and active members. As such, we perform background checks with Transport Tycoon staff and check for everything from player reports, to kicks and bans, as well as general attitude, communication skills, and overall state of activity.

    In the case of your candidacy, this background check has raised a red flag to our management team and, as a result, your application has been rejected. If you feel this decision has been made in error, you may appeal by @mentioning Rock in <#560917748184776736> channel of the company's Discord.

    Once again, thank you for your interest; we wish you the best of luck in your future endeavors. Reason for fire: '${req.query.reason}'`);

	res.json({
		success: 'Yes',
	});
});

app.listen(726, function () {
	console.log('Alfred is listening!');
});

bot.on('ready', async () => {
	//When the bot logs in
	console.log(`${bot.user.username} is online!`); //logs that the bot is online
	await slashCommands.init(bot);

	bot.channels.cache.get(botconfig.RTSCEOSpamChannel).send('Restarted.'); //Send a message to a channel

	fs.readdir('./src/Bothcommands/', (err, files) => {
		//Gets all files in the Bothcommands folder
		const slashCmds = { guild: 'GLOBAL', commands: [] };
		if (err) return console.log(err);
		const jsfile = files.filter(f => f.split('.').pop() == 'js'); //only finds files that are .js
		if (jsfile.length <= 0) {
			//if there aren't any files in folder
			console.log("Couldn't find any BOTH commands");
			return;
		}

		jsfile.forEach((f, i) => {
			//For each js file in the folder
			const props = require(`./Bothcommands/${f}`); //loads the file (module.exports)
			if (props.help.disabled) return;
			bot.BothCommands.set(props.help.name, props); //adds to the discord collection with key props.help.name and then value props

			if (props.help.aliases) {
				props.help.aliases.forEach(alias => {
					bot.BothCommands.set(alias, props);
				});
			}

			if (props.help.slash) {
				slashCmds.commands.push(props);
			}
			console.log(`BOTH ${f} loaded!`); //Logs that it got the file correctly
		});

		slashCommands.addCommands(slashCmds);
	});
	fs.readdir('./src/RTScommands/', (err, files) => {
		//Gets all files in the RTScommands folder
		const slashCmds = { guild: 'rts', commands: [] };

		if (err) console.log(err);
		const jsfile = files.filter(f => f.split('.').pop() == 'js'); //only finds files that are .js
		if (jsfile.length <= 0) {
			//if there aren't any files in folder
			console.log("Couldn't find RTS commands");
			return;
		}

		jsfile.forEach((f, i) => {
			//For each js file in the folder
			const props = require(`./RTScommands/${f}`); //loads the file (module.exports)
			if (props.help.disabled) return;
			bot.RTSCommands.set(props.help.name, props); //adds to the discord collection with key props.help.name and then value props

			if (props.help.aliases) {
				props.help.aliases.forEach(alias => {
					bot.RTSCommands.set(alias, props);
				});
			}

			if (props.help.slash) {
				slashCmds.commands.push(props);
			}
			console.log(`RTS ${f} loaded!`); //logs that it got the file correctly
		});
		slashCommands.addCommands(slashCmds);
	});

	fs.readdir('./src/PIGScommands/', (err, files) => {
		const slashCmds = { guild: 'pigs', commands: [] };

		if (err) console.log(err);
		const jsfile = files.filter(f => f.split('.').pop() == 'js'); //Only finds files that are .js
		if (jsfile.length <= 0) {
			//if there aren't any files in folder
			console.log("Couldn't find PIGS commands");
			return;
		}

		jsfile.forEach((f, i) => {
			//For each js file in the folder
			const props = require(`./PIGScommands/${f}`); //Loads the file (module.exports)
			if (props.help.disabled) return;
			bot.PIGSCommands.set(props.help.name, props); //adds to the discord collection with key props.help.name and then value props

			if (props.help.aliases) {
				props.help.aliases.forEach(alias => {
					bot.PIGSCommands.set(alias, props);
				});
			}

			if (props.help.slash) {
				slashCmds.commands.push(props);
			}
			console.log(`PIGS ${f} loaded!`); //Logs that it got the file correctly
		});
		slashCommands.addCommands(slashCmds);
	});

	setInterval(checkForDxp, 30 * 60000);
	checkForDxp();
});

function checkForDxp() {
	function toTimeFormat(ms_num) {
		let sec_num = ms_num / 1000;
		let hours = Math.floor(sec_num / 3600);
		let minutes = Math.floor((sec_num - hours * 3600) / 60);
		let seconds = sec_num - hours * 3600 - minutes * 60;

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

	checkServer(0); //Check server 1

	function checkServer(index) {
		if (index < botconfig.ActiveServers.length - 1) {
			//if its not the last server
			setTimeout(() => {
				checkServer(index + 1); //check next one after 500 ms
			}, 500);
		} else {
			//last one
			return;
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

				if (!body.server) {
					console.log('body, index', body, index);
				} else if (body.server.dxp[0]) {
					const dxpMessage = `There's double experience on **server ${
						body.server.number
					}** for another **${toTimeFormat(
						body.server.dxp[2] + body.server.dxp[3]
					)}** :eyes:`;
					//bot.channels.cache.get("747859854424801401").send(dxpMessage)
					//bot.channels.cache.get("747859721922412736").send(dxpMessage)
				}
			}
		);
	}
}

bot.on('messageDeleteBulk', async messages => {
	//When multiple messages are deleted (.clear)
	let DeletedMessages = new Discord.MessageEmbed()
		.setTitle('Deleted Messages')
		.setColor('RANDOM');
	messages.forEach(async message => {
		//loop through all the deleted messages
		if (message.content)
			DeletedMessages.addField(
				message.member.displayName,
				message.content,
				true
			);
	});

	if (messages.array()[0].guild.id == botconfig.PIGSServer) {
		//if the first message is in the PIGS server (then all messages are in pigs server)
		bot.channels.cache.get(botconfig.PIGSLogs).send(DeletedMessages); //send to pigs logs channel
	} else if (messages.array()[0].guild.id == botconfig.RTSServer) {
		//rts server
		bot.channels.cache.get(botconfig.RTSLogs).send(DeletedMessages); //send to rts logs channel
	}
});

bot.on('messageDelete', async message => {
	//When a single message is deleted
	let DeletedMessage = new Discord.MessageEmbed() //same as messageDeleteBulk except don't have to loop through multiple messages
		.setTitle('Deleted Message')
		.setColor('RANDOM')
		.addField('Author', message.author)
		.addField('Content', message.content)
		.addField('Channel', message.channel);

	if (message.guild.id == botconfig.PIGSServer) {
		bot.channels.cache.get(botconfig.PIGSLogs).send(DeletedMessage);
	} else if (message.guild.id == botconfig.RTSServer) {
		bot.channels.cache.get(botconfig.RTSLogs).send(DeletedMessage);
	}
});

bot.on('guildMemberAdd', async member => {
	//When someone joins the guild
	if (member.user.bot) {
		//if its a bot
		if (member.guild.id == botconfig.RTSServer) {
			//joined rts server
			return member.roles.add(botconfig.RTSRoles.BotRole); //Adds the rts bot role and ends
		} else if (member.guild.id == botconfig.PIGSServer) {
			//joined pigs server
			return member.roles.add(botconfig.PIGSRoles.BotRole); //adds pigs bot role and ends
		}
	}
	if (member.guild.id == botconfig.RTSServer) {
		//rts server and not bot
		bot.channels.cache
			.get(botconfig.RTSWelcome)
			.send(`Welcome to ${member.guild.name} ${member}!`); //Says welcome in the rts server
		member.roles.add(botconfig.RTSRoles.GuestRole);
	} else if (member.guild.id == botconfig.PIGSServer) {
		//pigs commands
		bot.channels.cache
			.get(botconfig.PIGSWelcome)
			.send(`Welcome to ${member.guild.name} ${member}!`); //Says welcome in the pigs server
		member.roles.add(botconfig.PIGSRoles.GuestRole);
	}
});

bot.on('guildMemberRemove', async member => {
	//When someone leaves the server
	let server;
	if (member.guild.id == botconfig.RTSServer) {
		//rts server
		server = 'rts';
		bot.channels.cache
			.get(botconfig.RTSWelcome)
			.send(`${member} (${member.displayName}) has left the server.`); //says that the username has left. Doesn't @ in case they change their name and also is glitchy sometimes
	} else if (member.guild.id == botconfig.PIGSServer) {
		server = 'pigs';
		bot.channels.cache
			.get(botconfig.PIGSWelcome)
			.send(`${member} (${member.displayName}) has left the server.`); //says that the username has left. Doesn't @ in case they change their name and also is glitchy sometimes
	}

	bot.con.query(
		`SELECT company, welcome FROM members WHERE discord_id = '${member.id}'`,
		function (err, result) {
			if (err) return console.log(err);
			if (!result[0]) return;

			if (result[0].company != server) return;

			bot.con.query(
				`UPDATE members SET company = 'fired', fire_reason = 'Left Discord (automatically)' WHERE discord_id = '${member.id}'`,
				function (err, result) {
					if (err) console.log(err);
					else if (result.affectedRows > 0) {
						bot.channels.cache
							.get('727993411461841038')
							.send(
								`Member ${member} (${
									member.displayName
								}) has been fired for leaving the ${server.toUpperCase()} server.`
							);
					}
				}
			);
		}
	);
});

bot.on('message', async message => {
	//Someone sends a message in a channel
	if (message.partial) await message.fetch();
	ProcessMessage(message);
});

bot.on('messageUpdate', async (oldMessage, newMessage) => {
	if (newMessage.partial) await newMessage.fetch();
	ProcessMessage(newMessage);
});

async function ProcessMessage(message) {
	if (message.partial) await message.fetch();
	// Check if the message has an author, if not log a link to the message
	if (!message.author) {
		console.log(
			`Message with no author: https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
		);
		return;
	}
	if (message.author.bot || message.channel.type == 'dm') return; //if message is from a bot or is in a DM with the bot
	if (message.channel.id == botconfig.PIGSOneWordStory) {
		//If its in the one word story channel
		if (
			message.content.split(' ').length > 1 ||
			message.content.split('-').length > 1 ||
			message.content.split('_').length > 1 ||
			message.content.includes(':')
		) {
			//if the message contains an emoji or is more than one word
			message.delete(); //deletes it
		} else if (LastPerson == message.member.id)
			message.delete(); //if the last person to send a message is also the person then delete it
		else LastPerson = message.member.id; //if its one word and a new person then don't delete it and set the last person to the new person
	}
	if (
		message.content.includes('https://discord.gg/') &&
		!message.member.hasPermission('KICK_MEMBERS')
	) {
		//if the message has a discord invite and its not from a manager
		message.delete(); //delete it
		message.channel.send('No invites plz and thx').then(msg => {
			msg.delete(1000);
		});
	}

	let prefix;
	if (message.guild.id == botconfig.PIGSServer) prefix = botconfig.prefix.PIGS;
	//in case of a different prefix for each server
	else if (message.guild.id == botconfig.RTSServer)
		prefix = botconfig.prefix.RTS;
	const messageArray = message.content.split(' '); //splits the message into an array for every space into an array
	const cmd = messageArray[0].toLowerCase(); //command is first word in lowercase
	const args = messageArray.slice(1); //args is everything after the first word
	// if (message.mentions.members.size > 0 && message.mentions.members.first().id == "472060657081122818") {
	//     message.channel.startTyping(); //start type in the channel
	//     await bot.BothCommands.get("ask").run(bot, message, args)
	//     message.channel.stopTyping(true) //stops typing in the channel after the command finishes
	// }
	if (!message.content.startsWith(prefix)) return; //if it doesn't start with the prefix

	if (message.guild.id == botconfig.RTSServer) {
		//if said in the rts server
		const AllowedRTSCommands = ['.status', '.8ball', '.ud', '.hello']; // commands you can do outside of bot channels

		var commandfile = bot.RTSCommands.get(cmd.slice(prefix.length)); //Trys to get a rts command with the specified cmd without the prefix
		if (
			commandfile &&
			message.channel.id != botconfig.RTSPublicBotCommandsChannel &&
			message.channel.id != botconfig.RTSBotCommandsChannel &&
			message.channel.id != botconfig.RTSBennysChannel &&
			message.channel.id != botconfig.RTSVoucherChannel &&
			!message.member.hasPermission('KICK_MEMBERS') &&
			!AllowedRTSCommands.includes(cmd)
		)
			return message.channel.send(
				`Do this in <#${botconfig.RTSPublicBotCommandsChannel}> or <#${botconfig.RTSBotCommandsChannel}>`
			); //if theres a command but its not in one of the allowed channels
		if (commandfile) console.log('RTS', commandfile.help.name, args); //if theres a command file then log that its rts and then the name and args
	} else if (message.guild.id == botconfig.PIGSServer) {
		//if said in the pigs server
		const AllowedPIGSCommands = ['.status', '.8ball', '.ud', '.hello'];

		var commandfile = bot.PIGSCommands.get(cmd.slice(prefix.length)); // try to get a pigs command with the specified cmd without the prefix
		if (
			commandfile &&
			message.channel.id != '511853214858084364' &&
			message.channel.id != botconfig.PIGSBotCommandsChannel &&
			message.channel.id != botconfig.PIGSVoucherChannel &&
			!message.member.hasPermission('KICK_MEMBERS') &&
			!AllowedPIGSCommands.includes(cmd)
		)
			return message.channel.send(
				`Do this in <#${botconfig.PIGSBotCommandsChannel}> instead`
			); //if theres a command but its said in the wrong channel
		if (commandfile) console.log('PIGS', commandfile.help.name, args); //if theres a command file then log that its pigs and then the name and args
	}
	if (!commandfile) {
		//if theres isn't a pigs or rts command
		var commandfile = bot.BothCommands.get(cmd.slice(prefix.length)); //try to get a both server command with the specified cmd without the prefix
		if (commandfile) console.log('BOTH', commandfile.help.name, args); //logs that theres a command file
	}
	if (commandfile) {
		//if theres a command file in both, rts, or pigs
		if (commandfile.help.slow) {
			message.channel.startTyping(); //start type in the channel
		}
		if (commandfile.help.slash) {
			let canUse = false;
			commandfile.help.permission.forEach(perm => {
				if (message.member.roles.cache.has(perm.id)) canUse = true;
			});
			if (!canUse)
				return message.channel.send('You are not allowed to use this command.');

			const slashArgs = {
				guild_id: message.guild.id,
				channel_id: message.channel.id,
				author_id: message.author.id,
				slash: false,
			};

			function parseArgs(slashOptions) {
				if (slashOptions.length == 0) return true;
				let invalidArgs = true;
				let hasAllRequiredArgs = true;
				let hasAnyNonSub = false;

				slashOptions.forEach(arg => {
					if (arg.type == 2) {
						if (arg.parse) {
							const sub_command_group = arg.parse(bot, message, args);
							if (sub_command_group)
								slashArgs.sub_command_group = sub_command_group;
						}

						if (parseArgs(arg.options)) {
							invalidArgs = false;
						} else if (slashArgs.sub_command_group == arg.name) {
							invalidArgs = true;
						}
					} else if (arg.type == 1) {
						if (arg.parse) {
							const sub_command = arg.parse(bot, message, args);
							if (sub_command) slashArgs.sub_command = sub_command;
						}

						if (parseArgs(arg.options)) {
							invalidArgs = false;
						} else if (slashArgs.sub_command == arg.name) {
							invalidArgs = true;
						}
					} else {
						hasAnyNonSub = true;
						slashArgs[arg.name] = arg.parse(bot, message, args);
						if (
							arg.required &&
							(slashArgs[arg.name] === undefined ||
								slashArgs[arg.name] === null)
						) {
							hasAllRequiredArgs = false;
						}
					}
				});

				if (invalidArgs && hasAllRequiredArgs && hasAnyNonSub)
					invalidArgs = false;
				return !invalidArgs;
			}

			const validArgs = parseArgs(commandfile.help.args);
			if (!validArgs)
				return message.channel.send(
					`Invalid supplied arguments. Usage: ${commandfile.help.usage}`
				);

			commandfile
				.run(bot, slashArgs)
				.then(res => {
					if (typeof res == 'string') {
						if (commandfile.help.hidden) {
							message.author.send(res);
							message.delete();
						} else {
							message.channel.send(res);
						}
					} else {
						if (Array.isArray(res)) {
							res.forEach(mes => {
								if (mes.messageOptions) {
									if (commandfile.help.hidden) {
										message.author.send(mes.message, mes.messageOptions);
										message.delete();
									} else {
										message.channel.send(mes.message, mes.messageOptions);
									}
								} else {
									if (commandfile.help.hidden) {
										message.author.send(mes);
										message.delete();
									} else {
										message.channel.send(mes);
									}
								}
							});
						} else {
							if (res.messageOptions) {
								if (commandfile.help.hidden) {
									message.author.send(res.message, res.messageOptions);
									message.delete();
								} else {
									message.channel.send(res.message, res.messageOptions);
								}
							} else {
								if (commandfile.help.hidden) {
									message.author.send(res);
									message.delete();
								} else {
									message.channel.send(res);
								}
							}
						}
					}
				})
				.catch(err => {
					message.channel.send(`There was an error. Gabo says ${err}`);
				});
		} else {
			await commandfile.run(bot, message, args); //if there is a command in the bot it runs the module.exports.run part of the file.
		}
		if (commandfile.help.slow) {
			message.channel.stopTyping(true); //stops typing in the channel after the command finishes
		}
	}
}

bot.on('message', async message => {
	//When a message is sent to a channel. Not in the other bot.on message because its easier to read
	if (message.partial) await message.fetch();
	if (
		message.author.bot ||
		message.author.id == botconfig.GlitchDetectorID ||
		!message.mentions.members
	)
		return; //if its from a bot or is from glitch himself
	message.mentions.members.forEach(function (Mention) {
		//go through all the mentions in the message
		if (Mention.user.id == botconfig.GlitchDetectorID) {
			//if they mentioned glitch
			message.delete(); //delete the message

			let GlitchEmbed = new Discord.MessageEmbed() //make an embed with info about the message
				.setColor('#bc0000')
				.setTitle('Pinged Glitch')
				.addField('Author', message.member.displayName)
				.addField('Message', message.content)
				.addField('Date', message.createdAt)
				.addField('In Channel', message.channel);

			if (message.guild.id == botconfig.RTSServer)
				bot.channels.cache.get(botconfig.RTSLogs).send(GlitchEmbed);
			//if its in rts send to rts logs
			else if (message.guild.id == botconfig.PIGSServer)
				bot.channels.cache.get(botconfig.PIGSLogs).send(GlitchEmbed); //if its in pigs send to pigs logs
		}
	});
});
let LatestFeedID = 0;
bot.on('message', async message => {
	if (message.partial) await message.fetch();
	if (
		message.channel.id == '630947095456514077' &&
		(message.author.id == '404650985529540618' ||
			message.author.id == '330000865215643658' ||
			message.author.id == '453742447483158539')
	) {
		if (parseInt(message.content)) {
			authentication.authenticate().then(async auth => {
				const sheets = google.sheets({
					version: 'v4',
					auth,
				});

				sheets.spreadsheets.values.append(
					{
						//append all the hired people
						auth: auth,
						spreadsheetId: process.env.BABY_SHEET,
						range: 'B3:D9999',
						valueInputOption: 'USER_ENTERED',
						insertDataOption: 'OVERWRITE',
						includeValuesInResponse: true,
						resource: {
							majorDimension: 'ROWS',
							values: [
								[
									new Date().toDateString(),
									new Date().toLocaleTimeString(),
									message.content,
								],
							],
						},
					},
					function (err, response) {
						if (err) return console.log(err);
						message.channel.send('GOO GOO GAA GAA THANKS FOR THE SUSTENANCE');

						sheets.spreadsheets.values.batchGet(
							{
								//get spreadsheet range
								spreadsheetId: process.env.BABY_SHEET,
								ranges: ['H2', 'J2', 'J5'],
								valueRenderOption: 'UNFORMATTED_VALUE',
								dateTimeRenderOption: 'FORMATTED_STRING',
								auth: auth,
							},
							(err, res) => {
								if (err) {
									channel.send(`The API returned an ${err}`);
									return;
								}
								const FoodThresh = res.data.valueRanges[0].values[0];
								const SoonPing = res.data.valueRanges[1].values[0] * 60000;
								const LongPing = res.data.valueRanges[2].values[0] * 60000;

								const FeedID = LatestFeedID + 1;

								LatestFeedID = FeedID;

								if (parseInt(message.content) < FoodThresh) {
									setTimeout(() => {
										if (LatestFeedID == FeedID)
											message.channel.send(
												'<@453742447483158539> GOO GOO GAA GAA FEED ME IM STARVING'
											);
									}, SoonPing);
								} else {
									setTimeout(() => {
										if (LatestFeedID == FeedID)
											message.channel.send(
												'<@453742447483158539> GOOD GOOD GAA GAA FEED ME IN GONNA DIE SOON'
											);
									}, LongPing);
								}
							}
						);
					}
				);
			});
			return;
		}
		switch (message.content.toLowerCase()) {
			case 'recent':
				authentication.authenticate().then(async auth => {
					const sheets = google.sheets({
						version: 'v4',
						auth,
					});

					sheets.spreadsheets.values.get(
						{
							//get spreadsheet range
							spreadsheetId: process.env.BABY_SHEET,
							range: 'B3:D9999',
						},
						(err, res) => {
							if (err) {
								channel.send(`The API returned an ${err}`);
								return;
							}

							const rows = res.data.values;
							if (rows.length) {
								const BabyEmbed = new Discord.MessageEmbed().setTitle(
									'Baby Food'
								);

								for (
									let i = rows.length - 1;
									i > rows.length - 6 && i > -1;
									i--
								) {
									BabyEmbed.addField(
										`${rows[i][0]} at ${rows[i][1]}`,
										rows[i][2]
									);
								}

								message.channel.send(BabyEmbed);
							}
						}
					);
				});
				break;
		}
	}
});

bot.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();

	const fakeArgs = {
		guild_id: reaction.message.guild.id,
		channel_id: '569683812028645386',
		author_id: user.id,
		slash: false,
	};

	switch (reaction.message.id) {
		case '705249775984836640':
		case '705179916915834891':
			//Refresh Roles
			bot.BothCommands.get('roles')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705179978706190467':
			//ATS
			bot.RTSCommands.get('ats')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705180001229865001':
			//ETS2
			bot.RTSCommands.get('ets2')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705180042644422696':
			//NSFW
			bot.RTSCommands.get('owo')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705180148650999869':
			//Warzone
			bot.RTSCommands.get('warzone')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705249848810799186':
			//PIGS NSFW
			bot.PIGSCommands.get('kys')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705249920013303848':
			//Warthogs
			bot.PIGSCommands.get('warthogs')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705251722557128725':
			//Voucher
			const botCommandsChannel =
				reaction.message.guild.channels.cache.get('483312512217907220');
			//fakeMessage.channel = botCommandsChannel;
			bot.RTSCommands.get('voucher').run(bot, fakeArgs);
			reaction.remove();
			botCommandsChannel.send(`${user}`);
			break;
		case '705253371468185651':
			//Voucher
			const pigsBotChannel =
				reaction.message.guild.channels.cache.get('487621053494067200');
			//fakeMessage.channel = pigsBotChannel;
			bot.PIGSCommands.get('vouchers').run(bot, fakeArgs);
			reaction.remove();
			pigsBotChannel.send(`${user}`);
			break;
	}
	//if (reaction.partial) await reaction.fetch()
});

bot.on('messageReactionRemove', async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();

	const fakeArgs = {
		guild_id: reaction.message.guild.id,
		channel_id: '569683812028645386',
		author_id: user.id,
		slash: false,
	};
	switch (reaction.message.id) {
		case '705179978706190467':
			//ATS
			bot.RTSCommands.get('ats')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705180001229865001':
			//ETS2
			bot.RTSCommands.get('ets2')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705180042644422696':
			//NSFW
			bot.RTSCommands.get('owo')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705180148650999869':
			//Warzone
			bot.RTSCommands.get('warzone')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705249848810799186':
			//PIGS NSFW
			bot.PIGSCommands.get('kys')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
		case '705249920013303848':
			//Warthogs
			bot.PIGSCommands.get('warthogs')
				.run(bot, fakeArgs)
				.then(res => {
					user.send(res);
				});
			break;
	}
	//if (reaction.partial) await reaction.fetch()
});

bot.on('error', error => {
	//when theres a discord error
	console.log(error);
});

bot.on('shardDisconnect', (event, shardID) => {
	//when the bot disconnects
	bot.login(process.env.BOT_TOKEN); //reconnect
});
