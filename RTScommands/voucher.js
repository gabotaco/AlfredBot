const Discord = require("discord.js")
const fs = require("fs")
const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const functions = require("../functions.js")
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const templateCache = [];
const HTMLPath = './rtsVouchers.html'

module.exports.run = async (bot, message, args) => {
    if (!args[0]) args[0] = message.member.id

    const Response = functions.GetIDAndSearchColumn(message, args)
    const ID = Response[1]
    const SearchColumn = Response[0]

    async function getRank(auth) {
        let CompanyRank;

        const Ranking = await functions.GetRanks(auth, botconfig.RTSSheet, botconfig.RTSEntireSheetRange, botconfig.RTSEmployeeRangeTotalVouchersIndex, botconfig.RTSEmployeeRangeInGameNameIndex, message.channel) //Get RTS ranks

        const MemberDetails = await functions.GetMemberDetails(auth, botconfig.RTSSheet, botconfig.RTSEmployeeRange, SearchColumn, ID, message.channel) //Get member details
        if (!MemberDetails) return message.channel.send("You aren't hired")

        let VoucherPerson = message.guild.members.get(MemberDetails[botconfig.RTSEmployeeRangeDiscordIndex]) //get discord member
        if (VoucherPerson == message.member) { //if discord member is same as author
            VoucherPerson.setNickname(MemberDetails[botconfig.RTSEmployeeRangeInGameNameIndex]) //change nickname to in game name
        }

        const InGameName = MemberDetails[botconfig.RTSEmployeeRangeInGameNameIndex]
        const InGameID = MemberDetails[botconfig.RTSEmployeeRangeInGameIDIndex]
        const Rank = MemberDetails[botconfig.RTSEmployeeRangeRankIndex]

        var RequiredVouchers = functions.ConvertNumber(MemberDetails[botconfig.RTSEmployeeRangeUntilNextIndex])

        if (MemberDetails[botconfig.RTSEmployeeRangeRankIndex].toLowerCase() == "initiate") {
            var NextRank = "Lead Foot"
            var RankVouchers = 9600
            var CurrentVouchers = MemberDetails[botconfig.RTSEmployeeRangeInitiateVouchersIndex]
            var Progress = Math.floor((functions.ConvertNumber(CurrentVouchers) / RankVouchers) * 100)
        } else if (MemberDetails[botconfig.RTSEmployeeRangeRankIndex].toLowerCase() == "lead foot") {
            var NextRank = "Wheelman"
            var RankVouchers = 14400
            var CurrentVouchers = MemberDetails[botconfig.RTSEmployeeRangeLeadfootVouchersIndex]
            var Progress = Math.floor((functions.ConvertNumber(CurrentVouchers) / RankVouchers) * 100)
        } else if (MemberDetails[botconfig.RTSEmployeeRangeRankIndex].toLowerCase() == "wheelman") {
            var NextRank = "Legendary Wheelman"
            var RankVouchers = 28800
            var CurrentVouchers = MemberDetails[botconfig.RTSEmployeeRangeWheelmanVouchersIndex]
            var Progress = Math.floor((functions.ConvertNumber(CurrentVouchers) / RankVouchers) * 100)
        } else if (MemberDetails[botconfig.RTSEmployeeRangeRankIndex].toLowerCase() == "legendary") {
            var NextRank = "Speed Demon"
            var RankVouchers = 64800
            var CurrentVouchers = MemberDetails[botconfig.RTSEmployeeRangeLegendaryVouchersIndex]
            var Progress = Math.floor((functions.ConvertNumber(CurrentVouchers) / RankVouchers) * 100)
        } else if (MemberDetails[botconfig.RTSEmployeeRangeRankIndex].toLowerCase() == "speed demon") {
            var CurrentVouchers = MemberDetails[botconfig.RTSEmployeeRangeSpeeddemonVouchersIndex]
            var Progress = 100
            var RequiredVouchers = CurrentVouchers;
            var VoucherTextThing = "vouchers in Speed Demon"
        }

        const Deadline = MemberDetails[botconfig.RTSEmployeeRangeDeadlineIndex]


        Ranking.forEach(element => { //go through all ranks
            if (element[1] == InGameName && !CompanyRank) { //if its the same and they don't already have a rank
                CompanyRank = Ranking.indexOf(element) + 1 //set to index of it plus 1
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
        const browser = await puppeteer.launch({executablePath: './node_modules/chromium/lib/chromium/chrome-win/chrome.exe'});

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
        getRank(auth);
    });
}

module.exports.help = {
    name: "voucher",
    usage: "",
    description: "Say Hi",
    permission: "KICK_MEMBERS"
}