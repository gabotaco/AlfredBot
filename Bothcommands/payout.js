const Discord = require("discord.js");
const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You aren't allowed to do that"); //Can't kick members

    if (!args[1]) return message.channel.send(".payout [id] [amount]") //not enough args

    const Response = functions.GetIDAndSearchColumn(message, args);
    if (Response.length == 0) return message.channel.send("Please specify who you are paying out")
    const SearchColumn = Response[0]
    const ID = Response[1]

    const voucherAmount = functions.ConvertNumber(args[1]); //to int

    if (!voucherAmount) return message.channel.send("Please specify the voucher amount")

    if (message.guild.id == botconfig.PIGSServer) { //PIGS server
        var CompanyName = "pigs"

        var VoucherWorth = function (MemberDetails) {
            if (MemberDetails.pigs_total_vouchers < 6000) { //Hustler
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 6000) {
                    const NextRankVouchers = ((MemberDetails.pigs_total_vouchers + voucherAmount) - 6000) * 6000
                    const CurrentRankVouchers = (6000 - MemberDetails.pigs_total_vouchers) * 5000
                    return NextRankVouchers + CurrentRankVouchers
                } else {
                    return voucherAmount * 5000
                }
            } else if (MemberDetails.pigs_total_vouchers < 18000) { //Pickpocket
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 18000) {
                    const NextRankVouchers = ((MemberDetails.pigs_total_vouchers + voucherAmount) - 18000) * 7000
                    const CurrentRankVouchers = (18000 - MemberDetails.pigs_total_vouchers) * 6000
                    return NextRankVouchers + CurrentRankVouchers

                } else {
                    return voucherAmount * 6000
                }
            } else if (MemberDetails.pigs_total_vouchers < 38000) { //Thief
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 38000) {
                    const NextRankVouchers = ((MemberDetails.pigs_total_vouchers + voucherAmount) - 38000) * 8000
                    const CurrentRankVouchers = (38000 - MemberDetails.pigs_total_vouchers) * 7000
                    return NextRankVouchers + CurrentRankVouchers

                } else {
                    return voucherAmount * 7000
                }
            } else if (MemberDetails.pigs_total_vouchers < 68000) { //Lawless
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 68000) {
                    const NextRankVouchers = ((MemberDetails.pigs_total_vouchers + voucherAmount) - 68000) * 9000
                    const CurrentRankVouchers = (68000 - MemberDetails.pigs_total_vouchers) * 8000
                    return NextRankVouchers + CurrentRankVouchers

                } else {
                    return voucherAmount * 8000
                }
            } else if (MemberDetails.pigs_total_vouchers < 150000) { //Mastermind
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 150000) {
                    const NextRankVouchers = ((MemberDetails.pigs_total_vouchers + voucherAmount) - 150000) * 9500
                    const CurrentRankVouchers = (150000 - MemberDetails.pigs_total_vouchers) * 9000
                    return NextRankVouchers + CurrentRankVouchers

                } else {
                    return voucherAmount * 9000
                }
            } else {
                return voucherAmount * 9500;
            }
        }

        var RankUp = function (MemberDetails) {
            if (MemberDetails.pigs_total_vouchers < 6000) { //Hustler
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 6000) {
                    return "Pickpocket";
                } else {
                    return false;
                }
            } else if (MemberDetails.pigs_total_vouchers < 18000) { //Pickpocket
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 18000) {
                    return "Thief";

                } else {
                    return false;
                }
            } else if (MemberDetails.pigs_total_vouchers < 38000) { //Thief
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 38000) {
                    return "Lawless";

                } else {
                    return false;
                }
            } else if (MemberDetails.pigs_total_vouchers < 68000) { //Lawless
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 68000) {
                    return "Mastermind";

                } else {
                    return false;
                }
            } else if (MemberDetails.pigs_total_vouchers < 150000) { //Mastermind
                if (MemberDetails.pigs_total_vouchers + voucherAmount >= 150000) {
                    return "Overlord";

                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        var NewDeadline = function (MemberDetails) {
            const CurrentDeadline = new Date(MemberDetails.deadline)
            const D2 = new Date()
            const D3 = D2 - CurrentDeadline //difference between two dates
            if (D3 <= 45) {
                if (voucherAmount > 1200000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/2000) + 9)
                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                } else if (voucherAmount <=1200000 && voucherAmount >= 100000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/1000) + 3)
                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                } else {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/250))

                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                }
            } else {
                if (voucherAmount >1200000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/3000)+2)

                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                } else if (voucherAmount <= 1200000 && voucherAmount >= 100000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/2000))

                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                } else {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/1000))

                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                }
            }
        }
    } else if (message.guild.id == botconfig.RTSServer) { //RTS server
        var CompanyName = "rts"

        var VoucherWorth = function (MemberDetails) {
            if (MemberDetails.rts_total_vouchers < 9600) { //Initiate
                if (MemberDetails.rts_total_vouchers + voucherAmount >= 9600) {
                    const NextRankVouchers = ((MemberDetails.rts_total_vouchers + voucherAmount) - 9600) * 5500
                    const CurrentRankVouchers = (9600 - MemberDetails.rts_total_vouchers) * 5000
                    return NextRankVouchers + CurrentRankVouchers
                } else {
                    return voucherAmount * 5000
                }
            } else if (MemberDetails.rts_total_vouchers < 24000) { //Lead Foot
                if (MemberDetails.rts_total_vouchers + voucherAmount >= 24000) {
                    const NextRankVouchers = ((MemberDetails.rts_total_vouchers + voucherAmount) - 24000) * 6000
                    const CurrentRankVouchers = (24000 - MemberDetails.rts_total_vouchers) * 5500
                    return NextRankVouchers + CurrentRankVouchers

                } else {
                    return voucherAmount * 5500
                }
            } else if (MemberDetails.rts_total_vouchers < 52800) { //Wheelman
                if (MemberDetails.rts_total_vouchers + voucherAmount >= 52800) {
                    const NextRankVouchers = ((MemberDetails.rts_total_vouchers + voucherAmount) - 52800) * 7500
                    const CurrentRankVouchers = (52800 - MemberDetails.rts_total_vouchers) * 6000
                    return NextRankVouchers + CurrentRankVouchers

                } else {
                    return voucherAmount * 6000
                }
            } else if (MemberDetails.rts_total_vouchers < 117600) { //Legendary
                if (MemberDetails.rts_total_vouchers + voucherAmount >= 117600) {
                    const NextRankVouchers = ((MemberDetails.rts_total_vouchers + voucherAmount) - 117600) * 8500
                    const CurrentRankVouchers = (117600 - MemberDetails.rts_total_vouchers) * 7500
                    return NextRankVouchers + CurrentRankVouchers

                } else {
                    return voucherAmount * 7500
                }
            } else { //speed demon
                return voucherAmount * 8500
            }
        }

        var RankUp = function (MemberDetails) {
            if (MemberDetails.rts_total_vouchers < 9600) { //Initiate
                if (MemberDetails.rts_total_vouchers + voucherAmount >= 9600) {
                    return "Lead Foot";
                } else {
                    return false;
                }
            } else if (MemberDetails.rts_total_vouchers < 24000) { //Lead Foot
                if (MemberDetails.rts_total_vouchers + voucherAmount >= 24000) {
                    return "Wheelman";

                } else {
                    return false;
                }
            } else if (MemberDetails.rts_total_vouchers < 52800) { //Wheelman
                if (MemberDetails.rts_total_vouchers + voucherAmount >= 52800) {
                    return "Legendary";

                } else {
                    return false
                }
            } else if (MemberDetails.rts_total_vouchers < 117600) { //Legendary
                if (MemberDetails.rts_total_vouchers + voucherAmount >= 117600) {
                    return "Speed Demon";

                } else {
                    return false;
                }
            } else { //speed demon
                return false;
            }
        }

        var NewDeadline = function (MemberDetails) {
            const CurrentDeadline = new Date(MemberDetails.deadline)
            const D2 = new Date()
            const D3 = D2 - CurrentDeadline //difference between two dates
            if (D3 <= 45) {
                if (voucherAmount > 1200000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/2000) + 9)
                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                } else if (voucherAmount <=1200000 && voucherAmount >= 1000000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/1000) + 3)
                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                } else {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/250))

                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                }
            } else {
                if (voucherAmount >1200000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/3000)+2)

                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                } else if (voucherAmount <= 1200000 && voucherAmount >= 100000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/2000))

                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                } else {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount/1000))

                    return CurrentDeadline.toISOString().slice(0, 19).replace('T', ' ');
                }
            }
        }
    }

    const MemberDetails = await functions.GetMemberDetails(bot, message.channel, SearchColumn, ID);
    if (!MemberDetails) return message.channel.send("Couldn't find that member")

    //figure out voucher worth and rank up
    const Money = VoucherWorth(MemberDetails);
    const DoRank = RankUp(MemberDetails);

    const payoutEmbed = new Discord.RichEmbed()
    .setTitle(`Payout for ${MemberDetails.in_game_name}`)
    .addField(`Money`, `$${functions.numberWithCommas(Money)}`)
    if (!DoRank) {
        payoutEmbed.setColor("RED")
        payoutEmbed.addField(`Rank up?`, "NO")
    } else {
        payoutEmbed.setColor("GREEN")
        payoutEmbed.addField("Rank up?", "YES")
        payoutEmbed.addField("Rank up to", DoRank)
    }

    message.channel.send(payoutEmbed)
    


    message.channel.send("Please confirm the payout. Say either \"yes\" or \"no\"") //ask to confirm
    let confirmed = true; //start off confirmed
    const confirmation = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { //30000 ms to cancel payout
        time: 30000
    });
    confirmation.on('collect', msg => {
        if (msg.content.toLowerCase() == "yes" || msg.content.toLowerCase() == "y") { //if they confirm
            confirmed = true; //confirmed
            confirmation.stop() //stop
        } else if (msg.content.toLowerCase() == "no" || msg.content.toLowerCase() == "n") { //if they cancel
            confirmed = false; //not confirmed
            confirmation.stop() //stop
        }
    })
    confirmation.on("end", async collected => {
        if (!confirmed) { //if cancelled
            message.channel.send("Cancelled")
            return; //stop
        } else {
            const CurrentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

            bot.con.query(`UPDATE managers SET ${CompanyName}_cashout = ${CompanyName}_cashout + ${voucherAmount}, ${CompanyName}_cashout_worth = ${CompanyName}_cashout_worth + ${Money} WHERE discord_id = '${message.author.id}'`, function (err, result, fields) {
                if (err) return console.log(err)
                bot.con.query(`UPDATE ${CompanyName} SET ${CompanyName}_total_vouchers = ${CompanyName}_total_vouchers + '${voucherAmount}', ${CompanyName}_total_money = ${CompanyName}_total_money + '${Money}' WHERE in_game_id = '${MemberDetails.in_game_id}'`, function (err, result, fields) {
                    if (err) return console.log(err)
                    bot.con.query(`INSERT INTO payout(manager_id, player_id, current_company, vouchers_turned_in, payed_money) VALUES('${message.author.id}', '${MemberDetails.in_game_id}', '${CompanyName}', '${voucherAmount}', '${Money}')`, function (err) {
                        if (err) return console.log(err)
                        bot.con.query(`UPDATE members SET deadline = '${NewDeadline(MemberDetails)}', last_turnin = '${CurrentDate}' WHERE in_game_id = '${MemberDetails.in_game_id}'`, function (err, result, fields) {
                            if (err) return console.log(err)
                            message.channel.send("Success!")
                        })
                    })
                })
            })
        }
    })
}

module.exports.help = {
    name: "payout",
    usage: "[id] [voucher amount]",
    description: "Fill out spreadsheet for voucher turnin",
    permission: "KICK_MEMBERS"
}