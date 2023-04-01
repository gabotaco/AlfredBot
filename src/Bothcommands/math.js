const mathjs = require('mathjs');
const botconfig = require('../botconfig');

module.exports.run = async (bot, args) => {
	return new Promise((resolve, reject) => {
		try {
			let answer = mathjs.evaluate(args.equation);
			resolve(`${args.equation} = ${answer.toString()}`);
		} catch (e) {
			resolve('Invalid equation.');
		}
	});
};

module.exports.help = {
	name: 'math',
	aliases: [],
	usage: '<equation>',
	description: 'Do math',
	args: [
		{
			name: 'equation',
			description: 'The equation to evaluate',
			type: 3,
			required: true,
			missing: 'Please specify an equation',
			parse: (bot, message, args) => {
				return args.join(' ');
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
	hidden: true,
};
