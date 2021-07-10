const functions = require("../functions.js")
const botconfig = require("../botconfig")

module.exports.run = async (bot, args) => {
    return new Promise(async (resolve, reject) => {
        const searchColumn = functions.GetSearchColumn(args.author_id)

        const MemberDetails = await functions.GetMemberDetails(bot.con, searchColumn, args.author_id)
        if (!MemberDetails) return resolve("Unable to find that member") //not in PIGS

        if (MemberDetails.pigs_total_vouchers < 6000) {
            var untilnext = 6000 - MemberDetails.pigs_total_vouchers
        } else if (MemberDetails.pigs_total_vouchers < 18000) {
            var untilnext = 18000 - MemberDetails.pigs_total_vouchers
        } else if (MemberDetails.pigs_total_vouchers < 38000) {
            var untilnext = 38000 - MemberDetails.pigs_total_vouchers
        } else if (MemberDetails.pigs_total_vouchers < 68000) {
            var untilnext = 68000 - MemberDetails.pigs_total_vouchers
        } else if (MemberDetails.pigs_total_vouchers < 150000) {
            var untilnext = 150000 - MemberDetails.pigs_total_vouchers
        } else if (MemberDetails.pigs_total_vouchers < 1500000) {
            var untilnext = 1500000 - MemberDetails.pigs_total_vouchers
        } else {
            return resolve("You are at the top rank")
        }

        //10,000 stolen money = 75 pigs vouchers
        const stolenMoney = (untilnext / 75) * 10000
        const endStolen = functions.numberWithCommas(Math.ceil(stolenMoney / 10000) * 10000)

        resolve(`To rank up you need ${functions.numberWithCommas(untilnext)} vouchers, that is ${endStolen} stolen money`)
    })

}



module.exports.help = {
    name: "nextrank",
    aliases: [],
    usage: "",
    description: "Get how much stolen money you need to rank up",
    args: [],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES],
    slash: true
}