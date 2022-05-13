const Discord = require("discord.js") //discord
const botconfig = require("../botconfig.json"); //handy info
const functions = require("../functions.js") //Handy functions
Array.prototype.indexOfId = function (id) {
    for (var i = 0; i < this.length; i++)
        if (this[i].in_game_id === id)
            return i;
    return -1;
}

module.exports.run = async (bot, args) => {
    return new Promise((resolve, reject) => {
        if (!args.sub_command) return resolve(`Invalid supplied arguments. Usage: ${this.help.usage}`)
        if (args.sub_command_group.toLowerCase() == "total") {
            if (args.sub_command.toLowerCase() == "days") {
                const Threshold = new Date()
                Threshold.setDate(Threshold.getDate() - parseInt(args.num))
                
                bot.con.query(`SELECT * FROM payout WHERE createdAt > '${Threshold.toISOString()}'`, function (err, result, fields) { //get all their info into one array
                    if (err) {
                        console.log(err);
                        return reject("There was an error selecting payouts.")
                    }
                    
                    let TotalVouchers = 0;
                    let TotalValue = 0;
                    result.forEach(member => {
                        TotalVouchers += member.amount;

                        TotalValue += member.worth;
                    });

                    const statEmbed = new Discord.MessageEmbed()
                        .setTitle(`Total vouchers between now and ${parseInt(args.num)} days ago`)
                        .setColor("RANDOM")
                        .addField("Total Vouchers", functions.numberWithCommas(TotalVouchers), true)
                        .addField("Cashout value", "$" + functions.numberWithCommas(Math.abs((TotalVouchers * 10000) - (TotalVouchers * 10000) - TotalValue)), true)
                        .addField("Cashout Profit", "$" + functions.numberWithCommas((TotalVouchers * 10000) - TotalValue), true)
                    return resolve(statEmbed)
                });
            } else if (args.sub_command.toLowerCase() == "unpaid") {
                bot.con.query(`SELECT * FROM managers`, function (err, result, fields) { //get all their info into one array
                    if (err) {
                        console.log(err);
                        return reject("Unable to get managers");
                    }

                    let TotalVouchers = 0;
                    let TotalValue = 0;
                    result.forEach(member => {
                        TotalVouchers += member.rts_cashout;
                        TotalVouchers += member.pigs_cashout;

                        TotalValue += member.rts_cashout_worth;
                        TotalValue += member.pigs_cashout_worth;
                    });

                    const statEmbed = new Discord.MessageEmbed()
                        .setTitle(`Total unpaid vouchers with managers`)
                        .setColor("RANDOM")
                        .addField("Total Vouchers", functions.numberWithCommas(TotalVouchers), true)
                        .addField("Total value", "$" + functions.numberWithCommas(TotalValue), true)
                    return resolve(statEmbed)
                })
            }
            return;
        } else if (args.sub_command_group.toLowerCase() == "rts") {
            var company = "rts"
        } else if (args.sub_command_group.toLowerCase() == "pigs") {
            var company = "pigs"
        }

        if (args.sub_command.toLowerCase() == "days") {
            const Threshold = new Date()
            Threshold.setDate(Threshold.getDate() - parseInt(args.num))
            bot.con.query(`SELECT * FROM payout WHERE createdAt > '${Threshold.toISOString()}' AND company = '${company}'`, function (err, result, fields) { //get all their info into one array
                if (err) {
                    console.log(err);
                    return reject("Unable to get payouts.")
                }

                let TotalVouchers = 0;
                let TotalValue = 0;
                result.forEach(member => {
                    TotalVouchers += member.vouchers;

                    TotalValue += member.worth;
                });

                const statEmbed = new Discord.MessageEmbed()
                    .setTitle(`Total vouchers between now and ${parseInt(args.num)} days ago for ${company.toUpperCase()}`)
                    .setColor("RANDOM")
                    .addField("Total Vouchers", functions.numberWithCommas(TotalVouchers), true)
                    .addField("Cashout value", "$" + functions.numberWithCommas(Math.abs((TotalVouchers * 10000) - (TotalVouchers * 10000) - TotalValue)), true)
                    .addField("Cashout Profit", "$" + functions.numberWithCommas((TotalVouchers * 10000) - TotalValue), true)
                return resolve(statEmbed)
            })
        } else if (args.sub_command.toLowerCase() == "unpaid") {
            bot.con.query(`SELECT * FROM managers`, function (err, result, fields) { //get all their info into one array
                if (err) {
                    console.log(err);
                    return reject("Unable to get managers.")
                }

                let TotalVouchers = 0;
                let TotalValue = 0;
                result.forEach(member => {
                    TotalVouchers += member[`${company}_cashout`];

                    TotalValue += member[`${company}_cashout_worth`];
                });

                const statEmbed = new Discord.MessageEmbed()
                    .setTitle(`Total unpaid vouchers with ${company.toUpperCase()}'s managers`)
                    .setColor("RANDOM")
                    .addField("Total Vouchers", functions.numberWithCommas(TotalVouchers), true)
                    .addField("Total value", "$" + functions.numberWithCommas(TotalValue), true)
                return resolve(statEmbed)
            })
        } else if (args.sub_command.toLowerCase() == "top") {
            const NumOfPlayers = parseInt(args.num_players);
            const NumOfDays = parseInt(args.num_days);

            if (NumOfPlayers > 25) return resolve("Too many players. The limit is 25.")
            const Threshold = new Date()
            Threshold.setDate(Threshold.getDate() - NumOfDays)

            bot.con.query(`SELECT * FROM members me, payout pa WHERE pa.company = '${company}' AND me.id = pa.member_id AND pa.createdAt > '${Threshold.toISOString()}' ORDER BY pa.member_id DESC`, function (err, result, fields) { //get all their info into one array
                if (err) {
                    console.log(err);
                    return reject("There was an error getting members and payouts.")
                }

                let TopPlayers = []
                for (let i = 0; i < result.length; i++) {
                    const index = TopPlayers.indexOfId(result[i].in_game_id)
                    if (index > -1) {
                        TopPlayers[index].vouchers += result[i].vouchers
                    } else {
                        TopPlayers.push(result[i])
                    }
                }
                TopPlayers.sort(function (x, y) {
                    if (x.vouchers < y.vouchers) {
                        return 1;
                    }
                    if (x.vouchers > y.vouchers) {
                        return -1;
                    }
                    return 0;
                });

                const TopEmbed = new Discord.MessageEmbed()
                    .setTitle("Top Turnins over the past " + NumOfDays + " days")
                    .setColor("RANDOM")
                for (let i = 0; i < NumOfPlayers && i < TopPlayers.length; i++) {
                    TopEmbed.addField(TopPlayers[i].in_game_name + ` (${i + 1})`, functions.numberWithCommas(TopPlayers[i].vouchers), true)
                }
                return resolve(TopEmbed)
            })
        }
    })
}

