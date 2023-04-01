const functions = require("../util/functions.js");
const botconfig = require("../botconfig");

module.exports.run = async (bot, args) => {
  return new Promise(async (resolve, reject) => {
    let ID = args.id || args.member;

    const searchColumn = functions.GetSearchColumn(ID);

    const MemberDetails = await functions.GetMemberDetails(
      bot.con,
      searchColumn,
      ID
    );
    if (!MemberDetails) return resolve("Unable to find that member"); //not in PIGS

    if (MemberDetails.pigs_total_vouchers < 6000) {
      var untilnext = 6000 - MemberDetails.pigs_total_vouchers;
    } else if (MemberDetails.pigs_total_vouchers < 18000) {
      var untilnext = 18000 - MemberDetails.pigs_total_vouchers;
    } else if (MemberDetails.pigs_total_vouchers < 38000) {
      var untilnext = 38000 - MemberDetails.pigs_total_vouchers;
    } else if (MemberDetails.pigs_total_vouchers < 68000) {
      var untilnext = 68000 - MemberDetails.pigs_total_vouchers;
    } else if (MemberDetails.pigs_total_vouchers < 150000) {
      var untilnext = 150000 - MemberDetails.pigs_total_vouchers;
    } else if (MemberDetails.pigs_total_vouchers < 1500000) {
      var untilnext = 1500000 - MemberDetails.pigs_total_vouchers;
    } else {
      return resolve("You are at the top rank");
    }

    //10,000 stolen money = 75 pigs vouchers
    const stolenMoney = (untilnext / 75) * 10000;
    const endStolen = functions.numberWithCommas(
      Math.ceil(stolenMoney / 10000) * 10000
    );

    resolve(
      `To rank up <@${
        MemberDetails.discord_id
      }> needs ${functions.numberWithCommas(
        untilnext
      )} vouchers, that is ${endStolen} stolen money`
    );
  });
};

module.exports.help = {
  name: "nextrank-m",
  aliases: [],
  usage: "<person id>",
  description: "Get how much stolen money a member need to rank up",
  args: [
    {
      name: "id",
      description: "Get a persons next rank using their ID",
      type: 1,
      options: [
        {
          name: "id",
          description: "Their in game id or discord id",
          type: 4,
          required: true,
          parse: (bot, message, args) => {
            return args[0];
          },
        },
      ],
    },
    {
      name: "discord",
      description: "Get a persons next rank using their discord",
      type: 1,
      options: [
        {
          name: "member",
          description: "the other discord user",
          type: 6,
          required: true,
          missing: "Please specify another employee",
          parse: (bot, message, args) => {
            if (message.mentions.members.first())
              args[0] = message.mentions.members.first().id;
            return args[0];
          },
        },
      ],
    },
  ],
  permission: [...botconfig.OWNERS, ...botconfig.MANAGERS],
  slash: true,
};
