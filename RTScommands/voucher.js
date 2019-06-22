const Discord = require("discord.js")
const PImage = require("pureimage")
const fs = require("fs")
const authentication = require("../authentication");
const botconfig = require("../botconfig.json");
const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"))
const functions = require("../functions.js")
function DrawBar(x1, y, x2, ctx) {
    ctx.beginPath();
    ctx.arc(x1, y, 40, 0, 2*Math.PI)
    ctx.fill()
    ctx.beginPath();
    ctx.arc(x2, y, 40, 0, 2*Math.PI)
    ctx.fill()
    ctx.fillRect(x1, y-40, x2-x1, 80)
}

module.exports.run = async (bot, message, args) => {
    if (!args[0]) args[0] = message.member.id

    const Response = functions.GetIDAndSearchColumn(message, args)
    const ID = Response[1]
    const SearchColumn = Response[0]

    async function getRank(auth) {
        var NextRank = "None"
        var WarnLevel = 0
        var RankVouchers = 117600
        let CompanyRank;

        const Ranking = await functions.GetRanks(auth, botconfig.RTSSheet, botconfig.RTSEntireSheetRange, botconfig.RTSEmployeeRangeTotalVouchersIndex, botconfig.RTSEmployeeRangeInGameNameIndex, message.channel) //Get RTS ranks
        
        const MemberDetails = await functions.GetMemberDetails(auth, botconfig.RTSSheet, botconfig.RTSEmployeeRange, SearchColumn, ID, message.channel) //Get member details
        if (!MemberDetails) return message.channel.send("You aren't hired")

        let VoucherPerson = message.guild.members.get(MemberDetails[botconfig.RTSEmployeeRangeDiscordIndex]) //get discord member
        if (VoucherPerson == message.member) { //if discord member is same as author
            VoucherPerson.setNickname(MemberDetails[botconfig.RTSEmployeeRangeInGameNameIndex]) //change nickname to in game name
        }
        if (VoucherPerson) { //if the person is in the discord
            var AvatarURL = VoucherPerson.user.avatarURL
            var HighestRole = VoucherPerson.highestRole.name
        }

        const InGameName = MemberDetails[botconfig.RTSEmployeeRangeInGameNameIndex]
        const InGameID = MemberDetails[botconfig.RTSEmployeeRangeInGameIDIndex]
        const Rank = MemberDetails[botconfig.RTSEmployeeRangeRankIndex]
        const TotalVouchers = functions.ConvertNumber(MemberDetails[botconfig.RTSEmployeeRangeTotalVouchersIndex])
        
        if (MemberDetails[botconfig.RTSEmployeeRangeRankIndex].toLowerCase() == "initiate") {
            var NextRank = "Lead Foot"
            var RankVouchers = 9600
        } else if (MemberDetails[botconfig.RTSEmployeeRangeRankIndex].toLowerCase() == "lead foot") {
            var NextRank = "Wheelman"
            var RankVouchers = 14400
        } else if (MemberDetails[botconfig.RTSEmployeeRangeRankIndex].toLowerCase() == "wheelman") {
            var NextRank = "Legendary Wheelman"
            var RankVouchers = 28800
        } else if (MemberDetails[botconfig.RTSEmployeeRangeRankIndex].toLowerCase() == "legendary") {
            var NextRank = "Speed Demon"
            var RankVouchers = 64800
        }

        const RequiredVouchers = functions.ConvertNumber(MemberDetails[botconfig.RTSEmployeeRangeUntilNextIndex])
        const Deadline = MemberDetails[botconfig.RTSEmployeeRangeDeadlineIndex]

        if (warns[MemberDetails[botconfig.RTSEmployeeRangeDiscordIndex]]) var WarnLevel = warns[MemberDetails[botconfig.RTSEmployeeRangeDiscordIndex]].warns //Get num of warns if they have at least one

        Ranking.forEach(element => { //go through all ranks
            if (element[1] == InGameName && !CompanyRank) { //if its the same and they don't already have a rank
                CompanyRank = Ranking.indexOf(element) + 1 //set to index of it plus 1
            }
        });
        
        const fnt = PImage.registerFont('./KronaOne-Regular.ttf', "Source Sans Pro")
        fnt.load(() => {
            const img1 = PImage.make(865, 292) //make image
            const ctx = img1.getContext('2d');

            ctx.fillStyle = "#d3d3d3" //text
            ctx.font = "30pt 'Source Sans Pro'"
            ctx.fillText(InGameName + " #" + InGameID, 30, 50)
            ctx.fillText("Deadline: " + Deadline, 30, 270)
            ctx.fillText(Rank, 30, 90)
            ctx.fillText("Rank: " + CompanyRank, 640,270)

            if (Rank.toLowerCase() == "speed demon") {
                ctx.fillText("Top Rank", 30, 230)
            } else {
                ctx.fillText(RequiredVouchers + " until " + NextRank, 30, 230)
            }

            //draw
            ctx.fillStyle = '#f1c232';
            DrawBar(65, 150, 800, ctx)
            //fill bar
            ctx.fillStyle = '#ff9900';
            if (Rank.toLowerCase() == "speed demon") {
                DrawBar(65, 150, 800, ctx) //full bar
            } else {
                const percentDone = 1 - (RequiredVouchers / RankVouchers)
                DrawBar(65, 150, 700 * percentDone + 100, ctx)
            }

            PImage.decodePNGFromStream(fs.createReadStream("./RTS_logo.png")).then((img) => { //get rts logo
                ctx.drawImage(img, 625, 5, 215, 100)
            })

            setTimeout(() => { //wait 500ms to decode png
                PImage.encodeJPEGToStream(img1, fs.createWriteStream('out.jpg')).then(() => { //make out.jpg
                    message.channel.send({ //send the voucher
                        files: [{
                            attachment: './out.jpg',
                            name: "rank.png"
                        }]
                    })
                }).catch((e) => { //if theres an error
                    let voucherEmbed = new Discord.RichEmbed() //make embed
                    voucherEmbed.setColor("ORANGE")
                    voucherEmbed.setFooter("Bot created by Gabo#1234", "https://cdn.discordapp.com/avatars/330000865215643658/a_126395b4ba3956e1a74559d693ce0be8.gif")
                    voucherEmbed.setTitle("__*Voucher Information*__")
                    voucherEmbed.setThumbnail(AvatarURL)
                    voucherEmbed.addField("__***In Game Name***__", ingamename)
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
        getRank(auth);
    });


}

module.exports.help = {
    name: "voucher",
    usage: "",
    description: "Say Hi",
    permission: "KICK_MEMBERS"
}