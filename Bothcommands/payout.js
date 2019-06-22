const Discord = require("discord.js");
const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You aren't allowed to do that"); //Can't kick members

    if (!args[1]) return message.channel.send(".payout [id] [amount]") //not enough args

    const Response = functions.GetIDAndSearchColumn(message, args);
    const SearchColumn = Response[0]
    const ID = Response[1]

    const voucherAmount = functions.ConvertNumber(args[1]); //to int

    if (message.guild.id == botconfig.PIGSServer) { //PIGS server
        var MainSheet = botconfig.PIGSSheet
        var AppSheetNameRange = botconfig.PIGSAppSheetNameRange
        var EmployeeRangeStartingRow = botconfig.PIGSEmployeeRangeStartingRow
        var EmployeeRange = botconfig.PIGSEmployeeRange
        var DiscordIndex = botconfig.PIGSEmployeeRangeDiscordIndex
        var VoucherSheet = botconfig.PIGSVoucher
        var RankIndex = botconfig.PIGSEmployeeRangeRankIndex
        var DeadlineColumn = botconfig.PIGSDeadlineColumn
        var InactiveRole = botconfig.PIGSInavtiveRole
    } else if (message.guild.id == botconfig.RTSServer) { //RTS server
        var MainSheet = botconfig.RTSSheet
        var AppSheetNameRange = botconfig.RTSAppSheetNameRange
        var EmployeeRangeStartingRow = botconfig.RTSEmployeeRangeStartingRow
        var EmployeeRange = botconfig.RTSEmployeeRange
        var DiscordIndex = botconfig.RTSEmployeeRangeDiscordIndex
        var VoucherSheet = botconfig.RTSVoucher
        var RankIndex = botconfig.RTSEmployeeRangeRankIndex
        var DeadlineColumn = botconfig.RTSDeadlineColumn
        var InactiveRole = botconfig.RTSInavtiveRole
    }

    async function payout(auth) {
        const AppSheetName = await functions.GetAppSheetName(auth, MainSheet, AppSheetNameRange, message.author.id, message.channel) //Get app sheet name

        const MemberData = await functions.GetMemberDetails(auth, MainSheet, EmployeeRange, SearchColumn, ID, message.channel) //get member details
        if (!MemberData) return message.channel.send("Unable to find that member") //no member

        const DiscordMember = message.guild.members.get(MemberData[DiscordIndex]) //get discord member

        const PayoutInfo = await functions.AddPayoutToVoucherLogs(auth, VoucherSheet, AppSheetName, MemberData, voucherAmount, message.channel) //Add to manager voucher logs

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
                functions.RemovePayout(auth, VoucherSheet, AppSheetName, PayoutInfo[5]) //remove the payout
                return; //stop
            } else {
                if (!PayoutInfo[3]) { //If not ranked up
                    let newVoucherValue; //New voucher value
                    let column; //Column that the new voucher value goes too
                    switch (MemberData[RankIndex].toLowerCase()) { //What rank they are
                        case "hustler":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeHustlerVouchersIndex]); //amount of new vouchers + amount of old vouchers
                            column = "N" //hustler column
                            break;
                        case "pickpocket":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangePickPocketVouchersIndex]);
                            column = "O"
                            break;
                        case "thief":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeThiefVouchersIndex]);
                            column = "P"
                            break;
                        case "lawless":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeLawlessVouchersIndex]);
                            column = "Q";
                            break;
                        case "mastermind":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeMastermindVouchersIndex]);
                            column = "R";
                            break;
                        case "overlord":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeOverlordVouchersIndex]);
                            column = "S";
                            break;
                        case "initiate":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeInitiateVouchersIndex]);
                            column = "L"
                            break;
                        case "lead foot":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeLeadfootVouchersIndex]);
                            column = "M"
                            break;
                        case "wheelman":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeWheelmanVouchersIndex]);
                            column = "N"
                            break;
                        case "legendary":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeLegendaryVouchersIndex]);
                            column = "O";
                            break;
                        case "speed demon":
                            newVoucherValue = voucherAmount + functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeSpeeddemonVouchersIndex]);
                            column = "P";
                            break;
                    }
                    await functions.AddPayoutToSheet(auth, message.channel, MainSheet, EmployeeRange, EmployeeRangeStartingRow, column, newVoucherValue, SearchColumn, ID, PayoutInfo[4], DeadlineColumn) //add the payout to the sheet
                    if (DiscordMember.roles.has(InactiveRole)) DiscordMember.removeRole(InactiveRole) //if they have inactive role remove it
                } else { //ranked up
                    let firstColumn; //column of old rank
                    let lastColumn; //column of new rank
                    let lastVouchers; //amount of vouchers in old rank
                    switch (MemberData[RankIndex].toLowerCase()) { //old rank
                        case "hustler":
                            firstColumn = "N";
                            lastColumn = "O";
                            lastVouchers = functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeHustlerVouchersIndex]) + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeUntilNextIndex]); //Old rank vouchers + until next rank up
                            break;
                        case "pickpocket":
                            firstColumn = "O";
                            lastColumn = "P";
                            lastVouchers = functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangePickPocketVouchersIndex]) + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeUntilNextIndex]);
                            break;
                        case "thief":
                            firstColumn = "P";
                            lastColumn = "Q";
                            lastVouchers = functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeThiefVouchersIndex]) + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeUntilNextIndex]);
                            break;
                        case "lawless":
                            firstColumn = "Q";
                            lastColumn = "R";
                            lastVouchers = functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeLawlessVouchersIndex]) + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeUntilNextIndex]);
                            break;
                        case "mastermind":
                            firstColumn = "R";
                            lastColumn = "S";
                            lastVouchers = functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeMastermindVouchersIndex]) + functions.ConvertNumber(MemberData[botconfig.PIGSEmployeeRangeUntilNextIndex])
                            break;
                        case "initiate":
                            firstColumn = "L";
                            lastColumn = "M";
                            lastVouchers = functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeInitiateVouchersIndex]) + functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeUntilNextIndex]);
                            break;
                        case "lead foot":
                            firstColumn = "M";
                            lastColumn = "N";
                            lastVouchers = functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeLeadfootVouchersIndex]) + functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeUntilNextIndex]);
                            break;
                        case "wheelman":
                            firstColumn = "N";
                            lastColumn = "O";
                            lastVouchers = functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeWheelmanVouchersIndex]) + functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeUntilNextIndex]);
                            break;
                        case "legendary":
                            firstColumn = "O";
                            lastColumn = "P";
                            lastVouchers = functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeLegendaryVouchersIndex]) + functions.ConvertNumber(MemberData[botconfig.RTSEmployeeRangeUntilNextIndex]);
                            break;
                    }
                    await functions.AddPayoutToSheet(auth, message.channel, MainSheet, EmployeeRange, EmployeeRangeStartingRow, firstColumn, lastVouchers, SearchColumn, ID, PayoutInfo[4], DeadlineColumn, lastColumn, PayoutInfo[3]) //add to member sheet
                    if (DiscordMember.roles.has(InactiveRole)) DiscordMember.removeRole(InactiveRole) //if has inactive role remove it
                }
            }
        })
    }

    authentication.authenticate().then((auth) => {
        payout(auth);
    });
}

module.exports.help = {
    name: "payout",
    usage: "[id] [voucher amount]",
    description: "Fill out spreadsheet for voucher turnin",
    permission: "KICK_MEMBERS"
}