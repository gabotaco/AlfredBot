const botconfig = require('../botconfig.json');
const functions = require('../util/functions.js');
//ID's of all rank roles
const hustlerID = '488021473361920010';
const pickpocketID = '488021509458362368';
const thiefID = '488021491649085441';
const lawlessID = '488021525233139724';
const mastermindID = '488021546036625414';
const overlordID = '526214202621427724';
const swineID = '784872094307057705';
const rtsfamilyID = '526160668882239508';
const initiateID = '453564342290612251';
const leadfootID = '453564406673047552';
const wheelman = '453564426302390284';
const legendaryID = '453564453628280835';
const speeddemonID = '453564481075806219';
const pigsfamilyID = '526203890639699968';

module.exports.run = async (bot, args) => {
	return new Promise(async (resolve, reject) => {
		let person = bot.guilds.cache
			.get(args.guild_id)
			.members.cache.get(args.author_id);

		if (args.member) {
			if (
				!bot.guilds.cache
					.get(args.guild_id)
					.members.cache.get(args.author_id)
					.hasPermission('KICK_MEMBERS')
			)
				return resolve("You aren't allowed to specify another member.");

			person = bot.guilds.cache
				.get(args.guild_id)
				.members.cache.get(args.member);
		}

		if (!person) return resolve("Couldn't find specified member.");

		if (!person.id) return resolve("Couldn't find specified member.");

		if (
			args.member &&
			person.id == args.author_id &&
			args.member != args.author_id
		)
			return resolve("Couldn't find specified member.");

		let alwaysKeep;
		let employeeID;
		let GuestRole;
		let FamilyID;
		if (args.guild_id == botconfig.PIGSServer) {
			alwaysKeep = [
				'970370393468710943',
				'487624439668670464',
				'487286138529120256',
				'565188247592894466',
				'530765121522499584',
				'833350039690543114',
				'692738808399134731',
				'501822882071052308',
				'539240789809692691',
				'656927314277564417',
				'823223094239952917',
				'487288337065836558',
				'529644127734988821',
				'487286418855428096',
				'487289216968032256',
				'499007548993568768',
				'495650147754311690',
				'572838338470346757',
				'561718455007445012',
				'487623401247342613',
				'487288297421406208',
				'516803056222994442',
				'516802932260470825',
				'513844670611193866',
				'510237061719261194',
				'489242068770619403',
				'629518731093082115',
				'490261228585746433',
				'491992119049977867',
				'492446479554838528',
				'487289181685678090',
				'493805677546831872',
				'495359477701410816',
				'498885132468486175',
				'511347144683290624',
				'520761019841118219',
				'695623000925405214',
				'708301305382305862',
				'518527151960752131',
				'611198469734137857',
				'539250396653289492',
				'546071134961926148',
				'589163520134742020',
				'619927554400321557',
				'720962661352996888',
				'743968134016401510',
				'784095349882224701',
				'823222964609876012',
				'853769094876102663',
			];
			employeeID = '562991083882151937';
			GuestRole = botconfig.PIGSRoles.GuestRole;
			FamilyID = rtsfamilyID;
		} else if (args.guild_id == botconfig.RTSServer) {
			alwaysKeep = [
				'447494569173712898',
				'472145541091033123',
				'455014608810541068',
				'472133586745688075',
				'453744160923713548',
				'453999831434919948',
				'447493627791409173',
				'482902573179731969',
				'472143712655245322',
				'453563912097497110',
				'662781507995172874',
				'453982220907184128',
				'529643022866972684',
				'448681738953162752',
				'453570994985238528',
				'458376796921004052',
				'453917732254121997',
				'477463794965020673',
				'479082117154996235',
				'843228442898989107',
				'635487264834715648',
				'454474803529646111',
				'454190936843354113',
				'471671084392120351',
				'449404264545255446',
				'472386249341272064',
				'475393112915574821',
				'477115908888723467',
				'478393609540861952',
				'478393923656482827',
				'705247928125489212',
				'478955377619370004',
				'480730660105879580',
				'629518335935119360',
				'472023222674784259',
				'503224065906180106',
				'599300469281783853',
				'629518677636546585',
				'648966486383394827',
				'705180161850474578',
				'843226962390417419',
				'974001993158897664',
			];
			employeeID = '483297370482933760';
			GuestRole = botconfig.RTSRoles.GuestRole;
			FamilyID = pigsfamilyID;
		}

		if (person.roles.cache) {
			//person has roles
			await person.roles.cache.forEach(async element => {
				//go through all roles
				if (!alwaysKeep.includes(element.id)) {
					try {
						await person.roles.remove(element.id); //If the current role isn't in the always keep array then remove it
					} catch (e) {
						// ignore
					}
				}
			});
		}

		await person.roles.add(GuestRole); //add guest role

		let MemberDetails = await functions.GetMemberDetails(
			bot.con,
			'discord_id',
			person.id
		); //get member details with message.channel

		if (MemberDetails) {
			//if member is in database
			if (MemberDetails.company == 'fired') return resolve('Guest role.'); //if fired stop

			if (person.id != '404650985529540618')
				await person.setNickname(MemberDetails.in_game_name); //set nickname to in game name

			if (person.roles.cache.has(GuestRole))
				await person.roles.remove(GuestRole); //if they have guest role remove it
			await person.roles.add(employeeID); //add employee role

			//If they are a rank then add the rank role
			if (args.guild_id == botconfig.PIGSServer) {
				//in pigs server
				if (MemberDetails.company == 'rts') {
					//rts
					await person.roles.add(FamilyID);
					resolve(`Gave ${person} the RTS family role`);
				} else if (
					MemberDetails.pigs_total_vouchers < 6000 &&
					!person.roles.cache.has(hustlerID)
				) {
					//hustler
					foundRole = true;
					await person.roles.add(hustlerID);
					resolve(`Gave ${person} the hustler role`);
				} else if (
					MemberDetails.pigs_total_vouchers < 18000 &&
					!person.roles.cache.has(pickpocketID)
				) {
					foundRole = true;
					await person.roles.add(pickpocketID);

					resolve(`Gave ${person} the pickpocket role`);
				} else if (
					MemberDetails.pigs_total_vouchers < 38000 &&
					!person.roles.cache.has(thiefID)
				) {
					foundRole = true;
					await person.roles.add(thiefID);

					resolve(`Gave ${person} the thief role`);
				} else if (
					MemberDetails.pigs_total_vouchers < 68000 &&
					!person.roles.cache.has(lawlessID)
				) {
					foundRole = true;
					await person.roles.add(lawlessID);

					resolve(`Gave ${person} the lawless role`);
				} else if (
					MemberDetails.pigs_total_vouchers < 150000 &&
					!person.roles.cache.has(mastermindID)
				) {
					foundRole = true;
					await person.roles.add(mastermindID);

					resolve(`Gave ${person} the mastermind role`);
				} else if (
					MemberDetails.pigs_total_vouchers < 1500000 &&
					!person.roles.cache.has(overlordID)
				) {
					foundRole = true;
					await person.roles.add(overlordID);
					resolve(`Gave ${person} the overlord role`);
				} else if (!person.roles.cache.has(swineID)) {
					foundRole = true;
					await person.roles.add(swineID);
					resolve(`Gave ${person} the swine role`);
				}
			} else {
				//rts discord
				if (MemberDetails.company == 'pigs') {
					//in pigs
					await person.roles.add(FamilyID);
					resolve(`Gave ${person} the PIGS family role`);
				} else if (
					MemberDetails.rts_total_vouchers < 9600 &&
					!person.roles.cache.has(initiateID)
				) {
					foundRole = true;
					await person.roles.add(initiateID);
					resolve(`Gave ${person} the initiate role`);
				} else if (
					MemberDetails.rts_total_vouchers < 24000 &&
					!person.roles.cache.has(leadfootID)
				) {
					foundRole = true;
					await person.roles.add(leadfootID);

					resolve(`Gave ${person} the lead foot role`);
				} else if (
					MemberDetails.rts_total_vouchers < 52800 &&
					!person.roles.cache.has(wheelman)
				) {
					foundRole = true;
					await person.roles.add(wheelman);

					resolve(`Gave ${person} the wheelman role`);
				} else if (
					MemberDetails.rts_total_vouchers < 117600 &&
					!person.roles.cache.has(legendaryID)
				) {
					foundRole = true;
					await person.roles.add(legendaryID);

					resolve(`Gave ${person} the legendary role`);
				} else if (!person.roles.cache.has(speeddemonID)) {
					foundRole = true;
					await person.roles.add(speeddemonID);

					resolve(`Gave ${person} the speed demon role`);
				}
			}
		} else {
			return resolve('Guest role.');
		}
	});
};

module.exports.help = {
	name: 'roles',
	aliases: [],
	usage: '[discord member]',
	description: 'Refresh roles',
	args: [
		{
			name: 'member',
			description: 'MANAGERS An other discord member',
			type: 6,
			required: false,
			parse: (bot, message, args) => {
				const specifiedMember =
					message.mentions.members.first() ||
					message.guild.members.cache.get(args[0]);
				return specifiedMember ? specifiedMember.id : null;
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
