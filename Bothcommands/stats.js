const Discord = require("discord.js") //discord
const botconfig = require("../botconfig.json"); //handy info
const functions = require("../functions.js") //Handy functions
Array.prototype.indexOfId = function (id) {
    for (var i = 0; i < this.length; i++)
        if (this[i].in_game_id === id)
            return i;
    return -1;
}
module.exports.run = async (bot, message, args) => {
    if (message.author.id != "330000865215643658" && message.author.id != "404650985529540618") return message.channel.send("You can't do that")

    let company;
    if (args[0].toLowerCase() == "total") {
        if (parseInt(args[1])) {
            const Threshold = new Date()
            Threshold.setDate(Threshold.getDate() - parseInt(args[1]))
            bot.con.query(`SELECT * FROM payout WHERE time > '${Threshold.toISOString()}'`, function (err, result, fields) { //get all their info into one array
                if (err) return console.log(err);
                let TotalVouchers = 0;
                let TotalValue = 0;
                result.forEach(member => {
                    TotalVouchers += member.vouchers_turned_in;

                    TotalValue += member.payed_money;
                });

                const statEmbed = new Discord.RichEmbed()
                    .setTitle(`Total vouchers between now and ${parseInt(args[1])} days ago`)
                    .setColor("RANDOM")
                    .addField("Total Vouchers", functions.numberWithCommas(TotalVouchers), true)
                    .addField("Cashout value", "$" + functions.numberWithCommas(Math.abs((TotalVouchers * 10000) - (TotalVouchers * 10000) - TotalValue)), true)
                    .addField("Cashout Profit", "$" + functions.numberWithCommas((TotalVouchers * 10000) - TotalValue), true)
                message.channel.send(statEmbed)
            })
        } else if (args[1].toLowerCase() == "unpaid") {
            bot.con.query(`SELECT * FROM managers`, function (err, result, fields) { //get all their info into one array
                if (err) return console.log(err);
                let TotalVouchers = 0;
                let TotalValue = 0;
                result.forEach(member => {
                    TotalVouchers += member.rts_cashout;
                    TotalVouchers += member.pigs_cashout;

                    TotalValue += member.rts_cashout_worth;
                    TotalValue += member.pigs_cashout_worth;
                });

                const statEmbed = new Discord.RichEmbed()
                    .setTitle(`Total unpaid vouchers with managers`)
                    .setColor("RANDOM")
                    .addField("Total Vouchers", functions.numberWithCommas(TotalVouchers), true)
                    .addField("Total value", "$" + functions.numberWithCommas(TotalValue), true)
                message.channel.send(statEmbed)
            })
        }
        return;
    } else if (args[0].toLowerCase() == "rts") {
        company = "rts"
    } else if (args[0].toLowerCase() == "pigs") {
        company = "pigs"
    } else {
        return message.channel.send("Invalid company arg. Must be total rts or pigs")
    }

    if (parseInt(args[1])) {
        const Threshold = new Date()
        Threshold.setDate(Threshold.getDate() - parseInt(args[1]))
        bot.con.query(`SELECT * FROM payout WHERE time > '${Threshold.toISOString()}' AND current_company = '${company}'`, function (err, result, fields) { //get all their info into one array
            if (err) return console.log(err);
            let TotalVouchers = 0;
            let TotalValue = 0;
            result.forEach(member => {
                TotalVouchers += member.vouchers_turned_in;

                TotalValue += member.payed_money;
            });

            const statEmbed = new Discord.RichEmbed()
                .setTitle(`Total vouchers between now and ${parseInt(args[1])} days ago for ${company.toUpperCase()}`)
                .setColor("RANDOM")
                .addField("Total Vouchers", functions.numberWithCommas(TotalVouchers), true)
                .addField("Cashout value", "$" + functions.numberWithCommas(Math.abs((TotalVouchers * 10000) - (TotalVouchers * 10000) - TotalValue)), true)
                .addField("Cashout Profit", "$" + functions.numberWithCommas((TotalVouchers * 10000) - TotalValue), true)
            message.channel.send(statEmbed)
        })
    } else if (args[1].toLowerCase() == "unpaid") {
        bot.con.query(`SELECT * FROM managers`, function (err, result, fields) { //get all their info into one array
            if (err) return console.log(err);
            let TotalVouchers = 0;
            let TotalValue = 0;
            result.forEach(member => {
                TotalVouchers += member[`${company}_cashout`];

                TotalValue += member[`${company}_cashout_worth`];
            });

            const statEmbed = new Discord.RichEmbed()
                .setTitle(`Total unpaid vouchers with ${company.toUpperCase()}'s managers`)
                .setColor("RANDOM")
                .addField("Total Vouchers", functions.numberWithCommas(TotalVouchers), true)
                .addField("Total value", "$" + functions.numberWithCommas(TotalValue), true)
            message.channel.send(statEmbed)
        })
    } else if (args[1].toLowerCase() == "top") {
        const NumOfPlayers = parseInt(args[2])
        const NumOfDays = parseInt(args[3]);
        if (!NumOfDays || !NumOfPlayers) return message.channel.send(".stats [company] top [num of players] [num of days]")
        if (NumOfPlayers > 25) return message.channel.send("Too many players")
        const Threshold = new Date()
        Threshold.setDate(Threshold.getDate() - NumOfDays)

        bot.con.query(`SELECT * FROM members, payout WHERE payout.current_company = '${company}' AND members.in_game_id = payout.player_id AND payout.time > '${Threshold.toISOString()}' ORDER BY payout.player_id DESC`, function (err, result, fields) { //get all their info into one array
            if (err) return console.log(err);
            let TopPlayers = []
            for (let i = 0; i < result.length; i++) {
                const index = TopPlayers.indexOfId(result[i].in_game_id)
                if (index > -1) {
                    TopPlayers[index].vouchers_turned_in += result[i].vouchers_turned_in
                } else {
                    TopPlayers.push(result[i])
                }
            }
            TopPlayers.sort(function (x, y) {
                if (x.vouchers_turned_in < y.vouchers_turned_in) {
                    return 1;
                }
                if (x.vouchers_turned_in > y.vouchers_turned_in) {
                    return -1;
                }
                return 0;
            });

            const TopEmbed = new Discord.RichEmbed()
                .setTitle("Top Turnins over the past " + NumOfDays + " days")
                .setColor("RANDOM")
            for (let i = 0; i < NumOfPlayers && i < TopPlayers.length; i++) {
                TopEmbed.addField(TopPlayers[i].in_game_name + ` (${i + 1})`, functions.numberWithCommas(TopPlayers[i].vouchers_turned_in), true)
            }
            message.channel.send(TopEmbed)
        })

    }
}

module.exports.help = {
    name: "stats",
    usage: "",
    description: "Say Hi",
    permission: "SEND_MESSAGES"
}