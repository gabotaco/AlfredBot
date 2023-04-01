const functions = require("../util/functions.js");
const botconfig = require("../botconfig");
module.exports.run = async (bot, args) => {
  return new Promise(async (resolve, reject) => {
    const SearchColumn = functions.GetSearchColumn(args.author_id);

    bot.con.query(
      `SELECT warnings, discord_id FROM members WHERE ${SearchColumn} = '${args.author_id}'`,
      function (err, result, fields) {
        //get the warning number for the member
        if (err) {
          console.log(err);
          return reject("Unable to get warnings table.");
        }
        if (result.length == 0) return resolve("Not hired"); //not hired
        resolve(
          `<@${result[0].discord_id}> has ${result[0].warnings} warnings`
        ); //hired
      }
    );
  });
};

module.exports.help = {
  name: "warnlevel",
  aliases: ["wl"],
  usage: "",
  description: "Check how many warns you have",
  args: [],
  permission: [
    ...botconfig.OWNERS,
    ...botconfig.MANAGERS,
    ...botconfig.EMPLOYEES,
    ...botconfig.MEMBERS,
  ],
  slash: true,
};
