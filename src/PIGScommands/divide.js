module.exports.run = async (bot, message, args) => {
	message.delete(); //Deletes the .divide
	message.channel.send(
		'--------------------------------------------------------------------------------------------------------------------------------------'
	); //sends long ----
};

module.exports.help = {
	disabled: true,

	name: 'divide',
	usage: '',
	description: 'Divides the messages',
	permission: 'SEND_MESSAGES',
};
