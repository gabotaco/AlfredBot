const Discord = require('discord.js');
const botconfig = require('../botconfig.json');
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1); //capitalize first letter and then keep rest of string the same
};

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		let question = args.question.capitalize(); //Everything after the command into one string and first letter capitalized
		if (!question.endsWith('?')) {
			//if it doesn't end with a ?
			question += '?'; //add a ?
		}

		if (Math.random() <= 0.5) {
			//50%
			var answer =
				YesResponses[Math.floor(Math.random() * YesResponses.length)]; //answer is yes
		} else {
			var answer = NoResponses[Math.floor(Math.random() * NoResponses.length)]; //answer is no
		}

		const ballembed = new Discord.MessageEmbed()
			.setColor('#FF9900')
			.addField('Question', question)
			.addField('Answer', answer); //pick a random response

		return resolve(ballembed);
	});
};

module.exports.help = {
	name: '8ball',
	aliases: ['8b'],
	usage: '<question>',
	args: [
		{
			type: 3,
			name: 'question',
			description: 'Question to ask Alfred',
			required: true,
			missing: 'Please ask a full question ya dummie.',
			parse: (bot, message, args) => {
				return args.slice(0).join(' ');
			},
		},
	],
	description: 'Ask the mighty Alfred any yes or no question',
	permission: [
		...botconfig.OWNERS,
		...botconfig.MANAGERS,
		...botconfig.EMPLOYEES,
		...botconfig.MEMBERS,
	],
	slash: true,
};

const YesResponses = [
	'Yes.',
	'Most likely',
	'There is a small chance',
	'Yes- definitely',
	'You may rely on it',
	'It is decidedly so.',
	'Signs point to yes.',
	'Without a doubt.',
	'As I see it yes.',
	'Outlook good.',
	"Well yes. You didn't know that? 😂",
	'Of course.',
];
const NoResponses = [
	'No.',
	'Never ever ever',
	'Very doubtful',
	"Don't count on it.",
	'No. Nonononononono FUCK NO!',
	'You wish.',
	'Nah fam',
	'My reply is no.',
	'My sources say no.',
];
