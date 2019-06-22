const Discord = require("discord.js")
const PImage = require("pureimage")
const fs = require("fs")
const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"))
const functions = require("../functions.js")

function DrawBar(x1, y, x2, ctx) { //Dar the bar
    ctx.beginPath();
    ctx.arc(x1, y, 40, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath();
    ctx.arc(x2, y, 40, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillRect(x1, y - 40, x2 - x1, 80)
}
const fnt = PImage.registerFont('./KronaOne-Regular.ttf', "Source Sans Pro")

module.exports.run = async (bot, message, args) => {
    if (!args[0]) args[0] = message.member.id //if no args then set the first arg to the message member id

    const Response = functions.GetIDAndSearchColumn(message, args)
    const ID = Response[1]
    const SearchColumn = Response[0]

    async function MakeVoucherCard(auth) {
        var NextRank = "None"
        var WarnLevel = 0
        var RankVouchers = 150000
        let CompanyRank;

        const Ranking = await functions.GetRanks(auth, botconfig.PIGSSheet, botconfig.PIGSEntireSheetRange, botconfig.PIGSEmployeeRangeTotalVouchersIndex, botconfig.PIGSEmployeeRangeInGameNameIndex, message.channel); //Get their rank

        const MemberDetails = await functions.GetMemberDetails(auth, botconfig.PIGSSheet, botconfig.PIGSEmployeeRange, SearchColumn, ID, message.channel) //Get their member details
        if (!MemberDetails) return message.channel.send("You aren't hired") //Not hired

        const VoucherPerson = message.guild.members.get(MemberDetails[botconfig.PIGSEmployeeRangeDiscordIndex]) //get discord member
        if (VoucherPerson == message.member) { //If they are the same person
            VoucherPerson.setNickname(MemberDetails[botconfig.PIGSEmployeeRangeInGameNameIndex]) //Set their nickname
        }

        if (VoucherPerson) { //If its a valid discord member
            var AvatarURL = VoucherPerson.user.avatarURL
            var HighestRole = VoucherPerson.highestRole.name
        }

        const InGameName = MemberDetails[botconfig.PIGSEmployeeRangeInGameNameIndex]
        const InGameID = MemberDetails[botconfig.PIGSEmployeeRangeInGameIDIndex]
        const Rank = MemberDetails[botconfig.PIGSEmployeeRangeRankIndex]
        const TotalVouchers = functions.ConvertNumber(MemberDetails[botconfig.PIGSEmployeeRangeTotalVouchersIndex])
        
        if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "hustler") {
            var NextRank = "Pickpocket"
            var RankVouchers = 6000
        } else if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "pickpocket") {
            var NextRank = "Thief"
            var RankVouchers = 12000
        } else if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "thief") {
            var NextRank = "Lawless"
            var RankVouchers = 20000
        } else if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "lawless") {
            var NextRank = "Criminal Mastermind"
            var RankVouchers = 30000
        } else if (MemberDetails[botconfig.PIGSEmployeeRangeRankIndex].toLowerCase() == "mastermind") {
            var NextRank = "Overlord"
            var RankVouchers = 82000
        }

        const RequiredVouchers = functions.ConvertNumber(MemberDetails[botconfig.PIGSEmployeeRangeUntilNextIndex])
        const Deadline = MemberDetails[botconfig.PIGSEmployeeRangeDeadlineIndex]
        
        if (warns[MemberDetails[botconfig.PIGSEmployeeRangeDiscordIndex]]) var WarnLevel = warns[MemberDetails[botconfig.PIGSEmployeeRangeDiscordIndex]].warns //if they have at least 1 warning then set their ammount ot the variable

        Ranking.forEach(element => {// Go through all ranks
            if (element[1] == InGameName && !CompanyRank) { //If the member doesn't have a company rank yet and it finds their rank
                CompanyRank = Ranking.indexOf(element) + 1 //set their rank to the index of it plus 1
            }
        });

        fnt.load(() => {
            const img1 = PImage.make(865, 292) //make canvas
            const ctx = img1.getContext('2d');

            ctx.fillStyle = "#d3d3d3" //Set fill style and font
            ctx.font = "30pt 'Source Sans Pro'"

            ctx.fillText(InGameName + " #" + InGameID, 20, 50) //Add info
            ctx.fillText("Deadline: " + Deadline, 20, 270)
            ctx.fillText(Rank, 20, 90)
            ctx.fillText("Rank: " + CompanyRank, 640, 270)

            if (Rank.toLowerCase() == "overlord") {
                ctx.fillText("Top Rank", 20, 230)
            } else {
                ctx.fillText(RequiredVouchers + " until " + NextRank, 20, 230)
            }

            //draw
            ctx.fillStyle = '#edb8ff';
            DrawBar(65, 150, 800, ctx)
            //fill bar
            ctx.fillStyle = '#ff6bfa';
            if (Rank.toLowerCase() == "overlord") {
                DrawBar(65, 150, 800, ctx) //Full bar
            } else {
                const percentDone = 1 - (RequiredVouchers / RankVouchers) //Get percentage
                DrawBar(65, 150, 700 * percentDone + 100, ctx)
            }

            PImage.decodePNGFromStream(fs.createReadStream("./PIGSlogo2.png")).then((img) => { //get pigs logo
                ctx.drawImage(img, 725, 5, 100, 100)
            })

            setTimeout(() => { //wait 500 ms to decode png
                PImage.encodeJPEGToStream(img1, fs.createWriteStream('out.jpg')).then(() => { //make out.jpg
                    message.channel.send({ //send the pic
                        files: [{
                            attachment: './out.jpg',
                            name: "rank.png"
                        }]
                    })
                }).catch((e) => { //fails to make image
                    let voucherEmbed = new Discord.RichEmbed() //make discord embed
                    voucherEmbed.setColor("ORANGE")
                    voucherEmbed.setFooter("Bot created by Gabo#1234", "https://cdn.discordapp.com/avatars/330000865215643658/a_126395b4ba3956e1a74559d693ce0be8.gif")
                    voucherEmbed.setTitle("__*Voucher Information*__")
                    voucherEmbed.setThumbnail(AvatarURL)
                    voucherEmbed.addField("__***In Game Name***__", InGameName)
                    voucherEmbed.addField("__***In Game ID***__", InGameID)
                    voucherEmbed.addField("__***Rank***__", Rank)
                    voucherEmbed.addField("__***Discord Rank***__", HighestRole)
                    voucherEmbed.addField("__***Total Vouchers***__", TotalVouchers)
                    voucherEmbed.addField("__***Next Rank***__", NextRank)
                    voucherEmbed.addField("__***Vouchers Needed For Next Rank***__", RequiredVouchers)
                    voucherEmbed.addField("__***Voucher Deadline***__", Deadline)
                    voucherEmbed.addField("__***Warns***__", WarnLevel)
                    message.channel.send(voucherEmbed)
                });
            }, 500);

        })
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