const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

const pendingPayouts = {}
module.exports.run = async (bot, args) => {
    return new Promise(async (resolve, reject) => {
        if (args.amount) {
            if (pendingPayouts[args.author_id]) return resolve("Please confirm or deny your last payout.")
            const ID = args.id || args.member;
            const SearchColumn = functions.GetSearchColumn(ID);
    
            const voucherAmount = functions.ConvertNumber(args.amount); //to int
    
            const MemberDetails = await functions.GetMemberDetails(bot.con, SearchColumn, ID); //get payout member
            if (!MemberDetails) return resolve("Couldn't find that member")
    
            if (args.guild_id == botconfig.PIGSServer) { //PIGS server
                var CompanyName = "pigs"
    
                var voucherWorth = function (playerTotalVouchers, voucherAmount) { //get how much to pay the person
                    if (playerTotalVouchers < 6000) { //Hustler
                        var RankVouchers = 6000
                        var rankWorth = 3500
                    } else if (playerTotalVouchers < 18000) { //Pickpocket
                        var RankVouchers = 18000
                        var rankWorth = 4000
                    } else if (playerTotalVouchers < 38000) { //Thief
                        var RankVouchers = 38000
                        var rankWorth = 5000
                    } else if (playerTotalVouchers < 68000) { //Lawless
                        var RankVouchers = 68000
                        var rankWorth = 6000;
                    } else if (playerTotalVouchers < 150000) { //Mastermind
                        var RankVouchers = 150000
                        var rankWorth = 7000
                    } else if (playerTotalVouchers < 1500000) { //Overlord
                        var RankVouchers = 1500000
                        var rankWorth = 8500
                    } else {
                        var RankVouchers = Infinity
                        var rankWorth = 9000
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
                    } else if (playerTotalVouchers < 1500000) { //Overlord
                        var RankVouchers = 1500000
                        var nextRank = "Swine"
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
    
            } else if (args.guild_id == botconfig.RTSServer) { //RTS server
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
    
            resolve([payoutEmbed, args.slash? "<@" + args.author_id +"> Please `/payout (c)onfirm` or `/payout (d)eny` to perform this payout." : "Please `.payout (c)onfirm` or `.payout (d)eny` to perform this payout."])
            pendingPayouts[args.author_id] = {
                "CompanyName": CompanyName,
                "voucherAmount": voucherAmount,
                "Money": Money,
                "in_game_id": MemberDetails.in_game_id,
                "member_id": MemberDetails.id,
                "NewDeadline": NewDeadline(MemberDetails).toISOString().slice(0, 19).replace('T', ' '),
                "CurrentDate": new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
        } else {
            if (!pendingPayouts[args.author_id]) return resolve("You have no pending payouts.")
            if (args.sub_command == "deny") { //if cancelled
                resolve("Payout cancelled")
                delete pendingPayouts[args.author_id]
                return; //stop
            } else {
                const pendingPayout = pendingPayouts[args.author_id];

                bot.con.query(`SELECT id FROM members WHERE discord_id = '${args.author_id}'`, function (err, member, fields) {
                    if (err) {
                        console.log(err)
                        return reject("Unable to get the managers member row");
                    }
                    if (member.length == 0) {
                        return reject("Could not find that managers member field");
                    } else {
                        bot.con.query(`UPDATE managers SET ${pendingPayout.CompanyName}_cashout = ${pendingPayout.CompanyName}_cashout + ${pendingPayout.voucherAmount}, ${pendingPayout.CompanyName}_cashout_worth = ${pendingPayout.CompanyName}_cashout_worth + ${pendingPayout.Money} WHERE member_id = '${member[0].id}'`, function (err, result, fields) {
                            //update the manager with the new cashout
                            if (err) {
                                console.log(err)
                                return reject("Unable to updated the managers table. No data was added.")
                            }
                            if (result.affectedRows == 0) { //if no manager
                                bot.con.query(`INSERT INTO managers (member_id, ${pendingPayout.CompanyName}_cashout, ${pendingPayout.CompanyName}_cashout_worth) VALUES ('${member[0].id}', '${pendingPayout.voucherAmount}', '${pendingPayout.Money}')`, function (err) {
                                    if (err) {
                                        console.log(err)
                                        return reject("Unable to add you as a manager.")
                                    }
                                    //add manager to table
                                })
                            } 
                            //update the members company data
                            bot.con.query(`UPDATE ${pendingPayout.CompanyName} SET ${pendingPayout.CompanyName}_total_vouchers = ${pendingPayout.CompanyName}_total_vouchers + '${pendingPayout.voucherAmount}', ${pendingPayout.CompanyName}_total_money = ${pendingPayout.CompanyName}_total_money + '${pendingPayout.Money}' WHERE member_id = '${pendingPayout.member_id}'`, function (err, result, fields) {
                                if (err) {
                                    console.log(err)
                                    return reject("Unable to add vouchers to the member. WARNING MANAGERS TABLE WAS UPDATED")
                                }
                                //add to payout table
                                bot.con.query(`INSERT INTO payout(manager_id, member_id, company, amount, worth) VALUES ('${member[0].id}', '${pendingPayout.member_id}', '${pendingPayout.CompanyName}', '${pendingPayout.voucherAmount}', '${pendingPayout.Money}')`, function (err) {
                                    if (err) {
                                        console.log(err)
                                        return reject("Unable to add this payout to payouts table. WARNING MANAGERS AND COMPANY TABLE WERE UPDATED")
                                    }
                                    //update deadline
                                    bot.con.query(`UPDATE members SET deadline = '${pendingPayout.NewDeadline}', last_turnin = '${pendingPayout.CurrentDate}' WHERE id = '${pendingPayout.member_id}'`, function (err, result, fields) {
                                        if (err) {
                                            console.log(err)
                                            return reject("Unable to update members deadline and last turning. WARNING MANAGERS, COMPANY, AND PAYOUT TABLE WERE UPDATED");
                                        }
                                        functions.CheckForActive(bot, 'in_game_id', pendingPayout.in_game_id).then(() => {
                                            delete pendingPayouts[args.author_id]
                                            return resolve("Payout performed.")
                                        })
                                    })
                                })
                            })
                        })
                    }
                })
            }
        }
    })
}

module.exports.help = {
    name: "payout",
    aliases: [],
    usage: "<member OR confirm|deny> <voucher amount>",
    description: "Calculate payout and rank up of a member when they turn in vouchers",
    args: [{
            name: "create",
            description: "Make a payout",
            type: 2,
            options: [{
                    name: "id",
                    description: "Payout a person using their ID",
                    type: 1,
                    options: [{
                            name: "id",
                            description: "Their in game id or discord id",
                            type: 4,
                            required: true,
                            missing: "Please specify another employee",
                            parse: (bot, message, args) => {
                                if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
                                return args[0]
                            }
                        },
                        {
                            name: "amount",
                            description: "How many vouchers they turned in",
                            type: 4,
                            required: true,
                            missing: "Please specify the number of vouchers",
                            parse: (bot, message, args) => {
                                return args[1]
                            }
                        }
                    ],
                },
                {
                    name: "discord",
                    description: "Set a persons deadline using their discord",
                    type: 1,
                    options: [{
                            name: "member",
                            description: "the other discord user",
                            type: 6,
                            required: true,
                            missing: "Please specify another employee",
                            parse: (bot, message, args) => {
                                if (message.mentions.members.first()) args[0] = message.mentions.members.first().id;
                                return args[0]
                            }
                        },
                        {
                            name: "amount",
                            description: "How many vouchers they turned in",
                            type: 4,
                            required: true,
                            missing: "Please specify the number of vouchers",
                            parse: (bot, message, args) => {
                                return args[1]
                            }
                        }
                    ]
                }
            ]
        },
        {
            name: "confirm",
            description: "Confirm your created payout",
            type: 1,
            options: [],
            parse: (bot, message, args) => {
                if (!args[0]) return null;
                return args[0].toLowerCase() == "c" || args[0].toLowerCase() == 'confirm' ? "confirm" : null
            }
        },
        {
            name: "deny",
            description: "Deny your created payout",
            type: 1,
            options: [],
            parse: (bot, message, args) => {
                if (!args[0]) return null;
                return args[0].toLowerCase() == "d" || args[0].toLowerCase() == 'deny' ? "deny" : null
            }
        }
    ],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
    slash: true
}