module.exports.help = {
    name: "stats",
    aliases: [],
    usage: "<total|rts|pigs> <days|unpaid|top>",
    description: "Get company and voucher stats.",
    args: [{
            name: "total",
            description: "Get stats of both companies combined",
            type: 2,
            options: [{
                    name: "days",
                    description: "Get total vouchers and worth over the past number of days",
                    type: 1,
                    options: [{
                        name: "num",
                        description: "Number of days to look back to",
                        type: 4,
                        required: true,
                        missing: "Please specify the number of days to go over",
                        parse: (bot, message, args) => {
                            return args[1]
                        }
                    }],
                    parse: (bot, message, args) => {
                        return args[1] == parseInt(args[1]) ? "days" : null
                    }
                },
                {
                    name: "unpaid",
                    description: "Get the total amount and worth of unpaid vouchers",
                    type: 1,
                    options: [],
                    parse: (bot, message, args) => {
                        if (!args[1]) return null;
                        return args[1].toLowerCase() == "unpaid" ? "unpaid" : null;
                    }
                }
            ],
            parse: (bot, message, args) => {
                if (!args[0]) return null;
                return args[0].toLowerCase() == "total" ? "total" : null;
            }
        },
        {
            name: "rts",
            description: "Get stats of just rts",
            type: 2,
            options: [{
                    name: "days",
                    description: "Get total vouchers and worth over the past number of days",
                    type: 1,
                    options: [{
                        name: "num",
                        description: "Number of days to look back to",
                        type: 4,
                        required: true,
                        missing: "Please specify the number of days to go over",
                        parse: (bot, message, args) => {
                            return args[1]
                        }
                    }],
                    parse: (bot, message, args) => {
                        return args[1] == parseInt(args[1]) ? "days" : null
                    }
                },
                {
                    name: "unpaid",
                    description: "Get the total amount and worth of unpaid vouchers in rts",
                    type: 1,
                    options: [],
                    parse: (bot, message, args) => {
                        if (!args[1]) return null;
                        return args[1].toLowerCase() == "unpaid" ? "unpaid" : null;
                    }
                },
                {
                    name: "top",
                    description: "Get the top employees in RTS over the past days",
                    type: 1,
                    options: [{
                            name: "num_players",
                            description: "Number of players to return",
                            type: 4,
                            required: true,
                            missing: "Please specify the number of players to return",
                            parse: (bot, message, args) => {
                                return args[2]
                            }
                        },
                        {
                            name: "num_days",
                            description: "Number of days to look over",
                            type: 4,
                            required: true,
                            missing: "Please specify the number of days to look over",
                            parse: (bot, message, args) => {
                                return args[3]
                            }
                        }
                    ],
                    parse: (bot, message, args) => {
                        if (!args[1]) return null;
                        return args[1].toLowerCase() == "top" ? "top" : null
                    }
                }
            ],
            parse: (bot, message, args) => {
                if (!args[0]) return null;
                return args[0].toLowerCase() == "rts" ? "rts" : null;

            }
        },
        {
            name: "pigs",
            description: "Get stats of just pigs",
            type: 2,
            options: [{
                    name: "days",
                    description: "Get total vouchers and worth over the past number of days",
                    type: 1,
                    options: [{
                        name: "num",
                        description: "Number of days to look back to",
                        type: 4,
                        required: true,
                        missing: "Please specify the number of days to go over",
                        parse: (bot, message, args) => {
                            return args[1]
                        }
                    }],
                    parse: (bot, message, args) => {
                        return args[1] == parseInt(args[1]) ? "days" : null
                    }
                },
                {
                    name: "unpaid",
                    description: "Get the total amount and worth of unpaid vouchers in pigs",
                    type: 1,
                    options: [],
                    parse: (bot, message, args) => {
                        if (!args[1]) return null;
                        return args[1].toLowerCase() == "unpaid" ? "unpaid" : null;
                    }
                },
                {
                    name: "top",
                    description: "Get the top employees in PIGS over the past days",
                    type: 1,
                    options: [{
                            name: "num_players",
                            description: "Number of players to return",
                            type: 4,
                            required: true,
                            missing: "Please specify the number of players to return",
                            parse: (bot, message, args) => {
                                return args[2]
                            }
                        },
                        {
                            name: "num_days",
                            description: "Number of days to look over",
                            type: 4,
                            required: true,
                            missing: "Please specify the number of days to look over",
                            parse: (bot, message, args) => {
                                return args[3]
                            }
                        }
                    ],
                    parse: (bot, message, args) => {
                        if (!args[1]) return null;
                        return args[1].toLowerCase() == "top" ? "top" : null
                    }
                }
            ],
            parse: (bot, message, args) => {
                if (!args[0]) return null;
                return args[0].toLowerCase() == "pigs" ? "pigs" : null;
            }
        },
    ],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
    slash: true
};