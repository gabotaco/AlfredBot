const botconfig = require("../botconfig.json");
const authentication = require("../authentication"); //Imports functions from authentication file
const functions = require("../functions.js")

module.exports.run = async (bot, message, args) => {
    if (!args[0]) args[0] = message.member.id //No args then set first arg to message author id

    const Response = functions.GetIDAndSearchColumn(message, args)
    const searchColumn = Response[0]
    const id = Response[1]

    async function getRank(auth) {
        const MemberDetails = await functions.GetMemberDetails(auth, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, searchColumn, id, message.channel) //get member
        if (!MemberDetails) return message.channel.send("Unable to find that member") //not in PIGS

        const untilnext = functions.ConvertNumber(MemberDetails[botconfig.PIGSEmployeeRangeUntilNextIndex]) //Get their until next
        
        //10,000 stolen money = 75 pigs vouchers
        const stolenMoney = (untilnext / 75) * 10000
        const endStolen = Math.ceil(stolenMoney / 10000) * 10000
        const goodMessage = (endStolen).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') //converts 10000000 to 10,000,000.00
        const bestMessage = goodMessage.replace(/\.00$/, ''); //converts 10,000,000.00 to 10,000,000
        message.channel.send(`To rank up you need ${MemberDetails[botconfig.PIGSEmployeeRangeUntilNextIndex]} vouchers, that is ${bestMessage} stolen money`)
    }
    authentication.authenticate().then((auth) => {
        getRank(auth);
    });

}

module.exports.help = {
    name: "nextrank",
    usage: "{person id}",
    description: "Get how much stolen money you need to rank up",
    permission: "SEND_MESSAGES"
}