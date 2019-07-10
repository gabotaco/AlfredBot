const Discord = require("discord.js")
const fs = require("fs")
const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const templateCache = [];
const HTMLPath = './pigsVouchers.html'

module.exports.run = async (bot, message, args) => {
    if (!args[0]) args[0] = message.member.id //if no args then set the first arg to the message member id

    const Response = functions.GetIDAndSearchColumn(message, args)
    const ID = Response[1]
    const SearchColumn = Response[0]

    async function MakeVoucherCard(auth) {
        let CompanyRank;

        const Ranking = await functions.GetRanks(auth, botconfig.PIGSSheet, botconfig.PIGSEntireSheetRange, botconfig.PIGSEmployeeRangeTotalVouchersIndex, botconfig.PIGSEmployeeRangeInGameNameIndex, message.channel); //Get their rank

        const MemberDetails = await functions.GetMemberDetails(auth, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, SearchColumn, ID, message.channel) //Get their member details
        if (!MemberDetails) return message.channel.send("You aren't hired") //Not hired

        const VoucherPerson = message.guild.members.get(MemberDetails[botconfig.PIGSEmployeeRangeDiscordIndex]) //get discord member
        if (VoucherPerson == message.member) { //If they are the same person
            VoucherPerson.setNickname(MemberDetails[botconfig.PIGSEmployeeRangeInGameNameIndex]) //Set their nickname
        }

        const InGameName = MemberDetails[botconfig.PIGSEmployeeRangeInGameNameIndex]
        const InGameID = MemberDetails[botconfig.PIGSEmployeeRangeInGameIDIndex]
        const Rank = MemberDetails[botconfig.PIGSEmployeeRangeRankIndex]
        
        var RequiredVouchers = functions.ConvertNumber(MemberDetails[botconfig.PIGSEmployeeRangeUntilNextIndex])

        if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "hustler") {
            var NextRank = "Pickpocket"
            var RankVouchers = 6000
            var CurrentVouchers = MemberDetails[botconfig.PIGSEmployeeRangeHustlerVouchersIndex]

            var Progress = Math.floor((functions.ConvertNumber(CurrentVouchers) / RankVouchers) * 100)

        } else if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "pickpocket") {
            var NextRank = "Thief"
            var RankVouchers = 12000
            var CurrentVouchers = MemberDetails[botconfig.PIGSEmployeeRangePickPocketVouchersIndex]

            var Progress = Math.floor((functions.ConvertNumber(CurrentVouchers) / RankVouchers) * 100)

        } else if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "thief") {
            var NextRank = "Lawless"
            var RankVouchers = 20000
            var CurrentVouchers = MemberDetails[botconfig.PIGSEmployeeRangeThiefVouchersIndex]

            var Progress = Math.floor((functions.ConvertNumber(CurrentVouchers) / RankVouchers) * 100)

        } else if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "lawless") {
            var NextRank = "Criminal Mastermind"
            var RankVouchers = 30000
            var CurrentVouchers = MemberDetails[botconfig.PIGSEmployeeRangeLawlessVouchersIndex]

            var Progress = Math.floor((functions.ConvertNumber(CurrentVouchers) / RankVouchers) * 100)

        } else if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "mastermind") {
            var NextRank = "Overlord"
            var RankVouchers = 82000
            var CurrentVouchers = MemberDetails[botconfig.PIGSEmployeeRangeMastermindVouchersIndex]

            var Progress = Math.floor((functions.ConvertNumber(CurrentVouchers) / RankVouchers) * 100)

        } else if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "overlord") {
            var CurrentVouchers = MemberDetails[botconfig.PIGSEmployeeRangeOverlordVouchersIndex]
            var VoucherTextThing = "vouchers in Overlord"
            var RequiredVouchers = CurrentVouchers
            var Progress = 100

        }

        const Deadline = MemberDetails[botconfig.PIGSEmployeeRangeDeadlineIndex]
        
        Ranking.forEach(element => {// Go through all ranks
            if (element[1] == InGameName && !CompanyRank) { //If the member doesn't have a company rank yet and it finds their rank
                CompanyRank = Ranking.indexOf(element) + 1 //set their rank to the index of it plus 1
            }
        });

        let HTMLTemplate = templateCache[HTMLPath]; // try to load from memory cache

        // read html file from disk and save to memory cache
        if (!HTMLTemplate) {
            htmlSource = fs.readFileSync(HTMLPath, 'utf8'); // read html from source file
            templateCache[HTMLPath] = Handlebars.compile(htmlSource);
            HTMLTemplate = templateCache[HTMLPath];
        }

        const data = {
            name: InGameName,
            tycoonId: "#" + InGameID,
            vouchersLeft: RequiredVouchers,
            currentRank: Rank,
            nextRank: NextRank,
            progress: Progress,
            leaderboardsRank: CompanyRank,
            deadline: Deadline,
            VoucherText: VoucherTextThing || "vouchers to next promotion"
        }

        // render html file with data, for example - will replace {{name}} with name value
        const HTMLContent = HTMLTemplate(data);

        // browser object - render html with chromium
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // replace html
        await page.setContent(HTMLContent);

        // take a screenshot of div with id of "content"
        const inputElement = await page.$('#content');
        const image = await inputElement.screenshot();

        // send image reply to discord channel
        const localFileAttachment = new Discord.Attachment(image)
        message.channel.send(localFileAttachment)

        await browser.close();

        
    }
    authentication.authenticate().then((auth) => {
        MakeVoucherCard(auth);
    });
}

module.exports.help = {
    name: "vouchers",
    usage: "",
    description: "Check voucher status",
    permission: "SEND_MESSAGES"
}