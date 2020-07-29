const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!args[0]) args[0] = message.member.id //No args then set first arg to message author id

    const Response = functions.GetIDAndSearchColumn(message, args)
    if (Response.length == 0) return message.channel.send("Please specify who")
    const searchColumn = Response[0]
    const id = Response[1]

    const MemberDetails = await functions.GetMemberDetails(bot, searchColumn, id)
    if (!MemberDetails) return message.channel.send("Unable to find that member") //not in PIGS
    if (MemberDetails.pigs_total_vouchers < 6000) {
        var untilnext = 6000 - MemberDetails.pigs_total_vouchers
    } else if (MemberDetails.pigs_total_vouchers < 18000) {
        var untilnext = 18000 - MemberDetails.pigs_total_vouchers
    }else if (MemberDetails.pigs_total_vouchers < 38000) {
        var untilnext = 38000 - MemberDetails.pigs_total_vouchers
    } else if (MemberDetails.pigs_total_vouchers < 68000) {
        var untilnext = 68000 - MemberDetails.pigs_total_vouchers
    } else if (MemberDetails.pigs_total_vouchers < 150000) {
        var untilnext = 150000 - MemberDetails.pigs_total_vouchers
    } else if (MemberDetails.pigs_total_vouchers < 1500000) {
        var untilnext = 1500000 - MemberDetails.pigs_total_vouchers
    } else {
        return message.channel.send("You are at the top rank")
    }

    //10,000 stolen money = 75 pigs vouchers
    const stolenMoney = (untilnext / 75) * 10000
    const endStolen = functions.numberWithCommas(Math.ceil(stolenMoney / 10000) * 10000)

    message.channel.send(`To rank up you need ${functions.numberWithCommas(untilnext)} vouchers, that is ${endStolen} stolen money`)
}



module.exports.help = {
    name: "nextrank",
    usage: "{person id}",
    description: "Get how much stolen money you need to rank up",
    permission: "SEND_MESSAGES"
}