const Discord = require('discord.js');
const fs = require('fs');
const botconfig = require('../botconfig.json');

function canUseCommand(member, commandPermissions) {
	if (typeof commandPermissions == 'string') {
		return member.hasPermission(commandPermissions);
	}

	let canUse = false;
	commandPermissions.forEach(perm => {
		if (member.roles.cache.has(perm.id)) canUse = true;
	});
	return canUse;
}
module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		let CommandFolder;
		let MemberRoles;
		if (args.guild_id == botconfig.PIGSServer) {
			CommandFolder = './PIGScommands/'; //folder with pigs commands
			MemberRoles = bot.guilds.cache
				.get(botconfig.PIGSServer)
				.members.cache.get(args.author_id);
		} else if (args.guild_id == botconfig.RTSServer) {
			CommandFolder = './RTScommands/'; //folder with rts commands
			MemberRoles = bot.guilds.cache
				.get(botconfig.RTSServer)
				.members.cache.get(args.author_id);
		}

		fs.readdir(CommandFolder, (err, files) => {
			//reads all files in the commands folder
			if (err) {
				console.log(err);
				return reject('There was an error reading server commands.');
			}

			const jsfile = files.filter(f => f.split('.').pop() == 'js'); //Removes non js files from the array
			let help1 = new Discord.MessageEmbed() //2 different embeds cause lots of commands
				.setTitle(
					`Alfreds Commands that YOU can use`,
					bot.user.displayAvatarURL()
				)
				.setDescription('Things in [] are optional. Things in <> are required')
				.setThumbnail(bot.user.displayAvatarURL())
				.setColor('RANDOM'); //random color
			let help2 = new Discord.MessageEmbed();

			let i = 0; //track how many times i've added to an embed

			jsfile.forEach(f => {
				//for each file in commands
				const command = require(`.${CommandFolder}${f}`);
				if (command.help.disabled) return;

				if (i < 25 && canUseCommand(MemberRoles, command.help.permission)) {
					//If i haven't added 25 fields
					help1.addField(
						`.${command.help.name} ${command.help.usage}`,
						`${command.help.description}.`
					); //adds the command info to the embed
					i++; //adds 1 to I
				} else if (
					i < 50 &&
					canUseCommand(MemberRoles, command.help.permission)
				) {
					//need 2 because you can't have more than 25 fields in an embed or else it fails
					help2.addField(
						`.${command.help.name} ${command.help.usage}`,
						`${command.help.description}.`
					);
					i++;
				}
			});

			fs.readdir('./Bothcommands', (err, files) => {
				//reads all files in the commands folder
				if (err) {
					console.log(err);
					return reject('Unable to get global commands.');
				}

				const jsfile = files.filter(f => f.split('.').pop() == 'js'); //removes non js files from array

				jsfile.forEach(f => {
					//for each file in commands
					const command = require(`../Bothcommands/${f}`);
					if (command.help.disabled) return;
					if (i < 25 && canUseCommand(MemberRoles, command.help.permission)) {
						//Doesn't go over 25
						help1.addField(
							`.${command.help.name} ${command.help.usage}`,
							`${command.help.description}.`
						); //adds the command info to the embed
						i++; //adds 1 to I
					} else if (
						i < 50 &&
						canUseCommand(MemberRoles, command.help.permission)
					) {
						//need 2 because you can't have more than 25 fields in an embed or else it fails
						help2.addField(
							`.${command.help.name} ${command.help.usage}`,
							`${command.help.description}.`
						);
						i++;
					}
				});

				if (!help2.fields[0]) {
					//if there aren't any fields in the help2 embed
					return resolve(help1);
				} else {
					//are fields in help2
					return resolve([help1, help2]);
				}
			});
		});
	});
};

module.exports.help = {
	name: 'help',
	aliases: [],
	usage: '',
	description: 'Sends a list of commands',
	args: [],
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
	hidden: true,
};
