const Discord = require("discord.js");
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
    
    const MemberDetails = await functions.GetMemberDetails(bot, SearchColumn, ID); //get payout member
    if (!MemberDetails) return message.channel.send("Couldn't find that member")

    if (message.guild.id == botconfig.PIGSServer) { //PIGS server
        var CompanyName = "pigs"

        var voucherWorth = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
            if (playerTotalVouchers < 6000) { //Hustler
                var RankVouchers = 6000
                var rankWorth = 5000
            } else if (playerTotalVouchers < 18000) { //Pickpocket
                var RankVouchers = 18000
                var rankWorth = 6000

            } else if (playerTotalVouchers < 38000) { //Thief
                var RankVouchers = 38000
                var rankWorth = 7000
            } else if (playerTotalVouchers < 68000) { //Lawless
                var RankVouchers = 68000
                var rankWorth = 8000;
            } else if (playerTotalVouchers < 150000) { //Mastermind
                var RankVouchers = 150000
                var rankWorth = 9000
            } else {
                var RankVouchers = Infinity
                var rankWorth = 9500
            }

            rankVouchers = RankVouchers;

            if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                const NextRankVouchers = voucherWorth(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                const CurrentRankVouchers = (RankVouchers - playerTotalVouchers) * rankWorth
                return NextRankVouchers + CurrentRankVouchers
            } else { //don't rank up
                return voucherAmount * rankWorth
            }
        }

        var RankUp = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
            if (playerTotalVouchers < 6000) { //Hustler
                var RankVouchers = 6000
                var nextRank = "Pickpocket"
            } else if (playerTotalVouchers < 18000) { //Pickpocket
                var RankVouchers = 18000
                var nextRank = "Thief"

            } else if (playerTotalVouchers < 38000) { //Thief
                var RankVouchers = 38000
                var nextRank = "Lawless"
            } else if (playerTotalVouchers < 68000) { //Lawless
                var RankVouchers = 68000
                var nextRank = "Mastermind";
            } else if (playerTotalVouchers < 150000) { //Mastermind
                var RankVouchers = 150000
                var nextRank = "Overlord"
            } else {
                var RankVouchers = Infinity
                var nextRank = "Max"
            }

            if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                const rankUpAgain = RankUp(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                if (!rankUpAgain) {
                    return nextRank
                } else {
                    return rankUpAgain
                }
            } else { //don't rank up
                return false;
            }
        }

        var NewDeadline = function (MemberDetails) { //calculate new deadline
            const CurrentDeadline = new Date(MemberDetails.deadline)
            const D2 = new Date()
            let D3 = D2 - CurrentDeadline //difference between two dates
            if (D3 >= 0) { //if past deadline
                CurrentDeadline = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                D3 = D2 - CurrentDeadline //difference between two dates
            }
            if (D3 >= -45 * 24 * 60 * 60 * 1000) { //45 days till deadline
                if (voucherAmount > 60000) { //turnin in a lot
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                    return CurrentDeadline
                } else if (voucherAmount <= 60000 && voucherAmount > 30000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                    return CurrentDeadline
                } else if (voucherAmount <= 30000 && voucherAmount >= 15000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                    return CurrentDeadline
                } else if (voucherAmount <= 15000 && voucherAmount >= 6000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 14) //add 3 days
                    return CurrentDeadline
                } else {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 250))

                    return CurrentDeadline
                }
            } else { //plenty of time
                if (voucherAmount > 60000) { //turnin in a lot
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                    return CurrentDeadline
                } else if (voucherAmount <= 60000 && voucherAmount > 30000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                    return CurrentDeadline
                } else if (voucherAmount <= 30000 && voucherAmount >= 15000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                    return CurrentDeadline
                } else if (voucherAmount <= 15000 && voucherAmount >= 6000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 4) //add 3 days
                    return CurrentDeadline
                } else {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2000))

                    return CurrentDeadline
                }
            }
        }

        var Money = voucherWorth(MemberDetails.pigs_total_vouchers, voucherAmount)
        var DoRank = RankUp(MemberDetails.pigs_total_vouchers, voucherAmount)

    } else if (message.guild.id == botconfig.RTSServer) { //RTS server
        var CompanyName = "rts"

        var voucherWorth = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
            if (playerTotalVouchers < 9600) { //Initiate
                var RankVouchers = 9600
                var rankWorth = 5000
            } else if (playerTotalVouchers < 24000) { //Lead Foot
                var RankVouchers = 24000
                var rankWorth = 5500
            } else if (playerTotalVouchers < 52800) { //Wheelman
                var RankVouchers = 52800
                var rankWorth = 6000
            } else if (playerTotalVouchers < 117600) { //Legendary
                var RankVouchers = 117600
                var rankWorth = 7500;
            } else {
                var RankVouchers = Infinity
                var rankWorth = 8500
            }

            rankVouchers = RankVouchers;

            if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                const NextRankVouchers = voucherWorth(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                const CurrentRankVouchers = (RankVouchers - playerTotalVouchers) * rankWorth
                return NextRankVouchers + CurrentRankVouchers
            } else { //don't rank up
                return voucherAmount * rankWorth
            }
        }

        var RankUp = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
            if (playerTotalVouchers < 9600) { //Initiate
                var RankVouchers = 9600
                var nextRank = "Lead Foot"
            } else if (playerTotalVouchers < 24000) { //Lead Foot
                var RankVouchers = 24000
                var nextRank = "Wheelman"

            } else if (playerTotalVouchers < 52800) { //Wheelman
                var RankVouchers = 52800
                var nextRank = "Legendary"
            } else if (playerTotalVouchers < 117600) { //Legendary
                var RankVouchers = 117600
                var nextRank = "Speed Demon";
            } else {
                var RankVouchers = Infinity
                var nextRank = "Max"
            }

            if (playerTotalVouchers + voucherAmount >= RankVouchers) { //rank up
                const rankUpAgain = RankUp(playerTotalVouchers + RankVouchers - playerTotalVouchers, voucherAmount - (RankVouchers - playerTotalVouchers))
                if (!rankUpAgain) {
                    return nextRank
                } else {
                    return rankUpAgain
                }
            } else { //don't rank up
                return false;
            }
        }

        var NewDeadline = function (MemberDetails) {
            let CurrentDeadline = new Date(MemberDetails.deadline)
            const D2 = Date.now()
            let D3 = D2 - CurrentDeadline //difference between two dates
            if (D3 >= 0) { //if past deadline
                CurrentDeadline = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                D3 = D2 - CurrentDeadline //difference between two dates
            }
            if (D3 >= -45 * 24 * 60 * 60 * 1000) {
                if (voucherAmount > 60000) { //turnin in a lot
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                    return CurrentDeadline
                } else if (voucherAmount <= 60000 && voucherAmount > 30000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                    return CurrentDeadline
                } else if (voucherAmount <= 30000 && voucherAmount >= 15000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                    return CurrentDeadline
                } else if (voucherAmount <= 15000 && voucherAmount >= 6000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 14) //add 3 days
                    return CurrentDeadline
                } else {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 250))

                    return CurrentDeadline
                }
            } else {
                if (voucherAmount > 60000) { //turnin in a lot
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 8000) + 19) //add 9
                    return CurrentDeadline
                } else if (voucherAmount <= 60000 && voucherAmount > 30000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 4000) + 15) //add 3 days
                    return CurrentDeadline
                } else if (voucherAmount <= 30000 && voucherAmount >= 15000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2500) + 10) //add 3 days
                    return CurrentDeadline
                } else if (voucherAmount <= 15000 && voucherAmount >= 6000) {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 750) + 4) //add 3 days
                    return CurrentDeadline
                } else {
                    CurrentDeadline.setDate(CurrentDeadline.getDate() + Math.ceil(voucherAmount / 2000))

                    return CurrentDeadline
                }
            }
        }

        var Money = voucherWorth(MemberDetails.rts_total_vouchers, voucherAmount)
        var DoRank = RankUp(MemberDetails.rts_total_vouchers, voucherAmount)
    }

    //figure out voucher worth and rank up

    const payoutEmbed = new Discord.MessageEmbed()
        .setTitle(`Payout for ${MemberDetails.in_game_name}`)
        .addField(`Money`, `$${functions.numberWithCommas(Money)}`)

    if (!DoRank) { //if not rank up
        payoutEmbed.setColor("RED")
        payoutEmbed.addField(`Rank up?`, "NO")
    } else { //rank up
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
                //update the manager with the new cashout
                if (err) return console.log(err)
                if (result.affectedRows == 0) { //if no manager
                    bot.con.query(`INSERT INTO managers (discord_id, ${CompanyName}_cashout, ${CompanyName}_cashout_worth) VALUES ('${message.author.id}', '${voucherAmount}', '${Money}')`, function (err) {
                        if (err) return console.log(err)
                        //add manager to table
                    })
                }
                //update the members company data
                bot.con.query(`UPDATE ${CompanyName} SET ${CompanyName}_total_vouchers = ${CompanyName}_total_vouchers + '${voucherAmount}', ${CompanyName}_total_money = ${CompanyName}_total_money + '${Money}' WHERE in_game_id = '${MemberDetails.in_game_id}'`, function (err, result, fields) {
                    if (err) return console.log(err)
                    //add to payout table
                    bot.con.query(`INSERT INTO payout(manager_id, player_id, current_company, vouchers_turned_in, payed_money) VALUES('${message.author.id}', '${MemberDetails.in_game_id}', '${CompanyName}', '${voucherAmount}', '${Money}')`, function (err) {
                        if (err) return console.log(err)

                        //update deadline
                        bot.con.query(`UPDATE members SET deadline = '${NewDeadline(memberDetails).toISOString().slice(0, 19).replace('T', ' ')}', last_turnin = '${CurrentDate}' WHERE in_game_id = '${MemberDetails.in_game_id}'`, function (err, result, fields) {
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