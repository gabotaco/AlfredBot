const Discord = require("discord.js")
const fs = require("fs")
const functions = require("../functions.js")
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const templateCache = [];
const HTMLPath = './rtsVouchers.html'
const botconfig = require('../botconfig')

module.exports.run = async (bot, args) => {
    return new Promise(async (resolve, reject) => {
        const SearchColumn = functions.GetSearchColumn(args.author_id)

        const MemberDetails = await functions.GetMemberDetails(bot.con, SearchColumn, args.author_id) //Get their member details
        if (!MemberDetails) return resolve("You aren't hired") //Not hired

        const InGameName = MemberDetails.in_game_name
        const InGameID = MemberDetails.in_game_id

        const TotalVouchers = functions.numberWithCommas(MemberDetails.rts_total_vouchers)

        if (MemberDetails.rts_total_vouchers < 9600) {
            var NextRank = "Lead Foot"
            var RankVouchers = 9600
            var CurrentVouchers = MemberDetails.rts_total_vouchers
            var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100)

            var Rank = "Initiate"
            var RequiredVouchers = 9600 - MemberDetails.rts_total_vouchers
        } else if (MemberDetails.rts_total_vouchers < 24000) {
            var NextRank = "Wheelman"
            var RankVouchers = 14400
            var CurrentVouchers = MemberDetails.rts_total_vouchers - 9600
            var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100)

            var Rank = "Lead Foot"
            var RequiredVouchers = 24000 - MemberDetails.rts_total_vouchers
        } else if (MemberDetails.rts_total_vouchers < 52800) {
            var NextRank = "Legendary Wheelman"
            var RankVouchers = 28800
            var CurrentVouchers = MemberDetails.rts_total_vouchers - 24000
            var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100)

            var Rank = "Wheelman"
            var RequiredVouchers = 52800 - MemberDetails.rts_total_vouchers
        } else if (MemberDetails.rts_total_vouchers < 117600) {
            var NextRank = "Speed Demon"
            var RankVouchers = 64800
            var CurrentVouchers = MemberDetails.rts_total_vouchers - 52800
            var Progress = Math.floor((CurrentVouchers / RankVouchers) * 100)

            var Rank = "Legendary Wheelman"
            var RequiredVouchers = 117600 - MemberDetails.rts_total_vouchers
        } else {
            var CurrentVouchers = MemberDetails.rts_total_vouchers - 117600
            var Progress = 100
            var RequiredVouchers = CurrentVouchers;
            var VoucherTextThing = "vouchers in Speed Demon"

            var Rank = "Speed Demon"
            var RequiredVouchers = "Max"
        }

        RequiredVouchers = functions.numberWithCommas(RequiredVouchers)

        if (MemberDetails.company == "fired") {
            var Deadline = "Non-Employee"
        } else {
            var Deadline = "Deadline: " + new Date(MemberDetails.deadline).toDateString()

        }


        bot.con.query(`SELECT * FROM members, rts WHERE members.id = rts.member_id`, async function (err, result, fields) {
            let CompanyRank
            if (err) {
                console.log(err)
                return reject("Unable to get members and company")
            }
            var Ranking = []
            result.forEach(member => {
                Ranking.push([member.vouchers, member.in_game_name])
            });
            Ranking.sort(sortFunction); //Sort it from highest to least
            function sortFunction(a, b) {
                if (a[0] == b[0]) {
                    return 0;
                } else {
                    return (a[0] > b[0]) ? -1 : 1;
                }
            }
            Ranking.forEach(element => { // Go through all ranks
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
                VoucherText: VoucherTextThing || "vouchers to next promotion",
                TotalVouchers: TotalVouchers
            }

            // render html file with data, for example - will replace {{name}} with name value
            const HTMLContent = HTMLTemplate(data);

            // browser object - render html with chromium
            const browser = await puppeteer.launch({
                args: ['--no-sandbox']
            });

            const page = await browser.newPage();

            // replace html
            await page.setContent(HTMLContent);

            // take a screenshot of div with id of "content"
            const inputElement = await page.$('#content');
            const image = await inputElement.screenshot();

            // send image reply to discord channel
            const localFileAttachment = new Discord.MessageAttachment(image)
            if (args.slash) {
                bot.guilds.cache.get(args.guild_id).channels.cache.get(args.channel_id).send(localFileAttachment);
                resolve("You should see your vouchers below :)")
            } else {
                resolve({message: "", messageOptions: localFileAttachment})
            }

            await browser.close();
        })

    })
}

module.exports.help = {
    name: "voucher",
    aliases: ["vouchers", "vouch", "rank", "progress"],
    usage: "",
    description: "Check your voucher status",
    args: [],
    permission: [...botconfig.OWNERS, ...botconfig.MANAGERS, ...botconfig.EMPLOYEES],
    slash: true,
    slow: false,
    hidden: true
}